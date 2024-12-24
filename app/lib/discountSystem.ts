import Decimal from 'decimal.js';
import type {CurrencyCode} from '@shopify/hydrogen/customer-account-api-types';

type ShopifyCollection = {
  id: string;
  title: string;
  handle: string;
};

export type DiscountRule = {
  handles?: string[];
  collections?: string[];
  discountPercentage: number;
};

export type Price = {
  amount: string;
  currencyCode: CurrencyCode;
};

export type Product = {
  handle: string;
  collections?: {
    nodes?: ShopifyCollection[];
  };
  variant: {
    price: Price;
  };
};

export const DISCOUNT_RULES: DiscountRule[] = [
  {
    collections: ['belts'],
    discountPercentage: 0.4,
  },
  {
    collections: ['wild-rags', 'fishing-shirts', 't-shirts', 'hoodies'],
    handles: ['mens-napperby-padded-jacket', 'womens-clarevale-puffer-jacket'],
    discountPercentage: 0.3,
  },
  {
    collections: ['wallets', 'bags-briefcases'],
    discountPercentage: 0.2,
  },
  {
    handles: [
      'womens-brunchilly-soft-shell-jacket',
      'mens-brunchilly-soft-shell-jacket',
    ],
    collections: ['trucker-caps'],
    discountPercentage: 0.15,
  },
];

export const getProductDiscount = (
  product: Product,
  hasDiscountToken: boolean,
): {
  isDiscounted: boolean;
  discountedPrice: {amount: string; currencyCode: string} | null;
} => {
  if (!hasDiscountToken) {
    return {isDiscounted: false, discountedPrice: null};
  }

  // Safely extract collection handles with fallbacks
  const productCollectionHandles =
    product.collections?.nodes?.map((collection) => collection.handle) ?? [];

  const matchingRule = DISCOUNT_RULES.reduce((highestRule, currentRule) => {
    // Check for handle match
    const matchesHandle =
      currentRule.handles?.includes(product.handle) ?? false;

    // Check for collection match only if we have collections to check against
    const matchesCollection = currentRule.collections
      ? currentRule.collections.some((collectionHandle) =>
          productCollectionHandles.includes(collectionHandle),
        )
      : false;

    if (
      (matchesHandle || matchesCollection) &&
      (!highestRule ||
        currentRule.discountPercentage > highestRule.discountPercentage)
    ) {
      return currentRule;
    }
    return highestRule;
  }, null as DiscountRule | null);

  if (!matchingRule) {
    return {isDiscounted: false, discountedPrice: null};
  }

  const {price}: {price: Price} = product.variants.nodes[0];

  const discountedAmount = String(
    new Decimal(price.amount)
      .times(1 - matchingRule.discountPercentage)
      .toDecimalPlaces(2)
      .toNumber(),
  );

  return {
    isDiscounted: true,
    discountedPrice: {
      amount: discountedAmount,
      currencyCode: price.currencyCode,
    },
  };
};
