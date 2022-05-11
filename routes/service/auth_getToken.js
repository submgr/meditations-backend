async function auth_getToken(fastify, options) {
    fastify.get('/auth_getToken', async function (request, reply) {
        var crypto = require("crypto");
        var generatedToken = crypto.randomBytes(40).toString('hex');
        fastify.mysql.query(
            "UPDATE users SET auth_token = ? WHERE id = ? AND auth_tempCode = ?", [generatedToken, request.query.userid, request.query.verificationCode],
            function onResult(err, result) {
                if(!err){
                    reply.send({
                        status: "okay",
                        auth_token: generatedToken
                    })
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

module.exports = auth_getToken