import { http } from "msw";

export const handlers = [
  http.post(
    "https://731xy9c2ak.execute-api.eu-north-1.amazonaws.com/booking",
    async ({ request }) => {
      const body = await request.json();

      return new Response(
        JSON.stringify({
          bookingDetails: {
            when: body.when,
            people: body.people,
            lanes: body.lanes,
            shoes: body.shoes,
            bookingId: "TEST-12345",
            price: body.people * 120 + body.lanes * 100,
            priceBreakdown: {
            players: body.people * 120,
            lanes: body.lanes * 100
}

          }
        }),
        { status: 200 }
      );
    }
  )
];
