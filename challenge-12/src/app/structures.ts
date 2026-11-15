export interface Product {
  name: string;
  popularity: number;
}

class TrieNode {
  readonly children = new Map<string, TrieNode>();
  readonly products: Product[] = [];
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim();
}

export class ProductTrie {
  private readonly root = new TrieNode();

  insert(product: Product): void {
    let node = this.root;
    for (const character of normalize(product.name)) {
      let child = node.children.get(character);
      if (!child) {
        child = new TrieNode();
        node.children.set(character, child);
      }
      node = child;
    }
    node.products.push(product);
  }

  search(prefix: string): Product[] {
    let node = this.root;
    for (const character of normalize(prefix)) {
      const child = node.children.get(character);
      if (!child) return [];
      node = child;
    }

    const matches: Product[] = [];
    const collect = (current: TrieNode): void => {
      matches.push(...current.products);
      for (const child of current.children.values()) collect(child);
    };
    collect(node);
    return matches;
  }
}

export class ProductMinHeap {
  private readonly values: Product[] = [];

  get size(): number {
    return this.values.length;
  }

  peek(): Product | undefined {
    return this.values[0];
  }

  push(product: Product): void {
    this.values.push(product);
    this.percolateUp(this.values.length - 1);
  }

  pop(): Product | undefined {
    if (this.values.length === 0) return undefined;
    const minimum = this.values[0];
    const last = this.values.pop();
    if (this.values.length > 0 && last) {
      this.values[0] = last;
      this.percolateDown(0);
    }
    return minimum;
  }

  toArray(): Product[] {
    return [...this.values];
  }

  private percolateUp(index: number): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (!isLowerRank(this.values[index], this.values[parent])) return;
      [this.values[index], this.values[parent]] = [this.values[parent], this.values[index]];
      index = parent;
    }
  }

  private percolateDown(index: number): void {
    while (true) {
      const left = index * 2 + 1;
      const right = left + 1;
      let smallest = index;
      if (left < this.values.length && isLowerRank(this.values[left], this.values[smallest])) {
        smallest = left;
      }
      if (right < this.values.length && isLowerRank(this.values[right], this.values[smallest])) {
        smallest = right;
      }
      if (smallest === index) return;
      [this.values[index], this.values[smallest]] = [this.values[smallest], this.values[index]];
      index = smallest;
    }
  }
}

function isLowerRank(left: Product, right: Product): boolean {
  if (left.popularity !== right.popularity) return left.popularity < right.popularity;
  return left.name.localeCompare(right.name, 'es') > 0;
}

function isHigherRank(left: Product, right: Product): boolean {
  if (left.popularity !== right.popularity) return left.popularity > right.popularity;
  return left.name.localeCompare(right.name, 'es') < 0;
}

export function getTopKHeapArray(products: Product[], count: number): Product[] {
  const limit = Math.max(0, Math.floor(count));
  if (limit === 0) return [];

  const heap = new ProductMinHeap();
  for (const product of products) {
    if (heap.size < limit) {
      heap.push(product);
    } else if (heap.peek() && isHigherRank(product, heap.peek()!)) {
      heap.pop();
      heap.push(product);
    }
  }

  return heap.toArray();
}

export function getTopKProducts(products: Product[], count: number): Product[] {
  return getTopKHeapArray(products, count).sort((left, right) => {
    if (left.popularity !== right.popularity) return right.popularity - left.popularity;
    return left.name.localeCompare(right.name, 'es');
  });
}
