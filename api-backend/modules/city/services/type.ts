// modules/city/types.ts
export type Tone = 'pos' | 'neg' | 'warn';

export interface Effect {
  iconKey: string; // frontend maps iconKey -> <FaCoins/> etc.
  value: string;
  label: string;
  tone: Tone;
}

export interface Level {
  current: number;
  max: number;
}

export interface Headline {
  label: string;
  value: string;
  iconKey: string;
}

export interface Upgrade {
  label: string;
  coins: number;
  xp: number;
  cost: string;
}

export interface CTA {
  label: string;
  link: string;
}

export interface BuildingTooltip {
  id: string;               // e.g. "Building_E001"
  label: string;            // e.g. "Food Market"
  description: string;
  rating: number;           // 1..5
  level: Level;
  sizeLabel: string;        // e.g. "5×5"
  headline: Headline;
  effects: Effect[];
  upgrade: Upgrade;
  cta: CTA;
}

export interface StaticBindingMeta {
  id: string;
  label: string;
  description: string;
  rating: number;
  level: Level;
  sizeLabel: string;
  headline: Omit<Headline, 'value'> & { defaultValue?: string };
  upgrade: Upgrade;
  cta: CTA;
  // A list of effect shells (labels + icon/tone); values are filled by service
  effects: Array<Omit<Effect, 'value'>>;
  // What data this building needs (used by service to assemble queries)
  dataKeys: string[]; // e.g. ['spend_mtd:groceries', 'budget_mtd:groceries', ...]
}
