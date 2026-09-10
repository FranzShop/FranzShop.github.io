const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

export default async function handler(req, res) {
  try {
    if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
      return res.status(500).json({
        error: "Supabase environment variables are missing."
      });
    }

    const headers = {
      "apikey": SUPABASE_SECRET_KEY,
      "Authorization": `Bearer ${SUPABASE_SECRET_KEY}`,
      "Content-Type": "application/json"
    };

    // GET — get all products
    if (req.method === "GET") {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/products?select=*&order=id.asc`,
        {
          method: "GET",
          headers
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          error: data?.message || "Failed to get products."
        });
      }

      return res.status(200).json({
        products: data
      });
    }

    // POST — add product
    if (req.method === "POST") {
      const body = req.body || {};

      if (!body.name || body.price === undefined) {
        return res.status(400).json({
          error: "Product name and price are required."
        });
      }

      const product = {
        name: String(body.name),
        description: String(body.description || ""),
        price: Number(body.price) || 0,
        stock: Number(body.stock ?? 0),
        image: String(body.image || "")
      };

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/products`,
        {
          method: "POST",
          headers: {
            ...headers,
            "Prefer": "return=representation"
          },
          body: JSON.stringify(product)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          error: data?.message || "Failed to add product."
        });
      }

      return res.status(201).json({
        success: true,
        product: data[0]
      });
    }

    return res.status(405).json({
      error: "Method not allowed."
    });

  } catch (error) {
    return res.status(500).json({
      error: error?.message || "Server error."
    });
  }
        }
