export async function canAccessExclusiveOffers(user) {
  if (!user) return false;
  const roles = Array.isArray(user.roles) ? user.roles : [];
  if (roles.includes("admin")) return true;
  if (!roles.includes("client")) return false;

  return Number(user.adoptedPetCount || 0) > 0;
}
