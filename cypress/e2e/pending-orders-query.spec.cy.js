import { pendingOrders } from '../fixtures/graphql-queries/pendingOrders';
const Ajv = require('ajv');

describe('GraphQL API validation - Pending Orders', () => {
  
  before(() => {
    cy.resolveToken();
  });

  beforeEach(() => {
    // Restoring the snapshot of the browser's local storage before every test
    cy.restoreLocalStorage('token');
    cy.getLocalStorage('api_token').as('userToken');
    cy.fixture('json-schemas/pending-orders-response').as('pendingOrdersResponseSchema');
  })

  afterEach(() => {
    // Saving a snapshot of the current state of the browser's local storage
    cy.saveLocalStorage('api_token');
  });

  it('Validate the response of the query: PendingOrders', function() {
    // Test case parameters
    const queryVariables = {
      "tradingaccountid": Cypress.env('tradingaccountid')
    }

    cy.requestGraphQLQuery('aws_oidc', this.userToken, pendingOrders, queryVariables)
    .then(response => {
      // response status validation
      expect(response.status).to.be.eq(200);

      // Header validations
      cy.validateBasicHeaders(response);

      // Response validations
      // body
      expect(response.body).to.have.property('data');
      // data
      expect(response.body.data).to.have.property('pendingOrders');
      // pendingOrders
      if (response.body.data.pendingOrders.length > 0) {
        response.body.data.pendingOrders.every(order => {
          expect(order).to.have.property('address') &&
          expect(order).to.have.property('created') &&
          expect(order).to.have.property('execution_side') &&
          expect(order.execution_type).to.be.eq('LIMIT') && // Copied fron Postman - to be checked with actual data
          expect(order).to.have.property('id') &&
          expect(order).to.have.property('event')
          // TODO: Expand when we have a response with actual data
        })
      }
       else {
        cy.log('ATTENTION: There are no Pending Orders to show for this user')
      }

      // Response schema validation
      const ajv = new Ajv({allErrors: true});
      expect(ajv.validate(this.pendingOrdersResponseSchema, response.body)).to.be.true;
    })
  })
})