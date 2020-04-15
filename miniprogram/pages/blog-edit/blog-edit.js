// pages/blog-edit/blog-edit.js
const db = wx.cloud.database()

//输入的文字内容
let content = ''

let userInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fontLength:0,
    imgData:[],
    isShow:true,
    height:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    userInfo = options

  },
  getValueLength(e){
    let value = e.detail.value
    let len = parseInt(value.length)
    console.log(len)
    if(len>=140){
      len = `最大数字为${140}`
    }
    this.setData({
      fontLength:len
    })
    content = e.detail.value
  },
  foucus(e){
    console.log(e)
    this.setData({
      height:e.detail.height
    })
    console.log("666")
  },
  outfocus(e){
    console.log(e)
    this.setData({
      height: ""
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  chooseImg(){
    let len = this.data.imgData.length
    wx.chooseImage({
      count: 9 - len,
      sizeType:"compressed",
      success:(res)=> {
        this.setData({
          imgData: this.data.imgData.concat(res.tempFilePaths),
          isShow:false
        })
      },
    })
  },
  
  close(e){
    this.data.imgData.splice(e.target.dataset.index, 1)
    this.setData({
      imgData: this.data.imgData
    })
  },
  onPreviewImg(e){
    let index = e.currentTarget.dataset.index
    console.log(e.currentTarget.dataset.index)
    wx.previewImage({
      urls: this.data.imgData,
      current: this.data.imgData[index]
    })
  },
  send(){
    //判断是否为空,去掉空格
    if(content.trim()===""){
      wx.showModal({
        title: '请输入内容',
        content: '',
      })
      return
    }

    wx.showLoading({
      title: '发布中',
      mask:true
    })

    let fillIds = []
    //2、把数据存储到云数据库中
    //数据库：内容、图片flieID、openid用户标识、昵称、头像、时间
    //1、图片：云存储 flieID 云文件ID
    //一次只能上传一张图片
    let promiseArr = []
    for(let i = 0,len = this.data.imgData.length;i<len;i++){
      let p = new Promise((reslove,reject)=>{
        let item = this.data.imgData[i]
        //文件拓展名
        let suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          //如果存在同名的文件，会覆盖掉
          cloudPath: "blog/" + Date.now() + "-" + Math.random() * 1000000 + suffix,
          filePath: item,
          success: (res) => {
            console.log(res.fileID)
            fillIds = fillIds.concat(res.fileID)
            reslove()
          },
          fail: (err) => {
            reject()
            console.log(err)
          }
        })
      })
      promiseArr.push(p) 
    }
    //存储内容、图片flieID、openid用户标识、昵称、头像、时间到云数据库
    Promise.all(promiseArr).then((res)=>{
      db.collection('blog').add({
        data:{
          ...userInfo,
          content,
          img: fillIds,
          //服务端的时间
          createTime:db.serverDate()
        }
      })
    }).then((res)=>{
      
      wx.showToast({
        title: '发布成功',
      })

      wx.navigateBack()
      const pages = getCurrentPages()
      console.log(pages)
      const prevPage = pages[pages.length - 2]
      prevPage.onPullDownRefresh()

      wx.hideLoading()
      //返回blog页面，刷新
      wx.navigateBack()
    }).catch((err)=>{
      wx.showToast({
        title: '发布失败',
      })
    })
    //存入到云数据库

    
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