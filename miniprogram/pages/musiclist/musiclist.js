// pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverImgUrl:"",
    songList:"",
    id:"11111",
    coverName:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:"music",
      data:{
        playlistId:options.playlistId,
        $url:"musiclist"
      }
    }).then((res)=>{
      // console.log(res.result.playlist.tracks)
      this.setData({
        coverImgUrl : res.result.playlist.coverImgUrl,
        songList: res.result.playlist.tracks,
        coverName: res.result.playlist.name
      })
      try{
        wx.setStorageSync("musiclist", res.result.playlist.tracks)
      }catch(e){
        console.log(e)
      }
      console.log(res)
      wx.hideLoading()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})