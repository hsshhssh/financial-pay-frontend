<template>
  <div class="app-container calendar-list-container">

    <!-- 搜索区域 -->
    <div class="filter-container">
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.search.userId_eq" placeholder="商户" v-if="isAdminRole">
        <el-option v-for="item in userIdOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.search.appId_eq" placeholder="应用">
        <el-option v-for="item in appIdOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

        <el-select clearable @change='handleFilter' style="width: 150px" class="filter-item" v-model="listQuery.sort" placeholder="排序">
            <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
            </el-option>
        </el-select>

      <br/>
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.timeType" placeholder="时间类型">
        <el-option v-for="item in timeTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <el-date-picker clearable class="filter-item" v-model="listTimeRange" type="datetimerange" :picker-options="pickerOptions2" placeholder="时间段" align="right">
      </el-date-picker>
    </div>
    

    <div class="filter-container">
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
    </div>

    <!-- 列表 -->
    <el-table  :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
    
      <el-table-column width="180px" align="center" label="订单时间">
        <template scope="scope">
          <span>{{scope.row.orderTime | timeFilter('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="商户名称" width="250">
        <template scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="应用名称" width="100">
        <template scope="scope">
          <span>{{scope.row.appId | appFilter}}</span>
        </template>
      </el-table-column>

      
      <el-table-column align="center" label="订单总金额" width="120">
        <template scope="scope">
          <span>{{scope.row.totalMoneyYuan}}</span>
        </template>
      </el-table-column>

      <!--<el-table-column align="center" label="手续费总金额" width="140">-->
        <!--<template scope="scope">-->
          <!--<span>{{scope.row.totalHandlingChargeYuan}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->


      <el-table-column align="center" label="应结总金额" width="140">
        <template scope="scope">
          <span>{{scope.row.settlementMoneyYuan}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.createTime | timeFilter('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <!--<el-table-column width="180px" align="center" label="修改时间">-->
        <!--<template scope="scope">-->
          <!--<span>{{scope.row.updateTime | timeFilter('{y}-{m}-{d} {h}:{i}')}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
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
    import { settlementList } from 'api/financial/pay_settlement'
    import { appListNoPage } from 'api/financial/pay_app'
    import { userListNoPage } from 'api/financial/user'
    import { getUidWithUndefined, isAdminRole } from 'src/utils/permission.js'
    import { getZeroTime } from 'src/utils/utils.js'

    import store from 'store';

    const timeTypeOptions = [
      { key: 'orderTime', display_name: '订单时间' },
      { key: 'createTime', display_name: '创建时间' },
      { key: 'updateTime', display_name: '修改时间' }
    ]

    let appIdOptionsObj = {}

    const sortOptions = [
        { label: '创建时间降序', key: 'id_desc' },
        { label: '创建时间升序', key: 'id_asc' }
    ]

    const pickerOptions2 = {
        shortcuts: [{
            text: '最近一天',
            onClick(picker) {
                const end = getZeroTime();
                const start = getZeroTime();
                start.setTime(getZeroTime() - 3600 * 1000 * 24 * 1);
                picker.$emit('pick', [start, end]);
            }
        },{
            text: '最近三天',
            onClick(picker) {
                const end = new getZeroTime();
                const start = getZeroTime();
                start.setTime(getZeroTime() - 3600 * 1000 * 24 * 3);
                picker.$emit('pick', [start, end]);
            }
        },{
            text: '最近7天',
            onClick(picker) {
                const end = getZeroTime();
                const start = getZeroTime();
                start.setTime(getZeroTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
            }
        },{
            text: '最近一个月',
            onClick(picker) {
                const end = getZeroTime();
                const start = getZeroTime();
                start.setDate(1)
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
            timeType: 'createTime',
            search: {
              userId_eq: undefined,
              appId_eq: undefined
            },
            sort: undefined
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
          pickerOptions2,
          timeTypeOptions,
          appIdOptions: [],
          userIdOptions: [],
          listTimeRange: [],
          sortOptions,
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
          this.getAppList();
          this.getUserList();
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
        appFilter(type) {
          return appIdOptionsObj[type]
        },
        timeFilter(time, format) {
          if(time == 0) {
            return 0
          }
          else {
            return parseTime(time, format)
          }
        }
      },
      methods: {
        getList() {
          this.listLoading = true;

          let page = this.listQuery.page;
          let size = this.listQuery.limit;
          let search = this.listQuery.search;

          // 处理用户
          if ( typeof(this.listQuery.search.userId_eq) === 'undefined' && this.listQuery.search.userId_eq !== 0) {
              this.listQuery.search.userId_eq = getUidWithUndefined()
          }

          // 处理时间
          delete search.createTime_lte, delete search.createTime_gte; 
          delete search.updateTime_lte, delete search.updateTime_gte; 
          if(typeof(this.listQuery.timeType) != 'undefined' && this.listQuery.timeType != '') {
            search[this.listQuery.timeType + '_gte'] = Date.parse(this.listTimeRange[0])/1000;
            search[this.listQuery.timeType + '_lte'] = Date.parse(this.listTimeRange[1])/1000;
          } 

          // 处理排序
          let sort = []
          sort.push(this.listQuery.sort)
          settlementList(search, page, size, sort).then(response => {
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
        handleModifyStatus(row, status) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          row.status = status;
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

              settlementList({}, 1, 1000, null).then(response => {
                  let list = response.data.list;
                  const { export_json_to_excel } = require('vendor/Export2Excel');
                  const tHeader = ['序号', '商户名称', '应用名称', '订单总金额', '应结总金额', '订单时间','创建时间'];
                  const filterVal = [
                      { name: 'id' },
                      { name: 'userName' },
                      { name: 'appId', filterOptionsObj: appIdOptionsObj },
                      { name: 'totalMoneyYuan' },
                      { name: 'settlementMoneyYuan' },
                      { name: 'orderTime', filterFunction: parseTime },
                      { name: 'createTime', filterFunction: parseTime }

                  ];
                  const data = this.formatJson(filterVal, list);
                  export_json_to_excel(tHeader, data, '结算数据');
              })
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
