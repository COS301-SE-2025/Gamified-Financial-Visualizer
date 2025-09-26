// GoalCreatePage.jsx
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import goal1 from '../../assets/Images/banners/pixelApartment.gif';
import goal2 from '../../assets/Images/banners/pixelHouse.gif';
import goal3 from '../../assets/Images/banners/pixelOffice1.gif';
import goal4 from '../../assets/Images/banners/pixelStore.gif';
import goal5 from '../../assets/Images/banners/pixelGirlAlly.gif';
import goal6 from '../../assets/Images/banners/pixelStudents.jpeg';
import GoalsViewLayout from './GoalsViewLayout';

const CategoryDropdown = ({ name, value, onChange, options, placeholder = 'Select...' }) => {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({});

  // Only select if there’s an actual match
  const selectedIndex = options.findIndex(o => String(o.value) === String(value));
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  // Close on outside click (treat portaled menu as "inside")
  useEffect(() => {
    const onPointerDown = (e) => {
      if (wrapRef.current?.contains(e.target)) return;
      if (menuRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, []);

  // ✅ Smart placement: below with offset; flip up if space is tight; clamp horizontally
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;

    const calc = () => {
      const rect = btnRef.current.getBoundingClientRect();
      const viewportPadding = 8;
      const offset = 8;
      const minH = 160;
      const maxHCap = 360;

      const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;
      const spaceAbove = rect.top - viewportPadding;
      const placeBelow = spaceBelow >= Math.min(240, spaceAbove) || spaceBelow >= spaceAbove;

      const maxHeight = Math.max(
        minH,
        Math.min(maxHCap, (placeBelow ? spaceBelow : spaceAbove) - offset)
      );

      const width = rect.width; // keep same width as the field

      let left = rect.left;
      left = Math.max(viewportPadding, Math.min(left, window.innerWidth - viewportPadding - width));

      let top;
      if (placeBelow) {
        top = Math.min(rect.bottom + offset, window.innerHeight - viewportPadding - maxHeight);
      } else {
        top = Math.max(viewportPadding, rect.top - offset - maxHeight);
      }

      setMenuStyle({
        position: 'fixed',
        top,
        left,
        width,
        maxHeight,
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

  // Reset highlight and ensure selected item is visible when opening
  useEffect(() => {
    const idx = selectedIndex >= 0 ? selectedIndex : 0;
    setHighlight(idx);
    if (open) {
      requestAnimationFrame(() => {
        const el = menuRef.current?.querySelector(`[data-idx="${idx}"]`);
        el?.scrollIntoView({ block: 'nearest' });
      });
    }
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

      {open && createPortal(
        <ul
          ref={menuRef}
          role="listbox"
          tabIndex={-1}
          style={menuStyle}
          onKeyDown={onKey}
          onWheel={(e) => e.stopPropagation()}
          className="rounded-xl border border-gray-200 dark:border-gray-600
                     bg-white dark:bg-gray-700 shadow-lg overflow-y-auto"
        >
          <style>{`.dropdown-overscroll { overscroll-behavior: contain; }`}</style>
          <div className="dropdown-overscroll">
            {options.length === 0 && (
              <li className="px-3 h-8 flex items-center text-sm text-gray-500 dark:text-gray-300">No options</li>
            )}
            {options.map((opt, idx) => (
              <li
                key={opt.value}
                data-idx={idx}
                role="option"
                aria-selected={String(opt.value) === String(value)}
                onMouseEnter={() => setHighlight(idx)}
                onClick={() => commit(idx)}
                className={`px-3 h-8 flex items-center text-sm cursor-pointer
                            ${idx === highlight ? 'bg-gray-100 dark:bg-gray-600' : ''}
                            ${String(opt.value) === String(value) ? 'font-medium text-[#1b5e20]' : 'text-gray-800 dark:text-gray-100'}`}
              >
                {opt.label}
              </li>
            ))}
          </div>
        </ul>,
        document.body
      )}

      <input type="hidden" name={name} value={value ?? ''} />
    </div>
  );
};

// all the banner options, with backend ids
const bannerOptions = [
  { apiId: 1, label: 'Apartment', src: goal1 },
  { apiId: 2, label: 'House', src: goal2 },
  { apiId: 3, label: 'Office', src: goal3 },
  { apiId: 4, label: 'Store', src: goal4 },
  { apiId: 5, label: 'Ally', src: goal5 },
  { apiId: 6, label: 'Students', src: goal6 },
];


const GoalCreatePage = () => {
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: '',
    amount: '',
    startDate: '',
    endDate: '',
    type: '',
    category: '',
    image: bannerOptions[0].apiId,
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const [categories, setCategories] = useState([]);

  const toLocalISO = (d) => {
    const x = new Date(d);
    x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
    return x.toISOString().split('T')[0];
  };
  const today = toLocalISO(new Date());

  // fetch categories
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

  // guard submit button
  const datesValid = form.startDate && form.endDate && form.endDate >= form.startDate;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!datesValid) return;

    const bannerIdMap = {
      [goal1]: 1,
      [goal2]: 2,
      [goal3]: 3
    };

    const goalPayload = {
      user_id: user?.id,
      goal_name: form.name,
      target_amount: parseFloat(form.amount),
      goal_type: form.type,
      start_date: form.startDate,
      target_date: form.endDate,
      banner_id: bannerIdMap[form.image],
      goal_status: 'in-progress',
      category_id: Number(form.category)
    };

    try {
      const res = await fetch('http://localhost:5000/api/goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalPayload)
      });

      const data = await res.json();
      if (res.ok) {
        window.location.href = '/goals';
      } else {
        console.error(`Failed to create goal: ${data.message}`);
      }
    } catch (err) {
      console.error('Error submitting goal:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'startDate') {
      setForm(prev => {
        const nextEnd = prev.endDate && prev.endDate < value ? value : prev.endDate;
        return { ...prev, startDate: value, endDate: nextEnd };
      });
      return;
    }
    if (name === 'endDate') {
      setForm(prev => ({ ...prev, endDate: value }));
      return;
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (img) => {
    setForm((prev) => ({ ...prev, image: img }));
  };

  return (
    <GoalsViewLayout>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow dark:shadow-lg space-y-6 border border-gray-100 dark:border-gray-700">
        {/* Basic Information */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Create a Goal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Vacation Fund"
                value={form.name}
                onChange={handleChange}
                className="rounded-xl px-4 py-2 border dark:border-gray-600 shadow dark:shadow-none focus:outline-none w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Amount (R)</label>
              <input
                type="number"
                name="amount"
                placeholder="e.g. 15000"
                value={form.amount}
                onChange={handleChange}
                min="0"
                className="rounded-xl px-4 py-2 border dark:border-gray-600 shadow dark:shadow-none w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Timeframe */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Timeframe</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                min={today}
                className="rounded-xl px-4 py-2 border dark:border-gray-600 shadow dark:shadow-none w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                min={form.startDate || today}
                className="rounded-xl px-4 py-2 border dark:border-gray-600 shadow dark:shadow-none w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Goal Type dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Type</label>
              <CategoryDropdown
                name="type"
                value={form.type}
                onChange={(val) => handleChange({ target: { name: 'type', value: val } })}
                options={[
                  { value: 'savings', label: 'Savings' },
                  { value: 'debt', label: 'Debt' },
                  { value: 'investment', label: 'Investment' },
                  { value: 'spending limit', label: 'Spending limit' },
                  { value: 'donation', label: 'Donation' },
                ]}
                placeholder="Select goal type"
              />
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Category</label>
              <CategoryDropdown
                name="category"
                value={form.category}
                onChange={(val) => handleChange({ target: { name: 'category', value: val } })}
                options={(categories || []).map(c => ({ value: c.category_id, label: c.category_name }))}
                placeholder="Select a category"
              />
            </div>

            <div className="flex items-end">
              <span className="text-sm font-medium text-green-500 dark:text-green-400">XP Reward: 20 XP</span>
            </div>
          </div>
        </div>

        {/* Visual Representation */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Visual Representation</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Choose an image to represent your goal
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
            {bannerOptions.map((opt) => {
              const selected = form.imageId === opt.apiId;
              return (
                <button
                  key={opt.apiId}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, imageId: opt.apiId }))}
                  className={`relative rounded-xl overflow-hidden border-2 transition focus:outline-none
            ${selected ? 'border-green-400 dark:border-green-500' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}`}
                  aria-pressed={selected}
                >
                  <img src={opt.src} alt={opt.label} className="w-full h-24 object-cover" />
                  <div className="p-2 text-center text-xs font-medium text-gray-700 dark:text-gray-300">
                    {opt.label}
                  </div>
                  {selected && (
                    <span className="absolute top-2 right-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>


        {/* Submit */}
        <div className="pt-4 text-right">
          <button
            type="button"
            onClick={() => (datesValid ? setShowConfirm(true) : null)}
            disabled={!datesValid}
            className={`px-8 py-3 rounded-full font-medium transition-all dark:bg-gray-700 dark:text-gray-300
              ${datesValid
                ? 'bg-gradient-to-r from-[#B4CB98] to-[#AAD977] text-white hover:from-[#AAD977] hover:to-[#B4CB98]'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
          >
            Create Goal
          </button>

          {form.startDate && form.endDate && form.endDate < form.startDate && (
            <p className="mt-2 text-sm text-red-500">End date can’t be before start date.</p>
          )}
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg dark:shadow-xl w-[90%] max-w-md text-center space-y-4 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Confirm Goal Creation</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Are you sure you want to create this goal?</p>
            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-[#AAD977] dark:bg-[#7FDD53] text-white rounded-full hover:bg-[#B4CB98] dark:hover:bg-[#86EFAC]"
              >
                Yes, Create
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </GoalsViewLayout>
  );
};

export default GoalCreatePage;