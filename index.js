export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Menarik data real-time dari Cloudflare Edge
    const cf = request.cf || {};
    const headers = Object.fromEntries(request.headers);
    const ip = request.headers.get('CF-Connecting-IP') || '103.147.246.4';
    
    // Identifikasi Data Center (Colo)
    const coloMap = {
      "CGK": "Jakarta, Indonesia",
      "SIN": "Singapore, Singapore",
      "HKG": "Hong Kong, HK",
      "BKK": "Bangkok, Thailand",
      "KUL": "Kuala Lumpur, Malaysia"
    };
    const dcName = coloMap[cf.colo] || `Cloudflare Edge (${cf.colo || 'Unknown'})`;

    const fullData = {
      ip: ip,
      method: request.method,
      url: request.url,
      redirect: "manual",
      keepalive: headers['connection'] === 'keep-alive',
      bodyUsed: false,
      integrity: "(none)",
      headers: headers,
      colo: {
        code: cf.colo || "N/A",
        name: dcName,
        city: cf.city || "N/A",
        country: cf.country || "N/A",
        region: cf.continent || "N/A",
        lat: cf.latitude || 0,
        lon: cf.longitude || 0
      },
      cf: cf
    };

    if (path === '/') {
      return new Response(generateHTML(fullData), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Default return JSON jika hit endpoint lain
    return new Response(JSON.stringify(fullData, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

function generateHTML(data) {
  const { cf, ip, headers, colo } = data;
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
        body { 
            background-color: #0d0d0d; 
            color: #d1d5db; 
            font-family: 'Inter', sans-serif;
            -webkit-font-smoothing: antialiased;
        }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .card-bg { background-color: #161616; border: 1px solid #262626; }
        .text-blue-elvora { color: #3b82f6; }
        
        #map { height: 350px; width: 100%; z-index: 1; border-bottom: 1px solid #262626; }
        .leaflet-container { background: #0d0d0d !important; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0d0d0d; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }

        .btn-copy {
            background-color: #1f1f1f;
            border: 1px solid #333;
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 13px;
            transition: all 0.3s ease;
        }
        .dot-online { width: 8px; height: 8px; background: #f97316; border-radius: 50%; display: inline-block; margin-right: 8px; box-shadow: 0 0 8px #f97316; }
    </style>
</head>
<body class="p-3 md:p-6">

    <div class="max-w-3xl mx-auto space-y-4">
        
        <!-- Header Section -->
        <div class="flex justify-between items-center px-1">
            <div class="flex items-center font-semibold text-[15px]">
                <span class="dot-online"></span>
                <span>api.elvora.eu.cc</span>
            </div>
            <button onclick="copyToClipboard()" id="btnCopy" class="btn-copy text-gray-400">
                Copy JSON
            </button>
        </div>

        <!-- Notice Box -->
        <div class="card-bg rounded-xl p-4 text-[13px] leading-relaxed flex gap-4 items-start">
             <div class="mt-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
             </div>
             <div class="text-gray-400">
                Frontend Playground Elvora telah pindah ke <a href="https://elvora.eu.cc" class="text-blue-elvora hover:underline">elvora.eu.cc</a>. Halaman ini hanya server API.
             </div>
        </div>

        <!-- Hero Section -->
        <div class="card-bg rounded-xl overflow-hidden shadow-2xl">
            <div id="map"></div>
            <div class="p-5 grid grid-cols-2 gap-y-6">
                <div>
                    <p class="text-[11px] uppercase tracking-wider text-gray-500 mb-1">IP Address</p>
                    <p class="text-[17px] font-bold text-blue-elvora mono">${ip}</p>
                </div>
                <div>
                    <p class="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Protokol</p>
                    <p class="text-[15px] font-semibold text-gray-200">${headers['x-forwarded-proto']?.toUpperCase() || 'HTTPS'} / ${data.cf.httpProtocol || 'HTTP/2'}</p>
                </div>
                <div>
                    <p class="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Lokasi Anda</p>
                    <p class="text-[15px] font-semibold text-gray-200">${cf.city || 'Unknown'}, ${cf.regionCode || 'N/A'}, ${cf.country || 'ID'}</p>
                </div>
                <div>
                    <p class="text-[11px] uppercase tracking-wider text-gray-500 mb-1">CF Edge Server</p>
                    <p class="text-[15px] font-semibold text-gray-200">${colo.name}</p>
                </div>
            </div>
        </div>

        <!-- Sections -->
        <div class="space-y-4">
            <!-- Geolokasi -->
            <div class="card-bg rounded-xl">
                <div class="px-5 py-3 border-b border-white/5">
                    <h3 class="text-[12px] uppercase font-bold tracking-widest text-gray-500">Geolokasi Anda</h3>
                </div>
                <div class="p-5 space-y-3 text-[14px]">
                    <div class="flex justify-between items-center"><span class="text-gray-500">IP</span><span class="text-blue-400 mono">${ip}</span></div>
                    <div class="flex justify-between"><span>Kota</span> <span>${cf.city || 'N/A'}</span></div>
                    <div class="flex justify-between"><span>Provinsi</span> <span>${cf.region || 'N/A'}</span></div>
                    <div class="flex justify-between"><span>Negara</span> <span>${cf.country || 'ID'}</span></div>
                    <div class="flex justify-between"><span>Timezone</span> <span>${cf.timezone || 'Asia/Jakarta'}</span></div>
                    <div class="flex justify-between"><span>Latitude</span> <span>${cf.latitude || '0'}</span></div>
                    <div class="flex justify-between"><span>Longitude</span> <span>${cf.longitude || '0'}</span></div>
                </div>
            </div>

            <!-- Bot Management -->
            <div class="card-bg rounded-xl">
                <div class="px-5 py-3 border-b border-white/5">
                    <h3 class="text-[12px] uppercase font-bold tracking-widest text-gray-500">Bot Management Cloudflare</h3>
                </div>
                <div class="p-5 space-y-3 text-[14px]">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-500">Bot Score</span> 
                        <span class="text-green-500 font-bold">${cf.botManagement?.score || 99}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-500">Verified Bot</span> 
                        <span class="px-2 py-0.5 rounded text-[11px] font-bold ${isVerifiedBot ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'}">
                            ${isVerifiedBot ? 'Ya' : 'Tidak'}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Request Info -->
            <div class="card-bg rounded-xl">
                <div class="px-5 py-3 border-b border-white/5 text-[12px] uppercase font-bold tracking-widest text-gray-500">Request Info</div>
                <div class="p-5 space-y-3 text-[14px]">
                    <div class="flex justify-between"><span class="text-gray-500">Method</span> <span class="text-blue-500 font-bold">GET</span></div>
                    <div class="flex justify-between"><span class="text-gray-500">User Agent</span> <span class="text-gray-400 text-[11px] mono text-right max-w-[200px] truncate">${headers['user-agent']}</span></div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="pt-10 pb-20 text-center space-y-4">
            <p class="text-gray-500 text-[12px]">Server API — <span class="text-gray-300">api.elvora.eu.cc</span></p>
            <div class="flex justify-center opacity-40">
                <svg width="100" height="25" viewBox="0 0 120 30">
                    <path d="M10 5H25V8H13V13H23V16H13V22H25V25H10V5Z" fill="#3b82f6"/>
                    <path d="M30 5H33V22H45V25H30V5Z" fill="white"/>
                    <path d="M48 5L55 25H58L65 5H62L56.5 21L51 5H48Z" fill="white"/>
                </svg>
            </div>
        </footer>
    </div>

    <script>
        // Init Map Real-time data
        const uLat = ${cf.latitude || -6.17};
        const uLon = ${cf.longitude || 106.82};

        const map = L.map('map', { zoomControl: false, attributionControl: false }).setView([uLat, uLon], 11);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

        const uIcon = L.divIcon({
            html: '<div style="background:#ef4444; width:12px; height:12px; border-radius:50%; border:2px solid white; box-shadow:0 0 10px #ef4444;"></div>',
            className: 'u-icon', iconSize: [12, 12]
        });
        L.marker([uLat, uLon], {icon: uIcon}).addTo(map);

        function copyToClipboard() {
            const data = ${JSON.stringify(data)};
            navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
                const btn = document.getElementById('btnCopy');
                btn.innerHTML = '✓ Copied!';
                btn.classList.remove('text-gray-400');
                btn.classList.add('text-green-500', 'border-green-500/50');
                
                setTimeout(() => {
                    btn.innerHTML = 'Copy JSON';
                    btn.classList.add('text-gray-400');
                    btn.classList.remove('text-green-500', 'border-green-500/50');
                }, 2000);
            });
        }
    </script>
</body>
</html>`;
}
