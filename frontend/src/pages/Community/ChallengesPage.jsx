import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';
import {
  FaSearch,
  FaFire,
  FaCheckCircle,
  FaClock,
  FaCoins,
  FaUsers,
  FaTrophy
} from 'react-icons/fa';
import defaultBanner from '../../assets/Images/banners/pixelStore.gif';

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState({ active: [], upcoming: [], completed: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) return;

    const fetchChallenges = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/community/challenges/user/${user.id}`);
        const json = await res.json();
        if (res.ok) {
          setChallenges(json.data);
        } else {
          toast.error(json.message || 'Failed to load challenges');
        }
      } catch (err) {
        toast.error('Error fetching challenges');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const handleDelete = (title) => {
    toast.custom((t) => (
      <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-lg max-w-sm w-full space-y-3">
        <p className="text-sm font-semibold text-gray-800">
          Delete <span className="text-[#ED5E52]">"{title}"</span> challenge?
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              toast.success(`Deleted "${title}"`);
              console.log(`Deleted ${title}`);
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

  const filterBySearch = (list) => {
    return list.filter((c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.community.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderCard = (challenge) => {
    const today = new Date();
    const startDate = new Date(challenge.start);
    const startsIn = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const bannerSrc = defaultBanner;

    return (
      <div
        key={challenge.id}
        className="bg-white pt-12 px-5 pb-5 rounded-3xl shadow-md border relative top-4"
        style={{ borderColor: '#E5E7EB' }}
      >
        <img
          src={bannerSrc}
          alt="Challenge Banner"
          className="absolute -top-8 left-4 w-20 h-20 rounded-full object-cover border-4 border-white shadow"
        />

        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-semibold text-[#111827] leading-normal mb-1 break-words">
              <FaCoins className="inline mr-1 text-[#FBBF24]" />
              {challenge.title}
            </h4>
            <p className="text-xs font-semibold text-[#72C1F5] bg-[#E0F2FE] rounded-full px-3 py-1 inline-block w-fit mb-1">
              {challenge.community}
            </p>

            {challenge.status === 'active' && (
              <>
                <p className="text-sm text-[#ED5E52] font-medium mt-1">{challenge.goal}</p>
                <p className="text-sm text-[#374151]">{challenge.remaining} ZAR Left</p>
                <p className="text-sm text-[#6B7280] mt-1">
                  Goal will be accomplished on{' '}
                  <span className="text-[#ED5E52] font-semibold">{challenge.formattedEnd}</span>
                </p>
              </>
            )}

            {challenge.status === 'upcoming' && challenge.startsIn !== undefined && (
              <p className="text-sm text-[#F59E0B] mt-1">
                Starts in {challenge.startsIn} day{challenge.startsIn !== 1 ? 's' : ''}
              </p>
            )}

            {challenge.status === 'completed' && challenge.formattedEnd && (
              <p className="text-sm text-[#AAD977] mt-1">
                Completed on <span className="font-semibold">{challenge.formattedEnd}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2 ml-4">
            <span className="text-xs px-3 py-1 rounded-full bg-[#B1E1FF] text-[#4B82A2] font-medium capitalize">
              {challenge.status === 'active'
                ? 'Active'
                : challenge.status === 'upcoming'
                ? 'Upcoming'
                : 'Completed'}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-[#FFD18C] text-white font-medium capitalize">
              {challenge.type}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-[#FFD18C] text-white font-semibold">
              {challenge.reward} XP Reward
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <FaUsers /> {challenge.participants} participants • {challenge.difficulty}
          </span>
          {challenge.status === 'active' && (
            <span className="text-xs text-[#F97316]">{challenge.progressText}</span>
          )}
        </div>

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
              className="w-full bg-[#FE9B90] text-white text-sm px-4 py-2 rounded-full font-semibold hover:bg-[#ED5E52] transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Section = ({ title, icon, color, data }) => {
    const filtered = filterBySearch(data);
    return (
      <div>
        <h3 className={`text-lg font-semibold ${color} mb-3 mt-6 flex items-center gap-2`}>
          {icon} {title}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.length > 0 ? filtered.map(renderCard) : <p className="text-gray-400 italic">No matches</p>}
        </div>
      </div>
    );
  };

  return (
    <CommunityLayout>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4">
        <CommunityHeader />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-600">Community Challenges</h2>
            <p className="text-gray-400">Join challenges to earn XP and level up!</p>
          </div>
          <Link to="/community/challenges/create">
            <button className="flex items-center gap-2 bg-gradient-to-r from-[#72C1F5] to-[#B1E1FF] text-white px-4 py-2 rounded-full text-sm font-medium shadow hover:shadow-md transition">
              <FaTrophy /> Create Challenge
            </button>
          </Link>
        </div>

        <div className="flex items-center w-full max-w-4xl -ml-[8px] px-4 py-2 rounded-3xl border-2 border-[#E5794B] bg-white shadow-sm">
          <FaSearch className="text-[#E5794B] mr-2" />
          <input
            type="text"
            placeholder="Search for challenges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none bg-transparent text-sm text-[#E5794B] placeholder-[#E5794B]/70"
          />
        </div>

        <Section title="Active" icon={<FaFire />} color="text-orange-500" data={challenges.active} />
        <Section title="Upcoming" icon={<FaClock />} color="text-yellow-500" data={challenges.upcoming} />
        <Section title="Completed" icon={<FaCheckCircle />} color="text-lime-500" data={challenges.completed} />
      </div>
    </CommunityLayout>
  );
};

export default ChallengesPage;
