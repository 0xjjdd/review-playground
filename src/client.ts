export interface ClientOptions {
  baseUrl: string;
  token?: string;
  /** Extra attempts after a failed request (default 2). */
  retries?: number;
  /** First backoff in ms; doubles each attempt (default 200). */
  backoffMs?: number;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** A thin JSON client over fetch that retries server errors. */
export class Client {
  constructor(
    private options: ClientOptions,
    private doFetch: typeof fetch = fetch,
  ) {}

  async get<T>(path: string): Promise<T> {
    const retries = this.options.retries ?? 2;
    let delay = this.options.backoffMs ?? 200;
    for (let attempt = 0; ; attempt++) {
      const res = await this.doFetch(this.options.baseUrl + path, {
        headers: this.headers(),
      });
      if (res.ok) {
        return (await res.json()) as T;
      }
      // Only 5xx and 429 are worth another try.
      const retryable = res.status >= 500 || res.status === 429;
      if (!retryable || attempt >= retries) {
        throw new Error(`GET ${path} failed: ${res.status}`);
      }
      await sleep(delay);
      delay *= 2;
    }
  }

  private headers(): Record<string, string> {
    const h: Record<string, string> = { accept: "application/json" };
    if (this.options.token) {
      h.authorization = `Bearer ${this.options.token}`;
    }
    return h;
  }
}
