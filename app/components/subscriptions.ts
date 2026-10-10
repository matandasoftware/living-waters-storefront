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