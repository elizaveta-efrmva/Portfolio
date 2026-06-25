import { content } from "../../content.config";

export function Services() {
  return (
    <section className="section services-section" id="services">
      <div className="section-heading">
        <p className="eyebrow">Services</p>
        <h2>Что умею</h2>
      </div>
      <div className="services-grid">
        {content.services.map((service) => (
          <article key={service.title} className="service-item">
            <h3>{service.title}</h3>
            <p>{service.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
