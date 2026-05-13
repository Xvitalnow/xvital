export function calculateTotalScore(questions, answers, subAnswers) {
  let total = 0;
  let maxScore = 0;

  questions.forEach((question) => {
    // SINGLE SELECT
    if (question.type === "single-select") {
      const selectedValue = answers[question.key];
      const selectedOption = question.options?.find(
        (opt) => opt.value === selectedValue
      );

      if (selectedOption) {
        total += selectedOption.score || 0;
      }

      const highestOptionScore = Math.max(
        ...(question.options?.map((opt) => opt.score || 0) || [0])
      );
      maxScore += highestOptionScore;

      // SUB QUESTION
      if (selectedOption?.subQuestion) {
        const subQ = selectedOption.subQuestion;
        const subAnswer = subAnswers[subQ.key];

        if (subQ.type === "single-select") {
          const selectedSub = subQ.options?.find(
            (opt) => opt.value === subAnswer
          );

          if (selectedSub) total += selectedSub.score || 0;

          const highestSubScore = Math.max(
            ...(subQ.options?.map((opt) => opt.score || 0) || [0])
          );
          maxScore += highestSubScore;
        }

        if (subQ.type === "multi-select") {
          const selectedSubValues = Array.isArray(subAnswer) ? subAnswer : [];

          selectedSubValues.forEach((value) => {
            const matched = subQ.options?.find((opt) => opt.value === value);
            if (matched) total += matched.score || 0;
          });

          const highestSubScore = Math.max(
            ...(subQ.options?.map((opt) => opt.score || 0) || [0])
          );
          maxScore += highestSubScore;
        }
      }
    }

    // MULTI SELECT
    if (question.type === "multi-select") {
      const selectedValues = Array.isArray(answers[question.key])
        ? answers[question.key]
        : [];

      selectedValues.forEach((value) => {
        const matched = question.options?.find((opt) => opt.value === value);
        if (matched) total += matched.score || 0;
      });

      const highestOptionScore = Math.max(
        ...(question.options?.map((opt) => opt.score || 0) || [0])
      );
      maxScore += highestOptionScore;

      question.options?.forEach((option) => {
        if (
          selectedValues.includes(option.value) &&
          option.subQuestion &&
          subAnswers[option.subQuestion.key]
        ) {
          const subQ = option.subQuestion;
          const subAnswer = subAnswers[subQ.key];

          if (subQ.type === "single-select") {
            const selectedSub = subQ.options?.find(
              (opt) => opt.value === subAnswer
            );

            if (selectedSub) total += selectedSub.score || 0;

            const highestSubScore = Math.max(
              ...(subQ.options?.map((opt) => opt.score || 0) || [0])
            );
            maxScore += highestSubScore;
          }

          if (subQ.type === "multi-select") {
            const selectedSubValues = Array.isArray(subAnswer)
              ? subAnswer
              : [];

            selectedSubValues.forEach((value) => {
              const matched = subQ.options?.find((opt) => opt.value === value);
              if (matched) total += matched.score || 0;
            });

            const highestSubScore = Math.max(
              ...(subQ.options?.map((opt) => opt.score || 0) || [0])
            );
            maxScore += highestSubScore;
          }
        }
      });
    }
  });

  if (maxScore === 0) return 0;

  const normalizedScore = Math.round((total / maxScore) * 100);

  return Math.max(35, Math.min(normalizedScore, 95));
}

/* =======================================================
   MALE RESULT ENGINE
======================================================= */

export function getMaleResult(totalScore, answers, subAnswers) {
  const issues = [];
  const outcomes = [];

  let label = "Moderate imbalance";
  let message =
    "Your body is showing signs of imbalance that may be slowing your progress, recovery, and consistency.";

  if (totalScore >= 80) {
    label = "Good foundation, but needs optimization";
    message =
      "Your body has a decent foundation, but a few weak areas may be holding back better fat loss, muscle gain, energy, or performance.";
  } else if (totalScore < 60) {
    label = "High imbalance";
    message =
      "Your current body signals suggest deeper imbalance in metabolism, digestion, hormones, energy, or recovery patterns.";
  }

  // Carb response
  if (
    answers.carb_response === "very_sleepy" ||
    answers.carb_response === "hungry_again_quickly"
  ) {
    issues.push("Carb handling may need improvement");
    outcomes.push("Better energy stability");
    outcomes.push("Reduced unnecessary hunger");
  }

  // Protein response
  if (
    answers.protein_response === "bloating" ||
    answers.protein_response === "avoid_protein"
  ) {
    issues.push("Protein digestion may be inefficient");
    outcomes.push("Better digestion and recovery");
    outcomes.push("Improved muscle support");
  }

  // Energy crashes
  if (answers.energy_crashes === "yes") {
    issues.push("Energy regulation appears unstable");
    outcomes.push("More stable energy through the day");

    if (subAnswers.energy_crash_time === "after_meals") {
      issues.push("Meals may be causing energy dips");
    }

    if (subAnswers.energy_crash_time === "afternoon") {
      issues.push("Afternoon crash pattern is affecting productivity");
    }

    if (subAnswers.energy_crash_time === "evening") {
      issues.push("Late-day fatigue may be reducing consistency");
    }
  }

  // Digestion
  if (answers.digestive_issues === "yes") {
    issues.push("Digestive stress may be affecting results");
    outcomes.push("Less bloating and better gut comfort");

    const digestiveTypes = subAnswers.digestive_issue_types || [];

    if (digestiveTypes.includes("bloating")) {
      issues.push("Bloating may be reducing food tolerance");
    }

    if (digestiveTypes.includes("constipation")) {
      issues.push("Gut regularity may be slowing body function");
    }

    if (digestiveTypes.includes("gas")) {
      issues.push("Digestive discomfort may be affecting food quality");
    }
  }

  // Hormones
  if ((answers.hormonal_signals || []).length > 0) {
    issues.push("Hormonal stress signals are present");
    outcomes.push("Improved hormonal balance");
  }

  // Sleep
  if (
    answers.sleep_duration === "less_than_5" ||
    answers.sleep_duration === "5_6_hours"
  ) {
    issues.push("Sleep recovery is likely compromised");
    outcomes.push("Better recovery and muscle response");
  }

  // Stress
  if (
    answers.stress_level === "high" ||
    answers.stress_level === "very_high"
  ) {
    issues.push("Stress may be blocking physical progress");
    outcomes.push("Better mental sharpness");
  }

  // Movement
  if (
    answers.daily_routine === "mostly_sitting" ||
    answers.daily_routine === "moderate_movement"
  ) {
    issues.push("Daily movement may be too low for your goals");
    outcomes.push("Faster fat loss / body recomposition");
  }

  // New food section support
  if (
    (answers.food_region || []).includes("quick_meals") ||
    (answers.taste_preference || []).includes("sweet")
  ) {
    issues.push("Food choices may be reducing metabolic efficiency");
  }

  // Restrictions
  if (
    (answers.food_restrictions || []).includes("lactose") ||
    (answers.food_restrictions || []).includes("gluten")
  ) {
    issues.push("Food intolerance may be affecting digestion");
  }

  // House help logic
  if (
    answers.house_help === "no" &&
    subAnswers.meal_prep_time === "less_than_15"
  ) {
    issues.push("Limited prep time may affect consistency");
  }

  if (answers.budget_level === "medium") {
    issues.push("Budget constraints may limit consistency");
  }

  if (issues.length === 0) {
    issues.push("Your body is relatively balanced but lacks optimization");

    outcomes.push(
      "Better performance and strength gains",
      "More efficient fat loss and muscle growth",
      "Improved consistency in energy and recovery"
    );
  }

  return {
    label,
    issues: [...new Set(issues)].slice(0, 4),
    message,
    outcome: [...new Set(outcomes)].slice(0, 4),
  };
}

/* =======================================================
   FEMALE RESULT ENGINE
======================================================= */

export function getFemaleResult(totalScore, answers, subAnswers) {
  const issues = [];
  const outcomes = [];

  let label = "Your body is asking for support";
  let message =
    "Your responses suggest that your body may be dealing with internal stress, hormone-related imbalance, unstable energy, or recovery issues.";

  let reassurance =
    "The good news is that with the right nutrition, routine, and support, your body can improve significantly.";

  if (totalScore >= 80) {
    label = "Your body has a good foundation";
    message =
      "Your body seems to have a strong base, but a few hidden imbalances may still be affecting how you feel and progress.";
    reassurance =
      "With the right structure, your body can perform and feel even better.";
  } else if (totalScore < 60) {
    label = "Your body needs deeper support";
    message =
      "Your current answers suggest your body may be under more stress than it appears externally.";
  }

  outcomes.push(
    "Better hormonal balance",
    "Improved energy stability",
    "Better control over cravings",
    "Improved mood and mental clarity"
  );

  // Carb response
  if (
    answers.carb_response === "very_sleepy" ||
    answers.carb_response === "hungry_again"
  ) {
    issues.push("Blood sugar and carb response may be unstable");
  }

  // Digestion
  if (answers.digestive_issues === "yes") {
    issues.push("Digestive stress may be affecting your body");
  }

  // Periods
  if (answers.period_regularity === "irregular") {
    issues.push("Hormonal rhythm may be disrupted");
  }

  // Hormones
  if ((answers.hormonal_signals || []).length > 0) {
    issues.push("Hormonal balance may need extra support");
  }

  // Stress
  if (
    answers.stress_level === "high" ||
    answers.stress_level === "very_high"
  ) {
    issues.push("Stress may be impacting hormones and cravings");
  }

  // Emotional eating
  if (
    answers.emotional_eating === "frequently" ||
    answers.emotional_eating === "when_stressed"
  ) {
    issues.push("Emotional eating patterns may be affecting progress");
  }

  // New food section
  if (
    (answers.taste_preference || []).includes("sweet") ||
    (answers.food_region || []).includes("quick_meals")
  ) {
    issues.push("Food choices may be increasing cravings");
  }

  // House help
  if (
    answers.house_help === "no" &&
    subAnswers.meal_prep_time === "less_than_15"
  ) {
    issues.push("Limited prep time may reduce consistency");
  }

  // Fallback
  if (issues.length === 0) {
    issues.push(
      "Your body is relatively balanced but lacks optimization in key areas"
    );
  }

  return {
    label,
    issues: [...new Set(issues)].slice(0, 4),
    message,
    reassurance,
    outcome: [...new Set(outcomes)].slice(0, 4),
  };
}