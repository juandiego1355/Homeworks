import { Song } from '../models/song.model';

export class Graph {
  private readonly adjacency = new Map<string, Set<string>>();
  private readonly songs = new Map<string, Song>();

  addVertex(song: Song): void {
    this.songs.set(song.id, song);
    if (!this.adjacency.has(song.id)) this.adjacency.set(song.id, new Set<string>());
  }

  addEdge(song1: Song, song2: Song): void {
    this.addVertex(song1);
    this.addVertex(song2);
    if (song1.id === song2.id) return;
    this.adjacency.get(song1.id)!.add(song2.id);
    this.adjacency.get(song2.id)!.add(song1.id);
  }

  getNeighbors(song: Song | string): Song[] {
    const id = typeof song === 'string' ? song : song.id;
    return [...(this.adjacency.get(id) ?? [])]
      .map((neighborId) => this.songs.get(neighborId))
      .filter((neighbor): neighbor is Song => neighbor !== undefined);
  }

  BFS(startSong: Song | string): Song[] {
    const startId = typeof startSong === 'string' ? startSong : startSong.id;
    if (!this.adjacency.has(startId)) return [];

    const visited = new Set<string>([startId]);
    const queue = [startId];
    const traversal: Song[] = [];
    let head = 0;

    while (head < queue.length) {
      const currentId = queue[head++];
      const currentSong = this.songs.get(currentId);
      if (currentSong) traversal.push(currentSong);

      for (const neighborId of this.adjacency.get(currentId) ?? []) {
        if (visited.has(neighborId)) continue;
        visited.add(neighborId);
        queue.push(neighborId);
      }
    }
    return traversal;
  }
}
