// const express = require('express');
// const router = express.Router();
// const app = express();
// app.use(router);
// router.get('/',(req,res)=>{
//     res.send({
//         message:'hello world'
//     })
// })
const app = require('./src/app');
const port = process.env.PORT || 5060;
app.listen(port,()=>{
    console.log(`server is ready for connection on port ${port}`);
})