/**
 * ELVORA API - CORE ENGINE v2.0 (SUPER COMPLETE)
 * Developed for: api.elvora.eu.cc
 * 100% Clone of api.siputzx.my.id Style
 */

// Database Lokasi Data Center Cloudflare
const CLOUDFLARE_COLO_MAP = {
  "CGK": { city: "Jakarta", country: "Indonesia", lat: -6.12557, lon: 106.655998, region: "Asia Pacific" },
  "SIN": { city: "Singapore", country: "Singapore", lat: 1.35019, lon: 103.994003, region: "Asia Pacific" },
  "HKG": { city: "Hong Kong", country: "Hong Kong", lat: 22.3193, lon: 114.1694, region: "Asia Pacific" },
  "NRT": { city: "Tokyo", country: "Japan", lat: 35.772, lon: 140.392, region: "Asia Pacific" },
  "KUL": { city: "Kuala Lumpur", country: "Malaysia", lat: 3.1390, lon: 101.6869, region: "Asia Pacific" },
  "BKK": { city: "Bangkok", country: "Thailand", lat: 13.7563, lon: 100.5018, region: "Asia Pacific" },
  "TPE": { city: "Taipei", country: "Taiwan", lat: 25.0330, lon: 121.5654, region: "Asia Pacific" },
  "ICN": { city: "Seoul", country: "South Korea", lat: 37.4602, lon: 126.4407, region: "Asia Pacific" },
  "SYD": { city: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093, region: "Asia Pacific" },
  "LHR": { city: "London", country: "United Kingdom", lat: 51.4700, lon: -0.4543, region: "Europe" },
  "SFO": { city: "San Francisco", country: "USA", lat: 37.7749, lon: -122.4194, region: "North America" }
};

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const headers = Object.fromEntries(request.headers);
      const cf = request.cf || {};
      const ip = headers['cf-connecting-ip'] || headers['x-real-ip'] || '103.147.246.4';

      // Detail Colo
      const coloCode = cf.colo || "CGK";
      const dc = CLOUDFLARE_COLO_MAP[coloCode] || { 
        city: cf.city || "Jakarta", 
        country: cf.country || "Indonesia", 
        lat: (parseFloat(cf.latitude) || -6) + 0.05, 
        lon: (parseFloat(cf.longitude) || 106) + 0.1,
        region: "Asia Pacific"
      };

      // Handle JSON Request
      if (url.searchParams.has('json') || url.pathname === '/api/json') {
        return new Response(JSON.stringify({ ip, headers, cf }, null, 2), {
          headers: { 'content-type': 'application/json' }
        });
      }

      // Generate UI
      const html = generateUI(cf, headers, ip, dc, coloCode);
      return new Response(html, {
        headers: { 'content-type': 'text/html; charset=utf-8' }
      });
    } catch (e) {
      return new Response(`Worker Error: ${e.message}`, { status: 500 });
    }
  }
};

function generateUI(cf, headers, ip, dc, coloCode) {
  // Parsing Data Real-time
  const botScore = cf.botManagement?.score || 99;
  const isVerifiedBot = cf.botManagement?.verifiedBot ? "Ya" : "Tidak";
  const tlsVersion = cf.tlsVersion || "TLSv1.3";
  const tlsCipher = cf.tlsCipher || "AEAD-AES128-GCM-SHA256";
  const httpProtocol = cf.httpProtocol || "HTTP/1.1";

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
            --card: #181818;
            --border: #262626;
            --text-muted: #666666;
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
            -webkit-font-smoothing: antialiased;
        }
        .mono { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; }
        .card { background-color: var(--card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 16px; }
        .card-header { 
            padding: 10px 20px; 
            border-bottom: 1px solid var(--border); 
            font-size: 11px; 
            font-weight: 700; 
            text-transform: uppercase; 
            color: var(--text-muted);
            letter-spacing: 0.05em;
            background: rgba(255,255,255,0.01);
        }
        .row { display: flex; justify-content: space-between; padding: 10px 20px; border-bottom: 1px solid #1f1f1f; }
        .row:last-child { border-bottom: none; }
        .label { color: var(--text-muted); }
        .val { color: var(--text-light); text-align: right; }
        
        /* Map Custom */
        #map { height: 380px; width: 100%; border-bottom: 1px solid var(--border); z-index: 1; }
        .leaflet-bar a { background: #222 !important; color: #fff !important; border: 1px solid #333 !important; }
        .leaflet-popup-content-wrapper { background: #1a1a1a; color: #fff; border: 1px solid #333; font-size: 12px; border-radius: 8px; }
        .leaflet-popup-tip { background: #1a1a1a; }

        /* Badge */
        .badge { padding: 2px 8px; border-radius: 5px; font-size: 10px; font-weight: 700; }
        .badge-blue { background: rgba(59, 130, 246, 0.1); color: var(--blue-elvora); }
        .badge-orange { background: rgba(244, 129, 31, 0.1); color: var(--orange-cf); }

        /* Buttons */
        .btn-copy { 
            background: #222; 
            border: 1px solid #333; 
            padding: 4px 14px; 
            border-radius: 8px; 
            font-size: 12px; 
            color: #888; 
            transition: 0.2s;
        }
        .btn-copy:hover { border-color: #555; color: #fff; }
        .copied { border-color: #22c55e !important; color: #22c55e !important; }

        .pulse-dot { width: 8px; height: 8px; background: #f97316; border-radius: 50%; display: inline-block; margin-right: 10px; box-shadow: 0 0 10px #f97316; }
        
        /* Layout Fix */
        .grid-hero { display: grid; grid-template-cols: 1fr 1fr; gap: 24px; padding: 20px; }
    </style>
</head>
<body class="p-3 md:p-6 lg:p-10">

    <div class="max-w-2xl mx-auto">
        
        <!-- Navbar -->
        <div class="flex justify-between items-center mb-4 px-1">
            <div class="flex items-center font-bold text-[14px] text-gray-200">
                <span class="pulse-dot"></span>
                <span>api.elvora.eu.cc</span>
            </div>
            <button onclick="copyData()" id="btnCopy" class="btn-copy">Copy JSON</button>
        </div>

        <!-- Migration Info -->
        <div class="card p-4 text-[12px] flex gap-4 items-start">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="2" class="mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
             <div class="text-gray-500">
                Frontend Playground Elvora telah pindah ke <a href="https://elvora.eu.cc" class="text-blue-500 hover:underline font-medium">elvora.eu.cc</a>. Halaman ini hanya server API.
             </div>
        </div>

        <!-- HERO: Map & Quick Info -->
        <div class="card shadow-2xl">
            <div id="map"></div>
            <div class="grid-hero">
                <div>
                    <p class="text-[10px] font-bold uppercase text-gray-600 mb-1 tracking-widest">IP Address</p>
                    <p class="text-[17px] font-bold text-blue-500 mono">${ip}</p>
                </div>
                <div>
                    <p class="text-[10px] font-bold uppercase text-gray-600 mb-1 tracking-widest">Protokol</p>
                    <p class="text-[14px] font-semibold text-gray-200">${httpProtocol} / IPv4</p>
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

        <!-- GEOLOKASI ANDA -->
        <div class="card">
            <div class="card-header">Geolokasi Anda</div>
            <div class="row"><span class="label">IP</span> <span class="badge badge-blue mono">${ip}</span></div>
            <div class="row"><span class="label">IP Version</span> <span class="badge badge-blue">IPv4</span></div>
            <div class="row"><span class="label">Kota</span> <span class="val">${cf.city || 'N/A'}</span></div>
            <div class="row"><span class="label">Provinsi</span> <span class="val">${cf.region || 'N/A'}</span></div>
            <div class="row"><span class="label">Kode Region</span> <span class="val">${cf.regionCode || 'N/A'}</span></div>
            <div class="row"><span class="label">Negara</span> <span class="val">${cf.country || 'ID'}</span></div>
            <div class="row"><span class="label">Benua</span> <span class="val">${cf.continent || 'AS'}</span></div>
            <div class="row"><span class="label">Kode Pos</span> <span class="val">${cf.postalCode || 'N/A'}</span></div>
            <div class="row"><span class="label">Timezone</span> <span class="val">${cf.timezone || 'N/A'}</span></div>
            <div class="row"><span class="label">Latitude</span> <span class="val mono">${cf.latitude || '0'}</span></div>
            <div class="row"><span class="label">Longitude</span> <span class="val mono">${cf.longitude || '0'}</span></div>
            <div class="row"><span class="label">EU Country</span> <span class="val">Tidak</span></div>
        </div>

        <!-- CLOUDFLARE EDGE SERVER -->
        <div class="card">
            <div class="card-header">Cloudflare Edge Server</div>
            <div class="row"><span class="label">Colo Code</span> <span class="badge badge-orange">${coloCode}</span></div>
            <div class="row"><span class="label">Nama DC</span> <span class="val">${dc.city}, ${dc.country}</span></div>
            <div class="row"><span class="label">Kota DC</span> <span class="val">${dc.city}</span></div>
            <div class="row"><span class="label">Negara DC</span> <span class="val">${dc.country}</span></div>
            <div class="row"><span class="label">Region DC</span> <span class="val">${dc.region}</span></div>
            <div class="row"><span class="label">Lat DC</span> <span class="val mono">${dc.lat}</span></div>
            <div class="row"><span class="label">Lon DC</span> <span class="val mono">${dc.lon}</span></div>
            <div class="row"><span class="label">HTTP Protocol</span> <span class="val">${httpProtocol}</span></div>
            <div class="row"><span class="label">TCP RTT</span> <span class="val">${cf.clientTcpRtt || 0} ms</span></div>
            <div class="row"><span class="label">Keep Alive</span> <span class="val">1</span></div>
            <div class="row"><span class="label">Accept Encoding</span> <span class="val text-[11px] mono text-gray-500 truncate ml-8">${headers['accept-encoding']}</span></div>
            <div class="row"><span class="label">CF Ray</span> <span class="val text-orange-500 mono text-[11px] font-bold">${headers['cf-ray']}</span></div>
        </div>

        <!-- KEAMANAN & TLS -->
        <div class="card">
            <div class="card-header">Keamanan & TLS</div>
            <div class="row"><span class="label">TLS Version</span> <span class="val text-green-500 font-bold">${tlsVersion}</span></div>
            <div class="row"><span class="label">TLS Cipher</span> <span class="val text-blue-400 mono text-[11px]">${tlsCipher}</span></div>
            <div class="row"><span class="label">Hello Length</span> <span class="val">${cf.tlsClientHelloLength || 1733} bytes</span></div>
            <div class="p-5 border-t border-white/5 space-y-3">
                <div>
                    <span class="label block mb-1">Client Random</span>
                    <span class="val block text-left mono text-[10px] text-gray-500 break-all leading-relaxed">${cf.tlsClientRandom || 'ClJm2Vr73psxQA9/YM8z2eyP2PilKn3LDqo7w1HouP4='}</span>
                </div>
                <div class="flex justify-between">
                    <span class="label">Ciphers SHA1</span>
                    <span class="val mono text-[10px] text-gray-500">${cf.tlsClientCiphersSha1 || 'Lpgh4nZDwXwOxYlAtY3t8/duBzw='}</span>
                </div>
                <div class="flex justify-between">
                    <span class="label">Extensions SHA1</span>
                    <span class="val mono text-[10px] text-gray-500">${cf.tlsClientExtensionsSha1 || 'yIvQrogzUfW4q6UCogXPblIU7GU='}</span>
                </div>
            </div>
        </div>

        <!-- JARINGAN & ISP -->
        <div class="card">
            <div class="card-header">Jaringan & ISP</div>
            <div class="row"><span class="label">ASN</span> <span class="val mono">AS${cf.asn}</span></div>
            <div class="row"><span class="label">Organisasi</span> <span class="val">${cf.asOrganization || 'PT. Putra Lebak Banten'}</span></div>
            <div class="row"><span class="label">Host</span> <span class="val">api.elvora.eu.cc</span></div>
            <div class="row"><span class="label">Connection</span> <span class="val">Keep-Alive</span></div>
        </div>

        <!-- BOT MANAGEMENT -->
        <div class="card">
            <div class="card-header">Bot Management Cloudflare</div>
            <div class="row"><span class="label">Bot Score</span> <span class="text-green-500 font-bold">${botScore}</span></div>
            <div class="row"><span class="label">Verified Bot</span> <span class="text-orange-500 font-bold">Tidak</span></div>
            <div class="row"><span class="label">JS Detection</span> <span class="val">Not Passed</span></div>
            <div class="row"><span class="label">Static Resource</span> <span class="val">Tidak</span></div>
        </div>

        <!-- REQUEST INFO -->
        <div class="card">
            <div class="card-header">Request Info</div>
            <div class="row"><span class="label">Method</span> <span class="badge badge-blue">GET</span></div>
            <div class="row"><span class="label">Redirect</span> <span class="val">manual</span></div>
            <div class="row"><span class="label">Sec-Fetch-Dest</span> <span class="val">${headers['sec-fetch-dest'] || 'document'}</span></div>
            <div class="p-5 border-t border-white/5">
                <p class="text-[10px] font-bold text-gray-600 uppercase mb-2">User Agent</p>
                <div class="bg-black/40 p-3 rounded-lg border border-white/5 text-[11px] mono text-gray-500 leading-relaxed break-all">
                    ${headers['user-agent']}
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="pt-10 pb-24 text-center">
            <div class="mb-8">
                <div class="text-[26px] font-black tracking-tighter text-blue-500 italic">ELVORA</div>
                <div class="text-[9px] text-gray-600 uppercase tracking-[0.4em] font-bold">Distributed Gateway</div>
            </div>
            <p class="text-gray-600 text-[11px]">Server API — <span class="text-gray-400">api.elvora.eu.cc</span></p>
            <p class="text-[10px] text-gray-700 mt-2">Powered by Cloudflare Workers • Data diproses secara real-time</p>
        </footer>
    </div>

    <script>
        // Data Center & User Coordinates
        const userPos = [${cf.latitude || -6.17}, ${cf.longitude || 106.82}];
        const dcPos = [${dc.lat}, ${dc.lon}];

        const map = L.map('map', { zoomControl: false, attributionControl: false }).setView(userPos, 11);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
        L.control.zoom({ position: 'topright' }).addTo(map);

        // Logo Lokasi (SVG Biru)
        const locIcon = L.divIcon({
            html: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#3b82f6" d="M32,2c-12.15,0-22,9.85-22,22c0,5.799,3.469,11.469,5.913,15h0.01L32,61l16.077-22h0.01C50.281,35.781,54,29.799,54,24C54,11.85,44.15,2,32,2z M32,38c-7.732,0-14-6.268-14-14s6.268-14,14-14s14,6.268,14,14 S39.732,38,32,38z"/></svg>',
            className: '', iconSize: [36, 36], iconAnchor: [18, 36]
        });

        // Logo Cloudflare (SVG Orange)
        const cfIcon = L.divIcon({
            html: '<svg viewBox="0 -70 256 256" xmlns="http://www.w3.org/2000/svg"><path d="M176.332,109.3483 C177.925,104.0373 177.394,98.7263 174.739,95.5393 C172.083,92.3523 168.365,90.2283 163.585,89.6973 L71.17,88.6343 C70.639,88.6343 70.108,88.1033 69.577,88.1033 C69.046,87.5723 69.046,87.0413 69.577,86.5103 C70.108,85.4483 70.639,84.9163 71.701,84.9163 L164.647,83.8543 C175.801,83.3233 187.486,74.2943 191.734,63.6723 L197.046,49.8633 C197.046,49.3313 197.577,48.8003 197.046,48.2693 C191.203,21.1823 166.772,0.9993 138.091,0.9993 C111.535,0.9993 88.697,17.9953 80.73,41.8963 C75.419,38.1783 69.046,36.0533 61.61,36.5853 C48.863,37.6473 38.772,48.2693 37.178,61.0163 C36.647,64.2033 37.178,67.3903 37.71,70.5763 C16.996,71.1073 0,88.1033 0,109.3483 C0,111.4723 0,113.0663 0.531,115.1903 C0.531,116.2533 1.593,116.7843 2.125,116.7843 L172.614,116.7843 C173.676,116.7843 174.739,116.2533 174.739,115.1903 L176.332,109.3483 Z" fill="#F4811F"/><path d="M205.5436,49.8628 L202.8876,49.8628 C202.3566,49.8628 201.8256,50.3938 201.2946,50.9248 L197.5766,63.6718 C195.9836,68.9828 196.5146,74.2948 199.1706,77.4808 C201.8256,80.6678 205.5436,82.7918 210.3236,83.3238 L229.9756,84.3858 C230.5066,84.3858 231.0376,84.9168 231.5686,84.9168 C232.0996,85.4478 232.0996,85.9788 231.5686,86.5098 C231.0376,87.5728 230.5066,88.1038 229.4436,88.1038 L209.2616,89.1658 C198.1076,89.6968 186.4236,98.7258 182.1746,109.3478 L181.1116,114.1288 C180.5806,114.6598 181.1116,115.7218 182.1746,115.7218 L252.2826,115.7218 C253.3446,115.7218 253.8756,115.1908 253.8756,114.1288 C254.9376,109.8798 255.9996,105.0998 255.9996,100.3188 C255.9996,72.7008 233.1616,49.8628 205.5436,49.8628" fill="#FAAD3F"/></svg>',
            className: '', iconSize: [35, 35], iconAnchor: [17, 17]
        });

        // Add Markers & Line
        L.marker(userPos, {icon: locIcon}).addTo(map).bindPopup("<b>Anda:</b> ${cf.city || 'Pasarkemis'}, ID");
        L.marker(dcPos, {icon: cfIcon}).addTo(map).bindPopup("<b>CF Edge Server:</b> ${dc.city}, ${dc.country}");
        L.polyline([userPos, dcPos], { color: '#f97316', dashArray: '5, 8', weight: 1.5, opacity: 0.5 }).addTo(map);

        function copyData() {
            const json = ${JSON.stringify({ ip, headers, cf })};
            navigator.clipboard.writeText(JSON.stringify(json, null, 2)).then(() => {
                const b = document.getElementById('btnCopy');
                b.innerText = '✓ Copied!';
                b.classList.add('copied');
                setTimeout(() => { b.innerText = 'Copy JSON'; b.classList.remove('copied'); }, 2000);
            });
        }
    </script>
</body>
</html>`;
}
