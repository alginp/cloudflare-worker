// Database Koordinat DC untuk visualisasi peta yang akurat
const DC_COORDS = {
  "CGK": { name: "Jakarta, Indonesia", lat: -6.1255, lon: 106.6559 },
  "SIN": { name: "Singapore, Singapore", lat: 1.3501, lon: 103.9940 },
  "HKG": { name: "Hong Kong, HK", lat: 22.3193, lon: 114.1694 },
  "NRT": { name: "Tokyo, Japan", lat: 35.7720, lon: 140.3920 }
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/json') {
      return new Response(JSON.stringify(request.cf, null, 2), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const cf = request.cf || {};
    const headers = Object.fromEntries(request.headers);
    const ip = headers['cf-connecting-ip'] || '103.147.246.4';
    
    // Fallback koordinat DC jika kode colo tidak ada di list
    const dc = DC_COORDS[cf.colo] || { 
      name: `${cf.city || 'Edge Server'}, ${cf.country || 'ID'}`, 
      lat: (parseFloat(cf.latitude) || 0) + 0.05, 
      lon: (parseFloat(cf.longitude) || 0) + 0.1 
    };

    const html = generateHTML(cf, headers, ip, dc);
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
};

function generateHTML(cf, headers, ip, dc) {
  const isEU = cf.isEUCountry ? "Ya" : "Tidak";
  const botScore = cf.botManagement?.score || 99;
  const verifiedBot = cf.botManagement?.verifiedBot ? "Ya" : "Tidak";

  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>api.elvora.eu.cc</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono&display=swap" rel="stylesheet">
    <style>
        body { background-color: #121212; color: #b3b3b3; font-family: 'Inter', sans-serif; font-size: 13px; }
        .mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
        .card { background-color: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden; }
        .label { color: #666; }
        .val { color: #ddd; }
        .blue-link { color: #3b82f6; }
        
        /* Map Styles */
        #map { height: 380px; width: 100%; border-bottom: 1px solid #2a2a2a; z-index: 1; }
        .leaflet-bar a { background-color: #222 !important; color: #fff !important; border: 1px solid #333 !important; }
        .leaflet-popup-content-wrapper { background: #1a1a1a; color: #fff; border: 1px solid #333; font-size: 12px; }
        .leaflet-popup-tip { background: #1a1a1a; }

        /* Button Copy */
        .btn-copy { background-color: #222; border: 1px solid #333; padding: 4px 12px; border-radius: 8px; font-size: 12px; color: #888; transition: 0.2s; }
        .btn-copy:hover { border-color: #444; color: #fff; }
        .btn-success { border-color: #22c55e !important; color: #22c55e !important; }

        /* Custom Status Dot */
        .status-dot { width: 8px; height: 8px; background: #f97316; border-radius: 50%; display: inline-block; margin-right: 8px; box-shadow: 0 0 8px #f97316; }
        
        .grid-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #242424; }
        .grid-row:last-child { border-bottom: none; }
        .badge { padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; text-transform: uppercase; }
        .badge-blue { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
        .badge-orange { background: rgba(249, 115, 22, 0.15); color: #f97316; }
    </style>
</head>
<body class="p-4 md:p-6">

    <div class="max-w-2xl mx-auto space-y-4">
        
        <!-- Header -->
        <div class="flex justify-between items-center px-1">
            <div class="flex items-center font-semibold text-[14px] text-gray-200">
                <span class="status-dot"></span>
                <span>api.elvora.eu.cc</span>
            </div>
            <button onclick="copyJson()" id="btnCopy" class="btn-copy">Copy JSON</button>
        </div>

        <!-- Frontend Notice -->
        <div class="card p-4 text-[12px] flex gap-3 leading-relaxed">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" class="mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <div class="text-gray-500">
                Frontend Playground Elvora telah pindah ke <a href="https://elvora.eu.cc" class="blue-link">elvora.eu.cc</a>. Halaman ini hanya server API.
            </div>
        </div>

        <!-- Main Hero Card -->
        <div class="card shadow-2xl">
            <div id="map"></div>
            <div class="p-5 grid grid-cols-2 gap-y-5">
                <div>
                    <p class="text-[10px] font-bold uppercase text-gray-600 mb-1">IP Address</p>
                    <p class="text-[16px] font-bold text-blue-500 mono">${ip}</p>
                </div>
                <div>
                    <p class="text-[10px] font-bold uppercase text-gray-600 mb-1">Protokol</p>
                    <p class="text-[14px] font-semibold text-gray-300">HTTP/1.1 / IPv4</p>
                </div>
                <div>
                    <p class="text-[10px] font-bold uppercase text-gray-600 mb-1">Lokasi Anda</p>
                    <p class="text-[14px] font-semibold text-gray-300">${cf.city || 'Pasarkemis'}, ${cf.regionCode || 'JB'}, ${cf.country || 'ID'}</p>
                </div>
                <div>
                    <p class="text-[10px] font-bold uppercase text-gray-600 mb-1">CF Edge Server</p>
                    <p class="text-[14px] font-semibold text-gray-300">${dc.name}</p>
                </div>
            </div>
        </div>

        <!-- Geolokasi -->
        <div class="card">
            <div class="px-5 py-2.5 border-b border-white/5 bg-white/5 text-[11px] font-bold uppercase tracking-wider text-gray-500">Geolokasi Anda</div>
            <div class="p-5 space-y-0">
                <div class="grid-row"><span class="label">IP</span> <span class="badge badge-blue mono">${ip}</span></div>
                <div class="grid-row"><span class="label">IP Version</span> <span class="badge badge-blue">IPv4</span></div>
                <div class="grid-row"><span class="label">Kota</span> <span class="val">${cf.city || 'N/A'}</span></div>
                <div class="grid-row"><span class="label">Provinsi</span> <span class="val">${cf.region || 'N/A'}</span></div>
                <div class="grid-row"><span class="label">Negara</span> <span class="val">${cf.country || 'ID'}</span></div>
                <div class="grid-row"><span class="label">Timezone</span> <span class="val">${cf.timezone || 'Asia/Jakarta'}</span></div>
                <div class="grid-row"><span class="label">Latitude</span> <span class="val">${cf.latitude || '0'}</span></div>
                <div class="grid-row"><span class="label">Longitude</span> <span class="val">${cf.longitude || '0'}</span></div>
                <div class="grid-row"><span class="label">EU Country</span> <span class="val">${isEU}</span></div>
            </div>
        </div>

        <!-- CF Edge Server -->
        <div class="card">
            <div class="px-5 py-2.5 border-b border-white/5 bg-white/5 text-[11px] font-bold uppercase tracking-wider text-gray-500">Cloudflare Edge Server</div>
            <div class="p-5">
                <div class="grid-row"><span class="label">Colo Code</span> <span class="badge badge-orange">${cf.colo}</span></div>
                <div class="grid-row"><span class="label">Nama DC</span> <span class="val">${dc.name}</span></div>
                <div class="grid-row"><span class="label">TCP RTT</span> <span class="val">${cf.clientTcpRtt || 0} ms</span></div>
                <div class="grid-row"><span class="label">CF Ray</span> <span class="text-orange-500 mono text-[11px]">${headers['cf-ray']}</span></div>
            </div>
        </div>

        <!-- TLS -->
        <div class="card">
            <div class="px-5 py-2.5 border-b border-white/5 bg-white/5 text-[11px] font-bold uppercase tracking-wider text-gray-500">Keamanan & TLS</div>
            <div class="p-5">
                <div class="grid-row"><span class="label">TLS Version</span> <span class="val text-green-500 font-bold">${cf.tlsVersion}</span></div>
                <div class="grid-row"><span class="label">TLS Cipher</span> <span class="text-[11px] mono text-blue-400">${cf.tlsCipher}</span></div>
            </div>
        </div>

        <!-- Bot Management -->
        <div class="card">
            <div class="px-5 py-2.5 border-b border-white/5 bg-white/5 text-[11px] font-bold uppercase tracking-wider text-gray-500">Bot Management Cloudflare</div>
            <div class="p-5">
                <div class="grid-row"><span class="label">Bot Score</span> <span class="text-green-500 font-bold">${botScore}</span></div>
                <div class="grid-row"><span class="label">Verified Bot</span> <span class="val text-orange-500 font-bold">${verifiedBot}</span></div>
            </div>
        </div>

        <!-- User Agent -->
        <div class="card p-5">
            <p class="text-[10px] font-bold text-gray-600 uppercase mb-3">User Agent</p>
            <div class="bg-black/30 p-4 rounded-lg border border-white/5 text-[11px] mono text-gray-500 leading-relaxed break-all">
                ${headers['user-agent']}
            </div>
        </div>

        <!-- Footer -->
        <footer class="pt-8 pb-12 text-center">
            <p class="text-gray-600 text-[11px]">Server API — <span class="text-gray-400 font-medium">api.elvora.eu.cc</span> • Docs: <a href="https://elvora.eu.cc" class="blue-link">elvora.eu.cc</a></p>
            
            <div class="mt-8 flex flex-col items-center gap-2 opacity-50">
                <div class="text-[18px] font-black tracking-tighter text-blue-500">ELVORA</div>
                <div class="text-[9px] text-gray-500 uppercase tracking-widest">Powered by Cloudflare Workers</div>
            </div>
        </footer>
    </div>

    <script>
        const uLat = ${cf.latitude || -6.17};
        const uLon = ${cf.longitude || 106.82};
        const dLat = ${dc.lat};
        const dLon = ${dc.lon};

        const map = L.map('map', { zoomControl: false, attributionControl: false }).setView([uLat, uLon], 11);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
        L.control.zoom({ position: 'topright' }).addTo(map);

        // Marker User (Pin Merah)
        const userIcon = L.divIcon({
            html: '<div style="background:#ef4444; width:14px; height:14px; border-radius:50%; border:2px solid white; box-shadow:0 0 15px #ef4444;"></div>',
            className: '', iconSize: [14, 14]
        });
        L.marker([uLat, uLon], {icon: userIcon}).addTo(map).bindPopup("<b>Anda:</b> ${cf.city || 'Pasarkemis'}, ID");

        // Marker Cloudflare (Logo Awan Asli)
        const cfIcon = L.divIcon({
            html: '<svg width="28" height="28" viewBox="0 0 24 24" fill="#f97316"><path d="M17.5 19c-3.037 0-5.5-2.463-5.5-5.5 0-.034.001-.067.002-.1-.655.379-1.413.6-2.221.6-2.43 0-4.4-1.97-4.4-4.4 0-.457.071-.897.203-1.31C3.805 8.817 2.5 10.755 2.5 13c0 3.314 2.686 6 6 6h9zM17.5 17c2.485 0 4.5-2.015 4.5-4.5 0-2.261-1.668-4.133-3.851-4.453C17.65 5.656 15.762 4 13.5 4c-2.321 0-4.275 1.741-4.593 4.01C8.618 8.004 8.312 8 8 8c-1.657 0-3 1.343-3 3 0 .134.01.265.027.395C5.652 11.164 6.772 11 8 11c1.298 0 2.485.413 3.454 1.111C12.44 10.875 14.07 10 15.875 10c.042 0 .084.001.125.002.518-1.73 2.106-3.002 4-3.002 2.209 0 4 1.791 4 4 0 1.905-1.334 3.5-3.125 3.905-.193.047-.125.51-.125.995 0 2.043-1.567 3.6-3.5 3.6h-9c-3.866 0-7-3.134-7-7 0-2.998 1.886-5.556 4.534-6.551.01-3.209 2.082-5.449 4.5-5.449 2.106 0 3.949 1.698 4.39 3.847C15.84 5.321 16.89 5 18 5c2.761 0 5 2.239 5 5 0 .211-.013.419-.038.623 1.606.607 2.038 1.437 2.038 2.377C25 15.209 23.209 17 21 17h-3.5z"/></svg>',
            className: '', iconSize: [28, 28], iconAnchor: [14, 14]
        });
        L.marker([dLat, dLon], {icon: cfIcon}).addTo(map).bindPopup("<b>CF Edge:</b> ${dc.name}");

        // Garis penghubung
        L.polyline([[uLat, uLon], [dLat, dLon]], { color: '#f97316', dashArray: '5, 8', weight: 1.5, opacity: 0.5 }).addTo(map);

        function copyJson() {
            fetch('/json').then(r => r.json()).then(data => {
                navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
                    const btn = document.getElementById('btnCopy');
                    btn.innerText = '✓ Copied!';
                    btn.classList.add('btn-success');
                    setTimeout(() => {
                        btn.innerText = 'Copy JSON';
                        btn.classList.remove('btn-success');
                    }, 2000);
                });
            });
        }
    </script>
</body>
</html>`;
}
