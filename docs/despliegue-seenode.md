# Despliegue en SeeNode

SeeNode es una plataforma sencilla con precios economicos y PostgreSQL incluido.

**Coste**: 7 dias de prueba gratis, despues $3/mes (app) + $1/mes (base de datos).

El despliegue se hace en dos fases:
- **Fase 1**: Desplegar la web (sin base de datos)
- **Fase 2**: Crear la base de datos, conectarla y ejecutar las migraciones

---

## Requisitos

- Cuenta en GitHub con el proyecto subido
- Cuenta en [seenode.com](https://seenode.com)

---

## FASE 1 — Desplegar la web

### Paso 1 — Crear cuenta

1. Ve a [seenode.com](https://seenode.com)
2. Registrate (puedes usar GitHub)
3. Tienes 7 dias de prueba gratis

### Paso 2 — Crear el servicio web

1. En el dashboard, click en "New" > "Web Service"
2. Conecta tu cuenta de GitHub si no lo has hecho
3. Autoriza SeeNode para acceder a tus repositorios
4. Selecciona el repositorio `project-mobauto` y la rama `main`

### Paso 3 — Configurar el servicio

Ajusta estos valores:

- **Name**: `mobauto`
- **Root Directory**: dejar vacio (raiz del repositorio)
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `node .output/server/index.mjs`

> **Build Command**: incluye `npm install` (SeeNode no lo hace automaticamente) y `npx prisma generate` (genera el cliente de Prisma en `app/generated/prisma/`). Solo necesita los archivos del repo, no una base de datos.
>
> **Start Command**: sin migraciones. Las migraciones se ejecutan manualmente una sola vez desde tu maquina (Fase 2).

### Paso 4 — Configurar variables de entorno

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

### Paso 5 — Primer deploy

1. Click en "Create Web Service"
2. SeeNode clonara el repo, ejecutara el build y arrancara la app
3. Puedes ver los logs en tiempo real
4. En los logs deberias ver: `Listening on http://0.0.0.0:80`
5. La app estara online, pero sin base de datos (el login y las citas no funcionaran todavia)

> **Deploy automatico**: A partir de ahora, cada `git push` a `main` redespliega la app automaticamente.

---

## FASE 2 — Conectar la base de datos

### Paso 6 — Crear la base de datos PostgreSQL

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

   Es mejor dejar la password por defecto que ofrece seenode, al cambiarla dio problemas de conexión
   ```

### Paso 7 — Anadir DATABASE_URL al servicio web

1. Ve a tu **Web Service** > pestana **Environment**
2. Anade la variable:

| Variable | Valor |
|---|---|
| `DATABASE_URL` | El connection string construido en el paso anterior |

3. Fuerza un redeploy para que la app coja la nueva variable:
   ```bash
   git commit --allow-empty -m "connect production database" && git push
   ```

### Paso 8 — Ejecutar migraciones y seed desde local

Esto crea las tablas en la base de datos y carga los datos iniciales (admin, servicios, horarios). Se hace una sola vez desde tu maquina.

**1. Crea el archivo `.env.production` en la raiz del proyecto** (en VS Code: click derecho > "New File"):
```
DATABASE_URL="postgresql://db_xxxxxxxx:tu_password@up-de-fra1-postgresql-1.db.run-on-seenode.com:11550/db_xxxxxxxx"
```
Sustituye con tus datos reales.

> **Este archivo NO debe subirse a GitHub.** Verifica que `.env.production` esta en tu `.gitignore`.

**2. Ejecuta las migraciones y el seed:**
```bash
npx dotenv -e .env.production -- npx prisma migrate deplo
npx prisma db seed
```

> `prisma.config.ts` detecta automaticamente `.env.production` cuando existe y lo usa en lugar de `.env`. No hace falta ningun comando especial.

### Paso 9 — Verificar

1. Abre la URL que SeeNode te ha asignado
2. Prueba registro, login, reservar cita
3. Entra como admin (`admin@mobauto.es` / `admin123`) y verifica el panel

> **Dominio propio**: SeeNode tiene esta funcionalidad como "Coming Soon".

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
