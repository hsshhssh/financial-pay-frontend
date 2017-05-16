<template>
  <div class="app-container calendar-list-container">

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

      <el-table-column align="center" label="用户id" width="65">
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

      <el-table-column align="center" label="支付平台id" width="65">
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

      <el-table-column align="center" label="商户订单号" width="150">
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

    import { orderList } from 'api/financial/pay_order'

    const calendarTypeOptions = [
      { key: 'FD', display_name: '经济数据' },
      { key: 'FE', display_name: '财经大事' },
      { key: 'BI', display_name: '国债发行' },
      { key: 'VN', display_name: '假期报告' }
    ];

    // arr to obj
    const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
      acc[cur.key] = cur.display_name;
      return acc
    }, {});

    export default {
      name: 'table_demo',
      data() {
        return {
          list: null,
          total: null,
          listLoading: true,
          listQuery: {
            page: 1,
            limit: 20,
            importance: undefined,
            title: undefined,
            type: undefined,
            sort: '+id'
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
          calendarTypeOptions,
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
          // fetchList(this.listQuery).then(response => {
          //   this.list = response.items;
          //   this.total = response.total;
          //   this.listLoading = false;

          //   console.log(response);
          // })
          orderList().then(response => {
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
            const tHeader = ['时间', '地区', '类型', '标题', '重要性'];
            const filterVal = ['timestamp', 'province', 'type', 'title', 'importance'];
            const data = this.formatJson(filterVal, this.list);
            export_json_to_excel(tHeader, data, 'table数据');
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
