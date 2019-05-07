App({
  globalData: {
    domain:'',
    corpId:'',
    token:"",
    globalDBUserId:'',       //人资系统登录用户数据库所对应Id
    globalDDUserId:'',       //钉钉客户端登录用户id
    globalDBUserName:'',     //人资系统登录用户数据库所对应姓名
    globalDDUserName:'',     //钉钉客户端登录用户姓名
    StorageDBUserId:'',
    //url:'http://suntien.vaiwan.com'
    url:'http://localhost:8088/HR/dd/'
  },
  onLaunch(options) {
    console.log('App Launch', options);
    console.log('getSystemInfoSync', dd.getSystemInfoSync());
    console.log('SDKVersion', dd.SDKVersion);
    this.globalData.corpId = options.query.corpId;

    let _this = this;
    dd.getStorage({
      key:'storageDBUserId',
      success(res){
        _this.globalData.StorageDBUserId = JSON.stringify(res.data.DBUserId)
        _this.globalData.globalDBUserId = JSON.stringify(res.data.DBUserId)
        _this.globalData.globalDBUserName = JSON.stringify(res.data.DBUserName)
        _this.globalData.globalDDUserName = JSON.stringify(res.data.DDUserName)
        if(_this.globalData.StorageDBUserId==''){
          dd.reLaunth({url:'/page/index/index'})
        }
        else{
          dd.redirectTo({url:'/page/index/main'})
        }
      }
    })

    
      
  },
  onShow() {
    console.log('App Show');
  },
  onHide() {
    console.log('App Hide');
  },
  
});