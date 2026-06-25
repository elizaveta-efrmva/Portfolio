import { content } from "../../content.config";

export function Contact() {
  return (
    <section className="section contact-section" id="contact">
      <p className="eyebrow">Contact</p>
      <h2>Обсудим ролик</h2>
      <p>Напишите в Telegram или на почту, чтобы обсудить задачу, сроки и формат исходников.</p>
      <div className="contact-actions">
        <a className="button button-primary" href={content.contacts.telegram}>
          Telegram
        </a>
        <a className="button button-secondary" href={`mailto:${content.contacts.email}`}>
          Email
        </a>
      </div>
    </section>
  );
}
