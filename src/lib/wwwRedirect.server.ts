import { getRequest } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";

export function checkWwwRedirect() {
  const req = getRequest();
  if (!req) return;
  const host = (req.headers.get("host") ?? "").toLowerCase();
  if (host === "www.era2.ai") {
    const url = new URL(req.url);
    throw redirect({
      href: `https://era2.ai${url.pathname}${url.search}`,
      statusCode: 301,
    });
  }
}