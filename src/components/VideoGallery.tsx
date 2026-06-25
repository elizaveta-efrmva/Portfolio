"use client";

import { useMemo, useState } from "react";
import { content, type Work } from "../../content.config";
import { VideoCard } from "./VideoCard";
import { VideoModal } from "./VideoModal";

const categories = ["Все", "Reels", "Обучающие", "Talking head", "Промо"] as const;

export function VideoGallery() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("Все");
  const [activeWork, setActiveWork] = useState<Work | null>(null);

  const works = useMemo(() => {
    if (activeCategory === "Все") {
      return content.works;
    }

    return content.works.filter((work) => work.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="section works-section" id="works">
      <div className="section-heading">
        <p className="eyebrow">Selected work</p>
        <h2>Работы</h2>
      </div>
      <div className="filters" aria-label="Фильтр работ">
        {categories.map((category) => (
          <button
            className={category === activeCategory ? "filter filter-active" : "filter"}
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="works-grid">
        {works.map((work) => (
          <VideoCard key={work.id} work={work} onOpen={() => setActiveWork(work)} />
        ))}
      </div>
      <VideoModal work={activeWork} onClose={() => setActiveWork(null)} />
    </section>
  );
}
