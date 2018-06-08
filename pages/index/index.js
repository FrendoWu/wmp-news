//index.js
//获取应用实例
const newsTypeMap = ['国内', '国际', '财经', '娱乐', '军事', '体育', '其他']
const newsType = ['gn', 'gj', 'cj', 'yl', 'js', 'ty', 'other']

const app = getApp()

Page({
  data: {
    newsTypeMap: newsTypeMap,
    newsType: newsType,
    selectedNewsType: 'gn'
  },
  tapNewsType: function(event) {
    let selectedNewsType = event.currentTarget.dataset.newsType;
    this.setData({
      selectedNewsType: selectedNewsType
    });
    console.log(this.data.selectedNewsType);
  },
  onTapNewsType() {
    wx.navigateTo({
      url: '/pages/type/type',
    })
  }
 })
