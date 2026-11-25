import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Song } from '../../models/song.model';

@Component({
  selector: 'app-popular-songs',
  standalone: true,
  template: `
    <section class="popular-section">
      <div class="section-title">
        <div><span class="eyebrow">LO MÁS ESCUCHADO</span><h2>Éxitos de la comunidad</h2></div>
        <span class="section-caption">Actualizado desde el Max Heap</span>
      </div>
      <div class="ranking-table">
        <div class="ranking-head">
          <span>#</span><span>TÍTULO</span><span>GÉNERO</span><span>REPRODUCCIONES</span><span>♪</span>
        </div>
        @for (song of songs; track song.id; let i = $index) {
          <button
            class="ranking-row"
            [class.current]="selectedSongId === song.id"
            (click)="songSelected.emit(song)">
            <span class="rank-number">{{ (i + 1).toString().padStart(2, '0') }}</span>
            <span class="ranking-track">
              <img [src]="song.cover" [alt]="''" loading="lazy">
              <span><strong>{{ song.name }}</strong><small>{{ song.artist }}</small></span>
            </span>
            <span class="ranking-genre">{{ song.genre }}</span>
            <span class="ranking-plays">{{ formatPlays(song.plays) }}</span>
            <span class="row-arrow">↗</span>
          </button>
        }
      </div>
    </section>
  `,
  styleUrl: './popular-songs.scss',
})
export class PopularSongsComponent {
  @Input({ required: true }) songs: Song[] = [];
  @Input({ required: true }) selectedSongId = '';
  @Output() songSelected = new EventEmitter<Song>();

  formatPlays(plays: number): string {
    return new Intl.NumberFormat('es-CO').format(plays);
  }
}
