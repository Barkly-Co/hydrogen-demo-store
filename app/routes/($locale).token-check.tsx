import {Form, useLoaderData} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

export const loader = async ({
  request,
  context: {session},
}: LoaderFunctionArgs) => {
  const token = await session.get('discount_token');
  const EXPIRY_DATE = new Date('2025-01-01T00:30:00+08:00').getTime(); // Jan 1st 12:30am AWST

  return json({
    hasToken: !!token,
    tokenDetails: token
      ? {
          created: new Date(token.created).toLocaleString(),
          // Only send partial token for security
          tokenPreview: token.token.slice(0, 8) + '...',
        }
      : null,
    // If you want to check expiry
    isExpired: token ? Date.now() > EXPIRY_DATE : null,
  });
};

export async function action({
  request,
  context: {session},
}: LoaderFunctionArgs) {
  if (request.method === 'POST') {
    await session.unset('discount_token');
    return json({success: true});
  }
  return json({success: false}, {status: 405});
}

export default function TokenCheck() {
  const {hasToken, tokenDetails, isExpired} = useLoaderData<typeof loader>();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Discount Token Status</h1>

      <div className="shadow rounded-lg p-6">
        <div className="mb-4">
          <span className="font-semibold">Token Present: </span>
          <span className={hasToken ? 'text-green-600' : 'text-red-600'}>
            {hasToken ? 'Yes ✓' : 'No ✗'}
          </span>
        </div>

        {tokenDetails && (
          <>
            <div className="mb-4">
              <span className="font-semibold">Created: </span>
              {tokenDetails.created}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Token Preview: </span>
              <code className=" px-2 py-1 rounded">
                {tokenDetails.tokenPreview}
              </code>
            </div>
          </>
        )}

        {isExpired !== null && (
          <div
            className={`mb-4 ${isExpired ? 'text-red-600' : 'text-green-600'}`}
          >
            <span className="font-semibold">Status: </span>
            {isExpired ? 'Expired' : 'Valid'}
          </div>
        )}
        {hasToken && (
          <Form method="post">
            <button
              type="submit"
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Clear Token
            </button>
          </Form>
        )}
      </div>
    </div>
  );
}
