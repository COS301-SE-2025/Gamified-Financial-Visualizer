import React, { useState } from 'react';
import AccountsLayout from './AccountsLayout';
import { 
  FaEdit, FaTrash, FaUtensils, FaBus, FaBolt, FaFilm, FaHeartbeat, 
  FaPlane, FaBook, FaLaptop, FaUser, FaHandsHelping, FaTshirt, 
  FaDumbbell, FaMobileAlt, FaWifi, FaTv, FaHome, FaCar, FaShieldAlt, 
  FaCalendarAlt, FaGasPump, FaBuilding, FaUniversity, FaMoneyBillWave, 
  FaPiggyBank, FaChartLine, FaChild, FaPaw, FaTools, FaWallet, 
  FaCoins, FaExchangeAlt, FaPlus, FaTimes, FaCheck 
} from 'react-icons/fa';

// Category icons mapping (same as before)
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

const initialBudgets = [
  { id: 1, category: 'Groceries', limit: 9000, used: 5000 },
  { id: 2, category: 'Transport', limit: 9000, used: 5000 },
  { id: 3, category: 'Entertainment', limit: 9000, used: 5000 },
];

const BudgetForm = ({ 
  initialData = { category: '', limit: 0, used: 0 }, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState(initialData);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'category' ? value : Number(value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl text-[#555]">
            {categoryIcons[formData.category.toLowerCase()] || categoryIcons.default}
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select Category</option>
                  {Object.keys(categoryIcons).map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Limit</label>
                <input
                  type="number"
                  name="limit"
                  value={formData.limit}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Used</label>
                <input
                  type="number"
                  name="used"
                  value={formData.used}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                  min="0"
                />
              </div>
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
  category, 
  limit, 
  used, 
  onEdit, 
  onDelete 
}) => {
  const percentageUsed = Math.min((used / limit) * 100, 100);
  const icon = categoryIcons[category.toLowerCase()] || categoryIcons.default;
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl text-[#555]">
          {icon}
        </div>
        <div>
          <h3 className="text-md font-semibold text-gray-800">{category}</h3>
          <p className="text-sm text-gray-500">
            Limit: {limit} &nbsp; Used: {used}
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
  const [budgets, setBudgets] = useState(initialBudgets);
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setIsCreating(false);
  };

  const handleDelete = (id) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
  };

  const handleSave = (formData) => {
    if (editingId) {
      // Update existing budget
      setBudgets(budgets.map(budget => 
        budget.id === editingId ? { ...budget, ...formData } : budget
      ));
      setEditingId(null);
    } else {
      // Add new budget
      const newBudget = {
        id: Date.now(), // Simple unique ID
        ...formData
      };
      setBudgets([...budgets, newBudget]);
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
  };

  const getBudgetById = (id) => {
    return budgets.find(budget => budget.id === id);
  };

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

        <div>
          {/* Create Form */}
          {isCreating && (
            <BudgetForm 
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}

          {/* Budget List */}
          {budgets.map((budget) => (
            editingId === budget.id ? (
              <BudgetForm
                key={budget.id}
                initialData={budget}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : (
              <BudgetCard
                key={budget.id}
                {...budget}
                onEdit={() => handleEdit(budget.id)}
                onDelete={() => handleDelete(budget.id)}
              />
            )
          ))}
        </div>
      </div>
    </AccountsLayout>
  );
};

export default BudgetPage;