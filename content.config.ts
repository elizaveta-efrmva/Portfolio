export type VideoSource =
  | { kind: "placeholder" }
  | { kind: "file"; src: string }
  | { kind: "embed"; provider: "vk" | "kinescope" | "youtube" | "vimeo" | "rutube"; url: string }
  | { kind: "link"; url: string };

export type Work = {
  id: string;
  title: string;
  category: "Reels" | "Обучающие" | "Talking head" | "Промо";
  orientation: "horizontal" | "vertical";
  poster: string;
  source: VideoSource;
  description: string;
  tags: string[];
};

export const content = {
  meta: {
    name: "Имя Фамилия",
    role: "Видеомонтажер / Motion-дизайнер",
    title: "Имя Фамилия — видеомонтажер",
    description:
      "Портфолио видеомонтажера: reels, обучающие видео, talking head, промо и motion-графика.",
  },
  hero: {
    eyebrow: "Video editing portfolio",
    headline: "Монтирую видео, которые держат внимание",
    subline:
      "Reels, обучающие ролики, talking head, типографика, AI-вставки и промо-ролики для соцсетей.",
    ctaPrimary: "Смотреть работы",
    ctaSecondary: "Связаться",
    showreelTitle: "Showreel",
    showreelPoster: "/posters/showreel.svg",
    showreelSource: { kind: "placeholder" } as VideoSource,
  },
  stats: [
    { value: "4", label: "формата видео" },
    { value: "9:16 / 16:9", label: "вертикаль и горизонталь" },
    { value: "AI + motion", label: "визуальные вставки" },
  ],
  works: [
    {
      id: "edu-ai",
      title: "Обучающее видео с AI-иллюстрациями",
      category: "Обучающие",
      orientation: "horizontal",
      poster: "/posters/edu-ai.svg",
      source: { kind: "placeholder" },
      description:
        "Структурный монтаж обучающего ролика: логика подачи, темп, иллюстрации и визуальные акценты.",
      tags: ["education", "AI visuals", "story"],
    },
    {
      id: "typography-reels",
      title: "Типографика для reels",
      category: "Reels",
      orientation: "vertical",
      poster: "/posters/typography.svg",
      source: { kind: "placeholder" },
      description:
        "Динамичный вертикальный ролик с крупной типографикой, ритмом и удержанием внимания в первые секунды.",
      tags: ["reels", "typography", "social"],
    },
    {
      id: "dentists",
      title: "Стоматологи — тестовый дизайн",
      category: "Промо",
      orientation: "horizontal",
      poster: "/posters/dentists.svg",
      source: { kind: "placeholder" },
      description:
        "Промо-формат для экспертной ниши: чистая структура, аккуратные переходы и понятный визуальный сценарий.",
      tags: ["promo", "clinic", "clean edit"],
    },
    {
      id: "talking-head-ai",
      title: "Talking head + AI-вставки",
      category: "Talking head",
      orientation: "vertical",
      poster: "/posters/talking-head.svg",
      source: { kind: "placeholder" },
      description:
        "Монтаж говорящей головы с визуальными перебивками, AI-иллюстрациями и субтитрами под соцсети.",
      tags: ["talking head", "AI", "subtitles"],
    },
  ] satisfies Work[],
  about: {
    title: "Монтаж с фокусом на темп, смысл и удержание",
    text:
      "Я собираю ролики так, чтобы зритель быстро понял контекст, не потерял нить и досмотрел до ключевого действия. Работаю с короткими форматами, экспертным контентом, обучающими видео и промо.",
    portrait: "/posters/about.svg",
    tools: ["Premiere Pro", "After Effects", "DaVinci Resolve", "CapCut", "AI-инструменты"],
  },
  services: [
    {
      title: "Reels и shorts",
      text: "Вертикальные ролики с сильным первым экраном, субтитрами, ритмом и понятной драматургией.",
    },
    {
      title: "Экспертные видео",
      text: "Talking head, обучающие ролики, лекции и разборы без ощущения длинной записи.",
    },
    {
      title: "Motion и типографика",
      text: "Титры, акценты, простая графика, AI-вставки и оформление под визуальный стиль автора.",
    },
  ],
  contacts: {
    telegram: "https://t.me/PLACEHOLDER",
    email: "PLACEHOLDER@example.com",
  },
} as const;
