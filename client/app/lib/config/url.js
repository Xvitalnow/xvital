function getBackendURLOnTheBasisOfEnvironment() {
  if (process.env.NEXT_PUBLIC_IS_PRODUCTION === "true") {
    // In production environment, return the production backend URL
    const productionURL = process.env.NEXT_PUBLIC_BACKEND_URL_PRODUCTION;
    return productionURL;
  } else {
    // In development environment, return the development backend URL
    const developmentURL = process.env.NEXT_PUBLIC_BACKEND_URL_DEVELOPMENT;
    return developmentURL;
  }
}

export const BackendURL = getBackendURLOnTheBasisOfEnvironment();


// export const BackendURL = "https://studious-meme-69p55wgq659rc44vw-5000.app.github.dev/api";