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
  test('should render title element with title prop', () => {
    render(<SEO title="foo" />);
    expect(document.title).toBe('foo');
  });

  test('should render title element with title prop', () => {
    render(<SEO title="foo" />);
    expect(document.title).toBe('foo');
  });

  test('should render multiple title with same keys when multiple components exits', () => {
    render(
      <>
        <SEO title="first" />
        <SEO title="second" />
      </>
    );
    // In this case, Next.js render only second title since both title elements have the same key.
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
  test('should render canonical link tag with canonical prop', () => {
    render(<SEO title="foo" canonical="http://example.com/foo" />);
    const canonicalLinks = document.querySelectorAll(`link[rel="canonical"]`);
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
    // In this case, Next.js render only second links since both elements have the same key.
    // https://nextjs.org/docs/api-reference/next/head
    const canonicalLinks = document.querySelectorAll(`link[rel="canonical"]`);
    expect(checkHavingSameKeys(canonicalLinks)).toBe(true);
    expect(canonicalLinks[1].getAttribute('href')).toBe(
      'http://example.com/second'
    );
  });

  test('should not render canonical links when canonical prop is not set', () => {
    render(<SEO title="foo" />);
    const titles = document.querySelectorAll(`link[rel="canonical"]`);
    expect(titles.length).toBe(0);
  });
});

describe('robots', () => {
  test('should render meta robots with `noindex` when robots prop value is `noindex`', () => {
    render(<SEO robots="noindex" />);
    const metaRobots = document.querySelectorAll(`meta[name="robots"]`);
    expect(metaRobots.length).toBe(1);
    expect(metaRobots[0].getAttribute('content')).toBe('noindex');
  });

  test('should render meta robots with `noindex, nofollow` when robots prop value is `noindex, nofollow', () => {
    render(<SEO robots="noindex, nofollow" />);
    const metaRobots = document.querySelectorAll(`meta[name="robots"]`);
    expect(metaRobots[0].getAttribute('content')).toBe('noindex, nofollow');
  });

  test('should render multiple meta robots with same keys when multiple components exits', () => {
    render(
      <>
        <SEO robots="noindex" />
        <SEO robots="noindex, nofollow" />
      </>
    );
    // In this case, Next.js render only second links since both elements have the same key.
    // https://nextjs.org/docs/api-reference/next/head
    const metaRobots = document.querySelectorAll(`meta[name="robots"]`);
    expect(checkHavingSameKeys(metaRobots)).toBe(true);
    expect(metaRobots[1].getAttribute('content')).toBe('noindex, nofollow');
  });
});

// describe('description', () => {
//   test('', () => {});

//   test('', () => {});
//   test('descriptionMaxLengthが指定されていると・・・・・・', () => {});
// });

// describe('twitter', () => {
//   describe('card', () => {
//     test('', () => {});

//     test('', () => {});
//   });

//   describe('site', () => {
//     test('', () => {});

//     test('', () => {});
//   });
// });

// describe('facebook', () => {
//   describe('appId', () => {
//     test('', () => {});

//     test('', () => {});
//   });
// });

// describe('meta', () => {
//   test('', () => {});

//   test('', () => {});
// });

// describe('link', () => {
//   test('', () => {});

//   test('', () => {});
// });

// describe('og', () => {
//   describe('title', () => {
//     test('', () => {});

//     test('', () => {});
//   });

//   describe('description', () => {
//     test('', () => {});

//     test('', () => {});
//   });

//   describe('url', () => {
//     test('', () => {});

//     test('', () => {});
//   });

//   describe('image', () => {
//     test('', () => {});

//     test('', () => {});
//   });

//   describe('type', () => {
//     test('', () => {});

//     test('', () => {});
//   });

//   describe('siteName', () => {
//     test('', () => {});

//     test('', () => {});
//   });
// });
