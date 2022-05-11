async function auth_anonymousAccess(fastify, options) {
    fastify.get('/auth_anonymousAccess', async function (request, reply) {
        var crypto = require("crypto");
        var generatedToken = crypto.randomBytes(40).toString('hex');
        fastify.mysql.query(
            `INSERT INTO users (auth_token)
            VALUES (?)`, [generatedToken],
            function onResult(err, result) {
                if(!err){
                    if(result.insertId > 0){
                        reply.send({
                            status: "okay",
                            auth_token: generatedToken
                        })
                    }
                } else {
                    reply.send({
                        status: "error",
                        message: "server_error",
                        details: "Ошибка при работе с SQL на этапе выполнения запроса, получено error. Дополнительно: " + err
                    })
                }
            }
        )
    })
}

module.exports = auth_anonymousAccess