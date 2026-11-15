import { describe, expect, it } from 'vitest';
import {
  getTopKHeapArray,
  getTopKProducts,
  Product,
  ProductMinHeap,
  ProductTrie,
} from './structures';

const products: Product[] = [
  { name: 'Air Max', popularity: 90 },
  { name: 'Air Force', popularity: 95 },
  { name: 'Air Jordan', popularity: 85 },
  { name: 'Adidas Boost', popularity: 80 },
];

describe('ProductTrie', () => {
  it('finds products by case-insensitive prefix without matching partial words elsewhere', () => {
    const trie = new ProductTrie();
    products.forEach((product) => trie.insert(product));

    expect(trie.search('AIR ').map((product) => product.name)).toEqual([
      'Air Max',
      'Air Force',
      'Air Jordan',
    ]);
    expect(trie.search('force')).toEqual([]);
  });

  it('normalizes accents when matching a prefix', () => {
    const trie = new ProductTrie();
    trie.insert({ name: 'Café Racer', popularity: 70 });

    expect(trie.search('cafe').map((product) => product.name)).toEqual(['Café Racer']);
  });
});

describe('ProductMinHeap', () => {
  it('keeps the lowest-ranked selected product at the root', () => {
    const heap = new ProductMinHeap();
    products.forEach((product) => heap.push(product));

    expect(heap.peek()?.name).toBe('Adidas Boost');
    expect(heap.pop()?.popularity).toBe(80);
    expect(heap.size).toBe(3);
  });
});

describe('getTopKProducts', () => {
  it('returns the requested highest-popularity products in descending order', () => {
    expect(getTopKProducts(products, 2).map((product) => product.name)).toEqual([
      'Air Force',
      'Air Max',
    ]);
    expect(getTopKHeapArray(products, 2)[0].name).toBe('Air Max');
  });

  it('handles ties consistently and safely caps the result count', () => {
    const tied = [
      { name: 'Air Zebra', popularity: 90 },
      { name: 'Air Alpha', popularity: 90 },
      { name: 'Air Mid', popularity: 80 },
    ];

    expect(getTopKProducts(tied, 8).map((product) => product.name)).toEqual([
      'Air Alpha',
      'Air Zebra',
      'Air Mid',
    ]);
    expect(getTopKProducts(tied, 0)).toEqual([]);
  });
});
