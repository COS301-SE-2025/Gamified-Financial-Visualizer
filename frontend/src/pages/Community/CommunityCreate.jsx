// src/pages/Community/CommunityCreate.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';
import { FaPlusCircle, FaUsers, FaTag, FaAward, FaArrowLeft } from 'react-icons/fa';

const CommunityCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tag: '',
    goalCount: 0,
    memberCount: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Community created!');
  };

  return (
    <CommunityLayout>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4">
        <CommunityHeader />

        <div className="bg-white p-6 rounded-3xl shadow-md">
          <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-2">
            <FaPlusCircle className="text-[#88BC46]" /> Create New Community
            {/* Back Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 bg-[#E5E7EB] text-[#374151] px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#D1D5DB] transition"
              >
                <FaArrowLeft /> Back
              </button>
            </div>

          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Community Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#88BC46]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#88BC46]"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FaTag /> Tag
                </label>
                <input
                  type="text"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FaUsers /> Members
                </label>
                <input
                  type="number"
                  name="memberCount"
                  value={formData.memberCount}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaAward /> Number of Goals
              </label>
              <input
                type="number"
                name="goalCount"
                value={formData.goalCount}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="bg-[#AAD977] hover:bg-[#83AB55] text-white px-6 py-2 rounded-full font-semibold shadow-md"
              >
                Create Community
              </button>
            </div>
          </form>
        </div>
      </div>
    </CommunityLayout>
  );
};

export default CommunityCreate;
