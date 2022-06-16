async function auth(fastify, options) {
    fastify.get('/auth', async function (request, reply) {
        if(request.query.method == "email"){
            const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            if(!emailRegexp.test(request.query.login_thing)){
                return {
                    status: "okay",
                    additional_info: "Probably, wrong email :)",
                    additional_tag: "wrong_email"
                }
            }
            var generated_Token = '';
            function getRandomInt(max) {
                return Math.floor(Math.random() * max);
            }
            for(i = 0; i < 6; i++){
                generated_Token += getRandomInt(9);
            }

            fastify.mysql.query(
                `INSERT INTO users (email, auth_tempCode)
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE 
                auth_tempCode = ?`, [request.query.login_thing, generated_Token, generated_Token],
                function onResult(err, result) {
                    if(!err){
                        if(result.insertId > 0){
                            reply.send({
                                status: "okay",
                                userid: result.insertId
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
        }
    })
}

module.exports = auth