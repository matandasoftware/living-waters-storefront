export type SubscriptionType = "fruit-veg" | "wellness";
export type SubscriptionPlan = "weekly-seasonal" | "monthly-seasonal" | "customise";

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
    id: "customise" as SubscriptionPlan,
    name: "Customise",
    description: "Choose your preferences and we tailor your subscription.",
  },
];

/**
 * PRICE MAP (in kobo/cents, i.e. minor units)
 * 3999 => R39.99
 * 14999 => R149.99
 */
export const PLAN_PRICING: Record<SubscriptionType, Record<SubscriptionPlan, number>> = {
  "fruit-veg": {
    "weekly-seasonal": 3999,  // EDIT PRICE HERE
    "monthly-seasonal": 14999, // EDIT PRICE HERE
    customise: 0, // custom quote path
  },
  wellness: {
    "weekly-seasonal": 2999,   // EDIT PRICE HERE
    "monthly-seasonal": 10999, // EDIT PRICE HERE
    customise: 0, // custom quote path
  },
};

/**
 * HUMAN LABELS FOR PAYMENT/UX
 */
export const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  "weekly-seasonal": "Weekly Seasonal",
  "monthly-seasonal": "Monthly Seasonal",
  customise: "Customise",
};

/**
 * PAYSTACK PLAN CODES
 * IMPORTANT:
 * 1) Create plans in your Paystack dashboard for each recurring plan.
 * 2) Replace placeholders below with real plan_code values.
 * 3) Keep customise as null (manual quote path).
 */
export const PAYSTACK_PLAN_CODES: Record<
  SubscriptionType,
  Record<SubscriptionPlan, string | null>
> = {
  "fruit-veg": {
    "weekly-seasonal": "PLAN_FRUIT_VEG_WEEKLY",   // EDIT: real Paystack plan code
    "monthly-seasonal": "PLAN_FRUIT_VEG_MONTHLY", // EDIT: real Paystack plan code
    customise: null,
  },
  wellness: {
    "weekly-seasonal": "PLAN_WELLNESS_WEEKLY",    // EDIT: real Paystack plan code
    "monthly-seasonal": "PLAN_WELLNESS_MONTHLY",  // EDIT: real Paystack plan code
    customise: null,
  },
};