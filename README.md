# Impostor – ¿Quién es el Espía?

Party game mobile-first hecho con **Next.js (App Router), TailwindCSS, Zustand, Framer Motion y PWA**. Juega en un solo dispositivo, reparte roles ocultos y descubre al impostor antes de que sea tarde.

## Características
- 18 paquetes de palabras (600+ pares real/falsa + pista) en español.
- Flujo “pass & play” seguro para repartir roles con animaciones y botones grandes.
- Modo Clásico y Misterioso (los impostores no saben que lo son).
- Opciones configurables: número de impostores, Sr. Blanco, pistas, temporizador, revelar rol al expulsar, empates.
- Packs personalizados guardados en `localStorage`.
- PWA lista para instalar (manifest + service worker básico).
- UI responsive con componentes estilo shadcn/ui, iconos lucide, y transiciones suaves con Framer Motion.

## Scripts
- `npm install` – instala dependencias.
- `npm run dev` – servidor de desarrollo.
- `npm run build` – build de producción.
- `npm start` – sirve el build (ejecuta antes `npm run build`).
- `npm run lint` – linting de Next/ESLint.

## Estructura
- `app/` – Rutas App Router (`/`, `/packs`, `/players`, `/setup`, `/deal`, `/round`, `/vote`, `/results`, `/end`).
- `components/` – UI reutilizable y widgets de juego (PackGrid, PlayerListEditor, RoleRevealCard, Timer, VotingModal, ResultsScreen, PWA register).
- `lib/` – Store Zustand, tipos, helpers y lógica de victoria.
- `data/packs.es.json` – dataset completo de paquetes y pares real/falsa/hint.
- `public/` – manifest, service worker y placeholders de assets (solo SVG/texto; sin binarios en el repo).
- `ASSETS.md` – lista de archivos a reemplazar con tus artes/sonidos.

## Cómo jugar
1. Visita `/packs` y elige un paquete (o marca favoritos).
2. En `/players` ajusta nombres/colores (3–24 jugadores).
3. En `/setup` define reglas: modo, impostores, Sr. Blanco, pistas, temporizador.
4. Ve a `/deal` y reparte el teléfono. Cada jugador revela su rol y palabra (o vacío).
5. En `/round` discutan y usen el temporizador. Pulsa “Votar” para ir a `/vote`.
6. En `/results` muestra expulsados (con o sin rol). El Sr. Blanco puede adivinar si la regla lo permite.
7. `/end` revela todos los roles y las palabras. Usa “Revancha” para reutilizar configuración.

## Deploy en Vercel
1. Haz fork/clona el repo.
2. En Vercel, crea un nuevo proyecto y selecciona este repositorio.
3. Framework: **Next.js**. Comando de build: `npm run build`. Directorio: `.next`.
4. Añade variables si las necesitas (no requeridas por defecto). Deploy y listo.

## Reemplazar assets
- Coloca tus imágenes en `public/assets/...` siguiendo los nombres de `ASSETS.md`.
- Si faltan imágenes, la app usa gradientes + iconos lucide como fallback.

## Añadir más packs
1. Edita `data/packs.es.json` y agrega un objeto `{ id, name, icon, cover, pairs }`.
2. Cada par debe tener `{ real, fake, hint }`.
3. Recarga la app; el pack aparecerá automáticamente. También puedes crear packs en la UI (se guardan localmente).
