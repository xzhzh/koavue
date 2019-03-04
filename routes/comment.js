const router = require('koa-router')()
const userService = require('../controllers/mysqlConfig');
const checkToken = require('../token/checkToken.js');

router.post('/createComment',checkToken, async(ctx, next) => {
	console.log(ctx.userInfo)
	await userService.createcomment([ctx.userInfo.userName,ctx.request.body.content,ctx.request.body.postid,ctx.userInfo.avator,new Date().getTime()]).then((res)=>{
		 
		 if(res){
		 	ctx.body={
			   	state:1,
			   	msg:'ok',
			   	data:[]
			  }

			  userService.commentcount(ctx.request.body.postid).then((result)=>{
			      var count=result[0].count
			       userService.updatePostsComment([count,ctx.request.body.postid]).then((data)=>{
			       	console.log(data)
			       })
			  })

			}else{
				ctx.body={
				   	state:0,
				   	msg:'添加评论失败',
				   	data:[]
				  }
			}
		 
	})
})

router.get('/getComment',checkToken, async(ctx, next) => {
	console.log(ctx.userInfo)
	await userService.comment_list(ctx.query.id).then((res)=>{
		 ctx.body={
		   	state:1,
		   	msg:'ok',
		    data:res
		  }
	})
})


module.exports = router