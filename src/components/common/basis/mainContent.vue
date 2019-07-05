<template>
  <div class="mainClass">
    <el-scrollbar style="height:100%;">
      <!-- 菜单需要的组件 include缓存页面 exclude不缓存 targetName页面key-->
      <keep-alive exclude="home" v-if="url=='' || url==undefined">
        <component :is="currentTab" :editId="Id" :event="createTab" :targetName="currentTab"></component>
      </keep-alive>
      <div v-else style="height:100%">
       <component :is="currentTab" :editId="Id" :event="createTab" :targetName="currentTab"></component>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
import bus from "../../../assets/public/js/eventBus";
import home from "../../home/home";
import CstUserList from "../../user/list";
import CstUserEdit from "../../user/edit";
import CstCooperativepartnerList from "../../partner/list";
import PartnerEdit from "../../partner/edit";
import CstCooperativeApprovalPending from "../../partner/approvalPending";
import CstInformationList from "../../customer/list";
import CstInformationApprovalPending from "../../customer/approvalPending";
import CstInformationAdvanced from "../../customer/advanced";
import CustomerEdit from "../../customer/edit";
import CstRoleList from "../../role/list";
import CstRoleEdit from "../../role/edit";
import CstDepartmentList from "../../department/list";
import CstDepartmentEdit from "../../department/edit";
import EmailSettingList from "../../setting/emailSetting/list";
import ReceiveManage from "../../setting/receiveManage";
import EmailSettingEdit from "../../setting/emailSetting/edit";
import SmsSettingList from "../../setting/smsSetting/list";
import SmsSettingEdit from "../../setting/smsSetting/edit";
import CustomMenu from "../../setting/customMenu";
import Permission from "../../setting/permission";
import EmailTemplateList from "../../sysManage/emailTemplate/list";
import EmailTemplateEdit from "../../sysManage/emailTemplate/edit";
import EventFilterList from "../../sysManage/eventFilter/list";
import EventFilterEdit from "../../sysManage/eventFilter/edit";
import OnlineManageList from "../../sysManage/onlineManage/list";
import MessageList from "../../sysManage/message/list";
import BusinessFlowList from "../../sysManage/workFlow/list";
import BusinessFlowEdit from "../../sysManage/workFlow/edit";
import BusinessFlowProcess from "../../sysManage/workFlow/process";
import BusinessFlowMessageSet from "../../sysManage/workFlow/messageSet";
import ApprovalFlow  from "../../sysManage/Approval/list";
import ApprovalFlowProcess  from "../../sysManage/Approval/process";
import EventMessageList from "../../sysManage/eventMessage/list";
import EventMessageEdit from "../../sysManage/eventMessage/edit";
import SmsTemplateList from "../../sysManage/smsTemplate/list";
import SmsTemplateEdit from "../../sysManage/smsTemplate/edit";
import ModifyPassword from "../../sysManage/modifyPassword/list";
import BasicInfo from "../../sysManage/basicInfo";
import CompanyData from "../../chart/companyData";
import Govreatiuon from "../../chart/govreatiuon";
import IndustryData from "../../chart/industryData";
import RegionalSearch from "../../chart/regionalSearch";
import MenuList from "../../site/menuList";
import MenuEdit from "../../site/edit";
import ModularManageList from "../../site/modularManage/list";
import ModularManageEdit from "../../site/modularManage/edit";
import ModularPermission from "../../site/modularPermission";
import ScheduleRulePermission from "../../site/scheduleRulePermission";
import FieldPermission from "../../site/fieldPermission";
import OperationRecordList from "../../DataAnalysis/OperationRecord/list";
import OnlineTimeList from "../../DataAnalysis/OnlineTime/list";
import ExceptionRequestList from "../../DataAnalysis/ExceptionRequest/list";
import BehaviorAnalysis from "../../DataAnalysis/behaviorAnalysis/list";
import CstJobList from "../../job/list";
import CstJobEdit from "../../job/edit";
import CstPreparationList from "../../cstPreparation/list";
import CstPreparationEdit from "../../cstPreparation/edit";
import Industry from "../../sysManage/basicInfo/industry/list";
import IndustryEdit from "../../sysManage/basicInfo/industry/edit";
import MesSupplier from "../../sysManage/basicInfo/mesSupplier/list";
import MesSupplierEdit from "../../sysManage/basicInfo/mesSupplier/edit";
import ErpSupplier from "../../sysManage/basicInfo/erpSupplier/list";
import ErpSupplierEdit from "../../sysManage/basicInfo/erpSupplier/edit";
import Province from "../../sysManage/basicInfo/province/list";
import ProvinceEdit from "../../sysManage/basicInfo/province/edit";
import City from "../../sysManage/basicInfo/city/list";
import CityEdit from "../../sysManage/basicInfo/city/edit";
import SiteInformation from "../../sysManage/basicInfo/siteInformation/list";
import SysBasicSiteEdit from "../../sysManage/basicInfo/siteInformation/edit";
export default {
  components: {
    home,
    CstDepartmentList, // 客户列表
    CstUserList,
    CstUserEdit, // 用户
    CstCooperativepartnerList,
    PartnerEdit, // 合作伙伴
    CstCooperativeApprovalPending,
    CstInformationList,
    CustomerEdit,
    CstInformationApprovalPending, // 客户
    CstInformationAdvanced,
    CstRoleList,
    CstRoleEdit, // 角色
    EmailTemplateList,
    EmailTemplateEdit, // 邮件模板
    MenuList,
    MenuEdit, // 栏目菜单
    EventFilterList,
    EventFilterEdit, // 事件设置
    OnlineManageList, // 在线管理
    MessageList, // 消息
    EventMessageList,
    EventMessageEdit, // 事件消息
    SmsTemplateList,
    SmsTemplateEdit, // 短信模板
    EmailSettingList,
    EmailSettingEdit, // 邮箱
    ReceiveManage,
    SmsSettingList,
    SmsSettingEdit, // 短信
    ModifyPassword, // 修改密码
    BasicInfo, // 基本资料
    CustomMenu, // 自定义菜单
    Permission,
    FieldPermission, // 设置——权限、字段权限
    CompanyData,
    Govreatiuon,
    IndustryData,
    RegionalSearch, // 图表
    ModularManageList,
    ModularManageEdit, // 站点管理——模块管理
    ModularPermission, // 站点管理——模块权限
    ScheduleRulePermission, // 站点管理——排程规则
    OperationRecordList, // 数据分析——操作记录
    OnlineTimeList, // 数据分析——在线时段
    ExceptionRequestList, // 数据分析——异常请求
    BusinessFlowList,
    BusinessFlowEdit,
    BusinessFlowProcess,
    BusinessFlowMessageSet, // 工作流设置
    ApprovalFlow, // 审批流
    ApprovalFlowProcess, // 审批流流程设计
    CstPreparationList,
    CstPreparationEdit, //报备管理
    BehaviorAnalysis, //行为分析
    CstJobList,
    CstJobEdit, //职位
    SiteInformation,
    SysBasicSiteEdit, //站点信息
    Industry,
    IndustryEdit, //行业
    MesSupplier,
    MesSupplierEdit, //MES供应商
    ErpSupplier,
    ErpSupplierEdit, //ERP供应商
    Province,
    ProvinceEdit, //省
    City,
    CityEdit, //市
    CstDepartmentEdit //部门编辑
  },
  data() {
    return {
      menuFirst: {},
      currentTab: "",
      Id: "",
      url: ""
    };
  },
  mounted() {
    this.receviesMenuData();
    this.reciveCurrentTab();
  },
  methods: {
    //接收菜单数据
    receviesMenuData() {
      bus.$on("menuData", data => {
        if (data != null && data.A != null) {
          var page = data.A;
          if (page.hasChild) {
            if (page.child != null && page.child.length > 0) {
              this.menuFirst = page.child[0];
              this.getHomePage();
            }
          }
        }
      });
    },
    //接收要操作的组件
    reciveCurrentTab() {
      bus.$on("currentTab", (currentTab, id, url) => {
        this.currentTab = currentTab;
        this.Id = id;
        this.url = url;
      });
    },
    //发送首页渲染
    getHomePage() {
      bus.$emit("homePage", "home", "首页");
      bus.$emit("homePage", this.menuFirst.key, this.menuFirst.label);

    },
    //创建新的Tabs
    createTab(key, label, hasChild, url, Id) {
      if (key == "BusinessFlowProcess") {
        url = "/index";
      }
      bus.$emit("receivesCreateTabValue", key, label, hasChild, url, Id);
    },
    //关闭页面
    closeTab(targetName) {
      bus.$emit("colseTabs", targetName);
    }
  }
};
</script>