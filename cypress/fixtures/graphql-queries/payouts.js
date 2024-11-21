export const payouts = `
query payouts ($tradingaccountid:String!){
  payouts(trading_account_id: $tradingaccountid, market: "") {
    against_alias
    against_net_amount
    against_shares
    against_total_amount
    for_net_amount
    for_alias
    for_shares
    for_total_amount
    market_id
    prop_name
    time_stamp
  }
}`;