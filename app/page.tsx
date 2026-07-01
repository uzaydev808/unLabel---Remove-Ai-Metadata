import { Uploader } from "./components/Uploader";

const specs = [
  { label: "Accepts", value: "JPEG / PNG / WebP" },
  { label: "Max size", value: "10 MB" },
  { label: "Stored?", value: "Never." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neo-bg text-neo-black flex flex-col">
      <header className="border-b-4 border-neo-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <span
            aria-hidden
            className="inline-block w-10 h-10 bg-neo-yellow border-3 border-neo-black neo-shadow-sm"
          />
          <span className="font-display font-700 text-2xl sm:text-3xl tracking-tight">
            unLabel
          </span>
          <span className="ml-auto bg-neo-white border-3 border-neo-black px-3 py-1 text-xs font-mono uppercase tracking-wider">
            v1.2
          </span>
        </div>
      </header>

      <section className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Copy column */}
        <div className="lg:col-span-7 flex flex-col justify-center gap-6">
          <div className="inline-flex items-center gap-2 bg-neo-blue text-neo-white border-3 border-neo-black px-3 py-1 self-start neo-shadow-sm">
            <span className="w-2 h-2 bg-neo-yellow rounded-full" aria-hidden />
            <span className="font-mono text-xs uppercase tracking-wider">
              Strip the AI label
            </span>
          </div>

          <h1 className="font-display font-700 text-4xl sm:text-5xl lg:text-7xl leading-[1.05] tracking-tight max-w-4xl">
            Remove the{" "}
            <span className="inline-block bg-neo-yellow border-3 border-neo-black px-2 -rotate-1">
              metadata
            </span>{" "}
            that tags your photos as AI.
          </h1>

          <p className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl">
            Platforms read{" "}
            <span className="bg-neo-orange/40 px-1 rounded">EXIF</span>,{" "}
            <span className="bg-neo-blue/30 px-1 rounded">XMP</span>, and{" "}
            <span className="bg-neo-red/30 px-1 rounded">C2PA</span> signatures
            and flag your image as &ldquo;Made with AI&rdquo; — even after a
            small edit. unLabel strips that layer in one click.
          </p>

          {/* Upload column — stacked BELOW copy on mobile, RIGHT side on desktop */}
          <div className="block lg:hidden">
            <Uploader />
            <p className="font-mono text-xs text-neo-black/60 mt-3 mb-6 text-center">
              Drop a file anywhere on the panel · JPEG, PNG, or WebP up to
              10&nbsp;MB
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {specs.map((item) => (
              <div
                key={item.label}
                className="bg-neo-white border-3 border-neo-black p-4 neo-shadow-sm"
              >
                <div className="font-mono text-[11px] uppercase tracking-wider text-neo-black/60">
                  {item.label}
                </div>
                <div className="font-display font-600 text-base mt-1">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload column — on desktop, sticky right side */}
        <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-8 self-start">
          <Uploader />
          <p className="font-mono text-xs text-neo-black/60 mt-3 text-center">
            Drop a file anywhere on the panel · JPEG, PNG, or WebP up to
            10&nbsp;MB
          </p>
        </div>
      </section>

      <footer className="border-t-4 border-neo-black bg-neo-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-xs uppercase tracking-wider">
          <span>No server storage · Privacy first</span>
          <span className="text-neo-black/60">Uzay · Ganteng</span>
        </div>
      </footer>
    </main>
  );
}
