export const orderHistory = `
query orderHistory ($tradingaccountid: String!) {
  orderHistory(trading_account_id: $tradingaccountid) {
    address
    created
    execution_side
    execution_type
    id
    market_address
    market_alias
    market_id
    market_name
    price
    prop_name
    shares
    state
    trading_account_id
    type
    updated
  }
}`;
