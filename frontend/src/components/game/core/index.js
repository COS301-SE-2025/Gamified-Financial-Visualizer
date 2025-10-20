// CommonJS barrel so Webpack doesn't choke on ESM here
const { CURRENCY, PHASES } = require('./rules');
const { calculateNet } = require('./selectors');
const { makeAIDecision } = require('./ai');
const { CARD_DECKS } = require('./cardDecks');
const { applyTileEffect, applyCardEffect } = require('./tileEffects');

module.exports = {
  CURRENCY,
  PHASES,
  calculateNet,
  makeAIDecision,
  CARD_DECKS,
  applyTileEffect,
  applyCardEffect,
};
