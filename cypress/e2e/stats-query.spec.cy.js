import { stats } from "../fixtures/graphql-queries/stats";
const Ajv = require("ajv");

describe("GraphQL API validation - Stats", () => {
  before(() => {
    cy.resolveToken();
  });

  beforeEach(() => {
    // Restoring the snapshot of the browser's local storage before every test
    cy.restoreLocalStorage("token");
    cy.getLocalStorage("api_token").as("userToken");
    cy.fixture("json-schemas/stats-response").as("statsResponseSchema");
  });

  afterEach(() => {
    // Saving a snapshot of the current state of the browser's local storage
    cy.saveLocalStorage("api_token");
  });

  it("Validate the response of the query Stats with @aws_oidc auth", function () {
    // Retrieve a event ID
    const events = `
    query events {
      events {
        event_id
      }
    }`;

    // Get the first ID from the Market ID list
    cy.requestGraphQLQuery("aws_oidc", this.userToken, events).then(
      (response) => {
        // Test case parameters
        const queryVariables = {
          event_id: response.body.data.events[0].event_id,
        };

        cy.requestGraphQLQuery(
          "aws_oidc",
          this.userToken,
          stats,
          queryVariables
        ).then((response) => {
          // Print Response values
          cy.log(response.body.data);

          // response status validation
          expect(response.status).to.be.eq(200);

          // Header validations
          cy.validateBasicHeaders(response);

          // Response validations
          // body
          expect(response.body).to.have.property("data");
          // data
          expect(response.body.data).to.have.property("stats");
          // orderbook
          expect(response.body.data.stats).to.have.property("event_id");
          expect(response.body.data.stats).to.have.property("updated");

          // Response schema validation
          const ajv = new Ajv({ allErrors: true });
          expect(ajv.validate(this.statsResponseSchema, response.body)).to.be
            .true;
        });
      }
    );
  });

  it("Validate the response of the query Stats with @aws_api_key auth", function () {
    // Retrieve a event ID
    const events = `
    query events {
      events {
        event_id
      }
    }`;

    // Get the first ID from the Market ID list
    cy.requestGraphQLQuery("aws_oidc", this.userToken, events).then(
      (response) => {
        // Test case parameters
        const queryVariables = {
          event_id: response.body.data.events[0].event_id,
        };

        cy.requestGraphQLQuery(
          "aws_api_key",
          Cypress.env("api_key"),
          stats,
          queryVariables
        ).then((response) => {
          // Print Response values
          cy.log(response.body.data);

          // response status validation
          expect(response.status).to.be.eq(200);

          // Header validations
          cy.validateBasicHeaders(response);

          // Response validations
          // body
          expect(response.body).to.have.property("data");
          // data
          expect(response.body.data).to.have.property("stats");
          // orderbook
          expect(response.body.data.stats).to.have.property("event_id");
          expect(response.body.data.stats).to.have.property("updated");

          // Response schema validation
          const ajv = new Ajv({ allErrors: true });
          expect(ajv.validate(this.statsResponseSchema, response.body)).to.be
            .true;
        });
      }
    );
  });
});
