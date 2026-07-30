// routers/gopayRouter.js
import {
  createQris,
  history,
  requestOtp,
  payouts,
  qrisStatus,
  refreshToken,
  verifyOtp
} from '../controllers/gopayController.js';

export default function gopayRouter(router) {
  // Buat QRIS
  router.get('/api/payment/gopay-create-qris', createQris);
  
  // Riwayat transaksi
  router.get('/api/payment/gopay-history', history);
  
  // Request OTP
  router.get('/api/payment/gopay-otp', requestOtp);
  
  // Riwayat payout
  router.get('/api/payment/gopay-payouts', payouts);
  
  // Cek status QRIS
  router.get('/api/payment/gopay-qris-status', qrisStatus);
  
  // Refresh token
  router.get('/api/payment/gopay-refresh', refreshToken);
  
  // Verifikasi OTP
  router.get('/api/payment/gopay-verify', verifyOtp);
  
  return router;
}
