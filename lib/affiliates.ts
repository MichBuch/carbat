// UK battery retailers with jump-off / price comparison links.
// IMPORTANT: Replace these with your actual affiliate tracking links (Awin, CJ, Amazon Associates, etc.)
// for monetization. Add UTM params as needed.

export interface Retailer {
  name: string;
  slug: string;
  baseSearch: string; // URL template, {query} will be replaced
  note?: string;
}

export const retailers: Retailer[] = [
  {
    name: "Tayna Batteries",
    slug: "tayna",
    baseSearch: "https://www.tayna.co.uk/search?q={query}",
    note: "Specialist — often best prices",
  },
  {
    name: "Battery Megastore",
    slug: "batterymegastore",
    baseSearch: "https://www.batterymegastore.co.uk/catalogsearch/result/?q={query}",
  },
  {
    name: "Halfords",
    slug: "halfords",
    baseSearch: "https://www.halfords.com/search?q={query}",
    note: "In-store fitting available",
  },
  {
    name: "Euro Car Parts",
    slug: "ecp",
    baseSearch: "https://www.eurocarparts.com/search?q={query}",
  },
  {
    name: "Amazon UK",
    slug: "amazon",
    baseSearch: "https://www.amazon.co.uk/s?k={query}&tag=REPLACE_WITH_YOUR_ASSOCIATE_TAG",
    note: "Fast delivery — add your Associates tag",
  },
  {
    name: "GS Yuasa",
    slug: "gsyuasa",
    baseSearch: "https://www.yuasabatteries.co.uk/?s={query}",
  },
];

export function buildRetailerLink(retailer: Retailer, batteryName: string, brand: string) {
  const query = encodeURIComponent(`${brand} ${batteryName} battery`);
  return retailer.baseSearch.replace("{query}", query);
}

// Helper to produce a small set of comparison links for a battery
export function getPriceComparisonLinks(brand: string, model: string, ah: number) {
  const nameForSearch = `${model} ${ah}Ah`;
  return retailers.map((r) => ({
    retailer: r.name,
    url: buildRetailerLink(r, nameForSearch, brand),
    note: r.note,
  }));
}
