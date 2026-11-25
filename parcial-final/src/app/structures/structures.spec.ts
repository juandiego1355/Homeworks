import { Graph } from './graph';
import { MaxHeap } from './max-heap';
import { Trie } from './trie';
import { Song } from '../models/song.model';
import { MusicService } from '../services/music.service';

const song = (id: string, plays: number): Song => ({
  id,
  name: id,
  artist: 'Demo',
  plays,
  cover: '',
  genre: 'Demo',
});

describe('Trie', () => {
  it('finds complete titles and returns prefix suggestions without case sensitivity', () => {
    const trie = new Trie();
    trie.insert('Aurora');
    trie.insert('Árbol de luz');

    expect(trie.search('aurora')).toBe(true);
    expect(trie.search('aur')).toBe(false);
    expect(trie.startsWith('ar')).toBe(true);
    expect(trie.getSuggestions('AR')).toEqual(['Árbol de luz']);
    expect(trie.getSuggestions('z')).toEqual([]);
  });
});

describe('MaxHeap', () => {
  it('extracts maximum values and updates a song while preserving the heap', () => {
    const heap = new MaxHeap();
    heap.insert(song('uno', 10));
    heap.insert(song('dos', 30));
    heap.insert(song('tres', 20));

    expect(heap.peek()?.id).toBe('dos');
    expect(heap.getTopK(2).map((item) => item.plays)).toEqual([30, 20]);
    heap.updatePlays('uno', 40);
    expect(heap.extractMax()?.id).toBe('uno');
    expect(heap.extractMax()?.id).toBe('dos');
  });
});

describe('Graph', () => {
  it('creates undirected edges and traverses connected songs with BFS', () => {
    const graph = new Graph();
    const first = song('first', 1);
    const second = song('second', 2);
    const third = song('third', 3);
    graph.addEdge(first, second);
    graph.addEdge(second, third);

    expect(graph.getNeighbors(second).map((item) => item.id)).toEqual(['first', 'third']);
    expect(graph.getNeighbors(first).map((item) => item.id)).toEqual(['second']);
    expect(graph.BFS(first).map((item) => item.id)).toEqual(['first', 'second', 'third']);
  });
});

describe('MusicService song insertion', () => {
  it('inserts a song into the Trie, heap and graph and rejects duplicate titles', () => {
    const music = new MusicService();
    const addedSong = song('new-demo-song', 1_500_000);
    addedSong.name = 'New Demo Song';

    music.addSong(addedSong, 'aurora');

    expect(music.trie.search('new demo song')).toBe(true);
    expect(music.heap.peek()?.id).toBe(addedSong.id);
    expect(music.getNeighbors(addedSong).map((item) => item.id)).toContain('aurora');
    expect(music.songs().some((item) => item.id === addedSong.id)).toBe(true);
    expect(() => music.addSong({ ...addedSong, id: 'another-id' })).toThrow('Ya existe una canción');
    expect(music.songs().filter((item) => item.name === addedSong.name)).toHaveLength(1);
  });
});
