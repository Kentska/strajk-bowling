import { http } from 'msw';

export const handlers = [
  http.post('/api/bookings', async ({ request }) => {
    return new Response(
      JSON.stringify({ message: 'Booking created!' }),
      { status: 200 }
    );
  }),
];