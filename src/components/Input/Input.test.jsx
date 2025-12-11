import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

describe('Input component', () => {
  test('renderar label och input med rätt props', () => {
    const mockChange = vi.fn();
    render(
      <Input
        label="Number of players"
        type="number"
        name="players"
        handleChange={mockChange}
        defaultValue="2"
      />
    );

    const label = screen.getByText(/number of players/i);
    const input = screen.getByRole('spinbutton'); // number input

    expect(label).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'players');
    expect(input).toHaveValue(2);
  });

  test('triggar handleChange när värdet ändras', () => {
    const mockChange = vi.fn();
    render(
      <Input
        label="Date"
        type="date"
        name="date"
        handleChange={mockChange}
      />
    );

    const input = screen.getByLabelText(/date/i);
    fireEvent.change(input, { target: { value: '2025-12-11' } });

    expect(mockChange).toHaveBeenCalled();
    expect(input).toHaveValue('2025-12-11');
  });

  test('kan vara disabled', () => {
    render(
      <Input
        label="Disabled field"
        type="text"
        name="disabledField"
        disabled={true}
      />
    );

    const input = screen.getByLabelText(/disabled field/i);
    expect(input).toBeDisabled();
  });

  test('accepterar maxLength', () => {
    render(
      <Input
        label="Short text"
        type="text"
        name="shortText"
        maxLength={5}
      />
    );

    const input = screen.getByLabelText(/short text/i);
    expect(input).toHaveAttribute('maxLength', '5');
  });
});
