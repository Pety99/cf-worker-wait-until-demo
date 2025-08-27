export interface Env {}

/**
 * Simulate a 1s analytics API call
 * @param pathname - The pathname of the pageview
 */
async function mockAnalytics(pathname: string): Promise<void> {
  // simulate a 1s analytics API call
  await new Promise((r) => setTimeout(r, 1000));
  console.log("[analytics] tracked pageview for", pathname);
}

/**
 * Fetch the response from buffer.com
 * Set a custom header to indicate that the request was made by the worker
 * @returns The response from buffer.com
 */
async function fetchBuffer(): Promise<Response> {
  const upstream = await fetch("https://buffer.com", {
    headers: { accept: "text/html" },
  });
  const res = new Response(upstream.body, upstream);
  res.headers.set("x-demo", "waituntil");
  return res;
}

/**
 * Handle the request
 * @param request - The request
 * @param _env - The environment
 * @param ctx - The context
 * @returns The response
 */
export default {
  async fetch(
    request: Request,
    _env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === "/no-wait-until") {
      const [_analyticsResult, bufferResponse] = await Promise.all([
        mockAnalytics(pathname),
        fetchBuffer(),
      ]);

      return bufferResponse;
    }

    if (pathname === "/with-wait-until") {
      ctx.waitUntil(
        mockAnalytics(pathname).catch((err) =>
          console.error("[analytics] error:", err)
        )
      );
      return fetchBuffer();
    }

    return new Response("Not found\n", {
      status: 404,
      headers: { "content-type": "text/plain" },
    });
  },
};
