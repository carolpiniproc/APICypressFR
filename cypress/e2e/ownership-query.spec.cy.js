import { ownership } from '../fixtures/graphql-queries/ownership';
const Ajv = require('ajv');

describe('GraphQL API validation - Ownership', () => {

  before(() => {
    cy.resolveToken();
  });

  beforeEach(() => {
    // Restoring the snapshot of the browser's local storage before every test
    cy.restoreLocalStorage('token');
    cy.getLocalStorage('api_token').as('userToken');
    cy.fixture('json-schemas/ownership-response').as('ownershipResponseSchema');
  })

  afterEach(() => {
    // Saving a snapshot of the current state of the browser's local storage
    cy.saveLocalStorage('api_token');
  });

  it('Validate the response of the query: Ownership', function() {
    // Test case parameters
    const queryVariables = {
      "tradingaccountid": Cypress.env('tradingaccountid')
    }

    cy.requestGraphQLQuery('aws_oidc', this.userToken, ownership, queryVariables)
    .then(response => {
      // response status validation
      expect(response.status).to.be.eq(200);

      // Header validations
      cy.validateBasicHeaders(response);

      // Response validations
      // body
      expect(response.body).to.have.property('data');
      // data
      expect(response.body.data).to.have.property('ownership');
      // ownership
      if (response.body.data.ownership.length > 0) {
        response.body.data.ownership.every(order => {
          // TODO: Expand when we have a response with actual data
        })
      }
       else {
        cy.log('ATTENTION: There is no Ownership data to show for this user')
      }

      // Response schema validation
      const ajv = new Ajv({allErrors: true});
      expect(ajv.validate(this.ownershipResponseSchema, response.body)).to.be.true;
    })
  })
})