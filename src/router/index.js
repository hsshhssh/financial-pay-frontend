/* eslint-disable indent,linebreak-style */
import Vue from 'vue';
import Router from 'vue-router';

/* layout*/
import Layout from '../views/layout/Layout';

// dashboard
const dashboard = resolve => require(['../views/dashboard/index'], resolve);

/* error page*/
const Err404 = resolve => require(['../views/error/404'], resolve);
const Err401 = resolve => require(['../views/error/401'], resolve);

/* login*/
import Login from '../views/login/';
import authRedirect from '../views/login/authredirect';
import sendPWD from '../views/login/sendpwd';
import reset from '../views/login/reset';

/* Introduction*/
const Introduction = resolve => require(['../views/introduction/index'], resolve);

/* components*/
// const componentsIndex = resolve => require(['../views/components/index'], resolve);
// const Tinymce = resolve => require(['../views/components/tinymce'], resolve);
// const Markdown = resolve => require(['../views/components/markdown'], resolve);
// const JsonEditor = resolve => require(['../views/components/jsoneditor'], resolve);
// const DndList = resolve => require(['../views/components/dndlist'], resolve);
// const AvatarUpload = resolve => require(['../views/components/avatarUpload'], resolve);
// const Dropzone = resolve => require(['../views/components/dropzone'], resolve);
// const Sticky = resolve => require(['../views/components/sticky'], resolve);
// const SplitPane = resolve => require(['../views/components/splitpane'], resolve);
// const CountTo = resolve => require(['../views/components/countTo'], resolve);
// const Mixin = resolve => require(['../views/components/mixin'], resolve);


/* charts*/
// const chartIndex = resolve => require(['../views/charts/index'], resolve);
// const KeyboardChart = resolve => require(['../views/charts/keyboard'], resolve);
// const KeyboardChart2 = resolve => require(['../views/charts/keyboard2'], resolve);
// const LineMarker = resolve => require(['../views/charts/line'], resolve);
// const MixChart = resolve => require(['../views/charts/mixchart'], resolve);

/* error log*/
// const ErrorLog = resolve => require(['../views/errlog/index'], resolve);

/* excel*/
// const ExcelDownload = resolve => require(['../views/excel/index'], resolve);

/* theme*/
// const Theme = resolve => require(['../views/theme/index'], resolve);

/* example*/
// const DynamicTable = resolve => require(['../views/example/dynamictable'], resolve);
// const Table = resolve => require(['../views/example/table'], resolve);
// const DragTable = resolve => require(['../views/example/dragTable'], resolve);
// const InlineEditTable = resolve => require(['../views/example/inlineEditTable'], resolve);
// const Form1 = resolve => require(['../views/example/form1'], resolve);

/* permission */
// const Permission = resolve => require(['../views/permission/index'], resolve);


/* 支付平台 */
const PayOrder = resolve => require(['../views/financial/pay/order'], resolve);
const Settlement = resolve => require(['../views/financial/pay/settlement'], resolve);
const RealTimeData = resolve => require(['../views/financial/pay/realTimeData'], resolve);
const MonthSettlement = resolve => require(['../views/financial/pay/monthSettlement'], resolve);
const FailCallback = resolve => require(['../views/financial/pay/failCallback'], resolve);

/* 应用管理 */
const AppList = resolve => require(['../views/financial/app/list'], resolve);

/* 运营管理 */
const UserList = resolve => require(['../views/financial/operation/user'], resolve);


Vue.use(Router);

 /**
  * icon : the icon show in the sidebar
  * hidden : if hidden:true will not show in the sidebar
  * redirect : if redirect:noredirect will not redirct in the levelbar
  * noDropdown : if noDropdown:true will not has submenu
  * meta : { role: ['admin'] }  will control the page role
  */

export const constantRouterMap = [
    { path: '/login', component: Login, hidden: true },
    { path: '/authredirect', component: authRedirect, hidden: true },
    { path: '/sendpwd', component: sendPWD, hidden: true },
    { path: '/reset', component: reset, hidden: true },
    { path: '/404', component: Err404, hidden: true },
    { path: '/401', component: Err401, hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{ path: 'dashboard', component: dashboard }]
  },
  {
    path: '/introduction',
    component: Layout,
    redirect: '/introduction/index',
    icon: 'xinrenzhinan',
    noDropdown: true,
    children: [{ path: 'index', component: Introduction, name: '简述' }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export const asyncRouterMap = [
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/index',
  //   name: '权限测试',
  //   icon: 'quanxian',
  //   meta: { role: ['admin'] },
  //   noDropdown: true,
  //   children: [{ path: 'index', component: Permission, name: '权限测试页', meta: { role: ['admin'] } }]
  // },
  // {
  //   path: '/components',
  //   component: Layout,
  //   redirect: '/components/index',
  //   name: '组件',
  //   icon: 'zujian',
  //   meta: { role: ['admin'] },
  //   children: [
  //               { path: 'index', component: componentsIndex, name: '介绍 ' },
  //               { path: 'tinymce', component: Tinymce, name: '富文本编辑器' },
  //               { path: 'markdown', component: Markdown, name: 'Markdown' },
  //               { path: 'jsoneditor', component: JsonEditor, name: 'JSON编辑器' },
  //               { path: 'dndlist', component: DndList, name: '列表拖拽' },
  //               { path: 'splitpane', component: SplitPane, name: 'SplitPane' },
  //               { path: 'avatarupload', component: AvatarUpload, name: '头像上传' },
  //               { path: 'dropzone', component: Dropzone, name: 'Dropzone' },
  //               { path: 'sticky', component: Sticky, name: 'Sticky' },
  //               { path: 'countto', component: CountTo, name: 'CountTo' },
  //               { path: 'mixin', component: Mixin, name: '小组件' }
  //   ]
  // },
  // {
  //   path: '/charts',
  //   component: Layout,
  //   redirect: '/charts/index',
  //   name: '图表',
  //   icon: 'tubiaoleixingzhengchang',
  //   meta: { role: ['admin'] },
  //   children: [
  //               { path: 'index', component: chartIndex, name: '介绍' },
  //               { path: 'keyboard', component: KeyboardChart, name: '键盘图表' },
  //               { path: 'keyboard2', component: KeyboardChart2, name: '键盘图表2' },
  //               { path: 'line', component: LineMarker, name: '折线图' },
  //               { path: 'mixchart', component: MixChart, name: '混合图表' }
  //   ]
  // },
  {
    path: '/errorpage',
    component: Layout,
    redirect: 'noredirect',
    name: '错误页面',
    icon: '404',
    meta: { role: ['admin'] },
    children: [
                { path: '401', component: Err401, name: '401' },
                { path: '404', component: Err404, name: '404' }
    ]
  },
  // {
  //   path: '/errlog',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'errlog',
  //   icon: 'bug',
  //   meta: { role: ['admin'] },
  //   noDropdown: true,
  //   children: [{ path: 'log', component: ErrorLog, name: '错误日志' }]
  // },
  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'excel',
  //   icon: 'EXCEL',
  //   meta: { role: ['admin'] },
  //   noDropdown: true,
  //   children: [{ path: 'download', component: ExcelDownload, name: '导出excel' }]
  // },
  // {
  //   path: '/theme',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'theme',
  //   icon: 'theme',
  //   meta: { role: ['admin'] },
  //   noDropdown: true,
  //   children: [{ path: 'index', component: Theme, name: '换肤' }]
  // },
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: '综合实例',
  //   meta: { role: ['admin'] },
  //   icon: 'zonghe',
  //   children: [
  //               { path: 'dynamictable', component: DynamicTable, name: '动态table' },
  //               { path: 'dragtable', component: DragTable, name: '拖拽table' },
  //               { path: 'inline_edit_table', component: InlineEditTable, name: 'table内编辑' },
  //               { path: 'table', component: Table, name: '综合table' },
  //               { path: 'form1', component: Form1, name: '综合form1' }
  //   ]
  // },
  {
      path: '/financial/pay',
      component: Layout,
      redirect: 'noredirect',
      name: '支付平台',
      meta: { role: ['payUser', 'admin'] },
      icon: 'zonghe',
      children: [
                { path: 'order', component: PayOrder, name: '支付订单' },
                { path: 'settlement', component: Settlement, name: '结算记录' },
                { path: 'realTimeData', component: RealTimeData, name: '当日实时记录' },
                { path: 'monthSettlement', component: MonthSettlement, name: '每月结算记录' },
                { path: 'failCallback', component: FailCallback, name: '回调失败记录' }
      ]
  },
  {
      path: '/financial/app',
      component: Layout,
      redirect: 'noredirect',
      name: '应用管理',
      meta: { role: ['payUser', 'admin'] },
      icon: 'zujian',
      children: [
        { path: 'list', component: AppList, name: '应用列表' }
      ]
  },
    {
        path: '/financial/operation',
        component: Layout,
        redirect: 'noredirect',
        name: '运营管理',
        meta: { role: ['admin'] },
        icon: 'tubiaoleixingzhengchang',
        children: [
            { path: 'user', component: UserList, name: '用户' },
            { path: 'app', component: AppList, name: '应用' },
            { path: 'order', component: AppList, name: '订单管理' },
            { path: 'settlement', component: AppList, name: '结算管理' },
            { path: 'failCallback', component: AppList, name: '回调失败记录管理' },
            { path: 'payPlatform', component: AppList, name: '支付平台管理' },
            { path: 'role', component: AppList, name: '角色管理' }
        ]
    },
  { path: '*', redirect: '/404', hidden: true }
];
