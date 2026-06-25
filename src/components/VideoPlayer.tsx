import type { VideoSource } from "../../content.config";
import { assetPath } from "../lib/assets";

type VideoPlayerProps = {
  title: string;
  orientation: "horizontal" | "vertical";
  poster: string;
  source: VideoSource;
};

export function VideoPlayer({ title, orientation, poster, source }: VideoPlayerProps) {
  const posterSrc = assetPath(poster);
  const className = `video-player video-player-${orientation}`;

  if (source.kind === "file") {
    return (
      <video className={className} controls preload="metadata" poster={posterSrc}>
        <source src={assetPath(source.src)} type="video/mp4" />
      </video>
    );
  }

  if (source.kind === "embed") {
    return (
      <iframe
        className={className}
        src={source.url}
        title={title}
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (source.kind === "link") {
    return (
      <a className={`${className} video-link`} href={source.url} target="_blank" rel="noreferrer">
        <img src={posterSrc} alt="" />
        <span className="play-button" aria-hidden="true" />
        <strong>Открыть видео</strong>
      </a>
    );
  }

  return (
    <div className={`${className} video-placeholder`}>
      <img src={posterSrc} alt="" />
      <span className="play-button" aria-hidden="true" />
      <strong>{title}</strong>
      <small>Видео скоро будет подключено</small>
    </div>
  );
}
