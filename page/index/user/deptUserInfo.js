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
    userId:'',
    userName:'',
    animMaskData: [],
    animContentData: [],
    hidden: true,
    list: [
      {
        title: '教育经历信息',
        entitle: 'Education',
      },
      {
        title: '职业资格信息',
        entitle: 'ProQualification',
      },
      {
        title: '专业技术职务信息',
        entitle: 'ProSkillPosition',
      },
      {
        title: '工作经历信息',
        entitle: 'Job',
      },
      {
        title: '合同信息',
        entitle: 'Contract',
      },
    ],
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

    ForMoreInformation(e) {
      var userId = e.currentTarget.dataset.value;
      var userName = e.currentTarget.dataset.name;
      this.setData({
        hidden: !this.data.hidden,
        userId:userId,
        userName:userName,
      });
      this.createMaskShowAnim();
      this.createContentShowAnim();
    
    },
    onChildItemTap(e) {
      const { page } = e.currentTarget.dataset;
      dd.navigateTo({
        url: "userinfo_"+`${page}`+'?userId='+this.data.userId+'&name='+this.data.userName,
      });
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
    
 
})
