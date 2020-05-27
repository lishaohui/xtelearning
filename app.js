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
    //url:'http://localhost:8088/HR/dd'
    url:'http://testhr.suntien.com/dd'
  },
  onLaunch(options) {
    //console.log('App Launch', options);
    //console.log('getSystemInfoSync', dd.getSystemInfoSync());
    //console.log('SDKVersion', dd.SDKVersion);
    this.globalData.corpId = options.query.corpId;
    //console.log('corpId', options.query.corpId);

    let _this = this;
    dd.getStorage({
      key:'storageHR',
      success(res){
        //console.log(res);
        if(res.data==null){
          dd.redirectTo({url:'/page/worklog/index'})
        }
        else{
          _this.globalData.StorageDBUserId = JSON.parse(JSON.stringify(res.data.DBUserId));
          _this.globalData.globalDBUserId = JSON.parse(JSON.stringify(res.data.DBUserId));
          _this.globalData.globalDBUserName = JSON.parse(JSON.stringify(res.data.DBUserName));
          _this.globalData.globalDDUserName = JSON.parse(JSON.stringify(res.data.DDUserName));
          dd.redirectTo({url:'/page/worklog/main'})
        }
      },
      fail(res){
        console.log(res);
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