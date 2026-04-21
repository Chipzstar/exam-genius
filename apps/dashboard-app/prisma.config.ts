import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

console.log(env('DATABASE_URL'));

export default defineConfig({
  migrations: {
    path: '../../prisma/migrations',
  },
  schema: '../../prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
})
        