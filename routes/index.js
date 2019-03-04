const router = require('koa-router')()
const userService = require('../controllers/mysqlConfig');
const fs= require('fs')
const createToken=require('../token/createToken.js')

router.post('/login', async (ctx, next) =>{
	let user = {
	    userName: ctx.request.body.userName,
	    passWord: ctx.request.body.passWord,
	}
	await userService.findUser(user.userName).then(async(res)=>{
		if(!res.length){
			try{
				throw Error('用户不存在')
			}catch(err){
				console.log(err)
			}
			ctx.body={
		    	state:0,
		    	msg:'用户不存在',
		    	data:[]
		    }
		 }else{
		 	console.log(user.passWord,res[0])
		 	if(res[0].pass!=user.passWord){
		 		try{
					throw Error('密码错误')
				}catch(err){
					console.log(err)
				}
				ctx.body={
			    	state:0,
			    	msg:'密码错误',
			    	data:[]
			    }
		 	}else{
		 		let token=createToken(res[0])
	 		    ctx.body={
			    	state:1,
			    	msg:'登录成功',
			    	data:[],
			    	token
			    }
		 	}

		 }
		// console.log(res)
	})
    // console.log(ctx.request.body)
   
})

router.post('/signUp', async (ctx, next) => {
	let user = {
	    userName: ctx.request.body.userName,
	    passWord: ctx.request.body.passWord,
	    repeatPass: ctx.request.body.repeatPass,
	    avator: ctx.request.body.avator
	  }
	 await userService.findUser(user.userName).then(async(res)=>{
	 	if(res.length){
	 		try{
	 			throw Error ('用户已存在')
	 		}catch(err){
	 			console.log(err)
	 		}
	 		ctx.body={
	 			state:0,
	 			msg:"用户已存在",
	 			data:[]
	 		}
	 	}else if(!user.userName){
	 		try{
	 			throw Error('请输入用户名')
	 		}catch(err){
	 			console.log(err)
	 		}
	 		ctx.body={
	 			state:0,
	 			msg:"请输入用户名",
	 			data:[]
	 		}
	 	}else if(user.passWord!=user.repeatPass){
	 		 try{
	 			throw Error('两次密码不相同')
	 		}catch(err){
	 			console.log(err)
	 		}
	 		ctx.body={
	 			state:0,
	 			msg:"两次密码不相同",
	 			data:[]
	 		}
	 	}else{
	 		   let base64Data = user.avator.replace(/^data:image\/\w+;base64,/, "");
	 		   let dataBuffer = new Buffer(base64Data, 'base64');
	 		   let getName = Number(Math.random().toString().substr(3)).toString(36) + Date.now()
	 		    await fs.writeFile('./public/images/' + getName + '.png',dataBuffer,(err)=>{
	 		    	 if (err) {
			            console.log(err);
			            return false
			          }
			          console.log('头像上传成功')
			         
	 		    })
	 		    await userService.insetUser([user.userName, user.passWord, getName, new Date().getTime()]).then((res)=>{
	 		    	ctx.body={
			 			state:1,
			 			msg:"注册成功",
			 			data:[]
			 		}
	 		    }).catch(err=>{
	 		    	ctx.body={
			 			state:0,
			 			msg:err,
			 			data:[]
			 		}
	 		    })
	 		
	 	}
	 	
	 })
	// console.log(ctx)
	
	 // ctx.body = await userService.findAllUser();
 
})


module.exports = router
