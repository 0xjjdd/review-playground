/** A small cache that forgets the oldest entries past `limit`. */
export class Cache<V> {
  private entries: Array<[string, V]> = [];

  constructor(private limit: number) {}

  get(key: string): V | undefined {
    const hit = this.entries.find(([k]) => k === key);
    return hit ? hit[1] : undefined;
  }

  set(key: string, value: V): void {
    this.entries = this.entries.filter(([k]) => k !== key);
    this.entries.push([key, value]);
    while (this.entries.length > this.limit) {
      this.entries.shift();
    }
  }

  get size(): number {
    return this.entries.length;
  }
}
