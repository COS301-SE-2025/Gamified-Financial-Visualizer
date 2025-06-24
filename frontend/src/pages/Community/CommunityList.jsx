// src/pages/Community/CommunityList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FaEye, FaSearch } from 'react-icons/fa';
import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';

// Image imports
import happySavers from '../../assets/Images/banners/pixelApartment.gif';
import coupons from '../../assets/Images/banners/pixelGirlAlly.gif';
import money from '../../assets/Images/banners/pixelStudents.jpeg';
import heist from '../../assets/Images/banners/pixelStore.gif';

import cindy from '../../assets/Images/avatars/beachAvatar.jpeg';
import snow from '../../assets/Images/avatars/catAvatar.jpeg';
import shark from '../../assets/Images/avatars/crossiontAvatar.jpeg';
import andy from '../../assets/Images/avatars/butterflyAvatar.jpeg';
import queen from '../../assets/Images/avatars/cottageAvatar.jpeg';
import miss from '../../assets/Images/avatars/shoreAvatar.jpeg';
import bitcoiner from '../../assets/Images/avatars/windowAvatar.jpeg';
import james from '../../assets/Images/avatars/ghostAvatar.jpeg';
import fiat from '../../assets/Images/avatars/totoroAvatar.jpeg';
import zanele from '../../assets/Images/avatars/stonesAvatar.jpeg';

const communities = [
    {
        name: 'Happy Savers',
        members: 8,
        goals: 9,
        xp: 4504,
        image: happySavers,
        avatars: [cindy, snow, shark],
    },
    {
        name: 'Coupon Crew',
        members: 8,
        goals: 9,
        xp: 3467,
        image: coupons,
        avatars: [andy, queen, miss],
    },
    {
        name: 'Money Maniacs',
        members: 8,
        goals: 9,
        xp: 3467,
        image: money,
        avatars: [bitcoiner, james],
    },
    {
        name: 'Heist Club',
        members: 8,
        goals: 9,
        xp: 3467,
        image: heist,
        avatars: [fiat, zanele],
    },
];

const handleDelete = (itemName) => {
  toast.custom((t) => (
    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-lg max-w-sm w-full space-y-3">
      <p className="text-sm font-semibold text-gray-800">
        Delete <span className="text-[#ED5E52]">"{itemName}"</span> community?
      </p>
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => {
            toast.dismiss(t.id);
            toast.success(`Deleted "${itemName}"`);
            // TODO: Actual deletion logic here
            console.log(`Deleted ${itemName}`);
          }}
          className="bg-[#ED5E52] hover:bg-[#FE9B90] text-white px-4 py-1.5 text-sm rounded-full font-medium"
        >
          Confirm
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-1.5 text-sm rounded-full font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  ), { duration: 10000, position: 'top-center' });
};

const CommunityList = () => {
    return (
        <CommunityLayout>
              <Toaster position="top-right" />
            <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4">
                <CommunityHeader />
                <div className="flex justify-end mb-4">
                    <Link to="/community/create">
                        <button className="flex items-center gap-2 bg-gradient-to-r from-[#AAD977] to-[#83AB55] text-white px-4 py-2 rounded-full text-sm font-medium shadow hover:shadow-md transition">
                            <FaEye /> Create Community
                        </button>
                    </Link>
                </div>

                <div className="flex items-center w-full max-w-6xl -ml-[8px] px-4 py-2 rounded-3xl border-2 border-[#E5794B] bg-white shadow-sm">
                          <FaSearch className="text-[#E5794B] mr-2" />
                          <input
                            type="text"
                            placeholder="Search your communities..."
                            className="w-full outline-none bg-transparent text-sm text-[#E5794B] placeholder-[#E5794B]/70"
                          />
                        </div>

                {communities.map((community, i) => (
                    <div
                        key={i}
                        className="flex justify-between items-center bg-white shadow-md rounded-2xl px-4 py-4"
                    >
                        {/* Left side */}
                        <div className="flex items-center gap-4">
                            <img
                                src={community.image}
                                alt={community.name}
                                className="w-16 h-16 rounded-full object-cover shadow"
                            />
                            <div>
                                <p className="text-lg font-medium text-gray-800">{community.name}</p>
                                <div className="flex gap-2 mt-1">
                                    <span className="bg-[#E0F2FE] text-[#72C1F5] text-xs font-medium px-3 py-1 rounded-full">
                                        {community.members} Members
                                    </span>
                                    <span className="bg-[#E0F2FE] text-[#72C1F5] text-xs font-medium px-3 py-1 rounded-full">
                                        {community.goals} Goals
                                    </span>
                                    <span className="bg-[#FEF9C3] text-[#FBBF24] text-xs font-medium px-3 py-1 rounded-full">
                                        {community.xp} XP
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                                {community.avatars.map((src, index) => (
                                    <img
                                        key={index}
                                        src={src}
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full border-2 border-white"
                                    />
                                ))}
                            </div>


                            <div className="w-full flex flex-wrap items-center justify-end gap-2">
                                <Link to={`/community/details/${community.name.toLowerCase().replace(/\s+/g, '_')}`}>
                                    <button className="bg-[#AAD977] text-white text-sm px-4 py-2 rounded-full font-semibold hover:bg-[#83AB55] transition whitespace-nowrap">
                                        <FaEye className="inline-block mr-1" /> View
                                    </button>
                                </Link>

                                <button
                                    onClick={() => handleDelete(community.name)}
                                    className="bg-[#FE9B90] text-white text-sm px-4 py-2 rounded-full font-semibold hover:bg-[#ED5E52] transition whitespace-nowrap"
                                >
                                    Delete
                                </button>
                            </div>


                        </div>
                    </div>
                ))}
            </div>
        </CommunityLayout>
    );
};

export default CommunityList;
