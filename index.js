// Database Koordinat Colo Cloudflare (Untuk visualisasi peta yang real)
const COLO_COORDS = {
  "CGK": { name: "Jakarta, Indonesia", lat: -6.12557, lon: 106.655998 },
  "SIN": { name: "Singapore, Singapore", lat: 1.35019, lon: 103.994003 },
  "HKG": { name: "Hong Kong, HK", lat: 22.3193, lon: 114.1694 },
  "NRT": { name: "Tokyo, Japan", lat: 35.772, lon: 140.392 },
  "LAX": { name: "Los Angeles, USA", lat: 33.9416, lon: -118.4085 }
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Ambil Data Real-time dari Cloudflare
    const cf = request.cf || {};
    const headers = Object.fromEntries(request.headers);
    const ip = headers['cf-connecting-ip'] || '103.147.246.4';
    
    // Identifikasi Data Center
    const coloInfo = COLO_COORDS[cf.colo] || { name: `Cloudflare Edge (${cf.colo})`, lat: (cf.latitude || 0) + 0.5, lon: (cf.longitude || 0) + 0.5 };

    const fullData = {
      ip: ip,
      method: request.method,
      url: request.url,
      redirect: "manual",
      headers: headers,
      colo: {
        code: cf.colo || "N/A",
        name: coloInfo.name,
        lat: coloInfo.lat,
        lon: coloInfo.lon
      },
      cf: cf
    };

    if (path === '/') {
      return new Response(generateHTML(fullData), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    return new Response(JSON.stringify(fullData, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

function generateHTML(data) {
  const { cf, ip, headers, colo } = data;
  const botScore = cf.botManagement?.score || 99;
  const isVerifiedBot = cf.botManagement?.verifiedBot || false;

  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>api.elvora.eu.cc</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono&display=swap" rel="stylesheet">
    <style>
        body { background-color: #121212; color: #e5e7eb; font-family: 'Inter', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .card-bg { background-color: #1a1a1a; border: 1px solid #2d2d2d; border-radius: 12px; overflow: hidden; }
        .text-blue-elvora { color: #3b82f6; }
        .border-elvora { border-color: #2d2d2d; }
        
        #map { height: 380px; width: 100%; z-index: 1; border-bottom: 1px solid #2d2d2d; }
        .leaflet-bar { border: none !important; box-shadow: 0 0 10px rgba(0,0,0,0.5) !important; }
        .leaflet-bar a { background-color: #262626 !important; color: #fff !important; border: 1px solid #333 !important; }

        .btn-copy { background-color: #262626; border: 1px solid #333; padding: 5px 14px; border-radius: 8px; font-size: 13px; font-weight: 500; transition: 0.2s; }
        .dot-online { width: 10px; height: 10px; background: #f97316; border-radius: 50%; display: inline-block; margin-right: 10px; box-shadow: 0 0 12px #f97316; }
        
        .row-data { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #262626; font-size: 14px; }
        .row-data:last-child { border-bottom: none; }
        .label { color: #9ca3af; }
        .badge { padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    </style>
</head>
<body class="p-4 md:p-8">

    <div class="max-w-3xl mx-auto space-y-5">
        
        <!-- Header -->
        <div class="flex justify-between items-center">
            <div class="flex items-center text-[15px] font-bold">
                <span class="dot-online"></span>
                <span>api.elvora.eu.cc</span>
            </div>
            <button onclick="copyToClipboard()" id="btnCopy" class="btn-copy text-gray-400 flex items-center gap-2">
                <svg id="copyIcon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                <span>Copy JSON</span>
            </button>
        </div>

        <!-- Notice -->
        <div class="card-bg p-4 flex gap-4">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" class="mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
             <div class="text-[13px] text-gray-400">
                Frontend Playground Elvora telah pindah ke <a href="https://elvora.eu.cc" class="text-blue-elvora hover:underline">elvora.eu.cc</a>. Halaman ini hanya server API.
             </div>
        </div>

        <!-- Map Hero -->
        <div class="card-bg shadow-xl">
            <div id="map"></div>
            <div class="p-6 grid grid-cols-2 gap-y-6">
                <div>
                    <p class="text-[11px] font-bold uppercase text-gray-500 mb-1">IP Address</p>
                    <p class="text-[18px] font-bold text-blue-elvora mono">${ip}</p>
                </div>
                <div>
                    <p class="text-[11px] font-bold uppercase text-gray-500 mb-1">Protokol</p>
                    <p class="text-[15px] font-semibold">${cf.httpProtocol || 'HTTP/2'} / IPv4</p>
                </div>
                <div>
                    <p class="text-[11px] font-bold uppercase text-gray-500 mb-1">Lokasi Anda</p>
                    <p class="text-[15px] font-semibold">${cf.city || 'Pasarkemis'}, ${cf.regionCode || 'JB'}, ${cf.country || 'ID'}</p>
                </div>
                <div>
                    <p class="text-[11px] font-bold uppercase text-gray-500 mb-1">CF Edge Server</p>
                    <p class="text-[15px] font-semibold">${colo.name}</p>
                </div>
            </div>
        </div>

        <!-- Details Grid -->
        <div class="space-y-5">
            <!-- Geolokasi -->
            <div class="card-bg">
                <div class="px-5 py-3 border-b border-white/5 bg-white/5 text-[12px] font-bold uppercase tracking-widest text-gray-400">Geolokasi Anda</div>
                <div class="p-5">
                    <div class="row-data"><span class="label">IP</span> <span class="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-xs mono">${ip}</span></div>
                    <div class="row-data"><span class="label">IP Version</span> <span class="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-xs font-bold">IPv4</span></div>
                    <div class="row-data"><span class="label">Kota</span> <span>${cf.city || 'N/A'}</span></div>
                    <div class="row-data"><span class="label">Provinsi</span> <span>${cf.region || 'N/A'}</span></div>
                    <div class="row-data"><span class="label">Kode Region</span> <span>${cf.regionCode || 'N/A'}</span></div>
                    <div class="row-data"><span class="label">Negara</span> <span>${cf.country || 'N/A'}</span></div>
                    <div class="row-data"><span class="label">Timezone</span> <span>${cf.timezone || 'N/A'}</span></div>
                    <div class="row-data"><span class="label">Latitude</span> <span>${cf.latitude || 'N/A'}</span></div>
                    <div class="row-data"><span class="label">Longitude</span> <span>${cf.longitude || 'N/A'}</span></div>
                </div>
            </div>

            <!-- CF Edge -->
            <div class="card-bg">
                <div class="px-5 py-3 border-b border-white/5 bg-white/5 text-[12px] font-bold uppercase tracking-widest text-gray-400">Cloudflare Edge Server</div>
                <div class="p-5">
                    <div class="row-data"><span class="label">Colo Code</span> <span class="bg-orange-500/20 text-orange-500 badge">${cf.colo}</span></div>
                    <div class="row-data"><span class="label">Nama DC</span> <span>${colo.name}</span></div>
                    <div class="row-data"><span class="label">TCP RTT</span> <span>${cf.clientTcpRtt || 0} ms</span></div>
                    <div class="row-data"><span class="label">CF Ray</span> <span class="text-orange-400 mono text-xs">${headers['cf-ray']}</span></div>
                </div>
            </div>

            <!-- Keamanan -->
            <div class="card-bg">
                <div class="px-5 py-3 border-b border-white/5 bg-white/5 text-[12px] font-bold uppercase tracking-widest text-gray-400">Keamanan & TLS</div>
                <div class="p-5">
                    <div class="row-data"><span class="label">TLS Version</span> <span class="bg-green-500/20 text-green-500 badge">${cf.tlsVersion}</span></div>
                    <div class="row-data"><span class="label">TLS Cipher</span> <span class="text-[11px] mono text-blue-300">${cf.tlsCipher}</span></div>
                    <div class="row-data"><span class="label">Hello Length</span> <span>${cf.tlsClientHelloLength || 0} bytes</span></div>
                </div>
            </div>

            <!-- Bot Management -->
            <div class="card-bg">
                <div class="px-5 py-3 border-b border-white/5 bg-white/5 text-[12px] font-bold uppercase tracking-widest text-gray-400">Bot Management Cloudflare</div>
                <div class="p-5">
                    <div class="row-data"><span class="label">Bot Score</span> <span class="text-green-500 font-bold">${botScore}</span></div>
                    <div class="row-data">
                        <span class="label">Verified Bot</span> 
                        <span class="badge ${isVerifiedBot ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'}">${isVerifiedBot ? 'Ya' : 'Tidak'}</span>
                    </div>
                </div>
            </div>

            <!-- Network -->
            <div class="card-bg">
                <div class="px-5 py-3 border-b border-white/5 bg-white/5 text-[12px] font-bold uppercase tracking-widest text-gray-400">Jaringan & ISP</div>
                <div class="p-5">
                    <div class="row-data"><span class="label">ASN</span> <span class="mono">AS${cf.asn}</span></div>
                    <div class="row-data"><span class="label">Organisasi</span> <span>${cf.asOrganization || 'Unknown'}</span></div>
                </div>
            </div>

            <!-- User Agent -->
            <div class="card-bg p-5">
                <p class="text-[11px] font-bold text-gray-600 uppercase mb-3">User Agent</p>
                <div class="bg-black/30 p-4 rounded-lg border border-white/5 text-[12px] mono text-gray-400 leading-relaxed break-all">
                    ${headers['user-agent']}
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="pt-10 pb-20 text-center">
            <p class="text-gray-500 text-[12px]">Server API — <span class="text-gray-200">api.elvora.eu.cc</span> • Docs: <a href="https://elvora.eu.cc" class="text-blue-500">elvora.eu.cc</a></p>
            <p class="text-gray-600 text-[11px] mt-1">Powered by Cloudflare Workers • Data diproses di edge, tidak disimpan</p>
            
            <!-- Logo Elvora Gagah -->
            <div class="mt-8 flex justify-center">
                <svg width="120" height="35" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg">
                    <text x="0" y="25" font-family="'Inter', sans-serif" font-weight="900" font-size="24" fill="#3b82f6">ELVORA</text>
                    <rect x="0" y="28" width="100" height="2" fill="#3b82f6" opacity="0.3"/>
                </svg>
            </div>
        </footer>
    </div>

    <script>
        const uLat = ${cf.latitude || -6.17};
        const uLon = ${cf.longitude || 106.82};
        const dLat = ${colo.lat};
        const dLon = ${colo.lon};

        const map = L.map('map', { zoomControl: false, attributionControl: false }).setView([uLat, uLon], 11);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
        
        // Zoom control di kanan
        L.control.zoom({ position: 'topright' }).addTo(map);

        const pinIcon = L.divIcon({
            html: '<div style="background:#ef4444; width:12px; height:12px; border-radius:50%; border:2px solid white; box-shadow:0 0 15px #ef4444;"></div>',
            className: '', iconSize: [12, 12]
        });
        L.marker([uLat, uLon], {icon: pinIcon}).addTo(map);

        const cloudIcon = L.divIcon({
            html: '<svg width="30" height="30" viewBox="0 0 24 24" fill="#f97316"><path d="M17.5,19c-3.037,0-5.5-2.463-5.5-5.5c0-0.034,0.001-0.067,0.002-0.1c-0.655,0.379-1.413,0.6-2.221,0.6 c-2.43,0-4.4-1.97-4.4-4.4c0-0.457,0.071-0.897,0.203-1.31C3.805,8.817,2.5,10.755,2.5,13c0,3.314,2.686,6,6,6H17.5z"/><path d="M17.5,17c2.485,0,4.5-2.015,4.5-4.5c0-2.261-1.668-4.133-3.851-4.453C17.65,5.656,15.762,4,13.5,4 c-2.321,0-4.275,1.741-4.593,4.01C8.618,8.004,8.312,8,8,8c-1.657,0-3,1.343-3,3c0,0.134,0.01,0.265,0.027,0.395 C5.652,11.164,6.772,11,8,11c1.298,0,2.485,0.413,3.454,1.111C12.44,10.875,14.07,10,15.875,10c0.042,0,0.084,0.001,0.125,0.002 C16.518,8.272,18.106,7,20,7c2.209,0,4,1.791,4,4c0,1.905-1.334,3.5-3.125,3.905C20.932,15.352,21,15.815,21,16.3 C21,18.343,19.433,20,17.5,20H8.5c-3.866,0-7-3.134-7-7c0-2.998,1.886-5.556,4.534-6.551C6.01,4.24,8.082,2,10.5,2 c2.106,0,3.949,1.698,4.39,3.847C15.84,5.321,16.89,5,18,5c2.761,0,5,2.239,5,5c0,0.211-0.013,0.419-0.038,0.623 C23.568,11.23,24,12.06,24,13C24,15.209,22.209,17,20,17H17.5z"/></svg>',
            className: '', iconSize: [30, 30], iconAnchor: [15, 15]
        });
        L.marker([dLat, dLon], {icon: cloudIcon}).addTo(map);

        L.polyline([[uLat, uLon], [dLat, dLon]], { color: '#f97316', dashArray: '5, 10', weight: 2, opacity: 0.5 }).addTo(map);

        function copyToClipboard() {
            const data = ${JSON.stringify(data)};
            navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
                const btn = document.getElementById('btnCopy');
                btn.innerHTML = '<span class="text-green-500">✓ Copied!</span>';
                btn.style.borderColor = '#22c55e';
                setTimeout(() => {
                    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>Copy JSON</span>';
                    btn.style.borderColor = '#333';
                }, 2000);
            });
        }
    </script>
</body>
</html>`;
}
