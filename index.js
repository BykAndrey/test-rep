const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();
const PORT = process.env.PORT || 80;

app.use(bodyParser());
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Access-Control-Allow-Headers, Content-Type');
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    await next();
  });

const startHandsetdetectionService = async function(requestBodyObj = {}) {
    // const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
    const userAgent = requestBodyObj["user-agent"] || '';
    const userAgentParser = require('@handsetdetection/apikit')({
        module: 'cloud',
        username: '62a9d0ccca',
        secret: 'wtYrWjvZLtMHdJ5k'
    });
    return new Promise(async (res, rej) => {
        userAgentParser( userAgent, function( error, parsedUA ) {
            if (error) {
                rej(error)
            }
            res(JSON.stringify(parsedUA));
        });
    });
};

router
    .get('/', async ctx => {
        const dataExample = {
            'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0_1 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A523 Safari/8536.25","x-local-hardwareinfo":"320:568:200:950',
        }
        ctx.body = 
            'Server is working. Waiting for your UserAgent Data. \n' +
            'Format JSON: \n' + 
            JSON.stringify(dataExample) +
            '';
    })
    .post('/detectDeviceByUserAgent', async ctx => {
        // console.log('POST REQUEST', ctx.request)
        const requestBodyObj = ctx.request.body;
        const data = await startHandsetdetectionService(requestBodyObj);
        const dataJSON = JSON.parse(data);
        // console.log(dataJSON);
        console.log('data: ',{
            general_type: dataJSON.general_type,
            general_platform: dataJSON.general_platform,
            general_browser: dataJSON.general_browser,
            display_pixel_ratio: dataJSON.display_pixel_ratio,
            display_ppi: dataJSON.display_ppi
        });
        ctx.body = JSON.parse(data);
    })

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(PORT);