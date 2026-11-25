import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  template: `
    <aside class="sidebar">
      <a class="brand" href="#home" (click)="navigate($event, 'home')">
        <span class="brand-mark">♫</span><span>spotify<span class="brand-edu">edu</span></span>
      </a>
      <nav class="main-nav" aria-label="Navegación principal">
        <button class="nav-link" [class.active]="activeSection === 'home'" (click)="navigateTo('home')"><span>⌂</span>Inicio</button>
        <button class="nav-link" [class.active]="activeSection === 'search'" (click)="navigateTo('search')"><span>⌕</span>Buscar</button>
        <button class="nav-link" [class.active]="activeSection === 'library'" (click)="navigateTo('library')"><span>▤</span>Tu biblioteca</button>
      </nav>
      <div class="sidebar-divider"></div>
      <button class="nav-link study-link" [class.active]="activeSection === 'structures'" (click)="navigateTo('structures')">
        <span class="study-icon">⌘</span>Estructuras de datos
      </button>
      <div class="sidebar-note">
        <span class="note-label">TU ESPACIO DE ESTUDIO</span>
        <p>Algoritmos que conectan cada canción.</p>
        <span class="note-dot"></span>
      </div>
      <div class="sidebar-bottom">
        <span class="online-dot"></span><span>Proyecto académico · EDD II</span>
      </div>
    </aside>
  `,
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  @Input() activeSection = 'home';
  @Output() sectionSelected = new EventEmitter<string>();

  navigate(event: Event, section: string): void {
    event.preventDefault();
    this.navigateTo(section);
  }

  navigateTo(section: string): void {
    this.sectionSelected.emit(section);
  }
}
