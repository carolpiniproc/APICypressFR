export const stats = `
query stats($event_id: ID!) {
  stats(event_id: $event_id) {
    event_id
    updated
  }
}`;