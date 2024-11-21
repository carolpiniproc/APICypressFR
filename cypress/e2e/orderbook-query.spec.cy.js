import { orderBook } from "../fixtures/graphql-queries/orderBook";
const Ajv = require("ajv");

describe("GraphQL API validation - OrderBook", () => {
  before(() => {
    cy.resolveToken();
  });

  beforeEach(() => {
    // Restoring the snapshot of the browser's local storage before every test
    cy.restoreLocalStorage("token");
    cy.getLocalStorage("api_token").as("userToken");
    cy.fixture("json-schemas/orderBook-response").as("orderBookResponseSchema");
  });

  afterEach(() => {
    // Saving a snapshot of the current state of the browser's local storage
    cy.saveLocalStorage("api_token");
  });

  it("Validate the response of the query OrderBook with @aws_oidc auth", function () {
    // Retrieve a Market ID
    const markets = `
    query markets {
      markets {
        id
      }
    }`;

    // Get the first ID from the Market ID list
    cy.requestGraphQLQuery("aws_oidc", this.userToken, markets).then(
      (response) => {
        // Test case parameters
        const queryVariables = {
          market: response.body.data.markets[0].id,
        };

        cy.requestGraphQLQuery(
          "aws_oidc",
          this.userToken,
          orderBook,
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
          expect(response.body.data).to.have.property("orderbook");
          // orderbook
          expect(response.body.data.orderbook).to.have.property("market_id");
          expect(response.body.data.orderbook).to.have.property("sells");
          expect(response.body.data.orderbook).to.have.property("buys");

          // Checking Sells list
          if (response.body.data.orderbook.sells.length > 0) {
            expect(response.body.data.orderbook.buys[0]).to.have.property(
              "price"
            );
            expect(response.body.data.orderbook.buys[0]).to.have.property(
              "shares"
            );
          } else {
            cy.log("ATTENTION: There are no Sells to show for this user");
          }

          // Checking Buys list
          if (response.body.data.orderbook.buys.length > 0) {
            expect(response.body.data.orderbook.sells[0]).to.have.property(
              "price"
            );
            expect(response.body.data.orderbook.sells[0]).to.have.property(
              "shares"
            );
          } else {
            cy.log("ATTENTION: There are no Buys to show for this user");
          }

          // Response schema validation
          const ajv = new Ajv({ allErrors: true });
          expect(ajv.validate(this.orderBookResponseSchema, response.body)).to
            .be.true;
        });
      }
    );
  });

  it("Validate the response of the query OrderBook with @aws_api_key auth", function () {
    // Retrieve a Market ID
    const markets = `
    query markets {
      markets {
        id
      }
    }`;

    // Get the first ID from the Market ID list
    cy.requestGraphQLQuery("aws_oidc", this.userToken, markets).then(
      (response) => {
        // Test case parameters
        const queryVariables = {
          market: response.body.data.markets[0].id,
        };

        cy.requestGraphQLQuery(
          "aws_api_key",
          Cypress.env("api_key"),
          orderBook,
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
          expect(response.body.data).to.have.property("orderbook");
          // orderbook
          expect(response.body.data.orderbook).to.have.property("market_id");
          expect(response.body.data.orderbook).to.have.property("sells");
          expect(response.body.data.orderbook).to.have.property("buys");

          // Checking Sells list
          if (response.body.data.orderbook.sells.length > 0) {
            expect(response.body.data.orderbook.buys[0]).to.have.property(
              "price"
            );
            expect(response.body.data.orderbook.buys[0]).to.have.property(
              "shares"
            );
          } else {
            cy.log("ATTENTION: There are no Sells to show for this user");
          }

          // Checking Buys list
          if (response.body.data.orderbook.buys.length > 0) {
            expect(response.body.data.orderbook.sells[0]).to.have.property(
              "price"
            );
            expect(response.body.data.orderbook.sells[0]).to.have.property(
              "shares"
            );
          } else {
            cy.log("ATTENTION: There are no Buys to show for this user");
          }

          // Response schema validation
          const ajv = new Ajv({ allErrors: true });
          expect(ajv.validate(this.orderBookResponseSchema, response.body)).to
            .be.true;
        });
      }
    );
  });
});
