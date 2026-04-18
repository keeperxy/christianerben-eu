import type { NextApiRequest, NextApiResponse } from "next";

import { renderHomepageMarkdown } from "@/lib/homepage-markdown";

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  const { markdown, tokenCount } = renderHomepageMarkdown();

  res.setHeader("Content-Type", "text/markdown; charset=utf-8");
  res.setHeader("Vary", "Accept");
  res.setHeader("X-Markdown-Tokens", tokenCount.toString());
  res.statusCode = 200;
  res.end(markdown);
};

export default handler;
