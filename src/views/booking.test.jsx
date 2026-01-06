import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Booking from "./Booking";

// Mocka useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe("Booking – komplett flöde med MSW", () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockNavigate.mockReset();
  });

  test("användaren kan genomföra en fullständig bokning", async () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    // 1. Fyll i datum
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: "2025-12-11" }
    });

    // 2. Fyll i tid
    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "18:00" }
    });

    // 3. Fyll i antal spelare
    fireEvent.change(screen.getByLabelText(/number of awesome bowlers/i), {
      target: { value: "4" }
    });

    // 4. Fyll i antal banor
    fireEvent.change(screen.getByLabelText(/number of lanes/i), {
      target: { value: "1" }
    });

    // 5. Lägg till 4 skor
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("+"));

    // 6. Fyll i skostorlekar
    fireEvent.change(screen.getByLabelText(/shoe size \/ person 1/i), {
      target: { value: "42" }
    });
    fireEvent.change(screen.getByLabelText(/shoe size \/ person 2/i), {
      target: { value: "43" }
    });
    fireEvent.change(screen.getByLabelText(/shoe size \/ person 3/i), {
      target: { value: "44" }
    });
    fireEvent.change(screen.getByLabelText(/shoe size \/ person 4/i), {
      target: { value: "45" }
    });

    // 7. Klicka på boka-knappen
    fireEvent.click(
      screen.getByRole("button", { name: "strIIIIIike!" })
    );

    // 8. Vänta på att MSW svarar och navigering sker
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });

    // 9. Kontrollera att navigate anropades korrekt
expect(mockNavigate).toHaveBeenCalledWith("/confirmation", {
  state: {
    confirmationDetails: expect.objectContaining({
      when: "2025-12-11T18:00",
      people: "4",
      lanes: "1",
      shoes: ["42", "43", "44", "45"],
      bookingId: "TEST-12345",
      price: 580,
      priceBreakdown: {
        players: 480,
        lanes: 100
      }
    })
  }
});


    // 10. Kontrollera att sessionStorage sparades
    const stored = JSON.parse(sessionStorage.getItem("confirmation"));
    expect(stored.people).toBe("4");
    expect(stored.lanes).toBe("1");
    expect(stored.shoes).toEqual(["42", "43", "44", "45"]);
  });

  test("visar felmeddelande om fält saknas", () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", { name: "strIIIIIike!" })
    );

    expect(
      screen.getByText(/alla fälten måste vara ifyllda/i)
    ).toBeInTheDocument();
  });

  test("visar fel om antal skor inte matchar antal spelare", () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: "2025-12-11" }
    });
    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "18:00" }
    });
    fireEvent.change(screen.getByLabelText(/number of awesome bowlers/i), {
      target: { value: "2" }
    });
    fireEvent.change(screen.getByLabelText(/number of lanes/i), {
      target: { value: "1" }
    });

    // Bara 1 sko
    fireEvent.click(screen.getByText("+"));
    fireEvent.change(screen.getByLabelText(/shoe size \/ person 1/i), {
      target: { value: "42" }
    });

    fireEvent.click(
      screen.getByRole("button", { name: "strIIIIIike!" })
    );

    expect(
      screen.getByText(/antalet skor måste stämma överens/i)
    ).toBeInTheDocument();
  });

  test("visar fel om spelare överskrider max 4 per bana", () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: "2025-12-11" }
    });
    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "18:00" }
    });
    fireEvent.change(screen.getByLabelText(/number of awesome bowlers/i), {
      target: { value: "5" }
    });
    fireEvent.change(screen.getByLabelText(/number of lanes/i), {
      target: { value: "1" }
    });

    // Lägg till 5 skor så att validering #2 passeras
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("+"));

    fireEvent.change(screen.getByLabelText(/shoe size \/ person 1/i), {
      target: { value: "42" }
    });
    fireEvent.change(screen.getByLabelText(/shoe size \/ person 2/i), {
      target: { value: "43" }
    });
    fireEvent.change(screen.getByLabelText(/shoe size \/ person 3/i), {
      target: { value: "44" }
    });
    fireEvent.change(screen.getByLabelText(/shoe size \/ person 4/i), {
      target: { value: "45" }
    });
    fireEvent.change(screen.getByLabelText(/shoe size \/ person 5/i), {
      target: { value: "46" }
    });

    fireEvent.click(
      screen.getByRole("button", { name: "strIIIIIike!" })
    );

    expect(
      screen.getByText(/det får max vara 4 spelare per bana/i)
    ).toBeInTheDocument();
  });
});
