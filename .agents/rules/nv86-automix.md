---
trigger: always_on
description: Правила разработки, сборки, дизайна и деплоя проекта NV86 AuToMix
---

# Правила проекта NV86 AuToMix

## 1. Стек и структура проекта
- **Стек:** React + Vite + Tailwind CSS + `framer-motion` + `lucide-react`.
- **Данные:** `src/data/cars.json` (`286` конфигураций авто), VIN-декодер `src/utils/vinDecoder.js`.
- **Обучение (свечи NGK & Denso):** `src/components/SparkPlugGuideModal.jsx` (9 слайдов, реальные каталожные изображения в `public/assets/plugs/*.webp`, фиксированная высота `h-[90vh] sm:h-[88vh]`, Lightbox-зум).
- **Шапка и мобильная версия:** `src/components/Header.jsx` — на `< md` (`< 768px`) все элементы управления убраны в боковой выдвижной Side Drawer («Меню»), чтобы ничего не перекрывало логотип `NV86 AuToMix`.

## 2. Дизайн, графика и шрифты
- **Реальные изображения:** для креплений дворников (`public/assets/mounts/*.png`) и свечей (`public/assets/plugs/*.webp`) использовать только реальные каталожные/3D изображения в оптимизированных форматах (`.webp` / прозрачный `.png`). Запрещены примитивные цветные SVG-заглушки.
- **Относительные пути к ассетам:** в `vite.config.js` задан `base: './'`. Все строковые пути к ресурсам в `src/` должны начинаться с `assets/...` (без ведущего `/`), а в `index.html` — с `./assets/...`.
- **Чёткость шрифтов и производительность:**
  - Основной шрифт: `Golos Text`, моноширинный: `JetBrains Mono` (`index.html`, `src/index.css`, `tailwind.config.js`).
  - Не добавлять `antialiased` на `body` (истончает белый текст на тёмном фоне).
  - Не добавлять `will-change-transform` и тяжёлый `backdrop-blur` на полноэкранные оверлеи и крупные модальные окна (мылит текст и тормозит GPU).

## 3. Команды разработки (Windows PowerShell)
- Запускать npm через `npm.cmd` (из-за политики выполнения PowerShell).
- Локальный сервер: `npm.cmd run dev` (`http://localhost:5173/`).
- Проверка сборки после правок: `npm.cmd run build`.
- После UI-правок проверять сайт в браузере на десктопе (`1440x900`) и мобильном (`412x915` / `375x812`), убеждаясь в отсутствии ошибок консоли и горизонтального переполнения.

## 4. Хостинг и деплой
- **Репозиторий:** `https://github.com/vindera86/Vi86` (ветка `main`, статус **`Public`** — требуется для бесплатного GitHub Pages и работы в РФ без VPN).
- **Боевой хостинг:** **GitHub Pages** → `https://vindera86.github.io/Vi86/` (автосборка `.github/workflows/deploy.yml` при каждом пуше в `main`).
- **Команда публикации обновлений:**
  `git add . ; git commit -m "описание изменений" ; git -c credential.helper=manager push origin main`
- **Безопасность:** никогда не сохранять пароли, токены (`ghp_...`, `github_pat_...`) или ключи в файлы проекта.
