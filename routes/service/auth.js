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
                async function onResult(err, result) {
                    if(!err){
                        if(result.insertId > 0){
                            try {
                                const fs = require('fs');
                                const path = require('path');
                                const data = fs.readFileSync(path.join(__dirname, '../../resources/emails/auth-email-code.html'), 'utf8').toString();
                                const Handlebars = require("handlebars");
                                const template = Handlebars.compile(data);
                                const replacements = {
                                    code: generated_Token
                                };
                                try{
                                    const nodemailer = require("nodemailer");
                                    const transporter = nodemailer.createTransport({
                                        host: process.env.mail_host,
                                        port: process.env.mail_port,
                                        secure: (process.env.mail_issecure == 'true'), // true for 465, false for other ports
                                        auth: {
                                            user: process.env.mail_auth_user, // generated ethereal user
                                            pass: process.env.mail_auth_pass, // generated ethereal password
                                        },
                                    });
                                    var sender_address = process.env.mail_sender_address || process.env.mail_auth_user;
                                    let sent_mail_info = await transporter.sendMail({
                                        from: `"${process.env.mail_sender_name}" <${sender_address}>`, // sender address
                                        to: request.query.login_thing, // list of receivers
                                        subject: "Ваш код подтверждения", // Subject line
                                        text: "Вы входите в учетную запись с этим электронным адресом. Используйте проверочный код, чтобы войти: " + generated_Token, // plain text body
                                        html: template(replacements), // html body
                                    });
                                    console.log(sent_mail_info);
                                    reply.send({
                                        status: "okay",
                                        userid: result.insertId,
                                    })
                                } catch (error){
                                    if(process.env.loggerToggler){
                                        console.log(error)
                                    }
                                    reply.send({
                                        status: "error",
                                        message: "Sorry, something went wrong and I can't send this fucking email!"
                                    })
                                }
                            } catch (error) {
                                if(process.env.loggerToggler){
                                    console.log(error)
                                }
                                reply.send({
                                    status: "error",
                                    message: "CALL THE ADMIN!! Where is the file??!"
                                })
                            }
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
                message: "unsupported_auth_method",
                details: "Указанный метод авторизации не поддерживается сервисом на данный момент."
            })
        }
    })
}

module.exports = auth