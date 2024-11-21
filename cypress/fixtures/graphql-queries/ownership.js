export const ownership = `
query ownership ($tradingaccountid:String!) {
  ownership(trading_account_id: $tradingaccountid, market: "") {
    against_price
    against_shares
    for_price
    for_shares
    market {
      address
      against_alias
      against_total_shares
      against_volume
      bid_ask_spread {
        max_bid_price
        min_ask_price
        num_ask_shares
        num_bid_shares
      }
      first_price
      for_alias
      for_total_shares
      for_volume
      full_name
      id
      last_price
      prices {
        price
        time_stamp
      }
      prop {
        against_total_shares
        against_volume
        event_group {
          event_group_id
          name
        }
        for_total_shares
        for_volume
        id
        markets
        name
        start_time
        state
      }
      state
    }
    trading_account_id
  }
}`;