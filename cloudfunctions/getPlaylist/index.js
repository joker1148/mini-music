// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

const rp = require('request-promise')

const URL = 'http://musicapi.xiecheng.live/personalized'

const playlistCollection = db.collection("playlist")
//最大获取条数100
const MAX_LIMIT = 10
// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
  const newArr = []
  const num = await db.collection("playlist").count().total;
  const newNum = Math.ceil(num / MAX_LIMIT)
  for(let i = 0;i<newNum;i++){
    const promise = await playlistCollection.skip(i*MAX_LIMIT).limit(MAX_LIMIT).get()
    newArr.push(promise)
  }
  console.log(newArr)
  let list = {
    data:[]
  }
  if(newArr.length>0){
    list = (await Promise.all((newArr)).reduce((acc,cur)=>{
      return {
        data:acc.data.concat(cur.data)
      }
    }))
  }

  const playlist = await rp(URL).then((res)=>{
    console.log(res)
    return JSON.parse(res).result
  })
  // console.log(playlist)
  //去重
  const newData = []
  for(let i = 0,len1 = playlist.length;i<len1;i++){
    //假定不重复
    let flag = true
    for (let j = 0, len2 = list.data.length; i < len2; j++){
      if(playlist[i].id === list.data[j].id){
        flag = false
        break
      }
    }
    if(flag){
      newData.push(playlist[i])
    }
  }
  for (let i = 0, len = newData.length;i< len ;i++){
    await playlistCollection.add({
      data:{
        ...newData[i],
        createTime:db.serverDate()
      }
    }).then((res)=>{
      console.log("success")
    }).catch((err)=>{
      console.log("fail")
    })
  }
  return newData.length
}