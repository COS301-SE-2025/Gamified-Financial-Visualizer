import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';
import { FaCoins, FaCalendarAlt, FaArrowLeft, FaPlus } from 'react-icons/fa';

import bannerImg from '../../assets/Images/banners/pixelStore.gif';

const ChallengeDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [joined, setJoined] = useState(false);
    const [challengeData, setChallengeData] = useState(null);

    useEffect(() => {
        console.log(`Fetching challenge data from API for ID: ${id}`);
        const fetchChallenge = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/community/challenges/${id}`);
                console.log(`API Response Status: ${res.status}`);
                const challenge = await res.json();
                if (!res.ok) {
                    throw new Error(challenge.message || 'Failed to load challenge');
                }
                setChallengeData(challenge.data);
            } catch (err) {
                console.error(err);
                navigate('/community/challenges');
            }
        }

        if (id) {
            fetchChallenge();
        }
    }, [id, navigate]);

    const handleJoin = () => {
        setJoined(true);
        navigate(`/transactions`);
    }
    
    const handleEdit = () => navigate(`/community/challenges/${challengeData.challenge_id}/edit`);

    if (!challengeData) {
        return (
            <CommunityLayout>
                
            </CommunityLayout>
        );
    }

    return (
        <CommunityLayout>
            <div className="max-w-4xl mx-auto space-y-4 px-3 sm:px-4 dark:bg-gray-900">
                {/* Header Section */}
                <div className="flex flex-row justify-between items-center gap-3">
                    <h2 className="text-lg sm:text-xl font-bold text-[#111827] dark:text-gray-200 flex items-center gap-2">
                        <FaCoins className="text-[#FBBF24] text-sm sm:text-base" /> Challenge Detail
                    </h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 bg-[#E5E7EB] dark:bg-gray-700 text-[#374151] dark:text-gray-200 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-[#D1D5DB] dark:hover:bg-gray-600 transition"
                    >
                        <FaArrowLeft className="text-xs" /> Back
                    </button>
                </div>

                {/* Challenge banner */}
                <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-2xl shadow border border-[#E5E7EB] dark:border-gray-700 flex flex-row items-start gap-3 sm:gap-4">
                    <img
                        src={bannerImg}
                        alt="Challenge Banner"
                        className="w-12 h-12 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow flex-shrink-0"
                    />

                    {/* Challenge details */}
                    <div className="flex-1 space-y-1 sm:space-y-2 text-left">
                        <h3 className="text-sm sm:text-lg font-bold text-[#111827] dark:text-gray-200">{challengeData.challenge_title}</h3>
                        <p className="text-xs sm:text-sm text-[#6B7280] dark:text-gray-400">{challengeData.community_name}</p>

                        {/* Challenge tags */}
                        <div className="flex flex-wrap gap-1 mt-2 sm:mt-3 justify-start">
                            <span className="bg-[#FFD18C] text-[#FFFFFF] px-2 py-0.5 text-xs font-medium rounded-full">{challengeData.reward}</span>
                            <span className="bg-[#B1E1FF] text-[#FFFFFF] px-2 py-0.5 text-xs font-medium rounded-full">{challengeData.challenge_status}</span>
                            <span className="bg-[#FE9B90] text-[#FFFFFF] px-2 py-0.5 text-xs font-medium rounded-full">{challengeData.days_until_due < 0 ? Math.abs(challengeData.days_until_due) + ` days OVERDUE` : challengeData.days_until_due + ` days left`}</span>
                            <span className="bg-[#AAD977] text-[#FFFFFF] px-2 py-0.5 text-xs font-medium rounded-full">{challengeData.difficulty} difficulty</span>
                        </div>
                    </div>
                </div>

                {/* Progress bar section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow border border-[#E5E7EB] dark:border-gray-700">
                        <h4 className="text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-[#1F2937] dark:text-gray-200">{challengeData.challenge_type}</h4>
                        <div className="flex items-center justify-between gap-2">
                            <div className="w-full h-2.5 sm:h-3 rounded-full bg-white dark:bg-gray-700 border border-[#FBBF24] mr-2 sm:mr-3 overflow-hidden">
                                <div
                                    className="h-full"
                                    style={{
                                        width: (challengeData.current_amount / challengeData.target_amount) * 100 + '%',
                                        background: 'linear-gradient(to right, #FACC15, #FB923C)',
                                        borderRadius: '9999px',
                                    }}
                                />
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-[#F97316] whitespace-nowrap">{challengeData.target_amount}</span>
                        </div>
                        <p className="text-xs sm:text-sm mt-1 text-right text-[#6B7280] dark:text-gray-400">Spending Target</p>
                    </div>

                    {/* Deadline details */}
                    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow border border-[#E5E7EB] dark:border-gray-700">
                        <h4 className="text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-[#1F2937] dark:text-gray-200">Deadline</h4>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#374151] dark:text-gray-300 justify-start">
                            <FaCalendarAlt className="text-xs sm:text-sm" /> 
                            <span> 
                                {challengeData.target_date
                                    ? new Date(challengeData.target_date).toLocaleDateString('en-ZA', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })
                                    : 'N/A'}
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm mt-1 text-[#6B7280] dark:text-gray-400">Auto-expires at midnight</p>
                    </div>
                </div>

                {/* Challenge members */}
                <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow border border-[#E5E7EB] dark:border-gray-700">
                    <h4 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-[#1F2937] dark:text-gray-200 text-left">Participants</h4>
                    <div className="flex flex-wrap justify-start gap-2 sm:gap-3">
                        {challengeData.participants.map((img, idx) => (
                            <img
                                key={idx}
                                src={`../../assets/Images/` + img}
                                className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow"
                                alt={`participant-${idx}`}
                            />
                        ))}
                        {(challengeData.participantsCount - challengeData.participants.length) > 0 && (
                            <span className="text-xs sm:text-sm text-[#6B7280] dark:text-gray-400 self-center ml-1">
                            
                                + {challengeData.participantsCount - challengeData.participants.length} others
                            
                        </span>
                        )}
                    </div>
                </div>

                {/* Bottom section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
                    <p className="text-xs sm:text-sm text-[#374151] max-w-xl text-left">
                        To make progress towards this challenge, you can link transactions in the <span className="font-semibold">Transactions</span> page.
                        Once you reach the target amount, you will be able to claim your reward.
                    </p>
                    
                    {/* Action buttons */}
                    <div className="flex gap-2 sm:gap-3">
                        <button
                            onClick={handleJoin}
                            className="flex items-center gap-1 sm:gap-2 bg-[#FFD18C] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-[#f9b54c] transition whitespace-nowrap"
                        >
                            <FaPlus size={10} className="sm:size-3" /> {joined ? 'Joined' : 'Join Challenge'}
                        </button>
                        
                        {/* Edit button - only show if user owns the challenge */}
                        <button
                            onClick={handleEdit}
                            className="flex items-center gap-1 sm:gap-2 bg-[#B1E1FF] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-[#72C1F5] transition whitespace-nowrap"
                        >
                            Edit Challenge
                        </button>
                    </div>
                </div>
            </div>
        </CommunityLayout>
    );
};

export default ChallengeDetail;