export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  discountPercent: number | null;
  isArchived?: boolean;
  createdAt?: string;
}

/** Effective unit price after any discount. */
export function unitPrice(product: Product): number {
  return product.discountPercent ? Math.round(product.price * (1 - product.discountPercent / 100)) : product.price;
}

/** Formats a peso amount, e.g. 1299 -> "₱1,299". */
export function formatPeso(value: number): string {
  return '₱' + value.toLocaleString('en-PH');
}
