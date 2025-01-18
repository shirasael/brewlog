import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../components/SearchBar';

describe('SearchBar', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with default placeholder', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText('Search brews by bean type, method...');
    expect(input).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    const customPlaceholder = 'Custom placeholder';
    render(<SearchBar value="" onChange={mockOnChange} placeholder={customPlaceholder} />);
    
    const input = screen.getByPlaceholderText(customPlaceholder);
    expect(input).toBeInTheDocument();
  });

  it('displays the provided value', () => {
    const value = 'Ethiopian';
    render(<SearchBar value={value} onChange={mockOnChange} />);
    
    const input = screen.getByDisplayValue(value);
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('test');
  });

  it('shows clear button only when there is input', () => {
    const { rerender } = render(<SearchBar value="" onChange={mockOnChange} />);
    
    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
    
    rerender(<SearchBar value="test" onChange={mockOnChange} />);
    expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
  });

  it('clears input when clear button is clicked', () => {
    render(<SearchBar value="test" onChange={mockOnChange} />);
    
    const clearButton = screen.getByRole('button', { name: /clear search/i });
    fireEvent.click(clearButton);
    
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('has proper accessibility attributes', () => {
    render(<SearchBar value="test" onChange={mockOnChange} />);
    
    expect(screen.getByLabelText('Search brews')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
  });

  it('renders search icon', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    const searchIcon = document.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
  });
}); 