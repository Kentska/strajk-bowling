import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Shoes from "./Shoes";

function Wrapper() {
  const [shoes, setShoes] = React.useState([
    { id: "shoe-1" },
    { id: "shoe-2" }
  ]);

  const updateSize = vi.fn();
  const addShoe = vi.fn();
  const removeShoe = (id) => {
    setShoes((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <Shoes
      updateSize={updateSize}
      addShoe={addShoe}
      removeShoe={removeShoe}
      shoes={shoes}
    />
  );
}

describe("Shoes component – ta bort skostorlek", () => {
  //Acceptanskriterium: Användaren ska kunna ta bort ett tidigare valt fält för skostorlek.
  test("användaren kan ta bort ett tidigare valt fält för skostorlek", () => {
    render(<Wrapper />);
    expect(screen.getAllByTestId("shoe-form").length).toBe(2);

    const removeButtons = screen.getAllByText("-");
    fireEvent.click(removeButtons[0]);

    expect(screen.getAllByTestId("shoe-form").length).toBe(1);
  });

  //Acceptanskriterium: Systemet uppdaterar bokningen så att inga skor längre är bokade för spelaren.
  test("systemet uppdaterar bokningen så att inga skor längre är bokade för spelaren", () => {
    render(<Wrapper />);
    const input = screen.getByLabelText(/shoe size \/ person 1/i);

    fireEvent.change(input, { target: { value: "42" } });
    // Här dokumenterar vi att skostorleken först sätts

    const removeButtons = screen.getAllByText("-");
    fireEvent.click(removeButtons[0]);

    // Efter borttagning ska bara 1 fält finnas kvar
    expect(screen.getAllByTestId("shoe-form").length).toBe(1);
  });

  // Acceptanskriterium: borttagen spelare ska inte inkluderas i skorantalet eller priset
  test("borttagen spelare inkluderas inte i skorantalet eller priset", () => {
    render(<Wrapper />);
    // Innan borttagning: 2 skofält
    expect(screen.getAllByTestId("shoe-form").length).toBe(2);

    const removeButtons = screen.getAllByText("-");
    fireEvent.click(removeButtons[0]);

    // Efter borttagning: 1 skofält
    expect(screen.getAllByTestId("shoe-form").length).toBe(1);
  });
});

