import { Component, EventEmitter, computed, inject, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MusicService } from '../../services/music.service';
import { Song } from '../../models/song.model';

@Component({
  selector: 'app-academic-panel',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="academic-section" id="structures">
      <div class="section-heading">
        <div><span class="eyebrow">LABORATORIO INTERACTIVO</span><h2>Estructuras de datos</h2></div>
        <span class="lab-badge"><i></i> En funcionamiento</span>
      </div>
      <p class="intro">Explora los algoritmos que hacen posible encontrar música, descubrir tendencias y conectar canciones similares.</p>

      <div class="structure-grid">
        <article class="structure-card trie-card">
          <div class="structure-title"><span class="structure-number">01</span><div><h3>Trie · Búsqueda predictiva</h3><p>Un árbol de prefijos para sugerir títulos en tiempo real.</p></div></div>
          <label class="field-label" for="trie-query">Escribe un prefijo</label>
          <input id="trie-query" class="lab-input" type="text" placeholder="Prueba con “au” o “mi”" [value]="prefix()" (input)="onPrefix($event)">
          <div class="suggestion-list">
            @for (title of suggestions(); track title) {
              <button class="suggestion" (click)="chooseTitle(title)"><span>♪</span>{{ title }}<b>↗</b></button>
            } @empty {
              <span class="empty-note">{{ prefix() ? 'No hay títulos con ese prefijo.' : 'Las sugerencias aparecerán aquí.' }}</span>
            }
          </div>
          <div class="structure-foot"><span>Nodos terminales</span><strong>{{ music.songs().length }} canciones</strong></div>
        </article>

        <article class="structure-card heap-card">
          <div class="structure-title"><span class="structure-number">02</span><div><h3>Max Heap · Ranking</h3><p>La raíz siempre guarda la canción con más reproducciones.</p></div></div>
          <div class="heap-root"><span>RAÍZ DEL HEAP</span><strong>{{ heapTop()?.name || '—' }}</strong><small>{{ formatPlays(heapTop()?.plays || 0) }} reproducciones</small></div>
          <div class="heap-list">
            @for (song of heapSnapshot(); track song.id; let i = $index) {
              <button class="heap-row" [class.heap-selected]="song.id === selectedSong?.id" (click)="chooseSong(song)">
                <span class="heap-index">{{ i + 1 }}</span><span class="heap-name">{{ song.name }}</span><span class="heap-plays">{{ formatPlays(song.plays) }}</span>
              </button>
            } @empty { <span class="empty-note">El heap está vacío.</span> }
          </div>
          <button class="update-plays" (click)="addPlays()">+ Registrar 25.000 reproducciones en la seleccionada</button>
          <div class="structure-foot"><span>TOP 10 ordenado</span><strong>Máximo: {{ formatPlays(heapTop()?.plays || 0) }}</strong></div>
        </article>

        <article class="structure-card graph-card">
          <div class="structure-title"><span class="structure-number">03</span><div><h3>Grafo · Conexiones musicales</h3><p>BFS recorre canciones similares mediante listas de adyacencia.</p></div></div>
          <div class="graph-focus">
            <div class="graph-node focus-node"><span>●</span><strong>{{ selectedSong?.name || 'Selecciona una canción' }}</strong></div>
            <span class="graph-line"></span>
            <div class="neighbor-list">
              @for (song of neighbors(); track song.id) {
                <button class="graph-node" (click)="chooseSong(song)"><span>●</span><strong>{{ song.name }}</strong><small>{{ song.artist }}</small></button>
              } @empty { <span class="empty-note">Selecciona una canción para ver sus aristas.</span> }
            </div>
          </div>
          <div class="bfs-result"><span>RECORRIDO BFS</span><strong>{{ bfsCount() }} nodos visitados</strong></div>
          <div class="structure-foot"><span>Grafo no dirigido</span><strong>{{ music.songs().length }} vértices</strong></div>
        </article>
      </div>

      <form class="add-song-panel" (ngSubmit)="addSong()">
        <div class="add-song-heading">
          <div><span class="eyebrow">AMPLÍA LA BIBLIOTECA</span><h3>Insertar una canción</h3></div>
          <span class="add-song-count">{{ music.songs().length }} canciones</span>
        </div>
        <p>La canción se insertará en el Trie, el Max Heap y como vértice del grafo.</p>
        <div class="add-song-fields">
          <label>Título<input name="songName" [(ngModel)]="songName" placeholder="Nombre de la canción" required maxlength="80"></label>
          <label>Artista<input name="artist" [(ngModel)]="artist" placeholder="Nombre del artista" required maxlength="60"></label>
          <label>Género<input name="genre" [(ngModel)]="genre" placeholder="Indie pop" maxlength="40"></label>
          <label>Reproducciones<input name="plays" [(ngModel)]="plays" type="number" min="0" step="1" required></label>
          <label class="relation-field">Relacionar en el grafo
            <select name="relatedToId" [(ngModel)]="relatedToId">
              <option value="">Sin conexión inicial</option>
              @for (song of music.songs(); track song.id) {
                <option [value]="song.id">{{ song.name }} · {{ song.artist }}</option>
              }
            </select>
          </label>
          <button class="add-song-button" type="submit">＋ Agregar canción</button>
        </div>
        @if (addSongMessage()) {
          <p class="add-song-message" [class.error-message]="addSongError()" role="status">{{ addSongMessage() }}</p>
        }
      </form>
    </section>
  `,
  styleUrl: './academic-panel.scss',
})
export class AcademicPanelComponent {
  readonly music = inject(MusicService);
  @Input() selectedSong: Song | null = null;
  @Output() songSelected = new EventEmitter<Song>();
  readonly prefix = signal('');
  readonly suggestions = signal<string[]>([]);
  readonly heapSnapshot = computed(() => {
    this.music.songs();
    return this.music.heap.toArray();
  });
  readonly addSongMessage = signal('');
  readonly addSongError = signal(false);
  songName = '';
  artist = '';
  genre = '';
  plays = 0;
  relatedToId = '';

  heapTop(): Song | undefined {
    return this.heapSnapshot()[0];
  }

  neighbors(): Song[] {
    return this.selectedSong ? this.music.getNeighbors(this.selectedSong) : [];
  }

  bfsCount(): number {
    return this.selectedSong ? this.music.graph.BFS(this.selectedSong).length : 0;
  }

  onPrefix(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.prefix.set(value);
    this.suggestions.set(this.music.getSuggestions(value).slice(0, 7));
  }

  chooseTitle(title: string): void {
    const song = this.music.songs().find((item) => item.name === title);
    if (song) this.chooseSong(song);
  }

  chooseSong(song: Song): void {
    this.songSelected.emit(song);
  }

  addPlays(): void {
    const song = this.selectedSong;
    if (!song) return;
    this.music.updatePlays(song.id, song.plays + 25000);
  }

  addSong(): void {
    const name = this.songName.trim();
    const artist = this.artist.trim();
    const id = `${this.slug(name)}-${this.slug(artist)}`;
    const relatedSong = this.music.songs().find((song) => song.id === this.relatedToId);

    try {
      this.music.addSong(
        {
          id,
          name,
          artist,
          plays: Number(this.plays),
          genre: this.genre.trim() || 'Sin género',
          cover: relatedSong?.cover ?? this.music.songs()[0].cover,
        },
        this.relatedToId || undefined,
      );
      this.addSongError.set(false);
      this.addSongMessage.set(`“${name}” se agregó al Trie, al Max Heap y al grafo.`);
      this.songName = '';
      this.artist = '';
      this.genre = '';
      this.plays = 0;
    } catch (error) {
      this.addSongError.set(true);
      this.addSongMessage.set(error instanceof Error ? error.message : 'No se pudo agregar la canción.');
    }
  }

  formatPlays(plays: number): string {
    return new Intl.NumberFormat('es-CO').format(plays);
  }

  private slug(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'cancion';
  }
}
