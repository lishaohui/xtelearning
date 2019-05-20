let app = getApp();
let url = app.globalData.url;

Page({
  data:{
    userId:''
  },
  onLoad(options){
    let _this = this;
    let userId = options.userId;
    dd.alert({content:userId});
    dd.httpRequest({
        method:'POST',
        url: url+"/deptUserinfoEducation.do",
        datatype: "json",
        data:{
          userId:userId
        },
        success:(res) => {
          console.log("-----",res.data);
        },
        fail: (err)=>{
          dd.alert({content: "fail"});
        },
        error:function(msg){
        }
      });
  },

})