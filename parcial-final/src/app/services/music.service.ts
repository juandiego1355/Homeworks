import { Injectable, signal } from '@angular/core';
import { SONGS } from '../data/songs';
import { Song } from '../models/song.model';
import { Graph } from '../structures/graph';
import { MaxHeap } from '../structures/max-heap';
import { Trie } from '../structures/trie';

@Injectable({ providedIn: 'root' })
export class MusicService {
  readonly songs = signal<Song[]>(SONGS.map((song) => ({ ...song })));
  readonly selectedSong = signal<Song>(this.songs()[0]);
  readonly trie = new Trie();
  readonly heap = new MaxHeap();
  readonly graph = new Graph();

  constructor() {
    for (const song of this.songs()) {
      this.trie.insert(song.name);
      this.heap.insert(song);
      this.graph.addVertex(song);
    }

    this.connectCluster(['aurora', 'evergreen', 'little-wonders', 'soft-focus']);
    this.connectCluster(['blue-hour', 'golden', 'moonflower']);
    this.connectCluster(['city-lights', 'halfway-home', 'slow-motion']);
    this.connectCluster(['dancing-alone', 'gravity', 'midnight-drive', 'stay-awake']);
    this.connectCluster(['echoes', 'into-the-blue', 'paper-skies']);
    this.connectCluster(['honey-moon', 'june-bloom', 'quiet-storm', 'wildflower']);

    this.connect('blue-hour', 'echoes');
    this.connect('aurora', 'honey-moon');
    this.connect('city-lights', 'midnight-drive');
    this.connect('golden', 'june-bloom');
  }

  getSuggestions(prefix: string): string[] {
    return prefix.trim() ? this.trie.getSuggestions(prefix) : [];
  }

  searchSongs(prefix: string): Song[] {
    return this.getSuggestions(prefix)
      .map((name) => this.songs().find((song) => song.name === name))
      .filter((song): song is Song => song !== undefined);
  }

  selectSong(song: Song): void {
    const currentSong = this.songs().find((item) => item.id === song.id);
    if (currentSong) this.selectedSong.set(currentSong);
  }

  getTopSongs(count = 10): Song[] {
    return this.heap.getTopK(count);
  }

  getRecommendations(song: Song, count = 6): Song[] {
    return this.graph.BFS(song).filter((related) => related.id !== song.id).slice(0, count);
  }

  getNeighbors(song: Song): Song[] {
    return this.graph.getNeighbors(song);
  }

  updatePlays(songId: string, plays: number): void {
    if (!this.heap.updatePlays(songId, plays)) {
      throw new Error('No se pudo actualizar la reproducción de la canción.');
    }

    const updatedSongs = this.songs().map((song) =>
      song.id === songId ? { ...song, plays } : song,
    );
    this.songs.set(updatedSongs);
    const updatedSong = updatedSongs.find((song) => song.id === songId);
    if (updatedSong) this.graph.addVertex(updatedSong);
    if (this.selectedSong().id === songId && updatedSong) this.selectedSong.set(updatedSong);
  }

  addSong(song: Song, relatedToId?: string): void {
    const normalizedName = this.normalizeTitle(song.name);
    if (!normalizedName || !song.artist.trim()) {
      throw new Error('El título y el artista son obligatorios.');
    }
    if (!Number.isFinite(song.plays) || song.plays < 0) {
      throw new Error('Las reproducciones deben ser un número igual o mayor que cero.');
    }
    if (this.songs().some((existing) => this.normalizeTitle(existing.name) === normalizedName)) {
      throw new Error('Ya existe una canción con ese título.');
    }
    if (this.songs().some((existing) => existing.id === song.id)) {
      throw new Error('No se pudo crear un identificador único para la canción.');
    }
    const relatedSong = relatedToId
      ? this.songs().find((existing) => existing.id === relatedToId)
      : undefined;
    if (relatedToId && !relatedSong) {
      throw new Error('La canción relacionada ya no está disponible.');
    }

    const addedSong = { ...song, name: song.name.trim(), artist: song.artist.trim() };
    this.trie.insert(addedSong.name);
    this.heap.insert(addedSong);
    this.graph.addVertex(addedSong);
    if (relatedSong) this.graph.addEdge(addedSong, relatedSong);
    this.songs.update((songs) => [...songs, addedSong]);
  }

  private connectCluster(ids: string[]): void {
    for (let index = 1; index < ids.length; index++) {
      this.connect(ids[index - 1], ids[index]);
    }
    if (ids.length > 2) this.connect(ids[0], ids[2]);
  }

  private connect(firstId: string, secondId: string): void {
    const songs = this.songs();
    const first = songs.find((song) => song.id === firstId);
    const second = songs.find((song) => song.id === secondId);
    if (first && second) this.graph.addEdge(first, second);
  }

  private normalizeTitle(title: string): string {
    return title.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
  }
}
