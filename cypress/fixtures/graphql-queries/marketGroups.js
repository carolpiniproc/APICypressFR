export const marketGroups = `
query marketGroups($event_group_id: ID!) {
  marketGroups(event_group_id: $event_group_id) {
    id
    against_alias
    for_alias
    full_name
  }
}`;



