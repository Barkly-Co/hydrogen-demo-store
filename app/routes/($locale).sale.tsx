import {useMatches} from '@remix-run/react';

import {UnlockDiscounts} from '~/components/UnlockDiscounts';

export default function Discounts() {
  const matches = useMatches();
  const data = matches.find(
    (match) => match.data && 'discountToken' in match.data,
  )?.data;

  const hasDiscounts = !!data?.discountToken;

  return (
    <div className="px-4">
      {!hasDiscounts ? (
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold mb-6">Boxing Day Sale</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
            You&apos;ve found our boxing day VIP sale page! Unlock exclusive
            savings available only to those in the know.
          </p>
          <UnlockDiscounts />
        </div>
      ) : (
        <>
          <div className="text-center py-8">
            <h1 className="text-4xl font-bold mb-4">Sale Unlocked!</h1>
            <p className="text-green-600 text-lg mb-8">
              You now have access to exclusive discounts on selected items
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product cards */}
          </div>
        </>
      )}
    </div>
  );
}
