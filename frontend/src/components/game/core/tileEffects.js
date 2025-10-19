// Lifted & centralized: tile + card effects used by MockGame & MockSimulation (CommonJS)
const { CURRENCY } = require('./rules');

function applyTileEffect(player, tile, allPlayers = []) {
  if (!tile || !tile.action) return { text: `Landed on ${tile?.label || 'unknown tile'}`, delta: 0 };
  const a = tile.action;

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

module.exports = { applyTileEffect, applyCardEffect };
