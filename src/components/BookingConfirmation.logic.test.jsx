import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

function BookingConfirmation({ players, lanes }) {
  const [confirmed, setConfirmed] = React.useState(null);

  const finishBooking = () => {
    const bookingNumber = "B-" + Math.floor(Math.random() * 100000);
    const total = players * 120 + lanes * 100;
    setConfirmed({ bookingNumber, total });
  };

  return (
    <div>
      <button onClick={finishBooking}>Slutför bokning</button>
      {confirmed && (
        <section data-testid="confirmation">
          <p>Bokningsnummer: {confirmed.bookingNumber}</p>
          <p>Totalt: {confirmed.total} kr</p>
          <p>
            {players} spelare á 120 kr = {players * 120} kr
          </p>
          <p>
            {lanes} banor á 100 kr = {lanes * 100} kr
          </p>
        </section>
      )}
    </div>
  );
}
//Acceptanskriterium: Användaren ska kunna slutföra bokningen genom att klicka på en "slutför bokning"-knapp.
//Acceptanskriterium: Systemet ska generera ett bokningsnummer och visa detta till användaren efter att bokningen är slutförd.
describe("BookingConfirmation", () => {
  test("användaren kan slutföra bokningen och få bokningsnummer", () => {
    render(<BookingConfirmation players={4} lanes={1} />);
    fireEvent.click(screen.getByText(/slutför bokning/i));
    expect(screen.getByTestId("confirmation")).toHaveTextContent(/Bokningsnummer:/);
  });
  //Acceptanskriterium: Systemet ska beräkna och visa den totala kostnaden för bokningen baserat på antal spelare och banor.
  //Acceptanskriterium: Den totala summan ska visas tydligt på bekräftelsesidan och inkludera en uppdelning mellan spelare och banor.
  test("systemet beräknar totalsumma korrekt", () => {
    render(<BookingConfirmation players={4} lanes={1} />);
    fireEvent.click(screen.getByText(/slutför bokning/i));
    expect(screen.getByTestId("confirmation")).toHaveTextContent("Totalt: 580 kr");
    expect(screen.getByTestId("confirmation")).toHaveTextContent("4 spelare á 120 kr = 480 kr");
    expect(screen.getByTestId("confirmation")).toHaveTextContent("1 banor á 100 kr = 100 kr");
  });
});
