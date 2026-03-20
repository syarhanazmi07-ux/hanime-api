const EPORNER = "https://www.eporner.com/api/v2";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const id = req.query.id || req.query.slug;
  if (!id) return res.status(400).json({ error: "id required" });
  try {
    const r = await fetch(EPORNER + "/video/search/?query=" + id + "&per_page=1&format=json&thumbsize=big");
    const data = await r.json();
    const v = data.videos?.[0];
    if (!v) return res.status(404).json({ error: "Not found" });
    res.json({
      id: v.id, slug: v.id,
      title: v.title || "",
      name: v.title || "",
      cover_url: v.default_thumb?.src || v.thumbs?.[4]?.src || "",
      poster: v.default_thumb?.src || "",
      description: "",
      tags: (v.keywords || "").split(",").map(t => t.trim()).filter(Boolean),
      views: parseInt(v.views) || 0,
      rate: v.rate || "0",
      length: v.length_min || "0",
      embed: v.embed || "https://www.eporner.com/embed/" + v.id + "/",
      brand: "eporner",
    });
  } catch(e) { res.status(500).json({ error: e.message }); }
}
