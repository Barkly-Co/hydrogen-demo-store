import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';

export async function action({request, context}: ActionFunctionArgs) {
  const {cart} = context;

  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  const data = (await request.json()) as {discountCodes: string | string[]};
  const {discountCodes} = data;

  // Accept either a single code or an array of codes
  const codes = Array.isArray(discountCodes) ? discountCodes : [discountCodes];

  if (!codes.length) {
    return json(
      {error: 'At least one discount code is required'},
      {status: 400},
    );
  }

  try {
    const result = await cart.updateDiscountCodes(codes);
    const headers = cart.setCartId(result.cart.id);

    return json({success: true, cart: result.cart}, {headers});
  } catch (error) {
    return json({error: 'Failed to apply discount codes'}, {status: 400});
  }
}
