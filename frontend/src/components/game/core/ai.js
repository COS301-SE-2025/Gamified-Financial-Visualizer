// Enhanced AI decision making
function makeAIDecision(player, tile, context = 'buy') {
  if (!player || !tile) return false;

  // Business purchase decisions
  if (context === 'buy' && tile.type === 'business' && !tile.owner) {
    const cost = tile.cost || 0;
    const cashAfterPurchase = player.cash - cost;
    
    // Only buy if:
    // 1. Can afford it
    // 2. Will have at least 2000 cash left
    // 3. It's a good deal (cost is reasonable compared to assets)
    if (player.cash >= cost && cashAfterPurchase >= 2000) {
      const affordabilityRatio = cost / player.cash;
      // More likely to buy cheaper properties
      if (affordabilityRatio < 0.4) return true;
      if (affordabilityRatio < 0.6 && Math.random() > 0.5) return true;
    }
  }

  // Card usage decisions
  if (context === 'use_card') {
    const goodCards = (player.cards || []).filter(c =>
      ['earn', 'double_business', 'advance'].includes(c.effect)
    );
    
    // Use cards when cash is low or when it provides significant advantage
    if (goodCards.length > 0) {
      if (player.cash < 3000) return true;
      if (player.cash < 5000 && Math.random() > 0.7) return true;
    }
  }

  return false;
}

module.exports = { makeAIDecision };