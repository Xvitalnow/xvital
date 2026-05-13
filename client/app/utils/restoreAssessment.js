export const restoreAssessment = (data, router) => {
  try {
    if (!data || !router) {
      console.error("restoreAssessment: Missing data or router");
      return;
    }

    // Save selected gender
    if (data.gender) {
      localStorage.setItem("gender", data.gender);
    }

    // Save restored backend assessment
    localStorage.setItem("restoredAssessment", JSON.stringify(data));

    // Redirect to questionnaire page
    router.push("/questionnaire");
  } catch (error) {
    console.error("Failed to restore assessment:", error);
  }
};