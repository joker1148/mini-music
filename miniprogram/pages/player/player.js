// pages/player/player.js
//获取全局唯一播放器
let nowPlayingIndex = 0
let musiclist = []
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    winWidth:"",
    winHeight:"",
    url:"",
    isPlaying:false,
    currentTime:"",
    totalTime:"",
    isLyricShow:false,
    lyric:"",
    isSame: false //是否为同一首歌
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
    this.showMusicDetail(options.musicid)
    this.play()

  },
  showMusicDetail(musicid,index){
    this.setData({
      isPlaying: false
    })
    if(musicid==app.getPlayMusicId()){
      this.setData({
        isSame:true
      })
    }else{
      this.setData({
        isSame: false
      })
      
    }
    //每次点击的时候，先停止上一首歌
    if(!this.data.isSame){
      backgroundAudioManager.stop()
    }
    // console.log(app.getPlayMusicId())


    app.setPlayMusicId(musicid)


    wx.showLoading({
      title: '加载中',
    })
    
    let music = musiclist[nowPlayingIndex]
    console.log(music)
    var that = this
    wx.getStorage({
      key: 'musiclist',
      success: function (res) {
        that.setData({
          url: music.al.picUrl,
        }) 
        wx.setNavigationBarTitle({
          title: music.name//页面标题为路由参数
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
      console.log(result)
      if(result.data[0].url == null){
        wx.showToast({
          title: '无权限播放',
        })
        return
      }
      if (!this.data.isSame){
        backgroundAudioManager.src = result.data[0].url
        backgroundAudioManager.title = music.name
        backgroundAudioManager.coverImgUrl = music.al.picUrl

        //保存历史

        this.savePlay()
      }
      
      this.setData({
        isPlaying: true
      })
      wx.hideLoading()
      //加载歌词
      wx.cloud.callFunction({
        name:'music',
        data:{
          musicid,
          $url:'lyric'
        }
      }).then((res)=>{
        // console.log(res)
        // console.log(JSON.parse(res.result)["lrc"].lyric)
        // console.log(res)
        let lyric = "暂无歌词"
        let lrc = JSON.parse(res.result).lrc
        if(lrc){
          lyric = lrc.lyric
        }
        this.setData({
          lyric
        })
      })
    })
  },
  play(){
    
    backgroundAudioManager.onCanplay(() => {
      console.log(backgroundAudioManager.duration)
    })
    backgroundAudioManager.onPlay(()=>{
      setInterval(()=>{
        let currentTime = parseInt(backgroundAudioManager.currentTime)  
        this.setData({
          currentTime: currentTime,
        })
        // console.log(this.data.currentTime)
      },1000)
    })
  },
  togglePlaying(){
    console.log(this.data.isPlaying)
    if (this.data.isPlaying == true){
      backgroundAudioManager.pause()
    }else{
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying,
    })
  },
  prevSong() {
    nowPlayingIndex--
    if (nowPlayingIndex<0){
      nowPlayingIndex = musiclist.length-1
    }
    this.showMusicDetail(musiclist[nowPlayingIndex].id)
  },
  nextSong(){
    nowPlayingIndex++
    if (nowPlayingIndex === musiclist.length) {
      nowPlayingIndex = 0
    }
    this.showMusicDetail(musiclist[nowPlayingIndex].id)
  },
  onChangeLyricShow(){
    this.setData({
      isLyricShow:!this.data.isLyricShow
    })
  },
  timeUpdate(event){
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },
  //保存播放历史
  savePlay(){
    //获取现在正在播放的歌曲
    const music = musiclist[nowPlayingIndex]
    const openid = app.globalData.openid
    const history = wx.getStorageSync(openid)
    let isHave = false
    for(let i =0;i<history.length;i++){
      if (history[i].id == music.id){
        isHave = true
        break
      }
    }
    console.log(isHave)
    if(!isHave){
      history.unshift(music)
      wx.setStorage({
        key: openid,
        data:history
      })
    }
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