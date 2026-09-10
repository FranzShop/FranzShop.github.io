export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({
      products: []
    });
  }

  if (req.method === "POST") {
    return res.status(200).json({
      success: true,
      product: req.body || {}
    });
  }

  if (req.method === "DELETE") {
    return res.status(200).json({
      success: true
    });
  }

  return res.status(405).json({
    error: "Method not allowed."
  });
}
