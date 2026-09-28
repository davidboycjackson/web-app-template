 import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from './HomePage';

describe('HomePage', () => {
  it('renders the application title', () => {
    render(<HomePage />);

    expect(screen.getByTestId('page-header')).toHaveTextContent('Homepage');
  });
});