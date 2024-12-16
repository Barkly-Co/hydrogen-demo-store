// queries/productReviews.ts
export const PRODUCT_REVIEWS_QUERY = `#graphql
  query ProductReviews($first: Int!) {
    metaobjects(type: "product_reviews", first: $first) {
      nodes {
        id
        fields {
          key
          value
          reference {
            ... on Product {
              id
            }
          }
          references(first: 5) {
            nodes {
              ... on MediaImage {
                image {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
        }
      }
    }
  }
`;

export type ReviewMetaobject = {
  id: string;
  fields: {
    key: string;
    value: string;
    reference?: {
      id: string;
    };
    references?: {
      nodes: {
        image: {
          url: string;
          altText: string;
          width: number;
          height: number;
        };
      }[];
    };
  }[];
};

// Helper to transform Metaobject data into component props
export function transformReviewData(metaobject: ReviewMetaobject) {
  const fields = metaobject.fields.reduce((acc, field) => {
    acc[field.key] = field.value;
    if (field.references?.nodes) {
      acc.media = field.references.nodes.map((node) => ({
        type: 'image',
        url: node.image.url,
      }));
    }
    return acc;
  }, {} as any);

  return {
    id: metaobject.id,
    rating: parseInt(fields.rating),
    content: fields.content,
    authorName: fields.author_name,
    verifiedPurchase: fields.verified_purchase === 'true',
    createdAt: fields.created_at,
    media: fields.media || [],
  };
}
