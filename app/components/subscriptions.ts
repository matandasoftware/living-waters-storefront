export type SubscriptionType = "fruit-veg" | "wellness";
export type SubscriptionPlan =
  | "weekly-seasonal"
  | "monthly-seasonal"
  | "custom-weekly"
  | "custom-monthly";

export const SUBSCRIPTION_TYPES = [
  {
    id: "fruit-veg" as SubscriptionType,
    name: "Fruit & Veg Box",
    description: "Fresh seasonal fruits and vegetables delivered to your door.",
  },
  {
    id: "wellness" as SubscriptionType,
    name: "Wellness Subscription",
    description: "Wellness products curated for healthy living.",
  },
];

export const PLAN_OPTIONS = [
  {
    id: "weekly-seasonal" as SubscriptionPlan,
    name: "Weekly Seasonal",
    description: "Receive a curated seasonal selection every week.",
  },
  {
    id: "monthly-seasonal" as SubscriptionPlan,
    name: "Monthly Seasonal",
    description: "Receive a larger curated seasonal selection once per month.",
  },
  {
    id: "custom-weekly" as SubscriptionPlan,
    name: "Custom Weekly",
    description: "Build a custom box renewed weekly.",
  },
  {
    id: "custom-monthly" as SubscriptionPlan,
    name: "Custom Monthly",
    description: "Build a custom box renewed monthly.",
  },
];

/**
 * PRICE MAP IN MINOR UNITS (cents)
 * R200 => 20000
 * R800 => 80000
 *
 * EDIT HERE WHEN FINAL PRICING IS READY
 */
export const PLAN_PRICING: Record<SubscriptionType, Record<SubscriptionPlan, number>> = {
  "fruit-veg": {
    "weekly-seasonal": 20000,
    "monthly-seasonal": 80000,
    "custom-weekly": 20000,
    "custom-monthly": 80000,
  },
  wellness: {
    "weekly-seasonal": 20000,
    "monthly-seasonal": 80000,
    "custom-weekly": 20000,
    "custom-monthly": 80000,
  },
};

/**
 * PAYSTACK PLAN CODES
 * Replace every value below with your real Paystack plan codes.
 */
export const PAYSTACK_PLAN_CODES: Record<
  SubscriptionType,
  Record<SubscriptionPlan, string>
> = {
  "fruit-veg": {
    "weekly-seasonal": "PLN_pl28f6rnyoa800g",
    "monthly-seasonal": "PLN_llnyn17ikdkhzd7",
    "custom-weekly": "PLN_vqm47ln24qs25so",
    "custom-monthly": "PLN_rvp9xane2v07sa4",
  },
  wellness: {
    "weekly-seasonal": "PLN_282hstun6lptwq1",
    "monthly-seasonal": "PLN_i5b8qu3ybivfc4z",
    "custom-weekly": "PLN_beugehkk1ye5hpy",
    "custom-monthly": "PLN_005smov41md6l2a",
  },
};