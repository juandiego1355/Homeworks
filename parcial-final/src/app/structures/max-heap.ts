import { Song } from '../models/song.model';

export class MaxHeap {
  private readonly items: Song[] = [];

  insert(song: Song): void {
    this.items.push(song);
    this.heapifyUp(this.items.length - 1);
  }

  extractMax(): Song | undefined {
    if (this.items.length === 0) return undefined;
    if (this.items.length === 1) return this.items.pop();

    const maximum = this.items[0];
    this.items[0] = this.items.pop()!;
    this.heapifyDown(0);
    return maximum;
  }

  peek(): Song | undefined {
    return this.items[0];
  }

  heapifyUp(index: number): void {
    let current = index;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (this.items[parent].plays >= this.items[current].plays) break;
      [this.items[parent], this.items[current]] = [this.items[current], this.items[parent]];
      current = parent;
    }
  }

  heapifyDown(index: number): void {
    let current = index;
    while (true) {
      const left = current * 2 + 1;
      const right = left + 1;
      let largest = current;

      if (left < this.items.length && this.items[left].plays > this.items[largest].plays) {
        largest = left;
      }
      if (right < this.items.length && this.items[right].plays > this.items[largest].plays) {
        largest = right;
      }
      if (largest === current) return;

      [this.items[current], this.items[largest]] = [this.items[largest], this.items[current]];
      current = largest;
    }
  }

  getTopK(k: number): Song[] {
    const count = Math.max(0, Math.floor(k));
    const copy = new MaxHeap();
    for (const song of this.items) copy.insert(song);

    const top: Song[] = [];
    while (top.length < count) {
      const next = copy.extractMax();
      if (!next) break;
      top.push(next);
    }
    return top;
  }

  updatePlays(songId: string, plays: number): boolean {
    const index = this.items.findIndex((song) => song.id === songId);
    if (index < 0 || !Number.isFinite(plays) || plays < 0) return false;

    const previousPlays = this.items[index].plays;
    this.items[index] = { ...this.items[index], plays };
    if (plays > previousPlays) this.heapifyUp(index);
    else this.heapifyDown(index);
    return true;
  }

  toArray(): Song[] {
    return this.items.map((song) => ({ ...song }));
  }
}
