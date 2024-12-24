export async function applyDiscountCodes(codes: string | string[]) {
  try {
    const response = await fetch('/api/discount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        discountCodes: codes,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to apply discount codes');
    }

    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error applying discount codes:', error);
    throw error;
  }
}
