# Despliegue de Mobauto — Guia paso a paso

Tres opciones para desplegar el proyecto con base de datos PostgreSQL real.

| | Railway | Vercel + Neon | SeeNode |
|---|---|---|---|
| Dificultad | Facil | Media | Facil |
| Coste | $5 gratis (30 dias) | Gratis indefinido | $3/mes app + $1/mes BD |
| PostgreSQL | Incluido | Neon (gratis) | Incluido ($1/mes) |
| Dominio propio | Si | Si | Proximamente |
| Ideal para | Probar rapido | Produccion gratuita | Hosting economico |

---

## Opcion A — Railway (todo en uno)

Railway te permite desplegar la app + base de datos en un solo sitio.

### Requisitos

- Cuenta en GitHub con el proyecto subido
- Cuenta en [railway.com](https://railway.com) (registro con GitHub)

### Paso 1 — Crear cuenta en Railway

1. Ve a [railway.com](https://railway.com)
2. Click en "Login" > "Login with GitHub"
3. Autoriza Railway en tu cuenta de GitHub
4. Recibes $5 de credito gratis (30 dias para usarlo)

### Paso 2 — Crear proyecto

1. Click en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Busca y selecciona tu repositorio `project-mobauto`
4. Railway detectara que es un proyecto Node.js/Nuxt automaticamente

### Paso 3 — Anadir PostgreSQL

1. En el canvas del proyecto, click en "+ New"
2. Selecciona "Database" > "Add PostgreSQL"
3. Railway crea la base de datos y genera las variables de entorno automaticamente

### Paso 4 — Configurar variables de entorno

En el servicio de tu app (no en la base de datos), ve a "Variables" y anade:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=tu_clave_secreta_aqui_cambiar_en_produccion
NODE_ENV=production
```

> `${{Postgres.DATABASE_URL}}` es una referencia interna de Railway que se resuelve automaticamente con la URL de tu Postgres.

### Paso 5 — Configurar el build

En el servicio de tu app, ve a "Settings":

- **Build Command**: `npm run build`
- **Start Command**: `node .output/server/index.mjs`
- **Root Directory**: `/` (dejar por defecto)

Railway deberia detectar esto automaticamente, pero verificalo.

### Paso 6 — Ejecutar migraciones de Prisma

Opcion A — Anadir al build (recomendado):

Edita `package.json` para que las migraciones se ejecuten en cada deploy:

```json
{
  "scripts": {
    "build": "prisma migrate deploy && prisma generate && nuxt build"
  }
}
```

Opcion B — Ejecutar manualmente desde Railway:

1. En el servicio de tu app, ve a la pestana "Shell"
2. Ejecuta: `npx prisma migrate deploy`
3. Ejecuta: `npx prisma db seed`

### Paso 7 — Generar dominio publico

1. En tu servicio, ve a "Settings" > "Networking"
2. Click en "Generate Domain"
3. Railway te da una URL tipo: `project-mobauto-production.up.railway.app`

### Paso 8 — Verificar

1. Abre la URL que te dio Railway
2. Navega por la web, prueba el registro, login, reservar cita
3. Los datos ahora se guardan en PostgreSQL real

---

## Opcion B — Vercel + Neon (gratis indefinido)

Vercel para la app, Neon para PostgreSQL. Ambos tienen plan gratuito sin limite de tiempo.

### Requisitos

- Cuenta en GitHub con el proyecto subido
- Cuenta en [vercel.com](https://vercel.com) (registro con GitHub)
- Cuenta en [neon.tech](https://neon.tech) (registro con GitHub)

### Paso 1 — Crear la base de datos en Neon

1. Ve a [neon.tech](https://neon.tech) y crea una cuenta
2. Click en "Create Project"
3. Configuracion:
   - **Project name**: `mobauto`
   - **Region**: `eu-central-1` (Frankfurt, mas cercano a Espana)
   - **PostgreSQL version**: 16
4. Click en "Create Project"
5. Neon te mostrara el **connection string**. Copialo, es algo como:
   ```
   postgresql://mobauto_owner:abc123@ep-cool-name-12345.eu-central-1.aws.neon.tech/mobauto?sslmode=require
   ```
6. Guardalo en un lugar seguro, lo necesitaras luego

### Paso 2 — Desplegar en Vercel

1. Ve a [vercel.com](https://vercel.com) y logueate con GitHub
2. Click en "Add New..." > "Project"
3. Importa tu repositorio `project-mobauto`
4. Vercel detectara que es Nuxt y configurara el build automaticamente
5. **Antes de hacer click en "Deploy"**, configura las variables de entorno:

### Paso 3 — Configurar variables de entorno en Vercel

En la pantalla de deploy (o en Settings > Environment Variables despues):

| Variable | Valor |
|---|---|
| `DATABASE_URL` | El connection string de Neon (paso 1.5) |
| `JWT_SECRET` | Una cadena secreta larga y aleatoria |
| `NODE_ENV` | `production` |

> **Tip**: Para generar un JWT_SECRET seguro, abre una terminal y ejecuta:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### Paso 4 — Configurar el build para Prisma

Igual que en Railway, edita `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && nuxt build",
    "postinstall": "prisma generate && nuxt prepare"
  }
}
```

> **Nota**: En Vercel usamos `prisma generate` (no `migrate deploy`) porque las migraciones las ejecutamos manualmente contra Neon. Vercel es serverless y no deberia ejecutar migraciones en cada deploy.

### Paso 5 — Ejecutar migraciones contra Neon

Desde tu maquina local, apuntando a la base de datos de Neon:

```bash
# Crear un archivo .env.production con la URL de Neon
echo 'DATABASE_URL="postgresql://mobauto_owner:abc123@ep-cool-name-12345.eu-central-1.aws.neon.tech/mobauto?sslmode=require"' > .env.production

# Ejecutar migraciones contra Neon
npx dotenv -e .env.production -- npx prisma migrate deploy

# Ejecutar el seed (datos iniciales)
npx dotenv -e .env.production -- npx prisma db seed
```

Instala `dotenv-cli` si no lo tienes:
```bash
npm install -g dotenv-cli
```

### Paso 6 — Hacer deploy

1. Haz push a GitHub:
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push
   ```
2. Vercel detecta el push y despliega automaticamente
3. En unos minutos tendras tu URL: `project-mobauto.vercel.app`

### Paso 7 — Verificar

1. Abre la URL de Vercel
2. Prueba todas las funcionalidades
3. Los datos se guardan en Neon PostgreSQL

---

## Opcion C — SeeNode

SeeNode es una plataforma sencilla con precios economicos y PostgreSQL incluido.

### Requisitos

- Cuenta en GitHub con el proyecto subido
- Cuenta en [seenode.com](https://seenode.com)

### Paso 1 — Crear cuenta

1. Ve a [seenode.com](https://seenode.com)
2. Registrate (puedes usar GitHub)
3. Tienes 7 dias de prueba gratis
4. Despues: $3/mes por la app + $1/mes por PostgreSQL

### Paso 2 — Crear el servicio web

1. En el dashboard, click en "New" > "Web Service"
2. Conecta tu cuenta de GitHub si no lo has hecho
3. Autoriza SeeNode para acceder a tus repositorios
4. Selecciona el repositorio `project-mobauto` y la rama `main`

### Paso 3 — Configurar el servicio

SeeNode detecta el proyecto automaticamente, pero hay que ajustar algunos valores:

- **Name**: `mobauto`
- **Root Directory**: dejar vacio (por defecto, raiz del repositorio)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `node .output/server/index.mjs`

> **Importante**: El build command debe incluir `npm install` porque SeeNode no instala las dependencias automaticamente antes del build. Sin esto, el build falla con `nuxt: not found`.

### Paso 4 — Configurar variables de entorno

En tu servicio web, ve a la seccion de variables de entorno y anade:

| Variable | Valor | Descripcion |
|---|---|---|
| `PORT` | `80` | Puerto en el que escucha la app (SeeNode espera el 80 por defecto) |
| `HOST` | `0.0.0.0` | La app debe escuchar en todas las interfaces |
| `NODE_ENV` | `production` | Modo produccion |
| `JWT_SECRET` | (cadena aleatoria) | Clave para firmar tokens JWT |

> **Importante**: Sin `PORT=80`, la app escucha en el puerto 3000 (por defecto de Nuxt) y SeeNode devuelve un error `502 Bad Gateway`.

Para generar un `JWT_SECRET` seguro:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Paso 5 — Deploy

1. Click en "Create Web Service"
2. SeeNode clonara el repo, instalara dependencias y hara build
3. Puedes ver los logs en tiempo real
4. En los logs deberias ver: `Listening on http://0.0.0.0:80`
5. En 1-5 minutos tu app estara online con una URL de SeeNode

> **Deploy automatico**: A partir de ahora, cada vez que hagas `git push` a la rama `main`, SeeNode detecta el cambio y redespliega la app automaticamente. No hace falta hacer nada en el panel.

> **Nota sobre variables de entorno**: Si cambias una variable de entorno en el panel de SeeNode, necesitas forzar un nuevo deploy (no basta con guardar) porque SeeNode inyecta las variables en build time. Para forzar un redeploy sin cambios de codigo:
> ```bash
> git commit --allow-empty -m "trigger redeploy" && git push
> ```

### Paso 6 — Anadir PostgreSQL

1. En el dashboard, click en "New" > "Database"
2. Selecciona "PostgreSQL"
3. Ponle nombre: `mobauto-db`
4. **Importante**: Selecciona la misma region que tu servicio web
5. SeeNode mostrara los parametros de conexion individuales (no un connection string listo):
   ```
   database = db_xxxxxxxx
   username = db_xxxxxxxx
   password = **********
   host     = up-de-fra1-postgresql-1.db.run-on-seenode.com
   port     = 11550
   ```
6. Con esos datos, construye el `DATABASE_URL` manualmente con este formato:
   ```
   postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE
   ```
   Ejemplo real:
   ```
   postgresql://db_kmkyzrebpxos:tu_password@up-de-fra1-postgresql-1.db.run-on-seenode.com:11550/db_kmkyzrebpxos
   ```

### Paso 7 — Conectar la base de datos al servicio web

1. Ve a tu **Web Service** (no a la database) > pestana **Environment**
2. Anade la variable:

| Variable | Valor |
|---|---|
| `DATABASE_URL` | El connection string construido en el paso anterior |

3. Guarda y fuerza un redeploy para que la app coja la nueva variable:
   ```bash
   git commit --allow-empty -m "connect production database" && git push
   ```

### Paso 8 — Ejecutar migraciones

Desde tu maquina local (en la raiz del proyecto `project-mobauto`):

**1. Instala `dotenv-cli` si no lo tienes:**
```bash
npm install -g dotenv-cli
```

**2. Crea el archivo `.env.production` en la raiz del proyecto.**

Puedes crearlo a mano desde VS Code: click derecho en el explorador de archivos > "New File" > `.env.production`, y pega dentro:
```
DATABASE_URL="postgresql://db_xxxxxxxx:tu_password@up-de-fra1-postgresql-1.db.run-on-seenode.com:11550/db_xxxxxxxx"
```
Sustituye los valores con los datos reales de tu base de datos de SeeNode.

> **Este archivo NO debe subirse a GitHub.** Verifica que `.env.production` esta en tu `.gitignore`.

**3. Ejecuta las migraciones y el seed:**
```bash
npx dotenv -e .env.production -- npx prisma migrate deploy
npx dotenv -e .env.production -- npx prisma db seed
```

Esto crea todas las tablas en la base de datos de SeeNode y carga los datos iniciales (servicios, horarios, etc.).

**4. Una vez terminado, puedes borrar `.env.production`** (o dejarlo, ya esta en `.gitignore`).

### Paso 9 — Verificar

1. Abre la URL que SeeNode te ha asignado
2. Prueba la app completa
3. Los datos se guardan en PostgreSQL de SeeNode

> **Nota**: SeeNode tiene la funcionalidad de dominio propio marcada como "Coming Soon". Cuando este disponible, podras conectar `mobauto.es` directamente desde su panel.

---

## Comprar y conectar un dominio propio

Para que la web sea accesible desde `mobauto.es` (o el dominio que elijas), necesitas dos cosas: comprar el dominio y apuntarlo a tu hosting.

### Donde comprar el dominio

| Registrador | Precio .es/ano | Idioma | Ventaja |
|---|---|---|---|
| [Cloudflare Registrar](https://www.cloudflare.com/es-es/application-services/solutions/low-cost-domain-names/) | ~8-10€ | Espanol | Precio de coste, sin sobreprecios en renovacion |
| [Namecheap](https://www.namecheap.com) | ~8-10€ | Ingles | Barato, interfaz clara, cupones frecuentes |
| [Dinahosting](https://dinahosting.com) | ~10€ | Espanol | Empresa espanola, soporte en espanol |
| [IONOS](https://www.ionos.es) | ~1€ primer ano | Espanol | Muy barato el primer ano |

**Recomendacion**: Cloudflare Registrar es la mejor opcion a largo plazo porque cobra precio de coste sin sobreprecios en la renovacion. Ademas te da CDN y proteccion DDoS gratis.

### Pasos para comprar en Cloudflare

1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com) y crea una cuenta
2. En el menu lateral: "Domain Registration" > "Register Domains"
3. Busca `mobauto.es` (o el dominio que quieras)
4. Seleccionalo y completa la compra (~8-10€/ano)
5. El dominio quedara en tu panel de Cloudflare

### Conectar dominio a Vercel

1. En Vercel, ve a tu proyecto > "Settings" > "Domains"
2. Escribe `mobauto.es` y click en "Add"
3. Vercel te mostrara los registros DNS necesarios:
   - **Tipo A**: `76.76.21.21` (para `mobauto.es`)
   - **Tipo CNAME**: `cname.vercel-dns.com` (para `www.mobauto.es`)
4. Ve a Cloudflare > tu dominio > "DNS" > "Records"
5. Anade los registros:

| Tipo | Nombre | Contenido | Proxy |
|---|---|---|---|
| A | `@` | `76.76.21.21` | DNS only (nube gris) |
| CNAME | `www` | `cname.vercel-dns.com` | DNS only (nube gris) |

6. **Importante**: Desactiva el proxy de Cloudflare (nube gris, no naranja). Vercel necesita gestionar el SSL directamente.
7. Espera 5-30 minutos a que se propaguen los DNS
8. Vercel verificara automaticamente y generara el certificado SSL

### Conectar dominio a Railway

1. En Railway, ve a tu servicio > "Settings" > "Networking" > "Custom Domain"
2. Escribe `mobauto.es` y click en "Add"
3. Railway te mostrara un registro CNAME
4. Ve a Cloudflare > "DNS" > "Records" y anade:

| Tipo | Nombre | Contenido | Proxy |
|---|---|---|---|
| CNAME | `@` | (el valor que te da Railway) | DNS only |
| CNAME | `www` | (el mismo valor) | DNS only |

5. Espera a que Railway verifique el dominio

### Conectar dominio a SeeNode

A dia de hoy, SeeNode tiene los dominios personalizados como "Coming Soon". Cuando este disponible, el proceso sera similar: anadir el dominio en SeeNode y configurar los DNS en Cloudflare.

---

## Preparar el proyecto para despliegue

Antes de desplegar, asegurate de tener esto configurado:

### 1. Archivo `.env` en `.gitignore`

```gitignore
# Ya deberia estar, pero verifica
.env
.env.production
.env.local
```

### 2. Prisma configurado

Asegurate de que `prisma/schema.prisma` usa la variable de entorno:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. Scripts de build actualizados

```json
{
  "scripts": {
    "build": "prisma generate && nuxt build",
    "dev": "nuxt dev",
    "preview": "nuxt preview",
    "postinstall": "prisma generate && nuxt prepare"
  }
}
```

### 4. Preset de Nitro (solo si es necesario)

Vercel, Railway y SeeNode detectan Nuxt automaticamente, pero si tienes problemas, puedes forzar el preset en `nuxt.config.ts`:

```typescript
// Solo si es necesario
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel'       // para Vercel
    // preset: 'node-server' // para Railway o SeeNode
  }
})
```

---

## Resumen de comandos

| Accion | Comando |
|---|---|
| Build local | `npm run build` |
| Preview local del build | `npm run preview` |
| Migrar BD de produccion | `npx dotenv -e .env.production -- npx prisma migrate deploy` |
| Seed en produccion | `npx dotenv -e .env.production -- npx prisma db seed` |
| Ver BD de produccion | `npx dotenv -e .env.production -- npx prisma studio` |

---

## Notas importantes

- **Nunca subas `.env` a GitHub**. Las variables de entorno se configuran en el panel de Railway/Vercel/SeeNode.
- **JWT_SECRET** debe ser diferente en desarrollo y produccion.
- **bcrypt** puede dar problemas en entornos serverless (Vercel). Si ocurre, puedes cambiarlo por `bcryptjs` que es JavaScript puro:
  ```bash
  npm uninstall bcrypt @types/bcrypt
  npm install bcryptjs
  npm install @types/bcryptjs --save-dev
  ```
  Y cambiar los imports de `bcrypt` a `bcryptjs` en los archivos del servidor.
- **Neon free tier**: 0.5 GB de almacenamiento, 190 horas de computo/mes. Mas que suficiente para pruebas.
- **Vercel free tier**: 100 GB de ancho de banda, deploys ilimitados. Sin limite de tiempo.
- **SeeNode**: 7 dias de prueba gratis, despues $3/mes app + $1/mes BD. Sin limite de trafico.
