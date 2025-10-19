// Lifted & centralized: tile + card effects used by MockGame & MockSimulation (CommonJS)
const { CURRENCY } = require('./rules');

function applyTileEffect(player, tile, allPlayers = []) {
  if (!tile || !tile.action) return { text: `Landed on ${tile?.label || 'unknown tile'}`, delta: 0 };
  const a = tile.action;

  // Handle card drawing
  if (a.type === 'draw_chance' || a.type === 'draw_community') {
    const deck = a.type === 'draw_chance' ? 'chance' : 'community';
    const card = drawCard(deck);
    if (card) {
      player.cards.push(card);
      return { text: `Drew ${deck} card: ${card.title}`, delta: 0 };
    }
  }

  // Pay rent to owner if landing on their business
  if (tile.type === 'business' && tile.owner && tile.owner !== player.id) {
    const owner = allPlayers.find(p => p.id === tile.owner);
    if (owner && !owner.bankrupt) {
      const rent = tile.cost ? Math.floor(tile.cost * 0.1) : 500;
      if (player.cash >= rent) {
        player.cash -= rent;
        owner.cash += rent;
        return { text: `Paid ${CURRENCY}${rent.toLocaleString()} rent to ${owner.name} for ${tile.label}`, delta: -rent };
      }
      return { text: `Cannot afford rent for ${tile.label}`, delta: 0 };
    }
  }

  switch (a.type) {
    case 'earn': {
      const amount = a.amount ?? 0;
      player.cash += amount;
      return { text: `Earned ${CURRENCY}${amount.toLocaleString()}`, delta: amount };
    }
    case 'pay': {
      const amount = a.amount ?? 0;
      const canPay = Math.min(player.cash, amount);
      player.cash -= canPay;
      return { text: `Paid ${CURRENCY}${canPay.toLocaleString()}`, delta: -canPay };
    }
    case 'buy': {
      if (tile.type === 'business' && !tile.owner && player.cash >= (tile.cost || 0)) {
        player.cash -= tile.cost;
        tile.owner = player.id;
        player.assetsValue = (player.assetsValue || 0) + (tile.cost || 0);
        return { text: `Bought ${tile.label} for ${CURRENCY}${(tile.cost || 0).toLocaleString()}`, delta: -(tile.cost || 0) };
      }
      return { text: `Could not buy ${tile.label}`, delta: 0 };
    }
    case 'move':
      return { text: `Move ${a.spaces ?? 0} spaces`, delta: 0 };
    default:
      return { text: `Landed on ${tile.label}`, delta: 0 };
  }
}

function applyCardEffect(player, card, allPlayers = []) {
  if (!card) return { text: 'No card played', delta: 0 };

  switch (card.effect) {
    case 'earn': {
      const amt = card.amount ?? 0;
      player.cash += amt;
      return { text: `Card: ${card.title} - Earned ${CURRENCY}${amt.toLocaleString()}`, delta: amt };
    }
    case 'pay': {
      const amt = card.amount ?? 0;
      const paid = Math.min(player.cash, amt);
      player.cash -= paid;
      return { text: `Card: ${card.title} - Paid ${CURRENCY}${paid.toLocaleString()}`, delta: -paid };
    }
    case 'double_business':
      player.flags = { ...(player.flags || {}), doubleBusiness: 1 };
      return { text: `Card: ${card.title} - Business income doubled this round`, delta: 0 };
    case 'advance':
      player.flags = { ...(player.flags || {}), advanceSpaces: card.spaces || 0 };
      return { text: `Card: ${card.title} - Advance ${card.spaces || 0} spaces`, delta: 0 };
    case 'collect_from_players': {
      const each = card.amount ?? 0;
      let total = 0;
      allPlayers.forEach(p => {
        if (p.id !== player.id) {
          const give = Math.min(p.cash || 0, each);
          p.cash = (p.cash || 0) - give;
          total += give;
        }
      });
      player.cash += total;
      return { text: `Card: ${card.title} - Collected ${CURRENCY}${total.toLocaleString()} from other players`, delta: total };
    }
    default:
      return { text: `Card: ${card.title} played`, delta: 0 };
  }
}

// Helper function to draw cards
function drawCard(deckType) {
  const decks = {
    chance: [
      { id: 'chance1', title: 'Business Boom', desc: 'All your businesses earn double this round.', effect: 'double_business' },
      { id: 'chance2', title: 'Stock Windfall', desc: 'Your investments pay off. Collect R2,000.', effect: 'earn', amount: 2000 },
      { id: 'chance3', title: 'Tax Audit', desc: 'Pay R1,500 in unexpected taxes.', effect: 'pay', amount: 1500 },
    ],
    community: [
      { id: 'comm1', title: 'Birthday Gift', desc: 'Collect R500 from each player.', effect: 'collect_from_players', amount: 500 },
      { id: 'comm2', title: 'Charity Donation', desc: 'Pay R700 to charity.', effect: 'pay', amount: 700 },
    ],
  };

  const deck = decks[deckType];
  if (!deck || deck.length === 0) return null;

  return deck[Math.floor(Math.random() * deck.length)];
}

module.exports = { applyTileEffect, applyCardEffect };
