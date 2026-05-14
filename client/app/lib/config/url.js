function getBackendURLOnTheBasisOfEnvironment() {
  const proUrl= "https://xvital.render.com/api";
  const devUrl= "https://shiny-enigma-969r9vv6wj4wc7v4j-5000.app.github.dev/api";
  if (process.env.NEXT_PUBLIC_IS_PRODUCTION === "true") {
    // In production environment, return the production backend URL
    const productionURL = proUrl;
    return productionURL;
  } else {
    // In development environment, return the development backend URL
    const developmentURL = devUrl;
    return developmentURL;
  }
}

export const BackendURL = getBackendURLOnTheBasisOfEnvironment();


// export const BackendURL = "https://studious-meme-69p55wgq659rc44vw-5000.app.github.dev/api";