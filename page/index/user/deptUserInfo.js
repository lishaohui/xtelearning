let app = getApp();
let url = app.globalData.url;

Page({
    data: {
      select: false,
      department: '部门列表',
      deptList:[],
      deptUserList:[],
      deptId:'',
      hideList: true,
    },
    onLoad() {
      let _this = this;
      dd.httpRequest({
        method:'POST',
        url: url+"/deptQuery.do",
        datatype: "json",
        success:(res) => {
          console.log('success', res);
          let resultList =res.data;
          for(var i = 0; i < resultList.length; i++){
            this.setData({
            deptList:_this.data.deptList.concat(resultList[i]),
            })
          };
          //dd.alert({content: _this.data.deptList});
        },
        fail: (err)=>{
                dd.alert({content: "fail"});
        },
        error:function(msg){
        }
      });
    },
    ShowDept() {
      this.setData({
          select:!this.data.select
      })
    },
    mySelect(e) {
      var name = e.currentTarget.dataset.name;
      var deptId = e.currentTarget.dataset.value;
      this.setData({
        department:name,
        select: false,
        deptId:deptId,
        deptUserList:[]
      });
      let _this = this;
      dd.httpRequest({
        method:'POST',
        url: url+"/deptUserQuery.do",
        datatype: "json",
        data:{
          deptId:deptId
        },
        success:(res) => {
          console.log("-----",res.data);
          let resultList =res.data;
          for(var i = 0; i < resultList.length; i++){
            this.setData({
            deptUserList:_this.data.deptUserList.concat(resultList[i]),
            hideList:false
            })
          };
        },
        fail: (err)=>{
          dd.alert({content: "fail"});
        },
        error:function(msg){
        }
      });

    },
    userDetail(e){
      var userId = e.currentTarget.dataset.value;
      dd.navigateTo({ url: '/page/index/user/userinfo_education?userId='+userId })
    }
 
})
