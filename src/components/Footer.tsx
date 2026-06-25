import { content } from "../../content.config";

export function Footer() {
  return (
    <footer className="site-footer">
      <span>{content.meta.name}</span>
      <a href="#top">Наверх</a>
    </footer>
  );
}
