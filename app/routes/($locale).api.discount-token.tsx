import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

interface DiscountToken {
  token: string;
  created: number;
}

export async function action({request, context}: LoaderFunctionArgs) {
  const {session} = context;

  if (request.method !== 'POST') {
    return new Response('Method not allowed', {status: 405});
  }

  // Generate a random token using Web Crypto API
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  const token: DiscountToken = {
    token: Array.from(randomBytes)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join(''),
    created: Date.now(),
  };

  await session.set('discount_token', token);

  return json({success: true});
}
