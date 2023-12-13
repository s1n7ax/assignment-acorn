function routes(server, _options, done) {
  server.post(
    '/reviews',
    {
      schema: {
        body: {
          type: 'object',
          required: ['username', 'comment', 'rating'],
          properties: {
            username: {
              type: 'string',
              pattern: '^[a-zA-Z]+$',
            },
            comment: {
              type: 'string',
              pattern: '^[a-zA-Z0-9 \n]+$',
            },
            rating: {
              type: 'number',
              minimum: 1,
              maximum: 5,
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { username, rating, comment } = request.body

      const client = await server.pg.connect()

      try {
        const { rows } = await client.query(
          `
        INSERT INTO reviews (username, rating, comment)
        VALUES ($1, $2, $3)
        RETURNING id;
        `,
          [username, rating, comment]
        )

        const inserted = rows[0]

        reply
          .header('Location', '/v1/reviews/' + inserted.id)
          .status(201)
          .send()
      } catch (error) {
        server.log.error(error)

        reply.status(500).send({
          error: '500 Internal Server Error',
          message: '500 Internal Server Error',
        })
      } finally {
        client.release()
      }
    }
  )

  server.get(
    '/reviews',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            order_by: {
              type: 'string',
              enum: ['date', 'rating_high', 'rating_low'],
            },
            start_date: { type: 'string' },
            end_date: { type: 'string' },
            page_size: { type: 'number' },
            page_no: { type: 'number' },
          },
        },
        response: {
          200: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                username: { type: 'string' },
                rating: { type: 'number' },
                comment: { type: 'string' },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const client = await server.pg.connect()

      const {
        order_by: orderBy,
        start_date: startDate,
        end_date: endDate,
        page_size: pageSize,
        page_no: pageNo,
      } = request.query

      const limit = pageSize < 30 ? pageSize : 30

      const orderColumn =
        (orderBy == 'date' && 'timestamp DESC') ||
        (orderBy == 'rating_high' && 'rating DESC') ||
        (orderBy == 'rating_low' && 'rating')

      console.log(limit, orderColumn)

      try {
        const { rows } = await client.query(
          `SELECT * FROM reviews ORDER BY ${orderColumn} LIMIT $1`,
          [limit]
        )

        reply.send(rows)
      } catch (error) {
        server.log.error(error)
        reply.status(500).send({ error })
      } finally {
        client.release()
      }
    }
  )

  server.get(
    '/reviews/summary',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              average: { type: 'number' },
            },
          },
        },
      },
    },
    async (_request, reply) => {
      const client = await server.pg.connect()

      try {
        const { rows } = await client.query(`
      SELECT ROUND((SUM(count_into_rating) / SUM(count)), 2) AS average FROM (
        select
          rating,
          COUNT(*),
          rating * COUNT(*) AS count_into_rating
        FROM reviews GROUP BY rating
      )
    `)

        console.log(rows[0])
        reply.status(200).send(rows[0])
      } catch (error) {
        server.log.error(error)
        reply.status(500).send({ error })
      } finally {
        client.release()
      }
    }
  )

  done()
}

export default routes
