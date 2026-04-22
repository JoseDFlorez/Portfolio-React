export async function loader() {
  return Response.json({ ok: true, ts: new Date().toISOString() });
}
