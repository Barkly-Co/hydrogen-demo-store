import {
  json,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {getSeoMeta} from '@shopify/hydrogen';

import {PageHeader} from '~/components/Text';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';
import {PolicyLayout} from '~/components/PolicyLayout';

export const headers = routeHeaders;

export async function loader({request, params, context}: LoaderFunctionArgs) {
  invariant(params.pageHandle, 'Missing page handle');

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: params.pageHandle,
      language: context.storefront.i18n.language,
    },
  });

  if (!page) {
    throw new Response(null, {status: 404});
  }

  const seo = seoPayload.page({page, url: request.url});

  return json({page, seo});
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Page() {
  const {page} = useLoaderData<typeof loader>();

  if (page.handle === 'cookies-policy' || page.handle === 'pre-order-policy') {
    return <PolicyLayout title={page.title} body={page.body} />;
  }

  return (
    <div className="flex justify-center">
      <div className="inline-block px-4">
        <PageHeader heading={page.title}>
          <div
            dangerouslySetInnerHTML={{__html: page.body}}
            className="prose dark:prose-invert"
          />
        </PageHeader>
      </div>
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query PageDetails($language: LanguageCode, $handle: String!)
  @inContext(language: $language) {
    page(handle: $handle) {
      id
      title
      handle
      body
      seo {
        description
        title
      }
    }
  }
`;
