import { marketsThin } from "../fixtures/graphql-queries/marketsThin";
const Ajv = require("ajv");

describe("GraphQL API validation - Markets Thin", () => {
  before(() => {
    cy.resolveToken();
  });

  beforeEach(() => {
    // Restoring the snapshot of the browser's local storage before every test
    cy.restoreLocalStorage("token");
    cy.getLocalStorage("api_token").as("userToken");
    cy.fixture("json-schemas/markets-thin-response").as(
      "marketsThinResponseSchema"
    );
  });

  afterEach(() => {
    // Saving a snapshot of the current state of the browser's local storage
    cy.saveLocalStorage("api_token");
  });

  it("Validate the response of the query Markets Thin with @aws_oidc auth", function () {
    cy.requestGraphQLQuery("aws_oidc", this.userToken, marketsThin).then(
      (response) => {
        // response status validation
        expect(response.status).to.be.eq(200);

        // Header validations
        cy.validateBasicHeaders(response);

        // Response validations
        // body
        expect(response.body).to.have.property("data");
        // data
        expect(response.body.data).to.have.property("marketsThin");
        // markets
        if (response.body.data.marketsThin.length > 0) {
          response.body.data.marketsThin.every((marketsThin) => {
            expect(marketsThin).to.have.property("for_alias") &&
              expect(marketsThin).to.have.property("against_alias") &&
              expect(marketsThin).to.have.property("against_total_shares") &&
              expect(marketsThin).to.have.property("for_total_shares") &&
              expect(marketsThin).to.have.property("id");
          });
        } else {
          cy.log("ATTENTION: There are no Markets Thin to show for this user");
        }

        // Response schema validation
        const ajv = new Ajv({ allErrors: true });
        expect(ajv.validate(this.marketsThinResponseSchema, response.body)).to
          .be.true;
      }
    );
  });

  it("Validate the response of the query Markets Thin with @aws_api_key auth", function () {
    cy.requestGraphQLQuery(
      "aws_api_key",
      Cypress.env("api_key"),
      marketsThin
    ).then((response) => {
      // response status validation
      expect(response.status).to.be.eq(200);

      // Header validations
      cy.validateBasicHeaders(response);

      // Response validations
      // body
      expect(response.body).to.have.property("data");
      // data
      expect(response.body.data).to.have.property("marketsThin");
      // markets
      if (response.body.data.marketsThin.length > 0) {
        response.body.data.marketsThin.every((marketsThin) => {
          expect(marketsThin).to.have.property("for_alias") &&
            expect(marketsThin).to.have.property("against_alias") &&
            expect(marketsThin).to.have.property("against_total_shares") &&
            expect(marketsThin).to.have.property("for_total_shares") &&
            expect(marketsThin).to.have.property("id");
        });
      } else {
        cy.log("ATTENTION: There are no Markets Thin to show for this user");
      }

      // Response schema validation
      const ajv = new Ajv({ allErrors: true });
      expect(ajv.validate(this.marketsThinResponseSchema, response.body)).to.be
        .true;
    });
  });
});
