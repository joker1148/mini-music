// pages/profile-playhistory/profile-playhistory.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const openid = app.globalData.openid
    wx.getStorage({
      key: openid,
      success: (res)=> {
        if (res.data.length == 0){
          wx.showToast({
            title: '当前无播放历史',
          })
          return
        }
        console.log(res)
        //吧musiclist替换成播分历史
        wx.setStorage({
          key: 'musiclist',
          data: res.data,
        })
        this.setData({
          musiclist: res.data
        })
      },
    })
  },
  onSelect(event) {
    //获取当前索引
    console.log(event)
    var id = event.currentTarget.dataset.index
    let musicid = event.currentTarget.dataset.musicid
    // console.log(event.currentTarget.dataset.musicid)
    // console.log(this.properties.musiclist[index])
    this.setData({
      playingId: id
    })
    console.log(this.data.playingId)
    wx.navigateTo({
      url: `../../pages/player/player?index=${id}&musicid=${musicid}`,
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