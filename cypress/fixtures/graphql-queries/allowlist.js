export const allowlist = `
query isInAllowlist($email: String! ) {
  isInAllowlist(email: $email)
}`;