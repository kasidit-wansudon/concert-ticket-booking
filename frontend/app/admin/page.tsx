'use client';

'use client';

import React, { useEffect, useState } from 'react';
import { Concert } from '@/lib/types';
import { concertApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import AdminLayout from '@/components/AdminLayout';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'create'>('overview');
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    concert: Concert | null;
  }>({ show: false, concert: null });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    totalSeats: '',
  });

  useEffect(() => {
    fetchConcerts();
  }, []);

  const fetchConcerts = async () => {
    try {
      const data = await concertApi.getAll();
      setConcerts(data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.concert) return;

    try {
      await concertApi.delete(deleteModal.concert.id);
      toast.success('Delete concert success!');
      setDeleteModal({ show: false, concert: null });
      fetchConcerts();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.totalSeats) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setCreateLoading(true);
      await concertApi.create({
        name: formData.name,
        description: formData.description,
        totalSeats: parseInt(formData.totalSeats),
      });
      toast.success('Create concert success!');
      // Reset form and switch to overview
      setFormData({ name: '', description: '', totalSeats: '' });
      setActiveTab('overview');
      fetchConcerts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setCreateLoading(false);
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
    <AdminLayout title="Admin">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0070f3] text-white rounded-lg p-6 text-center shadow-sm">
          <div className="flex justify-center mb-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="text-sm opacity-90 mb-1">Total of seats</div>
          <div className="text-4xl font-bold">{totalSeats}</div>
        </div>
        <div className="bg-[#00a389] text-white rounded-lg p-6 text-center shadow-sm">
          <div className="flex justify-center mb-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <div className="text-sm opacity-90 mb-1">Reserve</div>
          <div className="text-4xl font-bold">{bookedSeats}</div>
        </div>
        <div className="bg-[#e54d4d] text-white rounded-lg p-6 text-center shadow-sm">
          <div className="flex justify-center mb-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-sm opacity-90 mb-1">Cancel</div>
          <div className="text-4xl font-bold">{availableSeats}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'overview'
            ? 'text-[#2196f3] border-[#2196f3]'
            : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'create'
            ? 'text-[#2196f3] border-[#2196f3]'
            : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
        >
          Create
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' ? (
        <div className="flex flex-col gap-6">
          {concerts.map((concert) => (
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
                  {concert.totalSeats}
                </div>
                <button
                  onClick={() => setDeleteModal({ show: true, concert })}
                  className="bg-[#ef5350] text-white px-4 py-2 rounded hover:bg-red-600 flex items-center transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#2196f3] mb-6">Create</h2>
          <form onSubmit={handleCreate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-900 font-medium mb-2">
                  Concert Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Please input concert name"
                />
              </div>
              <div>
                <label className="block text-gray-900 font-medium mb-2">
                  Total of seat
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.totalSeats}
                    onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="500"
                    min="1"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-gray-900 font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Please input description"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={createLoading}
                className="bg-[#2196f3] text-white px-6 py-2 rounded hover:bg-blue-600 flex items-center transition-colors disabled:opacity-50"
              >
                <img src="icons/save.svg" alt="Add" className="w-5 h-5 mr-2" />
                {createLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteModal.show && deleteModal.concert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setDeleteModal({ show: false, concert: null })}
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
            <div className="w-12 h-12 bg-[#ef5350] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Are you sure to delete?</h3>
            <p className="text-gray-600 mb-8">
              "<span className="font-bold text-gray-900">{deleteModal.concert.name}</span>"
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteModal({ show: false, concert: null })}
                className="min-w-[100px] bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="min-w-[100px] bg-[#ef5350] text-white px-4 py-2 rounded hover:bg-red-600 transition-colors font-medium flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
