import NextHead from 'next/head';
import React, { memo } from 'react';

export type SEOProps = {
  title?: string;
  canonical?: string;
  /**
   * Set `robots` only when you don't want search engines to index the page.
   */
  robots?: 'noindex' | 'nofollow' | 'noindex, nofollow' | 'index, follow';
  description?: string;
  /**
   * Truncate after maxDescriptionCharacters. Default value is 150.
   * (Google generally truncates descritpion to ~155–160 characters https://moz.com/learn/seo/meta-description )
   */
  maxDescriptionCharacters?: number;
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
  /**
   * Additional meta tags.
   * Setting same value for `key` property between `<DefaultSeo />` and `<PageSeo />` will override the default meta tag (Otherwise both of them will be rendered)
   */
  customMetaTags?: Record<string, string>[];
  /**
   * Additional link tags.
   * Setting same value for `key` property between `<DefaultSeo />` and `<PageSeo />` will override the default meta tag (Otherwise both of them will be rendered)
   */
  customLinkTags?: Record<string, string>[];
  og?: {
    title?: string;
    description?: string;
    url?: string;
    type?: 'article' | 'book' | 'website' | 'profile';
    /**
     * URL for og:image
     */
    image?: string;
    siteName?: string;
  };
  /**
   * Article specific meta tags
   * https://ogp.me/#type_article
   */
  article?: {
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    expirationTime?: string;
    section?: string;
    tag?: string;
  };
  /**
   * JSON-LD schema
   * https://developers.google.com/search/docs/guides/intro-structured-data
   */
  jsonSchema?: Record<string, string | Record<string, string>>;
};

const SEO: React.VFC<SEOProps> = memo(
  ({
    title,
    description,
    canonical,
    robots,
    maxDescriptionCharacters = 150,
    twitter = {},
    og = {},
    article = {},
    jsonSchema,
    customMetaTags = [],
    customLinkTags = []
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
          content={description.substr(0, maxDescriptionCharacters)}
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
          content={(og.description || description)?.substr(
            0,
            maxDescriptionCharacters
          )}
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

    if (customMetaTags.length > 0) {
      tags.push(
        customMetaTags.map(({ key, ...tagProps }, i) => (
          <meta key={`meta-${key || i}`} {...tagProps} />
        ))
      );
    }
    if (customLinkTags.length > 0) {
      tags.push(
        customLinkTags.map(({ key, ...tagProps }, i) => (
          <link key={`link-${key || i}`} {...tagProps} />
        ))
      );
    }

    if (article.author) {
      tags.push(
        <meta key="author" name="author" content={article.author} />,
        <meta
          key="article:author"
          property="article:author"
          content={article.author}
        />
      );
    }
    if (article.publishedTime) {
      tags.push(
        <meta
          key="article:published_time"
          property="article:published_time"
          content={article.publishedTime}
        />
      );
    }
    if (article.modifiedTime) {
      tags.push(
        <meta
          key="article:modified_time"
          property="article:modified_time"
          content={article.modifiedTime}
        />
      );
    }
    if (article.section) {
      tags.push(
        <meta
          key="article:section"
          property="article:section"
          content={article.section}
        />
      );
    }
    if (article.tag) {
      tags.push(
        <meta key="article:tag" property="article:tag" content={article.tag} />
      );
    }

    if (jsonSchema) {
      tags.push(
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonSchema, null, 2)
          }}
        />
      );
    }

    return <NextHead>{tags}</NextHead>;
  }
);

export default SEO;
