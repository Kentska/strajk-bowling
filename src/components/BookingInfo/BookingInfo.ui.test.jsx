import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookingInfo from './BookingInfo';
import '@testing-library/jest-dom';

describe('BookingInfo', () => {
  test('låter användaren välja datum och tid', () => {
    const mockUpdate = vi.fn();
    render(<BookingInfo updateBookingDetails={mockUpdate} />);

    // välj datum
    const dateInput = screen.getByLabelText(/date/i);
    fireEvent.change(dateInput, { target: { value: '2025-12-11' } });
    expect(mockUpdate).toHaveBeenCalledWith(expect.any(Object));

    // välj tid
    const timeInput = screen.getByLabelText(/time/i);
    fireEvent.change(timeInput, { target: { value: '18:00' } });
    expect(mockUpdate).toHaveBeenCalledWith(expect.any(Object));
  });

  test('låter användaren ange antal spelare', () => {
    const mockUpdate = vi.fn();
    render(<BookingInfo updateBookingDetails={mockUpdate} />);

    const peopleInput = screen.getByLabelText(/number of awesome bowlers/i);
    fireEvent.change(peopleInput, { target: { value: '4' } });

    expect(peopleInput).toHaveValue(4);
    expect(mockUpdate).toHaveBeenCalled();
  });

  test('låter användaren ange antal banor', () => {
    const mockUpdate = vi.fn();
    render(<BookingInfo updateBookingDetails={mockUpdate} />);

    const lanesInput = screen.getByLabelText(/number of lanes/i);
    fireEvent.change(lanesInput, { target: { value: '2' } });

    expect(lanesInput).toHaveValue(2);
    expect(mockUpdate).toHaveBeenCalled();
  });
});
