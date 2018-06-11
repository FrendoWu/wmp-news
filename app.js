// 导入野狗云js实体
const wilddog = require('wilddog-weapp-all')

const appid = 'wxfe0a21bc2795bf45'; //微信小程序appid 
const secret = 'e528ca17b388a2e1f8656bb38a840c4c'; //微信小程序secret 

// 新闻类型
const typeVaule = ['国内', '国际', '财经', '娱乐', '军事', '体育', '其他'];
const typeKey = ['gn', 'gj', 'cj', 'yl', 'js', 'ty', 'other'];

App({
  globalData: {
    typeValue: typeVaule,
    typeKey: typeKey,
    userInfo: null,
    openId: null,
    userNewsType: [],
    wilddogUserKey: ''
  },
  /**
   * 系统初始化函数
   * 配置野狗云
   * 加载野狗云服务用于存储用户勾选的标签tag信息
   * 实例化标签实体
   */
  onLaunch: function () {
    let config = {
      syncURL: 'https://wd0363105414udkihu.wilddogio.com',
      authDomain: 'wd0363105414udkihu.wilddogio.com'
    };
    wilddog.initializeApp(config);
    this.tagListsRef = wilddog.sync().ref("tagLists");
  },
  /**
   * 函数用于获取用户tags信息
   * 传入openId，根据用户openId获取用户的Tag信息
   * 传入回调函数，执行获得tag之后的操作
   */
  getTag: function (openId, callback) {
    // 获得野狗云tag列表数据，判断野狗云中是否有该用户的tags信息
    this.tagListsRef.once("value", (snapshot) => {
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
        // 如果有，将查询的该用户的tags赋值给userNewsType
        this.globalData.userNewsType = value[wilddogUserKey]['tags']
        this.globalData.wilddogUserKey = wilddogUserKey;
      } else {
        // 如果没有，默认给用户附上所有新闻类型，并将该用户信息存储到野狗云
        // 解决openId为undefined报错的bug，判断openId是否有
        if (!!openId) {
          let userTag = {
            openId: !!openId ? openId : '',
            tags: this.globalData.typeKey
          }
          this.addTag(userTag);
        }
        this.globalData.userNewsType = this.globalData.typeKey
      }
      callback && callback();
    });
  },
  /**
   * 函数用于添加新用户tags信息
   * 传入openId，根据用户openId获取用户的Tag信息
   */
  addTag: function (userTag) {
    this.tagListsRef.push(userTag, function (error) {
      if (error == null) {
        // 数据上传野狗云成功
      } else {
        wx.showToast({
          title: '获取用户信息失败，请重试',
        })
      }
    })
  },
  /**
   * 函数用于更新当前用户tags信息
   * 传入userTag，根据用户userTag中的openId更新tags信息
   * 传入回调函数，执行更新用户tags之后的操作
   */
  updateTag: function (userTag, callback) {
    this.tagListsRef.child(this.globalData.wilddogUserKey).set(userTag, error => {
      if (error == null) {
        // 数据同步到野狗云端成功完成，执行回调函数
        callback && callback()
      } else {
        wx.showToast({
          title: '修改用户信息失败，请重试',
        })
      }
    })
  },
  /**
   * 获取用户新闻类型
   */
  getUserNewsType(callback) {
    let openId = this.globalData.openId;
    // 不为null表示获取到openId了
    if (openId !== null) {
      // 获取用户tag信息
      this.getTag(openId, () => {
        callback && callback();
      })
    } else {
      // 未获取到openId，则默认显示全部新闻类型
      this.globalData.userNewsType = this.globalData.typeKey;
      callback && callback();
    }
  },
  /**
   * 登录并绑定用户的新闻类型
   * 传入callback回调函数，执行获取用户的新闻类型之后的操作
   */
  loginAndBindNewsType: function (callback) {
    // 微信登录
    wx.login({
      success: res => {
        let loginCode = res.code;
        //调用request请求api转换登录凭证获取openId
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
  }
})