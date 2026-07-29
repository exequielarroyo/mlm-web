import { TestBed } from '@angular/core/testing';

import { ProductCard } from './product-card';
import { CartService } from '../cart/cart.service';
import { Product } from './product.model';

describe('ProductCard', () => {
  const product: Product = { id: '1', name: 'Test Product', price: 100, imageUrl: null, discountPercent: null };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ProductCard] }).compileComponents();
  });

  it('adds the product to the cart when the button is clicked', () => {
    const cart = TestBed.inject(CartService);
    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', product);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(cart.count()).toBe(1);
    expect(cart.items()[0].product.id).toBe('1');
  });
});
