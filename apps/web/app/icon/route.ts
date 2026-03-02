const ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#0f172a" />
  <path d="M14 48 L50 16" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" />
  <circle cx="17" cy="47" r="5" fill="#38bdf8" />
  <circle cx="49" cy="17" r="5" fill="#38bdf8" />
</svg>
`;

export async function GET() {
  return new Response(ICON_SVG, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=604800, immutable"
    }
  });
}
