import { content } from "../../content.config";
import { VideoPlayer } from "./VideoPlayer";

export function Hero() {
  return (
    <section className="hero section" id="top">
      <div className="hero-copy">
        <p className="eyebrow">{content.hero.eyebrow}</p>
        <h1>{content.hero.headline}</h1>
        <p className="hero-subline">{content.hero.subline}</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#works">
            {content.hero.ctaPrimary}
          </a>
          <a className="button button-secondary" href="#contact">
            {content.hero.ctaSecondary}
          </a>
        </div>
      </div>
      <div className="hero-media" aria-label="Главный showreel">
        <VideoPlayer
          title={content.hero.showreelTitle}
          orientation="horizontal"
          poster={content.hero.showreelPoster}
          source={content.hero.showreelSource}
        />
      </div>
      <div className="stats-strip" aria-label="Ключевые форматы">
        {content.stats.map((item) => (
          <div key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
