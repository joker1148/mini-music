// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const TcbRouter = require('tcb-router')

const blogCollection = db.collection("blog")

const MAX = 100
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  app.router('list',async(ctx,next)=>{
    const keyword = event.keyword
    let w = {}
    if(keyword.trim()!=""){
      w = {
        content:new db.RegExp({
          regexp:keyword,
          options:'i'  //忽略大小写
        })
      }
    }

    let blogList = await blogCollection.where(w).skip(event.start).limit(event.count)
    .orderBy("createTime","desc").get().then((res)=>{
      return res.data
    })
    console.log(blogList)
    ctx.body = blogList
  })

  app.router('detail',async (ctx,next)=>{
    let blogId = event.blogId
    //详情查询
    let detail = await blogCollection.where({
      _id:blogId
    }).get().then((res)=>{
      return res.data
    })
    //评论查询
    const countResult =  await blogCollection.count()
    const total = countResult.total
    let commentList = {
      data:[]
    }
    if(total>0){
      const batchTime = Math.ceil(total/MAX)
      const tasks = []
      for(let i =0;i<batchTime;i++){
        let promise = db.collection("blog-comment").skip(i*MAX)
        .limit(MAX).where({
          blogId
        }).orderBy("createTime","desc").get()
        tasks.push(promise)
      }
      if(tasks.length>0){
        commentList = (await Promise.all(tasks)).reduce((acc,cur)=>{
          return {
            data:acc.data.concat(cur.data)
          }
        })
      }
    }
    ctx.body = {
      commentList,
      detail
    }
  })


  const wxContext = cloud.getWXContext()
  app.router("getListByOpenid",async (ctx,next)=>{
    ctx.body = await db.collection("blog").where({
      _openid: wxContext.OPENID
    }).skip(event.start).limit(event.count).orderBy("createTime","desc")
    .get().then((res)=>{
      return res.data
    })
  })


  return app.serve()
}