async function hello(fastify, options){
    fastify.get('/hello', {preHandler: fastify.auth([
        fastify.userAuth
      ])}, async function(request, reply) {
        reply.send({
          status: "Hello!"
      })

    })
}
  
module.exports = hello