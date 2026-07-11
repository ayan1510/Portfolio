import fs from "node:fs/promises";
import path from "node:path";
import SectionVideoBackground from "@/components/SectionVideoBackground";

const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov", ".m4v", ".ogg"]);

async function getVideoWorks() {
  const videoDir = path.join(process.cwd(), "public", "videowork");

  try {
    const entries = await fs.readdir(videoDir, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((fileName) => VIDEO_EXTENSIONS.has(path.extname(fileName).toLowerCase()))
      .sort((a, b) => a.localeCompare(b))
      .map((fileName) => ({
        src: `/videowork/${encodeURIComponent(fileName)}`,
      }));
  } catch {
    return [];
  }
}

export default async function VideoEditing() {
  const videos = await getVideoWorks();

  return (
    <section
      id="video-editing"
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <SectionVideoBackground src="/videowork/IMG_4709.MP4" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-center mb-4 text-slate-50">
          Video Editing
        </h2>
        <div className="w-24 h-1 bg-linear-to-r from-sky-400 to-violet-500 mx-auto mb-8" />
        <p className="mx-auto mb-12 max-w-3xl text-center text-slate-300 leading-relaxed">
          From pacing and transitions to color grading and sound design, I craft polished edits that
          keep viewers engaged. These clips showcase my work in storytelling, rhythm, and visual flow.
        </p>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <div
                key={video.src}
                className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 shadow-[0_12px_36px_rgba(0,0,0,0.35)]"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <video
                    src={video.src}
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-300">
            Add your videos to <code className="font-semibold text-slate-100">public/videowork</code> to show
            them here.
          </div>
        )}
      </div>
    </section>
  );
}
