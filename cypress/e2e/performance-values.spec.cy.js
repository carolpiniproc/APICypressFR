import { performanceValues } from '../fixtures/graphql-queries/performanceValues';
const Ajv = require('ajv');

describe('GraphQL API validation - Performance Values', () => {

  before(() => {
    cy.resolveToken();
  });

  beforeEach(() => {
    // Restoring the snapshot of the browser's local storage before every test
    cy.restoreLocalStorage('token');
    cy.getLocalStorage('api_token').as('userToken');
    cy.fixture('json-schemas/performance-values-response').as('performanceValuesResponseSchema');
  })

  afterEach(() => {
    // Saving a snapshot of the current state of the browser's local storage
    cy.saveLocalStorage('api_token');
  });

  it('Validate the response of the query: PerformanceValues', function() {
    // Test case parameters
    const queryVariables = {
      "tradingaccountid": Cypress.env('tradingaccountid')
    }

    cy.requestGraphQLQuery('aws_oidc', this.userToken, performanceValues, queryVariables)
    .then(response => {
      // response status validation
      expect(response.status).to.be.eq(200);

      // Header validations
      cy.validateBasicHeaders(response);

      // Response validations
      // body
      expect(response.body).to.have.property('data');
      // data
      expect(response.body.data).to.have.property('performanceValues');
      // performanceValues
      if (response.body.data.performanceValues.length > 0) {
        response.body.data.performanceValues.every(value => {
          expect(value).to.have.property('time_stamp') &&
          expect(value).to.have.property('trading_account_id') &&
          expect(value).to.have.property('worth')
        })
      } else {
        cy.log('ATTENTION: There are no Performance Values to show for this user')
      }

      // Response schema validation
      const ajv = new Ajv({allErrors: true});
      expect(ajv.validate(this.performanceValuesResponseSchema, response.body)).to.be.true;
    })
  })
})