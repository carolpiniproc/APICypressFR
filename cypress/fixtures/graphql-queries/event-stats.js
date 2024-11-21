export const eventStats = `
query eventStats($event_id: ID!) {
  eventStats(event_id: $event_id) {
    event_id
    sport_enum
    stats {
      ... on BaseballEventStats {
        home_score
        away_score
      }
      ... on SoccerEventStats {
        home_score
        away_score
      }
      ... on FootballEventStats {
        home_score
        away_score
      }
      ... on BasketballEventStats {
        home_score
        away_score
      }
    }
    updated
  }
}`;
