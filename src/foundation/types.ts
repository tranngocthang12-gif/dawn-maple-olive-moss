export type EvidenceClass =
  | "fact"
  | "data"
  | "inference"
  | "hypothesis"
  | "forecast"
  | "unverified"
  | "insufficient";

export type SourceTier = "t1" | "t2" | "t3" | "t4" | "t5" | "none";

export type Claim = {
  id: string;
  text: string;
  klass: EvidenceClass;
  source: string;
  tier: SourceTier;
  asOf: string;
  unit: string;
  permitted: boolean;
};

export type ScenarioName = "bull" | "base" | "bear" | "tail";

export type Scenario = {
  name: ScenarioName;
  probability: number | null;
  returnPct: number | null;
  narrative: string;
  catalyst: string;
  revenue: string;
  margin: string;
  multiple: string;
  fairValue: string;
  risk: string;
};

export type KillCriterion = {
  id: string;
  text: string;
  threshold: string;
};

export type ConfidenceChecks = {
  independentSources: number;
  baseRateCited: boolean;
  contraryConsidered: boolean;
  notBecauseProse: boolean;
};

export type ThesisTexts = {
  business: string;
  industry: string;
  position: string;
  management: string;
  financialQuality: string;
  balanceSheet: string;
  cashFlow: string;
  capitalAllocation: string;
  growth: string;
  risks: string;
  macro: string;
  graph: string;
  suppliers: string;
  customers: string;
  weakSignals: string;
  marketBelieves: string;
  difference: string;
  valuation: string;
  portfolioImpact: string;
  bear: string;
  contrary: string;
  missing: string;
  invalidation: string;
};

export type ThesisStatus = "draft" | "ready" | "invalidated";

export type Thesis = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: ThesisStatus;
  security: string;
  venue: string;
  currency: string;
  horizon: string;
  texts: ThesisTexts;
  claims: Claim[];
  scenarios: Scenario[];
  kills: KillCriterion[];
  checks: ConfidenceChecks;
  ownerCapitalNote: string;
  ring: "" | "inner" | "outer";
  baseRateId: string;
  worldIds: string[];
};

export type PostMortemClass =
  | ""
  | "bad-data"
  | "bad-model"
  | "bad-assumptions"
  | "bad-execution"
  | "bad-sizing"
  | "bad-luck"
  | "mixed";

export type DecisionAction = "observe" | "pass" | "paper" | "hold" | "kill";

export type Amendment = { id: string; at: string; note: string };

export type Decision = {
  id: string;
  at: string;
  security: string;
  priceNote: string;
  action: DecisionAction;
  thesisId: string | null;
  thesisSnapshot: Thesis | null;
  expectedReturn: string;
  probabilityNote: string;
  risk: string;
  sizeNote: string;
  catalyst: string;
  invalidation: string;
  alternativeView: string;
  outcome: "" | "pending" | "process-good-outcome-good" | "process-good-outcome-bad" | "process-bad-outcome-good" | "process-bad-outcome-bad";
  postMortemClass: PostMortemClass;
  postMortemNote: string;
  override: boolean;
  overrideReason: string;
  voided: boolean;
  voidReason: string;
  amendments: Amendment[];
};

export type LedgerRow = {
  id: string;
  at: string;
  statement: string;
  priorPct: number;
  lr: number | null;
  posteriorPct: number | null;
  evidenceNote: string;
  klass: EvidenceClass;
  corrects: string;
};

export type Signoff = Record<string, boolean>;

export type Mandate = {
  locked: boolean;
  lockedAt: string;
  currency: string;
  horizon: string;
  universeInner: string;
  universeOuter: string;
  leverage: "none" | "capped";
  leverageNote: string;
  taxNote: string;
  liquidityNote: string;
  amendments: Amendment[];
};

export type WorldObs = {
  id: string;
  at: string;
  domain: string;
  name: string;
  geography: string;
  level: string;
  delta: string;
  acceleration: string;
  unit: string;
  source: string;
  tier: SourceTier;
  asOf: string;
  permitted: boolean;
  supersedes: string;
};

export type BaseRate = {
  id: string;
  at: string;
  name: string;
  event: string;
  rateNote: string;
  geography: string;
  period: string;
  source: string;
  tier: SourceTier;
  asOf: string;
  permitted: boolean;
  caveat: string;
  supersedes: string;
};
