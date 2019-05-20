let app = getApp();
let url = app.globalData.url;

Page({
  data:{
     trainInfoList:[]
      
    },
    onLoad(e){

        let _this = this;
        let userId = e.userId;
       
        //dd.alert({content:userId})
        dd.httpRequest({
        method:'POST',
        url: url+"/deptUserinfoProSkillPosition.do",
        datatype: "json",
        data:{
          userId:e.userId,
        },
        success:(res) => {
          console.log("success",res)
          let resultList =res.data;
          for(var i = 0; i < resultList.length; i++){
            this.setData({
            trainInfoList:_this.data.trainInfoList.concat(resultList[i]),
            })
          }
          this.setData({
            hideList:false
          })
          //dd.alert({content: "success"});

        },
        fail: (err)=>{
                dd.alert({content: "fail"});
        },
        error:function(msg){
          alert("json异常:"+msg);
        }

      });

        
      
       


        
    },
    

    
})