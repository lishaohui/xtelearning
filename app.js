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
    url:'http://manage.suntien.com:8080/HR/dd'
    //url:'https://testhr.suntien.com/dd'
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
        if(res.data==null){//如果在用户移动端缓存中没有查到信息，则通过钉钉接口查找个人信息
          var authCode = '';
          var access_token = '';
          var userId = '';
          var dduserid = '';
          var ddusername = '';
          // 获取免登授权码
          dd.getAuthCode({
            success:(res) =>{
              authCode = res.authCode;
              // 根据appkey和appSecret获取 access_token 
              dd.httpRequest({
                url: 'https://oapi.dingtalk.com/gettoken?appkey=dingpw9iizqvidxbshud&appsecret=6_SblIaoqLXeRBtNTPCRpzzW8yjMihpTuqNoEEZVv4w5ubZXmG9pto4PT_bO05BQ',
                success: res => {
                  access_token = res.data.access_token
                  // 根据access_token获取userId
                  dd.httpRequest({
                    url: 'https://oapi.dingtalk.com/user/getuserinfo?access_token=' +access_token + '&code=' + authCode,
                    success: res => {
                      userId = res.data.userid
                      //获取用户详情
                      dd.httpRequest({
                        url: 'https://oapi.dingtalk.com/user/get?access_token=' + access_token + '&userid=' + userId,
                        success: function(res) {
                          dduserid = res.data.userid;
                          //console.log(dduserid);
                          ddusername = res.data.name;
                          _this.globalData.globalDDUserId = dduserid;
                          _this.globalData.globalDDUserName = ddusername;
                          dd.httpRequest({
                            url: _this.globalData.url + "/queryUserInfo.do",
                            method: 'POST',
                            dataType: 'json',
                            data:{
                             dduserid:dduserid
                            },
                            success: (res) => {
                              if(res.data.user_id > 0 ){
                                //console.log(res);
                                _this.globalData.StorageDBUserId = res.data.user_id;
                                _this.globalData.globalDBUserId = res.data.user_name;
                                dd.setStorage({
                                  key:'storageHR',
                                  data:{
                                    DBUserId:res.data.user_id,
                                    DBUserName:res.data.user_name,
                                    DDUserName:ddusername
                                  },
                                  success:(res) =>{
                                    dd.redirectTo({url:'/page/worklog/main'})
                                  },
                                  fail:(res)=>{
                                  },
                                  complete:(res)=>{
                                  }
                                })
                              }
                            },
                            fail: (res) => {
                            }
                          })
                        }
                      })
                    },
                    fail: function(err) {
                      console.log(err)
                    }
                  })
                },
                fail: function(err) {
                  console.log(err)
                }
              })
            } 
          }) 
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