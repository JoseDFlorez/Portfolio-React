import type { CSSProperties } from "react";

import type { Project } from "~/features/projects/projects.schema";

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

  if (!optimized) {
    return image;
  }

  return (
    <picture className="block h-full w-full">
      <source type="image/avif" srcSet={buildSrcSet(optimized, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={buildSrcSet(optimized, "webp")} sizes={sizes} />
      {image}
    </picture>
  );
}
