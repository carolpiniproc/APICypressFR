var AWS = require("aws-sdk/global");

// Method to retrieve a token to use with the GraphQL API
Cypress.Commands.add("getUserApiToken", () => {
  cy.request({
    url: Cypress.env("token_url"),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      client_id: Cypress.env("client_id"),
      client_secret: Cypress.env("client_secret"),
      audience: "staging",
      grant_type: "client_credentials",
    },
  }).then((response) => response.body.access_token);
});

// Method to perform GraphQL queries with @aws_oidc or @aws_api_key auth
Cypress.Commands.add(
  "requestGraphQLQuery",
  (auth_method, auth_value, operationName, queryVariables = undefined) => {
    let body;
    let headers;

    // Check which auth method are we using to define the header
    if (auth_method == "aws_oidc") {
      headers = {
        "Content-Type": "application/json",
        authorization: auth_value,
      };
    } else if (auth_method == "aws_api_key") {
      headers = { "Content-Type": "application/json", "x-api-key": auth_value };
    }

    // Check if the query has parameters
    if (queryVariables == undefined) {
      body = { query: operationName };
    } else {
      body = { query: operationName, variables: queryVariables };
    }

    // Perform the request with the specified values
    cy.request({
      url: Cypress.env("api_url"),
      method: "POST",
      headers: headers,
      body: body,
    });
  }
);

// Validate response headers from requests using @aws_oidc or @aws_api_key
Cypress.Commands.add("validateBasicHeaders", (response) => {
  expect(response.headers["content-type"]).to.be.eq(
    "application/json;charset=UTF-8"
  );

  // Basic set of headers to be validated
  expect(response.headers).to.have.property("date");
  expect(response.headers).to.have.property("x-amzn-requestid");
  expect(response.headers).to.have.property("x-amzn-appsync-tokensconsumed");
  expect(response.headers).to.have.property("x-cache");
  expect(response.headers).to.have.property("x-amz-cf-pop");
  expect(response.headers).to.have.property("x-amz-cf-id");
});

// Method to reuse the same token when running locally
// -- This method will be removed in favor of gitlab token reusage --
Cypress.Commands.add("resolveToken", (response) => {
  // Clearing the snapshot storage
  cy.clearLocalStorageSnapshot();

  // Restoring an already generated snapshot of browser's local storage
  cy.restoreLocalStorage("token");

  // Checking if this is the first time we are generating the token
  cy.getLocalStorage("api_token").then((storage) => {
    // If the local storage is empty we generate the token that will be used during the entire execution
    if (storage === null) {
      cy.log("This is the first time we set the token");
      cy.getUserApiToken().then((token) => {
        // Saving the value of the token in the browser's local storage
        cy.setLocalStorage("api_token", token);

        // Saving a snapshot of the current state of the browser's local storage
        cy.saveLocalStorage("token");
      });
    }
    // If the local storage already has a token, we use that one
    else cy.log("Reusing an already generated token");
  });
});

// Method to perform GraphQL queries using @aws_iam auth
Cypress.Commands.add(
  "requestGraphQLQueryWithSignature",
  async (operationName, variables) => {
    const AWS_REGION = "us-east-1";
    const uri = new URL(Cypress.env("api_url"));
    const httpRequest = new AWS.HttpRequest(uri.href, AWS_REGION);

    // Fill the httpRequest object with appropriate values
    httpRequest.headers.host = uri.host;
    httpRequest.headers["Content-Type"] = "application/json";
    httpRequest.method = "POST";
    httpRequest.body = JSON.stringify({
      query: operationName,
      variables: variables,
    });

    // Update AWS config object with @aws_iam auth values
    if (Cypress.env("ci") === true) {
      AWS.config.update({
        region: AWS_REGION,
        credentials: new AWS.Credentials(
          Cypress.env("awsAccessKeyId"),
          Cypress.env("awsSecretAccessKey")
        ),
      });
    } else {
      AWS.config.update({
        region: AWS_REGION,
        credentials: new AWS.Credentials(
          Cypress.env("awsAccessKeyId"),
          Cypress.env("awsSecretAccessKey"),
          Cypress.env("sessionToken")
        ),
      });
    }

    // Sign the request using the defined credentials
    AWS.config.credentials.get(() => {
      const signer = new AWS.Signers.V4(httpRequest, "appsync", true);
      signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
    });

    // Create an options object to group all needed values to perform the query
    const options = {
      method: httpRequest.method,
      body: httpRequest.body,
      headers: httpRequest.headers,
    };

    // Perform the GraphQL query with fecth library
    const response = await fetch(uri.href, options);

    // Response status validation
    expect(response.status).to.be.eq(200);

    // Response headers validation
    response.headers.forEach(console.log);
    expect(response.headers.get("content-type")).to.exist;
    expect(response.headers.get("date")).to.exist;
    expect(response.headers.get("x-amzn-requestid")).to.exist;

    // Return a json version of the response
    return response.ok ? response.json() : console.log("Error");
  }
);
