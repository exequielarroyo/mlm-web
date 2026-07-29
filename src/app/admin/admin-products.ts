import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, AdminProduct } from './admin.service';
import { formatPeso } from '../products/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-bold dark:text-white">Product Management</h2>
      <button type="button" class="btn-primary" (click)="refresh()">Refresh</button>
    </div>

    @if (message()) {
      <p class="mb-4 text-sm text-primary">{{ message() }}</p>
    }

    <!-- Add/Edit Product -->
    <section class="rounded border border-line-light p-4 mb-8 bg-white dark:bg-gray-900">
      <h3 class="font-semibold dark:text-white mb-3">{{ draft().id ? 'Edit Product' : 'Add Product' }}</h3>
      <div class="grid gap-3 md:grid-cols-4">
        <input class="field-input" placeholder="Name" [(ngModel)]="draft().name" />
        <input class="field-input" placeholder="Image URL" [(ngModel)]="draft().imageUrl" />
        <input class="field-input" type="number" placeholder="Price" [(ngModel)]="draft().price" />
        <input class="field-input" type="number" placeholder="Discount %" [(ngModel)]="draft().discountPercent" />
      </div>
      <div class="flex gap-2 mt-3">
        <button type="button" class="btn-primary" (click)="save()">Save Product</button>
        @if (draft().id) {
          <button type="button" class="btn-secondary" (click)="cancelEdit()">Cancel</button>
        }
      </div>
    </section>

    <!-- Catalog Table -->
    <section class="mb-8 overflow-x-auto bg-white dark:bg-gray-900 rounded border border-line-light p-4">
      <h3 class="font-semibold dark:text-white mb-3">Catalog</h3>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b">
            <th class="p-2 text-left">Product</th>
            <th class="p-2 text-left">Price</th>
            <th class="p-2 text-left">Status</th>
            <th class="p-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (product of products(); track product.id) {
            <tr class="border-b border-line-light hover:bg-gray-50 dark:hover:bg-gray-800">
              <td class="p-2">{{ product.name }}</td>
              <td class="p-2">{{ formatPeso(product.price) }}</td>
              <td class="p-2">
                <span class="text-xs rounded px-2 py-0.5" 
                  [class.bg-green-100]="!product.isArchived" [class.text-green-700]="!product.isArchived" 
                  [class.bg-gray-100]="product.isArchived" [class.text-gray-500]="product.isArchived">
                  {{ product.isArchived ? 'Archived' : 'Active' }}
                </span>
              </td>
              <td class="p-2 text-right whitespace-nowrap">
                <button class="text-primary mr-3 hover:underline" (click)="edit(product)">Edit</button>
                @if (!product.isArchived) {
                  <button class="text-red-600 hover:underline" (click)="archive(product.id)">Archive</button>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminProducts {
  private readonly admin = inject(AdminService);

  protected readonly products = signal<AdminProduct[]>([]);
  protected readonly message = signal('');
  protected readonly formatPeso = formatPeso;
  protected readonly draft = signal<Partial<AdminProduct>>({ name: '', price: 0, discountPercent: null, imageUrl: '' });

  ngOnInit() {
    this.refresh();
  }

  protected refresh() {
    this.admin.products().subscribe({
      next: (x) => this.products.set(x),
      error: (err) => this.message.set('Unable to load products.')
    });
  }

  protected edit(product: AdminProduct) {
    this.draft.set({ ...product });
  }

  protected cancelEdit() {
    this.draft.set({ name: '', price: 0, discountPercent: null, imageUrl: '' });
  }

  protected save() {
    this.admin.saveProduct(this.draft()).subscribe({
      next: () => {
        this.draft.set({ name: '', price: 0, discountPercent: null, imageUrl: '' });
        this.message.set('Product saved.');
        this.refresh();
      },
      error: (err) => this.message.set('Unable to save product.')
    });
  }

  protected archive(id: string) {
    this.admin.archiveProduct(id).subscribe({
      next: () => {
        this.message.set('Product archived.');
        this.refresh();
      },
      error: (err) => this.message.set('Unable to archive product.')
    });
  }
}
