const routes = {
	getlist:async function (ctx){
		console.log('getlist',ctx.request.body)
		ctx.status = 200
		ctx.body = {
			status: 1,
			data: [
				{
					name: 'ivan'
				}
			]
		}
	}
}


module.exports = routes
