const fastify = require('fastify')({
  logger: false,
  trustProxy: true,
})
const axios = require('axios');

function delay(t, v) {
   return new Promise(function(resolve) {
       setTimeout(resolve.bind(null, v), t)
   });
}

fastify.register(require('fastify-cors'), {
  credentials: true,
  origin: 'http://0.0.0.0:10000', //'http://localhost:3000',
})

fastify.get('/graphql', {}, async function (request, reply) {
  let response;

  try {
    response = await axios.get(
      'https://venia.magento.com/graphql',
      {
        params: {
          ...request.query,
        }
      }
    );
  } catch (error) {
    console.log(error);
  }

  reply
    .code(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send(response.data)
})

fastify.post('/graphql', {}, async function (request, reply) {
  let result;
  try {
    result = await axios.post(
      'https://venia.magento.com/graphql',
      {
        ...request.body,
      },
    );
  } catch (error) {
    console.log(error);
  }
  reply
    .code(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send(result.data)
})


const start = async () => {
  try {
    await fastify.listen(3000)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
