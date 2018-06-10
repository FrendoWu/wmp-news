//index.js
const app = getApp()

Page({
  data: {
    userNewsTypeMap: [],
    userNewsType: [],
    selectedNewsType: 'gn',
    swiperImgUrlList: [],
    news: []
  },
  tapNewsType: function(event) {
    let selectedNewsType = event.currentTarget.dataset.newsType;
    this.setData({
      selectedNewsType: selectedNewsType
    });
    // 重新获取新闻
    this.getNews()
  },
  onTapNewsType() {
    wx.navigateTo({
      url: '/pages/type/type'
    })
  },
  onLoad() {
    // console.log('onLoad')    
  },
  onShow() {
    app.loginAndBindNewsType(() => {
      let userNewsType = app.globalData.userNewsType
      let userNewsTypeMap = userNewsType.map(t => app.globalData.typeValue[app.globalData.typeKey.indexOf(t)]);
      console.log(userNewsTypeMap)
      this.setData({
        userNewsType: userNewsType,
        userNewsTypeMap: userNewsTypeMap,
        selectedNewsType: userNewsType[0]
      });
      this.getNews()
    }
    );
  },
  onPullDownRefresh() {
    this.getNews(() => {
      wx.stopPullDownRefresh()
    })
  },
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
        console.log(data)
        // 随机排序，测试pulldownrefresh
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
  // 用于打乱新闻列表，模拟获取新新闻
  randomsort: (a, b) => {
    return Math.random() > .5 ? -1 : 1;
    //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
  },
  getUserInfo: function (e) {
    // 获取用户openId
    app.globalData.userInfo = e.detail.userInfo;
    wx.navigateTo({
      url: '/pages/type/type',
      success: event => {
        console.log(event)
      }
    })
  },
  goToDetail(event) {
    let newsId = event.currentTarget.dataset.newsid;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + newsId
    })
  }
 })
