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
    // In this case, Next.js render only second title since both elements have the same key.
    // https://nextjs.org/docs/api-reference/next/head
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

  test('should render multiple canonical links when 2 components exits', () => {
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
  });
});
