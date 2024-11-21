export const getActiveContests = `
query getActiveContests {
  getActiveContests {
    contests {
      active
      end_date
      start_date
      title
      score_type
    }
  }
}`;