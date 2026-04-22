import type { AppLoadContext, EntryContext } from "react-router";
import { handleRequest as handleVercelRequest } from "@vercel/react-router/entry.server";

import { applySecurityHeaders } from "~/lib/security-headers.server";

export { streamTimeout } from "@vercel/react-router/entry.server";

type RootLoaderData = {
  cspNonce?: unknown;
};

function getCspNonce(routerContext: EntryContext): string | undefined {
  const loaderData = routerContext.staticHandlerContext.loaderData as
    | Record<string, unknown>
    | undefined;
  const rootData = loaderData?.root as RootLoaderData | undefined;
  return typeof rootData?.cspNonce === "string" ? rootData.cspNonce : undefined;
}

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  loadContext?: AppLoadContext,
): Promise<Response> {
  const scriptNonce = getCspNonce(routerContext);
  applySecurityHeaders(responseHeaders, { scriptNonce });
  return handleVercelRequest(
    request,
    responseStatusCode,
    responseHeaders,
    routerContext,
    loadContext,
    { nonce: scriptNonce },
  );
}
