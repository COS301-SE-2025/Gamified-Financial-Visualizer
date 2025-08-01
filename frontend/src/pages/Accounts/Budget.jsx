import React, { useState, useEffect } from 'react';
import AccountsLayout from './AccountsLayout';
import {
  FaEdit, FaTrash, FaUtensils, FaBus, FaBolt, FaFilm, FaHeartbeat,
  FaPlane, FaBook, FaLaptop, FaUser, FaHandsHelping, FaTshirt,
  FaDumbbell, FaMobileAlt, FaWifi, FaTv, FaHome, FaShieldAlt,
  FaGasPump, FaBuilding, FaUniversity, FaMoneyBillWave,
  FaPiggyBank, FaChartLine, FaChild, FaPaw, FaTools, FaWallet,
  FaCoins, FaExchangeAlt, FaPlus, FaTimes, FaCheck,
  FaSearch
} from 'react-icons/fa';

// Enhanced category icons with colors
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

const BudgetForm = ({
  initialData = { budget_name: '', category_id: '', target_amount: '' }, // Changed default target_amount to empty string
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-4 border border-gray-100">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 ${iconData.color} rounded-xl flex items-center justify-center text-xl`}>
            {iconData.icon}
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {isEdit ? (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget Name</label>
                  <input
                    type="text"
                    name="budget_name"
                    value={formData.budget_name}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg"
                    required
                    placeholder="Enter budget name"
                  />
                </div>
              ) : (
                <>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.category_id} value={cat.category_id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
                    <input
                      type="number"
                      name="target_amount"
                      value={formData.target_amount}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg"
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
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
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
  // Convert values to numbers and provide defaults if undefined
  const targetAmount = Number(total_target) || 0;
  const usedAmount = Number(used) || 0;
  const remainingAmount = targetAmount - usedAmount;

  const percentageUsed = targetAmount > 0 ? Math.min((usedAmount / targetAmount) * 100, 100) : 0;
  const categoryName = budget_name?.toLowerCase() || '';
  const iconData = categoryIcons[categoryName] || categoryIcons.default;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-4 border border-gray-100 hover:shadow-md transition w-full">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full">
          <div className={`w-12 h-12 ${iconData.color} rounded-xl flex items-center justify-center text-xl`}>
            {iconData.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">{budget_name}</h3>
            <div className="flex flex-wrap items-center gap-4 mt-1">
              <span className="text-sm text-gray-600">Target: <span className="font-medium">R{targetAmount.toFixed(2)}</span></span>
              <span className="text-sm text-gray-600">Used: <span className="font-medium">R{usedAmount.toFixed(2)}</span></span>
              <span className="text-sm text-gray-600">Remaining: <span className="font-medium">R{remainingAmount.toFixed(2)}</span></span>
            </div>

            <div className="mt-3 w-full">
              <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${percentageUsed}%`,
                    background: 'linear-gradient(90deg, #5FBFFF 0%, #91BE59 100%)'
                    // bg-gradient-to-r from-[#5FBFFF] to-[#7FDD53] 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Removing this feature for the time being */}
          {/* <button
            onClick={onEdit}
            className="flex items-center gap-1 bg-sky-100 text-sky-500 px-4 py-1 rounded-full hover:bg-sky-200"
          >
            <FaEdit /> Edit
          </button> */}
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

  const user = localStorage.getItem('user');
  const userId = user ? JSON.parse(user).id : null;

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/budget/user/${userId}`);
      const result = await response.json();

      if (result.status === 'success') {
        // Sort budgets by creation date (newest first)
        const sortedBudgets = result.data.sort((a, b) =>
          new Date(b.created_at || 0) - new Date(a.created_at || 0)
        );
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

  // Filter budgets based on search term
  const filteredBudgets = budgets.filter(budget =>
    budget.budget_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setIsCreating(false);
  };

  const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this budget?')) {
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/budget/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      // Remove the body since your backend likely doesn't need it for DELETE
    });

    const result = await response.json();

    if (result.status === 'success') {
      setBudgets(budgets.filter(budget => budget.budget_id !== id));
    } else {
      setError(result.message || 'Failed to delete budget');
    }
  } catch (err) {
    setError('Failed to delete budget');
    console.error('Error deleting budget:', err);
  }
};

  const handleSave = async (formData) => {
    try {
      if (editingId) {
        const response = await fetch(`http://localhost:5000/api/budget/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            budget_name: formData.budget_name,
            user_id: userId
          }),
        });

        const result = await response.json();

        if (result.status === 'success') {
          setBudgets(budgets.map(budget =>
            budget.budget_id === editingId
              ? { ...budget, budget_name: formData.budget_name }
              : budget
          ));
          setEditingId(null);
        } else {
          setError(result.message || 'Failed to update budget');
        }
      } else {
        const response = await fetch('http://localhost:5000/api/budget', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            category_id: formData.category_id,
            allocations: [
              {
                category_id: formData.category_id,
                target_amount: formData.target_amount
              }
            ]
          }),
        });

        const result = await response.json();

        if (result.status === 'success') {
          await fetchBudgets();
          setIsCreating(false);
        } else {
          setError(result.message || 'Failed to create budget');
        }
      }
    } catch (err) {
      setError('Failed to save budget');
      console.error('Error saving budget:', err);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
  };

  if (loading) {
    return (
      <AccountsLayout>
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#467D35]"></div>
        </div>
      </AccountsLayout>
    );
  }

  return (
    <AccountsLayout>
      <div className="p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Budget Management</h2>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#AAD977] text-white text-sm font-medium rounded-lg hover:bg-[#6d9140] transition shadow-sm"
          >
            <FaPlus /> Create Budget
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <FaTimes className="mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex items-center w-full px-4 py-2 border border-[#76B947] rounded-full bg-white shadow-sm">
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
                categories={categories}
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
                onDelete={() => handleDelete(budget.budget_id)}
              />
            )
          ))}

          {budgets.length === 0 && !isCreating && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaWallet className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">No budgets yet</h3>
              <p className="text-gray-500 mb-4">Create your first budget to start tracking your expenses</p>
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