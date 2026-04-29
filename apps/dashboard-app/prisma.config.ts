import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  migrations: {
    path: '../../prisma/migrations',
  },
  schema: '../../prisma/schema.prisma',
  datasource: {
    url: env('DIRECT_DATABASE_URL'),
  },
})