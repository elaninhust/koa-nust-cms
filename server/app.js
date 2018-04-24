const Koa = require('koa')
const { Nuxt, Builder } = require('nuxt')
const koa_body = require('koa-body')
const koaConnect = require('koa-connect')

const routes = require('./routes/routes.js')

const config = require('../nuxt.config.js')
const port = process.env.PORT || 2018
const env = process.env.NODE_ENV

async function start(){
	config.isDev = env === 'development'
	const app = new Koa()
	const nuxt = await new Nuxt(config)

	if(config.isDev){
		await new Builder(nuxt).build().catch(err => {
			console.log(err)
			process.exit(1)
		});
	}

	app.use(koa_body({ multipart: true }))

	app.use(async (ctx, next) => {
		if(ctx.path == '/ping'){
			ctx.status = 200;
			ctx.body = 'pong'
		}else if(ctx.url.indexOf('/services/') > -1){
			let key = ctx.path.split('/').pop();
			routes[key](ctx)
		}else{
			await next()
		}
	});

	// app.use(async (ctx, next) => {
	// 	ctx.status = 200
	// 	return new Promise((resolve,reject) => {
	// 		ctx.res.on('close',resolve)
	// 		ctx.res.on('finish',resolve)
	// 		nuxt.render(ctx.req,ctx.res,(promise) => {
	// 			promise.then(resolve).catch(reject)
	// 		})
	// 	})
	// })
	
	//将express中间件转化为koa可用的中间件
	const nuxtRender = koaConnect(nuxt.render)
	app.use(async (ctx, next) => {
		ctx.status = 200 //koa默认返回404
		await nuxtRender(ctx)
	})

	app.listen(port)
	console.log(`server start at localhost:${port}`)
}

start()