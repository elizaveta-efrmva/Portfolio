# Видеопортфолио

Одностраничное портфолио видеомонтажера на Next.js static export, React 19 и Tailwind CSS v4. Сайт собирается в статическую папку `out/` и деплоится на GitHub Pages через GitHub Actions.

Контент не зависит от внешних CMS. Имя, тексты, список работ, контакты, постеры и источники видео редактируются в одном файле: `content.config.ts`.

## Быстрый старт

```bash
npm install
npm run dev
```

Локально сайт откроется на `http://localhost:3000`.

## Сборка

```bash
npm run build
```

Next.js создаст статический сайт в `out/`.

## Где менять контент

Основной файл: `content.config.ts`.

В нем лежат:

- метаданные сайта;
- навигация;
- hero и шоурил;
- список работ;
- блок "Обо мне";
- услуги;
- контакты.

Постеры лежат в `public/posters/`. Сейчас добавлены типографические SVG-заглушки. Когда появятся реальные кадры из видео, можно заменить файлы с теми же именами или поменять пути в `content.config.ts`.

## Видеоисточники

`VideoPlayer` поддерживает четыре режима:

```ts
source: "PLACEHOLDER"
source: { kind: "embed", provider: "vk", id: "..." }
source: { kind: "file", src: "/videos/example.mp4", poster: "/posters/example.jpg" }
source: { kind: "link", href: "https://...", label: "Смотреть" }
```

Для крупных роликов предпочтительнее внешний хостинг: VK Video, Kinescope, Rutube, YouTube или Vimeo. Self-host через GitHub Pages стоит использовать только для сильно сжатых файлов, потому что у GitHub есть лимит 100 МБ на файл.

## GitHub Pages

Проект уже настроен под Pages:

- `next.config.ts` использует `output: "export"`;
- изображения отключают оптимизацию через `images.unoptimized`;
- `basePath` и `assetPrefix` берутся из переменной окружения `BASE_PATH`;
- workflow `.github/workflows/deploy.yml` собирает сайт и публикует `out/`.

Для репозитория вида `username.github.io/repo` задайте repository variable:

```text
BASE_PATH=/repo
```

Для user-pages репозитория `username.github.io` оставьте `BASE_PATH` пустым.

## Перенос на другой аккаунт

1. Создать пустой репозиторий на аккаунте подруги.
2. Поменять remote или добавить новый:

```bash
git remote set-url origin https://github.com/username/video-portfolio.git
```

3. Запушить ветку `main`.
4. В Settings -> Pages выбрать Source: GitHub Actions.
5. В Settings -> Secrets and variables -> Actions -> Variables задать `BASE_PATH` под имя репозитория, например `/video-portfolio`.
6. Если репозиторий называется `username.github.io`, `BASE_PATH` не задавать.

В коде нет хардкода аккаунта, репозитория или домена. Для кастомного домена можно добавить файл `public/CNAME`.

## Скрипты

```bash
npm run dev
npm run build
npm run lint
```

## Технологии

- Next.js 16, App Router, static export
- React 19
- TypeScript
- Tailwind CSS v4
- GitHub Actions + GitHub Pages
