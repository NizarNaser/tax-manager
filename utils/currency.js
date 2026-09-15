export const CURRENCIES = [
  { code: "EUR", symbol: "€" },
  { code: "USD", symbol: "$" },
  { code: "GBP", symbol: "£" },
  { code: "CHF", symbol: "CHF" },
  { code: "SAR", symbol: "SAR" },
  { code: "AED", symbol: "AED" },
  { code: "EGP", symbol: "EGP" },
  { code: "UAH", symbol: "₴" },
  { code: "RUB", symbol: "₽" },
  { code: "PLN", symbol: "zł" },
];

export function getCurrencySymbol(code) {
  return CURRENCIES.find(c => c.code === code)?.symbol || "€";
}
