import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';
import { FaCoins, FaCalendarAlt, FaArrowLeft, FaPlus, FaEdit } from 'react-icons/fa';

import bannerImg from '../../assets/Images/banners/pixelStore.gif';
import avatar1 from '../../assets/Images/avatars/beachAvatar.jpeg';
import avatar2 from '../../assets/Images/avatars/ghostAvatar.jpeg';
import avatar3 from '../../assets/Images/avatars/butterflyAvatar.jpeg';
import avatar4 from '../../assets/Images/avatars/carAvatar.jpeg';
import avatar5 from '../../assets/Images/avatars/lilyAvatar.jpeg';

const mockChallenges = [
    {
        id: '1',
        title: 'Save R5000 in 30 days',
        description: 'Build your emergency fund by saving daily over a month.',
        reward: '100 XP',
        status: 'In-Progress',
        deadline: '2025-07-21',
        difficulty: 'Medium',
        xpProgress: '2600 / 5000 ZAR',
        progressPercent: '65%',
        participants: [avatar1, avatar2, avatar3, avatar4, avatar5],
        participantsCount: 47,
    },
    // Add more challenges if needed
];

const ChallengeDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [joined, setJoined] = useState(false);
    
    const challenge = mockChallenges.find((c) => c.id === id);

    if (!challenge) {
        return (
            <CommunityLayout>
                <div className="max-w-5xl mx-auto px-4 py-6">
                    <CommunityHeader />
                    <p className="text-red-500 font-medium">Challenge not found.</p>
                </div>
            </CommunityLayout>
        );
    } 

    const handleJoin = () => setJoined(true);
    const handleEdit = () => navigate(`/community/challenges/${challenge.id}/edit`);

    return (
        <CommunityLayout>
            <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4">
                <CommunityHeader />

                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-[#111827] flex items-center gap-2">
                        <FaCoins className="text-[#FBBF24]" /> Challenge Detail
                    </h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 bg-[#E5E7EB] text-[#374151] px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#D1D5DB] transition"
                    >
                        <FaArrowLeft /> Back
                    </button>
                </div>

                {/* Challenge bannerr icon */}
                <div className="bg-white p-6 rounded-3xl shadow border border-[#E5E7EB] flex items-start gap-6">
                    <img
                        src={bannerImg}
                        alt="Challenge Banner"
                        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow"
                    />

                    {/* Challenege details */}
                    <div className="flex-1 space-y-2">
                        <h3 className="text-xl font-bold text-[#111827]">{challenge.title}</h3>
                        <p className="text-sm text-[#6B7280]">{challenge.description}</p>

                        {/* Challenge tags */}
                        <div className="flex flex-wrap gap-3 mt-4">
                            <span className="bg-[#FFD18C] text-[#FFFFFF] px-3 py-1 text-xs font-medium rounded-full">{challenge.reward}</span>
                            <span className="bg-[#B1E1FF] text-[#FFFFFF] px-3 py-1 text-xs font-medium rounded-full">{challenge.status}</span>
                            <span className="bg-[#FE9B90] text-[#FFFFFF] px-3 py-1 text-xs font-medium rounded-full">12 Days Left</span>
                            <span className="bg-[#AAD977] text-[#FFFFFF] px-3 py-1 text-xs font-medium rounded-full">{challenge.difficulty} Difficulty</span>
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow border border-[#E5E7EB]">
                        <h4 className="text-sm font-semibold mb-2 text-[#1F2937]">Savings Progress</h4>
                        <div className="flex items-center justify-between">
                            <div className="w-full h-4 rounded-full bg-white border border-[#FBBF24] mr-4 overflow-hidden">
                                <div
                                    className="h-full"
                                    style={{
                                        width: challenge.progressPercent,
                                        background: 'linear-gradient(to right, #FACC15, #FB923C)',
                                        borderRadius: '9999px',
                                    }}
                                />
                            </div>
                            <span className="text-sm font-semibold text-[#F97316]">{challenge.xpProgress}</span>
                        </div>
                        <p className="text-xs mt-1 text-right text-[#6B7280]">Savings Target</p>
                    </div>

                    {/* Deadline details */}
                    <div className="bg-white p-6 rounded-2xl shadow border border-[#E5E7EB]">
                        <h4 className="text-sm font-semibold mb-2 text-[#1F2937]">Deadline</h4>
                        <div className="flex items-center gap-2 text-sm text-[#374151]">
                            <FaCalendarAlt /> <span>{challenge.deadline}</span>
                        </div>
                        <p className="text-xs mt-1 text-[#6B7280]">Auto-expires at midnight</p>
                    </div>
                </div>

                {/* Challenge members  */}
                <div className="bg-white p-6 rounded-2xl shadow border border-[#E5E7EB]">
                    <h4 className="text-sm font-semibold mb-4 text-[#1F2937]">Participants</h4>
                    <div className="flex gap-4">
                        {challenge.participants.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                                alt={`participant-${idx}`}
                            />
                        ))}
                        <span className="text-sm text-[#6B7280] self-center ml-2">+ {challenge.participantsCount - challenge.participants.length} others</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    {!joined ? (
                        <button
                            onClick={handleJoin}
                            className="flex items-center gap-2 bg-[#72C1F5] text-white px-4 py-2 rounded-full font-medium hover:bg-[#4CA9DB] transition"
                        >
                            <FaPlus /> Join Challenge
                        </button>
                    ) : (
                        <button
                            onClick={handleEdit}
                            className="flex items-center gap-2 bg-[#AAD977] text-white px-4 py-2 rounded-full font-medium hover:bg-[#83AB55] transition"
                        >
                            <FaEdit /> Edit Goal
                        </button>
                    )}
                </div>
            </div>
        </CommunityLayout>
    );
};

export default ChallengeDetail;
