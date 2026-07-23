export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Halaman depan keren (seperti api.siputzx.my.id)
    if (path === '/') {
      const cf = request.cf || {};
      const ip = request.headers.get('CF-Connecting-IP') || 'Tidak diketahui';
      const userAgent = request.headers.get('User-Agent') || 'Tidak diketahui';
      const country = cf.country || 'N/A';
      const city = cf.city || 'N/A';
      const device = cf.deviceType || 'desktop';

      const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Elvora API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui;
      background: linear-gradient(135deg, #0d0d1a, #1a1a3e);
      color: #e0e0ff;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(16px);
      border-radius: 24px;
      padding: 40px 30px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.1);
    }
    h1 { font-size: 2.8rem; color: #c084fc; text-align: center; margin-bottom: 10px; }
    .subtitle { text-align: center; color: #a5b4fc; margin-bottom: 30px; }
    .info-card {
      background: rgba(255,255,255,0.08);
      padding: 16px;
      border-radius: 12px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .info-label { color: #a5b4fc; text-transform: uppercase; font-size: 0.8rem; }
    .info-value { font-weight: 600; }
    .endpoints {
      margin-top: 30px;
      background: rgba(192,132,252,0.1);
      padding: 16px;
      border-radius: 12px;
      border: 1px solid rgba(192,132,252,0.3);
      text-align: center;
    }
    code {
      background: rgba(255,255,255,0.1);
      padding: 2px 8px;
      border-radius: 6px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚡ Elvora API</h1>
    <p class="subtitle">REST API Gateway — Cepat, Elegan, Andal</p>
    
    <div class="info-card">
      <span class="info-label">IP</span>
      <span class="info-value">${ip}</span>
    </div>
    <div class="info-card">
      <span class="info-label">Negara</span>
      <span class="info-value">${country}</span>
    </div>
    <div class="info-card">
      <span class="info-label">Kota</span>
      <span class="info-value">${city}</span>
    </div>
    <div class="info-card">
      <span class="info-label">Device</span>
      <span class="info-value">${device}</span>
    </div>

    <div class="endpoints">
      <p>🔗 Endpoint segera hadir:</p>
      <p style="margin-top:8px;">
        <code>GET /hello</code> &nbsp;|&nbsp;
        <code>GET /anime/search</code> &nbsp;|&nbsp;
        <code>GET /downloader/tiktok</code>
      </p>
    </div>
  </div>
</body>
</html>`;

      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Endpoint contoh
    if (path === '/hello') {
      return new Response(JSON.stringify({ message: 'Hello from Elvora API' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 404
    return new Response('Not Found', { status: 404 });
  }
};
