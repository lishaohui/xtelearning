let app = getApp();
let url = app.globalData.url;

Page({
  data:{
        corpId: '',
        authCode:'',
        globalDBUserName:'',
        globalDDUserName:'',
        globalDBUserId:'',
        globalUserJobName:'',
        userjobList:[],
    },
    onLoad(e){

        let _this = this;
        let name = e.name;
        _this.setData({
          globalUserJobName:e.name
        })  

         dd.httpRequest({
         method:'POST',
         url: url+"/deptUserinfoJob.do",
         datatype: "json",
         data:{
          userId:e.userId,
          
         },
        success:(res) => {
          let resultList =res.data;
          for(var i = 0; i < resultList.length; i++){
            this.setData({
            userjobList:this.data.userjobList.concat(resultList[i]),
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
      });
      },
    
    
     navigateback(){
       dd.navigateTo({ url: '/page/index/main' })
     },
    
})