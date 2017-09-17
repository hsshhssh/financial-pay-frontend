<template>
    <div class="app-container calendar-list-container">

        <!-- 搜索区域 -->
        <div class="filter-container">
            <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.search.userId_eq" placeholder="商户">
                <el-option v-for="item in userIdOptions" :key="item.key" :label="item.display_name" :value="item.key">
                </el-option>
            </el-select>

            <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.search.playformCode_eq" placeholder="支付行">
                <el-option v-for="item in platformCodeOptions" :key="item.key" :label="item.display_name" :value="item.key">
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
            <!--<el-button class="filter-item" type="primary" icon="plus" @click="handleCreate">添加</el-button>-->
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

            <el-table-column align="center" label="支付行" width="100">
                <template scope="scope">
                    <span>{{scope.row.platformName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="订单总金额" width="120">
                <template scope="scope">
                    <span>{{scope.row.totalMoneyYuan}}</span>
                </template>
            </el-table-column>

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


        </el-table>

        <!-- 分页信息 -->
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form class="small-space" :model="temp" :rules="tempRules" ref="tempForm" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
                <el-form-item label="登录名" prop="username">
                    <el-input v-model="temp.username" :disabled="dialogStatus == 'update'"></el-input>
                </el-form-item>

                <el-form-item label="用户名" prop="name">
                    <el-input v-model="temp.name" :disabled="false"></el-input>
                </el-form-item>

                <el-form-item label="电话" prop="phone">
                    <el-input v-model="temp.phone" :disabled="false"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password" v-if="dialogStatus=='create'">
                    <el-input name="password" type="password" v-model="temp.password" autoComplete="on" ></el-input>
                </el-form-item>


                <el-form-item label="确认密码" prop="passwordConfirm" v-if="dialogStatus=='create'">
                    <el-input name="passwordConfirm" type="password" v-model="temp.passwordConfirm" autoComplete="on"></el-input>
                </el-form-item>


                <el-form-item label="用户类型" prop="role">
                    <el-select clearable class="filter-item" style="width: 130px" v-model="temp.role" placeholder="用户类型" :disabled="dialogStatus == 'update'">
                        <el-option v-for="item in roleOptions" :key="item.key" :label="item.display_name" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>

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
    /* eslint-disable no-unused-vars,indent,linebreak-style,prefer-const,padded-blocks,no-empty-function,linebreak-style,brace-style,no-trailing-spaces,dot-notation */

    import { parseTime, objectMerge } from 'utils';
    import store from 'store';

    import { Message } from 'element-ui';
    import { userList, userCreate, userUpdate, userListNoPage } from 'api/financial/user';

    import { platformSettlementList, simplePlatformList } from 'api/financial/pay_platform_settlement';
    import { getZeroTime } from 'src/utils/utils.js'

    // 用户类型
    const roleOptions = [
        { key: 1, display_name: '商户' }
    ]

    const timeTypeOptions = [
        { key: 'orderTime', display_name: '订单时间' },
        { key: 'createTime', display_name: '创建时间' },
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
            const validatePasswordConfirm = (rule, value, callback) => {
                if (this.temp.password !== value) {
                    callback(new Error('密码不一致'));
                } else {
                    callback();
                }
            };
            return {
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    timeType: 'createTime',
                    page: 1,
                    limit: 10,
                    search: {
                        userId_eq: undefined,
                        playformCode_eq: undefined,
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
                    role: undefined
                },
                tempRules: {
                    username: [
                        { required: true, trigger: 'blur', message: '登录名必填' },
                        { max: 50, trigger: 'blur', message: '登录名最长50个字符' }
                    ],
                    name: [
                        { required: true, trigger: 'blur', message: '用户名必填' },
                        { max: 50, trigger: 'blur', message: '用户名最长50个字符' }
                    ],
                    phone: [
                        { required: true, trigger: 'blur', message: '电话必填' },
                        { max: 11, trigger: 'blur', message: '电话最最长11个字符' }
                    ],
                    password: [
                        { required: true, trigger: 'blur', message: '密码必填' },
                        { min: 6, max: 50, trigger: 'blur', message: '密码最少6个字符最少6个字符' }
                    ],
                    passwordConfirm: [
                        { required: true, trigger: 'blur', validator: validatePasswordConfirm }
                    ],
                    role: [
                        { required: true, trigger: 'blur', message: '用户类型必填', type: 'number' }
                    ]
                },
                roleOptions,
                userIdOptions: [],
                timeTypeOptions,
                platformCodeOptions: [],
                pickerOptions2,
                listTimeRange: []
            }
        },
        created() {
            this.getList();
            this.getUserList();
            this.getPlatformList();
        },
        filters: {
            timeFilter(time) {
                if (time === 0) {
                    return 0
                }
                else {
                    return parseTime(time, '{y}-{m}-{d} {h}:{i}')
                }
            }

        },
        methods: {
            // 查询列表信息
            getList() {
                this.listLoading = true;

                let page = this.listQuery.page;
                let size = this.listQuery.limit;
                let search = this.listQuery.search;

                // 处理时间
                delete search.createTime_lte, delete search.createTime_gte;
                delete search.updateTime_lte, delete search.updateTime_gte;
                if(typeof(this.listQuery.timeType) != 'undefined' && this.listQuery.timeType != '') {
                    search[this.listQuery.timeType + '_gte'] = Date.parse(this.listTimeRange[0])/1000;
                    search[this.listQuery.timeType + '_lte'] = Date.parse(this.listTimeRange[1])/1000;
                }


                platformSettlementList(search, page, size).then(response => {
                    this.list = response.data.list
                    this.total = response.data.total
                    this.listLoading = false;
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

            getPlatformList() {
                simplePlatformList().then(response => {
                    if (response.status === 200) {
                        this.platformCodeOptions.push({ key: null, display_name: '全部' })
                        response.data.forEach(u => {
                            this.platformCodeOptions.push({ key: u.code, display_name: u.name })
                        })
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
                console.log(this.temp)
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            update() {
                this.$refs.tempForm.validate(valid => {
                    if (valid) {
                        userUpdate(this.temp).then(response => {
                            if (response.data > 0) {
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

                    }
                })
            },

            // 添加
            handleCreate() {
                this.temp = {
                    role: undefined
                }
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            create() {
                this.$refs.tempForm.validate(valid => {
                    if (valid) {
                        userCreate(this.temp).then(response => {
                            if (response.data > 0) {
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
                    }
                })

            },

            // 导出excel
            handleDownload() {
                require.ensure([], () => {
                    const { export_json_to_excel } = require('vendor/Export2Excel');
                    const tHeader = ['序号', '商户名称', '结算行', '订单总金额', '应结总金额', '订单时间','创建时间'];
                    const filterVal = [
                        { name: 'id' },
                        { name: 'userName' },
                        { name: 'platformName' },
                        { name: 'totalMoneyYuan' },
                        { name: 'settlementMoneyYuan' },
                        { name: 'orderTime', filterFunction: parseTime },
                        { name: 'createTime', filterFunction: parseTime }

                    ];
                    const data = this.formatJson(filterVal, this.list);
                    export_json_to_excel(tHeader, data, '结算数据');
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

            // 分配角色
            handleAssignRole(row) {

            }
        }
    }
</script>
