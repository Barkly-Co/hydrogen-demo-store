import {Image} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';

import type {
  MediaFragment,
  ProductVariantFragmentFragment,
} from 'storefrontapi.generated';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export function ProductGallery({
  media,
  selectedVariant,
  className,
}: {
  media: MediaFragment[];
  selectedVariant?: ProductVariantFragmentFragment;
  className?: string;
}) {
  const galleryRef = useRef<HTMLDivElement>(null);

  // Scroll to start when variant changes
  useEffect(() => {
    if (galleryRef.current) {
      galleryRef.current.scrollLeft = 0;
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [selectedVariant?.id]);

  if (!media.length && !selectedVariant?.image) {
    return null;
  }

  const allMedia = selectedVariant?.image
    ? [
        {
          __typename: 'MediaImage',
          mediaContentType: 'IMAGE',
          id: `variant-${selectedVariant.id}`,
          image: {
            ...selectedVariant.image,
            altText: selectedVariant.image.altText || 'Product variant image',
          },
          alt: selectedVariant.image.altText,
        } as MediaFragment,
        ...media,
      ]
    : media;

  return (
    <div
      ref={galleryRef}
      className={`swimlane md:grid-flow-row hiddenScroll md:p-0 md:overflow-x-auto md:grid-cols-2 ${className}`}
    >
      {allMedia.map((med, i) => {
        const isFirst = i === 0;
        const isFourth = i === 3;
        const isFullWidth = i % 3 === 0;

        const image =
          med.__typename === 'MediaImage'
            ? {...med.image, altText: med.alt || 'Product image'}
            : null;

        const style = [
          isFullWidth ? 'md:col-span-2' : 'md:col-span-1',
          isFirst || isFourth ? '' : 'md:aspect-[4/5]',
          'aspect-square snap-center card-image bg-white dark:bg-contrast/10 w-mobileGallery md:w-full',
        ].join(' ');

        return (
          <div className={style} key={med.id || image?.id}>
            {image && (
              <Image
                loading={i === 0 ? 'eager' : 'lazy'}
                data={image}
                aspectRatio={!isFirst && !isFourth ? '4/5' : undefined}
                sizes={
                  isFirst || isFourth
                    ? '(min-width: 48em) 60vw, 90vw'
                    : '(min-width: 48em) 30vw, 90vw'
                }
                className="object-cover w-full h-full aspect-square fadeIn"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
