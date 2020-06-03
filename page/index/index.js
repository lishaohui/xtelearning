let app = getApp();
let url = app.globalData.url;

Page({
    data:{
        authCode:'',
        access_token:'',
        userId:'',
        userName:'',
        loginName:'',
        password:'',
        globalUserId:'',
        isShowClear:false,
        isShowSeePwd:false,
    },
    onLoad(){
        let _this = this;
    },

    loginSubmit(){
      var loginName = this.data.loginName;
      var password = this.data.password;
      if(loginName ==""){
        dd.showToast({
          content:'用户名不能为空！',
          type:'text',
          timer:1500,
          color:'#fff',
          success:() =>console.log('用户名不能为空')
        })
        return;
      }else if(password ==""){
        dd.showToast({
          content:'密码不能为空！',
          type:'text',
          timer:1500,
          color:'#fff',
          success:() =>console.log('密码不能为空')
        })
        return;
      }

      dd.showLoading({
        content:'登录中...',
      });

      dd.getAuthCode({
        success:(res) =>{
          this.setData({authCode:res.authCode})
          dd.httpRequest({
            url: url+"/HRlogin.do",
            method: 'POST',
            dataType: 'json',
            data:{
              loginName:loginName,
              password:password,
              authCode:res.authCode,
            },
            success: (res) => {
              dd.showToast({
                content:"登录成功！",
                timer:1000,
              });
              var status = res.status;
              //console.log('success----',status);
              if(status == 200){
                let DBUserId = res.data.result.DBUserId;
                let DDUserName = res.data.result.DDUserName;

                app.globalData.globalDBUserId = DBUserId;
                app.globalData.globalDBUserName = loginName;
                app.globalData.globalDDUserName = DDUserName;

                dd.setStorage({
                  key:'storageHR',
                  data:{
                    DBUserId:DBUserId,
                    DBUserName:loginName,
                    DDUserName:DDUserName
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
              dd.hideLoading();
              console.log("httpRequestFail---",res)
              dd.alert({
                content:"用户名或密码错误，请重新登录",
                success:() =>{
                  dd.reLaunch({
                    url:'/page/index/index',
                  })
                }
              });
            },
            complete: (res) => {
              dd.hideLoading();
            }           
          });
        },
        fail:(res) =>{
          console.log("httpRequestFail---",res)
          dd.alert({content: JSON.stringify(res)});
        },
        complete:(res) =>{
        }
        
      })
      
    },
    keyInput(e){
      switch(e.target.id){
        case 'loginName':
            var showflag = false;
            if(e.detail.value==""){
              showflag = false;
            }else{
              showflag = true;
            }
            this.setData({
              loginName:e.detail.value,
              isShowClear: showflag
            });
            break;
        case 'password':
            this.setData({password:e.detail.value});
            break;
      }
    }, 
    showPWd(){
      var flag = this.data.isShowSeePwd;
      var flag1 = true;
      if(flag == true){
        flag1 = false;
      }
      this.setData({
        isShowSeePwd:flag1
      })
    },
    clearUsername(){
      this.setData({
        loginName:'',
        isShowClear: false
      });
    } 
      
})