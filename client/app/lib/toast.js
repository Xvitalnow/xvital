let toastHandler;

export const registerToast = (fn) => {
  toastHandler = fn;
};

export const showToast = (text, type = "info") => {
  if (toastHandler) {
    toastHandler({ text, type });
  }
};

// 🔥 NEW: Promise-based toast
export const toastPromise = async (promise, messages) => {
  if (!toastHandler) return;

  // show loading first
  toastHandler({ text: messages.loading, type: "loading" });

  try {
    const result = await promise;

    toastHandler({ text: messages.success, type: "success" });

    return result;
  } catch (error) {
    toastHandler({
      text:
        messages.error ||
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong",
      type: "error",
    });

    throw error;
  }
};