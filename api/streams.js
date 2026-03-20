const EPORNER = 'https://www.eporner.com/api/v2';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'id required' });
  try {
    const r = await fetch(`${EPORNER}/video/${id}/?format=json`);
    const v = await r.json();
    res.json({
      id, embed: v.embed || `https://www.eporner.com/embed/${id}/`,
      streams: [{ type: 'embed', url: v.embed || `https://www.eporner.com/embed/${id}/`, quality: 'auto' }],
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
}
