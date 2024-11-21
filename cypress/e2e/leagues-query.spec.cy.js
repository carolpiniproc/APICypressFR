import { leagues } from "../fixtures/graphql-queries/leagues";
const Ajv = require("ajv");

describe("GraphQL API validation - Leagues", () => {
  before(() => {
    cy.resolveToken();
  });

  beforeEach(() => {
    // Restoring the snapshot of the browser's local storage before every test
    cy.restoreLocalStorage("token");
    cy.getLocalStorage("api_token").as("userToken");
    cy.fixture("json-schemas/leagues-response").as("leaguesResponseSchema");
  });

  afterEach(() => {
    // Saving a snapshot of the current state of the browser's local storage
    cy.saveLocalStorage("api_token");
  });

  it("Validate the response of the query Leagues with @aws_oidc auth", function () {
    cy.requestGraphQLQuery("aws_oidc", this.userToken, leagues).then(
      (response) => {
        // response status validation
        expect(response.status).to.be.eq(200);

        // Header validations
        cy.validateBasicHeaders(response);

        // Response validations
        // body
        expect(response.body).to.have.property("data");
        // data
        expect(response.body.data).to.have.property("leagues");
        // leagues
        if (response.body.data.leagues.length > 0) {
          response.body.data.leagues.every((league) => {
            expect(league).to.have.property("name") &&
              expect(league).to.have.property("sport_enum") &&
              expect(league).to.have.property("display_name") &&
              expect(league).to.have.property("league_id");
          });
        } else {
          cy.log("ATTENTION: There are no Leagues to show for this user");
        }

        // Response schema validation
        const ajv = new Ajv({ allErrors: true });
        expect(ajv.validate(this.leaguesResponseSchema, response.body)).to.be
          .true;
      }
    );
  });

  it("Validate the response of the query Leagues with @aws_api_key auth", function () {
    cy.requestGraphQLQuery("aws_api_key", Cypress.env("api_key"), leagues).then(
      (response) => {
        // response status validation
        expect(response.status).to.be.eq(200);

        // Header validations
        cy.validateBasicHeaders(response);

        // Response validations
        // body
        expect(response.body).to.have.property("data");
        // data
        expect(response.body.data).to.have.property("leagues");
        // leagues
        if (response.body.data.leagues.length > 0) {
          response.body.data.leagues.every((league) => {
            expect(league).to.have.property("name") &&
              expect(league).to.have.property("sport_enum") &&
              expect(league).to.have.property("display_name") &&
              expect(league).to.have.property("league_id");
          });
        } else {
          cy.log("ATTENTION: There are no Leagues to show for this user");
        }

        // Response schema validation
        const ajv = new Ajv({ allErrors: true });
        expect(ajv.validate(this.leaguesResponseSchema, response.body)).to.be
          .true;
      }
    );
  });
});
