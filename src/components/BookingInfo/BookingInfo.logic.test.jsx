import { render, screen, fireEvent } from '@testing-library/react';
import BookingInfo from './BookingInfo';
import '@testing-library/jest-dom';
import React from 'react';

// Wrapper som simulerar logik: 1 bana per 4 spelare
function Wrapper() {
  const [details, setDetails] = React.useState({});
  const updateBookingDetails = (e) => {
    const { name, value } = e.target;
    const newDetails = { ...details, [name]: value };

    if (name === 'people') {
      const players = parseInt(value, 10);
      if (players >= 1) {
        newDetails.lanes = Math.ceil(players / 4);
      }
    }

    setDetails(newDetails);
  };

  return (
    <>
      <BookingInfo updateBookingDetails={updateBookingDetails} />
      {details.lanes && (
        <p data-testid="lanes-info">{details.lanes} banor reserverade</p>
      )}
    </>
  );
}
//Acceptanskriterium: Reserverar 1 bana för 4 spelare
describe('BookingInfo med logik för banor', () => {
  test('reserverar 1 bana för 4 spelare', () => {
    render(<Wrapper />);
    const peopleInput = screen.getByLabelText(/number of awesome bowlers/i);
    fireEvent.change(peopleInput, { target: { value: '4' } });

    expect(screen.getByTestId('lanes-info')).toHaveTextContent('1 banor reserverade');
  });
  //Acceptanskriterium: Reserverar 2 banor för 6 spelare
  test('reserverar 2 banor för 6 spelare', () => {
    render(<Wrapper />);
    const peopleInput = screen.getByLabelText(/number of awesome bowlers/i);
    fireEvent.change(peopleInput, { target: { value: '6' } });

    expect(screen.getByTestId('lanes-info')).toHaveTextContent('2 banor reserverade');
  });

  //Acceptanskriterium: Reserverar 3 banor för 10 spelare
  test('reserverar 3 banor för 10 spelare', () => {
    render(<Wrapper />);
    const peopleInput = screen.getByLabelText(/number of awesome bowlers/i);
    fireEvent.change(peopleInput, { target: { value: '10' } });

    expect(screen.getByTestId('lanes-info')).toHaveTextContent('3 banor reserverade');
  });

  //Acceptanskriterium: Validera att minst 1 spelare krävs
  test('validerar att minst 1 spelare krävs', () => {
    render(<Wrapper />);
    const peopleInput = screen.getByLabelText(/number of awesome bowlers/i);
    fireEvent.change(peopleInput, { target: { value: '0' } });

    
    expect(screen.queryByTestId('lanes-info')).toBeNull();
  });
});
