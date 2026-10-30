// Cloudflare Pages Function: /api/user/profile
// Trả về 410 Gone
export const onRequest = async (): Promise<Response> => {
  return new Response(null, {
    status: 410,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
};
