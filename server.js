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
    handlerResponse('Save success')
 };
// const sendPush = (req, res) => {...};

 
// app.route('/send').post(savePush);



const enviarNotificacion = (req, res) => {
    
    const payload = {
    "notification": {
        "title": "Folla como un toro",
        "body": "Este hombre folla como un toro, quieres saber como?",
        "vibrate": [100, 50, 100],
        "image": "https://fotonotificacion.s3.us-east-1.amazonaws.com/miguel.jpg?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLWVhc3QtMSJIMEYCIQCziOGtr%2FfPe7n4xHt%2FpAqiJutdCDdbuz7wXECrlUsHsQIhANSuTq98d12cMwlXJEdm6DgRygaSNru2hixvhO%2Bzqbo8KuQCCFUQAhoMMjcwMTcyMDE2NDc5IgwXnkKgIdsSYSEMWNcqwQJk6modQkiCSsK9A90cDBMAC6Sju468vUIokflnUYlntLbHdPu%2Fsq0ngirZVkY3OmuZNB89jxtAANx1TqSKvCHSnXupLoUj0%2FSZBdOzuD%2F8rHEZrMSNaCCXHXS0E1csjysISF7Erju%2FNi7fOQNaDj7tH0BFeMWA3xjssRNowlp1HZUOkQi5Rtm7aOPWZp%2Bu%2FSodiAa8qu7y7EQg3%2BP9wj5%2FATeoytCEcTns08yq4mNZ7YJ2EEf8B1Tl9U8%2FTc6pqIcZoYcI%2Fcjzb11kJz%2FDVLheXaVYhzmJj%2B7mMlZz%2FaiZ4jyu2NVfBCDcfMLYQv1qnSrIRc1WN1yu7WCwhVjlL2lOCd6YnrqngH5CHLvk6pXVc31cGbu3WTuA7p4oobcgzgBk4qi%2BqkdLkOUVzOvO60vmlYDPd%2BOye7aazy5fS7dltLMwgPznjwY6sgIUazIPWLbfGDFuMjpfW%2F7skHEoa0xe71yddDPkA%2FI5Wq3ADHFxkw%2FPVpJ1t0alCcrJdyRUIRFKadQs9pg2HnhButNvrWftMJf2586BTHByqIe7aA9lchh%2BPOTUJf8ROqYwnr6pmiAM9AGn%2FktLZvQ0BgiWvEObiaqQodV38uIdQFBTm5upU01WlQRyIFkjXpYL1c6hOx4ulXYmjb956l16h9s4EZh%2BIYKWmoeFqMJ%2F3Kuy5ikOOQQh6SLY3HiHdG4P%2FIoV7dAE30PaXgy8dQLRgXfoNwKyrkqmI5LaD5c2bu%2BCdpSQ3DNTP1m8xPmB0nIZiWXWOwcHaECLMUEkqGPrFkwwlH9A%2FF2rhAevjNvrUtq%2BvzvlR%2FZnjtGVEuODntU1HPX%2FRKddaX4aDMuzDAL42X8%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220202T034701Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAT5Z4BZ5P5ZCFFMJT%2F20220202%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=87b6e5bc0cd2b775147b23a270ce219b2a9d6a8ec1a45758921a8fc8e16fc3ac",
        "actions": [{
            "action": "explore",
            "title": "Go to the site"
        }]
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




