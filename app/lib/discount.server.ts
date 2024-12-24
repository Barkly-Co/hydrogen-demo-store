export async function checkDiscountAccess(session: any) {
  const token = await session.get('discount_token');

  if (!token) return false;

  // Add any validation logic you need
  const isValid = Date.now() - token.created < 24 * 60 * 60 * 1000;

  return isValid;
}
