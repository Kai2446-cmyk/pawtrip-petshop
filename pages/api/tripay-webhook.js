// pages/api/tripay-webhook.js
import { buffer } from 'micro';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const rawBody = (await buffer(req)).toString();
  const signature = req.headers['x-callback-signature'];

  const crypto = await import('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', process.env.TRIPAY_PRIVATE_KEY)
    .update(rawBody)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(403).json({ message: 'Invalid signature' });
  }

  const payload = JSON.parse(rawBody);
  const { reference, status } = payload;

  // Update status transaksi berdasarkan reference
  const { error } = await supabase
    .from('transactions')
    .update({ status })
    .eq('reference', reference);

  if (error) {
    console.error('Error updating transaction status:', error);
    return res.status(500).json({ message: 'Failed to update status' });
  }

  return res.status(200).json({ message: 'OK' });
}
