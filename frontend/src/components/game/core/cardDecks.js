// Centralized card definitions used by Chance & Community draws
const CARD_DECKS = {
  chance: [
    { id: 'chance1', title: 'Business Boom', desc: 'All your businesses earn double this round.', effect: 'double_business' },
    { id: 'chance2', title: 'Stock Windfall', desc: 'Your investments pay off. Collect R2,000.', effect: 'earn', amount: 2000 },
    { id: 'chance3', title: 'Tax Audit', desc: 'Pay R1,500 in unexpected taxes.', effect: 'pay', amount: 1500 },
    { id: 'chance4', title: 'Lucky Break', desc: 'Advance 3 spaces.', effect: 'advance', spaces: 3 },
    { id: 'chance5', title: 'Market Crash', desc: 'Lose R1,000 from your assets.', effect: 'pay', amount: 1000 },
  ],
  community: [
    { id: 'comm1', title: 'Birthday Gift', desc: 'Collect R500 from each player.', effect: 'collect_from_players', amount: 500 },
    { id: 'comm2', title: 'Charity Donation', desc: 'Pay R700 to charity.', effect: 'pay', amount: 700 },
    { id: 'comm3', title: 'Neighborhood Support', desc: 'Collect R1,000 from the bank.', effect: 'earn', amount: 1000 },
  ],
};

module.exports = { CARD_DECKS };
