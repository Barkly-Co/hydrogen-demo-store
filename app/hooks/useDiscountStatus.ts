import {useMatches} from '@remix-run/react';

// const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const EXPIRY_DATE = new Date('2025-01-01T00:30:00+08:00').getTime(); // Jan 1st 12:30am AWST

export function useDiscountStatus() {
  const matches = useMatches();
  const data = matches.find(
    (match) => match.data && 'discountToken' in match.data,
  )?.data;

  const token = data?.discountToken;

  // Check if token exists and isn't expired
  const isValid = token ? Date.now() < EXPIRY_DATE : false;

  return {
    isValid,
    tokenDetails: token,
    // Add more useful info
    expiresAt: token ? EXPIRY_DATE : null,
    // expiresAt: token ? new Date(token.created + TOKEN_EXPIRY) : null,
    timeRemaining: token ? Math.max(0, EXPIRY_DATE - Date.now()) : 0,
    // timeRemaining: token
    // ? Math.max(0, token.created + TOKEN_EXPIRY - Date.now())
    // : 0,
  };
}
