'use client';

import React, { useEffect, useState } from 'react';
import { Concert, Reservation } from '@/lib/types';
import { concertApi, reservationApi } from '@/lib/api';
import toast from 'react-hot-toast';
import UserLayout from '@/components/UserLayout';

export default function UserPage() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [myReservations, setMyReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState<string | null>(null);

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
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async (concertId: string) => {
    try {
      setReserving(concertId);
      await reservationApi.create(concertId);
      toast.success('Reservation success!');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reserve');
    } finally {
      setReserving(null);
    }
  };

  const handleCancel = async (reservationId: string) => {
    try {
      setReserving(reservationId);
      await reservationApi.cancel(reservationId);
      toast.success('Cancel success!');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel');
    } finally {
      setReserving(null);
    }
  };

  const getReservation = (concertId: string) => {
    return myReservations.find(
      r => r.concertId === concertId && r.status === 'active'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <UserLayout title="User">
      <div className="flex flex-col gap-6">
        {concerts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No concerts available</p>
          </div>
        ) : (
          concerts.map((concert) => {
            const isOutOfSeats = concert.availableSeats === 0;
            const reservation = getReservation(concert.id);

            return (
              <div key={concert.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[#2196f3] mb-4">{concert.name}</h3>
                <hr className="border-gray-100 mb-4" />
                <p className="text-gray-800 mb-6 leading-relaxed">
                  {concert.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-900 text-lg">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {concert.availableSeats.toLocaleString()}
                  </div>

                  {reservation ? (
                    <button
                      onClick={() => handleCancel(reservation.id)}
                      disabled={reserving === reservation.id}
                      className="bg-[#ef5350] text-white px-6 py-2 rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {reserving === reservation.id ? 'Processing...' : 'Cancel'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReserve(concert.id)}
                      disabled={isOutOfSeats || reserving === concert.id}
                      className={`px-6 py-2 rounded text-white font-medium transition-colors ${isOutOfSeats
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[#2196f3] hover:bg-blue-600'
                        }`}
                    >
                      {reserving === concert.id ? 'Processing...' : isOutOfSeats ? 'Sold Out' : 'Reserve'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </UserLayout>
  );
}
