const routes = {
	getlist:async function (ctx){
		console.log('getlist',ctx.request.body)
		ctx.body = 'hello1'
	}
}


module.exports = routes
