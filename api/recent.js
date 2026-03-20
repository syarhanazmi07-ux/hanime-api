const EPORNER = 'https://www.eporner.com/api/v2';

function fmt(v) {
  return {
    id: v.id, slug: v.id,
    name: v.title || '',
    cover_url: v.default_thumb?.src || v.thumbs?.[4]?.src || v.thumbs?.[0]?.src || '',
    views: parseInt(v.views) || 0,
    tags: (v.keywords || '').split(',').map(t => t.trim()).filter(Boolean).slice(0, 8),
    embed: v.embed || `https://www.eporner.com/embed/${v.id}/`,
    length: v.length_min || '0',
    rate: v.rate || '0',
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  try {
    const page = Number(req.query.page) || 1;
    const r = await fetch(`${EPORNER}/video/search/?query=hentai+anime&per_page=30&page=${page}&format=json&order=newest&thumbsize=big`);
    const data = await r.json();
    res.json({
      results: (data.videos || []).map(fmt),
      page, total: data.total_count,
      hasNextPage: page < data.total_pages,
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
}
