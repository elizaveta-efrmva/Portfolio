# Деплой на GitHub Pages

## 1. Репозиторий

Создайте публичный репозиторий на GitHub и отправьте туда код. Для тестового этапа можно использовать репозиторий `iliabloshenko-cpu/video-portfolio`.

```bash
git remote add origin https://github.com/iliabloshenko-cpu/video-portfolio.git
git branch -M main
git push -u origin main
```

Если remote уже есть, используйте `git remote set-url origin <url>`.

## 2. Pages

В репозитории откройте:

```text
Settings -> Pages -> Source -> GitHub Actions
```

После следующего push в `main` запустится workflow `Deploy to GitHub Pages`.

## 3. BASE_PATH

Проект использует `BASE_PATH` из переменных GitHub Actions.

Repo-pages:

```text
https://username.github.io/video-portfolio/
BASE_PATH=/video-portfolio
```

User-pages:

```text
https://username.github.io/
BASE_PATH пустой
```

Где задать:

```text
Settings -> Secrets and variables -> Actions -> Variables -> New repository variable
```

Имя переменной: `BASE_PATH`.

## 4. Как работает workflow

Файл `.github/workflows/deploy.yml`:

1. устанавливает Node.js 20;
2. выполняет `npm ci`;
3. запускает `npm run build`;
4. загружает папку `out/`;
5. публикует ее через `actions/deploy-pages`.

## 5. Проверка перед push

```bash
npm run lint
npm run build
```

После сборки можно посмотреть статическую версию локально:

```bash
npx serve out
```

## 6. Перенос на аккаунт подруги

1. Подруга создает пустой репозиторий.
2. Вы меняете remote:

```bash
git remote set-url origin https://github.com/<username>/<repo>.git
```

3. Пушите `main`.
4. Включаете Pages через GitHub Actions.
5. Выставляете `BASE_PATH=/<repo>`, если это repo-pages.
6. Оставляете `BASE_PATH` пустым, если репозиторий называется `<username>.github.io`.

Дополнительных правок в коде для переноса не требуется.

## 7. Кастомный домен

Если нужен свой домен, добавьте файл `public/CNAME` с доменом внутри и настройте DNS по инструкции GitHub Pages.
