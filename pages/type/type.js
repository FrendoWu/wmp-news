// pages/type/type.js
const app = getApp()

Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    userNewsType: [],
    typeValue: app.globalData.typeValue,
    typeKey: app.globalData.typeKey,
    typeStatus: []
  },

  /**
   * 生命周期函数--监听页面加载
   * 获取用户微信个人信息，用、用于显示用户头像和昵称
   * 并绑定用户新闻类型
   */
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      this.bindData()
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true
          })
          this.bindData()
        }
      })
    }
  },
  /**
   * 绑定用户数据
   */
  bindData() {
    // 获取用户新闻tags信息
    app.getUserNewsType(() => {
      this.setData({
        userNewsType: app.globalData.userNewsType
      })
      // 生成typeStatus数组用于渲染wxml
      let typeStatus = [];
      for (let i = 0; i < this.data.typeKey.length; i++) {
        typeStatus.push({
          code: this.data.typeKey[i],
          name: this.data.typeValue[i],
          ifChecked: this.data.userNewsType.indexOf(this.data.typeKey[i]) >= 0
        })
      }
      this.setData({
        typeStatus: typeStatus
      })
    })
  },
  /**
   * 监听用户点击标签事件
   * 用户更新用户标签信息，用于按照用户的标签信息装配新闻列表的新闻类型
   */
  onChangeUserTags(event) {
    let changingTypeIndex = event.currentTarget.dataset.changingtype;
    let checkedTypeStatus = this.data.typeStatus.filter(t => t.ifChecked);
    /**
     * 如果用户点击时只有一个标签被选中且用户点击的就是该选中标签
     * 防止没有标签造成新闻列表显示失败
     */
    if (checkedTypeStatus.length === 1 && checkedTypeStatus[0].code === this.data.typeStatus[changingTypeIndex].code) {
      wx.showToast({
        title: '请至少选择一种',
        image: '/images/notice.png',
        duration: 2000
      })
      return
    }
    let typeStatus = [...this.data.typeStatus];
    let ifChecked = typeStatus[changingTypeIndex].ifChecked
    typeStatus[changingTypeIndex].ifChecked = !ifChecked
    let filteredTags = typeStatus.filter(t => t.ifChecked).map(t => t.code)
    // 更新用户标签信息到野狗云
    let userTag = {
      openId: app.globalData.openId,
      tags: filteredTags
    }
    app.updateTag(userTag, this.bindData);
  }
})