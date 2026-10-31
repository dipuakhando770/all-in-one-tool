export function hasRole(roles: string[], role: string): boolean {
  return roles.includes(role) || roles.includes("admin");
}

export function isAdmin(roles: string[]): boolean {
  return roles.includes("admin");
}
