import { marketGroups } from "../fixtures/graphql-queries/marketGroups";
import { eventGroups } from "../fixtures/graphql-queries/eventGroups";
const Ajv = require("ajv");

describe("GraphQL API validation - Market Groups", () => {
  before(() => {
    cy.resolveToken();
  });

  beforeEach(() => {
    // Restoring the snapshot of the browser's local storage before every test
    cy.restoreLocalStorage("token");
    cy.getLocalStorage("api_token").as("userToken");
    cy.fixture("json-schemas/market-groups-response").as(
      "marketGroupsResponseSchema"
    );
  });

  afterEach(() => {
    // Saving a snapshot of the current state of the browser's local storage
    cy.saveLocalStorage("api_token");
  });

  it("Validate the response of the query Market Groups with @aws_oidc auth", function () {
    // Get the first ID from the EventGroup ID list
    cy.requestGraphQLQuery("aws_oidc", this.userToken, eventGroups).then(
      (response) => {
        // Test case parameters
        const queryVariables = {
          event_group_id: response.body.data.eventGroups[0].event_group_id,
        };

        cy.requestGraphQLQuery(
          "aws_oidc",
          this.userToken,
          marketGroups,
          queryVariables
        ).then((response) => {
          // response status validation
          expect(response.status).to.be.eq(200);

          // Header validations
          cy.validateBasicHeaders(response);

          // Response validations
          // body
          expect(response.body).to.have.property("data");
          // data
          expect(response.body.data).to.have.property("marketGroups");

          // Checking Sells list
          if (response.body.data.marketGroups.length > 0) {
            // We don't have yet data to compare here
          } else {
            cy.log(
              "ATTENTION: There are no Market groups to show for that Event Group ID"
            );
          }

          // Response schema validation
          const ajv = new Ajv({ allErrors: true });
          expect(ajv.validate(this.marketGroupsResponseSchema, response.body))
            .to.be.true;
        });
      }
    );
  });

  it("Validate the response of the query Market Groups with @aws_api_key auth", function () {
    // Get the first ID from the EventGroup ID list
    cy.requestGraphQLQuery("aws_oidc", this.userToken, eventGroups).then(
      (response) => {
        // Test case parameters
        const queryVariables = {
          event_group_id: response.body.data.eventGroups[0].event_group_id,
        };

        cy.requestGraphQLQuery(
          "aws_api_key",
          Cypress.env("api_key"),
          marketGroups,
          queryVariables
        ).then((response) => {
          // response status validation
          expect(response.status).to.be.eq(200);

          // Header validations
          cy.validateBasicHeaders(response);

          // Response validations
          // body
          expect(response.body).to.have.property("data");
          // data
          expect(response.body.data).to.have.property("marketGroups");

          // Checking Sells list
          if (response.body.data.marketGroups.length > 0) {
            // We don't have yet data to compare here
          } else {
            cy.log(
              "ATTENTION: There are no Market groups to show for that Event Group ID"
            );
          }

          // Response schema validation
          const ajv = new Ajv({ allErrors: true });
          expect(ajv.validate(this.marketGroupsResponseSchema, response.body))
            .to.be.true;
        });
      }
    );
  });
});
