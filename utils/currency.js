export const CURRENCIES = [
  { code: "EUR", symbol: "€" },
  { code: "USD", symbol: "$" },
  { code: "GBP", symbol: "£" },
  { code: "CHF", symbol: "CHF" },
  { code: "SAR", symbol: "SAR" },
  { code: "AED", symbol: "AED" },
  { code: "EGP", symbol: "EGP" },
  { code: "SYP", symbol: "SYP" },
  { code: "LBP", symbol: "LBP" },
  { code: "KWD", symbol: "KWD" },
  { code: "QAR", symbol: "QAR" },
  { code: "BHD", symbol: "BHD" },
  { code: "OMR", symbol: "OMR" },
  { code: "UAH", symbol: "₴" },
  { code: "RUB", symbol: "₽" },
  { code: "PLN", symbol: "zł" },
];

export function getCurrencySymbol(code) {
  return CURRENCIES.find(c => c.code === code)?.symbol || "€";
}
