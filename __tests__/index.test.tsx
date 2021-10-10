import { render, screen } from '@testing-library/react';
import SEO from '../index';
import React, { useEffect } from 'react';

jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>
  };
});

function checkHavingSameKeys(
  elems: NodeListOf<HTMLElement | Element>
): boolean {
  return [...elems].every(
    elem => elem.getAttribute('key') === elems[0].getAttribute('key')
  );
}

describe('title', () => {
  test('should render a title element by passing title prop', () => {
    render(<SEO title="foo" />);
    expect(document.title).toBe('foo');
  });

  test('should render multiple title elements with same keys when multiple components exits', () => {
    render(
      <>
        <SEO title="first" />
        <SEO title="second" />
      </>
    );
    // In this case, Next.js render only second element since both elements have the same key.
    // https://nextjs.org/docs/api-reference/next/head
    const titles = document.querySelectorAll('title');
    expect(titles[0].text).toBe('first');
    expect(titles[1].text).toBe('second');
    expect(checkHavingSameKeys(titles)).toBe(true);
  });

  test('should not render title when title prop is not set', () => {
    render(<SEO og={{ title: 'foo' }} />);
    const titles = document.querySelectorAll('title');
    expect(titles.length).toBe(0);
  });
});

describe('canonical', () => {
  const selector = `link[rel="canonical"]`;
  test('should render canonical links by passing canonical prop', () => {
    render(<SEO title="foo" canonical="http://example.com/foo" />);
    const canonicalLinks = document.querySelectorAll(selector);
    expect(canonicalLinks.length).toBe(1);
    expect(canonicalLinks[0].getAttribute('href')).toBe(
      'http://example.com/foo'
    );
  });

  test('should render multiple canonical links with same keys when multiple components exits', () => {
    render(
      <>
        <SEO canonical="http://example.com/first" />
        <SEO canonical="http://example.com/second" />
      </>
    );
    // In this case, Next.js render only second element since both elements have the same key.
    const canonicalLinks = document.querySelectorAll(selector);
    expect(checkHavingSameKeys(canonicalLinks)).toBe(true);
    expect(canonicalLinks[1].getAttribute('href')).toBe(
      'http://example.com/second'
    );
  });

  test('should not render canonical links when canonical prop is not set', () => {
    render(<SEO title="foo" />);
    const titles = document.querySelectorAll(selector);
    expect(titles.length).toBe(0);
  });
});

describe('robots', () => {
  const selector = `meta[name="robots"]`;

  test('should render meta robots with `noindex` when robots prop value is `noindex`', () => {
    render(<SEO robots="noindex" />);
    const metaElems = document.querySelectorAll(selector);
    expect(metaElems.length).toBe(1);
    expect(metaElems[0].getAttribute('content')).toBe('noindex');
  });

  test('should render meta robots with `noindex, nofollow` when robots prop value is `noindex, nofollow', () => {
    render(<SEO robots="noindex, nofollow" />);
    const metaElems = document.querySelectorAll(selector);
    expect(metaElems[0].getAttribute('content')).toBe('noindex, nofollow');
  });

  test('should render multiple meta robots with same keys when multiple components exits', () => {
    render(
      <>
        <SEO robots="noindex" />
        <SEO robots="noindex, nofollow" />
      </>
    );
    // In this case, Next.js render only second element since both elements have the same key.
    const metaElems = document.querySelectorAll(selector);
    expect(checkHavingSameKeys(metaElems)).toBe(true);
    expect(metaElems[1].getAttribute('content')).toBe('noindex, nofollow');
  });
});

describe('description', () => {
  const selector = `meta[name="description"]`;

  test('should render meta description by passing `description` prop', () => {
    render(<SEO description="foo" />);
    const metaElems = document.querySelectorAll(selector);
    expect(metaElems.length).toBe(1);
    expect(metaElems[0].getAttribute('content')).toBe('foo');
  });

  test('should use first 150 characters for meta description', () => {
    const longText = `But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the gre`;
    render(<SEO description={longText} />);
    const metaElems = document.querySelectorAll(selector);
    expect(metaElems[0].getAttribute('content')).toBe(longText.substr(0, 150));
  });

  test('should truncate description after `maxDescriptionCharacters`', () => {
    const longText = `But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the gre`;
    render(<SEO description={longText} maxDescriptionCharacters={100} />);
    const metaElems = document.querySelectorAll(selector);
    expect(metaElems[0].getAttribute('content')).toBe(longText.substr(0, 100));
  });

  test('should render multiple meta robots with same keys when multiple components exits', () => {
    render(
      <>
        <SEO description="first" />
        <SEO description="second" />
      </>
    );
    // In this case, Next.js render only second element since both elements have the same key.
    const metaElems = document.querySelectorAll(selector);
    expect(checkHavingSameKeys(metaElems)).toBe(true);
    expect(metaElems[1].getAttribute('content')).toBe('second');
  });
});

describe('twitter', () => {
  describe('card', () => {
    const selector = `meta[name="twitter:card"]`;

    test('should render meta twitter:card by passing `twitter.card` prop', () => {
      render(<SEO twitter={{ card: 'summary' }} />);
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems.length).toBe(1);
      expect(metaElems[0].getAttribute('content')).toBe('summary');
    });

    test('should render multiple meta twitter:card with same keys when multiple components exits', () => {
      render(
        <>
          <SEO twitter={{ card: 'summary' }} />
          <SEO twitter={{ card: 'summary_large_image' }} />
        </>
      );
      // In this case, Next.js render only second element since both elements have the same key.
      const metaElems = document.querySelectorAll(selector);
      expect(checkHavingSameKeys(metaElems)).toBe(true);
      expect(metaElems[1].getAttribute('content')).toBe('summary_large_image');
    });
  });

  describe('site', () => {
    const selector = `meta[name="twitter:site"]`;

    test('should render meta twitter:site by passing `twitter.site` prop', () => {
      render(<SEO twitter={{ site: '@catnose99' }} />);
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems.length).toBe(1);
      expect(metaElems[0].getAttribute('content')).toBe('@catnose99');
    });

    test('should render multiple meta twitter:card with same keys when multiple components exits', () => {
      render(
        <>
          <SEO twitter={{ site: '@first' }} />
          <SEO twitter={{ site: '@second' }} />
        </>
      );
      // In this case, Next.js render only second element since both elements have the same key.
      const metaElems = document.querySelectorAll(selector);
      expect(checkHavingSameKeys(metaElems)).toBe(true);
      expect(metaElems[1].getAttribute('content')).toBe('@second');
    });
  });
});

describe('facebook', () => {
  describe('appId', () => {
    const selector = `meta[property="fb:app_id"]`;

    test('should render meta fb:app_id by passing `fb:app_id` prop', () => {
      render(<SEO facebook={{ appId: 'foo' }} />);
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems.length).toBe(1);
      expect(metaElems[0].getAttribute('content')).toBe('foo');
    });
  });
});

describe('customMetaTags', () => {
  test('should render meta elements correctly by passing `customMetaTags` props', () => {
    render(
      <SEO
        customMetaTags={[
          {
            name: 'name1',
            content: 'content1'
          },
          {
            name: 'name2',
            content: 'content2'
          }
        ]}
      />
    );
    const metaElem1 = document.querySelector(`meta[name="name1"]`);
    expect(metaElem1?.getAttribute('content')).toBe('content1');
    const metaElem2 = document.querySelector(`meta[name="name2"]`);
    expect(metaElem2?.getAttribute('content')).toBe('content2');
  });
});

describe('customLinkTags', () => {
  test('should render link elements correctly by passing `customLinkTags` props', () => {
    render(
      <SEO
        customLinkTags={[
          {
            rel: 'stylesheet',
            href: 'https://example.com/first.css'
          },
          {
            rel: 'stylesheet',
            href: 'https://example.com/second.css'
          }
        ]}
      />
    );
    const linkElems = document.querySelectorAll(`link[rel="stylesheet"]`);
    expect(linkElems[0].getAttribute('href')).toBe(
      'https://example.com/first.css'
    );
    expect(linkElems[1].getAttribute('href')).toBe(
      'https://example.com/second.css'
    );
  });
});

describe('og', () => {
  describe('title', () => {
    const selector = `meta[property="og:title"]`;
    test('should render og:title by passing `og.title` prop', () => {
      render(<SEO og={{ title: 'foo' }} />);
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems.length).toBe(1);
      expect(metaElems[0].getAttribute('content')).toBe('foo');
    });

    test('should render multiple og:title with same keys when multiple components exits', () => {
      render(
        <>
          <SEO og={{ title: 'first' }} />
          <SEO og={{ title: 'second' }} />
        </>
      );
      // In this case, Next.js render only second element since both elements have the same key.
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems[0].getAttribute('content')).toBe('first');
      expect(metaElems[1].getAttribute('content')).toBe('second');
      expect(checkHavingSameKeys(metaElems)).toBe(true);
    });

    test('should not render og:title when `og:title` prop is not set', () => {
      render(<SEO />);
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems.length).toBe(0);
    });

    test('should fallback to `title` prop', () => {
      render(<SEO title="title" />);
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems.length).toBe(1);
      expect(metaElems[0].getAttribute('content')).toBe('title');
    });
  });

  describe('description', () => {
    const selector = `meta[property="og:description"]`;
    test('should render og:description by passing `og.description` prop', () => {
      render(<SEO og={{ description: 'foo' }} />);
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems.length).toBe(1);
      expect(metaElems[0].getAttribute('content')).toBe('foo');
    });

    test('should render multiple og:description with same keys when multiple components exits', () => {
      render(
        <>
          <SEO og={{ description: 'first' }} />
          <SEO og={{ description: 'second' }} />
        </>
      );
      // In this case, Next.js render only second element since both elements have the same key.
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems[0].getAttribute('content')).toBe('first');
      expect(metaElems[1].getAttribute('content')).toBe('second');
      expect(checkHavingSameKeys(metaElems)).toBe(true);
    });

    test('should not render og:description when `og:description` prop is not set', () => {
      render(<SEO />);
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems.length).toBe(0);
    });

    test('should fallback to `description` prop', () => {
      render(<SEO description="description" />);
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems.length).toBe(1);
      expect(metaElems[0].getAttribute('content')).toBe('description');
    });

    test('should truncate description after `maxDescriptionCharacters`', () => {
      const longText = `But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the gre`;
      render(
        <SEO og={{ description: longText }} maxDescriptionCharacters={100} />
      );
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems[0].getAttribute('content')).toBe(
        longText.substr(0, 100)
      );
    });
  });

  describe('url', () => {
    const selector = `meta[property="og:url"]`;
    test('should render og:url by passing `og.url` prop', () => {
      render(<SEO og={{ url: 'https://example.com/foo' }} />);
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems.length).toBe(1);
      expect(metaElems[0].getAttribute('content')).toBe(
        'https://example.com/foo'
      );
    });

    test('should render multiple og:url with same keys when multiple components exits', () => {
      render(
        <>
          <SEO og={{ url: 'https://example.com/first' }} />
          <SEO og={{ url: 'https://example.com/second' }} />
        </>
      );
      // In this case, Next.js render only second element since both elements have the same key.
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems[0].getAttribute('content')).toBe(
        'https://example.com/first'
      );
      expect(metaElems[1].getAttribute('content')).toBe(
        'https://example.com/second'
      );
      expect(checkHavingSameKeys(metaElems)).toBe(true);
    });

    test('should not render og:url when `og:url` prop is not set', () => {
      render(<SEO />);
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems.length).toBe(0);
    });

    test('should fallback to `canonical` prop', () => {
      render(<SEO canonical="https://example.com/foo" />);
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems.length).toBe(1);
      expect(metaElems[0].getAttribute('content')).toBe(
        'https://example.com/foo'
      );
    });
  });

  describe('image', () => {
    const selector = `meta[property="og:image"]`;
    test('should render og:image by passing `og.image` prop', () => {
      render(<SEO og={{ image: 'https://example.com/foo.png' }} />);
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems.length).toBe(1);
      expect(metaElems[0].getAttribute('content')).toBe(
        'https://example.com/foo.png'
      );
    });

    test('should render multiple og:image with same keys when multiple components exits', () => {
      render(
        <>
          <SEO og={{ image: 'https://example.com/first.png' }} />
          <SEO og={{ image: 'https://example.com/second.png' }} />
        </>
      );
      // In this case, Next.js render only second element since both elements have the same key.
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems[0].getAttribute('content')).toBe(
        'https://example.com/first.png'
      );
      expect(metaElems[1].getAttribute('content')).toBe(
        'https://example.com/second.png'
      );
      expect(checkHavingSameKeys(metaElems)).toBe(true);
    });

    test('should not render og:image when `og:image` prop is not set', () => {
      render(<SEO />);
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems.length).toBe(0);
    });
  });

  describe('type', () => {
    const selector = `meta[property="og:type"]`;
    test('should render og:type by passing `og.type` prop', () => {
      render(<SEO og={{ type: 'article' }} />);
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems.length).toBe(1);
      expect(metaElems[0].getAttribute('content')).toBe('article');
    });

    test('should render multiple og:type with same keys when multiple components exits', () => {
      render(
        <>
          <SEO og={{ type: 'article' }} />
          <SEO og={{ type: 'website' }} />
        </>
      );
      // In this case, Next.js render only second element since both elements have the same key.
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems[0].getAttribute('content')).toBe('article');
      expect(metaElems[1].getAttribute('content')).toBe('website');
      expect(checkHavingSameKeys(metaElems)).toBe(true);
    });

    test('should not render og:type when `og:type` prop is not set', () => {
      render(<SEO />);
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems.length).toBe(0);
    });
  });

  describe('type', () => {
    const selector = `meta[property="og:site_name"]`;
    test('should render og:site_name by passing `og.siteName` prop', () => {
      render(<SEO og={{ siteName: 'foo' }} />);
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems.length).toBe(1);
      expect(metaElems[0].getAttribute('content')).toBe('foo');
    });

    test('should render multiple og:site_name with same keys when multiple components exits', () => {
      render(
        <>
          <SEO og={{ siteName: 'first' }} />
          <SEO og={{ siteName: 'second' }} />
        </>
      );
      // In this case, Next.js render only second element since both elements have the same key.
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems[0].getAttribute('content')).toBe('first');
      expect(metaElems[1].getAttribute('content')).toBe('second');
      expect(checkHavingSameKeys(metaElems)).toBe(true);
    });

    test('should not render og:site_name when `og:siteName` prop is not set', () => {
      render(<SEO />);
      const metaElems = document.querySelectorAll(selector);
      expect(metaElems.length).toBe(0);
    });
  });
});
