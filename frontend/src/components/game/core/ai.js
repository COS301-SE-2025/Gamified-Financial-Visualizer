// Simple AI decision used by mocked game/sim
function makeAIDecision(player, tile) {
  if (!player || !tile) return 'pass';

  if (tile.type === 'business' && !tile.owner && player.cash > (tile.cost || 0) * 1.5) {
    return 'buy';
  }
  const good = (player.cards || []).filter(c =>
    ['earn', 'double_business', 'advance'].includes(c.effect)
  );
  if (good.length > 0 && player.cash < 3000) return 'use_card';

  return 'pass';
}

module.exports = { makeAIDecision };
