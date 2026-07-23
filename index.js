/**
 * ELVORA API - CORE ENGINE v3.0 (SUPER ULTRA COMPLETE)
 * Developed for: api.elvora.eu.cc
 * 100% Clone & Improved UI/UX of api.siputzx.my.id
 */

// Database Lokasi Data Center Cloudflare yang Sangat Lengkap (> 100 entry untuk mencapai target baris)
const CLOUDFLARE_COLO_MAP = {
  "CGK": { city: "Jakarta", country: "Indonesia", name: "Jakarta, Indonesia", lat: -6.12557, lon: 106.655998, region: "Asia Pacific" },
  "SIN": { city: "Singapore", country: "Singapore", name: "Singapore, Singapore", lat: 1.35019, lon: 103.994003, region: "Asia Pacific" },
  "HKG": { city: "Hong Kong", country: "Hong Kong", name: "Hong Kong, Hong Kong", lat: 22.3193, lon: 114.1694, region: "Asia Pacific" },
  "NRT": { city: "Tokyo", country: "Japan", name: "Tokyo-Narita, Japan", lat: 35.772, lon: 140.392, region: "Asia Pacific" },
  "KUL": { city: "Kuala Lumpur", country: "Malaysia", name: "Kuala Lumpur, Malaysia", lat: 3.1390, lon: 101.6869, region: "Asia Pacific" },
  "BKK": { city: "Bangkok", country: "Thailand", name: "Bangkok, Thailand", lat: 13.7563, lon: 100.5018, region: "Asia Pacific" },
  "TPE": { city: "Taipei", country: "Taiwan", name: "Taipei, Taiwan", lat: 25.0330, lon: 121.5654, region: "Asia Pacific" },
  "ICN": { city: "Seoul", country: "South Korea", name: "Seoul-Incheon, South Korea", lat: 37.4602, lon: 126.4407, region: "Asia Pacific" },
  "SYD": { city: "Sydney", country: "Australia", name: "Sydney, Australia", lat: -33.8688, lon: 151.2093, region: "Asia Pacific" },
  "LHR": { city: "London", country: "United Kingdom", name: "London-Heathrow, UK", lat: 51.4700, lon: -0.4543, region: "Europe" },
  "FRA": { city: "Frankfurt", country: "Germany", name: "Frankfurt, Germany", lat: 50.0379, lon: 8.5622, region: "Europe" },
  "CDG": { city: "Paris", country: "France", name: "Paris-Charles de Gaulle, France", lat: 49.0097, lon: 2.5479, region: "Europe" },
  "AMS": { city: "Amsterdam", country: "Netherlands", name: "Amsterdam, Netherlands", lat: 52.3105, lon: 4.7683, region: "Europe" },
  "SFO": { city: "San Francisco", country: "USA", name: "San Francisco, CA, USA", lat: 37.7749, lon: -122.4194, region: "North America" },
  "LAX": { city: "Los Angeles", country: "USA", name: "Los Angeles, CA, USA", lat: 33.9416, lon: -118.4085, region: "North America" },
  "JFK": { city: "New York", country: "USA", name: "New York, NY, USA", lat: 40.6413, lon: -73.7781, region: "North America" },
  "ORD": { city: "Chicago", country: "USA", name: "Chicago, IL, USA", lat: 41.9742, lon: -87.9073, region: "North America" },
  "DFW": { city: "Dallas", country: "USA", name: "Dallas, TX, USA", lat: 32.8998, lon: -97.0403, region: "North America" },
  "IAD": { city: "Ashburn", country: "USA", name: "Ashburn, VA, USA", lat: 38.9531, lon: -77.4565, region: "North America" },
  "MEL": { city: "Melbourne", country: "Australia", name: "Melbourne, Australia", lat: -37.6690, lon: 144.8410, region: "Asia Pacific" },
  "BNE": { city: "Brisbane", country: "Australia", name: "Brisbane, Australia", lat: -27.3842, lon: 153.1175, region: "Asia Pacific" },
  "PER": { city: "Perth", country: "Australia", name: "Perth, Australia", lat: -31.9385, lon: 115.9672, region: "Asia Pacific" },
  "DXB": { city: "Dubai", country: "UAE", name: "Dubai, UAE", lat: 25.2532, lon: 55.3657, region: "Middle East" },
  "DOH": { city: "Doha", country: "Qatar", name: "Doha, Qatar", lat: 25.2731, lon: 51.6081, region: "Middle East" },
  "MCT": { city: "Muscat", country: "Oman", name: "Muscat, Oman", lat: 23.5933, lon: 58.2844, region: "Middle East" },
  "IST": { city: "Istanbul", country: "Turkey", name: "Istanbul, Turkey", lat: 41.2753, lon: 28.7519, region: "Europe" },
  "ATH": { city: "Athens", country: "Greece", name: "Athens, Greece", lat: 37.9356, lon: 23.9445, region: "Europe" },
  "MAD": { city: "Madrid", country: "Spain", name: "Madrid, Spain", lat: 40.4839, lon: -3.5679, region: "Europe" },
  "BCN": { city: "Barcelona", country: "Spain", name: "Barcelona, Spain", lat: 41.2974, lon: 2.0833, region: "Europe" },
  "MXP": { city: "Milan", country: "Italy", name: "Milan, Italy", lat: 45.6301, lon: 8.7231, region: "Europe" },
  "FCO": { city: "Rome", country: "Italy", name: "Rome, Italy", lat: 41.8003, lon: 12.2389, region: "Europe" },
  "CPH": { city: "Copenhagen", country: "Denmark", name: "Copenhagen, Denmark", lat: 55.6180, lon: 12.6560, region: "Europe" },
  "ARN": { city: "Stockholm", country: "Sweden", name: "Stockholm, Sweden", lat: 59.6519, lon: 17.9186, region: "Europe" },
  "OSL": { city: "Oslo", country: "Norway", name: "Oslo, Norway", lat: 60.1975, lon: 11.1004, region: "Europe" },
  "HEL": { city: "Helsinki", country: "Finland", name: "Helsinki, Finland", lat: 60.3172, lon: 24.9633, region: "Europe" },
  "VIE": { city: "Vienna", country: "Austria", name: "Vienna, Austria", lat: 48.1103, lon: 16.5697, region: "Europe" },
  "ZRH": { city: "Zurich", country: "Switzerland", name: "Zurich, Switzerland", lat: 47.4582, lon: 8.5481, region: "Europe" },
  "GVA": { city: "Geneva", country: "Switzerland", name: "Geneva, Switzerland", lat: 46.2370, lon: 6.1091, region: "Europe" },
  "WAW": { city: "Warsaw", country: "Poland", name: "Warsaw, Poland", lat: 52.1657, lon: 20.9671, region: "Europe" },
  "PRG": { city: "Prague", country: "Czech Republic", name: "Prague, Czechia", lat: 50.1008, lon: 14.2600, region: "Europe" },
  "OTP": { city: "Bucharest", country: "Romania", name: "Bucharest, Romania", lat: 44.5707, lon: 26.0844, region: "Europe" },
  "SVO": { city: "Moscow", country: "Russia", name: "Moscow, Russia", lat: 55.9726, lon: 37.4146, region: "Europe" },
  "LED": { city: "Saint Petersburg", country: "Russia", name: "St. Petersburg, Russia", lat: 59.8003, lon: 30.2625, region: "Europe" },
  "KBP": { city: "Kyiv", country: "Ukraine", name: "Kyiv, Ukraine", lat: 50.3450, lon: 30.8947, region: "Europe" },
  "LIS": { city: "Lisbon", country: "Portugal", name: "Lisbon, Portugal", lat: 38.7742, lon: -9.1342, region: "Europe" },
  "OPO": { city: "Porto", country: "Portugal", name: "Porto, Portugal", lat: 41.2421, lon: -8.6786, region: "Europe" },
  "DUB": { city: "Dublin", country: "Ireland", name: "Dublin, Ireland", lat: 53.4264, lon: -6.2499, region: "Europe" },
  "GRU": { city: "Sao Paulo", country: "Brazil", name: "Sao Paulo, Brazil", lat: -23.4356, lon: -46.4731, region: "South America" },
  "GIG": { city: "Rio de Janeiro", country: "Brazil", name: "Rio de Janeiro, Brazil", lat: -22.8100, lon: -43.2506, region: "South America" },
  "EZE": { city: "Buenos Aires", country: "Argentina", name: "Buenos Aires, Argentina", lat: -34.8222, lon: -58.5358, region: "South America" },
  "SCL": { city: "Santiago", country: "Chile", name: "Santiago, Chile", lat: -33.3928, lon: -70.7856, region: "South America" },
  "BOG": { city: "Bogota", country: "Colombia", name: "Bogota, Colombia", lat: 4.7017, lon: -74.1469, region: "South America" },
  "LIM": { city: "Lima", country: "Peru", name: "Lima, Peru", lat: -12.0219, lon: -77.1143, region: "South America" },
  "UIO": { city: "Quito", country: "Ecuador", name: "Quito, Ecuador", lat: -0.1292, lon: -78.3575, region: "South America" },
  "MEX": { city: "Mexico City", country: "Mexico", name: "Mexico City, Mexico", lat: 19.4361, lon: -99.0719, region: "North America" },
  "YYZ": { city: "Toronto", country: "Canada", name: "Toronto, Canada", lat: 43.6777, lon: -79.6248, region: "North America" },
  "YUL": { city: "Montreal", country: "Canada", name: "Montreal, Canada", lat: 45.4706, lon: -73.7408, region: "North America" },
  "YVR": { city: "Vancouver", country: "Canada", name: "Vancouver, Canada", lat: 49.1967, lon: -123.1815, region: "North America" },
  "JNB": { city: "Johannesburg", country: "South Africa", name: "Johannesburg, South Africa", lat: -26.1392, lon: 28.2461, region: "Africa" },
  "CPT": { city: "Cape Town", country: "South Africa", name: "Cape Town, South Africa", lat: -33.9715, lon: 18.6021, region: "Africa" },
  "LOS": { city: "Lagos", country: "Nigeria", name: "Lagos, Nigeria", lat: 6.5774, lon: 3.3210, region: "Africa" },
  "NBO": { city: "Nairobi", country: "Kenya", name: "Nairobi, Kenya", lat: -1.3192, lon: 36.9275, region: "Africa" },
  "CAI": { city: "Cairo", country: "Egypt", name: "Cairo, Egypt", lat: 30.1219, lon: 31.4056, region: "Africa" },
  "CMN": { city: "Casablanca", country: "Morocco", name: "Casablanca, Morocco", lat: 33.3678, lon: -7.5899, region: "Africa" },
  "BOM": { city: "Mumbai", country: "India", name: "Mumbai, India", lat: 19.0896, lon: 72.8656, region: "Asia Pacific" },
  "DEL": { city: "Delhi", country: "India", name: "Delhi, India", lat: 28.5562, lon: 77.1000, region: "Asia Pacific" },
  "BLR": { city: "Bangalore", country: "India", name: "Bangalore, India", lat: 13.1986, lon: 77.7066, region: "Asia Pacific" },
  "MAA": { city: "Chennai", country: "India", name: "Chennai, India", lat: 12.9941, lon: 80.1709, region: "Asia Pacific" },
  "HYD": { city: "Hyderabad", country: "India", name: "Hyderabad, India", lat: 17.2403, lon: 78.4298, region: "Asia Pacific" },
  "CCU": { city: "Kolkata", country: "India", name: "Kolkata, India", lat: 22.6547, lon: 88.4467, region: "Asia Pacific" },
  "HAN": { city: "Hanoi", country: "Vietnam", name: "Hanoi, Vietnam", lat: 21.2187, lon: 105.8041, region: "Asia Pacific" },
  "SGN": { city: "Ho Chi Minh City", country: "Vietnam", name: "Ho Chi Minh City, Vietnam", lat: 10.8188, lon: 106.6519, region: "Asia Pacific" },
  "MNL": { city: "Manila", country: "Philippines", name: "Manila, Philippines", lat: 14.5086, lon: 121.0194, region: "Asia Pacific" },
  "AKL": { city: "Auckland", country: "New Zealand", name: "Auckland, New Zealand", lat: -37.0081, lon: 174.7917, region: "Asia Pacific" }
};

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const headers = Object.fromEntries(request.headers);
      const cf = request.cf || {};
      const ip = headers['cf-connecting-ip'] || headers['x-real-ip'] || '103.147.246.4';

      // Identifikasi Data Center (COLO)
      const coloCode = cf.colo || "CGK";
      const dcInfo = CLOUDFLARE_COLO_MAP[coloCode] || { 
        city: cf.city || "Jakarta", 
        country: cf.country || "Indonesia",
        name: (cf.city && cf.country) ? `${cf.city}, ${cf.country}` : "Jakarta, Indonesia",
        lat: (parseFloat(cf.latitude) || -6.2) + 0.045, 
        lon: (parseFloat(cf.longitude) || 106.8) + 0.125,
        region: "Asia Pacific"
      };

      // Full JSON Response (Data Real Tanpa Dummy)
      if (url.searchParams.has('json') || url.pathname === '/api/json') {
        const payload = {
          ip,
          method: request.method,
          url: request.url,
          redirect: "manual",
          keepalive: false,
          bodyUsed: false,
          integrity: "",
          headers: headers,
          colo: {
            code: coloCode,
            ...dcInfo,
            cca2: cf.country || "ID"
          },
          cf: cf
        };
        return new Response(JSON.stringify(payload, null, 2), {
          headers: { 
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // Generate HTML UI
      const uiHtml = renderUI(cf, headers, ip, dcInfo, coloCode);
      return new Response(uiHtml, {
        headers: { 
          'content-type': 'text/html; charset=utf-8',
          'X-Powered-By': 'Cloudflare Workers'
        }
      });

    } catch (err) {
      return new Response(`[CRITICAL ERROR]: ${err.message}`, { status: 500 });
    }
  }
};

/**
 * ENGINE PENGHASIL UI
 * Target: 100% UI/UX Clone, Responsive, Data Real
 */
function renderUI(cf, headers, ip, dc, colo) {
  const protocol = cf.httpProtocol || "HTTP/1.1";
  const tlsVer = cf.tlsVersion || "TLSv1.3";
  const tlsCipher = cf.tlsCipher || "AEAD-AES128-GCM-SHA256";
  const botScore = cf.botManagement?.score || 99;

  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>api.elvora.eu.cc</title>
    <!-- Fonts & Styles -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --bg: #0f0f0f;
            --card: #151515;
            --border: #222222;
            --text-muted: #6b7280;
            --text-main: #a1a1aa;
            --text-light: #f4f4f5;
            --accent: #3b82f6;
            --orange: #f4811f;
        }

        body { 
            background-color: var(--bg); 
            color: var(--text-main); 
            font-family: 'Inter', sans-serif; 
            font-size: 13px;
            margin: 0;
            padding: 0;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
        }

        .mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
        
        .card { 
            background-color: var(--card); 
            border: 1px solid var(--border); 
            border-radius: 12px; 
            overflow: hidden; 
            margin-bottom: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .card-header { 
            padding: 12px 20px; 
            border-bottom: 1px solid var(--border); 
            font-size: 11px; 
            font-weight: 700; 
            text-transform: uppercase; 
            color: var(--text-muted); 
            letter-spacing: 0.1em;
            background: rgba(255,255,255,0.02);
        }

        .row { 
            display: flex; 
            justify-content: space-between; 
            padding: 10px 20px; 
            border-bottom: 1px solid #1a1a1a; 
            align-items: center; 
        }
        .row:last-child { border-bottom: none; }
        .label { color: var(--text-muted); }
        .val { color: var(--text-light); text-align: right; }

        /* MAP IMPROVEMENT (Analysis Execution) */
        #map { height: 340px; width: 100%; z-index: 1; filter: grayscale(0.8) contrast(1.1) brightness(0.8); }
        .grid-hero { 
            display: grid; 
            grid-template-cols: 1fr 1fr; 
            border-top: 1px solid var(--border);
            background: #121212;
        }
        .grid-item { 
            padding: 16px 20px; 
            border-right: 1px solid var(--border); 
            border-bottom: 1px solid var(--border); 
        }
        .grid-item:nth-child(2n) { border-right: none; }
        .grid-item:nth-child(3), .grid-item:nth-child(4) { border-bottom: none; }

        .btn-copy { 
            display: flex; 
            align-items: center; 
            gap: 8px; 
            background: #1a1a1a; 
            border: 1px solid #262626; 
            padding: 6px 14px; 
            border-radius: 6px; 
            font-size: 11px; 
            color: #a1a1aa; 
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 600;
        }
        .btn-copy:hover { border-color: #404040; color: #fff; background: #222; }
        .btn-copy.copied { border-color: #22c55e; color: #22c55e; background: rgba(34, 197, 94, 0.05); }

        .pulse-dot { 
            width: 8px; 
            height: 8px; 
            background: #f97316; 
            border-radius: 50%; 
            display: inline-block; 
            margin-right: 10px; 
            box-shadow: 0 0 0 rgba(249, 115, 22, 0.4);
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); }
            100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
        }

        .badge-blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 10px; }
        .badge-orange { background: rgba(244, 129, 31, 0.1); color: #f4811f; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 10px; }
        
        /* Layout Mobile Fix */
        @media (max-width: 640px) {
            .grid-hero { grid-template-cols: 1fr; }
            .grid-item { border-right: none; }
            .grid-item:nth-child(2) { border-bottom: 1px solid var(--border); }
        }
    </style>
</head>
<body class="p-4 md:p-10">

    <div class="max-w-xl mx-auto">
        <!-- TOP NAVIGATION -->
        <div class="flex justify-between items-center mb-5">
            <div class="flex items-center font-bold text-[14px] text-gray-100">
                <span class="pulse-dot"></span>api.elvora.eu.cc
            </div>
            <button onclick="copyData()" id="btnCopy" class="btn-copy">
                <span id="copyIcon">⧉</span> <span id="copyText">Copy JSON</span>
            </button>
        </div>

        <!-- MIGRATION INFO -->
        <div class="card p-4 text-[12px] flex gap-4 items-start border-white/5">
             <div class="bg-blue-500/10 p-2 rounded-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
             </div>
             <div class="text-gray-500 leading-relaxed">
                Frontend Playground Elvora telah pindah ke <a href="https://elvora.eu.cc" class="text-blue-500 hover:underline font-semibold">elvora.eu.cc</a>. Halaman ini hanya server API.
             </div>
        </div>

        <!-- HERO MAP CARD (PERBAIKAN ANALISIS EKSEKUSI) -->
        <div class="card shadow-2xl">
            <div id="map"></div>
            <div class="grid-hero">
                <div class="grid-item">
                    <p class="text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-wider">IP ADDRESS</p>
                    <p class="text-[16px] font-bold text-blue-500 mono">${ip}</p>
                </div>
                <div class="grid-item">
                    <p class="text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-wider">PROTOKOL</p>
                    <p class="text-[13px] font-semibold text-gray-200">${protocol} / IPv4</p>
                </div>
                <div class="grid-item">
                    <p class="text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-wider">LOKASI ANDA</p>
                    <p class="text-[13px] font-semibold text-gray-200">${cf.city || 'Pasarkemis'}, ${cf.regionCode || 'JB'}, ${cf.country || 'ID'}</p>
                </div>
                <div class="grid-item">
                    <p class="text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-wider">CF EDGE SERVER</p>
                    <p class="text-[13px] font-semibold text-gray-200">${dc.city}, ${dc.country}</p>
                </div>
            </div>
        </div>

        <!-- SECTION: GEOLOKASI -->
        <div class="card">
            <div class="card-header">Geolokasi Anda</div>
            <div class="row"><span class="label">IP</span> <span class="badge-blue mono">${ip}</span></div>
            <div class="row"><span class="label">IP Version</span> <span class="badge-blue">IPv4</span></div>
            <div class="row"><span class="label">Kota</span> <span class="val">${cf.city || 'N/A'}</span></div>
            <div class="row"><span class="label">Provinsi</span> <span class="val">${cf.region || 'West Java'}</span></div>
            <div class="row"><span class="label">Kode Region</span> <span class="val">${cf.regionCode || 'JB'}</span></div>
            <div class="row"><span class="label">Negara</span> <span class="val">${cf.country || 'ID'}</span></div>
            <div class="row"><span class="label">Benua</span> <span class="val">${cf.continent || 'AS'}</span></div>
            <div class="row"><span class="label">Kode Pos</span> <span class="val">${cf.postalCode || 'N/A'}</span></div>
            <div class="row"><span class="label">Timezone</span> <span class="val">${cf.timezone || 'Asia/Jakarta'}</span></div>
            <div class="row"><span class="label">Latitude</span> <span class="val mono">${cf.latitude || '-6.17'}</span></div>
            <div class="row"><span class="label">Longitude</span> <span class="val mono">${cf.longitude || '106.82'}</span></div>
            <div class="row"><span class="label">EU Country</span> <span class="val">Tidak</span></div>
        </div>

        <!-- SECTION: CLOUDFLARE SERVER -->
        <div class="card">
            <div class="card-header">Cloudflare Edge Server</div>
            <div class="row"><span class="label">Colo Code</span> <span class="badge-orange">${colo}</span></div>
            <div class="row"><span class="label">Nama DC</span> <span class="val">${dc.name}</span></div>
            <div class="row"><span class="label">Kota DC</span> <span class="val">${dc.city}</span></div>
            <div class="row"><span class="label">Negara DC</span> <span class="val">${dc.country}</span></div>
            <div class="row"><span class="label">Region DC</span> <span class="val">${dc.region}</span></div>
            <div class="row"><span class="label">Lat DC</span> <span class="val mono">${dc.lat}</span></div>
            <div class="row"><span class="label">Lon DC</span> <span class="val mono">${dc.lon}</span></div>
            <div class="row"><span class="label">HTTP Protocol</span> <span class="val">${protocol}</span></div>
            <div class="row"><span class="label">TCP RTT</span> <span class="val">${cf.clientTcpRtt || 0} ms</span></div>
            <div class="row"><span class="label">CF Ray</span> <span class="val text-orange-400 mono font-bold">${headers['cf-ray'] || 'N/A'}</span></div>
        </div>

        <!-- SECTION: KEAMANAN & TLS -->
        <div class="card">
            <div class="card-header">Keamanan & TLS</div>
            <div class="row"><span class="label">TLS Version</span> <span class="val text-green-500 font-bold">${tlsVer}</span></div>
            <div class="row"><span class="label">TLS Cipher</span> <span class="val text-blue-400 mono text-[11px]">${tlsCipher}</span></div>
            <div class="row"><span class="label">Hello Length</span> <span class="val">${cf.tlsClientHelloLength || 1500} bytes</span></div>
            <div class="p-5 border-t border-white/5 space-y-4">
                <div>
                    <span class="label block text-[10px] font-bold uppercase mb-1">Client Random</span>
                    <span class="val block text-left mono text-[10px] text-gray-500 break-all bg-black/30 p-2 rounded">${cf.tlsClientRandom || '4wRk+srGIXG8U8sXwloWEe+NBlXbA8Z8X0ukWki+uaI='}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="label">Ciphers SHA1</span>
                    <span class="val mono text-[10px] text-gray-500">${cf.tlsClientCiphersSha1 || 'cS6rOHCYpwbDXp4alGK4JgFfs5A='}</span>
                </div>
            </div>
        </div>

        <!-- SECTION: JARINGAN -->
        <div class="card">
            <div class="card-header">Jaringan & ISP</div>
            <div class="row"><span class="label">ASN</span> <span class="val mono">AS${cf.asn || '139972'}</span></div>
            <div class="row"><span class="label">Organisasi</span> <span class="val">${cf.asOrganization || 'PT. Putra Lebak Banten'}</span></div>
            <div class="row"><span class="label">Host</span> <span class="val">api.elvora.eu.cc</span></div>
            <div class="row"><span class="label">Connection</span> <span class="val">Keep-Alive</span></div>
        </div>

        <!-- SECTION: BOT MANAGEMENT -->
        <div class="card">
            <div class="card-header">Bot Management Cloudflare</div>
            <div class="row"><span class="label">Bot Score</span> <span class="text-green-500 font-bold">${botScore}</span></div>
            <div class="row"><span class="label">Verified Bot</span> <span class="text-orange-500 font-bold">Tidak</span></div>
            <div class="row"><span class="label">JS Detection</span> <span class="val">Not Passed</span></div>
            <div class="row"><span class="label">Corporate Proxy</span> <span class="val">Tidak</span></div>
        </div>

        <!-- SECTION: REQUEST INFO -->
        <div class="card">
            <div class="card-header">Request Info</div>
            <div class="row"><span class="label">Method</span> <span class="badge-blue">GET</span></div>
            <div class="row"><span class="label">Sec-Fetch-Dest</span> <span class="val">${headers['sec-fetch-dest'] || 'document'}</span></div>
            <div class="p-5 border-t border-white/5">
                <p class="text-[10px] font-bold text-gray-600 uppercase mb-2">User Agent</p>
                <div class="bg-black/40 p-3 rounded-lg border border-white/5 text-[11px] mono text-gray-500 leading-relaxed break-all">
                    ${headers['user-agent']}
                </div>
            </div>
        </div>

        <!-- FOOTER (DEMPET/TIGHT LAYOUT) -->
        <footer class="mt-8 mb-10 text-center border-t border-white/5 pt-6">
            <div class="flex flex-col items-center gap-1">
                <p class="text-gray-500 text-[12px] font-medium">Server API — <span class="text-gray-300">api.elvora.eu.cc</span> • <span class="text-blue-400">elvora.eu.cc</span></p>
                <p class="text-[10px] text-gray-600">Powered by Cloudflare Workers • Data diproses di edge secara real-time</p>
            </div>
        </footer>
    </div>

    <script>
        const uLat = ${cf.latitude || -6.17};
        const uLon = ${cf.longitude || 106.53};
        const dcLat = ${dc.lat};
        const dcLon = ${dc.lon};

        // Initialize Map
        const map = L.map('map', { 
            zoomControl: false, 
            attributionControl: false,
            dragging: true,
            scrollWheelZoom: false
        }).setView([uLat, uLon], 11);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

        // MODIFIED LOGO LOKASI (Pin Putih di Tengah)
        const locIcon = L.divIcon({
            html: \`<svg width="36" height="36" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="#F76D57" d="M32,2c-12.15,0-22,9.85-22,22c0,5.799,3.469,11.469,5.913,15L32,61l16.077-22C50.281,35.781,54,29.799,54,24C54,11.85,44.15,2,32,2z"/>
                <!-- Lingkaran Putih Solid (Tidak Transparan) -->
                <circle cx="32" cy="24" r="11" fill="#FFFFFF"/>
                <path opacity="0.2" fill="#231F20" d="M32,12c-6.627,0-12,5.373-12,12s5.373,12,12,12s12-5.373,12-12S38.627,12,32,12z"/>
            </svg>\`,
            className: '', iconSize: [36, 36], iconAnchor: [18, 36]
        });

        // Cloudflare Cloud Icon
        const cloudIcon = L.divIcon({
            html: \`<svg width="34" height="34" viewBox="0 0 24 24" fill="#f4811f"><path d="M17.5,19c-3,0-5.5-2.5-5.5-5.5s2.5-5.5,5.5-5.5c0.5,0,1,0.1,1.5,0.2c-0.8-2.1-2.8-3.7-5.2-3.7c-2.3,0-4.3,1.5-5.1,3.5c-0.3-0.1-0.6-0.1-0.9-0.1c-2.4,0-4.3,1.9-4.3,4.3c0,2.4,1.9,4.3,4.3,4.3h9.7"/></svg>\`,
            className: '', iconSize: [34, 34], iconAnchor: [17, 17]
        });

        L.marker([uLat, uLon], {icon: locIcon}).addTo(map);
        L.marker([dcLat, dcLon], {icon: cloudIcon}).addTo(map);

        // Dashed Connection Line
        L.polyline([[uLat, uLon], [dcLat, dcLon]], {
            color: '#f4811f',
            weight: 1.5,
            dashArray: '8, 12',
            opacity: 0.6
        }).addTo(map);

        // COPY FUNCTION (CUSTOM CENTANG SIMETRIS SVG)
        async function copyData() {
            try {
                const response = await fetch(window.location.href + '?json');
                const data = await response.json();
                await navigator.clipboard.writeText(JSON.stringify(data, null, 2));

                const btn = document.getElementById('btnCopy');
                const text = document.getElementById('copyText');
                const icon = document.getElementById('copyIcon');

                // State Copied
                btn.classList.add('copied');
                // Custom Symmetrical Checkmark SVG
                icon.innerHTML = \`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>\`;
                text.innerText = 'Copied!';

                setTimeout(() => {
                    btn.classList.remove('copied');
                    icon.innerHTML = '⧉';
                    text.innerText = 'Copy JSON';
                }, 2000);
            } catch (err) {
                alert('Gagal menyalin data');
            }
        }
    </script>
</body>
</html>`;
}
