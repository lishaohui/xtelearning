let app = getApp();
let url = app.globalData.url;


Page({
  data: {
    ProqualificationInfoList:[],
    id:'',
    globalUserJobName:'',
   

  },
  onLoad(options) {
    let _this = this;
    _this.setData({
      globalUserJobName:options.name,
    }),
    
   
    dd.httpRequest({
        method:'POST',
        url: url+"/deptUserinfoProQualification.do",
        datatype: "json",
        data:{
          userId:options.userId,

        },
        success:(res) => {
          let resultList =res.data;
          for(var i = 0; i < resultList.length; i++){
            this.setData({
            ProqualificationInfoList:this.data.ProqualificationInfoList.concat(resultList[i]),
            })
          }
          this.setData({
            hideList:false
          })
        },
         
        fail: (err)=>{
                dd.alert({content: "fail"});
        },
         error:function(msg){
           alert("json异常:"+msg);
         }
      })
  },
 
  
});
