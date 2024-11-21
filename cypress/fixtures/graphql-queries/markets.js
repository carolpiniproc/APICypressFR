export const markets = `
query markets {
  markets {
    address
    against_alias
    against_total_shares
    against_volume
    entity {
      entity_id
      name
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
      event {
        event_group_id
        event_id
        name
      }
      event_group {
        event_group_id
        name
      }
      for_total_shares
      for_volume
      id
      league {
        league_id
        name
      }
      markets
      name
      start_time
      state
    }
    state
  }
}`;
