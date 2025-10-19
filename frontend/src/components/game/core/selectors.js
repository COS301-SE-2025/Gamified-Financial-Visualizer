// Tiny pure getters (kept separate to avoid inline duplicates)
const calculateNet = (p) => (p.cash || 0) + (p.assetsValue || 0) - (p.loanBalance || 0);

module.exports = { calculateNet };