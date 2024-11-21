import { payouts } from '../fixtures/graphql-queries/payouts';
const Ajv = require('ajv');

describe('GraphQL API validation - Payouts', () => {

  before(() => {
    cy.resolveToken();
  });

  beforeEach(() => {
    // Restoring the snapshot of the browser's local storage before every test
    cy.restoreLocalStorage('token');
    cy.getLocalStorage('api_token').as('userToken');
    cy.fixture('json-schemas/payouts-response').as('payoutsResponseSchema');
  })

  afterEach(() => {
    // Saving a snapshot of the current state of the browser's local storage
    cy.saveLocalStorage('api_token');
  });

  it('Validate the response of the query: Payouts', function() {
    // Test case parameters
    const queryVariables = {
      "tradingaccountid": Cypress.env('tradingaccountid')
    }

    cy.requestGraphQLQuery('aws_oidc', this.userToken, payouts, queryVariables)
    .then(response => {
      // response status validation
      expect(response.status).to.be.eq(200);

      // Header validations
      cy.validateBasicHeaders(response);

      // Response validations
      // body
      expect(response.body).to.have.property('data');
      // data
      expect(response.body.data).to.have.property('payouts');
      // payouts
      if (response.body.data.payouts.length > 0) {
        response.body.data.payouts.every(payout => {
          expect(payout).to.have.property('against_alias') &&
          expect(payout).to.have.property('against_net_amount') &&
          expect(payout).to.have.property('against_shares') &&
          expect(payout).to.have.property('against_total_amount') &&
          expect(payout).to.have.property('for_net_amount') &&
          expect(payout).to.have.property('for_alias') &&
          expect(payout).to.have.property('for_shares') &&
          expect(payout).to.have.property('for_total_amount') &&
          expect(payout).to.have.property('market_id') &&
          expect(payout).to.have.property('prop_name') &&
          expect(payout).to.have.property('time_stamp') 
        })
      } else {
        cy.log('ATTENTION: There are no Payouts to show for this user')
      }

      // Response schema validation
      const ajv = new Ajv({allErrors: true});
      expect(ajv.validate(this.payoutsResponseSchema, response.body)).to.be.true;
    })
  })
})