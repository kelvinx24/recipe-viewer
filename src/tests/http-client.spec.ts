// src/__tests__/HttpClient.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { HttpClient } from "../models/http-client.model";

describe("HttpClient", () => {
  const baseUrl = "https://example.com/api/";
  let client: HttpClient;

  beforeEach(() => {
    client = new HttpClient(baseUrl, { "X-Test": "true" });
    vi.resetAllMocks();
  });

  it("should make a GET request with the correct URL and headers", async () => {
    // Mock fetch
    const mockData = { hello: "world" };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: () => Promise.resolve(mockData),
    });
    global.fetch = mockFetch;

    const result = await client.get<typeof mockData>("test");

    // Verify result
    expect(result).toEqual(mockData);

    // Verify URL and headers
    expect(mockFetch).toHaveBeenCalledWith(
      "https://example.com/api/test",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "X-Test": "true",
        }),
      })
    );
  });

  it("should handle POST requests with a body", async () => {
    const body = { name: "KX" };
    const mockData = { success: true };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: () => Promise.resolve(mockData),
    });

    const result = await client.post<typeof mockData>("submit", body);

    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(
      "https://example.com/api/submit",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(body),
      })
    );
  });

  it("should throw an error when response is not ok", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      text: () => Promise.resolve("Missing"),
      headers: new Headers(),
    });

    await expect(client.get("missing")).rejects.toThrow("HTTP 404 Not Found: Missing");
  });

  it("should throw an error for unsupported content types", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "text/html" }),
      text: () => Promise.resolve("<html></html>"),
    });

    await expect(client.get("page")).rejects.toThrow("Unsupported content type");
  });

  it("should append query parameters correctly", async () => {
    const mockData = { ok: true };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: () => Promise.resolve(mockData),
    });

    await client.get("foods", { page: 2, q: "cheese" });

    expect(fetch).toHaveBeenCalledWith(
      "https://example.com/api/foods?page=2&q=cheese",
      expect.any(Object)
    );
  });
});
