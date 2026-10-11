import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MENU_TREE, MenuNode } from '../../data/menu-tree';

@Component({
  selector: 'app-tree-exercise',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tree-exercise.component.html',
  styleUrl: './tree-exercise.component.css',
})
export class TreeExerciseComponent {
  readonly menuTree = MENU_TREE;
  readonly nodeCount = this.countNodes(MENU_TREE);

  private countNodes(nodes: MenuNode[]): number {
    return nodes.reduce(
      (total, node) => total + 1 + (node.children ? this.countNodes(node.children) : 0),
      0,
    );
  }
}
