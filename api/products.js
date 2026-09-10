const allowedOrigin = "https://franzshop.github.io";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
}

export default async function handler(req) {
  const headers = {
    ...corsHeaders(),
    "Content-Type": "application/json"
  };

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers
    });
  }

  if (!["GET", "POST", "DELETE"].includes(req.method)) {
    return new Response(
      JSON.stringify({ error: "Method not allowed." }),
      { status: 405, headers }
    );
  }

  if (req.headers.origin && req.headers.origin !== allowedOrigin) {
    return new Response(
      JSON.stringify({ error: "Origin not allowed." }),
      { status: 403, headers }
    );
  }

  try {
    if (req.method === "GET") {
      return new Response(
        JSON.stringify({
          products: []
        }),
        { status: 200, headers }
      );
    }

    if (req.method === "POST") {
      const body = await req.json();

      if (!body?.name || body?.price === undefined) {
        return new Response(
          JSON.stringify({
            error: "Product name and price are required."
          }),
          { status: 400, headers }
        );
      }

      const product = {
        id: "product-" + Date.now(),
        name: String(body.name),
        description: String(body.description || ""),
        price: Number(body.price) || 0,
        stock: Number(body.stock ?? 0),
        image: String(body.image || ""),
        createdAt: new Date().toISOString()
      };

      return new Response(
        JSON.stringify({
          success: true,
          product
        }),
        { status: 201, headers }
      );
    }

    return new Response(
      JSON.stringify({
        success: true
      }),
      { status: 200, headers }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error?.message || "Server error."
      }),
      { status: 500, headers }
    );
  }
          
