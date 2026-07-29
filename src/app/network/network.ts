import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgTemplateOutlet, DatePipe } from '@angular/common';

import { ReferralService } from '../referrals/referral.service';
import { BinaryService } from '../referrals/binary.service';
import { UserService } from '../users/user.service';
import { ReferralNode } from '../referrals/referral.model';
import { BinaryTree, BinaryPair, BinaryStats } from '../referrals/binary.model';
import { formatPeso } from '../products/product.model';
import { NodeCard } from './node-card';

export interface TreeNode {
  id: string;
  name: string;
  username: string | null;
  level: number;
  children: TreeNode[];
}

@Component({
  selector: 'app-network',
  imports: [NgTemplateOutlet, DatePipe, NodeCard],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './network.html',
})
export class Network {
  private readonly referralService = inject(ReferralService);
  private readonly binaryService = inject(BinaryService);
  private readonly userService = inject(UserService);

  protected readonly currentUser = this.userService.currentUser;
  protected readonly formatPeso = formatPeso;

  // Tab state
  protected readonly activeTab = signal<'unilevel' | 'binary'>('unilevel');

  // Unilevel data
  protected readonly tree = signal<TreeNode | null>(null);
  protected readonly totalCount = signal(0);
  protected readonly maxDepth = signal(0);

  // Binary data
  protected readonly binaryTree = signal<BinaryTree | null>(null);
  protected readonly binaryStats = signal<BinaryStats | null>(null);
  protected readonly binaryPairs = signal<BinaryPair[]>([]);

  ngOnInit() {
    this.referralService.downline().subscribe((d) => {
      this.totalCount.set(d.totalCount);
      this.maxDepth.set(d.maxDepth);
      this.tree.set(this.buildTree(d.members));
    });

    this.binaryService.tree().subscribe((t) => this.binaryTree.set(t));
    this.binaryService.stats().subscribe((s) => this.binaryStats.set(s));
    this.binaryService.pairs().subscribe((p) => this.binaryPairs.set(p));
  }

  protected switchTab(tab: 'unilevel' | 'binary') {
    this.activeTab.set(tab);
  }

  /** Turn the flat downline list (each with a sponsorId) into a tree rooted at the current user. */
  private buildTree(members: ReferralNode[]): TreeNode | null {
    const me = this.currentUser();
    if (!me) {
      return null;
    }

    const childrenBySponsor = new Map<string, ReferralNode[]>();
    for (const member of members) {
      const key = member.sponsorId ?? '';
      const list = childrenBySponsor.get(key) ?? [];
      list.push(member);
      childrenBySponsor.set(key, list);
    }

    const build = (id: string, name: string, username: string | null, level: number): TreeNode => ({
      id,
      name,
      username,
      level,
      children: (childrenBySponsor.get(id) ?? []).map((child) =>
        build(child.id, `${child.firstName} ${child.lastName}`, child.username, child.level),
      ),
    });

    return build(me.id, `${me.firstName} ${me.lastName}`, me.username, 0);
  }
}
