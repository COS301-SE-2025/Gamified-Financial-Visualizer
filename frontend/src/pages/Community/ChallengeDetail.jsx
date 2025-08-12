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
        // navigate(`/transactions/${challengeData.challenge_id}`); // Redirect to transactions page with challenge ID
        // For now, redirect to transactions page without challenge ID
        navigate(`/transactions`);
    }
    
    const handleEdit = () => navigate(`/community/challenges/${challengeData.challenge_id}/edit`); // Challenge editing needs to be revisited

    if (!challengeData) {
        return (
            <CommunityLayout>
                <div className="max-w-6xl mx-auto p-6 text-center text-gray-500 dark:text-gray-400">
                    Loading challenge…
                </div>
            </CommunityLayout>
        );
    }

    return (
        <CommunityLayout>
            <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4 dark:bg-gray-900">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-[#111827] dark:text-gray-200 flex items-center gap-2">
                        <FaCoins className="text-[#FBBF24]" /> Challenge Detail
                    </h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 bg-[#E5E7EB] dark:bg-gray-700 text-[#374151] dark:text-gray-200 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#D1D5DB] dark:hover:bg-gray-600 transition"
                    >
                        <FaArrowLeft /> Back
                    </button>
                </div>

                {/* Challenge banner */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow border border-[#E5E7EB] dark:border-gray-700 flex items-start gap-6">
                    <img
                        src={bannerImg}
                        alt="Challenge Banner"
                        className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow"
                    />

                    {/* Challenge details */}
                    <div className="flex-1 space-y-2">
                        <h3 className="text-xl font-bold text-[#111827] dark:text-gray-200">{challengeData.challenge_title}</h3>
                        <p className="text-sm text-[#6B7280] dark:text-gray-400">{challengeData.community_name}</p>

                        {/* Challenge tags */}
                        <div className="flex flex-wrap gap-3 mt-4">
                            <span className="bg-[#FFD18C] text-[#FFFFFF] px-3 py-1 text-xs font-medium rounded-full">{challengeData.reward}</span>
                            <span className="bg-[#B1E1FF] text-[#FFFFFF] px-3 py-1 text-xs font-medium rounded-full">{challengeData.challenge_status}</span>
                            <span className="bg-[#FE9B90] text-[#FFFFFF] px-3 py-1 text-xs font-medium rounded-full">{challengeData.days_until_due < 0 ? Math.abs(challengeData.days_until_due) + ` days OVERDUE` : challengeData.days_until_due + ` days left`}</span>
                            <span className="bg-[#AAD977] text-[#FFFFFF] px-3 py-1 text-xs font-medium rounded-full">{challengeData.difficulty} difficulty</span>
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-[#E5E7EB] dark:border-gray-700">
                        <h4 className="text-sm font-semibold mb-2 text-[#1F2937] dark:text-gray-200">{challengeData.challenge_type}</h4>
                        <div className="flex items-center justify-between">
                            <div className="w-full h-4 rounded-full bg-white dark:bg-gray-700 border border-[#FBBF24] mr-4 overflow-hidden">
                                <div
                                    className="h-full"
                                    style={{
                                        width: (challengeData.current_amount / challengeData.target_amount) * 100 + '%',
                                        background: 'linear-gradient(to right, #FACC15, #FB923C)',
                                        borderRadius: '9999px',
                                    }}
                                />
                            </div>
                            <span className="text-sm font-semibold text-[#F97316]">{challengeData.target_amount}</span>
                        </div>
                        <p className="text-xs mt-1 text-right text-[#6B7280] dark:text-gray-400">Spending Target</p>
                    </div>

                    {/* Deadline details */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-[#E5E7EB] dark:border-gray-700">
                        <h4 className="text-sm font-semibold mb-2 text-[#1F2937] dark:text-gray-200">Deadline</h4>
                        <div className="flex items-center gap-2 text-sm text-[#374151] dark:text-gray-300">
                            <FaCalendarAlt /> <span> {challengeData.target_date
                                ? new Date(challengeData.target_date).toLocaleDateString('en-ZA', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })
                                : 'N/A'}</span>
                        </div>
                        <p className="text-xs mt-1 text-[#6B7280] dark:text-gray-400">Auto-expires at midnight</p>
                    </div>
                </div>

                {/* Challenge members */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-[#E5E7EB] dark:border-gray-700">
                    <h4 className="text-sm font-semibold mb-4 text-[#1F2937] dark:text-gray-200">Participants</h4>
                    <div className="flex gap-4">
                        {challengeData.participants.map((img, idx) => (
                            <img
                                key={idx}
                                src={`../../assets/Images/` + img}
                                className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow"
                                alt={`participant-${idx}`}
                            />
                        ))}
                        <span className="text-sm text-[#6B7280] dark:text-gray-400 self-center ml-2">+ {challengeData.participantsCount - challengeData.participants.length} others</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
                    {!joined && (
                        <button
                            onClick={handleJoin}
                            className="flex items-center gap-2 bg-[#72C1F5] text-white px-4 py-2 rounded-full font-medium hover:bg-[#4CA9DB] transition"
                        >
                            <FaPlus /> Join Challenge
                        </button>
                    )}

                    <p className="text-sm text-[#374151] max-w-xl">
                        To make progress towards this challenge, you can link transactions in the <span className="font-semibold">Transactions</span> page.
                        Once you reach the target amount, you will be able to claim your reward.
                    </p>
                </div>
            </div>
        </CommunityLayout>
    );
};

export default ChallengeDetail;