let app = getApp();
let url = app.globalData.url;


Page({
    data:{
        userId:'',
        oauserid:'',
        eurl:''
    },
    onLoad(){
        let _this = this;
        dd.getStorage({
          key:'XTelearning',
          success(res){
            if(res.data==null){//如果在用户移动端缓存中没有查到信息，则通过钉钉接口查找个人信息
              var authCode = '';
              var access_token = '';
              var userId = '';
              var oauserid = '';
              // 获取免登授权码
              dd.getAuthCode({
                success:(res) =>{
                  authCode = res.authCode;
                  console.log("authCode:"+authCode);
                  // 根据appkey和appSecret获取 access_token 
                  dd.httpRequest({
                    url: 'https://oapi.dingtalk.com/gettoken?appkey=ding59fxrqrch4o9xmjs&appsecret=bQTa3UgRSuExh5e5h6apzZaIcWWsxze91hRphTkmM-x_DPU8JXfrklGU0O8fg5OU',
                    success: res => {
                      access_token = res.data.access_token;
                      console.log("access_token"+access_token);
                      // 根据access_token获取userId
                      dd.httpRequest({
                        url: 'https://oapi.dingtalk.com/user/getuserinfo?access_token=' +access_token + '&code=' + authCode,
                        success: res => {
                          userId = res.data.userid;
                          console.log(userId);
                          _this.setData({
                            userId:userId
                          }),
                          //获取用户详情
                          dd.httpRequest({
                            url: 'http://47.95.3.208:956/interface/XTgetOAandDDUserId.jsp?dduserid=' + userId,
                            success: function(res) {
                              var result = res.data;
                              oauserid = result.oauserid;
                              console.log(oauserid);
                              _this.setData({
                                oauserid:oauserid
                              });
                              dd.httpRequest({
                                url: url + "/getElearningNameByOAid.do",
                                method: 'POST',
                                data: 'oauserid='+oauserid,
                                dataType: 'json',
                                success: function(res) {
                                  var result = res.data;
                                  var ename =  result.elearningname;
                                  if(ename==null){

                                  }else{
                                    dd.setStorage({
                                      key: 'XTelearning',
                                      data: {
                                        ename: ename,
                                        oauserid:oauserid
                                      }
                                    });
                                    _this.redirectToElearning(ename,oauserid);
                                  }
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
            else{ //如果从缓存中读到
              if(res.data.ename==null){
              }else{
                _this.redirectToElearning(res.data.ename,res.data.oauserid);
              }
            }
          },
          fail(res){
            console.log(res);
          }
        })
    },

    redirectToElearning(ename,oauserid){
      let _this = this;
      dd.httpRequest({
        url: url + "/getDESresult.do",
        method: 'POST',
        data: {
          'data':encodeURIComponent(ename),
          'password':encodeURIComponent('Xtzhc@956')
        },
        dataType:'json',
        success: function(res) {
          var result = res.data;
          // console.log("加密后"+result.result);
          // console.log("加密后转码"+result.result_utf);
          // console.log(encodeURIComponent(result.result));
          // console.log("oauserid:"+oauserid);
          var eurl = "http://wxtest.chinaedu.com/sfs/volcano/suntienTest/#/suntienRedirect?token="+encodeURIComponent(result.result)+"&oauserid="+oauserid;
          // console.log(eurl);
          _this.setData({
            eurl:eurl
          })
        }
      })
    },
    

})