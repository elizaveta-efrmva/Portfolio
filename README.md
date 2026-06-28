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

## Аналитика PostHog

При наличии `POSTHOG_PROJECT_TOKEN` сборка подключает PostHog Web Analytics.
Отслеживаются просмотры и автособираемые взаимодействия, а также события:

- `telegram_click` — клик по кнопке Telegram;
- `works_gallery_opened` — переход к работам с первого экрана;
- `portfolio_reel_opened` — открытие ролика в модальном окне;
- `portfolio_carousel_navigated` — навигация карусели;
- `faq_opened` — открытие вопроса.

Session Replay управляется настройкой проекта PostHog; все поля ввода в записях
маскируются. Опросы пока отключены. Для локальной сборки:

```bash
cp .env.example .env.local
set -a
source .env.local
set +a
npm run build
```

Для GitHub Pages добавьте repository variables:

- `POSTHOG_PROJECT_TOKEN` — публичный project token вида `phc_...`;
- `POSTHOG_HOST` — `https://eu.i.posthog.com` или `https://us.i.posthog.com`.

Если токен не задан, сайт собирается и работает без аналитики.

## Яндекс Метрика

При наличии `YANDEX_METRIKA_ID` сборка подключает Метрику с картой кликов,
отслеживанием ссылок и точным показателем отказов. События PostHog дублируются
как JavaScript-цели Метрики с теми же идентификаторами:

- `telegram_click`;
- `works_gallery_opened`;
- `portfolio_reel_opened`;
- `portfolio_carousel_navigated`;
- `faq_opened`.

Вебвизор отключён, потому что запись сессий уже выполняет PostHog. Для GitHub
Pages добавьте repository variable `YANDEX_METRIKA_ID` с числовым ID счётчика.
Если ID не задан, сайт собирается без Метрики.

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
