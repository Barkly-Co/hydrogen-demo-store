import type {Review} from '~/components/CompactReview';

export async function fetchReviews(
  productId: string,
  supabaseUrl: string,
  supabaseKey: string,
): Promise<Review[]> {
  const id = productId.split('/').pop();
  const response = await fetch(
    `${supabaseUrl}/rest/v1/reviews?` +
      'select=id,rating,title,body,author,verified_purchase,created_at,media:review_media(id,url,type)' +
      `&product_id=eq.${id}` +
      '&published=eq.true' +
      '&order=created_at.desc',
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    },
  );

  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error('Error fetching reviews:', await response.text());
    return [];
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    // eslint-disable-next-line no-console
    console.error('Unexpected response format');
    return [];
  }

  const reviews = data as Review[];

  // Sort reviews with media to the top
  return reviews.sort((a, b) => {
    const aHasMedia = a.media?.length > 0;
    const bHasMedia = b.media?.length > 0;
    if (aHasMedia !== bHasMedia) {
      return aHasMedia ? -1 : 1;
    }
    // If both have or don't have media, sort by date
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}
