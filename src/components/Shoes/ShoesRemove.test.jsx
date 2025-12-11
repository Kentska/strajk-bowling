// src/components/ShoesRemove.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Shoes from "./Shoes";

describe("Shoes component – ta bort skostorlek", () => {
  const setup = () => {
    const updateSize = vi.fn();
    const addShoe = vi.fn();
    const removeShoe = vi.fn();
    const shoes = [{ id: "shoe-1" }, { id: "shoe-2" }];

    render(
      <Shoes
        updateSize={updateSize}
        addShoe={addShoe}
        removeShoe={removeShoe}
        shoes={shoes}
      />
    );

    return { updateSize, addShoe, removeShoe };
  };

  test("användaren kan ta bort ett tidigare valt fält för skostorlek", () => {
    const { removeShoe } = setup();
    const removeButtons = screen.getAllByText("-");
    fireEvent.click(removeButtons[0]);
    expect(removeShoe).toHaveBeenCalledWith("shoe-1");
  });

  test("systemet uppdaterar bokningen så att inga skor längre är bokade för spelaren", () => {
    const { updateSize, removeShoe } = setup();
    const input = screen.getByLabelText(/shoe size \/ person 1/i);

    fireEvent.change(input, { target: { value: "42" } });
    expect(updateSize).toHaveBeenCalled();

    const removeButtons = screen.getAllByText("-");
    fireEvent.click(removeButtons[0]);
    expect(removeShoe).toHaveBeenCalledWith("shoe-1");
    // Här dokumenterar vi att skostorleken tas bort ur bokningen
  });
});
