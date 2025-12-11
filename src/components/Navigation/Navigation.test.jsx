// src/components/Navigation/Navigation.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Navigation from "./Navigation";

function Booking() {
  return <h1 data-testid="booking-view">Booking view</h1>;
}

function Confirmation() {
  return <h1 data-testid="confirmation-view">Confirmation view</h1>;
}

describe("Navigation component", () => {
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

  test("navigerar till Confirmation-vyn", () => {
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
    expect(screen.getByTestId("confirmation-view")).toBeInTheDocument();
  });
});
