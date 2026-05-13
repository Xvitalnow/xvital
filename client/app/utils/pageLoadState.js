let isFirstLoad = true;

export const getIsFirstLoad = () => isFirstLoad;

export const markPageLoaded = () => {
  isFirstLoad = false;
};