# next-head-seo

[![Testing](https://github.com/catnose99/next-head-seo/actions/workflows/test.yml/badge.svg)](https://github.com/catnose99/next-head-seo/actions/workflows/test.yml)
[![Gzipped size](https://badgen.net/bundlephobia/minzip/next-head-seo)](https://badgen.net/bundlephobia/minzip/next-head-seo)

A simple and light-weight SEO plugin for Next.js applications.

- ⚡️ < 1kb gzipped
- ✨ Zero dependencies
- ✍️ Designed based on [Google Webmaster Guidelines](https://developers.google.com/search/docs/advanced/guidelines/webmaster-guidelines)
- 🦄 TypeScript support 

Although `next-head-seo` supports only essential SEO properties, it would be enough for most websites.

If you need advanced SEO settings such as [structured data](https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data), use [next-seo](https://github.com/garmeeh/next-seo) instead.


## Install
```bash
$ npm install next-head-seo
# or with yarn
$ yarn next-head-seo
```

## Usage

Import `next-head-seo` on each page component and add the desired properties.

Example:

```tsx
// pages/example.tsx
import NextHeadSeo from 'next-head-seo';

const Page = () => (
  <>
    <h1>Hello!</h1>
    <NextHeadSeo
      title="Hello!"
      description="Some description"
      canonical="https://example.com/hello"
      og={{
        title: "Open graph title", 
        image: "https://example.com/og.png",
      }}
    />
  </>
);

export defualt Page

// Output:
// <head>
//   <title>Hello!</title>
//   <meta name="description" content="Some description" />
//   <link rel="canonical" href="https://example.com/hello"/>
//   <meta property="og:title" content="Open graph title"/>
//   <meta property="og:image" content="https://example.com/og.png"/>
// </head>
```


## Default SEO Settings

There are 2 options to configure default SEO properies.

### Place default `<NextHeadSeo />` on `_app.tsx`

First option is to place `<NextHeadSeo />` with default values on `_app.tsx`.

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app'
import NextHeadSeo from 'next-head-seo';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Default SEO configuration */}
      <NextHeadSeo
        og={{
          image: "https://example.com/default-og.png",
          type: 'article',
          siteName: 'Your app name',
        }}
        twitter={{
          card: "summary"
        }}
      />
      {/* Place <Component /> after <NextHeadSeo /> */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp
```

Make sure `<NextHeadSeo />` is placed before `<Component {...pageProps} />` since next-head-seo respects the latter value for same property name.



### Create Wrapper Component for next-head-seo

Alternatively, just create a wrapper component which can be used on each page component. This is more frexible and reliable way to set default values. 

Here is an example of wrapper component:

```tsx
// components/MyPageSeo.tsx
import NextHeadSeo from 'next-head-seo';

// types
export type MyPageSeoProps = {
  path: string;
  title?: string;
  description?: string;
  ogImagePath?: string;
  noindex?: boolean;
  noTitleTemplate?: boolean;
};

export const MyPageSeo: React.FC<MyPageSeoProps> = (props) => {
  const {
    path,
    title = "Default title",
    description = "Default description",
    ogImagePath = "/default-og.png"
    noindex,
    noTitleTemplate,
  } = props;

  // Set APP_ROOT_URL on enviroment variables
  // e.g. APP_ROOT_URL=https://example.com
  // https://nextjs.org/docs/basic-features/environment-variables
  const APP_ROOT_URL = process.env.NEXT_PUBLIC_APP_ROOT_URL;

  // Absolute page url
  const pageUrl = APP_ROOT_URL + path
  // Absolute og image url
  const ogImageUrl = APP_ROOT_URL + ogImagePath

  return (
    <NextHeadSeo
      title={noTitleTemplate ? title : `${title} - MyAppName`}
      canonical={pageUrl}
      description={description}
      robots={noindex ? 'noindex, nofollow' : undefined}
      og={{
        title,
        description,
        url: pageUrl,
        image: ogImageUrl,
        type: 'article',
        siteName: 'MyAppName',
      }}
      twitter={{
        card: "summary_large_image",
      }}
    />
  );
};
```

Then, place `<MyPageSeo />` in each page component.

```tsx
// pages/example.tsx
import { MyPageSeo } from "../components/MyPageSeo"

const Page = () => (
  <>
    <h1>Hello!</h1>
    <MyPageSeo
      path="/example"
      title="Hello!"
      noindex={true}
    />
  </>
);
export defualt Page

// Output:
// <head>
//   <title>Hello! - MyAppName</title>
//   <meta name="robots" content="noindex, nofollow"/>
//   <meta name="description" content="Default description" />
//   <link rel="canonical" href="https://example.com/example"/>
//   <meta property="og:url" content="https://example.com/example"/>
//   <meta property="og:title" content="Hello!"/>
//   <meta property="og:description" content="Default description"/>
//   <meta property="og:image" content="https://example.com//default-og.png"/>
//   <meta property="og:type" content="article"/>
//   <meta property="og:site_name" content="MyAppName"/>
//   <meta name="twitter:card" content="summary_large_image"/>
// </head>
```


## Options

All the props for `next-head-seo` are optional.

| Prop           | Description                                                                                                                                                                 | Type                                                                         |
|----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| title          | ✅ *Recommended to set on all pages.*<br/>Page title.                                                                                                                        | string                                                                       |
| canonical      | ✅ *Recommended to set on all pages.*<br />Canonical URL of the page.                                                                                                        | string                                                                       |
| robots         | Set `noindex, nofollow` only when you don't want the page to be indexed on search engines. Otherwise you don't have to use this prop.                                       | `"noindex, nofollow"`<br/>`"index, follow"`<br/>`"noindex"`<br/>`"nofollow"` |
| description    | ✅ *Recommended to set on all pages.*<br/>Page description. Text after 150 characters will be truncated as [Google do](https://moz.com/learn/seo/meta-description).          | string                                                                       |
| twitter.card   | Twitter card image type. Set along with `og:image` prop.<br/>See detail: [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary) | `"summary"`<br/>`"summary_large_image"`<br/>`"player"`<br/>`"app"`           |
| twitter.site   | Twitter username starting with `@`                                                                                                                                          | string                                                                       |
| og.title       | For og:title. Automatically use `title` value if blank. <br/>See detail: [Open Graph protocol](https://ogp.me/)                                                             | string                                                                       |
| og.description | For og:description. Automatically use `description` value if blank.                                                                                                         | string                                                                       |
| og.url         | For og:url. Automatically use `canonical` value if blank.                                                                                                                   | string                                                                       |
| og.image       | For og:image. Set image url.                                                                                                                                                | string                                                                       |
| og.type        | For og:type.                                                                                                                                                                | `"article"`<br/>`"book"`<br/>`"website"`<br/>`"profile"`                     |
| og.siteName    | For og:site_name                                                                                                                                                            | string                                                                       |
| customMetaTags | Array of object for custom meta tags. See [customMetaTags](#custom-meta-tags) section.                                                                                      | An array of objects                                                          |
| customLinkTags | Array of object for custom link tags. See [customLinkTags](#custom-link-tags) section.                                                                                      | An array of objects                                                          |


### Custom Meta Tags

You can set additional meta tags.
Example: 

```tsx
<NextHeadSeo
  customMetaTags={[
    {
      name: 'foo',
      content: 'foo-content'
    },
    {
      property: 'bar',
      content: 'bar-content'
    }
  ]}
/>
// Output:
// <head>
//   <meta name="foo" content="foo-content"/>
//   <meta name="bar" content="bar-content"/>
// </head>
```

If you want to override custom meta tags from another page component, use same keys for both component.

Example: 

```tsx
// in /pages/_app.tsx
<NextHeadSeo
  customMetaTags={[
    {
      key: "custom-meta",
      name: 'foo',
      content: 'foo-content'
    }
  ]}
/>

// in /pages/example.tsx
<NextHeadSeo
  customMetaTags={[
    {
      key: "custom-meta",
      name: 'bar',
      content: 'bar-content'
    }
  ]}
/>

// Output:
// <head>
//   <meta name="bar" content="bar-content"/>
// </head>
```

### Custom Link Tags


You can set additional link tags.
Example: 

```tsx
<NextHeadSeo
  customLinkTags={[
    {
      rel: 'foo',
      href: 'https://example.com/foo'
    },
     {
      rel: 'bar',
      type: 'bar-type',
      href: 'https://example.com/bar'
    },
  ]}
/>
// Output:
// <head>
//   <link rel="foo" content="https://example.com/foo"/>
//   <link rel="bar" type="bar-type" content="https://example.com/bar"/>
// </head>
```

If you want to override custom link tags from another page component, use same keys for both component.
Example: 

```tsx
// in /pages/_app.tsx
<NextHeadSeo
  customLinkTags={[
    {
      key: "custom-link",
      rel: 'foo',
      content: 'https://example.com/foo'
    }
  ]}
/>

// in /pages/example.tsx
<NextHeadSeo
  customLinkTags={[
    {
      key: "custom-link",
      rel: 'bar',
      type: 'bar-type',
      ccontent: 'https://example.com/bar'
    }
  ]}
/>

// Output:
// <head>
//   <link rel="bar" type="bar-type" content="https://example.com/bar"/>
// </head>
```