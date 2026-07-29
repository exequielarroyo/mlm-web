import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProductCard } from '../products/product-card';
import { ProductService } from '../products/product.service';
import { Product } from '../products/product.model';

@Component({
  selector: 'app-search',
  imports: [ProductCard],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './search.html',
})
export class Search {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  protected readonly query = signal('');
  protected readonly results = signal<Product[]>([]);
  private readonly allProducts = signal<Product[]>([]);

  ngOnInit() {
    this.productService.list().subscribe((products) => {
      this.allProducts.set(products);
      this.filter(this.route.snapshot.queryParamMap.get('q') ?? '');
    });
    this.route.queryParamMap.subscribe((params) => {
      this.filter((params.get('q') ?? '').trim());
    });
  }

  private filter(q: string) {
    this.query.set(q);
    const needle = q.toLowerCase();
    this.results.set(
      q ? this.allProducts().filter((p) => p.name.toLowerCase().includes(needle)) : this.allProducts(),
    );
  }
}
