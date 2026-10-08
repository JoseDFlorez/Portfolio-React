import { useRef, type CSSProperties, type ReactNode } from "react";

import type { Project } from "~/features/projects/projects.schema";
import {
  isInitialMotionEnabled,
  markMotionReady,
  motionQueries,
  setMotionEndState,
  useScopedScrollTrigger,
} from "~/lib/motion";

type OptimizedProjectImage = {
  widths: number[];
  sourceBase: string;
};

const optimizedProjectImages: Partial<Record<string, OptimizedProjectImage>> = {
  campuslove: {
    widths: [320, 640, 960, 1024],
    sourceBase: "/img/projects/optimized/campuslove",
  },
  "formula1-webcomponents": {
    widths: [320, 640, 960, 1200],
    sourceBase: "/img/projects/optimized/formula1-webcomponents",
  },
  "sgci-app": {
    widths: [320, 640, 960, 1024],
    sourceBase: "/img/projects/optimized/sgci-app",
  },
  "todo-list-flask": {
    widths: [320, 640, 960, 1280],
    sourceBase: "/img/projects/optimized/todo-list-flask",
  },
};

type ProjectImageProps = {
  project: Project;
  alt: string;
  className?: string;
  dataAttribute?: string;
  decoding?: "async" | "auto" | "sync";
  fetchPriority?: "high" | "low" | "auto";
  loading?: "eager" | "lazy";
  revealOnScroll?: boolean;
  sizes: string;
  style?: CSSProperties;
};

function buildSrcSet(image: OptimizedProjectImage, extension: "avif" | "webp") {
  return image.widths
    .map((width) => `${image.sourceBase}-${width}.${extension} ${width}w`)
    .join(", ");
}

export function ProjectImage({
  project,
  alt,
  className,
  dataAttribute,
  decoding = "async",
  fetchPriority,
  loading = "lazy",
  revealOnScroll = false,
  sizes,
  style,
}: ProjectImageProps) {
  const optimized = optimizedProjectImages[project.slug];
  const dataProps = dataAttribute ? { [dataAttribute]: "" } : {};
  const image = (
    <img
      {...dataProps}
      src={project.thumbnail}
      alt={alt}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding={decoding}
      sizes={optimized ? sizes : undefined}
      className={className}
      style={style}
    />
  );

  const content = optimized ? (
    <picture className="block h-full w-full">
      <source type="image/avif" srcSet={buildSrcSet(optimized, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={buildSrcSet(optimized, "webp")} sizes={sizes} />
      {image}
    </picture>
  ) : (
    image
  );

  return revealOnScroll ? (
    <ScrollProjectImage key={project.thumbnail}>{content}</ScrollProjectImage>
  ) : (
    content
  );
}

function ScrollProjectImage({ children }: { children: ReactNode }) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useScopedScrollTrigger(scopeRef, (gsap) => {
    const frame = scopeRef.current;
    const image = frame?.querySelector("img");
    if (!frame || !image) return;

    const motionEnabled = isInitialMotionEnabled();
    let active = true;
    let revealed = false;
    const markReady = () => {
      if (active) frame.setAttribute("data-image-ready", "true");
    };
    const onLoad = async () => {
      await image.decode().catch(() => undefined);
      markReady();
    };
    image.addEventListener("load", onLoad);
    image.addEventListener("error", markReady);
    if (image.complete) {
      if (image.naturalWidth > 0) void onLoad();
      else markReady();
    }
    markMotionReady([frame]);

    const mm = gsap.matchMedia();
    mm.add(motionQueries, (context) => {
      if (context.conditions?.reduceMotion || !motionEnabled || revealed) {
        setMotionEndState(gsap, frame);
        return;
      }

      gsap.fromTo(
        frame,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          onComplete: () => {
            revealed = true;
          },
          scrollTrigger: {
            trigger: frame.parentElement,
            start: "top bottom",
            end: () => `+=${Math.min(frame.offsetHeight * 0.75, window.innerHeight * 0.2)}`,
            scrub: true,
            once: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    return () => {
      active = false;
      image.removeEventListener("load", onLoad);
      image.removeEventListener("error", markReady);
      mm.revert();
    };
  });

  return (
    <div ref={scopeRef} data-project-image-reveal className="h-full w-full">
      <div data-project-image-load className="h-full w-full">
        {children}
      </div>
    </div>
  );
}
