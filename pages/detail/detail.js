Page({

  /**
   * 页面的初始数据
   */
  data: {
    news: null
  },
  /**
   * 生命周期函数--监听页面加载
   * 根据路由跳转传递的newId获取新闻详情并渲染
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
        this.setData({
          news: news
        })
      },
    })
  }
})