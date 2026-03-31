import ServiceWheel from "@/components/ui/service-wheel";

export default function WheelPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
      <div className="text-center mb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-purple-400/60 mb-4">
          The Purple Engine
        </p>
        <h2
          className="text-4xl md:text-5xl font-light text-white mb-4"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Every Channel Works Together
        </h2>
        <p className="text-white/40 max-w-lg mx-auto text-sm leading-relaxed">
          From strategy to execution, our AI engine connects every channel into
          one system that scales your brand efficiently.
        </p>
      </div>

      <ServiceWheel />
    </div>
  );
}
