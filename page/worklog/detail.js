let app = getApp();
let url = app.globalData.url;

Page({
  data:{
    globalDBUserName:'',
    globalDDUserName:"",
    globalDBUserId:'',
    animMaskData: [],
    animContentData: [],
    hidden: true,
    worklogList1:[],//当天工作列表
    worklogList2:[],//第二天工作列表
    row1: 0,//当天工作情况记录数量
    row2: 0,//第二天工作情况 记录数量
    current_row:0,
    worklogDate:'',
    worklogFlag: 0,//标记，0是新增
    worklogType:'' ,//内容类型，是当天工作内容 还是 第二天工作内容
    modal_kpi_id:-1,
    submit_diasbled:true,//默认为true,即不可提交
    formtype:"button",//关于提交按钮的类型，默认为普通按钮
  },
  onLoad(option){
    let _this = this;
    var select_date = option.date;
    
    dd.getStorage({
      key:'storageHR',
      success(res){
        var DBUserId = JSON.stringify(res.data.DBUserId);
        var DBUserName = JSON.stringify(res.data.DBUserName);
        DBUserName = DBUserName.replace(/^\"|\"$/g,'');
        var DDUserName = JSON.stringify(res.data.DDUserName);

        _this.setData({
          globalDBUserId:DBUserId,
          globalDBUserName:DBUserName,
          globalDDUserName:DDUserName,
          worklogDate:select_date
        }) ;

        dd.httpRequest({
          method:'POST',
          url: url+"/getWorklogParam.do",
          datatype: "json",
          data:{
            userId: _this.data.globalDBUserId,
            select_date: select_date,
          },
          success:(res) => {
            var result = res.data;
            var wflag = result.flag;
            var list = result.list;
            
            //将从人资端查到的工作日志记录，填写在钉钉端
            if(wflag==0){//wflag=0 代表所选日期工作日志为新增（未填报状态）
              if(list.length==0){ //如果上一工作日志的第二天工作为空，则今天渲染一条空记录
                var map = {};
                map.row = 1;
                map.log1 = "";
                map.log2 = "";
                map.log3 = "";
                _this.setData({
                  worklogList1: _this.data.worklogList1.concat(map),
                  worklogList2: _this.data.worklogList2.concat(map),
                  row1: 1,
                  row2: 1
                })
              }else{ //如果上一工作日志的第二天工作不为空，则今天的工作内容是昨天的第二天工作
                for(var i = 0; i < list.length; i++){
                  var map = {};
                  map.row = i+1;
                  map.log1 = list[i].work_content;
                  map.log2 = list[i].work_result;
                  map.log3 = list[i].work_analysis;
                  _this.setData({
                    worklogList1: _this.data.worklogList1.concat(map),
                    row1 : list.length,
                  })
                }
                var mapt = {};
                mapt.row = 1;
                mapt.log1 = "";
                mapt.log2 = "";
                mapt.log3 = "";
                _this.setData({
                    worklogList2: _this.data.worklogList2.concat(mapt),
                    row2: 1
                  })
              }
            }else{
                for(var i = 0; i < list.length; i++){
                  var row1 = _this.data.row1;
                  var row2 = _this.data.row2;
                  if(list[i][0].work_type==1){
                    var map = {};
                    map.row = row1 + 1;
                    map.log1 = list[i][0].work_content;
                    map.log2 = list[i][0].work_result;
                    map.log3 = list[i][0].work_analysis;
                    _this.setData({
                      worklogList1: _this.data.worklogList1.concat(map),
                      row1 : map.row,
                      modal_kpi_id:list[0][0].worklog_id,
                    })
                  }else{
                    var map = {};
                    map.row = row2 + 1;
                    map.log1 = list[i][0].work_content;
                    map.log2 = list[i][0].work_result;
                    map.log3 = list[i][0].work_analysis;
                    _this.setData({
                      worklogList2: _this.data.worklogList2.concat(map),
                      row2 : map.row,
                    })
                  }
                }
            }

            //再检查能否提交
            var disable_flag = true;
            var formtype_flag = "button";
            var now_time = new Date().getTime();//进入页面时的时间
            var allow_time = select_date + " 17:20:00";
            var allow_time_long = new Date(allow_time).getTime();//允许提交时间为选择日期当天的17:20
            if(wflag == 0 || wflag == 3){
              if(now_time >= allow_time_long){
                disable_flag = false;
                formtype_flag = "submit";
              }
            }
            _this.setData({
              worklogFlag: wflag,
              submit_diasbled:disable_flag,
              formtype: formtype_flag, 
            });

          },
          fail: (err)=>{
          },
          error:function(msg){
          }
        });
      }
    });

  },
  
   //添加一个列表
   objectAdd1(e) {
      var addlist = this.data.worklogList1;
      var obj = {
        row: this.data.worklogList1.length + 1
      }
      addlist.push(obj)
      this.setData({
        worklogList1: addlist,
        row1: this.data.row1 + 1
      })
   },
   //添加一个列表
   objectAdd2(e) {
      var addlist = this.data.worklogList2;
      var obj = {
        row: this.data.worklogList2.length + 1
      }
      addlist.push(obj)
      this.setData({
        worklogList2: addlist,
        row2: this.data.row2 + 1
      })
   },
   //减少一个列表 从最后一个开始减少
   objectMove(e) {
     if (this.data.worklogList.length > 0) {
       this.data.worklogList.splice(this.data.worklogList.length - 1, 1);
       this.setData({
         worklogList: this.data.worklogList,
         row: this.data.row - 1,
       })
     }
   },

  deleteLog(e){
    let _this = this;
    var type = e.currentTarget.dataset.name;//初始值为空。空代表第二天工作情况，非空代表当天工作情况
    var index =  e.currentTarget.dataset.value;
    var row = "";
    if(type.length>0){
      row = _this.data.row1;
    }else{
      row = _this.data.row2;
    }
    if(row==1){
      dd.showToast({ 
          content:'工作情况不能少于一条',
          type:'text',
          timer:1500,
          color:'#fff',
        })
    }else{
      dd.confirm({
        title: '亲',
        content: '您确定要删除这条内容吗？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        success({ confirm }) {
          if(confirm){
            if(type.length>0){
              var worklog1 = _this.data.worklogList1;
              if(worklog1.length > 0){
                worklog1.splice(index-1,1);
              }
              _this.setData({
                worklogList1 : worklog1,
                row1 : _this.data.row1 -1
              })
            }else{
              var worklog2 = _this.data.worklogList2;
              if(worklog2.length > 0){
                worklog2.splice(index-1,1);
              }
              _this.setData({
                worklogList2 : worklog2,
                row2 : _this.data.row2 -1
              })
            }
          }
          _this.onModalCloseTap(); 
        },
        fail() {
          console.log('fail');
        },
        complete() {
          console.log('complete');
        },
      });
    }
  },

  saveWorklog(data){
    var detail = data.detail;
    var form_type = data.buttonTarget.dataset.name;
    var row1 = this.data.row1;
    var row2 =  this.data.row2;
    var msg = "";
    var params = {};
    params.user_id = this.data.globalDBUserId;
    params.worklog_date = new Date(this.data.worklogDate+" 00:00:00").getTime();
    var selfscore = detail.value.selfscore;
    params.selfscore = selfscore;
    if(selfscore.length <= 0){
      msg += "5s自评分未填写！\r\n";
    }else if(parseInt(selfscore) < 0 || parseInt(selfscore) > 100){
      msg += "5s自评分应在分值范围内填写！\r\n";
    }
    params.items = [];
    params.submit_flag = 0;
    params.modal_kpi_id = this.data.modal_kpi_id;
    for(var i = 0; i< row1; i++){
      var param={};
      param.work_type = 1;
      param.work_content = detail.value["list1-"+(i+1)+"-log1"];
      if(param.work_content.length <= 0){
        msg += "第"+(i+1)+"条工作内容未填写！\r\n";
      }
      param.work_result = detail.value["list1-"+(i+1)+"-log2"];
      if(param.work_result.length <= 0){
        msg += "第"+(i+1)+"条实际完成情况未填写！\r\n";
      }
      param.work_analysis = detail.value["list1-"+(i+1)+"-log3"];
      if(param.work_analysis.length <= 0){
        msg += "第"+(i+1)+"条完成情况分析未填写！\r\n";
      }
      param.rent = (i+1);
      params.items.push(param);
    }
    for(var i = 0; i< row2; i++){
      var param={};
      param.work_type = 2;
      param.work_content = detail.value["list2-"+(i+1)+"-log1"];
      if(param.work_content.length <= 0){
        msg += "第"+(i+1)+"条计划工作内容未填写！\r\n";
      }
      param.work_result = detail.value["list2-"+(i+1)+"-log2"];
      param.work_analysis = detail.value["list2-"+(i+1)+"-log3"];
      param.rent = (i+1);
      params.items.push(param);
    }
    if(form_type=="save"){
      params.submit_flag = 0;
    }else if(form_type=="submit"){
      params.submit_flag = 1;
      if(msg.length>0){
        dd.alert({
          title:"提示",
          content:msg,
          buttonText: '确定',
        })
      }
    }
    if(form_type=="save" || (form_type=="submit"&&msg.length<=0)){//如果是暂存或提交（无报错信息）
      dd.httpRequest({
        url: url+"/saveWorklogitems.do",
        method: 'POST',
        dataType: 'json',
        data:{
          params:JSON.stringify(params),
        },
        success: (res) => {
          //console.log(res);
          this.setData({
            modal_kpi_id:res.data.modal_kpi_id
          })
          dd.alert({
            title:"提示",
            content:res.data.msg,
            buttonText: '确定',
            success: (res) =>{
              dd.reLaunch({url:'/page/worklog/main'})
            }
          })
          if(form_type=="submit"){
            this.setData({
              submit_diasbled:true
            })
          }
        },
        fail: (res) => {
          
        },
        complete: (res) => {
        }           
      });
    }
  },

  getTemplateData(data){
    let _this = this;
    var type= data.buttonTarget.dataset.name;//初始值为空。空代表第二天工作情况，非空代表当天工作情况
    var index =  data.buttonTarget.dataset.value;
    var log1 = data.detail.value.template_log1;
    var log2 = data.detail.value.template_log2;
    var log3 = data.detail.value.template_log3;
    var msg = "";
    if(type.length>0){ //当天工作情况
    //   if(log1==""){
    //     msg += "工作内容不能为空！\r\n";
    //   }
    //   if(log2==""){
    //     msg += "实际完成情况不能为空！\r\n";
    //   }
    //   if(log3==""){
    //     msg += "完成情况分析不能为空！";
    //   }
    //   if(msg.length>0){
    //     dd.showToast({ 
    //       content: msg,
    //       type:'text',
    //       timer:1500,
    //       color:'#fff',
    //     })
    //   }else{
        var value1 = "worklogList1["+(index-1)+"].log1";
        var value2 = "worklogList1["+(index-1)+"].log2";
        var value3 = "worklogList1["+(index-1)+"].log3";
        _this.setData({
          [value1]: log1,
          [value2]: log2,
          [value3]: log3,
        })
        _this.onModalCloseTap();
      // }
    }else{//第二天工作情况
      // if(log1==""){
      //   msg += "计划工作内容不能为空！\r\n";
      // }
      // if(log2==""){
      //   msg += "工作完成节点不能为空！\r\n";
      // }
      // if(log3==""){
      //   msg += "工作关键点不能为空！";
      // }
      // if(msg.length>0){
      //   dd.showToast({ 
      //     content: msg,
      //     type:'text',
      //     timer:1500,
      //     color:'#fff',
      //   })
      // }else{
        var value1 = "worklogList2["+(index-1)+"].log1";
        var value2 = "worklogList2["+(index-1)+"].log2";
        var value3 = "worklogList2["+(index-1)+"].log3";
        _this.setData({
          [value1]: log1,
          [value2]: log2,
          [value3]: log3,
        })
        _this.onModalCloseTap();
      //}
    }
  },

  FillWorklog(e) {
      var row = e.currentTarget.dataset.value;
      var type = e.currentTarget.dataset.name;
      var temp = '';
      if(type=="worklog1"){
        temp ='1';
      }
      this.setData({
        hidden: !this.data.hidden,
        current_row:row,
        worklogType:temp
      });
      this.createMaskShowAnim();
      this.createContentShowAnim();
    
    },
    
    onModalCloseTap() {
      this.createMaskHideAnim();
      this.createContentHideAnim();
      setTimeout(() => {
        this.setData({
          hidden: true,
        });
      }, 210);
    },
    createMaskShowAnim() {
      const animation = dd.createAnimation({
        duration: 200,
        timingFunction: 'cubic-bezier(.55, 0, .55, .2)',
      });

      this.maskAnim = animation;
  
      animation.opacity(1).step();
      this.setData({
        animMaskData: animation.export(),
      });
    },
    createMaskHideAnim() {
      this.maskAnim.opacity(0).step();
      this.setData({
        animMaskData: this.maskAnim.export(),
      });
    },
    createContentShowAnim() {
      const animation = dd.createAnimation({
        duration: 200,
        timingFunction: 'cubic-bezier(.55, 0, .55, .2)',
      });  
      this.contentAnim = animation;  
      animation.translateY(0).step();
      this.setData({
        animContentData: animation.export(),
      });
    },
    createContentHideAnim() {
      this.contentAnim.translateY('100%').step();
      this.setData({
        animContentData: this.contentAnim.export(),
      });
    },
    

});
