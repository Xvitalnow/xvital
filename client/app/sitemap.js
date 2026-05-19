export default function sitemap() {
  return [
    {
      url: "https://www.xvital.in",
      lastModified: new Date(),
      priority: 1,
    },

    {
      url: "https://www.xvital.in/diet",
      lastModified: new Date(),
      priority: 0.9,
    },

    {
      url: "https://www.xvital.in/products",
      lastModified: new Date(),
      priority: 0.8,
    },
  ];
}