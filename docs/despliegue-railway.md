# Despliegue en Railway

Railway despliega la app y la base de datos en un solo sitio. La opcion mas rapida para empezar.

**Coste**: $5 de credito gratis (30 dias), luego ~$5/mes.

El despliegue se hace en dos fases:
- **Fase 1**: Crear cuenta, base de datos y configurar variables — sin hacer deploy todavia
- **Fase 2**: Configurar el build y hacer el primer deploy

---

## Requisitos

- Cuenta en GitHub con el proyecto subido
- Cuenta en [railway.com](https://railway.com) (registro con GitHub)

---

## FASE 1 — Preparar antes de desplegar

### Paso 1 — Crear cuenta en Railway

1. Ve a [railway.com](https://railway.com)
2. Click en "Login" > "Login with GitHub"
3. Autoriza Railway en tu cuenta de GitHub
4. Recibes $5 de credito gratis (30 dias para usarlo)

### Paso 2 — Crear proyecto e importar el repo

1. Click en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Busca y selecciona el repositorio `project-mobauto`
4. **Importante**: cuando Railway pregunte si desplegar ahora, cancela o espera — primero hay que configurar la base de datos y las variables

### Paso 3 — Anadir PostgreSQL

1. En el canvas del proyecto, click en "+ New"
2. Selecciona "Database" > "Add PostgreSQL"
3. Railway crea la base de datos automaticamente

### Paso 4 — Configurar variables de entorno

En el servicio de tu app (no en la base de datos), ve a "Variables" y anade:

| Variable | Valor |
|---|---|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `JWT_SECRET` | (genera uno con el comando de abajo) |
| `NODE_ENV` | `production` |

> `${{Postgres.DATABASE_URL}}` es una referencia interna de Railway que se resuelve automaticamente con la URL de tu Postgres. No hay que escribir la URL manualmente.

Para generar un `JWT_SECRET` seguro:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## FASE 2 — Desplegar

### Paso 5 — Configurar el build

En el servicio de tu app, ve a "Settings":

- **Build Command**: `npx prisma generate && npm run build`
- **Start Command**: `node .output/server/index.mjs`
- **Root Directory**: `/` (dejar por defecto)

> **Build Command**: incluye `npx prisma generate` para generar el cliente de Prisma. Sin esto, el build falla con `Could not resolve "../../app/generated/prisma/client"`.

### Paso 6 — Hacer el primer deploy

1. En el servicio, click en "Deploy" (o haz un `git push` para que Railway lo detecte)
2. Puedes ver los logs en tiempo real
3. En los logs deberias ver que el servidor arranca correctamente

### Paso 7 — Ejecutar migraciones y seed

Las migraciones crean las tablas. Se ejecutan una sola vez desde tu maquina local.

**1. Obtener el DATABASE_URL real de Railway:**
Ve al servicio de PostgreSQL en Railway > pestana "Variables" > copia el valor de `DATABASE_URL`.

**2. Instala `dotenv-cli` si no lo tienes:**
```bash
npm install -g dotenv-cli
```

**3. Crea el archivo `.env.production` en la raiz del proyecto:**
```
DATABASE_URL="postgresql://postgres:password@roundhouse.proxy.rlwy.net:PORT/railway"
```
Sustituye con el valor real de Railway.

> **Este archivo NO debe subirse a GitHub.** Verifica que `.env.production` esta en tu `.gitignore`.

**4. Ejecuta las migraciones y el seed:**
```bash
npx dotenv -e .env.production -- npx prisma migrate deploy
npx dotenv -e .env.production -- npx prisma db seed
```

Esto crea todas las tablas y carga los datos iniciales (admin, servicios, horarios).

### Paso 8 — Generar dominio publico

1. En tu servicio, ve a "Settings" > "Networking"
2. Click en "Generate Domain"
3. Railway te da una URL tipo: `project-mobauto-production.up.railway.app`

### Paso 9 — Conectar dominio propio (opcional)

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
| Migrar BD de produccion | `npx dotenv -e .env.production -- npx prisma migrate deploy` |
| Seed en produccion | `npx dotenv -e .env.production -- npx prisma db seed` |
| Ver BD en Prisma Studio | `npx dotenv -e .env.production -- npx prisma studio` |
| Build local para probar | `npm run build` |
| Preview local del build | `npm run preview` |
