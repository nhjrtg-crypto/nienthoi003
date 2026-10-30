// Cloudflare Pages Function: /api/user/progress
// Trả về 410 Gone để báo hiệu endpoint đã vĩnh viễn ngừng hoạt động
export const onRequest = async (): Promise<Response> => {
  return new Response(null, {
    status: 410,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
};
