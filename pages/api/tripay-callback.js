// pages/api/tripay-callback.js

import { supabase } from '../../../lib/supabase'// ganti sesuai lokasi file kamu
import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const callbackSignature = req.headers['x-callback-signature']
  const body = JSON.stringify(req.body)

  // Verifikasi signature dari Tripay
  const expectedSignature = crypto
    .createHmac('sha256', process.env.NEXT_PUBLIC_TRIPAY_PRIVATE_KEY)
    .update(body)
    .digest('hex')

  if (callbackSignature !== expectedSignature) {
    return res.status(403).json({ message: 'Invalid signature' })
  }

  const { reference, status } = req.body

  if (!reference || !status) {
    return res.status(400).json({ message: 'Missing data' })
  }

  // Update status transaksi di Supabase
  const { error } = await supabase
    .from('transaction')
    .update({ status })
    .eq('id', reference)

  if (error) {
    console.error('Supabase update error:', error)
    return res.status(500).json({ message: 'Failed to update transaction' })
  }

  return res.status(200).json({ message: 'Success' })
}
