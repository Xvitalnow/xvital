export const startAssessment = (gender, router) => {
  try {
    if (!gender || !router) {
      console.error("startAssessment: Missing gender or router");
      return;
    }

    // Save selected gender
    localStorage.setItem("gender", gender);

    // Clear any old restored result
    localStorage.removeItem("restoredAssessment");

    // Redirect to questionnaire page
    router.push("/questionnaire");
  } catch (error) {
    console.error("Failed to start assessment:", error);
  }
};