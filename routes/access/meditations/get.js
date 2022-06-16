async function get(fastify, options){
    fastify.get('/get',
        //{preHandler: fastify.auth([
        //    fastify.userAuth
        //])},
      async function(request, reply) { 

            var audioconcat = require('audioconcat')
            const path = require('path')

            var storage_path = "resources/music/A/"
    
            var songs = [
                storage_path + '1.mp3'
            ]

            const now = new Date();
            filename = now.getHours() % 2 + "_" + now.getMinutes();
            
            
            audioconcat(songs)
            .concat("temp/" + filename + ".mp3")
            .on('start', function (command) {
                console.log('ffmpeg process started:', command)
            })
            .on('error', function (err, stdout, stderr) {
                console.error('Error:', err)
                console.error('ffmpeg stderr:', stderr)
            })
            .on('end', function (output) {
                console.error('Audio created in:', output)
                const fs = require('fs')
                const stream = fs.createReadStream("temp/" + filename + ".mp3", 'utf8')
                reply.type('audio/mpeg').send(stream)
            })

    })
}
  
module.exports = get