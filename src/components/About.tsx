import { content } from "../../content.config";
import { assetPath } from "../lib/assets";

export function About() {
  return (
    <section className="section about-section" id="about">
      <div className="about-media">
        <img src={assetPath(content.about.portrait)} alt="" />
      </div>
      <div className="about-copy">
        <p className="eyebrow">About</p>
        <h2>{content.about.title}</h2>
        <p>{content.about.text}</p>
        <div className="tool-list">
          {content.about.tools.map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
