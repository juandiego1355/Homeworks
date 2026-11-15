import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getTopKHeapArray, getTopKProducts, Product, ProductTrie } from './structures';

const STARTER_PRODUCTS: Product[] = [
  { name: 'Air Max', popularity: 90 },
  { name: 'Air Force', popularity: 95 },
  { name: 'Air Jordan', popularity: 85 },
  { name: 'Adidas Boost', popularity: 80 },
  { name: 'Adidas Samba', popularity: 88 },
  { name: 'New Balance 574', popularity: 76 },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="page-shell">
      <header class="topbar">
        <a class="brand" href="#" aria-label="Prisma, inicio">
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M16 3 28 25H4L16 3Z" />
              <path d="m16 3 1 22M4 25l12-9 12 9" />
              <circle cx="16" cy="3" r="2" />
              <circle cx="4" cy="25" r="2" />
              <circle cx="28" cy="25" r="2" />
            </svg>
          </span>
          <span>prisma<span class="brand-dot">.</span></span>
        </a>
        <span class="topbar-label"><i></i> BÚSQUEDA INTELIGENTE</span>
      </header>

      <section class="hero">
        <div>
          <p class="eyebrow"><span></span> ENCUENTRA LO QUE BUSCAS</p>
          <h1>Una buena búsqueda<br />empieza con <em>una letra.</em></h1>
          <p class="hero-copy">
            Escribe un prefijo. Nosotros encontramos coincidencias y ordenamos las más populares.
          </p>
        </div>
        <div class="hero-stat">
          <span>{{ products().length }}</span>
          <small>productos<br />en el catálogo</small>
        </div>
      </section>

      <section class="search-panel" aria-label="Buscador de productos">
        <div class="search-main">
          <label class="sr-only" for="product-search">Buscar por prefijo</label>
          <span class="search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 4.5 4.5" />
            </svg>
          </span>
          <input
            id="product-search"
            type="search"
            placeholder="Prueba con «air» o «adidas»"
            [ngModel]="query()"
            (ngModelChange)="query.set($event)"
            autocomplete="off"
          />
          @if (query()) {
            <button class="clear-search" type="button" (click)="query.set('')" aria-label="Limpiar búsqueda">
              ×
            </button>
          }
          <span class="search-shortcut">PREFIJO</span>
        </div>
        <div class="search-divider"></div>
        <div class="top-k-control">
          <label for="top-k">Mostrar top</label>
          <select id="top-k" [ngModel]="topK()" (ngModelChange)="topK.set(+$event)" name="topK">
            @for (count of topKOptions; track count) {
              <option [ngValue]="count">{{ count }}</option>
            }
          </select>
          <span>resultados</span>
        </div>
      </section>

      <section class="results-section" aria-live="polite">
        <div class="section-heading">
          <div>
            <p class="section-kicker">RESULTADOS</p>
            <h2>
              @if (query().trim()) {
                Coincidencias para <span>“{{ query().trim() }}”</span>
              } @else {
                Lo más popular
              }
            </h2>
          </div>
          <span class="result-count">
            {{ topResults().length }} <span>de {{ matchingProducts().length }}</span>
          </span>
        </div>

        @if (topResults().length > 0) {
          <div class="product-grid">
            @for (product of topResults(); track product.name; let index = $index) {
              <article class="product-card" [class.featured]="index === 0">
                <div class="product-visual" [class]="'product-visual tone-' + (index % 4)">
                  <span class="rank">0{{ index + 1 }}</span>
                  <svg viewBox="0 0 120 90" fill="none" aria-hidden="true">
                    <path d="M14 58c8-2 17-11 24-23l10-17c3-5 10-6 14-1l18 22 22 8c5 2 8 7 8 12v8H14c-6 0-8-7 0-9Z" />
                    <path d="M18 61h91M48 33l15 11m-21-3 15 11m-22-3 13 10" />
                    <path d="m79 39 15 6" />
                  </svg>
                  <span class="visual-shine"></span>
                </div>
                <div class="product-details">
                  <div class="product-title-row">
                    <h3>{{ product.name }}</h3>
                    <span class="popularity"><i></i>{{ product.popularity }}</span>
                  </div>
                  <div class="product-meta">
                    <span>Popularidad</span>
                    <div class="meter" role="meter" [attr.aria-valuenow]="product.popularity"
                      aria-valuemin="0" aria-valuemax="100" [attr.aria-label]="'Popularidad: ' + product.popularity + ' de 100'">
                      <span [style.width.%]="product.popularity"></span>
                    </div>
                  </div>
                </div>
              </article>
            }
          </div>
        } @else {
          <div class="empty-state">
            <span class="empty-icon">⌕</span>
            <strong>No encontramos ese prefijo</strong>
            <p>Prueba con otra búsqueda o añade el producto al catálogo.</p>
          </div>
        }
      </section>

      <section class="bottom-grid">
        <article class="structure-card trie-card">
          <div class="structure-heading">
            <span class="structure-icon trie-icon">T</span>
            <div>
              <p class="section-kicker">ESTRUCTURA 01</p>
              <h2>Trie de productos</h2>
            </div>
            <span class="complexity">BÚSQUEDA POR PREFIJO</span>
          </div>
          <p class="structure-copy">
            Cada letra recorre una rama. La palabra vive en el camino desde la raíz.
          </p>
          <div class="trie-path" aria-label="Ejemplo de recorrido Trie">
            <span class="root-node">raíz</span>
            @for (letter of triePath(); track $index) {
              <span class="path-edge"></span>
              <span class="letter-node" [class.path-active]="$last">{{ letter }}</span>
            } @empty {
              <span class="path-hint">Escribe arriba para recorrer el árbol</span>
            }
          </div>
          <div class="structure-foot">
            <span><i class="legend-dot"></i> {{ matchingProducts().length }} coincidencias del prefijo</span>
            <span>Tiempo: O(longitud del prefijo + coincidencias)</span>
          </div>
        </article>

        <article class="structure-card heap-card">
          <div class="structure-heading">
            <span class="structure-icon heap-icon">H</span>
            <div>
              <p class="section-kicker">ESTRUCTURA 02</p>
              <h2>Min-Heap de top K</h2>
            </div>
            <span class="complexity">K = {{ topK() }}</span>
          </div>
          <p class="structure-copy">
            Conservamos los mejores {{ topK() }}; el menos popular queda arriba para decidir el siguiente.
          </p>
          <div class="heap-array" aria-label="Elementos del heap">
            @for (product of heapValues(); track product.name; let index = $index) {
              <div class="heap-cell">
                <span class="heap-index">{{ index }}</span>
                <strong>{{ product.popularity }}</strong>
              </div>
            } @empty {
              <span class="heap-empty">Sin resultados para construir el heap</span>
            }
          </div>
          <div class="structure-foot">
            <span><i class="heap-legend"></i> Popularidad por producto</span>
            <span>Raíz: menor popularidad del top K</span>
          </div>
        </article>
      </section>

      <section class="catalog-section">
        <div class="section-heading catalog-heading">
          <div>
            <p class="section-kicker">TU INVENTARIO</p>
            <h2>Productos del catálogo</h2>
          </div>
          <span class="catalog-total">{{ products().length }} productos</span>
        </div>

        <div class="catalog-layout">
          <div class="catalog-list">
            @for (product of products(); track product.name) {
              <div class="catalog-row">
                <span class="catalog-thumb">{{ product.name.charAt(0).toUpperCase() }}</span>
                <strong>{{ product.name }}</strong>
                <span class="catalog-score">{{ product.popularity }} <i>popularidad</i></span>
              </div>
            } @empty {
              <p class="catalog-empty">Todavía no hay productos. Añade el primero.</p>
            }
          </div>

          <form class="add-form" (ngSubmit)="addProduct()" #productForm="ngForm">
            <div>
              <p class="section-kicker">AMPLÍA EL CATÁLOGO</p>
              <h3>Añadir producto</h3>
            </div>
            <label for="new-name">Nombre</label>
            <input id="new-name" name="newName" type="text" placeholder="Ej. Air Max Plus"
              [(ngModel)]="newName" required maxlength="60" />
            <label for="new-popularity">Popularidad <span>0–100</span></label>
            <input id="new-popularity" name="newPopularity" type="number" min="0" max="100" step="1"
              [(ngModel)]="newPopularity" required />
            @if (formError()) {
              <p class="form-error" role="alert">{{ formError() }}</p>
            }
            <button type="submit" [disabled]="productForm.invalid">
              <span>＋</span> Añadir al catálogo
            </button>
            <p class="form-note">Al añadirlo, el Trie se actualiza al instante.</p>
          </form>
        </div>
      </section>

      <footer class="page-footer">
        <span>PRISMA <b>.</b></span>
        <span>Un reto de estructuras de datos · Trie + Heap</span>
      </footer>
    </main>
  `,
  styleUrl: './app.scss',
})
export class App {
  readonly topKOptions = [1, 2, 3, 4, 5, 6, 8, 10];
  readonly query = signal('');
  readonly topK = signal(2);
  readonly products = signal<Product[]>([...STARTER_PRODUCTS]);
  readonly formError = signal('');
  readonly matchingProducts = computed(() => {
    this.products();
    return this.trie.search(this.query());
  });
  readonly heapValues = computed(() => getTopKHeapArray(this.matchingProducts(), this.topK()));
  readonly topResults = computed(() => getTopKProducts(this.matchingProducts(), this.topK()));
  readonly triePath = computed(() =>
    this.query().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLocaleLowerCase('es').split(''),
  );

  newName = '';
  newPopularity: number | null = 85;

  private readonly trie = new ProductTrie();

  constructor() {
    STARTER_PRODUCTS.forEach((product) => this.trie.insert(product));
  }

  addProduct(): void {
    const name = this.newName.trim();
    const popularity = Number(this.newPopularity);
    if (!name || !Number.isInteger(popularity) || popularity < 0 || popularity > 100) {
      this.formError.set('Escribe un nombre y una popularidad entera entre 0 y 100.');
      return;
    }
    if (this.products().some((product) => product.name.localeCompare(name, 'es', { sensitivity: 'base' }) === 0)) {
      this.formError.set('Ese producto ya está en el catálogo.');
      return;
    }

    const product = { name, popularity };
    this.trie.insert(product);
    this.products.update((products) => [...products, product]);
    this.newName = '';
    this.newPopularity = 85;
    this.formError.set('');
  }
}
