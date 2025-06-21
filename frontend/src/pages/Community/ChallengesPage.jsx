import React from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';
import { FaTrophy, FaFire, FaCheckCircle, FaClock, FaCoins, FaUsers } from 'react-icons/fa';

// 🖼 Image import
import challengeImg from '../../assets/Images/banners/pixelStore.gif';

const mockChallenges = [
  {
    id: 1,
    title: 'Save R5000 in 30 days',
    description: 'Reach your savings goal and build financial discipline',
    status: 'Active',
    reward: '100 XP Reward',
    daysLeft: 12,
    progress: 65,
    participants: 342,
    difficulty: 'Medium',
    community: 'Cash Cows',
  },
  {
    id: 2,
    title: 'Track all spending for 7 days',
    description: 'Record every expense to understand your spending habits',
    status: 'Upcoming',
    reward: '50 XP Reward',
    startsIn: 3,
    participants: 128,
    difficulty: 'Easy',
    community: 'Coupon Crew',
  },
  {
    id: 3,
    title: 'Complete 3 goals this month',
    description: 'Achieve multiple financial targets in one month',
    status: 'Completed',
    reward: '200 XP Reward',
    completedOn: '2025-06-10',
    participants: 567,
    difficulty: 'Hard',
    community: 'Goal Getters',
  },
  {
    id: 4,
    title: 'No spend weekend',
    description: 'Avoid unnecessary purchases for an entire weekend',
    status: 'Active',
    reward: '75 XP Reward',
    daysLeft: 2,
    progress: 90,
    participants: 421,
    difficulty: 'Easy',
    community: 'Budget Benders',
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

const ChallengesPage = () => {
  const active = mockChallenges.filter((c) => c.status === 'Active');
  const upcoming = mockChallenges.filter((c) => c.status === 'Upcoming');
  const completed = mockChallenges.filter((c) => c.status === 'Completed');

  const renderCard = (challenge) => (

    <div
      key={challenge.id}
      className="bg-white pt-12 px-5 pb-5 rounded-3xl shadow-md border relative top-4"
      style={{ borderColor: '#E5E7EB', minHeight: 'auto' }}
    >
      {/* Circular image */}
      <img
        src={challengeImg}
        alt="Challenge"
        className="absolute -top-8 left-4 w-20 h-20 rounded-full object-cover border-4 border-white shadow"
      />

      {/* Header & Description */}
      <div className="flex justify-between items-start">
        <div>
          <h4
            className="text-lg font-semibold text-[#111827] leading-normal mb-1 break-words"
            style={{ lineHeight: '1.4', wordBreak: 'break-word' }}
          >
            <FaCoins className="inline mr-1 text-[#FBBF24]" />
            {challenge.title}
          </h4>
          <p className="text-xs font-semibold text-[#72C1F5] bg-[#E0F2FE] rounded-full px-3 py-1 inline-block w-fit mb-1">
            {challenge.community}
          </p>


          {challenge.status === 'Active' && (
            <>
              <p className="text-sm text-[#ED5E52] font-medium mt-1">2000/4000 ZAR</p>
              <p className="text-sm text-[#374151]">2000 ZAR Left</p>
              <p className="text-sm text-[#6B7280] mt-1">
                Goal will be accomplished on{' '}
                <span className="text-[#ED5E52] font-semibold">21/07/2027</span>
              </p>
            </>
          )}
          {challenge.status === 'Upcoming' && (
            <p className="text-sm text-[#F59E0B] mt-1">Starts in {challenge.startsIn} days</p>
          )}
          {challenge.status === 'Completed' && (
            <p className="text-sm text-[#AAD977] mt-1">
              Completed on <span className="font-semibold">{challenge.completedOn}</span>
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-col items-end gap-2 ml-4">
          <span className="text-xs px-3 py-1 rounded-full bg-[#B1E1FF] text-[#4B82A2] font-medium">
            In-Progress
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-[#FFD18C] text-[#FFFFFF] font-medium">
            Savings
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-[#FFD18C] text-[#FFFFFF] font-semibold">
            {challenge.reward}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <FaUsers /> {challenge.participants} participants • {challenge.difficulty}
        </span>
        {challenge.status === 'Active' && (
          <span className="text-xs text-[#F97316]">{challenge.progress}% complete</span>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <div className="flex-1">
          <Link to={`/community/challenges/${challenge.id}`}>
            <button className="w-full bg-[#AAD977] text-white text-sm px-4 py-2 rounded-full font-semibold hover:bg-[#83AB55] transition">
              View
            </button>
          </Link>
        </div>

        <div className="flex-1">
          <button
            onClick={() => handleDelete(challenge.title)}
            className="w-full bg-[#FE9B90] text-white text-sm px-4 py-2 rounded-full font-semibold hover:bg-[#ED5E52] transition">
            Delete
          </button>
        </div>
      </div>

    </div>
  );

  return (
    <CommunityLayout>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4">
        <CommunityHeader />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-600">Community Challenges</h2>
            <p className="text-gray-400">Join challenges to earn XP and level up!</p>
          </div>
          {/* <Link to="/community/challenges/create">
            <button className="flex items-center gap-2 bg-gradient-to-r from-[#72C1F5] to-[#B1E1FF] text-white px-4 py-2 rounded-full text-sm font-medium shadow hover:shadow-md transition">
              <FaTrophy /> Create Challenge
            </button>
          </Link> */}

        </div>

        {/* Active */}
        <div>
          <h3 className="text-lg font-semibold text-orange-500 mb-3 flex items-center gap-2">
            <FaFire /> Active
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{active.map(renderCard)}</div>
        </div>

        {/* Upcoming */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-500 mb-3 mt-6 flex items-center gap-2">
            <FaClock /> Upcoming
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{upcoming.map(renderCard)}</div>
        </div>

        {/* Completed */}
        <div>
          <h3 className="text-lg font-semibold text-lime-500 mb-3 mt-6 flex items-center gap-2">
            <FaCheckCircle /> Completed
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{completed.map(renderCard)}</div>
        </div>
      </div>
    </CommunityLayout>
  );
};

export default ChallengesPage;
