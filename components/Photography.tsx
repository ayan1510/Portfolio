import fs from "node:fs/promises";
import path from "node:path";
import Image from "next/image";
import SectionVideoBackground from "@/components/SectionVideoBackground";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

async function getPhotographyImages() {
  const photographyDir = path.join(process.cwd(), "public", "photography");

  try {
    const entries = await fs.readdir(photographyDir, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((fileName) => IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase()))
      .sort((a, b) => a.localeCompare(b))
      .map((fileName) => ({
        src: `/photography/${fileName}`,
        alt: `Photography work - ${fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")}`,
      }));
  } catch {
    return [];
  }
}

export default async function Photography() {
  const photos = await getPhotographyImages();

  return (
    <section
      id="photography"
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <SectionVideoBackground src="/videowork/IMG_4708.MP4" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-center mb-4 text-slate-50">
          Photography
        </h2>
        <div className="w-24 h-1 bg-linear-to-r from-amber-400 to-fuchsia-500 mx-auto mb-8" />
        <p className="mx-auto mb-12 max-w-3xl text-center text-slate-300 leading-relaxed">
          I capture clean compositions, natural light, and story-driven frames across portraits, streets,
          and lifestyle shoots. This gallery highlights my eye for mood, timing, and visual detail.
        </p>

        {photos.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo, index) => (
              <div
                key={photo.src}
                className="group overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 shadow-[0_12px_36px_rgba(0,0,0,0.35)]"
              >
                <div className="relative aspect-4/5 w-full overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={index < 3}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-300">
            Add your photos to <code className="font-semibold text-slate-100">public/photography</code> to show
            them here.
          </div>
        )}
      </div>
    </section>
  );
}
