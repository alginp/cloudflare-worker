// controllers/gopayController.js
const API_BASE = 'https://api.alwayscodex.my.id/api/payment';

// Helper function untuk fetch ke API Codex
async function fetchCodex(endpoint, params = {}) {
  const url = new URL(`${API_BASE}${endpoint}`);
  Object.keys(params).forEach(key => {
    if (params[key]) url.searchParams.append(key, params[key]);
  });
  
  const response = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Cloudflare-Worker/1.0'
    }
  });
  
  return response.json();
}

// 1. Buat QRIS GoPay
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
    
    const data = await fetchCodex('/gopay-create-qris', {
      amount,
      static_qr: staticQr,
      token
    });
    
    return new Response(JSON.stringify(data, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: false,
      error: error.message
    }), {
      status: 500,
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
      return new Response(JSON.stringify({
        status: false,
        error: 'Parameter token wajib diisi'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = await fetchCodex('/gopay-history', { token });
    return new Response(JSON.stringify(data, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 3. Request OTP
export async function requestOtp(request) {
  try {
    const url = new URL(request.url);
    const number = url.searchParams.get('number');
    
    if (!number) {
      return new Response(JSON.stringify({
        status: false,
        error: 'Parameter number wajib diisi'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = await fetchCodex('/gopay-otp', { number });
    return new Response(JSON.stringify(data, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 4. Riwayat Payout
export async function payouts(request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    
    if (!token) {
      return new Response(JSON.stringify({
        status: false,
        error: 'Parameter token wajib diisi'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = await fetchCodex('/gopay-payouts', { token });
    return new Response(JSON.stringify(data, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
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
      return new Response(JSON.stringify({
        status: false,
        error: 'Parameter amount, created_at, dan token wajib diisi'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = await fetchCodex('/gopay-qris-status', {
      amount,
      created_at: createdAt,
      token
    });
    
    return new Response(JSON.stringify(data, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 6. Refresh Token
export async function refreshToken(request) {
  try {
    const url = new URL(request.url);
    const refreshToken = url.searchParams.get('refresh_token');
    
    if (!refreshToken) {
      return new Response(JSON.stringify({
        status: false,
        error: 'Parameter refresh_token wajib diisi'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = await fetchCodex('/gopay-refresh', { refresh_token: refreshToken });
    return new Response(JSON.stringify(data, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
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
      return new Response(JSON.stringify({
        status: false,
        error: 'Parameter otp dan otp_token wajib diisi'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = await fetchCodex('/gopay-verify', {
      otp,
      otp_token: otpToken
    });
    
    return new Response(JSON.stringify(data, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
