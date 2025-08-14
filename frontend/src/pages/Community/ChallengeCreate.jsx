import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { createPortal } from 'react-dom';
import CommunityLayout from '../../pages/Community/CommunityLayout';
import {
  FaFire, FaTag, FaClock, FaMedal, FaArrowLeft, FaCoins, FaListUl, FaUserPlus,
  FaUsers,
  FaChevronDown
} from 'react-icons/fa';

const CategoryDropdown = ({ name, value, onChange, options, placeholder = 'Select...' }) => {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({}); // fixed positioning for portal

  const selectedIndex = Math.max(0, options.findIndex(o => String(o.value) === String(value)));
  const selected = options[selectedIndex] || null;

  // Close on click outside
  useEffect(() => {
    const onClickAway = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickAway);
    return () => document.removeEventListener('mousedown', onClickAway);
  }, []);

  // Position the menu in a portal without changing page height
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const calc = () => {
      const rect = btnRef.current.getBoundingClientRect();
      const maxH = Math.min(320, Math.floor(window.innerHeight * 0.4)); // ~10 items
      let top = rect.bottom + 6;
      let left = Math.min(rect.left, window.innerWidth - rect.width - 8);

      // If not enough space below, place above
      if (top + maxH > window.innerHeight - 8) {
        top = Math.max(8, rect.top - 6 - maxH);
      }
      setMenuStyle({
        position: 'fixed',
        top,
        left,
        width: rect.width,
        maxHeight: maxH,
        zIndex: 9999,
      });
    };
    calc();
    window.addEventListener('scroll', calc, true);
    window.addEventListener('resize', calc);
    return () => {
      window.removeEventListener('scroll', calc, true);
      window.removeEventListener('resize', calc);
    };
  }, [open]);

  // Reset highlight when opening
  useEffect(() => {
    if (open) setHighlight(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open, selectedIndex]);

  const commit = (idx) => {
    const opt = options[idx];
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
  };

  const onKey = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault(); setOpen(true); return;
    }
    if (!open) return;

    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => Math.min(options.length - 1, h + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => Math.max(0, h - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); commit(highlight); }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
  };

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        ref={btnRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        onKeyDown={onKey}
        className="w-full rounded-xl px-4 py-2 border dark:border-gray-600 shadow dark:shadow-none
                   bg-white dark:bg-gray-700 text-left text-gray-900 dark:text-white flex items-center justify-between"
      >
        <span className={`${selected ? '' : 'text-gray-400 dark:text-gray-400'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <FaChevronDown className="ml-3 text-gray-400 dark:text-gray-500" />
      </button>

      {/* Portal menu (fixed) so it never changes page height / adds a second scrollbar */}
      {open && createPortal(
        <ul
          role="listbox"
          tabIndex={-1}
          style={menuStyle}
          onKeyDown={onKey}
          onWheel={(e) => e.stopPropagation()} // stop scroll chaining
          className="rounded-xl border border-gray-200 dark:border-gray-600
                     bg-white dark:bg-gray-700 shadow-lg overflow-y-auto"
        >
          <style>{`.dropdown-overscroll { overscroll-behavior: contain; }`}</style>
          <div className="dropdown-overscroll">
            {options.length === 0 && (
              <li className="px-3 h-8 flex items-center text-sm text-gray-500 dark:text-gray-300">
                No categories
              </li>
            )}
            {options.map((opt, idx) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={String(opt.value) === String(value)}
                onMouseEnter={() => setHighlight(idx)}
                onClick={() => commit(idx)}
                className={`px-3 h-8 flex items-center text-sm cursor-pointer
                            ${idx === highlight ? 'bg-gray-100 dark:bg-gray-600' : ''}
                            ${String(opt.value) === String(value)
                    ? 'font-medium text-[#1b5e20]'
                    : 'text-gray-800 dark:text-gray-100'}`}
              >
                {opt.label}
              </li>
            ))}
          </div>
        </ul>,
        document.body
      )}

      {/* Hidden input keeps native form compatibility */}
      <input type="hidden" name={name} value={value ?? ''} />
    </div>
  );
};

const ChallengeCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    community: '',
    targetAmount: '',
    startDate: '',
    endDate: '',
    participants: 1,
    image: null,
    imageId: '',
  });
  const [searchFriend, setSearchFriend] = useState('');
  const [invitedFriends, setInvitedFriends] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [categories, setCategories] = useState([]);
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/transactions/categories');
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // fetch communities 
  const fetchCommunities = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) return;

    try {
      const res = await fetch(`http://localhost:5000/api/auth/profile/communities/${user.id}`);
      const data = await res.json();
      setCommunities(data.data || []);
    } catch (err) {
      console.error('Failed to load communities:', err);
    }
  };

  // fetch friends 
  const fetchFriends = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) return;

    try {
      const res = await fetch(`http://localhost:5000/api/community/friends/${user.id}`);
      const data = await res.json();
      setFriendsList(data.data || []);
    } catch (err) {
      console.error('Failed to load friends:', err);
    }
  }

  useEffect(() => {
    fetchCommunities();
    fetchFriends();
  }, []);

  const imageOptions = [
    { id: 'store_banner', apiId: 1, src: require('../../assets/Images/banners/pixelStore.gif'), label: 'Pixel Store' },
    { id: 'apartment_banner', apiId: 2, src: require('../../assets/Images/banners/pixelApartment.gif'), label: 'Pixel Apartment' },
    { id: 'ally_banner', apiId: 3, src: require('../../assets/Images/banners/pixelGirlAlly.gif'), label: 'Pixel Ally' },
    { id: 'students_banner', apiId: 4, src: require('../../assets/Images/banners/pixelStudents.jpeg'), label: 'Pixel Students' },
  ];

  // chnage handler
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // handle invites
  const handleInvite = (friend) => {
    if (!invitedFriends.includes(friend.name)) {
      setInvitedFriends([...invitedFriends, friend.name]);
      toast.success(`Invite sent to ${friend.name}`);
    }
  };

  // handle the submits
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  // confirm the creation 
  const confirmCreate = async () => {
    setIsCreating(true);
    setShowConfirmation(false);

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) {
      toast.error('You must be logged in to create a challenge');
      setIsCreating(false);
      return;
    }
    const targetAmount = parseFloat(formData.targetAmount) || 0;
    // date factor
    if (targetAmount <= 0) {
      toast.error('Target amount must be greater than 0');
      setIsCreating(false);
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      toast.error('Please select both start and end dates');
      setIsCreating(false);
      return;
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('End date must be after start date');
      setIsCreating(false);
      return;
    }
    if (!formData.type) {
      toast.error('Please select a challenge type');
      setIsCreating(false);
      return;
    }
    if (!formData.community) {
      toast.error('Please select a community');
      setIsCreating(false);
      return;
    }
    if (formData.category && !categories.some(cat => cat.category_id === formData.category)) {
      toast.error('Invalid category selected');
      setIsCreating(false);
      return;
    }

    // if date is within 30 days, set difficulty based on target amount
    const daysUntilDue = Math.ceil((new Date(formData.endDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue < 0) {
      toast.error('End date must be in the future');
      setIsCreating(false);
      return;
    }

    // Calculate XP reward based on target amount
    const xpReward = targetAmount * 0.1 + (daysUntilDue < 30 ? 50 : 0); // Example XP calculation based on target amount
    if (xpReward < 30) {
      toast.error('Target amount must be at least 30 ZAR to create a challenge');
      setIsCreating(false);
      return;
    }
    let difficulty;

    if (xpReward < 100) {
      difficulty = 'easy';
    } else if (xpReward < 250) {
      difficulty = 'medium';
    } else if (xpReward < 500) {
      difficulty = 'hard';
    } else {
      difficulty = 'extreme';
    }

    const challengeData = {
      creator_id: user.id,
      community_id: formData.community,
      challenge_title: formData.title,
      challenge_type: formData.type,
      measurement_type: formData.measurementType,
      target_amount: parseFloat(formData.targetAmount),
      start_date: formData.startDate,
      target_date: formData.endDate,
      category_id: formData.category || null,
      custom_category_id: null,
      banner_id: formData.imageId || 1,
      difficulty: difficulty,
    };

    try {
      const response = await fetch('http://localhost:5000/api/community/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(challengeData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create challenge');
      }

      toast.success('Challenge created successfully!');

      if (invitedFriends.length > 0) {
        try {
          await fetch('http://localhost:5000/api/community/challenges/invite', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              challenge_id: data.data.challenge_id,
              invited_users: invitedFriends
            })
          });
          toast.success(`Invitations sent to ${invitedFriends.length} friends`);
        } catch (inviteError) {
          console.error('Failed to send invitations:', inviteError);
          toast.error('Challenge created but failed to send some invitations');
        }
      }

      setTimeout(() => {
        navigate('/community/challenges');
      }, 2000);

    } catch (error) {
      console.error('Error creating challenge:', error);
      toast.error(error.message || 'Failed to create challenge');
    } finally {
      setIsCreating(false);
    }
  };

  // create cancels functions
  const cancelCreate = () => {
    setShowConfirmation(false);
  };

  const today = new Date().toISOString().split('T')[0];
  const filteredFriends = friendsList?.filter(f => f.username.toLowerCase().includes(searchFriend.toLowerCase()));

  return (
    <CommunityLayout>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4 dark:bg-gray-900">

        {/* Confirmation popup */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl max-w-md w-full">
              <h3 className="text-xl font-bold mb-4 dark:text-gray-200">Confirm Challenge Creation</h3>
              <p className="mb-6 dark:text-gray-300">
                Are you sure you want to create a challenge "{formData.name}"?
                {invitedFriends.length > 0 && (
                  <span className="block mt-2">
                    This will invite {invitedFriends.length} member{invitedFriends.length !== 1 ? 's' : ''}.
                  </span>
                )}
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={cancelCreate}
                  disabled={isCreating}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCreate}
                  disabled={isCreating}
                  className="px-4 py-2 bg-[#AAD977] text-white rounded-full hover:bg-[#83AB55] disabled:opacity-50 flex items-center justify-center min-w-24"
                >
                  {isCreating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#1F2937] dark:text-gray-200 flex items-center gap-2">
              <FaFire className="text-[#B1E1FF]" /> Create New Challenge
            </h2>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-[#E5E7EB] dark:bg-gray-700 text-[#374151] dark:text-gray-200 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#D1D5DB] dark:hover:bg-gray-600 transition"
            >
              <FaArrowLeft /> Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B1E1FF]"
                required
              />
            </div>

            {/* Challenge Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Challenge Image</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {imageOptions.map((img) => (
                  <label
                    key={img.id}
                    role="radio"
                    tabIndex={0}
                    aria-checked={formData.imageId === img.apiId}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setFormData({ ...formData, imageId: img.apiId });
                      }
                    }}
                    className={`relative cursor-pointer group border rounded-xl overflow-hidden transition focus:outline-none
        ${formData.imageId === img.apiId
                        ? 'ring-2 ring-[#B1E1FF] border-[#B1E1FF]'
                        : 'border-gray-300 dark:border-gray-600'}`}
                    onClick={() => setFormData({ ...formData, imageId: img.apiId })}
                  >
                    <input
                      type="radio"
                      name="imageId"
                      value={img.apiId}
                      checked={formData.imageId === img.apiId}
                      onChange={() => setFormData({ ...formData, imageId: img.apiId })}
                      className="sr-only"
                    />
                    <img src={img.src} alt={img.label} className="w-full h-24 object-cover" />
                    <div className="p-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      {img.label}
                    </div>

                    {/* subtle overlay + tick when selected */}
                    {formData.imageId === img.apiId && (
                      <>
                        <div className="absolute inset-0 ring-inset ring-2 ring-[#B1E1FF] pointer-events-none" />
                        <span className="absolute top-2 right-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#B1E1FF] text-white text-xs">
                          ✓
                        </span>
                      </>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Type and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Challenge type dropdown */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <FaListUl /> Challenge Type
                </label>
                <CategoryDropdown
                  name="type"
                  value={formData.type}
                  onChange={(val) => setFormData({ ...formData, type: val })}
                  options={[
                    { value: 'savings', label: 'Savings' },
                    { value: 'debt', label: 'Debt' },
                    { value: 'investment', label: 'Investment' },
                    { value: 'spending limit', label: 'Spending Limit' },
                    { value: 'donation', label: 'Donation' },
                  ]}
                  placeholder="Select Type"
                />
              </div>

              {/* Category dropdown */}
              <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Goal Category
              </label>

              {/* Custom dropdown */}
              <CategoryDropdown
                name="category"
                value={formData.category}
                onChange={(val) => handleChange({ target: { name: 'category', value: val } })}
                options={(categories || []).map(c => ({ value: c.category_id, label: c.category_name }))}
                placeholder="Select a category"
              />
            </div>

              {/* Community dropdown */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <FaUsers /> Community
                </label>
                <CategoryDropdown
                  name="community"
                  value={formData.community}
                  onChange={(val) => setFormData({ ...formData, community: val })}
                  options={(communities || []).map(c => ({
                    value: String(c.community_id),
                    label: c.community_name
                  }))}
                  placeholder="Select a community"
                />
              </div>

              {/* Measurement type */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <FaListUl /> Measurement Type
                </label>
                <CategoryDropdown
                  name="measurementType"
                  value={formData.measurementType}
                  onChange={(val) => setFormData({ ...formData, measurementType: val })}
                  options={[
                    { value: 'goals_completed', label: 'Goals Completed' },
                    { value: 'transactions_logged', label: 'Transactions Logged' },
                    { value: 'amount_invested', label: 'Amount Invested' },
                    { value: 'amount_donated', label: 'Amount Donated' },
                    { value: 'spending_within_limit', label: 'Spending within limit' },
                  ]}
                  placeholder="Select Type"
                />
              </div>

            </div>

            {/* Target & XP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <FaCoins /> Target Amount (ZAR)
                </label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  min="1"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <FaMedal /> XP Reward
                </label>
                <input
                  type="number"
                  name="xpReward"
                  value={formData.xpReward}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <FaClock /> Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  min={today}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <FaClock /> End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  min={today}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
            </div>

            {/* Invite Friends */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <FaUserPlus /> Invite Friends to Challenge
              </label>
              <input
                type="text"
                placeholder="Search friend by username..."
                value={searchFriend}
                onChange={(e) => setSearchFriend(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredFriends.map((friend, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 p-2 rounded-xl border border-gray-200 dark:border-gray-600"
                  >
                    <img src={`../../assets/Images/${friend.avatar_image_path}`} alt={friend.username} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{friend.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic">{friend.tier_status}</p>
                    </div>
                    <button
                      onClick={() => handleInvite(friend)}
                      className="bg-[#AAD977] text-white px-3 py-1 rounded-full text-xs hover:bg-[#83AB55]"
                    >
                      Invite
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit challenge button */}
            <div className="pt-4">
              <button
                type="submit"
                className="bg-[#B1E1FF] hover:bg-[#4BA5E6] text-white px-6 py-2 rounded-full font-semibold shadow-md"
              >
                Create Challenge
              </button>
            </div>
          </form>
        </div>
      </div>
    </CommunityLayout>
  );
};

export default ChallengeCreate;