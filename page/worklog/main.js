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
        select_date:''
    },
    onLoad(options){

        let _this = this;
        dd.getStorage({
          key:'storageHR',
          success(res){
            var DBUserId = JSON.parse(JSON.stringify(res.data.DBUserId))
            var DBUserName = JSON.parse(JSON.stringify(res.data.DBUserName))
            var DDUserName = JSON.parse(JSON.stringify(res.data.DDUserName))
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
    
    datePicker() {
      var today = new Date();
      var year = today.getFullYear();
      var month = today.getMonth() + 1 ;
      var day = today.getDate();
      let _this = this;

      dd.datePicker({
        format: 'yyyy-MM-dd',
        currentDate:'',
        startDate: '2019-01-01',
        endDate: '2099-12-31',
        success: (res) => {
           _this.setData({
              select_date:JSON.parse(JSON.stringify(res.date)),
            })  
        },
      });
    },

    worklogQuery(){
      var select_date = this.data.select_date;
      dd.redirectTo({url:'/page/worklog/detail?date='+select_date})
    }
})