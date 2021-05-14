App({
  globalData: {
    domain:'',
    corpId:'',
    token:"",
    url:'http://manage.suntien.com:7926/HR/dd',
    //url:'http://testhr.suntien.com/dd'
  },
  onLaunch(options) {
    this.globalData.corpId = options.query.corpId;
  },
  onShow() {
    console.log('App Show');
  },
  onHide() {
    console.log('App Hide');
  },
  
});