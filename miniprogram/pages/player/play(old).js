// pages/player/player.js
//获取全局唯一播放器
let nowPlayingIndex = 0
let musiclist
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: "",
    winHeight: "",
    url: "",
    isPlaying: false,
    currentTime: "",
    totalTime: "",
    index: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    nowPlayingIndex = options.index
    musiclist = wx.getStorageSync('musiclist')
    this.setData({
      musicid: options.musicid
    })
    this.showMusicDetail(options.musicid, options.index)
    this.play()
    this.playWatcher()

  },
  showMusicDetail(musicid, index) {
    // console.log(app.getPlayMusicId())
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      isPlaying: false
    })
    let music = musiclist[nowPlayingIndex]
    console.log(music)
    var that = this
    wx.getStorage({
      key: 'musiclist',
      success: function (res) {
        that.setData({
          url: res.data[index].al.picUrl,
          index
        })
        let title = that.data.title.split("（")[0]
        wx.setNavigationBarTitle({
          title: title//页面标题为路由参数
        })
      },
    })
    wx.cloud.callFunction({
      name: "music",
      data: {
        musicid,
        $url: "musicUrl"
      }
    }).then((res) => {
      let result = JSON.parse(res.result)
      backgroundAudioManager.src = result.data[0].url
      backgroundAudioManager.title = music.name
      this.setData({
        isPlaying: true
      })
      wx.hideLoading()
    })
  },
  play() {
    backgroundAudioManager.onCanplay(() => {
      console.log(backgroundAudioManager.duration)
    })
  },
  playWatcher() {
    backgroundAudioManager.onPlay(() => {
      setInterval(() => {
        let currentTime = parseInt(backgroundAudioManager.currentTime)
        this.setData({
          currentTime: currentTime,
        })
        // console.log(this.data.currentTime)
      }, 1000)
    })
  },
  togglePlaying() {
    console.log(this.data.isPlaying)
    if (this.data.isPlaying == true) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying,
    })
  },
  // debounce(fn, interval) {
  //   var timer;
  //   var gapTime = interval || 1000;//间隔时间，如果interval不传，则默认1000ms
  //   return function () {
  //     clearTimeout(timer);
  //     var context = this;
  //     var args = arguments;//保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
  //     timer = setTimeout(function () {
  //       fn.call(context, args);
  //     }, gapTime);
  //   }
  // },
  prev() {
    this.throttle(this.prevSong(), 1000)
  },
  prevSong() {
    this.setData({
      isPlaying: false
    })
    let that = this
    console.log(this.data.index)
    wx.getStorage({
      key: 'musiclist',
      success: (res) => {
        console.log(res)
        // console.log(res.data[0].id)
        let all = res.data.length
        if (this.data.index == 0) {
          var index = all - 1
        }
        else {
          var index = this.data.index - 1
        }
        console.log(index)
        this.setData({
          url: res.data[index].al.picUrl,
          title: res.data[index].name,
          singer: res.data[index].ar[0].name,
          index: index
        })
        console.log(res.data[index].id)
        this.showMusicDetail(res.data[index].id, index)
      },
    })
  },
  nextSong() {
    this.setData({
      isPlaying: true
    })
    let that = this
    console.log(this.data.index)
    wx.getStorage({
      key: 'musiclist',
      success: (res) => {
        console.log(res)
        // console.log(res.data[0].id)
        let all = res.data.length
        if (this.data.index == all) {
          var index = 0
        }
        else {
          var index = this.data.index + 1
        }
        console.log(res.data)
        console.log(res.data[index])
        this.setData({
          url: res.data[index].al.picUrl,
          title: res.data[index].name,
          singer: res.data[index].ar[0].name,
          index: index
        })
        console.log(res.data[index].id)
        this.showMusicDetail(res.data[index].id, index)
      },
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