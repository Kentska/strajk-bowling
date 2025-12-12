import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Navigation from "./Navigation";

function Booking() {
  return <h1 data-testid="booking-view">Booking view</h1>;
}

function Confirmation() {
  const booking = sessionStorage.getItem("booking");
  return booking ? (
    <section data-testid="confirmation-view">
      <p>Bokning: {booking}</p>
    </section>
  ) : (
    <p data-testid="no-booking">Ingen bokning gjord</p>
  );
}

describe("Navigation component", () => {
  // Acceptanskriterium: navigering till Booking-vyn
  test("navigerar till Booking-vyn", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Booking />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
        <Navigation />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("link", { name: /Booking/i }));
    expect(screen.getByTestId("booking-view")).toBeInTheDocument();
  });

  // Acceptanskriterium: navigering till Confirmation-vyn
  test("navigerar till Confirmation-vyn utan bokning", () => {
    sessionStorage.clear(); // ingen bokning gjord
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Booking />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
        <Navigation />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Confirmation/i));
    expect(screen.getByTestId("no-booking")).toHaveTextContent("Ingen bokning gjord");
  });

  // Acceptanskriterium: ingen bokning i session storage
  test("visar 'Ingen bokning gjord' om ingen bokning finns i session storage", () => {
    sessionStorage.clear();
    render(
      <MemoryRouter initialEntries={["/confirmation"]}>
        <Routes>
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId("no-booking")).toHaveTextContent("Ingen bokning gjord");
  });

  // Acceptanskriterium: bokning finns i session storage
  test("visar bokning från session storage om den finns", () => {
    sessionStorage.setItem("booking", "B-12345");
    render(
      <MemoryRouter initialEntries={["/confirmation"]}>
        <Routes>
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId("confirmation-view")).toHaveTextContent("B-12345");
  });
});

