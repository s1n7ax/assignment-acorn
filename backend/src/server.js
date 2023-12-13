import fastify from 'fastify'
import postgres from '@fastify/postgres'
import cors from '@fastify/cors'
import v1Routes from './v1/routes.js'

const server = fastify({
  logger: true,
})

await server.register(cors, {
  origin: true,
})

server.register(postgres, {
  database: 'website',
  user: 'website',
  password: 'website',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 1000,
  connectionTimeoutMillis: 1000,
})

server.register(v1Routes, {
  prefix: '/v1',
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
