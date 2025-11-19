'use client';

import React, { useEffect, useState } from 'react';
import { Concert, Reservation } from '@/lib/types';
import { concertApi, reservationApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function UserPage() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [myReservations, setMyReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [concertsData, reservationsData] = await Promise.all([
        concertApi.getAll(),
        reservationApi.getMyReservations().catch(() => []),
      ]);
      setConcerts(concertsData);
      setMyReservations(reservationsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async (concertId: string) => {
    try {
      await reservationApi.create(concertId);
      toast.success('จองตั๋วสำเร็จ!');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'ไม่สามารถจองได้');
    }
  };

  const handleCancel = async (concertId: string) => {
    const reservation = myReservations.find(
      r => r.concertId === concertId && r.status === 'active'
    );
    if (!reservation) return;

    try {
      await reservationApi.cancel(reservation.id);
      toast.success('ยกเลิกการจองสำเร็จ!');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'ไม่สามารถยกเลิกได้');
    }
  };

  const hasReservation = (concertId: string) => {
    return myReservations.some(
      r => r.concertId === concertId && r.status === 'active'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Concert</h1>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                User
              </span>
              <a
                href="/admin"
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm hover:bg-gray-300"
              >
                Admin
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {concerts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">ยังไม่มีคอนเสิร์ต</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {concerts.map((concert) => {
              const isOutOfSeats = concert.availableSeats === 0;
              const userHasReservation = hasReservation(concert.id);

              return (
                <div
                  key={concert.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold text-blue-600 mb-2">
                    {concert.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {concert.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">
                      <span className="font-semibold">ที่นั่ง:</span>{' '}
                      <span
                        className={
                          isOutOfSeats
                            ? 'text-red-500 font-bold'
                            : 'text-green-600'
                        }
                      >
                        {concert.availableSeats} / {concert.totalSeats}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {userHasReservation ? (
                      <button
                        onClick={() => handleCancel(concert.id)}
                        className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                      >
                        ยกเลิกการจอง
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReserve(concert.id)}
                        disabled={isOutOfSeats}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isOutOfSeats ? 'หมด' : 'จอง'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
