import { Component, EventEmitter, Output, signal } from '@angular/core';
import { MusicService } from '../../services/music.service';
import { Song } from '../../models/song.model';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  template: `
    <div class="search-wrap">
      <span class="search-icon" aria-hidden="true">⌕</span>
      <input
        type="search"
        placeholder="¿Qué quieres escuchar?"
        aria-label="Buscar canciones"
        [value]="query()"
        (input)="onInput($event)"
        (keydown.escape)="closeResults()">
      @if (query().trim()) {
        <button class="clear-search" aria-label="Limpiar búsqueda" (click)="clear()">×</button>
      }
      @if (query().trim() && results().length) {
        <div class="search-results" role="listbox" aria-label="Sugerencias de canciones">
          @for (song of results(); track song.id) {
            <button class="search-result" role="option" (click)="choose(song)">
              <img [src]="song.cover" [alt]="''">
              <span><strong>{{ song.name }}</strong><small>{{ song.artist }}</small></span>
              <span class="result-arrow">↗</span>
            </button>
          }
        </div>
      } @else if (query().trim() && !results().length) {
        <div class="search-results empty-result">No encontramos canciones con ese prefijo.</div>
      }
    </div>
  `,
  styleUrl: './search-bar.scss',
})
export class SearchBarComponent {
  @Output() songSelected = new EventEmitter<Song>();
  @Output() queryChanged = new EventEmitter<string>();
  readonly query = signal('');
  readonly results = signal<Song[]>([]);

  constructor(private readonly music: MusicService) {}

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
    this.results.set(this.music.searchSongs(value));
    this.queryChanged.emit(value);
  }

  choose(song: Song): void {
    this.query.set(song.name);
    this.results.set([]);
    this.songSelected.emit(song);
  }

  clear(): void {
    this.query.set('');
    this.results.set([]);
    this.queryChanged.emit('');
  }

  closeResults(): void {
    this.results.set([]);
  }
}
