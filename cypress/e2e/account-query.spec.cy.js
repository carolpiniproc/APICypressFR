import { account } from "../fixtures/graphql-queries/account";
const Ajv = require("ajv");

describe("GraphQL API validation - Accounts", () => {
  before(() => {
    cy.resolveToken();
  });

  beforeEach(() => {
    // Restoring the snapshot of the browser's local storage before every test
    cy.restoreLocalStorage("token");
    cy.getLocalStorage("api_token").as("userToken");
    cy.fixture("json-schemas/account-response").as("accountResponseSchema");
  });

  afterEach(() => {
    // Saving a snapshot of the current state of the browser's local storage
    cy.saveLocalStorage("api_token");
  });

  it("Validate the response of the query Account with @aws_oidc auth", function () {
    cy.requestGraphQLQuery("aws_oidc", this.userToken, account).then(
      (response) => {
        // response status validation
        expect(response.status).to.be.eq(200);

        // // Header validations
        cy.validateBasicHeaders(response);

        // Response validations
        // body
        expect(response.body).to.have.property("data");
        // data
        expect(response.body.data).to.have.property("account");
        // account
        expect(response.body.data.account).to.have.property("email_subscribe");
        expect(response.body.data.account).to.have.property(
          "event_summary_hotspot_complete"
        );
        expect(response.body.data.account).to.have.property("id");
        expect(response.body.data.account).to.have.property("is_new");
        expect(response.body.data.account).to.have.property("is_enabled");
        expect(response.body.data.account).to.have.property(
          "onboarding_complete"
        );
        expect(response.body.data.account).to.have.property(
          "order_book_hotspot_complete"
        );
        expect(response.body.data.account).to.have.property(
          "orderslip_hotspot_complete"
        );
        expect(response.body.data.account).to.have.property("provider_user_id");
        expect(response.body.data.account).to.have.property("show_usdc_modal");

        // Response schema validation
        const ajv = new Ajv({ allErrors: true });
        expect(ajv.validate(this.accountResponseSchema, response.body)).to.be
          .true;
      }
    );
  });
});
