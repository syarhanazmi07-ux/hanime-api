const EPORNER = "https://www.eporner.com/api/v2";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const id = req.query.id || req.query.slug;
  if (!id) return res.status(400).json({ error: "id required" });
  try {
    const r = await fetch(EPORNER + "/video/" + id + "/?format=json&thumbsize=big&gay=1");
    const text = await r.text();
    let v;
    try { v = JSON.parse(text); } catch(e) { return res.status(500).json({ error: "Invalid JSON from upstream", raw: text.slice(0,200) }); }
    if (!v || !v.id) return res.status(404).json({ error: "Not found", id });
    res.json({
      id: v.id, slug: v.id,
      title: v.title || "",
      name: v.title || "",
      cover_url: v.default_thumb?.src || "",
      poster: v.default_thumb?.src || "",
      description: v.description || "",
      tags: (v.keywords || "").split(",").map(t => t.trim()).filter(Boolean),
      views: parseInt(v.views) || 0,
      rate: v.rate || "0",
      length: v.length_min || "0",
      embed: v.embed || "https://www.eporner.com/embed/" + v.id + "/",
      brand: "eporner",
    });
  } catch(e) { res.status(500).json({ error: e.message }); }
}
