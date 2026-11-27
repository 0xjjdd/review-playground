export interface ClientOptions {
  baseUrl: string;
  token?: string;
}

/** A thin JSON client over fetch. */
export class Client {
  constructor(private options: ClientOptions) {}

  async get<T>(path: string): Promise<T> {
    const res = await fetch(this.options.baseUrl + path, {
      headers: this.headers(),
    });
    if (!res.ok) {
      throw new Error(`GET ${path} failed: ${res.status}`);
    }
    return (await res.json()) as T;
  }

  private headers(): Record<string, string> {
    const h: Record<string, string> = { accept: "application/json" };
    if (this.options.token) {
      h.authorization = `Bearer ${this.options.token}`;
    }
    return h;
  }
}
