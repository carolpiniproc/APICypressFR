import { events } from "../fixtures/graphql-queries/events";
const Ajv = require("ajv");

describe("GraphQL API validation - Events", () => {
  before(() => {
    cy.resolveToken();
  });

  beforeEach(() => {
    // Restoring the snapshot of the browser's local storage before every test
    cy.restoreLocalStorage("token");
    cy.getLocalStorage("api_token").as("userToken");
    cy.fixture("json-schemas/events-response").as("eventsResponseSchema");
  });

  afterEach(() => {
    // Saving a snapshot of the current state of the browser's local storage
    cy.saveLocalStorage("api_token");
  });

  it("Validate the response of the query Events with @aws_oidc auth", function () {
    cy.requestGraphQLQuery("aws_oidc", this.userToken, events).then(
      (response) => {
        // response status validation
        expect(response.status).to.be.eq(200);

        // Header validations
        cy.validateBasicHeaders(response);

        // Response validations
        // body
        expect(response.body).to.have.property("data");
        // data
        expect(response.body.data).to.have.property("events");
        // events
        if (response.body.data.events.length > 0) {
          response.body.data.events.every((event) => {
            expect(event).to.have.property("event_group_id") &&
              expect(event).to.have.property("name") &&
              expect(event).to.have.property("sports_data_io_game_id") &&
              expect(event).to.have.property("start_time") &&
              expect(event).to.have.property("league") &&
              expect(event.league).to.have.property("name") &&
              expect(event.league).to.have.property("league_id") &&
              expect(event).to.have.property("event_id");
          });
        } else {
          cy.log("ATTENTION: There are no Events to show for this user");
        }

        // Response schema validation
        const ajv = new Ajv({ allErrors: true });
        expect(ajv.validate(this.eventsResponseSchema, response.body)).to.be
          .true;
      }
    );
  });

  it("Validate the response of the query Events with @aws_api_key auth", function () {
    cy.requestGraphQLQuery("aws_api_key", Cypress.env("api_key"), events).then(
      (response) => {
        // response status validation
        expect(response.status).to.be.eq(200);

        // Header validations
        cy.validateBasicHeaders(response);

        // Response validations
        // body
        expect(response.body).to.have.property("data");
        // data
        expect(response.body.data).to.have.property("events");
        // events
        if (response.body.data.events.length > 0) {
          response.body.data.events.every((event) => {
            expect(event).to.have.property("event_group_id") &&
              expect(event).to.have.property("name") &&
              expect(event).to.have.property("sports_data_io_game_id") &&
              expect(event).to.have.property("start_time") &&
              expect(event).to.have.property("league") &&
              expect(event.league).to.have.property("name") &&
              expect(event.league).to.have.property("league_id") &&
              expect(event).to.have.property("event_id");
          });
        } else {
          cy.log("ATTENTION: There are no Events to show for this user");
        }

        // Response schema validation
        const ajv = new Ajv({ allErrors: true });
        expect(ajv.validate(this.eventsResponseSchema, response.body)).to.be
          .true;
      }
    );
  });
});
