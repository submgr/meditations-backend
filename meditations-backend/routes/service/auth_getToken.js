async function auth_getToken(fastify, options) {
    fastify.get('/auth_getToken', async function (request, reply) {
        var crypto = require("crypto");
        var generatedToken = crypto.randomBytes(40).toString('hex');
        fastify.mysql.query(
            "UPDATE users SET auth_token = ?, auth_tempCode = null WHERE id = ? AND auth_tempCode = ?", [generatedToken, request.query.userid, request.query.verificationCode],
            function onResult(err, result) {
                if(!err){
                    if(result.affectedRows > 0){
                        reply.send({
                            status: "okay",
                            auth_token: generatedToken
                        })
                    }else{
                        reply.send({
                            status: "error",
                            message: "wrong_code",
                            details: "Ничего не возвращено сервером => один из параметров не соответствует таблице пользователей (возможно - сам код). Дополнительно: " + result
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

module.exports = auth_getToken