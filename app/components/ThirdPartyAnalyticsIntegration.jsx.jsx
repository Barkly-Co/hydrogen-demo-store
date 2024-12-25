import {useAnalytics} from '@shopify/hydrogen';
import {useEffect} from 'react';

export function ThirdPartyAnalyticsIntegration() {
  const analytics = useAnalytics();

  useEffect(() => {
    if (window._fbq) {
      return;
    }

    const initFacebookPixel = () => {
      const n = (window.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      });

      window._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(script, firstScript);
    };

    initFacebookPixel();
    window.fbq('init', '624422468430724');

    analytics.subscribe('page_viewed', (data) => {
      window.fbq('track', 'PageView');
    });

    analytics.subscribe('product_viewed', (data) => {
      window.fbq('track', 'ViewContent', {
        content_type: 'product',
        content_ids: [data.productGid],
        content_name: data.productTitle,
        currency: data.currency,
        value: data.priceAmount,
      });
    });

    analytics.subscribe('collection_viewed', (data) => {
      window.fbq('track', 'ViewCategory', {
        content_category: data.collectionTitle,
      });
    });

    analytics.subscribe('cart_updated', (data) => {
      window.fbq('track', 'AddToCart', {
        content_ids: data.cart.lines.map((line) => line.merchandise.product.id),
        content_type: 'product',
        currency: data.cart.cost.totalAmount.currencyCode,
        value: data.cart.cost.totalAmount.amount,
      });
    });
  }, [analytics]);

  return null;
}
