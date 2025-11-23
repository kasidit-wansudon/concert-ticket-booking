'use client';

import React, { useEffect, useState } from 'react';
import { Reservation } from '@/lib/types';
import { reservationApi } from '@/lib/api';
import toast from 'react-hot-toast';
import UserLayout from '@/components/UserLayout';

export default function UserHistoryPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [canceling, setCanceling] = useState<string | null>(null);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const data = await reservationApi.getMyReservations();
            setReservations(data);
        } catch (error) {
            toast.error('Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (reservationId: string) => {
        try {
            setCanceling(reservationId);
            await reservationApi.cancel(reservationId);
            toast.success('Cancel success!');
            fetchReservations();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to cancel');
        } finally {
            setCanceling(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <UserLayout title="History">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Concert name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reservations.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No booking history
                                    </td>
                                </tr>
                            ) : (
                                reservations.map((reservation) => (
                                    <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(reservation.createdAt).toLocaleString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {reservation.user?.name || 'Unknown User'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {reservation.concert?.name || 'Unknown Concert'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {reservation.status === 'active' ? (
                                                <button
                                                    onClick={() => handleCancel(reservation.id)}
                                                    disabled={canceling === reservation.id}
                                                    className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
                                                >
                                                    {canceling === reservation.id ? 'Processing...' : 'Cancel'}
                                                </button>
                                            ) : (
                                                <span className="text-gray-400">Cancelled</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </UserLayout>
    );
}
