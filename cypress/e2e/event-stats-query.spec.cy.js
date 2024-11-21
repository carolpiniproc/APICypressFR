import { eventStats } from "../fixtures/graphql-queries/event-stats";
const Ajv = require("ajv");

describe("GraphQL API validation - Event Stats", () => {
  before(() => {
    cy.resolveToken();
  });

  beforeEach(() => {
    // Restoring the snapshot of the browser's local storage before every test
    cy.restoreLocalStorage("token");
    cy.getLocalStorage("api_token").as("userToken");
    cy.fixture("json-schemas/event-stats-response").as(
      "eventStatsResponseSchema"
    );
  });

  afterEach(() => {
    // Saving a snapshot of the current state of the browser's local storage
    cy.saveLocalStorage("api_token");
  });

  it("Validate the response of the query Event Stats with @aws_oidc auth", function () {
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
        //  Test case parameters
        const queryVariables = {
          event_id:
            response.body.data.events[response.body.data.events.length - 1]
              .event_id,
        };

        cy.requestGraphQLQuery(
          "aws_oidc",
          this.userToken,
          eventStats,
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
          expect(response.body.data).to.have.property("eventStats");
          // eventStats
          expect(response.body.data.eventStats).to.have.property("event_id");
          expect(response.body.data.eventStats).to.have.property("sport_enum");
          expect(response.body.data.eventStats).to.have.property("stats");
          expect(response.body.data.eventStats.stats).to.have.property(
            "home_score"
          );
          expect(response.body.data.eventStats.stats).to.have.property(
            "away_score"
          );
          expect(response.body.data.eventStats).to.have.property("updated");

          // cy.log(JSON.stringify(response.body));
          // Response schema validation
          const ajv = new Ajv({ allErrors: true });
          expect(ajv.validate(this.eventStatsResponseSchema, response.body)).to
            .be.true;
        });
      }
    );
  });

  it("Validate the response of the query Event Stats with @aws_api_key auth", function () {
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
        //  Test case parameters
        const queryVariables = {
          event_id:
            response.body.data.events[response.body.data.events.length - 1]
              .event_id,
        };

        cy.requestGraphQLQuery(
          "aws_api_key",
          Cypress.env("api_key"),
          eventStats,
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
          expect(response.body.data).to.have.property("eventStats");
          // eventStats
          expect(response.body.data.eventStats).to.have.property("event_id");
          expect(response.body.data.eventStats).to.have.property("sport_enum");
          expect(response.body.data.eventStats).to.have.property("stats");
          expect(response.body.data.eventStats.stats).to.have.property(
            "home_score"
          );
          expect(response.body.data.eventStats.stats).to.have.property(
            "away_score"
          );
          expect(response.body.data.eventStats).to.have.property("updated");

          // cy.log(JSON.stringify(response.body));
          // Response schema validation
          const ajv = new Ajv({ allErrors: true });
          expect(ajv.validate(this.eventStatsResponseSchema, response.body)).to
            .be.true;
        });
      }
    );
  });
});
