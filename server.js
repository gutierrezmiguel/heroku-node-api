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
        "image": "https://ibb.co/6DjJqt6",
        
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




