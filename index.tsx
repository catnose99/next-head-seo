import React, { memo } from 'react';
import NextHead from 'next/head';

type SEOProps = {
  title?: string;
  canonical?: string;
  /**
   * Set `robots` only when you don't want search engines to index the page.
   */
  robots?: 'noindex' | 'nofollow' | 'noindex, nofollow';
  description?: string;
  twitter?: {
    /**
     * Twitter card type
     * https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
     */
    card?: 'summary' | 'summary_large_image' | 'player' | 'app';
    /**
     * Twitter username starting with @
     */
    site?: string;
  };
  facebook?: {
    appId?: string;
  };
  /**
   * Additional meta tags.
   * Setting same value for `key` property between `<DefaultSeo />` and `<PageSeo />` will override the default meta tag (Otherwise both of them will be rendered)
   */
  meta?: Record<string, string>[];
  /**
   * Additional link tags.
   * Setting same value for `key` property between `<DefaultSeo />` and `<PageSeo />` will override the default meta tag (Otherwise both of them will be rendered)
   */
  link?: Record<string, string>[];
  og?: {
    title?: string;
    /**
     * First 200 letters are used for long description.
     * (Google generally truncates descritpion to ~155–160 characters https://moz.com/learn/seo/meta-description )
     */
    description?: string;
    url?: string;
    type?: 'article' | 'book' | 'website' | 'profile';
    /**
     * URL for og:image
     */
    image?: string;
    siteName?: string;
  };
};

const SEO: React.VFC<SEOProps> = memo(
  ({
    title,
    description,
    canonical,
    robots,
    twitter = {},
    facebook = {},
    og = {},
    meta = [],
    link = []
  }) => {
    const tags = [];

    if (title) {
      tags.push(<title key="title">{title}</title>);
    }
    if (robots) {
      tags.push(<meta key="robots" name="robots" content={robots} />);
    }
    if (description) {
      tags.push(
        <meta
          key="description"
          name="description"
          content={description.substr(0, 200)}
        />
      );
    }
    if (canonical) {
      tags.push(<link key="canonical" rel="canonical" href={canonical} />);
    }

    if (twitter.card) {
      tags.push(
        <meta key="twitter:card" name="twitter:card" content={twitter.card} />
      );
    }
    if (twitter.site) {
      tags.push(
        <meta key="twitter:site" name="twitter:site" content={twitter.site} />
      );
    }
    if (facebook.appId) {
      tags.push(
        <meta key="fb:app_id" property="fb:app_id" content={facebook.appId} />
      );
    }
    if (og.url || canonical) {
      tags.push(
        <meta key="og:url" property="og:url" content={og.url || canonical} />
      );
    }
    if (og.title || title) {
      tags.push(
        <meta key="og:title" property="og:title" content={og.title || title} />
      );
    }
    if (og.image) {
      tags.push(<meta key="og:image" property="og:image" content={og.image} />);
    }
    if (og.description || description) {
      tags.push(
        <meta
          key="og:description"
          property="og:description"
          content={og.description || description?.substr(0, 100)}
        />
      );
    }
    if (og.type) {
      tags.push(<meta key="og:type" property="og:type" content={og.type} />);
    }
    if (og.siteName) {
      tags.push(
        <meta
          key="og:site_name"
          property="og:site_name"
          content={og.siteName}
        />
      );
    }

    meta.forEach(({ key, ...tagProps }, i) => {
      tags.push(<meta key={`meta:${key || i}`} {...tagProps} />);
    });
    link.forEach(({ key, ...tagProps }, i) => {
      tags.push(<link key={`link:${key || i}`} {...tagProps} />);
    });

    return <NextHead>{tags}</NextHead>;
  }
);

export default SEO;
