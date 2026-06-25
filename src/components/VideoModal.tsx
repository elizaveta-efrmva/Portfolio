"use client";

import { useEffect } from "react";
import type { Work } from "../../content.config";
import { VideoPlayer } from "./VideoPlayer";

type VideoModalProps = {
  work: Work | null;
  onClose: () => void;
};

export function VideoModal({ work, onClose }: VideoModalProps) {
  useEffect(() => {
    if (!work) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, work]);

  if (!work) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={work.title}>
      <button className="modal-scrim" type="button" onClick={onClose} aria-label="Закрыть" />
      <div className="modal-panel">
        <div className="modal-header">
          <div>
            <span>{work.category}</span>
            <h3>{work.title}</h3>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>
        <VideoPlayer title={work.title} orientation={work.orientation} poster={work.poster} source={work.source} />
        <p>{work.description}</p>
      </div>
    </div>
  );
}
