// miniprogram/pages/demo/demo.js
import regeneratorRuntime from '../../utils/runtime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getMusicInfo(){
    wx.cloud.callFunction({
      name:'tcbRouter',
      data:{
        $url:'music'
      }
    }).then((res) => {
      console.log(res)
    })
  },
  getMovieInfo(){
    wx.cloud.callFunction({
      name: 'tcbRouter',
      data: {
        $url: 'movie'
      }
    }).then((res)=>{
      console.log(res)
    })
  },
  onLoad: function (options) {

    wx.getUserInfo({
      success:(res)=>{
        console.log(res)
      }
    })
    wx.cloud.callFunction({
      name:"login"
    }).then(res=>{
      console.log(res)
      this.setData({
        openid:res.result.openid
      })
    })
    console.log(this.foo()) //Promise {<resolved>: 1}
  },
  async foo(){
    console.log("foo")  
    let res = await this.timeOut()
    console.log(res)  //等待timeOut函数执行完才会执行这一句
  },
  timeOut(){
    //记得是new Promise
    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        console.log(1)
        resolve('resolved')
      },1000)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // // setTimeout(()=>{
    // //   console.log(1)
    // //   setTimeout(()=>{
    // //     console.log(2)
    // //     setTimeout(()=>{
    // //       console.log(3)
    // //     },1000)
    // //   },1000)
    // // },1000)
    // let p1 = new Promise((resolve,reject)=>{
    //   setTimeout(() => {
    //     console.log(1)
    //     resolve("p1")
    //   }, 2000)
    // })
    // let p2 = new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     console.log(2)
    //     resolve("p2")
    //   }, 1000)
    // })
    // let p3 = new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     console.log(3)
    //     resolve("p3")
    //   }, 3000)
    // }) 
    // Promise.all([p1,p2,p3]).then((res)=>{
    //   console.log("全部完成")
    //   console.log(res)  // resolve的参数["p1", "p2", "p3"]
    // }).catch((err)=>{
    //   console.log("失败")
    //   console.log(err)
    // })
    // //输出 2 1 3
    // //假如p1 传reject("p1") 是失败的，会执行catch的函数，返回“失败”,但是不会阻止下面的任务执行
    // //简单来说，只要有一个失败，就不会执行成功的函数
    // Promise.race([p1, p2, p3]).then((res) => {
    //   console.log("全部完成")
    //   console.log(res)  // resolve的参数["p1", "p2", "p3"]
    // }).catch((err) => {
    //   console.log("失败")
    //   console.log(err)
    // })
    // //输出2 全部完成 p2 1 3
    // //race：只要有一个执行成功，即执行回调函数，返回 全部完成，然后再执行下面的
  },
  onUserInfo(e){
    console.log(e)
  },
  getOpenid(){
    wx.cloud.callFunction({
      name:"login"
    }).then((res)=>{
      console.log(res)
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})