class TrieNode {
  readonly children = new Map<string, TrieNode>();
  word: string | null = null;
}

export class Trie {
  private readonly root = new TrieNode();

  insert(word: string): void {
    const normalized = this.normalize(word);
    if (!normalized) return;

    let node = this.root;
    for (const character of normalized) {
      let child = node.children.get(character);
      if (!child) {
        child = new TrieNode();
        node.children.set(character, child);
      }
      node = child;
    }
    node.word = word;
  }

  search(word: string): boolean {
    const node = this.findNode(this.normalize(word));
    return node !== null && node.word !== null;
  }

  startsWith(prefix: string): boolean {
    return this.findNode(this.normalize(prefix)) !== null;
  }

  getSuggestions(prefix: string): string[] {
    const node = this.findNode(this.normalize(prefix));
    if (!node) return [];

    const suggestions: string[] = [];
    this.collectWords(node, suggestions);
    return suggestions;
  }

  private findNode(value: string): TrieNode | null {
    let node = this.root;
    for (const character of value) {
      const child = node.children.get(character);
      if (!child) return null;
      node = child;
    }
    return node;
  }

  private collectWords(node: TrieNode, words: string[]): void {
    if (node.word !== null) words.push(node.word);
    for (const child of node.children.values()) this.collectWords(child, words);
  }

  private normalize(value: string): string {
    return value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
  }
}
