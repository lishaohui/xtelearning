let app = getApp();
let url = app.globalData.url;

Page({
  data:{
        corpId: '',
        authCode:'',
        globalDBUserName:'',
        globalDDUserName:'',
        globalDBUserId:'',
        hideList: true,
        trainInfoList:[],
    },
    onLoad(options){

        let _this = this;
        dd.getStorage({
          key:'storageDBUserId',
          success(res){
            var DBUserId = JSON.stringify(res.data.DBUserId)
            var DBUserName = JSON.stringify(res.data.DBUserName)
            var DDUserName = JSON.stringify(res.data.DDUserName)
            // dd.alert({
            //   title:"读取数据",
            //   content:data
            // })
            _this.setData({
              globalDBUserId:DBUserId,
              globalDBUserName:DBUserName,
              globalDDUserName:DDUserName
            })  
          }
        })
    },
    removeStorage(){
      dd.removeStorage({
        key:'storageDBUserId',
        success(){
          this.setData({
            key:'',
            data:''
          })
        }
      })
      dd.redirectTo({url:'/page/index/index'})
    },
    navigateTo(){
      dd.navigateTo({ url: '/page/index/addTrain/addTrain' })
    },
    DeptUserQuery(){
      dd.navigateTo({ url: '/page/index/user/deptUserInfo' })
    },
    trainQuery(){
      this.setData({
        trainInfoList:[]
      })
      dd.httpRequest({
        method:'POST',
        url: url+"/query.do",
        datatype: "json",
        success:(res) => {
          let resultList =res.data;
          for(var i = 0; i < resultList.length; i++){
            this.setData({
            trainInfoList:this.data.trainInfoList.concat(resultList[i]),
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
})