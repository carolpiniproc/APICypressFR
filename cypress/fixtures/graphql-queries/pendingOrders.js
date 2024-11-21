export const pendingOrders = `
query pendingOrders ($tradingaccountid:String!){
  pendingOrders(trading_account_id: $tradingaccountid, market: "", prop: "") {
    address
    created
    execution_side
    execution_type
    id
    event {
      event_group_id
      event_id
      name
    }
  }
}`;