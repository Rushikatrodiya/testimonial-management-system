import { TestimonialWidget } from "@/components/TestimonialWidget";

export default async function WidgetPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const accentColor = typeof resolvedParams.accentColor === "string" ? resolvedParams.accentColor : "#3b82f6";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

  return (
    <div className="p-4 bg-transparent min-h-screen">
      <TestimonialWidget apiUrl={apiUrl} accentColor={accentColor} wallUrl={`${frontendUrl}/wall`} />
    </div>
  );
}
