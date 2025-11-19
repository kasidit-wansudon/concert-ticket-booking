'use client';

import React, { useEffect, useState } from 'react';
import { Concert } from '@/lib/types';
import { concertApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const router = useRouter();
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    concert: Concert | null;
  }>({ show: false, concert: null });

  useEffect(() => {
    fetchConcerts();
  }, []);

  const fetchConcerts = async () => {
    try {
      const data = await concertApi.getAll();
      setConcerts(data);
    } catch (error) {
      toast.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.concert) return;

    try {
      await concertApi.delete(deleteModal.concert.id);
      toast.success('ลบคอนเสิร์ตสำเร็จ!');
      setDeleteModal({ show: false, concert: null });
      fetchConcerts();
    } catch (error) {
      toast.error('ไม่สามารถลบได้');
    }
  };

  const totalSeats = concerts.reduce((sum, c) => sum + c.totalSeats, 0);
  const bookedSeats = concerts.reduce(
    (sum, c) => sum + (c.totalSeats - c.availableSeats),
    0
  );
  const availableSeats = concerts.reduce((sum, c) => sum + c.availableSeats, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
            <div className="flex gap-2">
              <a
                href="/"
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm hover:bg-gray-300"
              >
                User
              </a>
              <a
                href="/admin/history"
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm hover:bg-gray-300"
              >
                History
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-500 text-white rounded-lg p-6 text-center shadow-md">
            <div className="text-sm opacity-90 mb-1">Total Seat</div>
            <div className="text-4xl font-bold">{totalSeats}</div>
          </div>
          <div className="bg-teal-500 text-white rounded-lg p-6 text-center shadow-md">
            <div className="text-sm opacity-90 mb-1">Booked</div>
            <div className="text-4xl font-bold">{bookedSeats}</div>
          </div>
          <div className="bg-red-400 text-white rounded-lg p-6 text-center shadow-md">
            <div className="text-sm opacity-90 mb-1">Available</div>
            <div className="text-4xl font-bold">{availableSeats}</div>
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={() => router.push('/admin/create')}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            + สร้างคอนเสิร์ตใหม่
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concerts.map((concert) => (
            <div key={concert.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-2">{concert.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{concert.description}</p>
              <div className="text-sm text-gray-500 mb-4">
                ที่นั่ง: {concert.availableSeats} / {concert.totalSeats}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/admin/edit/${concert.id}`)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => setDeleteModal({ show: true, concert })}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  ลบ
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {deleteModal.show && deleteModal.concert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setDeleteModal({ show: false, concert: null })}
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">ยืนยันการลบ</h3>
              <p className="text-gray-600 mb-6">
                คุณต้องการลบคอนเสิร์ต <span className="font-semibold">{deleteModal.concert.name}</span> หรือไม่?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ show: false, concert: null })}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
