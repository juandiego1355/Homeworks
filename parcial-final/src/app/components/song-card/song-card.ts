import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Song } from '../../models/song.model';

@Component({
  selector: 'app-song-card',
  standalone: true,
  template: `
    <button class="song-card" (click)="selected.emit(song)" [attr.aria-label]="'Seleccionar ' + song.name">
      <span class="cover-wrap">
        <img [src]="song.cover" [alt]="'Portada de ' + song.name" loading="lazy">
        <span class="cover-play" aria-hidden="true">▶</span>
      </span>
      <span class="song-title">{{ song.name }}</span>
      <span class="song-artist">{{ song.artist }} · {{ song.genre }}</span>
    </button>
  `,
  styleUrl: './song-card.scss',
})
export class SongCardComponent {
  @Input({ required: true }) song!: Song;
  @Output() selected = new EventEmitter<Song>();
}
