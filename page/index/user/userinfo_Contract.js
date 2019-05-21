let app = getApp();
let url = app.globalData.url;

Page({
  data: {
   globalUserName:'',
   contractInfoList:[],
  },
  onLoad(e){
    let _this = this;
    let userId = e.userId;
    //dd.alert({content:userId});
    _this.setData({
      globalUserName:e.name
    })

    dd.httpRequest({
      method:'POST',
      url: url+"/deptUserinfoContract.do",
      datatype: "json",
      data:{
        userId:e.userId,
      },
      success:(res) => {
        let resultList =res.data;
        for(var i = 0; i < resultList.length; i++){
          this.setData({
          contractInfoList:this.data.contractInfoList.concat(resultList[i]),
          })
        }
        this.setData({
          hideList:false
        })
        //dd.alert({content: "success"});
      },
      fail: (err)=>{
        dd.alert({content: "failfail"});
      },
      error:function(msg){
        alert("json异常:"+msg);
      }
    });

  },
});



