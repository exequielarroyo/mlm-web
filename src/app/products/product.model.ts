export interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
  sold: number;
  /** Optional discount percentage (0–100). */
  discount?: number;
}

/** Effective unit price after any discount. */
export function unitPrice(product: Product): number {
  return product.discount ? Math.round(product.price * (1 - product.discount / 100)) : product.price;
}

/** Formats a peso amount, e.g. 1299 -> "₱1,299". */
export function formatPeso(value: number): string {
  return '₱' + value.toLocaleString('en-PH');
}
