import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import AccountsLayout from './AccountsLayout';
import {
  FaEdit, FaTrash, FaUtensils, FaBus, FaBolt, FaFilm, FaHeartbeat,
  FaPlane, FaBook, FaLaptop, FaUser, FaHandsHelping, FaTshirt,
  FaDumbbell, FaMobileAlt, FaWifi, FaTv, FaHome, FaShieldAlt,
  FaGasPump, FaBuilding, FaUniversity, FaMoneyBillWave,
  FaPiggyBank, FaChartLine, FaChild, FaPaw, FaTools, FaWallet,
  FaCoins, FaExchangeAlt, FaPlus, FaTimes, FaCheck,
  FaSearch, FaChevronDown
} from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const categoryIcons = {
  groceries: { icon: <FaUtensils />, color: 'bg-orange-100 text-orange-500' },
  transport: { icon: <FaBus />, color: 'bg-blue-100 text-blue-500' },
  fuel: { icon: <FaGasPump />, color: 'bg-yellow-100 text-yellow-500' },
  utilities: { icon: <FaBolt />, color: 'bg-purple-100 text-purple-500' },
  rent: { icon: <FaHome />, color: 'bg-indigo-100 text-indigo-500' },
  mortgage: { icon: <FaBuilding />, color: 'bg-gray-100 text-gray-500' },
  internet: { icon: <FaWifi />, color: 'bg-teal-100 text-teal-500' },
  phone: { icon: <FaMobileAlt />, color: 'bg-green-100 text-green-500' },
  insurance: { icon: <FaShieldAlt />, color: 'bg-red-100 text-red-500' },
  medical: { icon: <FaHeartbeat />, color: 'bg-pink-100 text-pink-500' },
  health: { icon: <FaHeartbeat />, color: 'bg-pink-100 text-pink-500' },
  fitness: { icon: <FaDumbbell />, color: 'bg-amber-100 text-amber-500' },
  education: { icon: <FaBook />, color: 'bg-blue-100 text-blue-500' },
  subscriptions: { icon: <FaTv />, color: 'bg-purple-100 text-purple-500' },
  entertainment: { icon: <FaFilm />, color: 'bg-red-100 text-red-500' },
  restaurants: { icon: <FaUtensils />, color: 'bg-orange-100 text-orange-500' },
  clothing: { icon: <FaTshirt />, color: 'bg-indigo-100 text-indigo-500' },
  'personal care': { icon: <FaUser />, color: 'bg-pink-100 text-pink-500' },
  gifts: { icon: <FaHandsHelping />, color: 'bg-teal-100 text-teal-500' },
  charity: { icon: <FaHandsHelping />, color: 'bg-teal-100 text-teal-500' },
  taxes: { icon: <FaMoneyBillWave />, color: 'bg-gray-100 text-gray-500' },
  savings: { icon: <FaPiggyBank />, color: 'bg-green-100 text-green-500' },
  investments: { icon: <FaChartLine />, color: 'bg-blue-100 text-blue-500' },
  'loan repayment': { icon: <FaUniversity />, color: 'bg-indigo-100 text-indigo-500' },
  debt: { icon: <FaMoneyBillWave />, color: 'bg-gray-100 text-gray-500' },
  travel: { icon: <FaPlane />, color: 'bg-cyan-100 text-cyan-500' },
  accommodation: { icon: <FaHome />, color: 'bg-indigo-100 text-indigo-500' },
  salary: { icon: <FaWallet />, color: 'bg-green-100 text-green-500' },
  freelance: { icon: <FaLaptop />, color: 'bg-blue-100 text-blue-500' },
  bonus: { icon: <FaCoins />, color: 'bg-yellow-100 text-yellow-500' },
  refund: { icon: <FaExchangeAlt />, color: 'bg-teal-100 text-teal-500' },
  'transfer in': { icon: <FaExchangeAlt />, color: 'bg-teal-100 text-teal-500' },
  'transfer out': { icon: <FaExchangeAlt />, color: 'bg-teal-100 text-teal-500' },
  'cash withdrawal': { icon: <FaMoneyBillWave />, color: 'bg-gray-100 text-gray-500' },
  'cash deposit': { icon: <FaMoneyBillWave />, color: 'bg-gray-100 text-gray-500' },
  'business income': { icon: <FaLaptop />, color: 'bg-blue-100 text-blue-500' },
  'business expense': { icon: <FaLaptop />, color: 'bg-blue-100 text-blue-500' },
  maintenance: { icon: <FaTools />, color: 'bg-amber-100 text-amber-500' },
  repairs: { icon: <FaTools />, color: 'bg-amber-100 text-amber-500' },
  childcare: { icon: <FaChild />, color: 'bg-pink-100 text-pink-500' },
  pets: { icon: <FaPaw />, color: 'bg-purple-100 text-purple-500' },
  'home improvement': { icon: <FaHome />, color: 'bg-indigo-100 text-indigo-500' },
  fees: { icon: <FaMoneyBillWave />, color: 'bg-gray-100 text-gray-500' },
  commissions: { icon: <FaCoins />, color: 'bg-yellow-100 text-yellow-500' },
  'interest income': { icon: <FaCoins />, color: 'bg-yellow-100 text-yellow-500' },
  dividends: { icon: <FaCoins />, color: 'bg-yellow-100 text-yellow-500' },
  default: { icon: <FaMoneyBillWave />, color: 'bg-gray-100 text-gray-500' }
};

const CategoryDropdown = ({
  value,
  onChange,
  options,
  placeholder = 'Filter by categories',
  disabled = false,
  loading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);                 // NEW: ref for the portaled menu
  const [menuStyle, setMenuStyle] = useState({});

  // Close when clicking outside (but ignore clicks inside menu/button)
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      const clickedInsideTrigger = dropdownRef.current?.contains(target);
      const clickedInsideButton = buttonRef.current?.contains(target);
      const clickedInsideMenu = menuRef.current?.contains(target);
      if (!clickedInsideTrigger && !clickedInsideButton && !clickedInsideMenu) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Position the menu properly
  useLayoutEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const calculatePosition = () => {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const maxHeight = Math.min(320, window.innerHeight - buttonRect.bottom - 16);
      setMenuStyle({
        position: 'fixed',
        top: buttonRect.bottom + 4,
        left: buttonRect.left,
        width: buttonRect.width,
        maxHeight: `${maxHeight}px`,
        zIndex: 9999, // ensure above overlays
      });
    };

    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition, true);
    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition, true);
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => Math.min(prev + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (options[highlightedIndex]) {
          onChange(options[highlightedIndex].value);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleOptionClick = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => !disabled && !loading && setIsOpen(o => !o)}
        onKeyDown={handleKeyDown}
        disabled={disabled || loading}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">
          {loading ? 'Loading categories...' : (selectedOption?.label || placeholder)}
        </span>
        {!disabled && !loading && (
          <FaChevronDown className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && createPortal(
        <div
          ref={menuRef} // NEW: track the menu for outside-click logic
          className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg overflow-y-auto"
          style={menuStyle}
          role="listbox"
          onMouseDown={(e) => e.stopPropagation()} // IMPORTANT: prevent bubbling to document
          onWheel={(e) => e.stopPropagation()}
        >
          <div style={{ overscrollBehavior: 'contain' }}>
            {options.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                No categories available
              </div>
            ) : (
              options.map((option, index) => (
                <div
                  key={option.value}
                  className={`px-4 py-2 text-sm cursor-pointer ${highlightedIndex === index ? 'bg-gray-100 dark:bg-gray-700' : ''} ${value === option.value ? 'font-medium text-[#1b5e20] dark:text-green-300' : 'text-gray-800 dark:text-gray-200'}`}
                  onClick={() => handleOptionClick(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  role="option"
                  aria-selected={value === option.value}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

const BudgetForm = ({
  initialData = { budget_name: '', category_id: '', target_amount: '' },
  onSave,
  onCancel,
  categories = [],
  isEdit = false
}) => {
  const [formData, setFormData] = useState(initialData);
  const selectedCategory = categories.find(cat => cat.category_id === formData.category_id);
  const categoryName = selectedCategory?.category_name?.toLowerCase() || '';
  const iconData = categoryIcons[categoryName] || categoryIcons.default;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'target_amount' || name === 'category_id' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleCategoryChange = (val) => {
    setFormData(prev => ({
      ...prev,
      category_id: val === '' ? '' : Number(val) // keep numbers for equality checks
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-4 border border-gray-100 dark:border-gray-700">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 ${iconData.color} rounded-xl flex items-center justify-center text-xl`}>
            {iconData.icon}
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {isEdit ? (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget Name</label>
                  <input
                    type="text"
                    name="budget_name"
                    value={formData.budget_name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#467D35] focus:border-[#467D35] dark:bg-gray-700 dark:text-gray-200"
                    required
                    placeholder="Enter budget name"
                  />
                </div>
              ) : (
                <>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <CategoryDropdown
                      value={formData.category_id}
                      onChange={handleCategoryChange}
                      options={categories.map(cat => ({
                        value: cat.category_id,       // ensure numbers
                        label: cat.category_name
                      }))}
                      placeholder="Select Category"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Amount</label>
                    <input
                      type="number"
                      name="target_amount"
                      value={formData.target_amount}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#467D35] focus:border-[#467D35] dark:bg-gray-700 dark:text-gray-200"
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-[#AAD977] rounded-lg hover:bg-[#6d9140] transition flex items-center gap-2"
              >
                <FaCheck /> Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const BudgetCard = ({
  budget_id,
  budget_name,
  total_target,
  used,
  onEdit,
  onDelete
}) => {
  const targetAmount = Number(total_target) || 0;
  const usedAmount = Number(used) || 0;
  const remainingAmount = targetAmount - usedAmount;
  const percentageUsed = targetAmount > 0 ? Math.min((usedAmount / targetAmount) * 100, 100) : 0;
  const categoryName = budget_name?.toLowerCase() || '';
  const iconData = categoryIcons[categoryName] || categoryIcons.default;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition w-full">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full">
          <div className={`w-12 h-12 ${iconData.color} rounded-xl flex items-center justify-center text-xl`}>
            {iconData.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{budget_name}</h3>
            <div className="flex flex-wrap items-center gap-4 mt-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Target: <span className="font-medium dark:text-gray-300">R{targetAmount.toFixed(2)}</span></span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Used: <span className="font-medium dark:text-gray-300">R{usedAmount.toFixed(2)}</span></span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Remaining: <span className="font-medium dark:text-gray-300">R{remainingAmount.toFixed(2)}</span></span>
            </div>
            <div className="mt-3 w-full">
              <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${percentageUsed}%`,
                    background: 'linear-gradient(90deg, #5FBFFF 0%, #91BE59 100%)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onDelete}
            className="flex items-center gap-1 bg-red-100 text-red-400 px-4 py-1 rounded-full hover:bg-red-200"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const BudgetPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    budgetId: null,
    budgetName: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/budget/user/${userId}`);
      const result = await response.json();
      if (result.status === 'success') {
        const sortedBudgets = result.data.sort((a, b) => {
          const dateA = a?.created_at ? new Date(a.created_at) : new Date(0);
          const dateB = b?.created_at ? new Date(b.created_at) : new Date(0);
          return dateB - dateA;
        });
        setBudgets(sortedBudgets);
      } else {
        setError(result.message || 'Failed to fetch budgets');
      }
    } catch (err) {
      setError('Failed to fetch budgets');
      console.error('Error fetching budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBudgets = budgets.filter(budget => {
    if (!budget) return false;
    const name = budget.budget_name || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/budget/categories');
      const result = await response.json();
      if (result.status === 'success') {
        setCategories(result.data);
      } else {
        console.error('Failed to fetch categories:', result.message);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleCreate = () => { setIsCreating(true); setEditingId(null); };
  const handleEdit = (id) => { setEditingId(id); setIsCreating(false); };

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  const handleDeleteClick = (budget_id, budget_name) => {
    setDeleteConfirmation({ show: true, budgetId: budget_id, budgetName: budget_name });
  };

  const cancelDelete = () => setDeleteConfirmation({ show: false, budgetId: null, budgetName: '' });

  const confirmDelete = async () => {
    if (!deleteConfirmation.budgetId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/budget/${deleteConfirmation.budgetId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (result.status === 'success') {
        setBudgets(prev => prev.filter(b => b.budget_id !== deleteConfirmation.budgetId));
        toast.success('Budget deleted successfully');
      } else {
        setError(result.message || 'Failed to delete budget');
        toast.error(result.message || 'Failed to delete budget');
      }
    } catch (err) {
      setError('Failed to delete budget');
      toast.error('Failed to delete budget');
      console.error('Error deleting budget:', err);
    } finally {
      cancelDelete();
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingId) {
        const response = await fetch(`http://localhost:5000/api/budget/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            budget_name: formData.budget_name,
            user_id: userId
          }),
        });
        const result = await response.json();
        if (result.status === 'success') {
          setBudgets(prev =>
            prev.map(b => b.budget_id === editingId ? { ...b, budget_name: formData.budget_name } : b)
          );
          setEditingId(null);
          toast.success('Budget updated successfully');
        } else {
          setError(result.message || 'Failed to update budget');
        }
      } else {
        const response = await fetch('http://localhost:5000/api/budget', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            category_id: formData.category_id,
            allocations: [{
              category_id: formData.category_id,
              target_amount: formData.target_amount
            }]
          }),
        });
        const result = await response.json();
        if (result.status === 'success') {
          setBudgets(prev => [result.data, ...prev]);
          setIsCreating(false);
          toast.success('Budget created successfully');
        } else {
          setError(result.message || 'Failed to create budget');
        }
      }
    } catch (err) {
      setError('Failed to save budget');
      console.error('Error saving budget:', err);
    }
  };

  const handleCancel = () => { setEditingId(null); setIsCreating(false); };

  return (
    <AccountsLayout>
      <div className="p-6 w-full">
        <Toaster position="top-center" />

        {deleteConfirmation.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={cancelDelete} />
            <div
              className="relative z-10 w-[92%] max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <FaTrash />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Delete budget?
                </h3>
              </div>

              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                You're about to delete the budget for{' '}
                <span className="font-semibold">{deleteConfirmation.budgetName}</span>.
                This action cannot be undone.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 justify-end">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-full text-sm font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                >
                  Delete Budget
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Budget Management</h2>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#AAD977] text-white text-sm font-medium rounded-lg hover:bg-[#6d9140] transition shadow-sm"
          >
            <FaPlus /> Create Budget
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-500 dark:text-red-300 p-4 mb-6 rounded">
            <div className="flex items-center">
              <FaTimes className="mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center w-full px-4 py-2 border border-[#76B947] rounded-full bg-white shadow-sm dark:bg-gray-800">
            <FaSearch className="text-[#76B947] mr-2" />
            <input
              type="text"
              placeholder="Search your budgets..."
              className="w-full outline-none bg-transparent text-sm text-[#76B947] placeholder-[#76B947]/70"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {isCreating && (
            <BudgetForm
              onSave={handleSave}
              onCancel={handleCancel}
              categories={categories}
              isEdit={false}
            />
          )}

          {filteredBudgets.map((budget) => (
            editingId === budget.budget_id ? (
              <BudgetForm
                key={budget.budget_id}
                initialData={{ budget_name: budget.budget_name }}
                onSave={handleSave}
                onCancel={handleCancel}
                categories={categories.slice(0, 10)}
                isEdit={true}
              />
            ) : (
              <BudgetCard
                key={budget.budget_id}
                budget_id={budget.budget_id}
                budget_name={budget.budget_name}
                total_target={budget.total_target}
                used={budget.used}
                onEdit={() => handleEdit(budget.budget_id)}
                onDelete={() => handleDeleteClick(budget.budget_id, budget.budget_name)}
              />
            )
          ))}

          {budgets.length === 0 && !isCreating && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <FaWallet className="text-gray-400 dark:text-gray-500 text-3xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">No budgets yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first budget to start tracking your expenses</p>
              <button
                onClick={handleCreate}
                className="px-5 py-2.5 bg-[#AAD977] text-white rounded-lg hover:bg-[#6d9140] transition"
              >
                <FaPlus className="inline mr-2" /> Create Budget
              </button>
            </div>
          )}

          {budgets.length > 0 && filteredBudgets.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaSearch className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">No budgets found</h3>
              <p className="text-gray-500">Try adjusting your search term</p>
            </div>
          )}
        </div>
      </div>
    </AccountsLayout>
  );
};

export default BudgetPage;
