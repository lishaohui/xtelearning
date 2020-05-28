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
        select_date:'',
        select_data_time:'',
        today_time:'',
    },
    onLoad(options){

        let _this = this;
        dd.getStorage({
          key:'storageHR',
          success(res){
            var DBUserId = JSON.parse(JSON.stringify(res.data.DBUserId))
            var DBUserName = JSON.parse(JSON.stringify(res.data.DBUserName))
            var DDUserName = JSON.parse(JSON.stringify(res.data.DDUserName))
            _this.setData({
              globalDBUserId:DBUserId,
              globalDBUserName:DBUserName,
              globalDDUserName:DDUserName
            })  
          }
        });
      var today = new Date();
      var today_time = today.getTime();
      
      var year = today.getFullYear();
      var month = today.getMonth() + 1;
      month = month <10 ? "0"+month : month;
      var day = today.getDate();
      day = day <10 ? "0"+day : day;
      var today_d = year +"-"+ month +"-"+ day;
      _this.setData({
        select_date:today_d,
        today_time:today_time
      })
    },
    

    
    datePicker() {
      let _this = this;

      dd.datePicker({
        format: 'yyyy-MM-dd',
        currentDate:'',
        startDate: '2019-01-01',
        endDate: '2099-12-31',
        success: (res) => {
          var temp = res.date + " 00:00:00";
          var ddd = new Date(temp);
          var select_time = ddd.getTime();
           _this.setData({
              select_date:JSON.parse(JSON.stringify(res.date)),
              select_data_time:select_time,
            })  
        },
      });
    },

    worklogQuery(){
      if(this.data.today_time <= this.data.select_data_time){
        dd.alert({
          title:"温馨提示",
          content:"不可制定今天之后的日志",
          buttonText: '确定',
        })
      }else{
        var select_date = this.data.select_date;
        dd.redirectTo({url:'/page/worklog/detail?date='+select_date})
      }
    }
})