import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import type {MoneyV2, Product} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';
import {Crown} from 'lucide-react';

import type {ProductCardFragment} from 'storefrontapi.generated';
import {AddToCartButton} from '~/components/AddToCartButton';
import {Button} from '~/components/Button';
import {trackAddedToCart} from '~/components/Onsite';
import {Link} from '~/components/Link';
import {Text} from '~/components/Text';
import {useDiscountStatus} from '~/hooks/useDiscountStatus';
import {getProductDiscount} from '~/lib/discountSystem';
import {getProductPlaceholder} from '~/lib/placeholders';
import {isDiscounted, isNewArrival} from '~/lib/utils';

export function ProductCard({
  product,
  label,
  className,
  loading,
  onClick,
  quickAdd,
}: {
  product: ProductCardFragment;
  label?: string;
  className?: string;
  loading?: HTMLImageElement['loading'];
  onClick?: () => void;
  quickAdd?: boolean;
}) {
  let cardLabel;
  const {isValid: hasDiscountToken} = useDiscountStatus();

  const cardProduct: Product = product?.variants
    ? (product as Product)
    : getProductPlaceholder();
  if (!cardProduct?.variants?.nodes?.length) return null;

  const firstVariant = flattenConnection(cardProduct.variants)[0];

  if (!firstVariant) return null;
  const {price, compareAtPrice} = firstVariant;
  const image = cardProduct.featuredImage || firstVariant.image;

  const {isDiscounted: productIsDiscounted, discountedPrice} =
    getProductDiscount(product, hasDiscountToken);

  if (label) {
    cardLabel = label;
  } else if (isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2)) {
    cardLabel = 'Sale';
  } else if (isNewArrival(product.publishedAt)) {
    cardLabel = 'New';
  } else if (productIsDiscounted) {
    cardLabel = <Crown width={20} />;
  }

  return (
    <div className="flex flex-col gap-2">
      <Link
        onClick={onClick}
        to={`/products/${product.handle}`}
        prefetch="viewport"
      >
        <div className={clsx('grid gap-4', className)}>
          <div className="card-image aspect-[4/5] bg-primary/5">
            {image && (
              <Image
                className="object-cover w-full fadeIn"
                sizes="(min-width: 64em) 25vw, (min-width: 48em) 30vw, 45vw"
                aspectRatio="4/5"
                data={image}
                alt={image.altText || `Picture of ${product.title}`}
                loading={loading}
              />
            )}
            {cardLabel && (
              <Text
                as="label"
                size="fine"
                className="absolute top-0 right-0 m-4 text-right bg-slate-950 text-white px-2 py-1 rounded"
              >
                {cardLabel}
              </Text>
            )}
          </div>
          <div className="grid gap-1">
            <Text
              className="w-full overflow-hidden whitespace-nowrap text-ellipsis "
              as="h3"
            >
              {product.title}
            </Text>
            <div className="flex gap-4">
              <Text className="flex gap-4">
                <Money
                  withoutTrailingZeros
                  data={
                    productIsDiscounted ? (discountedPrice as MoneyV2) : price!
                  }
                />
                {isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2) && (
                  <CompareAtPrice
                    className={'opacity-50'}
                    data={compareAtPrice as MoneyV2}
                  />
                )}
                {productIsDiscounted && (
                  <>
                    <CompareAtPrice
                      className={'opacity-50'}
                      data={price as MoneyV2}
                    />
                  </>
                )}
              </Text>
            </div>
          </div>
        </div>
      </Link>
      {quickAdd && firstVariant.availableForSale && (
        <AddToCartButton
          lines={[
            {
              quantity: 1,
              merchandiseId: firstVariant.id,
            },
          ]}
          variant="secondary"
          className="mt-2"
          onClick={() =>
            trackAddedToCart({
              id: product.id,
              title: product.title,
              handle: product.handle,
              vendor: product.vendor,
              selectedVariant: {
                image: firstVariant.image,
                price: firstVariant.price,
                compareAtPrice: firstVariant.compareAtPrice ?? null,
                unitPrice: null,
              },
            })
          }
        >
          <Text as="span" className="flex items-center justify-center gap-2">
            Add to Cart
          </Text>
        </AddToCartButton>
      )}
      {quickAdd && !firstVariant.availableForSale && (
        <Button variant="secondary" className="mt-2" disabled>
          <Text as="span" className="flex items-center justify-center gap-2">
            Sold out
          </Text>
        </Button>
      )}
    </div>
  );
}

function CompareAtPrice({
  data,
  className,
}: {
  data: MoneyV2;
  className?: string;
}) {
  const {currencyNarrowSymbol, withoutTrailingZerosAndCurrency} =
    useMoney(data);

  const styles = clsx('strike', className);

  return (
    <span className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}
