<template>
  <div class="app-container calendar-list-container">

    <!-- 搜索区域 -->
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 250px;" class="filter-item" placeholder="新企航订单号" v-model="listQuery.search.orderNo_eq">
      </el-input>

      <el-input @keyup.enter.native="handleFilter" style="width: 250px;" class="filter-item" placeholder="商户订单号" v-model="listQuery.search.userOrderNo_eq">
      </el-input>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.search.userId_eq" placeholder="商户" v-if="isAdminRole">
        <el-option v-for="item in userIdOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.search.appId_eq" placeholder="应用">
        <el-option v-for="item in appIdOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

    </div>
    

    <div class="filter-container">
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
    </div>

    <!-- 列表 -->
    <el-table  :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="商户名称" width="250">
        <template scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="应用名称" width="100">
        <template scope="scope">
          <span>{{scope.row.appName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="新企航订单号" width="250">
        <template scope="scope">
          <span>{{scope.row.orderNo}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="商户订单号" width="250">
        <template scope="scope">
          <span>{{scope.row.userOrderNo}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单金额" width="100">
        <template scope="scope">
          <span>{{scope.row.moneyYuan}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="回调时间">
        <template scope="scope">
          <span>{{scope.row.lastCallTime | timeFilter('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="操作" width="100">
        <template scope="scope">
          <el-button v-if="scope.row.state==2" size="small" type="success" @click="handleModifyStatus(scope.row)">回调
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页信息 -->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
    import { fetchList, fetchPv } from 'api/article_table';
    import { parseTime, objectMerge } from 'utils';

    import {deleteEmptyProperty} from 'utils/filter'
    import { payCRFList, callback } from 'api/financial/pay_cfr'
    import { appListNoPage } from 'api/financial/pay_app'
    import { userListNoPage } from 'api/financial/user'
    import { getUidWithUndefined, isAdminRole } from 'src/utils/permission.js'

    import store from 'store';

    const payTypeOptions = [
      { key: 1, display_name: '微信wap支付' }
    ]

    const callbackStateOptions = [
      { key: 1, display_name: '成功' },
      { key: 2, display_name: '失败' }
    ]

    const timeTypeOptions = [
      { key: 'createTime', display_name: '创建时间' },
      { key: 'updateTime', display_name: '修改时间' },
      { key: 'callbackSuccessTime', display_name: '回调成功时间' },
      { key: 'callbackFailTime', display_name: '回调失败时间' },
    ]

    let appIdOptionsObj = {}

    const pickerOptions2 = {
          shortcuts: [{
            text: '最近一天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '最近三天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
        }

    export default {
      name: 'table_demo',
      data() {
        return {
          list: null,
          total: null,
          listLoading: true,
          isAdminRole: isAdminRole(),
          listQuery: {
            page: 1,
            limit: 10,
            timeType: undefined,
            search: {
              appId_eq: undefined,
              userId_eq: undefined,
              state_eq: 2
            }
          },
          temp: {
            id: undefined,
            importance: 0,
            remark: '',
            timestamp: 0,
            title: '',
            type: '',
            status: 'published'
          },
          importanceOptions: [1, 2, 3],
          payTypeOptions,
          callbackStateOptions,
          appIdOptions: [],
          userIdOptions: [],
          pickerOptions2,
          timeTypeOptions,
          listTimeRange: [],
          sortOptions: [{ label: '按ID升序列', key: '+id' }, { label: '按ID降序', key: '-id' }],
          statusOptions: ['published', 'draft', 'deleted'],
          dialogFormVisible: false,
          dialogStatus: '',
          textMap: {
            update: '编辑',
            create: '创建'
          },
          dialogPvVisible: false,
          pvData: [],
          showAuditor: false,
          tableKey: 0
        }
      },
      created() {
          this.getUserList();
          this.getAppList();
          this.getList();
      },
      filters: {
        statusFilter(status) {
          const statusMap = {
            published: 'success',
            draft: 'gray',
            deleted: 'danger'
          };
          return statusMap[status]
        },
        typeFilter(type) {
          return calendarTypeKeyValue[type]
        },
        timeFilter(time) {
          if(time == 0) {
            return 0
          }
          else {
            return parseTime(time, '{y}-{m}-{d} {h}:{i}')
          }
        }
      },
      methods: {
        getList() {
          this.listLoading = true;

          let page = this.listQuery.page;
          let size = this.listQuery.limit;
          let search = this.listQuery.search;

          // 处理商户
          if ( typeof(this.listQuery.search.userId_eq) === 'undefined' && this.listQuery.search.userId_eq !== 0) {
              this.listQuery.search.userId_eq = getUidWithUndefined()
          }

          delete search.createTime_lte, delete search.createTime_gte;
          delete search.updateTime_lte, delete search.updateTime_gte; 
          delete search.callbackSuccessTime_lte, delete search.callbackSuccessTime_gte; 
          delete search.callbackFailTime_lte, delete search.callbackFailTime_gte;
          if(typeof(this.listQuery.timeType) != 'undefined' && this.listQuery.timeType != '') {
            search[this.listQuery.timeType + '_gte'] = Date.parse(this.listTimeRange[0])/1000;
            search[this.listQuery.timeType + '_lte'] = Date.parse(this.listTimeRange[1])/1000;
          } 

          payCRFList(search, page, size).then(response => {
            this.list = response.data.list;
            this.total = response.data.total;
            this.listLoading = false;
            console.log(response)
          })
        },
        getAppList() {
          appListNoPage(getUidWithUndefined()).then(response => {
            let data = response.data;
              this.appIdOptions.push({ key: null, display_name: '全部' })
            for(let i=0; i<data.length; i++) {
              this.appIdOptions.push({key: data[i].id, display_name: data[i].appName});
            }
            appIdOptionsObj = this.appIdOptions.reduce((acc, cur) => {
              acc[cur.key] = cur.display_name;
              return acc
            }, {});
          })
        },
        getUserList() {
            userListNoPage().then(response => {
                if (response.status === 200) {
                    this.userIdOptions.push({ key: null, display_name: '全部' })
                    response.data.list.forEach(u => {
                        this.userIdOptions.push({ key: u.id, display_name: u.name })
                    })
                }
            })
        },
        handleFilter() {
          this.getList();
        },
        handleSizeChange(val) {
          this.listQuery.limit = val;
          this.getList();
        },
        handleCurrentChange(val) {
          this.listQuery.page = val;
          this.getList();
        },
        timeFilter(time) {
          if (!time[0]) {
            this.listQuery.start = undefined;
            this.listQuery.end = undefined;
            return;
          }
          this.listQuery.start = parseInt(+time[0] / 1000);
          this.listQuery.end = parseInt((+time[1] + 3600 * 1000 * 24) / 1000);
        },
        handleModifyStatus(row) {
          // console.log(row)
          this.listLoading = true
          callback(row.id).then(response => {
            this.getList();
          })
          
        },
        handleCreate() {
          this.resetTemp();
          this.dialogStatus = 'create';
          this.dialogFormVisible = true;
        },
        handleUpdate(row) {
          objectMerge(this.temp, row)
          this.dialogStatus = 'update';
          this.dialogFormVisible = true;
        },
        handleDelete(row) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        },
        create() {
          this.temp.id = parseInt(Math.random() * 100) + 1024;
          this.temp.timestamp = +new Date();
          this.temp.author = '原创作者';
          this.list.unshift(this.temp);
          this.dialogFormVisible = false;
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          });
        },
        update() {
          this.temp.timestamp = +this.temp.timestamp;
          for (const v of this.list) {
            if (v.id === this.temp.id) {
              objectMerge(v, this.temp);
              break;
            }
          }
          this.dialogFormVisible = false;
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          });
        },
        resetTemp() {
          this.temp = {
            id: undefined,
            importance: 0,
            remark: '',
            timestamp: 0,
            title: '',
            status: 'published',
            type: ''
          };
        },
        handleFetchPv(pv) {
          fetchPv(pv).then(response => {
            this.pvData = response.pvData
            this.dialogPvVisible = true
          })
        },
        handleDownload() {
          require.ensure([], () => {
            const { export_json_to_excel } = require('vendor/Export2Excel');
            const tHeader = ['序号', '商户名称', '应用名称', '新企航订单号', '商户订单号', '订单金额', '回调时间'];
            const filterVal = [
              { name: 'id' },
              { name: 'userName' },
              { name: 'appName' },
              { name: 'orderNo' },
              { name: 'userOrderNo' },
              { name: 'moneyYuan' },
              { name: 'lastCallTime', filterFunction: parseTime }
            ];
            const data = this.formatJson(filterVal, this.list);
            export_json_to_excel(tHeader, data, '回调失败记录');      
          })
        },
        formatJson(filterVal, jsonData) {
          let data = jsonData.map(v => filterVal.map(j => {
            if (j['filterOptionsObj'] !== undefined) {
              return j['filterOptionsObj'][v[j['name']]]
            } else if (j['filterFunction'] !== undefined) {
              let func = eval(j['filterFunction'])
              return func(v[j['name']])
            } else {
              return v[j['name']]
            }
          }));
          return data;
        }
      }
    }
</script>
