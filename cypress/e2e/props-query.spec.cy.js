import { props } from "../fixtures/graphql-queries/props";
const Ajv = require("ajv");

describe("GraphQL API validation - Props", () => {
  before(() => {
    cy.resolveToken();
  });

  beforeEach(() => {
    // Restoring the snapshot of the browser's local storage before every test
    cy.restoreLocalStorage("token");
    cy.getLocalStorage("api_token").as("userToken");
    cy.fixture("json-schemas/props-response").as("propsResponseSchema");
  });

  afterEach(() => {
    // Saving a snapshot of the current state of the browser's local storage
    cy.saveLocalStorage("api_token");
  });

  it("Validate the response of the query Props with @aws_oidc auth", function () {
    cy.requestGraphQLQuery("aws_oidc", this.userToken, props).then(
      (response) => {
        // response status validation
        expect(response.status).to.be.eq(200);

        // // Header validations
        cy.validateBasicHeaders(response);

        // Response validations
        // body
        expect(response.body).to.have.property("data");
        // data
        expect(response.body.data).to.have.property("props");
        // props
        if (response.body.data.props.length > 0) {
          response.body.data.props.every((prop) => {
            expect(prop).to.have.property("id") &&
              expect(prop).to.have.property("name") &&
              expect(prop).to.have.property("start_time") &&
              expect(prop).to.have.property("markets") &&
              expect(prop).to.have.property("league") &&
              expect(prop.league).to.have.property("name") &&
              expect(prop.league).to.have.property("league_id");
          });
        } else {
          cy.log("ATTENTION: There are no Props to show for this user");
        }

        // Response schema validation
        const ajv = new Ajv({ allErrors: true });
        expect(ajv.validate(this.propsResponseSchema, response.body)).to.be
          .true;
      }
    );
  });

  it("Validate the response of the query Props with @aws_api_key auth", function () {
    cy.requestGraphQLQuery("aws_api_key", Cypress.env("api_key"), props).then(
      (response) => {
        // response status validation
        expect(response.status).to.be.eq(200);

        // // Header validations
        cy.validateBasicHeaders(response);

        // Response validations
        // body
        expect(response.body).to.have.property("data");
        // data
        expect(response.body.data).to.have.property("props");
        // props
        if (response.body.data.props.length > 0) {
          response.body.data.props.every((prop) => {
            expect(prop).to.have.property("id") &&
              expect(prop).to.have.property("name") &&
              expect(prop).to.have.property("start_time") &&
              expect(prop).to.have.property("markets") &&
              expect(prop).to.have.property("league") &&
              expect(prop.league).to.have.property("name") &&
              expect(prop.league).to.have.property("league_id");
          });
        } else {
          cy.log("ATTENTION: There are no Props to show for this user");
        }

        // Response schema validation
        const ajv = new Ajv({ allErrors: true });
        expect(ajv.validate(this.propsResponseSchema, response.body)).to.be
          .true;
      }
    );
  });
});
