import { tradingAccounts } from "../fixtures/graphql-queries/tradingAccounts";
const Ajv = require("ajv");

describe("GraphQL API validation - Get Trading Account", () => {
  before(() => {
    cy.resolveToken();
  });

  beforeEach(() => {
    // Restoring the snapshot of the browser's local storage before every test
    cy.restoreLocalStorage("token");
    cy.getLocalStorage("api_token").as("userToken");
    cy.fixture("json-schemas/trading-accounts-response").as(
      "tradingAccountResponseSchema"
    );
  });

  afterEach(() => {
    // Saving a snapshot of the current state of the browser's local storage
    cy.saveLocalStorage("api_token");
  });

  it("Validate the response of the query: GetTradingAccount", function () {
    // Test case parameters
    const queryVariables = {
      walletAddress: Cypress.env("walletAddress"),
    };

    cy.requestGraphQLQuery(
      "aws_oidc",
      this.userToken,
      tradingAccounts,
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
      expect(response.body.data).to.have.property("tradingAccounts");
      // tradingAccounts
      // Checking that there is at least a single account
      expect(response.body.data.tradingAccounts[0]).to.have.property(
        "trading_account_id"
      );

      // Response schema validation
      const ajv = new Ajv({ allErrors: true });
      expect(ajv.validate(this.tradingAccountResponseSchema, response.body)).to
        .be.true;
    });
  });
});
