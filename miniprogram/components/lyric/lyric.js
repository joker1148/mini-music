// components/lyric/lyric.js
let lyricHeight
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow:{
      type:Boolean,
      value:false
    },
    lyric:{
      type:String,
      value:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lyric:"",
    lrcList:[],
    scrollTop:100,
    nowLyricIndex:0 //当前歌词的索引
  },
  observers:{
    lyric(lrc){
      console.log(lrc)
      if (lrc == "暂无歌词") {
        this.setData({
          lrcList:[{
              lrc:"暂无歌词",
              time:0
            }],
          nowLyricIndex:-1
        })
        console.log(this.data.lrcList)
      }else{
        this.parseLyric(lrc)
      }
      // console.log(lrc)
    }
  },
  lifetimes: {
    ready() {
      
    },
    attached() {
      wx.getSystemInfo({
        success: function (res) {
          console.log(res.screenWidth)
          //转换成px
          lyricHeight = res.screenWidth/750*64
        },
      })
      // console.log("在组件实例进入页面节点树时执行")
      // console.log(this.properties.lyric)

    },
    ready() {
      // console.log("在组件在视图层布局完成后执行")
    },
    moved() {
      // console.log("在组件实例被移动到节点树另一个位置时执行")
    },
    detached() {
      // console.log("在组件实例被从页面节点树移除时执行")
    },
    error() {
      // console.log("每当组件方法抛出错误时执行")
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    update(currentTime) {
      // console.log(currentTime)
      let lriList = this.data.lriList
      // console.log(this.data.lriList)
      if (lriList.length == 0 ){
        return 
      }
      if (currentTime > lriList[lriList.length-1].time){
        //不是最后一句
        if(this.data.nowLyricIndex!=-1){
          this.setData({
            nowLyricIndex:-1,
            scrollTop: lriList.length * lyricHeight
          })
        }
      }
      for (let i = 0, len = lriList.length;i<len;i++){
        // console.log(lriList[i].time)
        if (currentTime <= lriList[i].time){
          this.setData({
            nowLyricIndex:i-1,
            scrollTop: (i - 1) * lyricHeight
          })
          break
        }
      }
    },
    parseLyric(sLyric){
      let line = sLyric.split("\n")

      //存储歌词的数组
      let _lriList = []

      line.forEach((elem)=>{
        let time = elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        // console.log(time)
        if(time!= null){
          //歌词
          let lrc = elem.split(time)[1]
          // console.log(lrc)
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          // console.log(timeReg)
          let totalSec = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) /1000
          _lriList.push({
            lrc,
            time:totalSec
          })
        }
      })
      this.setData({
        lriList: _lriList
      })    
      // console.log(this.data.lriList)
    },
  
  }
})
