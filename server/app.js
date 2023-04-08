const Koa = require('koa');
const app = new Koa();
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const user = require('./routes/user');
const pet = require('./routes/pet');
const io = require('./socket/index');
const config = require('./config');

io.listen(config.socketPort);

app.use(cors())      // 跨域处理
app.use(bodyParser())// 帮助 koa解析 post请求传递的参数

app.use(user.routes(), user.allowedMethods())//启用路由
app.use(pet.routes(), pet.allowedMethods())//启用路由

app.listen(config.servePort, ()=>{
    console.log('项目已启动！');
})