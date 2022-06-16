require('dotenv').config()

const fastify = require('fastify')({
  logger: process.env.loggerToggler
})

const autoload = require('fastify-autoload')
const path = require('path')

fastify.register(require('fastify-cors'), { 
  // put your options here
  origin: '*'
})

fastify.register(require('fastify-mysql'), {
  connectionString: `mysql://${process.env.database_username}:${process.env.database_password}@${process.env.database_host}/${process.env.database_basename}`
})

fastify.register(require('fastify-auth'))

fastify.register(autoload, {
  dir: path.join(__dirname, 'routes')
}).decorate('userAuth', function (request, reply, done) {
    //if (verificationResult == true) {
    //  done()
    //} else {
    //    console.log("W2")
    //    done(new Error('auth_error'))
    //    request.code(401)
    //}
    fastify.mysql.query(
      'SELECT * FROM users WHERE auth_token = ?', [request.query.auth_token],
      function onResult (err, result) {
        if(!err){
          if(result[0] != undefined){
            done()
          } else {
            done(new Error('auth_error'))
          }
        } else{
          done(new Error('auth_error'))
        }
      }
    )

  })

const port_to_listen = process.env.PORT || 3000 || process.env.port_to_listen;
fastify.listen(port_to_listen, process.env.server_ip, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})