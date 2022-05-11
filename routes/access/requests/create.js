async function create(fastify, options){
    fastify.get('/create', {preHandler: fastify.auth([
        fastify.userAuth
      ])}, async function(request, reply) {
        if(request.query.subject.length <= 32){
            fastify.mysql.query(
                `INSERT INTO requests (owner, notes, grade, subject)
                VALUES (?, ?, ?, ?)`, [request.query.user_id, request.query.notes, request.query.grade, request.query.subject],
                function onResult(err, result) {
                    if(!err){
                        if(result.insertId > 0){
                            reply.send({
                                status: "okay",
                                requestid: result.insertId
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
        }else{
            reply.send({
                status: "error",
                message: "too_long_field",
                details: "Не пройдено условие, обязательное для выполнения запроса: if(!request.query.subject.length > 32) - false returned"
            })
        }

    })
}
  
module.exports = create