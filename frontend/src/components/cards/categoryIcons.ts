import {
  FaUmbrellaBeach,
  FaDesktop,
  FaCameraRetro,
  FaMoneyBillWave,
  FaPiggyBank,
  FaCar,
  FaHeartbeat,
  FaUtensils,
  FaHome,
  FaBook,
  FaGift,
  FaChartLine,
  FaCoins,
  FaQuestion,
} from 'react-icons/fa';

export const categoryIconMap = {
  travel: FaUmbrellaBeach,
  tech: FaDesktop,
  photography: FaCameraRetro,
  income: FaMoneyBillWave,
  savings: FaPiggyBank,
  transport: FaCar,
  health: FaHeartbeat,
  food: FaUtensils,
  housing: FaHome,
  education: FaBook,
  gifts: FaGift,
  investment: FaChartLine,
  finance: FaCoins,
  default: FaQuestion,
};

export const categorize = (name: string): keyof typeof categoryIconMap => {
  const n = name.toLowerCase();

  if (n.includes('vacation') || n.includes('travel')) return 'travel';
  if (n.includes('pc') || n.includes('computer') || n.includes('tech')) return 'tech';
  if (n.includes('camera') || n.includes('photo')) return 'photography';
  if (n.includes('salary') || n.includes('bonus') || n.includes('income')) return 'income';
  if (n.includes('savings') || n.includes('deposit')) return 'savings';
  if (n.includes('fuel') || n.includes('transport') || n.includes('car')) return 'transport';
  if (n.includes('health') || n.includes('medical') || n.includes('fitness')) return 'health';
  if (n.includes('food') || n.includes('restaurant') || n.includes('groceries')) return 'food';
  if (n.includes('rent') || n.includes('mortgage') || n.includes('housing')) return 'housing';
  if (n.includes('education') || n.includes('school')) return 'education';
  if (n.includes('gift') || n.includes('charity')) return 'gifts';
  if (n.includes('investment') || n.includes('dividend') || n.includes('forex')) return 'investment';
  if (n.includes('fees') || n.includes('tax') || n.includes('loan')) return 'finance';

  return 'default';
};
