const app = require('express')();
const request = require('request');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 80;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(async (req, res,next) => {
    res.set();
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Allow-Headers, Content-Type',
        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS'
    });
     next();
  });

app.get('/', (req, res) => {
        const dataExample = {
            'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0_1 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A523 Safari/8536.25","x-local-hardwareinfo":"320:568:200:950',
        }
        res.send(
            'Server is working. Waiting for your UserAgent Data. \n' +
            'Format JSON: \n' + 
            JSON.stringify(dataExample) +
            '');
    });
app.post('/detectDeviceByUserAgent', (req, res) => {

        // const data = {
        //         "user-agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 6_0_1 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A523 Safari/8536.25",
        //         "x-local-hardwareinfo":"320:568:200:0"
        //     };

        var options = {
            uri: 'https://api.handsetdetection.com/apiv4/device/detect.json',
            method: 'POST',
            auth: {
                user: '62a9d0ccca',
                pass: 'wtYrWjvZLtMHdJ5k',
                sendImmediately: false
            },
            body: JSON.stringify(req.body)
        };
        request(options, function(error, response, body){
            if(error) return res.send(error);
            const data = JSON.parse(body);
            if (data['hd_specs']) return res.send(data['hd_specs']);
            console.error('has no "hd_specs" in object', data)
            res.status(500).send('Something broke!');
        });
        
    })
app.listen(7878);