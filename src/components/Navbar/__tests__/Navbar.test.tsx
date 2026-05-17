import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { Navbar } from '../Navbar';

describe('Navbar', () => {
  it('renders the brand name', () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getByText('ProjectHub')).toBeInTheDocument();
  });
});
