import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProductCard } from '../products/product-card';
import { ProductService } from '../products/product.service';
import { Product } from '../products/product.model';
import { formatPeso } from '../products/product.model';

@Component({
  selector: 'app-home',
  imports: [ProductCard, RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './home.html',
})
export class Home {
  private readonly productService = inject(ProductService);
  protected readonly products = signal<Product[]>([]);
  protected readonly formatPeso = formatPeso;

  protected readonly plans = [
    {
      name: 'Starter',
      price: 500,
      tagline: 'Perfect for getting started',
      popular: false,
      features: [
        'Personal referral link',
        'Member product prices',
        'Direct referral bonus',
        'Downline view up to 3 levels',
      ],
    },
    {
      name: 'Business',
      price: 2000,
      tagline: 'Our most popular package',
      popular: true,
      features: [
        'Everything in Starter',
        'Higher commission rates',
        'Reseller starter kit',
        'Training & webinars',
        'Downline view up to 5 levels',
      ],
    },
    {
      name: 'Entrepreneur',
      price: 5000,
      tagline: 'For serious network builders',
      popular: false,
      features: [
        'Everything in Business',
        'Maximum commission tier',
        'Leadership overrides',
        'Exclusive rewards & incentives',
        'Dedicated mentor',
      ],
    },
  ];

  protected readonly earnModes = [
    {
      icon: 'fa-solid fa-store',
      title: 'Sell products',
      desc: 'List and resell products to your customers and earn from every sale.',
      link: '/register',
      cta: 'Start selling',
    },
    {
      icon: 'fa-solid fa-bag-shopping',
      title: 'Shop & save',
      desc: 'Buy at member prices and earn rewards on your own purchases.',
      link: '/register',
      cta: 'Become a member',
    },
    {
      icon: 'fa-solid fa-user-plus',
      title: 'Refer & earn',
      desc: 'Invite friends and earn commissions when they join and shop.',
      link: '/earn',
      cta: 'How referral pays',
    },
    {
      icon: 'fa-solid fa-sitemap',
      title: 'Build your network',
      desc: 'Grow a team and earn from your downline across multiple levels.',
      link: '/community',
      cta: 'Join the community',
    },
  ];

  ngOnInit() { this.productService.list().subscribe({ next: (products) => this.products.set(products) }); }
}
