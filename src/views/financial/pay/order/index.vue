<template>
  <div class="app-container calendar-list-container">

    <!-- 搜索区域 -->
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 100px;" class="filter-item" placeholder="订单id" v-model="listQuery.search.id_eq">
      </el-input>

      <el-input @keyup.enter.native="handleFilter" style="width: 100px;" class="filter-item" placeholder="订单流水号" v-model="listQuery.search.orderSerial_eq">
      </el-input>

      <el-input @keyup.enter.native="handleFilter" style="width: 100px;" class="filter-item" placeholder="用户Id" v-model="listQuery.search.userId_eq">
      </el-input>

      <el-input @keyup.enter.native="handleFilter" style="width: 100px;" class="filter-item" placeholder="appId" v-model="listQuery.search.appId_eq">
      </el-input>

      <el-input @keyup.enter.native="handleFilter" style="width: 100px;" class="filter-item" placeholder="支付平台Id" v-model="listQuery.search.platformId_eq">
      </el-input>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.search.payType_eq" placeholder="支付方式">
        <el-option v-for="item in payTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.search.callbackState_eq" placeholder="回调商户状态">
        <el-option v-for="item in callbackStateOptions" :key="item.key" :label="item.display_name" :value="item.key">
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

      <el-table-column align="center" label="序号" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单号" width="100">
        <template scope="scope">
          <span>{{scope.row.orderNo}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单流水号" width="65">
        <template scope="scope">
          <span>{{scope.row.orderSerial}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户Id" width="65">
        <template scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="appId" width="65">
        <template scope="scope">
          <span>{{scope.row.appId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单金额" width="65">
        <template scope="scope">
          <span>{{scope.row.money}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="支付平台Id" width="65">
        <template scope="scope">
          <span>{{scope.row.platformId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="支付方式" width="65">
        <template scope="scope">
          <span>{{scope.row.payTypeStr}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="回调商户状态" width="65">
        <template scope="scope">
          <span>{{scope.row.callbackStateStr}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="支付平台订单号" width="150">
        <template scope="scope">
          <span>{{scope.row.platformOrderNo}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手续费比例" width="65">
        <template scope="scope">
          <span>{{scope.row.interestRate}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="回调成功时间">
        <template scope="scope">
          <span>{{scope.row.callbackSuccessTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="回调失败时间">
        <template scope="scope">
          <span>{{scope.row.callFailTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="修改时间">
        <template scope="scope">
          <span>{{scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
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
    import { orderList } from 'api/financial/pay_order'

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
          listQuery: {
            page: 1,
            limit: 10,
            timeType: undefined,
            search: {
              payType_eq: undefined,
              callbackState_eq: undefined
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
        }
      },
      methods: {
        getList() {
          this.listLoading = true;

          let page = this.listQuery.page;
          let size = this.listQuery.limit;
          let search = this.listQuery.search;

          delete search.createTime_lte, delete search.createTime_gte; 
          delete search.updateTime_lte, delete search.updateTime_gte; 
          delete search.callbackSuccessTime_lte, delete search.callbackSuccessTime_gte; 
          delete search.callbackFailTime_lte, delete search.callbackFailTime_gte;
          if(typeof(this.listQuery.timeType) != 'undefined' && this.listQuery.timeType != '') {
            search[this.listQuery.timeType + '_gte'] = Date.parse(this.listTimeRange[0])/1000;
            search[this.listQuery.timeType + '_lte'] = Date.parse(this.listTimeRange[1])/1000;
          } 

          orderList(search, page, size).then(response => {
            this.list = response.list;
            this.total = response.total;
            this.listLoading = false;
            console.log(response)
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
            const { export_json_to_excel } = require('vendor/Export2Excel');
            const tHeader = ['序号', '订单号', '订单流水号', '用户Id', 'appId', '订单金额', '支付平台Id', '支付方式', '回调商户状态', '支付平台订单号', '手续费比例', '回调成功时间', '回调商户状态', '创建时间', '修改时间'];
            const filterVal = ['id', 'orderNo', 'orderSerial', 'userId', 'appId', 'money', 'platformId', 'payTypeStr', 'callbackStateStr', 'platformOrderNo', 'interestRate', 'callbackSuccessTime', 'callbackFailTime', 'createTime', 'updateTime'];
            const data = this.formatJson(filterVal, this.list);
            export_json_to_excel(tHeader, data, '订单数据');   
          })
        },
        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => {
            if (j === 'timestamp') {
              return parseTime(v[j])
            } else {
              return v[j]
            }
          }))
        }
      }
    }
</script>
