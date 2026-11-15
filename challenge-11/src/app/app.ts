import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  drag,
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  select,
} from 'd3';
import type {
  Simulation,
  SimulationLinkDatum,
  SimulationNodeDatum,
} from 'd3';

interface City {
  id: string;
  name: string;
}

interface Person {
  id: string;
  name: string;
  age: number;
  cityId: string;
}

type GraphNode = SimulationNodeDatum & {
  id: string;
  label: string;
  type: 'city' | 'person';
  age?: number;
};

type GraphLink = SimulationLinkDatum<GraphNode> & {
  source: string | GraphNode;
  target: string | GraphNode;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="app-shell">
      <header class="topbar">
        <a class="brand" href="#" aria-label="Nexo, inicio">
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M7 23.5 14.5 9l4.3 8.2L25 7.5" />
              <circle cx="7" cy="23.5" r="3" />
              <circle cx="14.5" cy="9" r="3" />
              <circle cx="18.8" cy="17.2" r="3" />
              <circle cx="25" cy="7.5" r="3" />
            </svg>
          </span>
          <span>nexo<span class="brand-dot">.</span></span>
        </a>
        <div class="topbar-note">
          <span class="live-dot"></span>
          Grafo actualizado en tiempo real
        </div>
      </header>

      <section class="intro">
        <div>
          <p class="eyebrow"><span class="eyebrow-line"></span> TU RED, DE UN VISTAZO</p>
          <h1>Personas y lugares,<br /><span>más cerca.</span></h1>
          <p class="intro-copy">
            Crea conexiones entre las personas y las ciudades que forman tu mundo.
          </p>
        </div>
        <div class="stats" aria-label="Resumen del grafo">
          <div class="stat">
            <span class="stat-number">{{ people().length }}</span>
            <span class="stat-label">personas</span>
          </div>
          <span class="stat-divider"></span>
          <div class="stat">
            <span class="stat-number">{{ cities().length }}</span>
            <span class="stat-label">ciudades</span>
          </div>
          <span class="stat-divider"></span>
          <div class="stat">
            <span class="stat-number">{{ people().length }}</span>
            <span class="stat-label">conexiones</span>
          </div>
        </div>
      </section>

      <section class="workspace" aria-label="Grafo de personas y ciudades">
        <div class="graph-card">
          <div class="card-heading graph-heading">
            <div>
              <p class="section-kicker">MAPA DE CONEXIONES</p>
              <h2>Tu grafo</h2>
            </div>
            <div class="legend" aria-label="Leyenda">
              <span><i class="legend-dot person-dot"></i> Persona</span>
              <span><i class="legend-dot city-dot"></i> Ciudad</span>
            </div>
          </div>
          <div class="graph-wrap">
            <svg
              #graphCanvas
              class="graph-canvas"
              role="img"
              aria-label="Grafo interactivo de personas conectadas a sus ciudades"
            ></svg>
            @if (people().length === 0) {
              <div class="graph-empty">
                <span class="empty-icon">✳</span>
                <strong>Tu grafo empieza aquí</strong>
                <span>Añade una persona para crear la primera conexión.</span>
              </div>
            }
          </div>
          <div class="graph-footer">
            <span><i class="hint-icon">↗</i> Arrastra los nodos para explorar</span>
            <span>Haz clic en una ciudad para filtrar</span>
          </div>
        </div>

        <aside class="side-column">
          <section class="form-card">
            <div class="card-heading compact-heading">
              <div>
                <p class="section-kicker">AMPLÍA TU RED</p>
                <h2>Añadir persona</h2>
              </div>
              <span class="heading-icon person-heading-icon" aria-hidden="true">＋</span>
            </div>
            <form (ngSubmit)="addPerson()" #personForm="ngForm">
              <label for="person-name">Nombre</label>
              <input
                id="person-name"
                name="personName"
                type="text"
                placeholder="Ej. Camila Torres"
                [(ngModel)]="personName"
                required
                maxlength="60"
              />
              <div class="field-row">
                <div>
                  <label for="person-age">Edad</label>
                  <input
                    id="person-age"
                    name="personAge"
                    type="number"
                    min="1"
                    max="120"
                    placeholder="28"
                    [(ngModel)]="personAge"
                    required
                  />
                </div>
                <div>
                  <label for="person-city">Ciudad</label>
                  <select
                    id="person-city"
                    name="personCity"
                    [(ngModel)]="personCityId"
                    required
                    [disabled]="cities().length === 0"
                  >
                    <option value="" disabled>Elige una ciudad</option>
                    @for (city of cities(); track city.id) {
                      <option [value]="city.id">{{ city.name }}</option>
                    }
                  </select>
                </div>
              </div>
              @if (personError()) {
                <p class="form-error" role="alert">{{ personError() }}</p>
              }
              <button
                class="primary-button"
                type="submit"
                [disabled]="personForm.invalid || cities().length === 0"
              >
                <span>＋</span> Añadir al grafo
              </button>
            </form>

            <div class="form-separator"></div>

            <div class="city-form-heading">
              <span class="mini-city-icon" aria-hidden="true">⌖</span>
              <div>
                <strong>¿Falta una ciudad?</strong>
                <span>Créala para conectar personas.</span>
              </div>
            </div>
            <form class="city-form" (ngSubmit)="addCity()" #cityForm="ngForm">
              <label class="sr-only" for="city-name">Nombre de la ciudad</label>
              <input
                id="city-name"
                name="cityName"
                type="text"
                placeholder="Nombre de la ciudad"
                [(ngModel)]="cityNameInput"
                required
                maxlength="60"
              />
              <button type="submit" [disabled]="cityForm.invalid" aria-label="Añadir ciudad">
                <span aria-hidden="true">＋</span>
              </button>
            </form>
            @if (cityMessage()) {
              <p class="form-feedback" role="status">{{ cityMessage() }}</p>
            }
          </section>

          <section class="people-card">
            <div class="card-heading compact-heading people-heading">
              <div>
                <p class="section-kicker">PERSONAS</p>
                <h2>{{ selectedCityName() }}</h2>
              </div>
              <span class="people-count">{{ peopleInSelectedCity().length }}</span>
            </div>
            <label class="sr-only" for="city-filter">Filtrar por ciudad</label>
            <select
              id="city-filter"
              class="city-filter"
              [ngModel]="selectedCityId()"
              (ngModelChange)="selectCity($event)"
              name="cityFilter"
            >
              <option value="all">Todas las ciudades</option>
              @for (city of cities(); track city.id) {
                <option [value]="city.id">{{ city.name }}</option>
              }
            </select>
            <div class="people-list">
              @for (person of peopleInSelectedCity(); track person.id) {
                <article class="person-row">
                  <span class="avatar">{{ initials(person.name) }}</span>
                  <span class="person-info">
                    <strong>{{ person.name }}</strong>
                    <span>{{ person.age }} años</span>
                  </span>
                  <span class="person-city">{{ cityName(person.cityId) }}</span>
                </article>
              } @empty {
                <div class="list-empty">
                  <span aria-hidden="true">○</span>
                  @if (people().length === 0) {
                    <p>Aún no hay personas.<br />Añade la primera arriba.</p>
                  } @else {
                    <p>No hay personas en esta ciudad todavía.</p>
                  }
                </div>
              }
            </div>
          </section>
        </aside>
      </section>
      <footer class="page-footer">
        <span>NEXO <span class="brand-dot">.</span></span>
        <span>Una pequeña red, un montón de historias.</span>
      </footer>
    </main>
  `,
})
export class App implements AfterViewInit, OnDestroy {
  @ViewChild('graphCanvas') private graphCanvas?: ElementRef<SVGSVGElement>;

  readonly cities = signal<City[]>([
    { id: 'city-1', name: 'Bogotá' },
    { id: 'city-2', name: 'Medellín' },
    { id: 'city-3', name: 'Cali' },
  ]);
  readonly people = signal<Person[]>([
    { id: 'person-1', name: 'Camila Torres', age: 28, cityId: 'city-1' },
    { id: 'person-2', name: 'Andrés Rojas', age: 34, cityId: 'city-1' },
    { id: 'person-3', name: 'Valentina Mora', age: 25, cityId: 'city-2' },
    { id: 'person-4', name: 'Santiago Gil', age: 31, cityId: 'city-2' },
    { id: 'person-5', name: 'Lucía Restrepo', age: 22, cityId: 'city-2' },
    { id: 'person-6', name: 'Mateo Cruz', age: 29, cityId: 'city-3' },
  ]);
  readonly selectedCityId = signal('all');
  readonly personError = signal('');
  readonly cityMessage = signal('');
  readonly peopleInSelectedCity = computed(() => {
    const cityId = this.selectedCityId();
    return cityId === 'all'
      ? this.people()
      : this.people().filter((person) => person.cityId === cityId);
  });
  readonly selectedCityName = computed(() => {
    const cityId = this.selectedCityId();
    if (cityId === 'all') return 'Todas las ciudades';
    return this.cities().find((city) => city.id === cityId)?.name ?? 'Ciudad';
  });

  personName = '';
  personAge: number | null = null;
  personCityId = 'city-1';
  cityNameInput = '';

  private simulation?: Simulation<GraphNode, undefined>;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.renderGraph();
    if (typeof ResizeObserver !== 'undefined' && this.graphCanvas) {
      this.resizeObserver = new ResizeObserver(() => this.renderGraph());
      this.resizeObserver.observe(this.graphCanvas.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.simulation?.stop();
  }

  addPerson(): void {
    const name = this.personName.trim();
    const age = Number(this.personAge);
    const cityId = this.personCityId;
    if (!name || !Number.isInteger(age) || age < 1 || age > 120 || !this.cities().some((city) => city.id === cityId)) {
      this.personError.set('Completa el nombre, una edad entre 1 y 120 y una ciudad válida.');
      return;
    }

    this.people.update((people) => [
      ...people,
      { id: crypto.randomUUID(), name, age, cityId },
    ]);
    this.personName = '';
    this.personAge = null;
    this.personError.set('');
    this.renderGraph();
  }

  addCity(): void {
    const name = this.cityNameInput.trim();
    if (!name) return;
    const existing = this.cities().find(
      (city) => city.name.localeCompare(name, 'es', { sensitivity: 'accent' }) === 0,
    );
    if (existing) {
      this.cityMessage.set(`${existing.name} ya está en tu grafo.`);
      this.selectCity(existing.id);
      return;
    }

    const city: City = { id: crypto.randomUUID(), name };
    this.cities.update((cities) => [...cities, city]);
    this.personCityId = city.id;
    this.cityNameInput = '';
    this.cityMessage.set(`${city.name} ya está lista para conectar personas.`);
    this.renderGraph();
  }

  selectCity(cityId: string): void {
    this.selectedCityId.set(cityId);
    this.renderGraph();
  }

  cityName(cityId: string): string {
    return this.cities().find((city) => city.id === cityId)?.name ?? 'Sin ciudad';
  }

  initials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toLocaleUpperCase('es'))
      .join('');
  }

  private renderGraph(): void {
    if (!this.graphCanvas) return;

    this.simulation?.stop();
    const svg = select(this.graphCanvas.nativeElement);
    svg.selectAll('*').remove();

    const width = Math.max(360, this.graphCanvas.nativeElement.clientWidth);
    const height = 460;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const nodes: GraphNode[] = [
      ...this.cities().map((city) => ({
        id: city.id,
        label: city.name,
        type: 'city' as const,
      })),
      ...this.people().map((person) => ({
        id: person.id,
        label: person.name,
        type: 'person' as const,
        age: person.age,
      })),
    ];
    const links: GraphLink[] = this.people().map((person) => ({
      source: person.id,
      target: person.cityId,
    }));

    const graph = svg.append('g');
    const linkLines = graph
      .append('g')
      .attr('class', 'graph-links')
      .selectAll<SVGLineElement, GraphLink>('line')
      .data(links)
      .join('line');

    this.simulation = forceSimulation<GraphNode>(nodes)
      .force(
        'link',
        forceLink<GraphNode, GraphLink>(links)
          .id((node) => node.id)
          .distance((link) => {
            const cityId = this.selectedCityId();
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            return cityId !== 'all' && targetId === cityId ? 105 : 125;
          })
          .strength(0.8),
      )
      .force('charge', forceManyBody<GraphNode>().strength(-340))
      .force('center', forceCenter(width / 2, height / 2))
      .force('collide', forceCollide<GraphNode>().radius((node) => node.type === 'city' ? 52 : 37))
      .alphaDecay(0.035);

    const nodeGroups = graph
      .append('g')
      .attr('class', 'graph-nodes')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(nodes)
      .join('g')
      .attr('class', (node) => `graph-node ${node.type}`)
      .attr('role', (node) => node.type === 'city' ? 'button' : 'img')
      .attr('tabindex', (node) => node.type === 'city' ? 0 : -1)
      .attr('aria-label', (node) =>
        node.type === 'city'
          ? `Filtrar por ${node.label}`
          : `${node.label}, ${node.age} años`,
      )
      .on('click', (_event, node) => {
        if (node.type === 'city') this.selectCity(node.id);
      })
      .on('keydown', (event: KeyboardEvent, node) => {
        if ((event.key === 'Enter' || event.key === ' ') && node.type === 'city') {
          event.preventDefault();
          this.selectCity(node.id);
        }
      });

    nodeGroups
      .append('title')
      .text((node) =>
        node.type === 'city' ? node.label : `${node.label}, ${node.age} años`,
      );

    nodeGroups
      .append('circle')
      .attr('r', (node) => node.type === 'city' ? 28 : 19)
      .attr('class', (node) => node.type === 'city' ? 'node-circle city-circle' : 'node-circle person-circle');

    nodeGroups
      .append('text')
      .attr('class', 'node-label')
      .attr('dy', (node) => node.type === 'city' ? 48 : 36)
      .text((node) => node.label);

    const simulation = this.simulation;
    const dragBehavior = drag<SVGGElement, GraphNode>()
      .on('start', (event, node) => {
        if (!event.active) simulation.alphaTarget(0.25).restart();
        node.fx = node.x ?? width / 2;
        node.fy = node.y ?? height / 2;
      })
      .on('drag', (event, node) => {
        node.fx = event.x;
        node.fy = event.y;
      })
      .on('end', (event, node) => {
        if (!event.active) simulation.alphaTarget(0);
        node.fx = null;
        node.fy = null;
      });
    nodeGroups.call(dragBehavior);

    this.simulation.on('tick', () => {
      linkLines
        .attr('x1', (link) => (typeof link.source === 'object' ? link.source.x ?? 0 : 0))
        .attr('y1', (link) => (typeof link.source === 'object' ? link.source.y ?? 0 : 0))
        .attr('x2', (link) => (typeof link.target === 'object' ? link.target.x ?? 0 : 0))
        .attr('y2', (link) => (typeof link.target === 'object' ? link.target.y ?? 0 : 0));
      nodeGroups.attr('transform', (node) => `translate(${node.x ?? 0},${node.y ?? 0})`);
    });
  }
}
