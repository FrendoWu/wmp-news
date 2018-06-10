//index.js
const app = getApp()

Page({
  data: {
    userNewsTypeMap: [],
    userNewsType: [],
    selectedNewsType: '',
    swiperImgUrlList: [],
    news: []
  },
  /**
   * 监听页面显示事件
   * 每次回到新闻列表页时，都去重新获取用户信息并更新新闻列表
   */
  onShow() {
    app.loginAndBindNewsType(() => {
      let userNewsType = app.globalData.userNewsType
      let userNewsTypeMap = userNewsType.map(t => app.globalData.typeValue[app.globalData.typeKey.indexOf(t)]);
      this.setData({
        userNewsType: userNewsType,
        userNewsTypeMap: userNewsTypeMap,
        selectedNewsType: userNewsType[0]
      });
      this.getNews()
    }
    );
  },
  /**
   * 监听新闻类型点击事件
   * 根据点击的新闻类型重新获取新闻列表
   */
  onTapNewsType: function(event) {
    let selectedNewsType = event.currentTarget.dataset.newsType;
    this.setData({
      selectedNewsType: selectedNewsType
    });
    // 获取新闻
    this.getNews()
  },
  /**
   * 监听用户下拉刷新事件
   * 重新更新新闻列表
   */
  onPullDownRefresh() {
    this.getNews(() => {
      wx.stopPullDownRefresh()
    })
  },
  /**
   * 获取新闻并执行回调函数
   */
  getNews(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: this.data.selectedNewsType
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        let data = res.data.result;
        // 修正date数据格式
        data.forEach(d => {
          let date = new Date(d.date);
          d.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        })
        // 随机排序，模拟获取到的新闻列表发生变化，测试pulldownrefresh
        data.sort(this.randomsort)
        // 提取获得的数据的前三项作为swiper的数据，不满3项取全部
        this.setData({
          swiperImgUrlList: data.length >= 3 ? data.slice(0, 3) : data,
          news: data
        })
      },
      complete: () => {
        callback && callback()
      }
    })
  },
  /**
   * 排序辅助函数，用于打乱新闻列表，模拟获取新新闻列表
   */
  randomsort: (a, b) => {
    //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
    return Math.random() > .5 ? -1 : 1;
  },
  /**
   * 监听新闻类型设置点击事件
   * 获取用户信息授权并跳转至新闻类型设置页面
   */
  getUserInfo: function (e) {
    // 获取用户openId
    app.globalData.userInfo = e.detail.userInfo;
    // 如果获取用户信息成功则跳转
    if (e.detail.userInfo) {
      wx.navigateTo({
        url: '/pages/type/type'
      })
    }
  },
  /**
   * 绑定新闻列表的新闻和swipper区域新闻点击事件，跳转至新闻详情页
   */
  goToDetail(event) {
    let newsId = event.currentTarget.dataset.newsid;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + newsId
    })
  }
 })
