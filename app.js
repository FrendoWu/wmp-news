const wilddog = require('wilddog-weapp-all')

const appid = 'wxfe0a21bc2795bf45'; //填写微信小程序appid  
const secret = 'e528ca17b388a2e1f8656bb38a840c4c'; //微信小程序secret 

//app.js
App({
  globalData: {
    typeValue: ['国内', '国际', '财经', '娱乐', '军事', '体育', '其他'],
    typeKey:['gn', 'gj', 'cj', 'yl', 'js', 'ty', 'other'],
    userInfo: null,
    openId: null,
    userNewsType: [],
    wilddogUserKey: ''
  },
  onLaunch: function() {
    // 加载野狗云服务
    let config = {
      syncURL: 'https://wd0363105414udkihu.wilddogio.com',
      authDomain: 'wd0363105414udkihu.wilddogio.com'
    };
    wilddog.initializeApp(config);
    this.tagListsRef = wilddog.sync().ref("tagLists");
  },
  
  getTag: function(openId, callback) {
    this.tagListsRef.once("value", (snapshot) => {
      callback && callback(snapshot);
    });
  },
  addTag: function(userTag, callback){
    this.tagListsRef.push(userTag, function (error) {
      if (error == null) {
        // 数据同步到野狗云端成功完成
        callback && callback();
      } else {
        wx.showToast({
          title: '获取用户信息失败，请重试',
        })
        console.log(error)
      }
    })
  },
  updateTag: function (userTag, callback) {
    this.tagListsRef.child(this.globalData.wilddogUserKey).set(userTag, error => {
      if (error == null) {
        // 数据同步到野狗云端成功完成
        callback && callback()
      } else {
        wx.showToast({
          title: '修改用户信息失败，请重试',
        })
        console.log(error)
      }
    })
  },

  loginAndBindNewsType: function (callback) {
    // 登录
    wx.login({
      success: res => {
        console.log(res)
        let loginCode = res.code;
        //调用request请求api转换登录凭证
        wx.request({
          url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&grant_type=authorization_code&js_code=${loginCode}`,
          header: {
            'content-type': 'application/json'
          },
          success: res => {
            this.globalData.openId = res.data.openid;
            this.getUserNewsType(callback)
          }
        }) 
      }
    })
  },

  // 根据是否有openId绑定newsType
  getUserNewsType(callback) {
    let openId = this.globalData.openId;
    // 不为null表示获取到openId了
    if (openId !== null) {
      // 获取用户的userNewsType
      // 判断该openId是否在野狗云数据库中存在设置了的tag
      this.getTag(openId, (snapshot) => {
        let value = snapshot.val();
        let ifExist = false;
        let wilddogUserKey = '';
        for (let key in value) {
          if (value[key]['openId'] === openId) {
            ifExist = true;
            wilddogUserKey = key;
            break;
          }
        }
        if (ifExist) {
          // 如果有，则赋值给userNewsType
          this.globalData.userNewsType = value[wilddogUserKey]['tags']
          this.globalData.wilddogUserKey = wilddogUserKey;
        } else {
          // 如果没有，给他默认附上所有新闻类型
          let userTag = {
            openId: openId,
            tags: this.globalData.typeKey
          }
          this.addTag(userTag);
          this.globalData.userNewsType = this.globalData.typeKey
        }
        callback && callback();
      })
    } else {
      // 未获取到用户信息，则默认显示全部
      this.globalData.userNewsType = this.globalData.typeKey;
      callback && callback();
    }
  },
})