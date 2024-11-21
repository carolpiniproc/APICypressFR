import { allowlist } from "../fixtures/graphql-queries/allowlist";
const Ajv = require("ajv");

describe("GraphQL API validation - Is In Allow List", () => {
  before(() => {
    cy.resolveToken();
  });

  beforeEach(() => {
    // Restoring the snapshot of the browser's local storage before every test
    cy.restoreLocalStorage("token");
    cy.getLocalStorage("api_token").as("userToken");
    cy.fixture("json-schemas/is-in-allow-list-response").as(
      "isInAllowListResponseSchema"
    );
  });

  afterEach(() => {
    // Saving a snapshot of the current state of the browser's local storage
    cy.saveLocalStorage("api_token");
  });

  it("Validate the response of the query Is In Allow List with @aws_oidc auth", function () {
    // Test case parameters
    const queryVariables = {
      email: Cypress.env("email"),
    };

    cy.requestGraphQLQuery(
      "aws_oidc",
      this.userToken,
      allowlist,
      queryVariables
    ).then((response) => {
      // response status validation
      expect(response.status).to.be.eq(200);

      // // Header validations
      cy.validateBasicHeaders(response);

      // Response validations
      // body
      expect(response.body).to.have.property("data");
      // data
      expect(response.body.data).to.have.property("isInAllowlist");

      // Response schema validation
      const ajv = new Ajv({ allErrors: true });
      expect(ajv.validate(this.isInAllowListResponseSchema, response.body)).to
        .be.true;
    });
  });

  it("Validate the response of the query Is In Allow List with @aws_api_key auth", function () {
    // Test case parameters
    const queryVariables = {
      email: Cypress.env("email"),
    };

    cy.requestGraphQLQuery(
      "aws_api_key",
      Cypress.env("api_key"),
      allowlist,
      queryVariables
    ).then((response) => {
      // response status validation
      expect(response.status).to.be.eq(200);

      // // Header validations
      cy.validateBasicHeaders(response);

      // Response validations
      // body
      expect(response.body).to.have.property("data");
      // data
      expect(response.body.data).to.have.property("isInAllowlist");

      // Response schema validation
      const ajv = new Ajv({ allErrors: true });
      expect(ajv.validate(this.isInAllowListResponseSchema, response.body)).to
        .be.true;
    });
  });
});
