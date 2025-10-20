// Proper ESM exports
export const CURRENCY = 'R';
export const PHASES = { LOBBY: 'lobby', PLAYING: 'playing', RESULTS: 'results' };

// Export functions from other files
export const calculateNet = (p) => (p.cash || 0) + (p.assetsValue || 0) - (p.loanBalance || 0);

// Re-export functions from tileEffects
export { applyTileEffect, applyCardEffect } from './tileEffects.jsx';

// Export the makeAIDecision function
export const makeAIDecision = (player, tile) => {
  if (!player || !tile) return 'pass';
};

// Define and export CARD_DECKS
export const CARD_DECKS = {
  chance: [
    { id: 'chance1', title: 'Business Boom', effect: 'double_business' },
  ],
  community: [
    { id: 'comm1', title: 'Neighborhood Support', effect: 'earn', amount: 1000 },
  ],
};
