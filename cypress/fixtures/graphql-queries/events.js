export const events = `
query events {
  events {
    event_group_id
    name
    sports_data_io_game_id
    start_time
    league {
      name
      league_id
    }
    event_id
  }
}`;