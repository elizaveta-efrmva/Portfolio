import { content } from "../../content.config";

const navItems = [
  { href: "#works", label: "Работы" },
  { href: "#about", label: "Обо мне" },
  { href: "#services", label: "Услуги" },
  { href: "#contact", label: "Контакты" },
];

export function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="К началу страницы">
        <span className="brand-mark">VF</span>
        <span>
          <strong>{content.meta.name}</strong>
          <small>{content.meta.role}</small>
        </span>
      </a>
      <nav className="site-nav" aria-label="Основная навигация">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="header-cta" href="#contact">
        Связаться
      </a>
    </header>
  );
}
