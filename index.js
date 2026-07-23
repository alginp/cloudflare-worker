export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Data dari Cloudflare
    const cf = request.cf || {};
    const headers = Object.fromEntries(request.headers);
    const ip = request.headers.get('CF-Connecting-IP') || '127.0.0.1';

    // Data JSON untuk dikirim atau ditampilkan
    const dataJson = {
      ip: ip,
      method: request.method,
      url: request.url,
      cf: cf,
      headers: headers
    };

    // Routing
    if (path === '/') {
      return new Response(generateHTML(dataJson), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    if (path === '/hello') {
      return new Response(JSON.stringify({ message: 'Hello from Elvora API' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404 });
  }
};

function generateHTML(data) {
  const { cf, ip, headers } = data;
  
  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Elvora API - Dashboard Info</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700&family=JetBrains+Mono&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-main: #0a0c12;
            --bg-card: #12151e;
            --accent: #3b82f6; /* Blue Accent */
            --text-muted: #94a3b8;
        }
        body { 
            background-color: var(--bg-main); 
            color: #f8fafc; 
            font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .glass-card {
            background: var(--bg-card);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 1rem;
        }
        .mono { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; }
        #map { height: 300px; width: 100%; border-radius: 0.75rem; z-index: 10; }
        .badge {
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: bold;
        }
        .badge-blue { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
        .badge-green { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: var(--bg-main); }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
    </style>
</head>
<body class="p-4 md:p-8">

    <div class="max-w-5xl mx-auto">
        <!-- Header -->
        <header class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
                <h1 class="text-2xl font-bold tracking-tight text-blue-500">⚡ ELVORA<span class="text-white">API</span></h1>
                <p class="text-sm text-slate-400">Rest API Gateway & Client Information</p>
            </div>
            <div class="flex gap-2">
                <button onclick="copyJson()" class="bg-slate-800 hover:bg-slate-700 text-sm px-4 py-2 rounded-lg transition border border-slate-700">Copy JSON</button>
                <a href="https://app.elvora.id" class="bg-blue-600 hover:bg-blue-500 text-sm px-4 py-2 rounded-lg transition font-semibold">Playground</a>
            </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <!-- Map & Primary Info -->
            <div class="lg:col-span-8 space-y-6">
                <div class="glass-card p-2">
                    <div id="map"></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="glass-card p-5">
                        <p class="text-xs text-slate-500 uppercase font-bold mb-1">IP Address</p>
                        <h2 class="text-2xl font-bold text-blue-400 mono">${ip}</h2>
                        <div class="mt-4 flex flex-wrap gap-2 text-xs">
                            <span class="badge badge-blue">IPv4</span>
                            <span class="badge badge-blue">${data.method}</span>
                            <span class="badge badge-blue">HTTP/2</span>
                        </div>
                    </div>
                    <div class="glass-card p-5">
                        <p class="text-xs text-slate-500 uppercase font-bold mb-1">Location</p>
                        <h2 class="text-xl font-semibold">${cf.city || 'Unknown'}, ${cf.regionCode || 'N/A'}</h2>
                        <p class="text-sm text-slate-400 mt-1">${cf.country || 'ID'} — ${cf.continent || 'AS'}</p>
                    </div>
                </div>

                <!-- Request Info Table -->
                <div class="glass-card overflow-hidden">
                    <div class="bg-slate-800/50 px-5 py-3 border-b border-white/5">
                        <h3 class="text-sm font-bold uppercase tracking-wider">Request Information</h3>
                    </div>
                    <div class="p-5 space-y-3 mono text-sm">
                        <div class="flex justify-between border-b border-white/5 pb-2">
                            <span class="text-slate-500">Method</span> <span class="text-blue-400 font-bold">${data.method}</span>
                        </div>
                        <div class="flex justify-between border-b border-white/5 pb-2">
                            <span class="text-slate-500">Redirect</span> <span>manual</span>
                        </div>
                        <div class="flex justify-between border-b border-white/5 pb-2">
                            <span class="text-slate-500">Sec-Fetch-Dest</span> <span>${headers['sec-fetch-dest'] || 'none'}</span>
                        </div>
                        <div class="flex justify-between border-b border-white/5 pb-2">
                            <span class="text-slate-500">Sec-Fetch-Mode</span> <span>${headers['sec-fetch-mode'] || 'none'}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-500">Sec-Fetch-Site</span> <span>${headers['sec-fetch-site'] || 'none'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar Info -->
            <div class="lg:col-span-4 space-y-6">
                
                <!-- Cloudflare Edge -->
                <div class="glass-card">
                    <div class="bg-blue-900/20 px-5 py-3 border-b border-blue-500/20">
                        <h3 class="text-sm font-bold uppercase text-blue-400">Cloudflare Edge</h3>
                    </div>
                    <div class="p-5 space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="text-xs text-slate-500">Colo Code</span>
                            <span class="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs font-bold">${cf.colo || 'N/A'}</span>
                        </div>
                        <div>
                            <p class="text-xs text-slate-500 mb-1">Data Center Location</p>
                            <p class="text-sm font-semibold">${cf.city || 'Singapore'}, ${cf.country || 'SG'}</p>
                        </div>
                        <div class="flex justify-between border-t border-white/5 pt-3">
                            <span class="text-xs text-slate-500">TCP RTT</span>
                            <span class="text-xs font-mono">${cf.clientTcpRtt || '0'} ms</span>
                        </div>
                    </div>
                </div>

                <!-- Bot Management -->
                <div class="glass-card">
                    <div class="bg-slate-800/50 px-5 py-3 border-b border-white/5">
                        <h3 class="text-sm font-bold uppercase">Bot Management</h3>
                    </div>
                    <div class="p-5 space-y-3 mono text-[11px]">
                        <div class="flex justify-between items-center">
                            <span>Bot Score</span>
                            <span class="text-green-400 font-bold text-sm">${cf.botManagement?.score || '99'}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Verified Bot</span>
                            <span class="${cf.botManagement?.verifiedBot ? 'text-green-400' : 'text-red-400'}">${cf.botManagement?.verifiedBot ? 'Ya' : 'Tidak'}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>JS Detection</span>
                            <span class="text-slate-400">${cf.botManagement?.jsDetection?.passed ? 'Passed' : 'Not Passed'}</span>
                        </div>
                    </div>
                </div>

                <!-- TLS Security -->
                <div class="glass-card p-5">
                    <h3 class="text-xs font-bold text-slate-500 uppercase mb-4">Security & TLS</h3>
                    <div class="space-y-3 mono text-[11px]">
                        <div class="flex justify-between">
                            <span>Version</span> <span class="badge badge-green">${cf.tlsVersion || 'TLSv1.3'}</span>
                        </div>
                        <div class="break-all">
                            <span class="text-slate-500 block mb-1">Cipher Suite</span>
                            <span class="text-blue-300">${cf.tlsCipher || 'AEAD-AES128-GCM-SHA256'}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- User Agent -->
        <div class="mt-6 glass-card p-5">
             <p class="text-xs text-slate-500 uppercase font-bold mb-2">User Agent</p>
             <p class="mono text-xs bg-black/30 p-3 rounded-lg border border-white/5 leading-relaxed text-slate-300">
                ${headers['user-agent'] || 'Unknown'}
             </p>
        </div>

        <footer class="mt-12 text-center text-slate-500 text-xs pb-10">
            <p>Server API — api.elvora.id • Powered by Cloudflare Workers</p>
            <p class="mt-1">Data diproses secara real-time dan tidak disimpan di server.</p>
        </footer>
    </div>

    <script>
        // Init Map
        const lat = ${cf.latitude || -6.17};
        const lon = ${cf.longitude || 106.82};
        const map = L.map('map', {zoomControl: false}).setView([lat, lon], 12);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const icon = L.divIcon({
            className: 'custom-div-icon',
            html: "<div style='background-color:#3b82f6; width:12px; height:12px; border-radius:50%; border:2px solid white; box-shadow: 0 0 10px #3b82f6;'></div>",
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });

        L.marker([lat, lon], {icon: icon}).addTo(map);

        function copyJson() {
            const data = ${JSON.stringify(data)};
            navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            alert('JSON copied to clipboard!');
        }
    </script>
</body>
</html>`;
}
