<template>
    <div class="app-container calendar-list-container">

        <!-- 搜索区域 -->
        <div class="filter-container">

        </div>

        <!--按钮区域-->
        <div class="filter-container">
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">刷新</el-button>
        </div>

        <!-- 列表 -->
        <el-table  :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column width="180px" align="center" label="订单时间">
                <template scope="scope">
                    <span>{{scope.row.createTime | timeFilter('{y}-{m}-{d}')}}</span>
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

        </div>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
                <el-button v-else type="primary" @click="update">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    /* eslint-disable no-unused-vars,indent,linebreak-style,prefer-const,padded-blocks,no-empty-function,linebreak-style,brace-style,no-trailing-spaces,dot-notation,no-extra-parens */

    import { parseTime, objectMerge } from 'utils';
    import store from 'store';

    import { Message } from 'element-ui';
    import { appSettlementList } from 'api/financial/pay_settlement'
    import { appListNoPage } from 'api/financial/pay_app'
    import { getUidWithUndefined, isAdminRole } from 'src/utils/permission.js'

    let appIdOptionsObj = {}

    export default {
        name: 'table_demo',
        data() {
            return {
                userName: store.getters.name,
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 10,
                    search: {
                        userId_eq: store.getters.uid
                    }
                },
                tableKey: 0,
                dialogStatus: '',
                dialogFormVisible: false,
                textMap: {
                    update: '编辑',
                    create: '添加'
                },
                temp: {

                },
                appIdOptions: []
            }
        },
        created() {
            this.getAppList()
            this.getList()
        },
        filters: {
            timeFilter(time, format) {
                if (time === 0) {
                    return 0
                }
                else {
                    return parseTime(time, format)
                }
            },
            appFilter(type) {
                return appIdOptionsObj[type]
            }

        },
        methods: {
            // 查询列表信息
            getList() {
                this.listLoading = true;

                appSettlementList(0).then(response => {

                    if (response.status === 200) {
                        let userId = store.getters.uid
                        let list = []
                        let data = response.data
                        for (let key in data) {
                            if (data[key].userId === userId || isAdminRole()) {
                                data[key].totalMoneyYuan = (data[key].totalMoney) / 100
                                data[key].totalHandlingChargeYuan = (data[key].totalHandlingCharge) / 100
                                data[key].settlementMoneyYuan = (data[key].settlementMoney) / 100
                                list.push(data[key])
                            }
                        }
                        this.list = list
                        this.total = list.length

                        this.listLoading = false;
                    }


                })

            },

            // 点击搜索按钮事件
            handleFilter() {
                this.getList();
            },

            // 分页处理
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },

            // 编辑
            handleUpdate(row) {
                this.temp = Object.assign({}, row);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            update() {
                console.log(this.temp);
                appUpdate(this.temp).then(response => {
                    if (response.data === 1) {
                        Message({
                            message: '修该成功',
                            type: 'success',
                            duration: 2000
                        });
                        this.dialogFormVisible = false;
                        this.getList()
                    } else {
                        Message({
                            message: '修改失败',
                            type: 'warning',
                            duration: 2000
                        });
                    }
                })

                this.dialogFormVisible = false;
            },

            // 添加
            handleCreate() {
                this.temp = {}
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            create() {
                this.temp['userId'] = store.getters.uid
                appCreate(this.temp).then(response => {
                    if (response.data === 1) {
                        Message({
                            message: '创建成功',
                            type: 'success',
                            duration: 2000
                        });
                        this.dialogFormVisible = false;
                        this.getList()
                    } else {
                        Message({
                            message: '创建失败',
                            type: 'warning',
                            duration: 2000
                        });
                    }
                })
            },

            // 导出excel
            handleDownload() {
                require.ensure([], () => {
                    const { export_json_to_excel } = require('vendor/Export2Excel');
                    const tHeader = ['应用ID', '商户名称', '应用名称', '回调地址', '返回地址', '秘钥', '创建时间'];
                    const filterVal = [
                        { name: 'id' },
                        { name: 'userName' },
                        { name: 'appName' },
                        { name: 'callbackUrl' },
                        { name: 'nodifyUrl' },
                        { name: 'secretkey' },
                        { name: 'createTime', filterFunction: parseTime }
                    ];
                    const data = this.formatJson(filterVal, this.list);
                    export_json_to_excel(tHeader, data, '应用数据');
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
            },

            getAppList() {
                appListNoPage(getUidWithUndefined()).then(response => {
                    let data = response.data;
                    for (let i = 0; i < data.length; i++) {
                        this.appIdOptions.push({ key: data[i].id, display_name: data[i].appName });
                    }
                    appIdOptionsObj = this.appIdOptions.reduce((acc, cur) => {
                        acc[cur.key] = cur.display_name;
                        return acc
                    }, {});
                })
            }
        }
    }
</script>
