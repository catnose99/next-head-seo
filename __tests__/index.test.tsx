import { render, screen } from '@testing-library/react';
import SEO from '../index';
import React, { useEffect } from 'react';

jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>
  };
});

describe('title', () => {
  test('should render title element when title is set', () => {
    render(<SEO title="foo" />);

    expect(document.title).toBe('foo');
  });
  test('should not render title element when title is not set', () => {
    render(<SEO />);

    expect(document.getElementsByTagName('title').length).toBe(0);
  });
});
