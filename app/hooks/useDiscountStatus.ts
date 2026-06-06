import {useMatches} from '@remix-run/react';
import type {SerializeFrom} from '@shopify/remix-oxygen';

import type {RootLoader} from '~/root';

type RootData = SerializeFrom<RootLoader>;

const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function useDiscountStatus() {
  const matches = useMatches();
  const data = matches.find(
    (match) =>
      match.data &&
      typeof match.data === 'object' &&
      'discountToken' in match.data,
  )?.data as RootData | undefined;

  const token = data?.discountToken;

  // Check if token exists and isn't expired
  const isValid = token ? Date.now() - token.created < TOKEN_EXPIRY : false;

  return {
    isValid,
    tokenDetails: token,
    // Add more useful info
    expiresAt: token ? new Date(token.created + TOKEN_EXPIRY) : null,
    timeRemaining: token
      ? Math.max(0, token.created + TOKEN_EXPIRY - Date.now())
      : 0,
  };
}
