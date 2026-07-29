import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { BinaryTreeNode } from '../referrals/binary.model';

@Component({
  selector: 'node-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="rounded border border-line-light bg-primary/5 p-2 min-w-[90px] text-center">
      <div class="font-medium text-xs truncate">{{ node().firstName }} {{ node().lastName }}</div>
      @if (node().username) {
        <div class="text-[10px] text-gray-400 truncate">&#64;{{ node().username }}</div>
      }
      <div class="flex justify-center gap-2 text-[10px] text-gray-500 mt-0.5">
        <span>L: {{ node().leftCount }}</span>
        <span>R: {{ node().rightCount }}</span>
      </div>
    </div>
  `,
})
export class NodeCard {
  readonly node = input.required<BinaryTreeNode>();
}
