import {CheckCircle2, Play, Star} from 'lucide-react';
import React from 'react';

import {toCapitalCase} from '~/lib/utils';

interface ReviewMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  body: string;
  author: string;
  verified_purchase: boolean;
  created_at: string;
  media: ReviewMedia[];
}

interface StarRatingProps {
  rating: number;
}

const CompactStarRating: React.FC<StarRatingProps> = ({rating}) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => {
      const className =
        star <= rating
          ? 'w-3 h-3 fill-yellow-400 text-yellow-400'
          : 'w-3 h-3 text-gray-200';
      return <Star key={star} className={className} />;
    })}
  </div>
);

const MediaPreview: React.FC<{media: ReviewMedia[]}> = ({media}) => {
  if (!media?.length) return null;

  return (
    <div className="flex gap-2 mt-2">
      {media.map((item, index) => (
        <div
          key={item.id}
          className="relative rounded-md overflow-hidden w-16 h-16 bg-gray-100"
        >
          <img
            src={item.url}
            alt={`Review ${index + 1}`}
            className="object-cover w-full h-full"
          />
          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <Play className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const ReviewProgress: React.FC<{current: number; total: number}> = ({
  current,
  total,
}) => (
  <div className="flex justify-center gap-1 mt-3">
    {Array.from({length: total}).map((_, i) => (
      <div
        // eslint-disable-next-line react/no-array-index-key
        key={i}
        className={`h-1 rounded-full transition-all duration-200 ${
          i === current ? 'w-4 bg-gray-800' : 'w-1 bg-gray-200'
        }`}
      />
    ))}
  </div>
);

interface SidebarReviewsProps {
  reviews: Review[];
}

const SidebarReviews: React.FC<SidebarReviewsProps> = ({reviews}) => {
  const [currentReview, setCurrentReview] = React.useState(0);

  if (!reviews.length) {
    return (
      <div className="w-full text-center py-6">
        <p className="text-gray-500">No reviews yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Be the first to review this product
        </p>
      </div>
    );
  }

  const avgRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const reviewsWithMedia = reviews.filter((r) => r.media?.length).length;

  return (
    <div className="w-full py-4 rounded-lg shadow-sm">
      <div className="border-b pb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{avgRating.toFixed(1)}</span>
          <CompactStarRating rating={Math.round(avgRating)} />
          <div className="text-sm ml-auto">
            <span>{reviews.length} reviews</span>
            {reviewsWithMedia > 0 && (
              <span className="text-xs block">
                {reviewsWithMedia} with photos
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          className="overflow-x-auto hiddenScroll snap-x snap-mandatory pt-4"
          onScroll={(e) => {
            const element = e.currentTarget;
            const index = Math.round(element.scrollLeft / element.offsetWidth);
            setCurrentReview(index);
          }}
        >
          <div className="flex w-full gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="max-w-full  w-full flex-none snap-center"
              >
                <div className="flex items-center w-full max-w-full justify-between">
                  <CompactStarRating rating={review.rating} />
                  {review.verified_purchase && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                <h3 className="font-medium mt-2 mb-1">{review.title}</h3>
                <p className="mt-1">{review.body}</p>
                {review.media && <MediaPreview media={review.media} />}
                <div className="mt-2 text-xs text-gray-500">
                  {toCapitalCase(review.author.split(' ')[0])}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ReviewProgress current={currentReview} total={reviews.length} />
    </div>
  );
};

export default SidebarReviews;
