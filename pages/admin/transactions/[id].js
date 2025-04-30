// pages/admin/transactions/[id].js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

const TransactionDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchTransaction = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        alert('Akses hanya untuk admin')
        return router.push('/')
      }

      const { data, error } = await supabase
        .from('transaction')
        .select('*, profiles(full_name, address, phone)')
        .eq('id', id)
        .single()

      if (!error) setTransaction(data)
      setLoading(false)
    }

    fetchTransaction()
  }, [id])

  if (loading) return <div className="p-6">Memuat data...</div>
  if (!transaction) return <div className="p-6">Transaksi tidak ditemukan.</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => router.push('/admin/transactions')}
        className="mb-4 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
      >
        ← Kembali
      </button>

      <h1 className="text-2xl font-bold mb-4">Detail Transaksi</h1>

      <div className="bg-white shadow rounded p-6 space-y-4 border">
        <div>
          <h2 className="font-semibold text-gray-600">Nama Pengguna:</h2>
          <p className="text-gray-800">{transaction.profiles?.full_name}</p>
        </div>
        <div>
          <h2 className="font-semibold text-gray-600">Alamat:</h2>
          <p className="text-gray-800">{transaction.profiles?.address || '-'}</p>
        </div>
        <div>
          <h2 className="font-semibold text-gray-600">Nomor HP:</h2>
          <p className="text-gray-800">{transaction.profiles?.phone || '-'}</p>
        </div>
        <div>
          <h2 className="font-semibold text-gray-600">Total Harga:</h2>
          <p className="text-orange-600 font-bold text-lg">Rp {Number(transaction.total_price).toLocaleString()}</p>
        </div>
        <div>
          <h2 className="font-semibold text-gray-600">Status:</h2>
          <p className="capitalize text-blue-600">{transaction.status}</p>
        </div>
        <div>
          <h2 className="font-semibold text-gray-600">Tanggal Transaksi:</h2>
          <p>{new Date(transaction.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}

export default TransactionDetail
