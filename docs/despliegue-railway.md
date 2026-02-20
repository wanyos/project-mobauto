# Despliegue en Railway

Railway despliega la app y la base de datos en un solo sitio. La opcion mas rapida para empezar.

**Coste**: $5 de credito gratis (30 dias), luego ~$5/mes.

---

## Requisitos

- Cuenta en GitHub con el proyecto subido
- Cuenta en [railway.com](https://railway.com) (registro con GitHub)

---

## Paso 1 — Crear cuenta en Railway

1. Ve a [railway.com](https://railway.com)
2. Click en "Login" > "Login with GitHub"
3. Autoriza Railway en tu cuenta de GitHub
4. Recibes $5 de credito gratis (30 dias para usarlo)

## Paso 2 — Crear proyecto

1. Click en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Busca y selecciona el repositorio `project-mobauto`
4. Railway detectara que es un proyecto Node.js/Nuxt automaticamente

## Paso 3 — Anadir PostgreSQL

1. En el canvas del proyecto, click en "+ New"
2. Selecciona "Database" > "Add PostgreSQL"
3. Railway crea la base de datos y genera las variables de entorno automaticamente

## Paso 4 — Configurar variables de entorno

En el servicio de tu app (no en la base de datos), ve a "Variables" y anade:

| Variable | Valor |
|---|---|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `JWT_SECRET` | (genera uno con el comando de abajo) |
| `NODE_ENV` | `production` |

> `${{Postgres.DATABASE_URL}}` es una referencia interna de Railway que se resuelve automaticamente con la URL de tu Postgres.

Para generar un `JWT_SECRET` seguro:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Paso 5 — Configurar el build

En el servicio de tu app, ve a "Settings":

- **Build Command**: `npm run build`
- **Start Command**: `npx prisma migrate deploy && node .output/server/index.mjs`
- **Root Directory**: `/` (dejar por defecto)

> Las migraciones se ejecutan en el Start Command para que Railway tenga acceso a las variables de entorno.

## Paso 6 — Ejecutar el seed (datos iniciales)

Una vez desplegada la app, ejecuta el seed desde la pestana "Shell" del servicio:

```bash
npx prisma db seed
```

Esto crea el usuario admin (`admin@mobauto.es` / `admin123`), los servicios y la configuracion de horarios.

## Paso 7 — Generar dominio publico

1. En tu servicio, ve a "Settings" > "Networking"
2. Click en "Generate Domain"
3. Railway te da una URL tipo: `project-mobauto-production.up.railway.app`

## Paso 8 — Conectar dominio propio (opcional)

1. En "Settings" > "Networking" > "Custom Domain", escribe `mobauto.es`
2. Railway te mostrara un registro CNAME
3. En tu proveedor DNS (p.ej. Cloudflare), anade:

| Tipo | Nombre | Contenido | Proxy |
|---|---|---|---|
| CNAME | `@` | (el valor que te da Railway) | DNS only |
| CNAME | `www` | (el mismo valor) | DNS only |

4. Espera a que Railway verifique el dominio (5-30 min)

---

## Resumen de comandos

| Accion | Comando |
|---|---|
| Generar JWT_SECRET | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| Seed desde shell de Railway | `npx prisma db seed` |
| Build local para probar | `npm run build` |
| Preview local del build | `npm run preview` |
