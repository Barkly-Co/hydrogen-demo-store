import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

interface TrackableProduct {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  selectedVariant?: {
    image?: {url?: string | null} | null;
    price: {amount: string};
    unitPrice?: Pick<MoneyV2, 'amount' | 'currencyCode'> | null;
    compareAtPrice?: Pick<MoneyV2, 'amount' | 'currencyCode'> | null;
  } | null;
}

interface KlaviyoItem {
  Name: string;
  ProductID: string;
  ImageURL?: string;
  Handle: string;
  Brand?: string;
  Price?: string;
  Metadata?: {
    Brand?: string;
    Price?: Pick<MoneyV2, 'amount' | 'currencyCode'> | null;
    CompareAtPrice?: Pick<MoneyV2, 'amount' | 'currencyCode'> | null;
  };
}

interface KlaviyoInstance {
  track: (event: string, properties: KlaviyoItem) => void;
  trackViewedItem: (item: KlaviyoItem) => void;
}

declare global {
  interface Window {
    klaviyo?: KlaviyoInstance;
  }
}

export function trackViewedProduct(product: TrackableProduct) {
  if (!window.klaviyo) return;
  const item: KlaviyoItem = {
    Name: product.title,
    ProductID: product.id.substring(product.id.lastIndexOf('/') + 1),
    ImageURL: product.selectedVariant?.image?.url ?? undefined,
    Handle: product.handle,
    Brand: product.vendor,
    Price: product.selectedVariant?.price.amount,
    Metadata: {
      Brand: product.vendor,
      Price: product.selectedVariant?.unitPrice ?? null,
      CompareAtPrice: product.selectedVariant?.compareAtPrice ?? null,
    },
  };
  window.klaviyo.track('Hydrogen Viewed Product', item);
  window.klaviyo.trackViewedItem(item);
}

export function trackAddedToCart(product: TrackableProduct) {
  if (!window.klaviyo) return;
  const item: KlaviyoItem = {
    Name: product.title,
    ProductID: product.id.substring(product.id.lastIndexOf('/') + 1),
    ImageURL: product.selectedVariant?.image?.url ?? undefined,
    Handle: product.handle,
    Brand: product.vendor,
    Price: product.selectedVariant?.price.amount,
  };
  window.klaviyo.track('Hydrogen Added To Cart', item);
}
