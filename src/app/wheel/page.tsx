import ServiceWheel from "@/components/ui/service-wheel";

export default function WheelPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 pt-24">
      <div className="text-center mb-12">
        <p
          className="text-[0.65rem] uppercase tracking-[0.3em] text-black/30 mb-4"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          Our Services
        </p>
        <h2
          className="text-4xl md:text-5xl font-light text-black mb-4"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Every Channel Works Together
        </h2>
        <p
          className="text-black/35 max-w-md mx-auto text-sm leading-relaxed font-light"
          style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
        >
          Tap a service to explore what&apos;s inside.
        </p>
      </div>

      <ServiceWheel />
    </div>
  );
}
