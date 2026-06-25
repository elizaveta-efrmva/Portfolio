import type { Work } from "../../content.config";
import { assetPath } from "../lib/assets";

type VideoCardProps = {
  work: Work;
  onOpen: () => void;
};

export function VideoCard({ work, onOpen }: VideoCardProps) {
  return (
    <article className={`video-card video-card-${work.orientation}`}>
      <button type="button" className="video-card-button" onClick={onOpen} aria-label={`Открыть ${work.title}`}>
        <img src={assetPath(work.poster)} alt="" />
        <span className="play-button" aria-hidden="true" />
      </button>
      <div className="video-card-body">
        <span>{work.category}</span>
        <h3>{work.title}</h3>
        <p>{work.description}</p>
        <div className="tag-row">
          {work.tags.map((tag) => (
            <small key={tag}>{tag}</small>
          ))}
        </div>
      </div>
    </article>
  );
}
