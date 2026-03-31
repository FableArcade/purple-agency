import ServiceWheel from "@/components/ui/service-wheel";

export default function WheelPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-4">
          Our Services
        </p>
        <h2
          className="text-4xl md:text-5xl font-light text-white mb-4"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
          }}
        >
          Every Channel Works Together
        </h2>
        <p className="text-white/35 max-w-md mx-auto text-sm leading-relaxed">
          Tap a service to explore what&apos;s inside.
        </p>
      </div>

      <ServiceWheel />
    </div>
  );
}
