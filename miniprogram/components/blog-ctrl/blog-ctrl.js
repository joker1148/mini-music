// components/blog-ctrl/blog-ctrl.js
let userInfo = {}
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogid:String,
    blog:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    //登录是否显示
    loginShow:false,
    isBottomShow:false,
    content:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //判断是否授权
    onComment(e){
      wx.getSetting({
        success:(res)=>{
          if(res.authSetting['scope.userInfo']){
            wx.getUserInfo({
              success:(res)=>{
                userInfo = res.userInfo
              }
            })
            this.setData({
              isBottomShow:true
            })
          }else{
            this.setData({
              loginShow:true
            })
          }
        }
      })
    },
    onLoginsuccess(e){
      console.log(e)
      userInfo = e.userInfo
      //授权框消失，评论框显示
      this.setData({
        loginShow:false
      },()=>{
        this.setData({
          isBottomShow:true
        })
      })
    },
    loginFail(){
      wx.showModal({
        title: '授权用户才能评价',
        content: '',
      })
    },
    onInput(e){
      this.setData({
        content:e.detail.value
      })
      console.log(this.data.content)
    },
    onSend(e){
      //插入数据库
      console.log(e)
      let content = this.data.content
      console.log(content)
      if(content.trim()==""){
        wx.showModal({
          title: '评论内容不能为空',
          content: '',
        })
        return
      }
      wx.showLoading({
        title: '评价中',
        mask:true
      })
      console.log(userInfo)
      db.collection("blog-comment").add({
        data:{
          content,
          createTime:db.serverDate(),
          blogId:this.properties.blogid,
          nickName:userInfo.nickName,
          avatarUrl:userInfo.avatarUrl
        }
      }).then((res)=>{
        //推送模板消息

        wx.cloud.callFunction({
          name:"sendMessage",
          data:{
            content,
            blogId: this.properties.blogid
          }
        })

        wx.hideLoading()
        this.triggerEvent("refreshCommentList")

        wx.showToast({
          title: '评论成功',
        })
        this.setData({
          isBottomShow:false,
          content:""
        })

        //父元素刷新评论页面
      })
      


    }
  }
})
