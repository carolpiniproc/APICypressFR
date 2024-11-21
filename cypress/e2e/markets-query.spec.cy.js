import { markets } from "../fixtures/graphql-queries/markets";
const Ajv = require("ajv");

describe("GraphQL API validation - Markets", () => {
  before(() => {
    cy.resolveToken();
  });

  beforeEach(() => {
    // Restoring the snapshot of the browser's local storage before every test
    cy.restoreLocalStorage("token");
    cy.getLocalStorage("api_token").as("userToken");
    cy.fixture("json-schemas/markets-response").as("marketsResponseSchema");
  });

  afterEach(() => {
    // Saving a snapshot of the current state of the browser's local storage
    cy.saveLocalStorage("api_token");
  });

  it("Validate the response of the query Markets with @aws_oidc auth", function () {
    cy.requestGraphQLQuery("aws_oidc", this.userToken, markets).then(
      (response) => {
        // response status validation
        expect(response.status).to.be.eq(200);

        // Header validations
        cy.validateBasicHeaders(response);

        // Response validations
        // body
        expect(response.body).to.have.property("data");
        // data
        expect(response.body.data).to.have.property("markets");
        // markets
        if (response.body.data.markets.length > 0) {
          response.body.data.markets.every((market) => {
            expect(market).to.have.property("address") &&
              expect(market).to.have.property("against_alias") &&
              expect(market).to.have.property("against_total_shares") &&
              expect(market).to.have.property("against_volume") &&
              expect(market).to.have.property("entity") &&
              expect(market.entity).to.have.property("entity_id") &&
              expect(market.entity).to.have.property("name") &&
              expect(market).to.have.property("first_price") &&
              expect(market).to.have.property("for_alias") &&
              expect(market).to.have.property("for_total_shares") &&
              expect(market).to.have.property("for_volume") &&
              expect(market).to.have.property("full_name") &&
              expect(market).to.have.property("id") &&
              expect(market).to.have.property("last_price") &&
              expect(market).to.have.property("prices") &&
              expect(market).to.have.property("prop") &&
              expect(market.prop).to.have.property("against_total_shares") &&
              expect(market.prop).to.have.property("against_volume") &&
              expect(market.prop).to.have.property("event") &&
              expect(market.prop.event).to.have.property("event_group_id") &&
              expect(market.prop.event).to.have.property("event_id") &&
              expect(market.prop.event).to.have.property("name") &&
              expect(market.prop).to.have.property("event_group") &&
              expect(market.prop.event_group).to.have.property(
                "event_group_id"
              ) &&
              expect(market.prop.event_group).to.have.property("name") &&
              expect(market.prop).to.have.property("for_total_shares") &&
              expect(market.prop).to.have.property("for_volume") &&
              expect(market.prop).to.have.property("id") &&
              expect(market.prop).to.have.property("league") &&
              expect(market.prop.league).to.have.property("league_id") &&
              expect(market.prop.league).to.have.property("name") &&
              expect(market.prop).to.have.property("markets") &&
              expect(market.prop).to.have.property("name") &&
              expect(market.prop).to.have.property("start_time") &&
              expect(market.prop).to.have.property("state") &&
              expect(market).to.have.property("state");
          });
        } else {
          cy.log("ATTENTION: There are no Markets to show for this user");
        }

        // Response schema validation
        const ajv = new Ajv({ allErrors: true });
        expect(ajv.validate(this.marketsResponseSchema, response.body)).to.be
          .true;
      }
    );
  });

  it("Validate the response of the query Markets with @aws_api_key auth", function () {
    // Test case parameters
    const queryVariables = {
      walletAddress: Cypress.env("walletAddress"),
    };

    cy.requestGraphQLQuery(
      "aws_api_key",
      Cypress.env("api_key"),
      markets,
      queryVariables
    ).then((response) => {
      // response status validation
      expect(response.status).to.be.eq(200);

      // Header validations
      expect(response.headers["content-type"]).to.be.eq(
        "application/json;charset=UTF-8"
      );
      expect(response.headers).to.have.property("connection");
      expect(response.headers).to.have.property("date");
      expect(response.headers).to.have.property("x-amzn-requestid");
      expect(response.headers).to.have.property(
        "x-amzn-appsync-tokensconsumed"
      );
      expect(response.headers).to.have.property("x-cache");
      expect(response.headers).to.have.property("via");
      expect(response.headers).to.have.property("x-amz-cf-pop");
      expect(response.headers).to.have.property("x-amz-cf-id");

      // Response validations
      // body
      expect(response.body).to.have.property("data");
      // data
      expect(response.body.data).to.have.property("markets");
      // markets
      if (response.body.data.markets.length > 0) {
        response.body.data.markets.every((market) => {
          expect(market).to.have.property("address") &&
            expect(market).to.have.property("against_alias") &&
            expect(market).to.have.property("against_total_shares") &&
            expect(market).to.have.property("against_volume") &&
            expect(market).to.have.property("entity") &&
            expect(market.entity).to.have.property("entity_id") &&
            expect(market.entity).to.have.property("name") &&
            expect(market).to.have.property("first_price") &&
            expect(market).to.have.property("for_alias") &&
            expect(market).to.have.property("for_total_shares") &&
            expect(market).to.have.property("for_volume") &&
            expect(market).to.have.property("full_name") &&
            expect(market).to.have.property("id") &&
            expect(market).to.have.property("last_price") &&
            expect(market).to.have.property("prices") &&
            expect(market).to.have.property("prop") &&
            expect(market.prop).to.have.property("against_total_shares") &&
            expect(market.prop).to.have.property("against_volume") &&
            expect(market.prop).to.have.property("event") &&
            expect(market.prop.event).to.have.property("event_group_id") &&
            expect(market.prop.event).to.have.property("event_id") &&
            expect(market.prop.event).to.have.property("name") &&
            expect(market.prop).to.have.property("event_group") &&
            expect(market.prop.event_group).to.have.property(
              "event_group_id"
            ) &&
            expect(market.prop.event_group).to.have.property("name") &&
            expect(market.prop).to.have.property("for_total_shares") &&
            expect(market.prop).to.have.property("for_volume") &&
            expect(market.prop).to.have.property("id") &&
            expect(market.prop).to.have.property("league") &&
            expect(market.prop.league).to.have.property("league_id") &&
            expect(market.prop.league).to.have.property("name") &&
            expect(market.prop).to.have.property("markets") &&
            expect(market.prop).to.have.property("name") &&
            expect(market.prop).to.have.property("start_time") &&
            expect(market.prop).to.have.property("state") &&
            expect(market).to.have.property("state");
        });
      } else {
        cy.log("ATTENTION: There are no Markets to show for this user");
      }

      // Response schema validation
      const ajv = new Ajv({ allErrors: true });
      expect(ajv.validate(this.marketsResponseSchema, response.body)).to.be
        .true;
    });
  });
});
