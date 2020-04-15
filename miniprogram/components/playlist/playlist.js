// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist:{
      type:Object,
      value:""
    }
  },

  observers:{
    // playlist(val){
    //   console.log(val)
    // }
    //playlist下面的playCount对象，要用中括号
    ['playlist.playCount'](val){
      // console.log(val)
      this.setData({
        // 死循环
        // ['playlist.playCount']: this.this._tranNumber(val, 2)
        _count: this._tranNumber(val, 2)
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    id:123456
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToMusicList(){
      wx.navigateTo({
        //ES6模板字符串
        url: `../../pages/musiclist/musiclist?playlistId=${this.properties.playlist.id}`
        //url:  '../../pages/musiclist/musiclist?id='+this.properties.playlist.id
      })
      // console.log(this.properties.playlist.id)
    },
    _tranNumber(num,point){
      let numStr = num.toString().split(".")[0]
      if (numStr.length < 4){
        return numStr
      } else if (numStr.length >= 4 && numStr.length <= 8){
        let newNumStr1 = numStr.substring(0, numStr.length - 4)
        let newNumStr2 = numStr.substring(numStr.length - 4, numStr.length - 4 + 2)
        let newNum = newNumStr1 + "." + newNumStr2 + "万"
        return newNum
      } else if (numStr.length > 8){
        let newNum1 = numStr.substring(0, numStr.length - 8)
        let newNum2 = numStr.substring(numStr.length - 8, numStr.length - 8 + 2)
        return newNum1 + "." + newNum2 + "亿"
      }
      123456789
      // this.setData({
      //   this.playlist.playCount = newNum
      // })
    }
  }
})
