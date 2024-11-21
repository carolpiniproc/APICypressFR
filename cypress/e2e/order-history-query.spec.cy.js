import { orderHistory } from "../fixtures/graphql-queries/orderHistory";
const Ajv = require("ajv");

describe("GraphQL API validation - Order History", () => {
  let queryVariables;

  before(() => {
    cy.resolveToken();
  });

  beforeEach(() => {
    // Restoring the snapshot of the browser's local storage before every test
    cy.restoreLocalStorage("token");
    cy.getLocalStorage("api_token").as("userToken");
    cy.fixture("json-schemas/order-history-response").as(
      "orderHistoryResponseSchema"
    );

    // Test case parameters
    queryVariables = {
      tradingaccountid: Cypress.env("tradingaccountid"),
    };
  });

  afterEach(() => {
    // Saving a snapshot of the current state of the browser's local storage
    cy.saveLocalStorage("api_token");
  });

  it("Validate the response of the query OrderHistory with @aws_oidc auth", function () {
    cy.requestGraphQLQuery(
      "aws_oidc",
      this.userToken,
      orderHistory,
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
      expect(response.body.data).to.have.property("orderHistory");
      // orderHistory
      if (response.body.data.orderHistory.length > 0) {
        response.body.data.orderHistory.every((order) => {
          expect(order).to.have.property("address") &&
            expect(order).to.have.property("created") &&
            expect(order).to.have.property("execution_side") &&
            expect(order).to.have.property("execution_type") &&
            expect(order).to.have.property("id") &&
            expect(order).to.have.property("market_address") &&
            expect(order).to.have.property("market_alias") &&
            expect(order).to.have.property("market_id") &&
            expect(order).to.have.property("market_name") &&
            expect(order).to.have.property("price") &&
            expect(order).to.have.property("prop_name") &&
            expect(order).to.have.property("shares") &&
            expect(order).to.have.property("state") &&
            expect(order).to.have.property("trading_account_id") &&
            expect(order).to.have.property("type") &&
            expect(order).to.have.property("updated");
        });
      } else {
        cy.log("ATTENTION: There is no Order History to show for this user");
      }

      // Response schema validation
      const ajv = new Ajv({ allErrors: true });
      expect(ajv.validate(this.orderHistoryResponseSchema, response.body)).to.be
        .true;
    });
  });

  it("Validate the response of the query: OrderHistory with @aws_iam auth", function () {
    cy.requestGraphQLQueryWithSignature(orderHistory, queryVariables).then(
      (response) => {
        cy.log(JSON.stringify(response));

        // Response validations
        // response
        expect(response).to.have.property("data");
        // data
        expect(response.data).to.have.property("orderHistory");
        // orderHistory
        if (response.data.orderHistory.length > 0) {
          response.data.orderHistory.every((order) => {
            expect(order).to.have.property("address") &&
              expect(order).to.have.property("created") &&
              expect(order).to.have.property("execution_side") &&
              expect(order).to.have.property("execution_type") &&
              expect(order).to.have.property("id") &&
              expect(order).to.have.property("market_address") &&
              expect(order).to.have.property("market_alias") &&
              expect(order).to.have.property("market_id") &&
              expect(order).to.have.property("market_name") &&
              expect(order).to.have.property("price") &&
              expect(order).to.have.property("prop_name") &&
              expect(order).to.have.property("shares") &&
              expect(order).to.have.property("state") &&
              expect(order).to.have.property("trading_account_id") &&
              expect(order).to.have.property("type") &&
              expect(order).to.have.property("updated");
          });
        } else {
          cy.log("ATTENTION: There is no Order History to show for this user");
        }
        // Response schema validation
        const ajv = new Ajv({ allErrors: true });
        expect(ajv.validate(this.orderHistoryResponseSchema, response)).to.be
          .true;
      }
    );
  });
});
