// components/musiclist/musiclist.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist:Array,
    ids:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId:-1
  },
  pageLifetimes: {
    show() {
      this.setData({
        playingId: parseInt(app.getPlayMusicId())
      })
    },
  },
  //组件生命周期
  lifetimes: {
    created() {
      
    },
    attached(e) {
      
      // console.log("msg:"+this.properties.musiclist)
    },
    ready() {

    },
    moved() {
      console.log("在组件实例被移动到节点树另一个位置时执行")
    },
    detached() {
      
    },
    error() {
      console.log("每当组件方法抛出错误时执行")
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(event){
      //获取当前索引
      console.log(event)
      var id = event.currentTarget.dataset.index
      let musicid = event.currentTarget.dataset.musicid
      // console.log(event.currentTarget.dataset.musicid)
      // console.log(this.properties.musiclist[index])
      this.setData({
        playingId:id
      })
      console.log(this.data.playingId)
      wx.navigateTo({
        url: `../../pages/player/player?index=${id}&musicid=${musicid}`,
      })
    }
  }
})
