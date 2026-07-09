import { createHmac } from "node:crypto";
import { describe, expect, it, beforeEach, vi } from "vitest";

const { sendMock } = vi.hoisted(() => ({
  sendMock: vi.fn<(message: Record<string, unknown>) => Promise<unknown>>(),
}));

vi.mock("resend", () => ({
  Resend: vi.fn<
    (apiKey: string) => { emails: { send: typeof sendMock } }
  >(function ResendMock() {
    return {
      emails: {
        send: sendMock,
      },
    };
  }),
}));

import * as sendMailApi from "@/pages/api/send-mail";

interface MockApiResponse {
  body: unknown;
  ended: boolean;
  headers: Map<string, number | string | readonly string[]>;
  statusCode: number;
  getHeader: (name: string) => number | string | readonly string[] | undefined;
  json: (body: unknown) => MockApiResponse;
  setHeader: (name: string, value: number | string | readonly string[]) => MockApiResponse;
  status: (statusCode: number) => MockApiResponse;
}

const handler = sendMailApi.default;
const apiWithTestHooks = sendMailApi as typeof sendMailApi & {
  __getContactRateLimitBucketCountForTests?: () => number;
  __resetContactRateLimitForTests?: () => void;
};

const validPayload = {
  verify: "",
  name: "Christian Erben",
  email: "christian@example.com",
  message: "Please contact me about infrastructure governance.",
};

const createMockResponse = (): MockApiResponse => {
  const headers = new Map<string, number | string | readonly string[]>();

  return {
    body: undefined,
    ended: false,
    headers,
    statusCode: 200,
    getHeader(name) {
      return headers.get(name.toLowerCase());
    },
    json(body) {
      this.body = body;
      this.ended = true;

      return this;
    },
    setHeader(name, value) {
      headers.set(name.toLowerCase(), value);

      return this;
    },
    status(statusCode) {
      this.statusCode = statusCode;

      return this;
    },
  };
};

const createRequest = ({
  body = validPayload,
  headers = {},
  method = "POST",
  remoteAddress = "198.51.100.10",
}: {
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
  method?: string;
  remoteAddress?: string;
} = {}) => ({
  method,
  body,
  headers,
  socket: {
    remoteAddress,
  },
});

const post = async (request = createRequest()) => {
  const res = createMockResponse();

  await handler(request as never, res as never);

  return res;
};

describe("send-mail API", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    sendMock.mockReset();
    sendMock.mockResolvedValue({ data: { id: "email-id" }, error: null });
    process.env.RESEND_API_KEY = "test-resend-key";
    delete process.env.VERCEL;
    delete process.env.CONTACT_RATE_LIMIT_ENDPOINT;
    delete process.env.CONTACT_RATE_LIMIT_ENDPOINT_TOKEN;
    delete process.env.CONTACT_RATE_LIMIT_KEY_SECRET;
    globalThis.fetch = originalFetch;
    apiWithTestHooks.__resetContactRateLimitForTests?.();
  });

  it("allows only POST requests", async () => {
    const res = await post(createRequest({ method: "GET" }));

    expect(res.statusCode).toBe(405);
    expect(res.getHeader("allow")).toBe("POST");
    expect(res.body).toEqual({ error: "Method Not Allowed" });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects non-object request bodies", async () => {
    const res = await post(createRequest({ body: "not-json" }));

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Invalid request body." });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects honeypot submissions before sending mail", async () => {
    const res = await post(
      createRequest({
        body: {
          ...validPayload,
          verify: "bot-filled",
        },
      }),
    );

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Suspicious request detected." });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns a generic error when email delivery is not configured", async () => {
    delete process.env.RESEND_API_KEY;

    const res = await post();

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Email delivery is not configured." });
    expect(JSON.stringify(res.body)).not.toContain("RESEND_API_KEY");
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("sends valid contact requests with raw normalized replyTo and escaped HTML", async () => {
    const res = await post(
      createRequest({
        body: {
          verify: "",
          name: "  <Alice & Bob>  ",
          email: "  reply&me@example.com  ",
          message: "Hello <script>alert(\"x\")</script> & thanks",
        },
      }),
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true });
    expect(sendMock).toHaveBeenCalledTimes(1);

    const message = sendMock.mock.calls[0][0];
    expect(message.replyTo).toBe("reply&me@example.com");
    expect(message.html).toContain("&lt;Alice &amp; Bob&gt;");
    expect(message.html).toContain("reply&amp;me@example.com");
    expect(message.html).toContain(
      "Hello &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; thanks",
    );
    expect(message.html).not.toContain("<script>");
  });

  it("returns a generic provider failure without leaking raw provider details", async () => {
    sendMock.mockRejectedValueOnce(new Error("provider quota details"));

    const res = await post();

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Failed to send contact email." });
    expect(JSON.stringify(res.body)).not.toContain("provider quota details");
  });

  it("returns a generic provider failure when Resend resolves with an error", async () => {
    sendMock.mockResolvedValueOnce({
      data: null,
      error: {
        message: "provider rejected message details",
      },
    });

    const res = await post();

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Failed to send contact email." });
    expect(JSON.stringify(res.body)).not.toContain("provider rejected");
  });

  it.each([
    ["name", "a".repeat(101)],
    ["email", `${"a".repeat(245)}@example.com`],
    ["message", "a".repeat(5001)],
  ])("rejects overlong %s values", async (field, value) => {
    const res = await post(
      createRequest({
        body: {
          ...validPayload,
          [field]: value,
        },
      }),
    );

    expect(res.statusCode).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rate limits repeated valid submissions from the same IP", async () => {
    for (let attempt = 0; attempt < 5; attempt++) {
      const res = await post(
        createRequest({
          remoteAddress: "203.0.113.40",
        }),
      );

      expect(res.statusCode).toBe(200);
    }

    const limited = await post(
      createRequest({
        remoteAddress: "203.0.113.40",
      }),
    );

    expect(limited.statusCode).toBe(429);
    expect(limited.body).toEqual({ error: "Too many contact requests. Please try again later." });
    expect(sendMock).toHaveBeenCalledTimes(5);
  });

  it("does not trust rotating x-forwarded-for values for rate limit buckets", async () => {
    for (let attempt = 0; attempt < 5; attempt++) {
      const res = await post(
        createRequest({
          headers: {
            "x-forwarded-for": `198.51.100.${attempt}, 70.41.3.18`,
          },
          remoteAddress: "203.0.113.90",
        }),
      );

      expect(res.statusCode).toBe(200);
    }

    const limited = await post(
      createRequest({
        headers: {
          "x-forwarded-for": "198.51.100.200, 70.41.3.18",
        },
        remoteAddress: "203.0.113.90",
      }),
    );

    expect(limited.statusCode).toBe(429);
    expect(limited.body).toEqual({ error: "Too many contact requests. Please try again later." });
    expect(sendMock).toHaveBeenCalledTimes(5);
  });

  it("uses Vercel-provided forwarded addresses for separate visitor buckets", async () => {
    process.env.VERCEL = "1";

    for (let attempt = 0; attempt < 5; attempt++) {
      const res = await post(
        createRequest({
          headers: {
            "x-vercel-forwarded-for": "198.51.100.40",
          },
          remoteAddress: "10.0.0.10",
        }),
      );

      expect(res.statusCode).toBe(200);
    }

    const limited = await post(
      createRequest({
        headers: {
          "x-vercel-forwarded-for": "198.51.100.40",
        },
        remoteAddress: "10.0.0.10",
      }),
    );
    const separateVisitor = await post(
      createRequest({
        headers: {
          "x-vercel-forwarded-for": "198.51.100.41",
        },
        remoteAddress: "10.0.0.10",
      }),
    );

    expect(limited.statusCode).toBe(429);
    expect(separateVisitor.statusCode).toBe(200);
    expect(sendMock).toHaveBeenCalledTimes(6);
  });

  it("purges expired rate limit hashes without waiting for another request", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-17T12:00:00.000Z"));

    try {
      const res = await post(
        createRequest({
          remoteAddress: "203.0.113.70",
        }),
      );

      expect(res.statusCode).toBe(200);
      expect(apiWithTestHooks.__getContactRateLimitBucketCountForTests?.()).toBe(1);

      vi.advanceTimersByTime(60 * 60 * 1000);

      expect(apiWithTestHooks.__getContactRateLimitBucketCountForTests?.()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it("uses the durable rate-limit endpoint when configured", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ allowed: false }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }),
    );
    globalThis.fetch = fetchMock;
    process.env.CONTACT_RATE_LIMIT_ENDPOINT = "https://rate-limit.example.test/contact";
    process.env.CONTACT_RATE_LIMIT_ENDPOINT_TOKEN = "test-token";
    process.env.CONTACT_RATE_LIMIT_KEY_SECRET = "stable-test-secret";

    const res = await post();
    const expectedKey = createHmac("sha256", "stable-test-secret")
      .update("198.51.100.10")
      .digest("hex");

    expect(res.statusCode).toBe(429);
    expect(sendMock).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://rate-limit.example.test/contact",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          key: expectedKey,
          maxRequests: 5,
          windowMs: 60 * 60 * 1000,
        }),
      }),
    );
  });

  it("fails closed when the durable rate-limit endpoint is unavailable", async () => {
    globalThis.fetch = vi.fn<typeof fetch>().mockRejectedValue(new Error("endpoint down"));
    process.env.CONTACT_RATE_LIMIT_ENDPOINT = "https://rate-limit.example.test/contact";
    process.env.CONTACT_RATE_LIMIT_KEY_SECRET = "stable-test-secret";

    const res = await post();

    expect(res.statusCode).toBe(429);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("fails closed without calling the durable endpoint when the key secret is missing", async () => {
    const fetchMock = vi.fn<typeof fetch>();
    globalThis.fetch = fetchMock;
    process.env.CONTACT_RATE_LIMIT_ENDPOINT = "https://rate-limit.example.test/contact";
    delete process.env.CONTACT_RATE_LIMIT_KEY_SECRET;

    const res = await post();

    expect(res.statusCode).toBe(429);
    expect(sendMock).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails closed when the durable rate-limit endpoint stalls past the timeout", async () => {
    vi.useFakeTimers();

    const fetchMock = vi.fn<typeof fetch>().mockImplementation(
      (_input, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(init.signal?.reason ?? new Error("aborted"));
          });
        }),
    );
    globalThis.fetch = fetchMock;
    process.env.CONTACT_RATE_LIMIT_ENDPOINT = "https://rate-limit.example.test/contact";
    process.env.CONTACT_RATE_LIMIT_KEY_SECRET = "stable-test-secret";

    try {
      const responsePromise = post();

      await vi.advanceTimersByTimeAsync(2_000);

      const res = await responsePromise;

      expect(res.statusCode).toBe(429);
      expect(sendMock).not.toHaveBeenCalled();
      expect(fetchMock).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it("keeps the durable rate-limit timeout active while response JSON is parsed", async () => {
    vi.useFakeTimers();

    const fetchMock = vi.fn<typeof fetch>().mockImplementation(
      (_input, init) =>
        Promise.resolve({
          ok: true,
          json: () =>
            new Promise((_resolve, reject) => {
              init?.signal?.addEventListener("abort", () => {
                reject(init.signal?.reason ?? new Error("aborted"));
              });
            }),
        } as Response),
    );
    globalThis.fetch = fetchMock;
    process.env.CONTACT_RATE_LIMIT_ENDPOINT = "https://rate-limit.example.test/contact";
    process.env.CONTACT_RATE_LIMIT_KEY_SECRET = "stable-test-secret";

    try {
      const responsePromise = post();

      await vi.advanceTimersByTimeAsync(2_000);

      const res = await responsePromise;

      expect(res.statusCode).toBe(429);
      expect(sendMock).not.toHaveBeenCalled();
      expect(fetchMock).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
