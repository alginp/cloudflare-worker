// controllers/gopayController.js
const API_BASE = 'https://api.alwayscodex.my.id/api/payment';

// Helper function untuk fetch ke API Codex
async function fetchCodex(endpoint, params = {}, returnImage = false) {
  const url = new URL(`${API_BASE}${endpoint}`);
  Object.keys(params).forEach(key => {
    if (params[key]) url.searchParams.append(key, params[key]);
  });
  
  // Gunakan AbortController untuk timeout (25 detik)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Cloudflare-Worker/1.0'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Jika request meminta gambar (Create QRIS)
    if (returnImage) {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('image/png') || contentType.includes('image/')) {
        const buffer = await response.arrayBuffer();
        return { type: 'image', data: buffer, status: response.status };
      }
    }

    // Default JSON response
    const json = await response.json();
    return { type: 'json', data: json, status: response.status };

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request ke API Codex timeout (terlalu lama > 25 detik)');
    }
    throw error;
  }
}

// 1. Buat QRIS GoPay (MENGHASILKAN GAMBAR BINARY)
export async function createQris(request) {
  try {
    const url = new URL(request.url);
    const amount = url.searchParams.get('amount');
    const staticQr = url.searchParams.get('static_qr') || '';
    const token = url.searchParams.get('token');
    
    if (!amount || !token) {
      return new Response(JSON.stringify({
        status: false,
        error: 'Parameter amount dan token wajib diisi'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const result = await fetchCodex('/gopay-create-qris', {
      amount,
      static_qr: staticQr,
      token
    }, true); // true = returnImage
    
    if (result.type === 'image') {
      return new Response(result.data, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Jika Codex mengembalikan JSON error
    return new Response(JSON.stringify(result.data, null, 2), {
      status: result.status,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      status: false,
      error: error.message
    }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 2. Riwayat Transaksi
export async function history(request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    if (!token) {
      return new Response(JSON.stringify({ status: false, error: 'Parameter token wajib diisi' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }
    const result = await fetchCodex('/gopay-history', { token });
    return new Response(JSON.stringify(result.data, null, 2), {
      status: result.status, headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: false, error: error.message }), {
      status: 502, headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 3. Request OTP
export async function requestOtp(request) {
  try {
    const url = new URL(request.url);
    const number = url.searchParams.get('number');
    if (!number) {
      return new Response(JSON.stringify({ status: false, error: 'Parameter number wajib diisi' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }
    const result = await fetchCodex('/gopay-otp', { number });
    return new Response(JSON.stringify(result.data, null, 2), {
      status: result.status, headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: false, error: error.message }), {
      status: 502, headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 4. Riwayat Payout
export async function payouts(request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    if (!token) {
      return new Response(JSON.stringify({ status: false, error: 'Parameter token wajib diisi' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }
    const result = await fetchCodex('/gopay-payouts', { token });
    return new Response(JSON.stringify(result.data, null, 2), {
      status: result.status, headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: false, error: error.message }), {
      status: 502, headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 5. Cek Status QRIS
export async function qrisStatus(request) {
  try {
    const url = new URL(request.url);
    const amount = url.searchParams.get('amount');
    const createdAt = url.searchParams.get('created_at');
    const token = url.searchParams.get('token');
    if (!amount || !createdAt || !token) {
      return new Response(JSON.stringify({ status: false, error: 'Parameter amount, created_at, dan token wajib diisi' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }
    const result = await fetchCodex('/gopay-qris-status', { amount, created_at: createdAt, token });
    return new Response(JSON.stringify(result.data, null, 2), {
      status: result.status, headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: false, error: error.message }), {
      status: 502, headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 6. Refresh Token
export async function refreshToken(request) {
  try {
    const url = new URL(request.url);
    const refreshToken = url.searchParams.get('refresh_token');
    if (!refreshToken) {
      return new Response(JSON.stringify({ status: false, error: 'Parameter refresh_token wajib diisi' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }
    const result = await fetchCodex('/gopay-refresh', { refresh_token: refreshToken });
    return new Response(JSON.stringify(result.data, null, 2), {
      status: result.status, headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: false, error: error.message }), {
      status: 502, headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 7. Verifikasi OTP
export async function verifyOtp(request) {
  try {
    const url = new URL(request.url);
    const otp = url.searchParams.get('otp');
    const otpToken = url.searchParams.get('otp_token');
    if (!otp || !otpToken) {
      return new Response(JSON.stringify({ status: false, error: 'Parameter otp dan otp_token wajib diisi' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }
    const result = await fetchCodex('/gopay-verify', { otp, otp_token: otpToken });
    return new Response(JSON.stringify(result.data, null, 2), {
      status: result.status, headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: false, error: error.message }), {
      status: 502, headers: { 'Content-Type': 'application/json' }
    });
  }
        }
