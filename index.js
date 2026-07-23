export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Menyiapkan Data JSON lengkap seperti contoh
    const cf = request.cf || {};
    const headers = Object.fromEntries(request.headers);
    const ip = request.headers.get('CF-Connecting-IP') || '103.147.246.4';
    
    // Data Center Mapping Sederhana (Contoh)
    const coloMap = {
      "CGK": "Jakarta, Indonesia",
      "SIN": "Singapore, Singapore",
      "HKG": "Hong Kong, HK",
      "BKK": "Bangkok, Thailand"
    };
    const dcName = coloMap[cf.colo] || "Cloudflare Edge Server";

    const fullData = {
      ip: ip,
      method: request.method,
      url: request.url,
      redirect: "manual",
      keepalive: false,
      bodyUsed: false,
      integrity: "",
      headers: headers,
      colo: {
        code: cf.colo || "N/A",
        name: dcName,
        city: cf.city || "N/A",
        country: cf.country || "N/A",
        region: cf.continent || "N/A"
      },
      cf: cf
    };

    if (path === '/') {
      return new Response(generateHTML(fullData), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Endpoint API JSON
    return new Response(JSON.stringify(fullData, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

function generateHTML(data) {
  const { cf, ip, headers, colo } = data;
  
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
        .bg-blue-elvora { background-color: #3b82f6; }
        
        /* Map Styles */
        #map { height: 350px; width: 100%; z-index: 1; border-bottom: 1px solid #262626; }
        .leaflet-container { background: #0d0d0d !important; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0d0d0d; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }

        .btn-copy {
            background-color: #1f1f1f;
            border: 1px solid #333;
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 13px;
            transition: all 0.2s;
        }
        .btn-copy:hover { border-color: #3b82f6; color: #fff; }
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500">
                    <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
             </div>
             <div class="text-gray-400">
                Frontend Playground Elvora telah pindah ke <a href="https://elvora.eu.cc" class="text-blue-elvora hover:underline">elvora.eu.cc</a>. Halaman ini hanya server API.
             </div>
        </div>

        <!-- Hero Section (Map & Summary) -->
        <div class="card-bg rounded-xl overflow-hidden shadow-2xl">
            <div id="map"></div>
            <div class="p-5 grid grid-cols-2 gap-y-6">
                <div>
                    <p class="text-[11px] uppercase tracking-wider text-gray-500 mb-1">IP Address</p>
                    <p class="text-[17px] font-bold text-blue-elvora mono">${ip}</p>
                </div>
                <div>
                    <p class="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Protokol</p>
                    <p class="text-[15px] font-semibold text-gray-200">HTTP/2 / IPv4</p>
                </div>
                <div>
                    <p class="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Lokasi Anda</p>
                    <p class="text-[15px] font-semibold text-gray-200">${cf.city || 'Pasarkemis'}, ${cf.regionCode || 'JB'}, ${cf.country || 'ID'}</p>
                </div>
                <div>
                    <p class="text-[11px] uppercase tracking-wider text-gray-500 mb-1">CF Edge Server</p>
                    <p class="text-[15px] font-semibold text-gray-200">${colo.name}</p>
                </div>
            </div>
        </div>

        <!-- GRID CARDS (100% IDENTIK) -->
        <div class="space-y-4">

            <!-- Geolokasi -->
            <div class="card-bg rounded-xl">
                <div class="px-5 py-3 border-b border-white/5">
                    <h3 class="text-[12px] uppercase font-bold tracking-widest text-gray-500">Geolokasi Anda</h3>
                </div>
                <div class="p-5 space-y-3 text-[14px]">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-500">IP</span>
                        <span class="bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded text-[12px] mono">${ip}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-500">IP Version</span>
                        <span class="bg-blue-900/20 text-blue-400 px-2 py-0.5 rounded text-[11px] font-bold">IPv4</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">Kota</span> <span>${cf.city || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">Provinsi</span> <span>${cf.region || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">Kode Region</span> <span>${cf.regionCode || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">Negara</span> <span>${cf.country || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">Benua</span> <span>${cf.continent || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">Kode Pos</span> <span>${cf.postalCode || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">Timezone</span> <span>${cf.timezone || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">Latitude</span> <span>${cf.latitude || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">Longitude</span> <span>${cf.longitude || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">EU Country</span> <span>${cf.isEUCountry ? 'Ya' : 'Tidak'}</span>
                    </div>
                </div>
            </div>

            <!-- Cloudflare Edge Server -->
            <div class="card-bg rounded-xl">
                <div class="px-5 py-3 border-b border-white/5">
                    <h3 class="text-[12px] uppercase font-bold tracking-widest text-gray-500">Cloudflare Edge Server</h3>
                </div>
                <div class="p-5 space-y-3 text-[14px]">
                    <div class="flex justify-between">
                        <span class="text-gray-500">Colo Code</span> <span class="bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded text-[11px] font-bold">${cf.colo}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">Nama DC</span> <span>${colo.name}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">HTTP Protocol</span> <span class="bg-blue-900/20 text-blue-400 px-2 py-0.5 rounded text-[11px] font-bold">HTTP/2</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">TCP RTT</span> <span>${cf.clientTcpRtt || 0} ms</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">Accept Encoding</span> <span class="text-[12px] mono text-gray-400 truncate ml-4">${headers['accept-encoding']}</span>
                    </div>
                </div>
            </div>

            <!-- Keamanan & TLS -->
            <div class="card-bg rounded-xl">
                <div class="px-5 py-3 border-b border-white/5">
                    <h3 class="text-[12px] uppercase font-bold tracking-widest text-gray-500">Keamanan & TLS</h3>
                </div>
                <div class="p-5 space-y-3 text-[14px]">
                    <div class="flex justify-between">
                        <span class="text-gray-500 text-xs">TLS Version</span> <span class="bg-green-500/10 text-green-500 px-2 py-0.5 rounded text-[11px] font-bold">${cf.tlsVersion || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500 text-xs">TLS Cipher</span> <span class="text-[11px] mono">${cf.tlsCipher || 'N/A'}</span>
                    </div>
                </div>
            </div>

            <!-- Bot Management -->
            <div class="card-bg rounded-xl">
                <div class="px-5 py-3 border-b border-white/5">
                    <h3 class="text-[12px] uppercase font-bold tracking-widest text-gray-500">Bot Management Cloudflare</h3>
                </div>
                <div class="p-5 space-y-3 text-[14px]">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-500">Bot Score</span> <span class="text-green-500 font-bold">${cf.botManagement?.score || 99}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-500">Verified Bot</span> <span class="bg-green-500/10 text-green-500 px-2 py-0.5 rounded text-[11px] font-bold">Tidak</span>
                    </div>
                </div>
            </div>

            <!-- Request Info -->
            <div class="card-bg rounded-xl">
                <div class="px-5 py-3 border-b border-white/5 text-[12px] uppercase font-bold tracking-widest text-gray-500">Request Info</div>
                <div class="p-5 space-y-3 text-[14px]">
                    <div class="flex justify-between">
                        <span class="text-gray-500">Method</span> <span class="bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded text-[11px] font-bold">GET</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">Redirect</span> <span>manual</span>
                    </div>
                </div>
            </div>

            <!-- User Agent -->
            <div class="card-bg rounded-xl p-5">
                <p class="text-[11px] uppercase font-bold text-gray-600 mb-2">User Agent</p>
                <div class="bg-black/40 p-4 rounded-lg border border-white/5 text-[12px] leading-relaxed text-gray-400 mono">
                    ${headers['user-agent']}
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="pt-10 pb-20 text-center space-y-2">
            <p class="text-gray-500 text-[12px]">Server API — <span class="text-gray-300">api.elvora.eu.cc</span> • Docs & Playground: <a href="#" class="text-blue-500">elvora.eu.cc</a></p>
            <p class="text-gray-600 text-[11px]">Powered by Cloudflare Workers • Data diproses di edge, tidak disimpan</p>
            
            <!-- Custom SVG Logo Elvora -->
            <div class="mt-6 flex justify-center opacity-50">
                <svg width="100" height="30" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 5H25V8H13V13H23V16H13V22H25V25H10V5Z" fill="#3b82f6"/>
                    <path d="M30 5H33V22H45V25H30V5Z" fill="white"/>
                    <path d="M48 5L55 25H58L65 5H62L56.5 21L51 5H48Z" fill="white"/>
                    <path d="M70 5C66 5 63 8 63 15C63 22 66 25 70 25C74 25 77 22 77 15C77 8 74 5 70 5ZM70 22C68 22 66 20 66 15C66 10 68 8 70 8C72 8 74 10 74 15C74 20 72 22 70 22Z" fill="white"/>
                </svg>
            </div>
        </footer>
    </div>

    <script>
        // Init Map identik dengan gaya dark & dotted line
        const userLat = ${cf.latitude || -6.17};
        const userLon = ${cf.longitude || 106.82};
        const dcLat = ${cf.latitude ? cf.latitude + 0.1 : -6.12}; // Simulasi DC Lat
        const dcLon = ${cf.longitude ? cf.longitude + 0.2 : 106.65}; // Simulasi DC Lon

        const map = L.map('map', { 
            zoomControl: false,
            attributionControl: false 
        }).setView([userLat, userLon], 10);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

        // Marker User
        const userIcon = L.divIcon({
            html: '<div style="background:#ef4444; width:12px; height:12px; border-radius:50%; border:2px solid white; box-shadow:0 0 10px #ef4444;"></div>',
            className: 'custom-icon', iconSize: [12, 12]
        });
        L.marker([userLat, userLon], {icon: userIcon}).addTo(map);

        // Marker Cloudflare Edge
        const cloudIcon = L.divIcon({
            html: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#f97316"><path d="M17.5,19c-3.037,0-5.5-2.463-5.5-5.5c0-0.034,0.001-0.067,0.002-0.1c-0.655,0.379-1.413,0.6-2.221,0.6 c-2.43,0-4.4-1.97-4.4-4.4c0-0.457,0.071-0.897,0.203-1.31C3.805,8.817,2.5,10.755,2.5,13c0,3.314,2.686,6,6,6H17.5z"/><path d="M17.5,17c2.485,0,4.5-2.015,4.5-4.5c0-2.261-1.668-4.133-3.851-4.453C17.65,5.656,15.762,4,13.5,4 c-2.321,0-4.275,1.741-4.593,4.01C8.618,8.004,8.312,8,8,8c-1.657,0-3,1.343-3,3c0,0.134,0.01,0.265,0.027,0.395 C5.652,11.164,6.772,11,8,11c1.298,0,2.485,0.413,3.454,1.111C12.44,10.875,14.07,10,15.875,10c0.042,0,0.084,0.001,0.125,0.002 C16.518,8.272,18.106,7,20,7c2.209,0,4,1.791,4,4c0,1.905-1.334,3.5-3.125,3.905C20.932,15.352,21,15.815,21,16.3 C21,18.343,19.433,20,17.5,20H8.5c-3.866,0-7-3.134-7-7c0-2.998,1.886-5.556,4.534-6.551C6.01,4.24,8.082,2,10.5,2 c2.106,0,3.949,1.698,4.39,3.847C15.84,5.321,16.89,5,18,5c2.761,0,5,2.239,5,5c0,0.211-0.013,0.419-0.038,0.623 C23.568,11.23,24,12.06,24,13C24,15.209,22.209,17,20,17H17.5z"/></svg>',
            className: 'cloud-icon', iconSize: [24, 24], iconAnchor: [12, 12]
        });
        L.marker([dcLat, dcLon], {icon: cloudIcon}).addTo(map);

        // Draw Dotted Line
        L.polyline([[userLat, userLon], [dcLat, dcLon]], {
            color: '#f97316',
            dashArray: '5, 10',
            weight: 2,
            opacity: 0.6
        }).addTo(map);

        function copyToClipboard() {
            const data = ${JSON.stringify(data)};
            navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
                const btn = document.getElementById('btnCopy');
                btn.innerText = '✓ Copied!';
                btn.style.color = '#3b82f6';
                setTimeout(() => {
                    btn.innerText = 'Copy JSON';
                    btn.style.color = '';
                }, 2000);
            });
        }
    </script>
</body>
</html>`;
}
