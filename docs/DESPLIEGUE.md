# Despliegue de Mobauto

Elige el proveedor que mejor se adapte a tus necesidades:

| | Railway | Vercel + Neon | SeeNode |
|---|---|---|---|
| Dificultad | Facil | Media | Facil |
| Coste | $5 gratis (30 dias) | Gratis indefinido | $3/mes app + $1/mes BD |
| PostgreSQL | Incluido | Neon (gratis) | Incluido ($1/mes) |
| Dominio propio | Si | Si | Proximamente |
| Ideal para | Probar rapido | Produccion gratuita | Hosting economico |

- [Despliegue en Railway](./despliegue-railway.md)
- [Despliegue en Vercel + Neon](./despliegue-vercel-neon.md)
- [Despliegue en SeeNode](./despliegue-seenode.md)

---

## Comandos utiles

| Accion | Comando |
|---|---|
| Build local | `npm run build` |
| Preview local del build | `npm run preview` |
| Migrar BD de produccion | `npx dotenv -e .env.production -- npx prisma migrate deploy` |
| Seed en produccion | `npx dotenv -e .env.production -- npx prisma db seed` |
| Ver BD de produccion | `npx dotenv -e .env.production -- npx prisma studio` |
| Generar JWT_SECRET seguro | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

---

## Notas importantes

- **Nunca subas `.env` a GitHub**. Las variables de entorno se configuran en el panel de cada proveedor.
- **JWT_SECRET** debe ser diferente en desarrollo y produccion.
- **bcrypt** puede dar problemas en entornos serverless (Vercel). Si ocurre, cambialo por `bcryptjs`:
  ```bash
  npm uninstall bcrypt @types/bcrypt
  npm install bcryptjs
  npm install @types/bcryptjs --save-dev
  ```
  Y cambia los imports de `bcrypt` a `bcryptjs` en los archivos del servidor.
- **Neon free tier**: 0.5 GB de almacenamiento, 190 horas de computo/mes.
- **Vercel free tier**: 100 GB de ancho de banda, deploys ilimitados, sin limite de tiempo.
- **SeeNode**: 7 dias de prueba gratis, despues $3/mes app + $1/mes BD.
