const femaleQuestions = [
  {
    id: 1,
    scene: 1,
    key: "primary_goal",
    question: "What would you like to improve first?",
    type: "multi-select",
    transition: "next-question",
    afterText:
      "That makes sense. Many women go through this you’re not alone.",
    options: [
      { label: "Weight loss", value: "weight_loss", score: 2 },
      { label: "Lower belly fat", value: "lower_belly_fat", score: 2 },
      { label: "Weight gain", value: "weight_gain", score: 2 },
      { label: "Body toning", value: "body_toning", score: 3 },
      { label: "PCOS / hormonal balance", value: "pcos_hormonal_balance", score: 1 },
      { label: "Mental wellness", value: "mental_wellness", score: 1 },
      { label: "Thyroid issues", value: "thyroid_issues", score: 1 },
      { label: "Period issues", value: "period_issues", score: 1 },
      { label: "Digestion", value: "digestion", score: 1 },
      { label: "Skin / hair", value: "skin_hair", score: 2 },
      { label: "Low energy", value: "low_energy", score: 1 },
      { label: "Stress / emotional eating", value: "stress_emotional_eating", score: 1 },
      { label: "Sleep", value: "sleep", score: 2 },
      { label: "Post-pregnancy weight", value: "post_pregnancy_weight", score: 1 },
      { label: "Professional diet", value: "professional_diet", score: 3 },
    ],
  },

  {
    id: 2,
    scene: 2,
    key: "secondary_feelings",
    question: "What else would you like to feel better about?",
    type: "multi-select",
    transition: "swipe-left",
    afterText:
      "Got it. This helps us understand both your body and how you’ve been feeling.",
    options: [
      { label: "Cravings", value: "cravings", score: 2 },
      { label: "Digestion", value: "digestion", score: 3 },
      { label: "Sleep", value: "sleep", score: 3 },
      { label: "Energy", value: "energy", score: 3 },
      { label: "Hormones", value: "hormones", score: 2 },
      { label: "Mood", value: "mood", score: 2 },
      { label: "Stress", value: "stress", score: 3 },
      { label: "Skin", value: "skin", score: 3 },
    ],
  },

  {
    id: 3,
    scene: "3-4",
    key: "body_metrics",
    question: "Tell us your body metrics",
    type: "group",
    transition: "slide-up",
    afterText:
      "Perfect. This is your starting point we’ll take it step by step.",
    fields: [
      {
        key: "age",
        label: "Age",
        type: "number",
        placeholder: "Enter your age",
      },
      {
        key: "height_cm",
        label: "Height (cm)",
        type: "number",
        placeholder: "Enter your height in cm",
      },
      {
        key: "current_weight",
        label: "Current weight (kg)",
        type: "number",
        placeholder: "Enter your current weight",
      },
    ],
  },

  {
    id: 4,
    scene: 5,
    key: "target",
    question: "What is your target?",
    type: "single-select",
    transition: "swish",
    afterText: "Got it.",
    options: [
      { label: "Lose ___ kg", value: "lose_weight", score: 2, hasInput: true },
      { label: "Gain ___ kg", value: "gain_weight", score: 2, hasInput: true },
      { label: "Maintain weight", value: "maintain_weight", score: 3 },
      { label: "Reduce body size", value: "reduce_body_size", score: 2 },
    ],
  },
//  if user selects label normal after text should be Got it
  {
    id: 5,
    scene: 6,
    key: "carb_response",
    question: "After carbs, how do you feel?",
    type: "single-select",
    transition: "swipe-left",
    afterText:
      "Got it.",
    options: [
      { label: "Normal", value: "normal", score: 5 },
      { label: "Slightly sleepy", value: "slightly_sleepy", score: 3 },
      { label: "Very sleepy", value: "very_sleepy", score: 1 },
      { label: "Hungry again", value: "hungry_again", score: 1 },
    ],
  },

  {
    id: 6,
    scene: 7,
    key: "protein_response",
    question: "After protein, how do you feel?",
    type: "single-select",
    transition: "fade-slide",
    afterText:
      "Understood.",
    options: [
      { label: "Good", value: "good", score: 5 },
      { label: "Slight heaviness", value: "slight_heaviness", score: 3 },
      { label: "Bloating", value: "bloating", score: 1 },
      { label: "Avoid", value: "avoid", score: 1 },
    ],
  },

  {
    id: 7,
    scene: 8,
    key: "energy_crashes",
    question: "Energy crashes?",
    type: "single-select",
    transition: "swipe",
    afterText:
      "We’ll focus on bringing your energy back to a stable place.",
    options: [
      { label: "No", value: "no", score: 5 },
      {
        label: "Yes",
        value: "yes",
        score: 1,
        subQuestion: {
          key: "energy_crash_time",
          question: "When does it happen?",
          type: "single-select",
          options: [
            { label: "After meals", value: "after_meals", score: 1 },
            { label: "Afternoon", value: "afternoon", score: 2 },
            { label: "Evening", value: "evening", score: 2 },
          ],
        },
      },
    ],
  },

  {
    id: 8,
    scene: 9,
    key: "digestive_issues",
    question: "Digestive issues?",
    type: "single-select",
    transition: "soft-fade",
    afterText:
      "Digestive discomfort can be frustrating we’ll make this easier.",
    milestoneText: "You’re doing really well just a few more steps.",
    options: [
      { label: "No", value: "no", score: 5 },
      {
        label: "Yes",
        value: "yes",
        score: 1,
        subQuestion: {
          key: "digestive_issue_types",
          question: "What do you deal with?",
          type: "multi-select",
          options: [
            { label: "Bloating", value: "bloating", score: 1 },
            { label: "Gas", value: "gas", score: 1 },
            { label: "Constipation", value: "constipation", score: 1 },
          ],
        },
      },
    ],
  },

  {
    id: 9,
    scene: 10,
    key: "period_regularity",
    question: "Period regularity",
    type: "single-select",
    transition: "slide",
    afterText:
      "Thank you for sharing. We’ll support your hormones better.",
    options: [
      { label: "Regular", value: "regular", score: 5 },
      {
        label: "Irregular",
        value: "irregular",
        score: 1,
        subQuestion: {
          key: "period_irregularity_type",
          question: "What do you experience?",
          type: "multi-select",
          options: [
            { label: "Pain", value: "pain", score: 1 },
            { label: "Heavy", value: "heavy", score: 1 },
            { label: "PMS", value: "pms", score: 1 },
          ],
        },
      },
    ],
  },

  /* CLIENT UPDATED FOOD SECTION */

  {
    id: 10,
    scene: 11,
    key: "diet_type",
    question: "What is your diet type?",
    type: "single-select",
    transition: "swipe",
    afterText: "Got it.",
    options: [
      { label: "Vegetarian", value: "vegetarian", score: 5 },
      { label: "Eggetarian", value: "eggetarian", score: 5 },
      { label: "Non-vegetarian (chicken / fish / all)", value: "non_veg", score: 5 },
      { label: "Vegan", value: "vegan", score: 5 },
      { label: "Jain (no onion/garlic)", value: "jain", score: 5 },
    ],
  },

  {
    id: 11,
    scene: 12,
    key: "food_region",
    question: "Preferred cuisines",
    type: "multi-select",
    transition: "slide",
    afterText: "Perfect.",
    options: [
      { label: "North Indian", value: "north_indian", score: 5 },
      { label: "South Indian", value: "south_indian", score: 5 },
      { label: "Rajasthani / Gujarati", value: "rajasthani_gujarati", score: 5 },
      { label: "Continental", value: "continental", score: 5 },
      { label: "Asian (Chinese/Thai)", value: "asian", score: 4 },
      { label: "Fast food / Quick meals", value: "quick_meals", score: 2 },
      { label: "Cafe style", value: "cafe_style", score: 4 },
      { label: "Home cooked meals", value: "home_food", score: 5 },
    ],
  },

  {
    id: 12,
    scene: 13,
    key: "eating_pattern",
    question: "Staple preference (Primary carb base)",
    type: "single-select",
    transition: "fade",
    afterText: "Understood.",
    options: [
      { label: "Roti-based", value: "roti_based", score: 5 },
      { label: "Rice-based", value: "rice_based", score: 5 },
      { label: "Both", value: "both", score: 5 },
      { label: "Millet-based", value: "millet_based", score: 5 },
      { label: "Low-carb preference", value: "low_carb", score: 5 },
    ],
  },

  {
    id: 13,
    scene: 14,
    key: "protein_sources",
    question: "Protein sources you're comfortable eating",
    type: "multi-select",
    transition: "swipe",
    afterText: "Great.",
    options: [
      { label: "Paneer / curd / dairy", value: "dairy", score: 5 },
      { label: "Dal / legumes", value: "dal_legumes", score: 5 },
      { label: "Soy / tofu", value: "soy_tofu", score: 5 },
      { label: "Eggs", value: "eggs", score: 5 },
      { label: "Non-Veg sources", value: "non_veg_sources", score: 5 },
    ],
  },

  {
    id: 14,
    scene: 15,
    key: "taste_preference",
    question: "Taste preference",
    type: "multi-select",
    transition: "fade",
    afterText: "Nice.",
    options: [
      { label: "Spicy", value: "spicy", score: 5 },
      { label: "Mild", value: "mild", score: 5 },
      { label: "Sweet craving", value: "sweet", score: 3 },
      { label: "Salty / savory", value: "savory", score: 5 },
      { label: "Tangy / chatpata", value: "chatpata", score: 5 },
    ],
  },

  {
    id: 15,
    scene: 16,
    key: "hormonal_signals",
    question: "Do you have any of these?",
    type: "multi-select",
    transition: "swipe",
    afterText: "These are common hormonal signals.",
    options: [
      { label: "Low energy", value: "low_energy", score: 1 },
      { label: "Fat Accumulation", value: "fat_accumulation", score: 1 },
      { label: "Low and Depressed Mood", value: "low_depressed_mood", score: 1 },
      { label: "Poor muscle gain", value: "poor_muscle_gain", score: 1 },
      { label: "Sleepy All-day", value: "sleepy_all_day", score: 1 },
      {
        label: "Random sweating and heartbeat rising",
        value: "random_sweating_heartbeat_rising",
        score: 1,
      },
      { label: "Mood swings", value: "mood_swings", score: 1 },
      { label: "Hair thinning and Hair fall", value: "hair_thinning_hair_fall", score: 1 },
    ],
  },

  {
    id: 16,
    scene: 17,
    key: "food_dislikes",
    question: "Food dislikes (Important)",
    type: "textarea",
    transition: "fade",
    afterText: "Noted.",
    placeholder: "Example: karela, lauki, tinda...",
  },

  {
    id: 17,
    scene: 18,
    key: "yesterday_food",
    question: "What did you eat yesterday?",
    type: "textarea",
    transition: "fade",
    afterText: "This is really helpful.",
    placeholder: "Type your meals/snacks from yesterday",
  },

  {
    id: 18,
    scene: 19,
    key: "daily_routine",
    question: "Your daily workout routine",
    type: "single-select",
    transition: "slide",
    afterText: "We’ll align your plan with your day.",
    options: [
      { label: "Sitting", value: "sitting", score: 2 },
      { label: "Moderate", value: "moderate", score: 3 },
      { label: "Active", value: "active", score: 5 },
    ],
  },

  {
    id: 19,
    scene: 20,
    key: "sleep_duration",
    question: "Sleep duration",
    type: "single-select",
    transition: "swipe",
    afterText: "Your body resets here.",
    options: [
      { label: "Less than 5 hours", value: "less_than_5", score: 1 },
      { label: "5–6 hours", value: "5_6_hours", score: 2 },
      { label: "6–7 hours", value: "6_7_hours", score: 3 },
      { label: "7–8 hours", value: "7_8_hours", score: 5 },
    ],
  },

  {
    id: 20,
    scene: 21,
    key: "stress_level",
    question: "Stress level",
    type: "single-select",
    transition: "swipe",
    afterText: "Almost done.",
    options: [
      { label: "Low", value: "low", score: 5 },
      { label: "Moderate", value: "moderate", score: 3 },
      { label: "High", value: "high", score: 2 },
      { label: "Very high", value: "very_high", score: 1 },
    ],
  },

  {
    id: 21,
    scene: 22,
    key: "emotional_eating",
    question: "Emotional eating",
    type: "single-select",
    transition: "swipe",
    afterText: "We’ll manage this gently.",
    options: [
      { label: "Frequently", value: "frequently", score: 1 },
      { label: "Only during monthly cycle", value: "monthly_cycle_only", score: 2 },
      { label: "Only when stressed", value: "when_stressed", score: 2 },
      { label: "Rarely", value: "rarely", score: 3 },
    ],
  },

  {
    id: 22,
    scene: 23,
    key: "house_help",
    question: "Do you have house help?",
    type: "single-select",
    transition: "fade",
    afterText: "Understood.",
    options: [
      { label: "Yes", value: "yes", score: 5 },
      {
        label: "No",
        value: "no",
        score: 3,
        subQuestion: {
          key: "meal_prep_time",
          question: "How much time can you allot for meal prepping?",
          type: "single-select",
          options: [
            { label: "Less than 15 mins", value: "less_than_15", score: 1 },
            { label: "15–30 mins", value: "15_30_mins", score: 3 },
            { label: "30–60 mins", value: "30_60_mins", score: 4 },
            { label: "Flexible", value: "flexible", score: 5 },
          ],
        },
      },
    ],
  },

  {
    id: 23,
    scene: 24,
    key: "budget",
    question: "Budget",
    type: "single-select",
    transition: "quick-fade",
    afterText: "",
    options: [
      { label: "Medium", value: "medium", score: 3 },
      { label: "High", value: "high", score: 5 },
    ],
  },

  {
    id: 24,
    scene: 25,
    key: "food_restrictions",
    question: "Food restrictions or allergies",
    type: "textarea",
    transition: "loading",
    afterText: "Done. Analysing…",
    loadingTime: 1500,
    placeholder: "Type any food restrictions or allergies",
  },
];

export default femaleQuestions;