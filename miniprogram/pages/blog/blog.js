// miniprogram/pages/blog/blog.js
let keyword = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBottomShow:false,
    blogList:[]
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadBlog()
    // //在小程序端操作数据库
    // const db = wx.cloud.database()
    // db.collection('blog').orderBy('createTime','desc').get().then((res)=>{
    //   const data = res.data
    //   for(let i = 0,len=data.length;i<len;i++){
    //     data[i].createTime = data[i].createTime.toString()
    //   }
    //   this.setData({
    //     blogList:data
    //   })
    // })
    // //小程序端查询数据一次只能查20条
    // //云函数端一次能查100条
  },
  loadBlog(start=0){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:"blog",
      data:{
        keyword,
        $url: 'list',
        start,  //从第几条开始取
        count:10
      }
    }).then((res)=>{
      console.log(res)
      this.setData({
        blogList:this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
      console.log(this.data.blogList)
    })
  },
  onChange(e){
    console.log(e)
    wx.getSetting({
      success:(res)=>{
        if(res.authSetting["scope.userInfo"]){  //已授权
          wx.getUserInfo({
            success:(res)=>{
              //获取用户信息
              this.success({
                detail:res.userInfo
              })
            }
          })
        }else{
          this.setData({
            isBottomShow:true
          })
        }
      }
    })
  },
  close(e){
    this.setData({
      isBottomShow: false
    })
    console.log(this.isBottomShow)
  },
  success(event){
    console.log(event)
    const detail = event.detail 
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  fail() {
    wx.showModal({
      title: '授权用户才能发布内容',
      content: '',
    })
  },
  getMoment(event){
    console.log(event.target.dataset.blogid)
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
    this.setData({
      blogList:[]
    })
    this.loadBlog(0)
  },
  onSearch(event){
    console.log(event.detail.keyword)
    this.setData({
      blogList:[]
    })
    keyword = event.detail.keyword
    this.loadBlog()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadBlog(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log(e)
    let blogObj = event.target.dataset.blog
    return {
      title: blogObj.content,
      //转发路径
      path:`/pages/blog-comment/blog-comment?blogId=${blogObj}`,
      // imageUrl:""
    }
  }
})