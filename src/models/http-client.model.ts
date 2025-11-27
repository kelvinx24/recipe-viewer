// HttpClient.ts
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export class HttpClient {
    private readonly _baseUrl: string;
    private readonly _defaultHeaders: Record<string, string>;

  constructor(baseUrl: string, headers: Record<string, string>) {
    this._baseUrl = baseUrl;
    this._defaultHeaders = headers;
  }

  private buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
    const url = new URL(path, this._baseUrl);
    if (params) {
      Object.entries(params)
        .filter(([_, v]) => v !== undefined)
        .forEach(([k, v]) => url.searchParams.append(k, String(v)));
    }
    return url.toString();
  }

  async request<T>(
    method: HTTPMethod,
    path: string,
    params?: Record<string, string | number | undefined>,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<T> {
    
    const url = this.buildUrl(path, params);
    const opts: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...this._defaultHeaders,
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    };

    const resp = await fetch(url, opts);
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`HTTP ${resp.status} ${resp.statusText}: ${text}`);
    }

    const contentType = resp.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return (await resp.json()) as T;
    } else {
      // if needed handle other types (text, blob)…
      throw new Error(`Unsupported content type: ${contentType}`);
    }
  }

  get<T>(path: string, params?: Record<string, string | number | undefined>, headers?: Record<string, string>): Promise<T> {
    return this.request<T>('GET', path, params, undefined, headers);
  }

  post<T>(path: string, body?: unknown, params?: Record<string, string | number | undefined>, headers?: Record<string, string>): Promise<T> {
    return this.request<T>('POST', path, params, body, headers);
  }
}
