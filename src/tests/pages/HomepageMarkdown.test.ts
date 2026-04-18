import { describe, expect, it } from "vitest";

import handler from "@/pages/api/markdown/homepage";

interface MockApiResponse {
  body: string;
  ended: boolean;
  headers: Map<string, number | string | readonly string[]>;
  statusCode: number;
  end: (body?: string) => MockApiResponse;
  getHeader: (name: string) => number | string | readonly string[] | undefined;
  setHeader: (name: string, value: number | string | readonly string[]) => MockApiResponse;
}

const createMockResponse = (): MockApiResponse => {
  const headers = new Map<string, number | string | readonly string[]>();

  return {
    body: "",
    ended: false,
    headers,
    statusCode: 200,
    end(body = "") {
      this.body = body;
      this.ended = true;

      return this;
    },
    getHeader(name) {
      return headers.get(name.toLowerCase());
    },
    setHeader(name, value) {
      headers.set(name.toLowerCase(), value);

      return this;
    },
  };
};

describe("homepage markdown endpoint", () => {
  it("returns markdown content with agent-friendly headers", async () => {
    const res = createMockResponse();

    await handler({ method: "GET" } as never, res as never);

    expect(res.statusCode).toBe(200);
    expect(res.ended).toBe(true);
    expect(res.getHeader("content-type")).toBe("text/markdown; charset=utf-8");
    expect(res.getHeader("vary")).toBe("Accept");
    expect(res.getHeader("x-markdown-tokens")).toMatch(/^\d+$/);
    expect(res.body).toContain("# Christian Erben");
    expect(res.body).toContain("## About Me");
    expect(res.body).toContain("## Security & Compliance / Governance");
  });
});
