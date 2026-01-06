import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Confirmation from "./Confirmation";

// Mocka useLocation
const mockUseLocation = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => mockUseLocation()
  };
});

describe("Confirmation – visning av bokningsinformation", () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockUseLocation.mockReset();
  });

  test("visar bokningsinformation från state", () => {
    mockUseLocation.mockReturnValue({
      state: {
        confirmationDetails: {
          when: "2025-12-11T18:00",
          people: 4,
          lanes: 1,
          shoes: ["42"],
          bookingId: "TEST-12345",
          price: 400
        }
      }
    });

    render(
      <MemoryRouter>
        <Confirmation />
      </MemoryRouter>
    );

    // Datum + tid
    expect(screen.getByDisplayValue("2025-12-11 18:00")).toBeInTheDocument();

    // Who
    expect(screen.getByDisplayValue("4")).toBeInTheDocument();

    // Lanes
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();

    // Booking number
    expect(screen.getByDisplayValue("TEST-12345")).toBeInTheDocument();

    // Price via test-id
    expect(screen.getByTestId("total-price")).toHaveTextContent("400 sek");
  });

  test("visar bokningsinformation från sessionStorage om state saknas", () => {
    mockUseLocation.mockReturnValue({ state: null });

    sessionStorage.setItem(
      "confirmation",
      JSON.stringify({
        when: "2025-12-11T18:00",
        people: 3,
        lanes: 1,
        shoes: ["40", "41", "42"],
        bookingId: "ABC999",
        price: 300
      })
    );

    render(
      <MemoryRouter>
        <Confirmation />
      </MemoryRouter>
    );

    expect(screen.getByDisplayValue("2025-12-11 18:00")).toBeInTheDocument();
    expect(screen.getByDisplayValue("3")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("ABC999")).toBeInTheDocument();

    // Price via test-id
    expect(screen.getByTestId("total-price")).toHaveTextContent("300 sek");
  });

  test("visar felmeddelande om ingen bokning finns", () => {
    mockUseLocation.mockReturnValue({ state: null });
    sessionStorage.clear();

    render(
      <MemoryRouter>
        <Confirmation />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/inga bokning gjord!/i)
    ).toBeInTheDocument();
  });
});
