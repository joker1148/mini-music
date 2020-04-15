// pages/profile-bloghistory/profile-bloghistory.js
const MAX = 10
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
    // this.getListWX()
  },
  getList(){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:"blog",
      data:{
        $url: "getListByOpenid",
        start:this.data.blogList.length,
        count:MAX
      }
    }).then((res)=>{
      this.setData({
        blogList:this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
      console.log(this.data.blogList)
    })
  },

  getListWX(){
    db.collection("blog").skip(this.data.blogList.length)
    .limit(MAX).orderBy("createtime","desc").get().then((res)=>{
      console.log(res)
    })
  },

  goComment(event){
    wx.navigateTo({
      url: `../blog-comment/blog-comment?blogId=${event.target.dataset.blogid}`,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    console.log(event)
    const blog = event.target.dataset.blog
    return{
      title:blog.content,
      path: `/pages/blog-comment/blog-comment?blogId=${blog._id}`
    }
  }
})