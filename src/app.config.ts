export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/result/index',
    'pages/history/index',
    'pages/process/index',
    'pages/task/index',
    'pages/tools/index',
    'pages/mine/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'isa-mina',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#1890ff',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/tabbar/home.png',
        selectedIconPath: 'assets/tabbar/home-active.png'
      },
      {
        pagePath: 'pages/task/index',
        text: '任务',
        iconPath: 'assets/tabbar/task.png',
        selectedIconPath: 'assets/tabbar/task-active.png'
      },
      {
        pagePath: 'pages/tools/index',
        text: '工具',
        iconPath: 'assets/tabbar/tools.png',
        selectedIconPath: 'assets/tabbar/tools-active.png'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: 'assets/tabbar/mine.png',
        selectedIconPath: 'assets/tabbar/mine-active.png'
      }
    ]
  }
})
