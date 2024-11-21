import { eventGroups } from "../fixtures/graphql-queries/eventGroups";
const Ajv = require("ajv");

describe("GraphQL API validation - EventGroups", () => {
  before(() => {
    cy.resolveToken();
  });

  beforeEach(() => {
    // Restoring the snapshot of the browser's local storage before every test
    cy.restoreLocalStorage("token");
    cy.getLocalStorage("api_token").as("userToken");
    cy.fixture("json-schemas/event-groups-response").as(
      "eventGroupsResponseSchema"
    );
  });

  afterEach(() => {
    // Saving a snapshot of the current state of the browser's local storage
    cy.saveLocalStorage("api_token");
  });

  it("Validate the response of the query EventGroups with @aws_oidc auth", function () {
    cy.requestGraphQLQuery("aws_oidc", this.userToken, eventGroups).then(
      (response) => {
        // response status validation
        expect(response.status).to.be.eq(200);

        // Header validations
        cy.validateBasicHeaders(response);

        // Response validations
        // body
        expect(response.body).to.have.property("data");
        // data
        expect(response.body.data).to.have.property("eventGroups");
        // eventGroups
        if (response.body.data.eventGroups.length > 0) {
          response.body.data.eventGroups.every((eventGroup) => {
            expect(eventGroup).to.have.property("name") &&
              expect(eventGroup).to.have.property("event_group_id");
          });
        } else {
          cy.log("ATTENTION: There are no EventGroups to show for this user");
        }

        // Response schema validation
        const ajv = new Ajv({ allErrors: true });
        expect(ajv.validate(this.eventGroupsResponseSchema, response.body)).to
          .be.true;
      }
    );
  });

  it("Validate the response of the query EventGroups with @aws_api_key auth", function () {
    cy.requestGraphQLQuery(
      "aws_api_key",
      Cypress.env("api_key"),
      eventGroups
    ).then((response) => {
      // response status validation
      expect(response.status).to.be.eq(200);

      // Header validations
      cy.validateBasicHeaders(response);

      // Response validations
      // body
      expect(response.body).to.have.property("data");
      // data
      expect(response.body.data).to.have.property("eventGroups");
      // eventGroups
      if (response.body.data.eventGroups.length > 0) {
        response.body.data.eventGroups.every((eventGroup) => {
          expect(eventGroup).to.have.property("name") &&
            expect(eventGroup).to.have.property("event_group_id");
        });
      } else {
        cy.log("ATTENTION: There are no EventGroups to show for this user");
      }

      // Response schema validation
      const ajv = new Ajv({ allErrors: true });
      expect(ajv.validate(this.eventGroupsResponseSchema, response.body)).to.be
        .true;
    });
  });
});
