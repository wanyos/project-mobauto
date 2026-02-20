# Despliegue en SeeNode

SeeNode es una plataforma sencilla con precios economicos y PostgreSQL incluido.

**Coste**: 7 dias de prueba gratis, despues $3/mes (app) + $1/mes (base de datos).

---

## Requisitos

- Cuenta en GitHub con el proyecto subido
- Cuenta en [seenode.com](https://seenode.com)

---

## Paso 1 — Crear cuenta

1. Ve a [seenode.com](https://seenode.com)
2. Registrate (puedes usar GitHub)
3. Tienes 7 dias de prueba gratis

## Paso 2 — Crear el servicio web

1. En el dashboard, click en "New" > "Web Service"
2. Conecta tu cuenta de GitHub si no lo has hecho
3. Autoriza SeeNode para acceder a tus repositorios
4. Selecciona el repositorio `project-mobauto` y la rama `main`

## Paso 3 — Configurar el servicio

SeeNode detecta el proyecto automaticamente, pero ajusta estos valores:

- **Name**: `mobauto`
- **Root Directory**: dejar vacio (raiz del repositorio)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npx prisma migrate deploy && node .output/server/index.mjs`

> **Build Command**: debe incluir `npm install` porque SeeNode no instala las dependencias automaticamente. Sin esto, el build falla con `nuxt: not found`.
>
> **Start Command**: las migraciones van aqui (no en el build) porque SeeNode inyecta las variables de entorno solo en tiempo de ejecucion.

## Paso 4 — Configurar variables de entorno del servicio web

En tu servicio web, ve a la seccion de variables de entorno y anade:

| Variable | Valor | Descripcion |
|---|---|---|
| `PORT` | `80` | Sin esto la app escucha en el 3000 y SeeNode devuelve 502 Bad Gateway |
| `HOST` | `0.0.0.0` | La app debe escuchar en todas las interfaces |
| `NODE_ENV` | `production` | Modo produccion |
| `JWT_SECRET` | (genera uno con el comando de abajo) | Clave para firmar tokens JWT |

Para generar un `JWT_SECRET` seguro:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Paso 5 — Primer deploy (sin base de datos)

1. Click en "Create Web Service"
2. SeeNode clonara el repo, instalara dependencias y hara build
3. Puedes ver los logs en tiempo real
4. La app estara online pero sin base de datos todavia

> **Deploy automatico**: A partir de ahora, cada `git push` a `main` redespliega la app automaticamente.

## Paso 6 — Crear la base de datos PostgreSQL

1. En el dashboard, click en "New" > "Database"
2. Selecciona "PostgreSQL"
3. Ponle nombre: `mobauto-db`
4. **Importante**: Selecciona la misma region que tu servicio web
5. SeeNode mostrara los parametros de conexion individuales:
   ```
   database = db_xxxxxxxx
   username = db_xxxxxxxx
   password = **********
   host     = up-de-fra1-postgresql-1.db.run-on-seenode.com
   port     = 11550
   ```
6. Con esos datos, construye el `DATABASE_URL` con este formato:
   ```
   postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE
   ```
   Ejemplo:
   ```
   postgresql://db_xxxxxxxx:tu_password@up-de-fra1-postgresql-1.db.run-on-seenode.com:11550/db_xxxxxxxx
   ```

## Paso 7 — Conectar la base de datos al servicio web

1. Ve a tu **Web Service** > pestana **Environment**
2. Anade la variable:

| Variable | Valor |
|---|---|
| `DATABASE_URL` | El connection string construido en el paso anterior |

3. Fuerza un redeploy para que la app coja la nueva variable:
   ```bash
   git commit --allow-empty -m "connect production database" && git push
   ```

## Paso 8 — Ejecutar migraciones y seed

Desde tu maquina local:

**1. Instala `dotenv-cli` si no lo tienes:**
```bash
npm install -g dotenv-cli
```

**2. Crea el archivo `.env.production` en la raiz del proyecto** (en VS Code: click derecho > "New File"):
```
DATABASE_URL="postgresql://db_xxxxxxxx:tu_password@up-de-fra1-postgresql-1.db.run-on-seenode.com:11550/db_xxxxxxxx"
```
Sustituye con tus datos reales de SeeNode.

> **Este archivo NO debe subirse a GitHub.** Verifica que `.env.production` esta en tu `.gitignore`.

**3. Ejecuta las migraciones y el seed:**
```bash
npx dotenv -e .env.production -- npx prisma migrate deploy
npx dotenv -e .env.production -- npx prisma db seed
```

Esto crea todas las tablas y carga los datos iniciales (admin, servicios, horarios).

## Paso 9 — Verificar

1. Abre la URL que SeeNode te ha asignado
2. Prueba registro, login, reservar cita
3. Entra como admin (`admin@mobauto.es` / `admin123`) y verifica el panel

> **Dominio propio**: SeeNode tiene esta funcionalidad como "Coming Soon". Cuando este disponible, el proceso sera similar al de otros proveedores.

---

## Resumen de comandos

| Accion | Comando |
|---|---|
| Generar JWT_SECRET | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| Migrar BD de produccion | `npx dotenv -e .env.production -- npx prisma migrate deploy` |
| Seed en produccion | `npx dotenv -e .env.production -- npx prisma db seed` |
| Ver BD en Prisma Studio | `npx dotenv -e .env.production -- npx prisma studio` |
| Forzar redeploy | `git commit --allow-empty -m "trigger redeploy" && git push` |
| Build local para probar | `npm run build` |
| Preview local del build | `npm run preview` |
