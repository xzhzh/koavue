//mysqlConfig.js
var mysql = require('mysql');
var config = require('./defaultConfig');


var pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE
});

const query = function (sql, val) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, val, (err, res) => {
          if (err) {
            reject(err)
          } else {
            resolve(res)
          }
          connection.release();
        })
      }
    })
  })
}

const findUser = (name) => { //查找用户
    let _sql=`select * from users WHERE name ='${name}';`
    return  query(_sql)
}
const insetUser = (val) => { // 注册
    console.log(val)
      let _sql = `INSERT INTO users ( name, pass, avator, moment) VALUES (?,?,?,?)`
      console.log(_sql,11)
      return query(_sql, val)
}
const postlist=(key,pg,size)=>{
   let _sql = `SELECT * FROM posts ${ key ? "WHERE title LIKE '%"+key+"%' " : ' '}ORDER BY createTime DESC limit ${pg * size} , ${size}`
   return  query(_sql)
}
const createpost = (val) => { // 创建文章
      let _sql = `INSERT INTO posts (userName, userId, avator, title, content, hot, comments, createTime) VALUES (?,?,?,?,?,?,?,?)`
      return query(_sql, val)
}
const posdetail=(val)=>{  //文章详情
    let _sql=`select * from posts WHERE id ='${val}';`
       return  query(_sql)
}
const createcomment = (val) => { // 添加评论
  console.log(val)
      let _sql = `INSERT INTO comment (userName, content, postId, avator, createTime) VALUES (?,?,?,?,?)`
      return query(_sql, val)
}
const comment_list = (val) => {
    let _sql=`select * from comment WHERE postId ='${val}';`
    return  query(_sql)
}
const commentcount=(val)=>{
   let _sql=`select count(*) as count from comment WHERE postId=?`
    return  query(_sql,val)
}
const updatePostsComment=(val)=>{ //修改评论数量
  console.log(val)
  let _sql=`UPDATE posts SET comments=? WHERE id=?`
  return query(_sql, val)
}
const updatePostsHot=(val)=>{ //添加浏览数量
    let _sql=`UPDATE posts SET hot=? WHERE id=?`
  return query(_sql, val)
}

   

module.exports =  {
    findUser,
    insetUser,
    postlist,
    createpost,
    posdetail,
    createcomment,
    comment_list,
    commentcount,
    updatePostsComment,
    updatePostsHot
}

