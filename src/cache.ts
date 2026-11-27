/**
 * A least-recently-used cache: reading or writing a key makes it the
 * newest, and the oldest key goes once there are more than `limit`.
 */
export class Cache<V> {
  private entries = new Map<string, V>();

  constructor(private limit: number) {
    if (limit < 1) {
      throw new RangeError("limit must be at least 1");
    }
  }

  get(key: string): V | undefined {
    const value = this.entries.get(key);
    if (value !== undefined) {
      // Re-insert so the key moves to the end (newest).
      this.entries.delete(key);
      this.entries.set(key, value);
    }
    return value;
  }

  set(key: string, value: V): void {
    this.entries.delete(key);
    this.entries.set(key, value);
    if (this.entries.size > this.limit) {
      const oldest = this.entries.keys().next().value;
      if (oldest !== undefined) {
        this.entries.delete(oldest);
      }
    }
  }

  has(key: string): boolean {
    return this.entries.has(key);
  }

  get size(): number {
    return this.entries.size;
  }
}
