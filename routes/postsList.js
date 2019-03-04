const router = require('koa-router')()
const userService = require('../controllers/mysqlConfig');
const fs= require('fs')
// const createToken=require('../token/createToken.js')
const checkToken = require('../token/checkToken.js');

router.get('/postlist',checkToken, async (ctx, next) =>{
	var key=ctx.query.key
	var pag = ctx.query.pag - 1 || 0
    var size = ctx.query.size || 10
    await userService.postlist(key,pag,size).then((res)=>{
    	 ctx.body = {
	      state: 1,
	      msg: '文章列表获取成功',
	      data: res
	    }
    }).catch((err)=>{
    	ctx.body = {
	      state: 0,
	      msg: err,
	      data: []
	    }
    })
})

router.post('/createpost',checkToken, async (ctx, next) =>{
		if(!ctx.request.body.title){
			ctx.body = {
		      state: 0,
		      msg: '请输入标题',
		      data: []
		    }
		    return false
		}
		if(!ctx.request.body.content){
			ctx.body = {
		      state: 0,
		      msg: '请输入标题',
		      data: []
		    }
		    return false
		}
		// console.log(ctx.userInfo,1234254312)
		if(ctx.userInfo){
		 await userService.findUser(ctx.userInfo.userName).then(async(res)=>{
		 	// console.log(res[0].avator,11)
		 	 let postsData = {
		      userName: ctx.userInfo.userName,
		      userId: ctx.userInfo.userId,
		      avator: res[0].avator,
		      title: ctx.request.body.title,
		      content: ctx.request.body.content
		    }
		     await userService.createpost([postsData.userName,postsData.userId,postsData.avator,postsData.title,postsData.content,0, 0, new Date().getTime()]).then((res)=>{
		     	ctx.body = {
			      state: 1,
			      msg: 'ok',
			      data: []
			    }
		     })
	     })	
	   }	
})

router.get('/postDetail',checkToken,async(ctx, next)=>{
	
	await userService.posdetail(ctx.query.id).then(async(res)=>{
		console.log(res)
		if(res[0]){
			ctx.body = {
		      state: 1,
		      msg: 'ok',
		      data: res
		   }
		    await userService.updatePostsHot([Number(res[0].hot)+1,res[0].id])
		}else{
			ctx.body = {
		      state: 0,
		      msg: '获取文章详情失败',
		      data: res
		   }
		}

		
	})

	


})



module.exports = router
