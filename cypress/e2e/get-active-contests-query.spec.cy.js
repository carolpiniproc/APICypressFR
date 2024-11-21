import { getActiveContests } from "../fixtures/graphql-queries/getActiveContests";
const Ajv = require("ajv");

describe("GraphQL API validation - Get Active Contests", () => {
  before(() => {
    cy.resolveToken();
  });

  beforeEach(() => {
    // Restoring the snapshot of the browser's local storage before every test
    cy.restoreLocalStorage("token");
    cy.getLocalStorage("api_token").as("userToken");
    cy.fixture("json-schemas/get-active-contests-response").as(
      "activeContestsResponseSchema"
    );
  });

  afterEach(() => {
    // Saving a snapshot of the current state of the browser's local storage
    cy.saveLocalStorage("api_token");
  });

  it("Validate the response of the query GetActiveContests with @aws_oidc auth", function () {
    cy.requestGraphQLQuery("aws_oidc", this.userToken, getActiveContests).then(
      (response) => {
        // response status validation
        expect(response.status).to.be.eq(200);

        // // Header validations
        cy.validateBasicHeaders(response);

        // Response validations
        // body
        expect(response.body).to.have.property("data");
        // data
        expect(response.body.data).to.have.property("getActiveContests");
        // getActiveContests
        expect(response.body.data.getActiveContests).to.have.property(
          "contests"
        );
        // contests
        if (response.body.data.getActiveContests.contests.length > 0) {
          response.body.data.getActiveContests.contests.every((contest) => {
            expect(contest).to.have.property("active") &&
              expect(contest).to.have.property("end_date") &&
              expect(contest).to.have.property("start_date") &&
              expect(contest).to.have.property("title") &&
              expect(contest).to.have.property("score_type");
          });
        } else {
          cy.log(
            "ATTENTION: There are no Active Contests to show for this user"
          );
        }

        // Response schema validation
        const ajv = new Ajv({ allErrors: true });
        expect(ajv.validate(this.activeContestsResponseSchema, response.body))
          .to.be.true;
      }
    );
  });

  it("Validate the response of the query GetActiveContests with @aws_api_key auth", function () {
    cy.requestGraphQLQuery(
      "aws_api_key",
      Cypress.env("api_key"),
      getActiveContests
    ).then((response) => {
      // response status validation
      expect(response.status).to.be.eq(200);

      // // Header validations
      cy.validateBasicHeaders(response);

      // Response validations
      // body
      expect(response.body).to.have.property("data");
      // data
      expect(response.body.data).to.have.property("getActiveContests");
      // getActiveContests
      expect(response.body.data.getActiveContests).to.have.property("contests");
      // contests
      if (response.body.data.getActiveContests.contests.length > 0) {
        response.body.data.getActiveContests.contests.every((contest) => {
          expect(contest).to.have.property("active") &&
            expect(contest).to.have.property("end_date") &&
            expect(contest).to.have.property("start_date") &&
            expect(contest).to.have.property("title") &&
            expect(contest).to.have.property("score_type");
        });
      } else {
        cy.log("ATTENTION: There are no Active Contests to show for this user");
      }

      // Response schema validation
      const ajv = new Ajv({ allErrors: true });
      expect(ajv.validate(this.activeContestsResponseSchema, response.body)).to
        .be.true;
    });
  });
});
