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
  groceries: <FaUtensils />,
  transport: <FaBus />,
  fuel: <FaGasPump />,
  utilities: <FaBolt />,
  rent: <FaHome />,
  mortgage: <FaBuilding />,
  internet: <FaWifi />,
  phone: <FaMobileAlt />,
  insurance: <FaShieldAlt />,
  medical: <FaHeartbeat />,
  health: <FaHeartbeat />,
  fitness: <FaDumbbell />,
  education: <FaBook />,
  subscriptions: <FaTv />,
  entertainment: <FaFilm />,
  restaurants: <FaUtensils />,
  clothing: <FaTshirt />,
  'personal care': <FaUser />,
  gifts: <FaHandsHelping />,
  charity: <FaHandsHelping />,
  taxes: <FaMoneyBillWave />,
  savings: <FaPiggyBank />,
  investments: <FaChartLine />,
  'loan repayment': <FaUniversity />,
  debt: <FaMoneyBillWave />,
  travel: <FaPlane />,
  accommodation: <FaHome />,
  salary: <FaWallet />,
  freelance: <FaLaptop />,
  bonus: <FaCoins />,
  refund: <FaExchangeAlt />,
  'transfer in': <FaExchangeAlt />,
  'transfer out': <FaExchangeAlt />,
  'cash withdrawal': <FaMoneyBillWave />,
  'cash deposit': <FaMoneyBillWave />,
  'business income': <FaLaptop />,
  'business expense': <FaLaptop />,
  maintenance: <FaTools />,
  repairs: <FaTools />,
  childcare: <FaChild />,
  pets: <FaPaw />,
  'home improvement': <FaHome />,
  fees: <FaMoneyBillWave />,
  commissions: <FaCoins />,
  'interest income': <FaCoins />,
  dividends: <FaCoins />,
  'crypto purchase': <FaCoins />,
  'crypto sale': <FaCoins />,
  forex: <FaExchangeAlt />,
  'wallet top-up': <FaWallet />,
  'wallet withdrawal': <FaWallet />,
  default: <FaMoneyBillWave />
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

  const selectedCategory = categories.find(cat => cat.category_id === formData.category_id);
  const categoryName = selectedCategory?.category_name?.toLowerCase() || '';

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl text-[#555]">
            {categoryIcons[categoryName] || categoryIcons.default}
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-3 gap-4">
              {isEdit ? (
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Budget Name</label>
                  <input
                    type="text"
                    name="budget_name"
                    value={formData.budget_name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
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
          </div>
          <div className="flex gap-2">
            <button 
              type="submit" 
              className="flex items-center gap-1 bg-green-100 text-green-600 px-4 py-1 rounded-full hover:bg-green-200"
            >
              <FaCheck /> Save
            </button>
            <button 
              type="button" 
              onClick={onCancel}
              className="flex items-center gap-1 bg-gray-100 text-gray-600 px-4 py-1 rounded-full hover:bg-gray-200"
            >
              <FaTimes /> Cancel
            </button>
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
  const icon = categoryIcons[categoryName] || categoryIcons.default;
  
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
         body: JSON.stringify({
            user_id: userId
          }),
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
        // Update existing budget (name only)
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
        // Create new budget
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
            className="flex items-center gap-2 px-4 py-1 bg-[#D8F5C5] text-[#467D35] text-sm font-medium rounded-full hover:bg-[#c8ecb4] transition"
          >
            <FaPlus /> Create
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
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

          {/* Budget List */}
          {budgets.map((budget) => (
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
            <div className="text-center text-gray-500 py-8">
              No budgets created yet. Click "Create" to add your first budget.
            </div>
          )}
        </div>
      </div>
    </AccountsLayout>
  );
};

export default BudgetPage;
