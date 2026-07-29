import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';

import { CartService } from '../cart/cart.service';
import { Product, unitPrice, formatPeso } from './product.model';

@Component({
  selector: 'app-product-card',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './product-card.html',
})
export class ProductCard {
  private readonly cart = inject(CartService);

  readonly product = input.required<Product>();

  protected readonly unitPrice = unitPrice;
  protected readonly formatPeso = formatPeso;
  protected readonly placeholder = 'https://picsum.photos/seed/product/400';

  protected addToCart(): void {
    this.cart.add(this.product());
  }
}
