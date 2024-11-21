import { entities } from "../fixtures/graphql-queries/entities";
const Ajv = require("ajv");

describe("GraphQL API validation - Entities", () => {
  before(() => {
    cy.resolveToken();
  });

  beforeEach(() => {
    // Restoring the snapshot of the browser's local storage before every test
    cy.restoreLocalStorage("token");
    cy.getLocalStorage("api_token").as("userToken");
    cy.fixture("json-schemas/entities-response").as("entitiesResponseSchema");
  });

  afterEach(() => {
    // Saving a snapshot of the current state of the browser's local storage
    cy.saveLocalStorage("api_token");
  });

  it("Validate the response of the query Entities with @aws_oidc auth", function () {
    cy.requestGraphQLQuery("aws_oidc", this.userToken, entities).then(
      (response) => {
        // response status validation
        expect(response.status).to.be.eq(200);

        // // Header validations
        cy.validateBasicHeaders(response);

        // Response validations
        // body
        expect(response.body).to.have.property("data");
        // data
        expect(response.body.data).to.have.property("entities");
        // entities
        if (response.body.data.entities.length > 0) {
          response.body.data.entities.every((entity) => {
            expect(entity).to.have.property("name") &&
              expect(entity).to.have.property("division") &&
              expect(entity).to.have.property("abbreviation") &&
              expect(entity).to.have.property("league_id");
          });
        } else {
          cy.log("ATTENTION: There are no Entities to show for this user");
        }

        // Response schema validation
        const ajv = new Ajv({ allErrors: true });
        expect(ajv.validate(this.entitiesResponseSchema, response.body)).to.be
          .true;
      }
    );
  });

  it("Validate the response of the query Entities with @aws_api_key auth", function () {
    cy.requestGraphQLQuery(
      "aws_api_key",
      Cypress.env("api_key"),
      entities
    ).then((response) => {
      // response status validation
      expect(response.status).to.be.eq(200);

      // // Header validations
      cy.validateBasicHeaders(response);

      // Response validations
      // body
      expect(response.body).to.have.property("data");
      // data
      expect(response.body.data).to.have.property("entities");
      // entities
      if (response.body.data.entities.length > 0) {
        response.body.data.entities.every((entity) => {
          expect(entity).to.have.property("name") &&
            expect(entity).to.have.property("division") &&
            expect(entity).to.have.property("abbreviation") &&
            expect(entity).to.have.property("league_id");
        });
      } else {
        cy.log("ATTENTION: There are no Entities to show for this user");
      }

      // Response schema validation
      const ajv = new Ajv({ allErrors: true });
      expect(ajv.validate(this.entitiesResponseSchema, response.body)).to.be
        .true;
    });
  });
});
