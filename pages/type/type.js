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
  bindData() {
    app.getUserNewsType(() => {
      this.setData({
        userNewsType: app.globalData.userNewsType
      })
      // 生成typeStatus用于渲染
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
  changeUserTags(event) {
    let changingTypeIndex = event.currentTarget.dataset.changingtype;
    let checkedTypeStatus = this.data.typeStatus.filter(t => t.ifChecked);
    if (checkedTypeStatus.length === 1 && checkedTypeStatus[0].code === this.data.typeStatus[changingTypeIndex].code ){
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
    // if (filteredTags.length <= 0) {
    //   wx.showToast({
    //     title: '请至少选择一种',
    //     image: '/images/notice.png',
    //     duration: 2000
    //   })
    //   return
    // }
    // 更新野狗云数据库
    let userTag = {
      openId: app.globalData.openId,
      tags: filteredTags
    }
    console.log(userTag)
    app.updateTag(userTag, this.bindData);
  }
})