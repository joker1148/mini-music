// components/progress-bar/progress-bar.js
const backgroundAudioManager = wx.getBackgroundAudioManager()
let currentSec = -1  //当前秒数
let isMoving = false //进度条是否在拖拽 解决：进度条拖动的时候和updatetime有冲突

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime:{
      currentTime:"00:00",
      totalTime:"00:00",
    },
    total:"",
    width:0,
    movableDis:0,
    progress:0
  },
  lifetimes: {
    ready() {
      if(this.properties.isSame && this.data.showTime.totalTime){
        const duration = backgroundAudioManager.duration
        const durationFormat = this.dataFormat(duration)
        this.setData({
          ['showTime.totalTime']: `${durationFormat.min}:${durationFormat.sec}`
        })
      }
      //获取滚动条的宽度
      this.getMovableDis()


      backgroundAudioManager.onCanplay(()=>{
        if (typeof backgroundAudioManager.duration != 'undefined'){
          console.log("yessss")
          const totalTime = backgroundAudioManager.duration
          const time = this.dataFormat(totalTime)
          this.setData({
            total: totalTime,
            ['showTime.totalTime']: `${time.min}:${time.sec}`
          })   
        }else{
          //根据经验，要再过一秒钟才能获取
          setTimeout(()=>{
            const totalTime = backgroundAudioManager.duration
            const time = this.dataFormat(totalTime)
            this.setData({
              total: totalTime,
              ['showTime.totalTime']: `${time.min}:${time.sec}`
            })  
          },1000)
        }
      
      }),
      backgroundAudioManager.onTimeUpdate(()=>{
        //如果没有在移动，才执行代码
        if(!isMoving){
          const currentTime = backgroundAudioManager.currentTime
          const sec = currentTime.toString().split(".")[0]
          if (sec != currentSec) {
            const current = this.dataFormat(currentTime)
            this.setData({
              movableDis: Math.round(backgroundAudioManager.currentTime * (this.data.areaWidth - this.data.viewWidth) / this.data.total),
              ['showTime.currentTime']: `${current.min}:${current.sec}`,
              progress: backgroundAudioManager.currentTime * 100 / this.data.total
            })
            currentSec = sec

            //联动歌词，将实时时间传递出去
            this.triggerEvent('timeUpdate',{
              currentTime
            })
          } 
        }
        
        // console.log(currentSec)
        // console.log(backgroundAudioManager.currentTime / this.data.total)
      })
      backgroundAudioManager.onEnded(()=>{
        this.triggerEvent('musicEnd')
      })
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getMovableDis(){
      let query = this.createSelectorQuery()
      // query.select(".progress").boundingClientRect((rect)=>{
      //   this.setData({
      //     width: rect.widlyricWidthth
      //   })
      // }).exec()
      query.select(".movable-area").boundingClientRect()
      query.select(".movable-view").boundingClientRect()
      query.exec((res) => {
        // console.log(res)
        let areaWidth = res[0].width
        let viewWidth = res[1].width
        this.setData({
          areaWidth: areaWidth,
          viewWidth: viewWidth
        })
      })    
    },
    dataFormat(secondTime){
      // 原来的方法有点笨
      // const time = Math.round(secondTime)
      // console.log(time)
      // const minute = Math.round(time / 60)
      // const second = time - (minute * 60)
      // if (minute < 10) {
      //   var min = "0" + minute
      // } else {
      //   var min = minute.toString()
      // }
      // if (second < 10) {
      //   var sec = "0" + second
      // } else {
      //   var sec = second.toString()
      // }
      // const realTime = min + ":" + sec
      const min = Math.floor(secondTime / 60)
      const sec = Math.floor(secondTime % 60)
      return {
        "min": this.parse0(min),
        "sec": this.parse0(sec)
      }
    },
    parse0(sec){
      return sec<10?"0"+sec :sec
    },
    onChange(event){
      //拖动
      if(event.detail.source == 'touch'){
        //先暂时保存
        this.data.progress = event.detail.x / (this.data.areaWidth - this.data.viewWidth)*100
        this.data.movableDis = event.detail.x
        isMoving = true
      }
    },
    onTouchEnd(event){
      console.log(event)
      const currentTimeFormat = this.dataFormat(Math.floor(backgroundAudioManager.currentTime))
      console.log(this.data.progress)

      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime']: currentTimeFormat.min + ":"+currentTimeFormat.sec,
      })
      isMoving = false
      backgroundAudioManager.seek(this.data.progress * this.data.total/100 )
    }
  }
})
