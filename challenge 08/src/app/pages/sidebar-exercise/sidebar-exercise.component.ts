import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MENU_TREE, MenuNode } from '../../data/menu-tree';

@Component({
  selector: 'app-sidebar-exercise',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-exercise.component.html',
  styleUrl: './sidebar-exercise.component.css',
})
export class SidebarExerciseComponent {
  readonly menuTree = MENU_TREE;
  readonly selectedNode = signal<MenuNode>(MENU_TREE[2].children![1].children![0]);

  selectNode(node: MenuNode): void {
    this.selectedNode.set(node);
  }
}
