// Sztywna lista bestsellerów (SKU produktów). Na stronie głównej pokazywane w losowej kolejności.
export const BESTSELLER_SKUS = [
  "001", "002", "003", "005", "006", "007", "009", "049",
  "023", "024", "025", "017", "048", "031", "026", "045",
];

export const isBestseller = (product) => BESTSELLER_SKUS.includes(product?.sku);
