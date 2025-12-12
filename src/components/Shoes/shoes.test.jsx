import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import Shoes from './Shoes';

describe('Shoes component', () => {
  const setup = (initialShoes = [{ id: 'shoe-1' }, { id: 'shoe-2' }]) => {
    const updateSize = vi.fn();
    const addShoe = vi.fn();
    const removeShoe = vi.fn();

    render(
      <Shoes
        updateSize={updateSize}
        addShoe={addShoe}
        removeShoe={removeShoe}
        shoes={initialShoes}
      />
    );

    return { updateSize, addShoe, removeShoe };
  };
  //Acceptanskriterium: Användaren ska kunna ange skostorlek för varje spelare.
  test('användaren kan ange skostorlek för varje spelare', () => {
    const { updateSize } = setup();
    const input1 = screen.getByLabelText(/shoe size \/ person 1/i);
    const input2 = screen.getByLabelText(/shoe size \/ person 2/i);

    fireEvent.change(input1, { target: { value: '42' } });
    fireEvent.change(input2, { target: { value: '38' } });

    expect(updateSize).toHaveBeenCalledTimes(2);
  });
  //Acceptanskriterium: Användaren ska kunna ändra skostorlek för en spelare.
  test('användaren kan ändra skostorlek för en spelare', () => {
    const { updateSize } = setup();
    const input1 = screen.getByLabelText(/shoe size \/ person 1/i);

    fireEvent.change(input1, { target: { value: '40' } });
    fireEvent.change(input1, { target: { value: '41' } });

    expect(updateSize).toHaveBeenCalledTimes(2);
  });
  //Acceptanskriterium: Det går att välja skostorlek för alla spelare som ingår i bokningen.
  test('det går att välja skostorlek för alla spelare i bokningen', () => {
    const { updateSize } = setup([{ id: 'shoe-1' }, { id: 'shoe-2' }, { id: 'shoe-3' }]);
    const inputs = [
      screen.getByLabelText(/shoe size \/ person 1/i),
      screen.getByLabelText(/shoe size \/ person 2/i),
      screen.getByLabelText(/shoe size \/ person 3/i),
    ];

    fireEvent.change(inputs[0], { target: { value: '39' } });
    fireEvent.change(inputs[1], { target: { value: '42' } });
    fireEvent.change(inputs[2], { target: { value: '44' } });

    expect(updateSize).toHaveBeenCalledTimes(3);
  });

  test('användaren kan lägga till ett nytt skostorleksfält', () => {
    const { addShoe } = setup();
    const addButton = screen.getByText('+');
    fireEvent.click(addButton);
    expect(addShoe).toHaveBeenCalled();
  });

  test('användaren kan ta bort ett skostorleksfält', () => {
    const { removeShoe } = setup();
    const removeButton = screen.getAllByText('-')[0];
    fireEvent.click(removeButton);
    expect(removeShoe).toHaveBeenCalled();
  });
});
