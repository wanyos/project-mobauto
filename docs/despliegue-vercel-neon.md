# Despliegue en Vercel + Neon

Vercel para la app, Neon para PostgreSQL. Ambos tienen plan gratuito sin limite de tiempo.

**Coste**: Gratis indefinido (dentro de los limites del free tier).

El despliegue se hace en dos fases:
- **Fase 1**: Crear la base de datos en Neon y ejecutar las migraciones desde local
- **Fase 2**: Desplegar la app en Vercel (con la base de datos ya lista)

---

## Requisitos

- Cuenta en GitHub con el proyecto subido
- Cuenta en [vercel.com](https://vercel.com) (registro con GitHub)
- Cuenta en [neon.tech](https://neon.tech) (registro con GitHub)

---

## FASE 1 — Preparar la base de datos

### Paso 1 — Crear la base de datos en Neon

1. Ve a [neon.tech](https://neon.tech) y crea una cuenta
2. Click en "Create Project"
3. Configuracion:
   - **Project name**: `mobauto`
   - **Region**: `eu-central-1` (Frankfurt, mas cercano a Espana)
   - **PostgreSQL version**: 16
4. Click en "Create Project"
5. Neon te mostrara el **connection string**. Copialo, tiene este formato:
   ```
   postgresql://mobauto_owner:abc123@ep-cool-name-12345.eu-central-1.aws.neon.tech/mobauto?sslmode=require
   ```
6. Guardalo, lo necesitaras en todos los pasos siguientes

### Paso 2 — Ejecutar migraciones y seed desde local

Esto crea las tablas y carga los datos iniciales. Se hace antes de desplegar para que la app arranque con la base de datos lista.

**1. Instala `dotenv-cli` si no lo tienes:**
```bash
npm install -g dotenv-cli
```

**2. Crea el archivo `.env.production` en la raiz del proyecto** (en VS Code: click derecho > "New File"):
```
DATABASE_URL="postgresql://mobauto_owner:abc123@ep-cool-name-12345.eu-central-1.aws.neon.tech/mobauto?sslmode=require"
```
Sustituye con tu connection string real de Neon.

> **Este archivo NO debe subirse a GitHub.** Verifica que `.env.production` esta en tu `.gitignore`.

**3. Ejecuta las migraciones y el seed:**
```bash
npx dotenv -e .env.production -- npx prisma migrate deploy
npx dotenv -e .env.production -- npx prisma db seed
```

Esto crea todas las tablas y carga los datos iniciales (admin, servicios, horarios).

---

## FASE 2 — Desplegar en Vercel

### Paso 3 — Crear proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com) y logueate con GitHub
2. Click en "Add New..." > "Project"
3. Importa el repositorio `project-mobauto`
4. En la pantalla de configuracion, expande **"Build & Output Settings"** y pon:
   - **Build Command**: `npx prisma generate && npm run build`

> **Por que es necesario**: Prisma genera su cliente en `app/generated/prisma/`. Sin `prisma generate`, el build falla con `Could not resolve "../../app/generated/prisma/client"`.

### Paso 4 — Configurar variables de entorno en Vercel

En la misma pantalla de configuracion, antes de hacer click en "Deploy":

| Variable | Valor |
|---|---|
| `DATABASE_URL` | El connection string de Neon (paso 1) |
| `JWT_SECRET` | (genera uno con el comando de abajo) |
| `NODE_ENV` | `production` |

Para generar un `JWT_SECRET` seguro:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Paso 5 — Hacer deploy

1. Click en "Deploy"
2. Vercel construye la app y la despliega
3. En unos minutos tendras tu URL: `project-mobauto.vercel.app`

> **Deploy automatico**: A partir de ahora, cada `git push` a `main` redespliega la app automaticamente.

### Paso 6 — Conectar dominio propio (opcional)

1. En Vercel, ve a tu proyecto > "Settings" > "Domains"
2. Escribe `mobauto.es` y click en "Add"
3. Vercel te mostrara los registros DNS necesarios:
   - **Tipo A**: `76.76.21.21` (para `mobauto.es`)
   - **Tipo CNAME**: `cname.vercel-dns.com` (para `www.mobauto.es`)
4. En tu proveedor DNS (p.ej. Cloudflare) anade:

| Tipo | Nombre | Contenido | Proxy |
|---|---|---|---|
| A | `@` | `76.76.21.21` | DNS only (nube gris) |
| CNAME | `www` | `cname.vercel-dns.com` | DNS only (nube gris) |

> **Importante**: Desactiva el proxy de Cloudflare (nube gris, no naranja). Vercel necesita gestionar el SSL directamente.

5. Espera 5-30 minutos a que se propaguen los DNS

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

---

## Limites del free tier

- **Neon**: 0.5 GB de almacenamiento, 190 horas de computo/mes
- **Vercel**: 100 GB de ancho de banda/mes, deploys ilimitados
