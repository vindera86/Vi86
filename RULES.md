# Правила проекта NV86 AuToMix (`RULES.md`)

> Эта инструкция хранится в корне проекта и дублируется в `.agents/rules/nv86-automix.md` для автоматического применения ИИ-ассистентом.

## 1. Архитектура и ключевые файлы
- **Стек:** React + Vite + Tailwind CSS + `framer-motion` + `lucide-react`.
- **Каталог авто:** `src/data/cars.json` (`280` конфигураций), декодер VIN: `src/utils/vinDecoder.js`.
- **Обучение по свечам:** `src/components/SparkPlugGuideModal.jsx` — 9 слайдов с реальными фото из каталогов NGK и Denso (`public/assets/plugs/*.webp`), фиксированной высотой `h-[90vh] sm:h-[88vh]` (без скачков) и полноэкранным зумом.
- **Мобильное меню:** `src/components/Header.jsx` — на экранах `< 768px` (Samsung S24 Ultra и др.) используется выдвижной Side Drawer справа («Меню»).

## 2. Требования к графике и шрифтам
- Для креплений дворников и свечей используются реальные/студийные фото (`public/assets/mounts/*.png`, `public/assets/plugs/*.webp`), без примитивных SVG-заглушек.
- Все пути к ассетам в компонентах пишутся относительно без `/` в начале (`assets/...`), в `vite.config.js` используется `base: './'`.
- Основной шрифт: **`Golos Text`**, моноширинный: **`JetBrains Mono`**. Не использовать `antialiased` на `body` и `will-change-transform` / тяжёлый `backdrop-blur` на больших модалках.

## 3. Команды и проверка (Windows PowerShell)
- Локальный запуск: `npm.cmd run dev` (`http://localhost:5173/`).
- Сборка: `npm.cmd run build`.
- После изменений проверять десктоп (`1440×900`) и мобильную версию (`412×915`, `375×812`) в браузере (0 ошибок в консоли, без горизонтального скролла).

## 4. Публикация и безопасность
- **Живой сайт:** https://nv86-automix.pages.dev/ (Cloudflare Pages, бесплатный тариф с безлимитным трафиком).
- **Репозиторий GitHub:** https://github.com/vindera86/Vi86 (ветка `main`, строго **`Private`** — не делать публичным!).
- **Обновление сайта на проде:**
  ```powershell
  git add .
  git commit -m "Обновление сайта"
  git -c credential.helper=manager push origin main
  ```
- Через ~30 секунд после `git push` Cloudflare Pages автоматически обновит https://nv86-automix.pages.dev/.
- Запрещено сохранять токены и секреты в файлы репозитория.
