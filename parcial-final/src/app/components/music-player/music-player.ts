import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Song } from '../../models/song.model';

@Component({
  selector: 'app-music-player',
  standalone: true,
  template: `
    <footer class="player">
      <div class="now-playing">
        <img [src]="song.cover" [alt]="'Portada de ' + song.name">
        <div class="track-meta"><strong>{{ song.name }}</strong><span>{{ song.artist }}</span></div>
        <button class="save-track" [class.saved]="isSaved()" [attr.aria-pressed]="isSaved()" [attr.aria-label]="isSaved() ? 'Quitar de tu biblioteca' : 'Guardar canción'" (click)="toggleSaved()">{{ isSaved() ? '♥' : '♡' }}</button>
      </div>
      <div class="playback">
        <div class="player-controls">
          <button aria-label="Canción anterior" title="Canción anterior" (click)="previous.emit()">|◀</button>
          <button class="play-button" aria-label="Audio de demostración no disponible" title="Audio de demostración no disponible" (click)="showAudioNotice()">▶</button>
          <button aria-label="Siguiente canción" title="Siguiente canción" (click)="next.emit()">▶|</button>
        </div>
        <div class="progress-row">
          <span>0:00</span><input type="range" min="0" max="100" value="0" disabled aria-label="Progreso de audio"><span>—:——</span>
        </div>
        <p class="audio-notice" aria-live="polite">{{ notice }}</p>
      </div>
      <div class="player-extras">
        <span class="device-icon">▣</span><span class="volume-icon">◖</span>
        <input type="range" min="0" max="100" value="65" disabled aria-label="Volumen">
      </div>
    </footer>
  `,
  styleUrl: './music-player.scss',
})
export class MusicPlayerComponent {
  @Input({ required: true }) song!: Song;
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  private readonly savedSongIds = new Set<string>();
  notice = '';

  isSaved(): boolean {
    return !!this.song && this.savedSongIds.has(this.song.id);
  }

  toggleSaved(): void {
    if (!this.song) return;
    if (this.isSaved()) this.savedSongIds.delete(this.song.id);
    else this.savedSongIds.add(this.song.id);
  }

  showAudioNotice(): void {
    this.notice = 'No hay audio de demostración disponible.';
  }
}
