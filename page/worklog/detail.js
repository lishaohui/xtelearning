let app = getApp();
let url = app.globalData.url;

Page({
  data:{
    globalDBUserName:'',
    globalDDUserName:"",
    globalDBUserId:'',
    username:'',
    trainTitle:'',
    startDate:'',
    endDate:'',
    isPlaned:'',
    content:'',
    address:'',
    trainPerson:'',
    budget:'',
    trainMode:'',
    submit_flag:'',
    attachments:'',
    trainModeArray:['直授','互动','直授/互动','体验','视频观摩'],
    trainModeIndex:0,
  },
  onLoad(option){
    let _this = this;
    var select_date = option.date;
    
    dd.getStorage({
      key:'storageHR',
      success(res){
        var DBUserId = JSON.stringify(res.data.DBUserId)
        var DBUserName = JSON.stringify(res.data.DBUserName)
        DBUserName = DBUserName.replace(/^\"|\"$/g,'')
        var DDUserName = JSON.stringify(res.data.DDUserName)

        _this.setData({
          globalDBUserId:DBUserId,
          globalDBUserName:DBUserName,
          globalDDUserName:DDUserName
        })  
      }
    })

    dd.alert({
          title:"!"+ _this.data.globalDDUserName,
          content:select_date,
    });
  },
  PickerOnChange(e){
    this.setData({
      trainModeIndex:e.detail.value,
      trainMode:this.data.trainModeArray[e.detail.value]
    });
  },
  startDatePicker() {
    let _this = this;
    dd.datePicker({
      format: 'yyyy-MM-dd', 
      currentDate: '', 
      startDate: '2018-01-01',
      endDate: '2099-12-31',
      success: (res) => {
      _this.setData({
        startDate:res.date
      })
      },
    });
  },
  endDatePicker() {
    let _this = this;
    dd.datePicker({
      format: 'yyyy-MM-dd',
      currentDate: '',
      startDate: '2018-01-01',
      endDate: '2020-12-31',
      success: (res) => {
      _this.setData({
        endDate:res.date
      })
      },
    });
  },
  keyInput(e){
      switch(e.target.id){
        case 'trainTitle':
            this.setData({trainTitle:e.detail.value});
            break;
        case 'address':
            this.setData({address:e.detail.value});
            break;
        case 'trainPerson':
            this.setData({trainPerson:e.detail.value});
            break;
        case 'budget':
            this.setData({budget:e.detail.value});
            break;
      }
    },
  addTrainSubmit(e){
    let _this = this;
    dd.getAuthCode({
      success:(res)=>{
        _this.setData({
          content:e.detail.value.textarea,
          isPlaned:e.detail.value.lib
        })
      }
    })
    var isPlaned = e.detail.value.lib;
    var content = e.detail.value.textarea;
    var trainTitle = _this.data.trainTitle;
    var startDate = _this.data.startDate;
    var endDate = _this.data.endDate;
    var address = _this.data.address;
    var trainPerson = _this.data.trainPerson;
    var budget = _this.data.budget;
    var trainMode = _this.data.trainMode;

    if(trainTitle ==""){
        dd.showToast({
          content:'培训名称不能为空！',
          type:'text',
          timer:1500,
          color:'#fff',
        })
        return;
      }else if(startDate ==""){
        dd.showToast({
          content:'请选择培训开始日期！',
          type:'text',
          timer:1500,
          color:'#fff',
        })
        return;
      }else if(endDate ==""){
        dd.showToast({
          content:'请选择培训结束日期！',
          type:'text',
          timer:1500,
          color:'#fff',
        })
        return;
      }else if(isPlaned ==""){
        dd.showToast({
          content:'请选择是否计划内！',
          type:'text',
          timer:1500,
          color:'#fff',
        })
        return;
      }else if(content ==""){
        dd.showToast({
          content:'培训内容不能为空！',
          type:'text',
          timer:1500,
          color:'#fff',
        })
        return;
      }else if(address ==""){
        dd.showToast({
          content:'培训地点不能为空！',
          type:'text',
          timer:1500,
          color:'#fff',
        })
        return;
      }else if(trainPerson ==""){
        dd.showToast({
          content:'参训人员不能为空！',
          type:'text',
          timer:1500,
          color:'#fff',
        })
        return;
      }else if(budget ==""){
        dd.showToast({
          content:'费用预算不能为空！',
          type:'text',
          timer:1500,
          color:'#fff',
        })
        return;
      }else if(trainMode==''){
        dd.showToast({
          content:'请选择培训方式！',
          type:'text',
          timer:1500,
          color:'#fff',
        })
        return;
      }


    dd.httpRequest({
      url: url+"/addTrain.do",
      method: 'POST',
      dataType: 'json',
      data:{
        userId:_this.data.globalDBUserId,
        trainTitle:_this.data.trainTitle,
        startDate:_this.data.startDate,
        endDate:_this.data.endDate,
        isPlaned:e.detail.value.lib,
        content:e.detail.value.textarea,
        address:_this.data.address,
        trainPerson:_this.data.trainPerson,
        budget:_this.data.budget,
        trainMode: _this.data.trainMode,
        submit_flag:0,
        attachments:''
      },
      success: (res) => {
        console.log('success----',res)
        dd.alert({
          title:"操作成功",
          content:"培训申请添加成功！",
          success:()=>{
            dd.redirectTo({url:'/page/index/main'})
          }
        });
        
      },
      fail: (res) => {
        console.log("httpRequestFail---",res)
              
      },
      complete: (res) => {
      }           
    })
  }
});
