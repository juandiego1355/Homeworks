import { Component, computed, inject, signal } from '@angular/core';
import { AcademicPanelComponent } from './components/academic-panel/academic-panel';
import { MusicPlayerComponent } from './components/music-player/music-player';
import { PopularSongsComponent } from './components/popular-songs/popular-songs';
import { SearchBarComponent } from './components/search-bar/search-bar';
import { SidebarComponent } from './components/sidebar/sidebar';
import { SongCardComponent } from './components/song-card/song-card';
import { Song } from './models/song.model';
import { MusicService } from './services/music.service';

@Component({
  selector: 'app-root',
  imports: [
    AcademicPanelComponent,
    MusicPlayerComponent,
    PopularSongsComponent,
    SearchBarComponent,
    SidebarComponent,
    SongCardComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly music = inject(MusicService);
  readonly songs = this.music.songs;
  readonly selectedSong = this.music.selectedSong;
  readonly searchQuery = signal('');
  readonly searchResults = computed(() => this.music.searchSongs(this.searchQuery()));
  readonly topSongs = computed(() => {
    this.songs();
    return this.music.getTopSongs(10);
  });
  readonly recommendations = computed(() => {
    this.songs();
    return this.music.getRecommendations(this.selectedSong(), 6);
  });
  readonly activeSection = signal('home');

  selectSong(song: Song): void {
    this.music.selectSong(song);
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  navigateTo(section: string): void {
    this.activeSection.set(section);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (section === 'search') {
      window.setTimeout(() => document.querySelector<HTMLInputElement>('.search-wrap input')?.focus(), 350);
    }
  }

  changeSong(direction: -1 | 1): void {
    const allSongs = this.songs();
    const index = allSongs.findIndex((song) => song.id === this.selectedSong().id);
    const nextIndex = (index + direction + allSongs.length) % allSongs.length;
    this.selectSong(allSongs[nextIndex]);
  }

}
