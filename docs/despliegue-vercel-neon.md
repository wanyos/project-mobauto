# Despliegue en Vercel + Neon

Vercel para la app, Neon para PostgreSQL. Ambos tienen plan gratuito sin limite de tiempo.

**Coste**: Gratis indefinido (dentro de los limites del free tier).

---

## Requisitos

- Cuenta en GitHub con el proyecto subido
- Cuenta en [vercel.com](https://vercel.com) (registro con GitHub)
- Cuenta en [neon.tech](https://neon.tech) (registro con GitHub)

---

## Paso 1 — Crear la base de datos en Neon

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
6. Guardalo, lo necesitaras en el paso 3

## Paso 2 — Desplegar en Vercel

1. Ve a [vercel.com](https://vercel.com) y logueate con GitHub
2. Click en "Add New..." > "Project"
3. Importa el repositorio `project-mobauto`
4. Vercel detectara que es Nuxt y configurara el build automaticamente
5. **Antes de hacer click en "Deploy"**, configura las variables de entorno (paso 3)

## Paso 3 — Configurar variables de entorno en Vercel

En la pantalla de deploy (o despues en Settings > Environment Variables):

| Variable | Valor |
|---|---|
| `DATABASE_URL` | El connection string de Neon (paso 1) |
| `JWT_SECRET` | (genera uno con el comando de abajo) |
| `NODE_ENV` | `production` |

Para generar un `JWT_SECRET` seguro:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Paso 4 — Ejecutar migraciones contra Neon

Desde tu maquina local, apuntando a la base de datos de Neon:

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

## Paso 5 — Hacer deploy

1. Haz push a GitHub:
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push
   ```
2. Vercel detecta el push y despliega automaticamente
3. En unos minutos tendras tu URL: `project-mobauto.vercel.app`

> **Deploy automatico**: A partir de ahora, cada `git push` a `main` redespliega la app automaticamente.

## Paso 6 — Conectar dominio propio (opcional)

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
6. Vercel verificara automaticamente y generara el certificado SSL

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
