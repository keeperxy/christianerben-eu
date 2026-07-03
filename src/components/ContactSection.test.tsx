import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ContactSection from "@/components/ContactSection";
import { siteContent } from "@/content/content";
import { renderWithSettings } from "@/test-utils";

const { toastMock } = vi.hoisted(() => ({
  toastMock: vi.fn<(props: unknown) => void>(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: toastMock,
  }),
}));

describe("ContactSection", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    toastMock.mockReset();
    globalThis.fetch = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }),
    );
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("submits the form fields to the contact API and shows the success toast", async () => {
    const user = userEvent.setup();
    renderWithSettings(<ContactSection />);

    await user.type(screen.getByLabelText(siteContent.contact.formLabels.name.en), "Ada Lovelace");
    await user.type(screen.getByLabelText(siteContent.contact.formLabels.email.en), "ada@example.com");
    await user.type(
      screen.getByLabelText(siteContent.contact.formLabels.message.en),
      "Please contact me about secure infrastructure.",
    );
    await user.click(screen.getByRole("button", { name: siteContent.contact.formLabels.send.en }));

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));

    const [url, init] = vi.mocked(globalThis.fetch).mock.calls[0];
    expect(url).toBe("/api/send-mail");
    expect(init?.method).toBe("POST");
    expect(JSON.parse(init?.body as string)).toEqual({
      verify: "",
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "Please contact me about secure infrastructure.",
    });
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: siteContent.contact.formStatus.sentTitle.en,
      }),
    );
  });
});
