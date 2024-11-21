export const performanceValues = `
query performanceValues ($tradingaccountid:String!){
  performanceValues(trading_account_id: $tradingaccountid) {
    time_stamp
    trading_account_id
    worth
  }
}`;