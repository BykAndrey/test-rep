import express from 'express';
// import http from 'http';

const app = express();


const PORT = process.env.PORT || 80;

app.get('/', (req, res) => {
    res.send('OK')
});


app.listen(PORT, ()=>{
    console.log(`Ran on ${PORT} port`)
})