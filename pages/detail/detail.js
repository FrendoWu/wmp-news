// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let newsId = options.id;
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data: {
        id: newsId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        let news = res.data.result;
        let date = new Date(news.date);
        news.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        console.log(news);
        this.setData({
          news: news
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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