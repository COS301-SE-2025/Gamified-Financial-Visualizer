import React, { useState, useEffect } from 'react';
import AccountsLayout from './AccountsLayout';
import { 
  FaEdit, FaTrash, FaUtensils, FaBus, FaBolt, FaFilm, FaHeartbeat, 
  FaPlane, FaBook, FaLaptop, FaUser, FaHandsHelping, FaTshirt, 
  FaDumbbell, FaMobileAlt, FaWifi, FaTv, FaHome, FaCar, FaShieldAlt, 
  FaCalendarAlt, FaGasPump, FaBuilding, FaUniversity, FaMoneyBillWave, 
  FaPiggyBank, FaChartLine, FaChild, FaPaw, FaTools, FaWallet, 
  FaCoins, FaExchangeAlt, FaPlus, FaTimes, FaCheck 
} from 'react-icons/fa';

// Category icons mapping
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

const BudgetForm = ({ 
  initialData = { budget_name: '', category_id: '', target_amount: 0 }, 
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
      [name]: name === 'target_amount' || name === 'category_id' ? Number(value) : value
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
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Category</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
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
              )}
              {!isEdit && (
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Target Amount</label>
                  <input
                    type="number"
                    name="target_amount"
                    value={formData.target_amount}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
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
  const percentageUsed = total_target > 0 ? Math.min((used / total_target) * 100, 100) : 0;
  const categoryName = budget_name?.toLowerCase() || '';
  const icon = categoryIcons[categoryName] || categoryIcons.default;
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl text-[#555]">
          {icon}
        </div>
        <div>
          <h3 className="text-md font-semibold text-gray-800">{budget_name}</h3>
          <p className="text-sm text-gray-500">
            Target: {total_target} &nbsp; Used: {used}
          </p>

          {/* Styled gradient progress bar */}
          <div className="w-64 h-4 rounded-full bg-white border-2 border-pink-300 overflow-hidden mt-1">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"
              style={{ width: `${percentageUsed}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={onEdit}
          className="flex items-center gap-1 bg-blue-100 text-blue-600 px-4 py-1 rounded-full hover:bg-blue-200"
        >
          <FaEdit /> Edit
        </button>
        <button 
          onClick={onDelete}
          className="flex items-center gap-1 bg-red-100 text-red-600 px-4 py-1 rounded-full hover:bg-red-200"
        >
          <FaTrash /> Delete
        </button>
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
  
  // Replace with actual user ID from your auth context
  const userId = 1; // This should come from your authentication system
  
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
        setBudgets(result.data);
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
        body: JSON.stringify({ user_id: userId }),
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
        // Update existing budget (name only)
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
        // Create new budget
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
          await fetchBudgets(); // Refresh the budget list
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

  const getBudgetById = (id) => {
    return budgets.find(budget => budget.budget_id === id);
  };

  if (loading) {
    return (
      <AccountsLayout>
        <div className="bg-white p-6 rounded-3xl shadow-md">
          <div className="text-center">Loading budgets...</div>
        </div>
      </AccountsLayout>
    );
  }

  return (
    <AccountsLayout>
      <div className="bg-white p-6 rounded-3xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#336699]">Budget</h2>
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

        <div>
          {/* Create Form */}
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