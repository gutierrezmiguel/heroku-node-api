const webpush = require('web-push');
const express = require('express')
const cors = require('cors')

const bodyParser = require('body-parser');

const app = express();
app.use(cors({
    origin:"*"
}))
const fs = require('fs');
const path = require('path');

// Add headers before the routes are defined

app.use(bodyParser.json())

/**
 * Settings VAPID
 */

const vapidKeys = {
    "publicKey": "BBWuyJrS0zSAZ_ZJhg6vsKxUaNAk7FS4xcHe2OLLK7ITnxsxJ-4616o3sqC6Drb0IwLZMTa8YoPJF8QcbHBReb0",
    "privateKey": "gke_pV8lkFxp-Axpb049pEmZRq3ZZV9hmwT4Ycj3b04"
}

webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const httpServer = app.listen(process.env.PORT || 5000, () => {
    console.log("HTTP Server running at " + httpServer.address().port);
});



 const handlerResponse = (res, data, code = 200) =>{
     res.status(code).send({data})
 }

 const savePush = (req, res) => {

    const name = Math.floor(Date.now() / 1000);

    let tokenBrowser = req.body.token;
    let data = JSON.stringify(tokenBrowser, null, 2);

    console.log("DATA:",data)

    fs.writeFile(`./tokens/token-${name}.json`,data,(err) =>{
        if(err) throw err;
    });
    console.log("salimos del save!!!");
    handlerResponse(res,'Save success')
 };
// const sendPush = (req, res) => {...};

 
// app.route('/send').post(savePush);



const enviarNotificacion = (req, res) => {
    
    const payload = {
    "notification": {
        "title": "Donde Estudiar",
        "body": "Ve y Visita nuestro nuevo OVA",
        "vibrate": [100, 50, 100],
        "image": "https://fotonotificacion.s3.us-east-1.amazonaws.com/logo.jpeg?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDAaCXVzLWVhc3QtMSJHMEUCIHmGI8tO0%2FMFMfHBE4Fwk9P5rQHamw5TMjyjSJ0FwHKrAiEA8X%2BxRNs%2FZJ%2B8kXPulEfPzQPv8EklK6WBO57iOJjJVA4q5AIIaRACGgwyNzAxNzIwMTY0NzkiDHn%2BRN9Ar1%2FwwNol%2FyrBAg5CAFfN7OZp16bqGjuCIaT6zeLdLSYiQbyfNlbPOhQ8k%2Bb4GLox0GQmOY%2FQQ5jExa7bHYxV0G8XXmMfoGG%2FhwKdHZkOcqPDdxseCsAn2DBDJWZYYHyiDAP3fIxPtaD%2FC2tSTrRkpGCytoALGTqaQgzrzyfSs4zUX6cWZJx%2BLrxMUqimc%2BiQIm051E%2BVlN0C%2F9ALoLhJIAc33bZzPpisMb8xfg%2BleRjKItkY89mj1b2Vx5PvIOlUsVwLHiHIsKAmKXOhXYDCqVyrhTWLB2%2BTokhlWk4qdPfPXs%2FRr9EGKQVzMn3o0gzTQNX7ppJcpICk1mjsdFEfV%2F3WJ0rn4YQ%2B7tDOSs4UkcH6TejHHOqA2J2rYEaXaJV3j8FT9Dtf0KT29IqJu5BpQORFNEWi0lp94JMk%2B4F9JdAmp5CE7J47YvpLYTCfsuyPBjqzAm6myPEulgfU6F%2FdQrg%2Bpyb5YXqz%2BCOtGx9bEtCGZZWTMoe1TzMhdcfm0UAAJawr0MrjdJsc5F8zf5vZbRAkVseKdOyTMKSqcwRRrInuFoguMufAkRi8C038OV5ivBRUclP40hG2Wn%2BDVGjJzPCYvqBehHNameZCJqtZv95%2BhVhO96EQiYIunt9IWki1J9RnDyGLtQBGI6Bfsi%2B03Pi6agoL5fBB0yMei7iatxL3EI1pwUSJCYJ62PPnclpAf4tcJwvnlTLuRGSv%2Ba7tmdL9Dzv1WQc0YS3iYgJrwjwjBwNn%2BKwhZDQ8c9TOpr81WWjhQvT1P%2FR71HCf40ADt1og3Y3uRSrKTKZrWWx4WKzCmDrhPk6%2B8DvBJvnlOdi8Jt12YF%2BYadodjp6NBPuEJziMkfh1T5Q%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220203T000353Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAT5Z4BZ5P2OGIGKLL%2F20220203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=1817577f573f601ef0c04c144ae81b2bbd7c5cf5b1274f8d13731a85f7fce52c",
        
    }
}

    const directoryPath = path.join(__dirname, 'tokens');
    fs.readdir(directoryPath,(err,files) => {
        if(err){
            handlerResponse(res, 'Error read', 500)
        }

        files.forEach((file)=> {
            let tokenRaw = fs.readFileSync(`${directoryPath}/${file}`);
            let tokenParse = JSON.parse(tokenRaw);

            console.log("FILEEEEEEEEEEEE" ,file);

            webpush.sendNotification(
                tokenParse,
                JSON.stringify(payload))
                .then(res => {
                    console.log('Enviado !!');
                }).catch(err => {
                    console.log('USUARIO NO TIENE PERMISOS O LAS KEYS CORRECTAS');
                })
                
                
        });
    })
    handlerResponse(res, 'Se envio la notificacion')

    // const pushSubscription = {
    //     endpoint: 'https://fcm.googleapis.com/fcm/send/fYuq9ztZQKQ:APA91bHjA6MmSoA-0hRNKsCFuu8IaJQIUqEp846QZc_NO_ND94qe234Z2-MK0LPZgMpdIYwOGJfcwwpMGEbwq-bXK8H53pyc6AFssnVZUel5yqxAdevDYpMN6ygEFcx-vmtAFgl3bCpd',
    //     keys: {
    //         auth: 'ZBMk4uFNGljsYtnt2kn3gw',
    //         p256dh: 'BMIG6m0ExRQ56jO95b4r6lC-_m6JL8ad3nUXtnlSjvqcdem0DhNaNZaeBXMBGMpYjRmhl3Pi05giHq_9HpM4rh4'
    //     }
    // };

    // webpush.sendNotification(
    //     pushSubscription,
    //     JSON.stringify(payload))
    //     .then(res => {
    //         console.log('Enviado !!');
    //     }).catch(err => {
    //         console.log('Error', err);
    //     })

    // res.send({ data: 'Se envio subscribete!!' })

}

app.route('/save').post(savePush);

app.route('/api/enviar').post(enviarNotificacion);




