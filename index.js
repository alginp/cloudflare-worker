/**
 * ELVORA API - CLOUD FLARE WORKER CORE
 * Versi Super Lengkap (Pixel-Perfect Clone)
 */

const COLO_DATABASE = {
  "CGK": { city: "Jakarta", country: "Indonesia", lat: -6.12557, lon: 106.655998 },
  "SIN": { city: "Singapore", country: "Singapore", lat: 1.35019, lon: 103.994003 },
  "HKG": { city: "Hong Kong", country: "Hong Kong", lat: 22.3193, lon: 114.1694 },
  "BKK": { city: "Bangkok", country: "Thailand", lat: 13.7563, lon: 100.5018 },
  "KUL": { city: "Kuala Lumpur", country: "Malaysia", lat: 3.1390, lon: 101.6869 }
};

export default {
  async fetch(request, env, ctx) {
    const cf = request.cf || {};
    const headers = Object.fromEntries(request.headers);
    const ip = headers['cf-connecting-ip'] || '103.147.246.4';
    
    // Logic Data Center
    const dcData = COLO_DATABASE[cf.colo] || { 
      city: cf.city || "Unknown", 
      country: cf.country || "ID", 
      lat: (parseFloat(cf.latitude) || 0) + 0.12, 
      lon: (parseFloat(cf.longitude) || 0) + 0.08 
    };

    const url = new URL(request.url);
    if (url.pathname === '/json') {
      return new Response(JSON.stringify({ ...cf, ip, headers }, null, 2), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const responseHtml = generateFullUI(cf, headers, ip, dcData);
    return new Response(responseHtml, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
};

function generateFullUI(cf, headers, ip, dc) {
  // Mapping Bot Data
  const bot = cf.botManagement || {};
  const tls = {
    version: cf.tlsVersion || "TLSv1.3",
    cipher: cf.tlsCipher || "AEAD-AES128-GCM-SHA256",
    helloLength: cf.tlsClientHelloLength || "1733",
    clientRandom: cf.tlsClientRandom || "ClJm2Vr73psxQA9/YM8z2eyP2PilKn3LDqo7w1HouP4=",
    ciphersSha1: cf.tlsClientCiphersSha1 || "Lpgh4nZDwXwOxYlAtY3t8/duBzw=",
    extSha1: cf.tlsClientExtensionsSha1 || "yIvQrogzUfW4q6UCogXPblIU7GU=",
    extSha1Le: cf.tlsClientExtensionsSha1Le || "kmn8PDEekYCkGSa53hbi/ohOk1o="
  };

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
        :root {
            --bg: #121212;
            --card: #1a1a1a;
            --border: #2a2a2a;
            --text-main: #b3b3b3;
            --text-light: #eeeeee;
            --blue-elvora: #3b82f6;
            --orange-cf: #f4811f;
        }
        body { 
            background-color: var(--bg); 
            color: var(--text-main); 
            font-family: 'Inter', sans-serif; 
            font-size: 13px;
            letter-spacing: -0.01em;
        }
        .mono { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; }
        .card { background-color: var(--card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
        .card-header { 
            padding: 10px 20px; 
            border-bottom: 1px solid var(--border); 
            font-size: 11px; 
            font-weight: 700; 
            text-transform: uppercase; 
            letter-spacing: 0.05em;
            color: #666;
            background: rgba(255,255,255,0.02);
        }
        .data-row { 
            display: flex; 
            justify-content: space-between; 
            padding: 9px 20px; 
            border-bottom: 1px solid #222; 
        }
        .data-row:last-child { border-bottom: none; }
        .label { color: #777; }
        .value { color: var(--text-light); text-align: right; }
        
        /* Map Customization */
        #map { height: 380px; width: 100%; border-bottom: 1px solid var(--border); z-index: 1; }
        .leaflet-container { background: #0d0d0d !important; }
        .leaflet-bar a { background: #222 !important; color: #ccc !important; border: 1px solid #333 !important; }
        .leaflet-popup-content-wrapper { background: #1a1a1a; color: #fff; border: 1px solid #333; border-radius: 8px; font-size: 12px; }
        .leaflet-popup-tip { background: #1a1a1a; }

        /* Badge Styles */
        .badge { padding: 2px 8px; border-radius: 5px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
        .badge-blue { background: rgba(59, 130, 246, 0.1); color: var(--blue-elvora); }
        .badge-orange { background: rgba(244, 129, 31, 0.1); color: var(--orange-cf); }
        .badge-green { background: rgba(34, 197, 94, 0.1); color: #22c55e; }

        /* Copied Effect */
        .btn-copy { 
            background: #222; 
            border: 1px solid #333; 
            padding: 5px 15px; 
            border-radius: 8px; 
            font-size: 12px; 
            color: #888; 
            font-weight: 500;
            transition: all 0.2s;
        }
        .btn-copy:active { transform: scale(0.95); }
        .copied { border-color: #22c55e !important; color: #22c55e !important; }

        .status-dot { width: 8px; height: 8px; background: #f97316; border-radius: 50%; display: inline-block; margin-right: 10px; box-shadow: 0 0 10px #f97316; }
    </style>
</head>
<body class="p-4 md:p-8">

    <div class="max-w-2xl mx-auto space-y-5">
        
        <!-- Navbar -->
        <div class="flex justify-between items-center px-1">
            <div class="flex items-center font-bold text-[14px] text-gray-200">
                <span class="status-dot"></span>
                <span>api.elvora.eu.cc</span>
            </div>
            <button onclick="copyFullJson()" id="btnCopy" class="btn-copy">Copy JSON</button>
        </div>

        <!-- Alert Migration -->
        <div class="card p-4 text-[12px] flex gap-4 leading-relaxed items-start">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" class="mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <div class="text-gray-500">
                Frontend Playground Elvora telah pindah ke <a href="https://elvora.eu.cc" class="text-blue-500 hover:underline">elvora.eu.cc</a>. Halaman ini hanya server API.
            </div>
        </div>

        <!-- HERO SECTION (Map & Overview) -->
        <div class="card shadow-2xl">
            <div id="map"></div>
            <div class="p-6 grid grid-cols-2 gap-y-7">
                <div>
                    <p class="text-[10px] font-bold uppercase text-gray-600 mb-1 tracking-widest">IP Address</p>
                    <p class="text-[17px] font-bold text-blue-500 mono">${ip}</p>
                </div>
                <div>
                    <p class="text-[10px] font-bold uppercase text-gray-600 mb-1 tracking-widest">Protokol</p>
                    <p class="text-[14px] font-semibold text-gray-200">HTTP/1.1 / IPv4</p>
                </div>
                <div>
                    <p class="text-[10px] font-bold uppercase text-gray-600 mb-1 tracking-widest">Lokasi Anda</p>
                    <p class="text-[14px] font-semibold text-gray-300">${cf.city || 'Pasarkemis'}, ${cf.regionCode || 'JB'}, ${cf.country || 'ID'}</p>
                </div>
                <div>
                    <p class="text-[10px] font-bold uppercase text-gray-600 mb-1 tracking-widest">CF Edge Server</p>
                    <p class="text-[14px] font-semibold text-gray-300">${dc.city}, ${dc.country}</p>
                </div>
            </div>
        </div>

        <!-- SECTION: GEOLOKASI -->
        <div class="card">
            <div class="card-header">Geolokasi Anda</div>
            <div class="py-1">
                <div class="data-row"><span class="label">IP</span> <span class="badge badge-blue mono">${ip}</span></div>
                <div class="data-row"><span class="label">IP Version</span> <span class="badge badge-blue">IPv4</span></div>
                <div class="data-row"><span class="label">Kota</span> <span class="value">${cf.city || 'N/A'}</span></div>
                <div class="data-row"><span class="label">Provinsi</span> <span class="value">${cf.region || 'N/A'}</span></div>
                <div class="data-row"><span class="label">Kode Region</span> <span class="value">${cf.regionCode || 'N/A'}</span></div>
                <div class="data-row"><span class="label">Negara</span> <span class="value">${cf.country || 'ID'}</span></div>
                <div class="data-row"><span class="label">Benua</span> <span class="value">${cf.continent || 'AS'}</span></div>
                <div class="data-row"><span class="label">Kode Pos</span> <span class="value">${cf.postalCode || 'N/A'}</span></div>
                <div class="data-row"><span class="label">Timezone</span> <span class="value">${cf.timezone || 'N/A'}</span></div>
                <div class="data-row"><span class="label">Latitude</span> <span class="value mono">${cf.latitude || '0'}</span></div>
                <div class="data-row"><span class="label">Longitude</span> <span class="value mono">${cf.longitude || '0'}</span></div>
                <div class="data-row"><span class="label">EU Country</span> <span class="value">${cf.isEUCountry ? "Ya" : "Tidak"}</span></div>
            </div>
        </div>

        <!-- SECTION: CLOUDFLARE EDGE -->
        <div class="card">
            <div class="card-header">Cloudflare Edge Server</div>
            <div class="py-1">
                <div class="data-row"><span class="label">Colo Code</span> <span class="badge badge-orange">${cf.colo}</span></div>
                <div class="data-row"><span class="label">Nama DC</span> <span class="value">${dc.city}, ${dc.country}</span></div>
                <div class="data-row"><span class="label">Kota DC</span> <span class="value">${dc.city}</span></div>
                <div class="data-row"><span class="label">Negara DC</span> <span class="value">${dc.country}</span></div>
                <div class="data-row"><span class="label">Region DC</span> <span class="value">Asia Pacific</span></div>
                <div class="data-row"><span class="label">Lat DC</span> <span class="value mono">${dc.lat}</span></div>
                <div class="data-row"><span class="label">Lon DC</span> <span class="value mono">${dc.lon}</span></div>
                <div class="data-row"><span class="label">HTTP Protocol</span> <span class="value">HTTP/1.1</span></div>
                <div class="data-row"><span class="label">TCP RTT</span> <span class="value">${cf.clientTcpRtt || 0} ms</span></div>
                <div class="data-row"><span class="label">Keep Alive</span> <span class="value">1</span></div>
                <div class="data-row"><span class="label">Accept Encoding</span> <span class="value text-[11px] mono text-gray-500">${headers['accept-encoding']}</span></div>
                <div class="data-row"><span class="label">CF Ray</span> <span class="value text-orange-500 mono text-[11px]">${headers['cf-ray']}</span></div>
            </div>
        </div>

        <!-- SECTION: KEAMANAN & TLS -->
        <div class="card">
            <div class="card-header">Keamanan & TLS</div>
            <div class="py-1">
                <div class="data-row"><span class="label">TLS Version</span> <span class="badge badge-green">${tls.version}</span></div>
                <div class="data-row"><span class="label">TLS Cipher</span> <span class="value mono text-blue-400 text-[11px]">${tls.cipher}</span></div>
                <div class="data-row"><span class="label">Hello Length</span> <span class="value">${tls.helloLength} bytes</span></div>
                <div class="data-row flex-col gap-1 items-start">
                    <span class="label mb-1">Client Random</span>
                    <span class="value mono text-[10px] break-all block text-left text-gray-500">${tls.clientRandom}</span>
                </div>
                <div class="data-row flex-col gap-1 items-start">
                    <span class="label mb-1">Ciphers SHA1</span>
                    <span class="value mono text-[10px] text-gray-500">${tls.ciphersSha1}</span>
                </div>
            </div>
        </div>

        <!-- SECTION: BOT MANAGEMENT -->
        <div class="card">
            <div class="card-header">Bot Management Cloudflare</div>
            <div class="py-1">
                <div class="data-row"><span class="label">Bot Score</span> <span class="text-green-500 font-bold">${botScore}</span></div>
                <div class="data-row"><span class="label">Verified Bot</span> <span class="text-orange-500 font-bold">Tidak</span></div>
                <div class="data-row"><span class="label">Bot Category</span> <span class="value">None</span></div>
                <div class="data-row"><span class="label">JS Detection</span> <span class="value text-red-500">Not Passed</span></div>
                <div class="data-row"><span class="label">Corporate Proxy</span> <span class="value">Tidak</span></div>
                <div class="data-row"><span class="label">Static Resource</span> <span class="value">Tidak</span></div>
                <div class="data-row"><span class="label">Detection IDs</span> <span class="value">None</span></div>
            </div>
        </div>

        <!-- SECTION: USER AGENT -->
        <div class="card p-5">
            <p class="text-[10px] font-bold text-gray-600 uppercase mb-3 tracking-widest">User Agent Analysis</p>
            <div class="bg-black/30 p-4 rounded-lg border border-white/5 text-[11px] mono text-gray-500 leading-relaxed break-all">
                ${headers['user-agent']}
            </div>
        </div>

        <!-- Footer -->
        <footer class="pt-10 pb-20 text-center">
            <p class="text-gray-600 text-[11px] mb-6">Server API — <span class="text-gray-300 font-medium">api.elvora.eu.cc</span> • Docs & Playground: <a href="#" class="text-blue-500">elvora.eu.cc</a></p>
            
            <div class="flex flex-col items-center gap-3">
                <!-- LOGO ELVORA GAGAH -->
                <div class="text-[24px] font-black tracking-tighter text-blue-500 italic">ELVORA</div>
                <div class="h-[1px] w-12 bg-blue-900"></div>
                <p class="text-[10px] text-gray-600 uppercase tracking-[0.3em]">Edge Distributed API</p>
            </div>
            <p class="mt-8 text-[10px] text-gray-700">Powered by Cloudflare Workers • Data diproses di edge, tidak disimpan</p>
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

        // SVG Logo Lokasi Anda
        const locationSvg = \`<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#3b82f6" d="M32,2c-12.15,0-22,9.85-22,22c0,5.799,3.469,11.469,5.913,15h0.01L32,61l16.077-22h0.01C50.281,35.781,54,29.799,54,24C54,11.85,44.15,2,32,2z M32,38c-7.732,0-14-6.268-14-14s6.268-14,14-14s14,6.268,14,14 S39.732,38,32,38z"/>
        </svg>\`;

        const userIcon = L.divIcon({
            html: locationSvg,
            className: 'marker-user',
            iconSize: [35, 35],
            iconAnchor: [17, 35]
        });

        // SVG Logo Cloudflare
        const cfSvg = \`<svg viewBox="0 -70 256 256" xmlns="http://www.w3.org/2000/svg">
            <path d="M176.332,109.3483 C177.925,104.0373 177.394,98.7263 174.739,95.5393 C172.083,92.3523 168.365,90.2283 163.585,89.6973 L71.17,88.6343 C70.639,88.6343 70.108,88.1033 69.577,88.1033 C69.046,87.5723 69.046,87.0413 69.577,86.5103 C70.108,85.4483 70.639,84.9163 71.701,84.9163 L164.647,83.8543 C175.801,83.3233 187.486,74.2943 191.734,63.6723 L197.046,49.8633 C197.046,49.3313 197.577,48.8003 197.046,48.2693 C191.203,21.1823 166.772,0.9993 138.091,0.9993 C111.535,0.9993 88.697,17.9953 80.73,41.8963 C75.419,38.1783 69.046,36.0533 61.61,36.5853 C48.863,37.6473 38.772,48.2693 37.178,61.0163 C36.647,64.2033 37.178,67.3903 37.71,70.5763 C16.996,71.1073 0,88.1033 0,109.3483 C0,111.4723 0,113.0663 0.531,115.1903 C0.531,116.2533 1.593,116.7843 2.125,116.7843 L172.614,116.7843 C173.676,116.7843 174.739,116.2533 174.739,115.1903 L176.332,109.3483 Z" fill="#F4811F"/>
            <path d="M205.5436,49.8628 L202.8876,49.8628 C202.3566,49.8628 201.8256,50.3938 201.2946,50.9248 L197.5766,63.6718 C195.9836,68.9828 196.5146,74.2948 199.1706,77.4808 C201.8256,80.6678 205.5436,82.7918 210.3236,83.3238 L229.9756,84.3858 C230.5066,84.3858 231.0376,84.9168 231.5686,84.9168 C232.0996,85.4478 232.0996,85.9788 231.5686,86.5098 C231.0376,87.5728 230.5066,88.1038 229.4436,88.1038 L209.2616,89.1658 C198.1076,89.6968 186.4236,98.7258 182.1746,109.3478 L181.1116,114.1288 C180.5806,114.6598 181.1116,115.7218 182.1746,115.7218 L252.2826,115.7218 C253.3446,115.7218 253.8756,115.1908 253.8756,114.1288 C254.9376,109.8798 255.9996,105.0998 255.9996,100.3188 C255.9996,72.7008 233.1616,49.8628 205.5436,49.8628" fill="#FAAD3F"/>
        </svg>\`;

        const cfIcon = L.divIcon({
            html: cfSvg,
            className: 'marker-cf',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        // Add Markers with Click Popups
        L.marker([uLat, uLon], {icon: userIcon}).addTo(map).bindPopup("<b>Anda:</b> ${cf.city || 'Pasarkemis'}, ID");
        L.marker([dLat, dLon], {icon: cfIcon}).addTo(map).bindPopup("<b>CF Edge Server:</b> ${dc.city}, ${dc.country}");

        // Connect with Dotted Line
        L.polyline([[uLat, uLon], [dLat, dLon]], { color: '#f97316', dashArray: '5, 10', weight: 1.5, opacity: 0.5 }).addTo(map);

        function copyFullJson() {
            const data = ${JSON.stringify({ cf, headers, ip })};
            navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
                const btn = document.getElementById('btnCopy');
                btn.innerText = '✓ Copied!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.innerText = 'Copy JSON';
                    btn.classList.remove('copied');
                }, 2000);
            });
        }
    </script>
</body>
</html>`;
}
