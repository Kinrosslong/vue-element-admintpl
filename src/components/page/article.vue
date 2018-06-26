<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-button type="success" icon="el-icon-plus"  @click="articleAdd" plain>添加</el-button>
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="ID" sortable width="100">
                </el-table-column>
                <el-table-column prop="title" label="标题" width="180">
                </el-table-column>
                <el-table-column prop="content" label="内容">
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" width="150">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination  layout="total, prev, pager, next, jumper"  :total="total"   :page-size="pagesize"
                    @size-change="getData"
                    @current-change="getData">
                </el-pagination>
            </div>
           
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%" @close="handleClose">
            <el-form ref="form" :model="form" label-width="50px" :rules="rules">
                <el-form-item label="日期" prop="created_at">
                    <el-date-picker type="date" placeholder="选择日期" 
                    v-model="form.created_at" style="width: 100%;" value-format="yyyy-MM-dd" >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="标题" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input v-model="form.content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('form')">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'basetable',
        data() {
            return {
                url: './static/vuetable.json',
                pagesize: 5,
                tableData: [],
                total: 0,
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    id: '',
                    title: '',
                    content: '',
                    created_at: ''
                },
                idx: -1,
                rules: { //element 验证规则  trigger: 'blur' 和 trigger: 'change'这两个是有区别的
                    title: [
                        { required: true, message: '请输入文章标题', trigger: 'blur' },
                        { min: 3, max: 55, message: '长度在 3 到 55 个字符', trigger: 'blur' }
                    ],
                    content: [
                        { required: true, message: '请输入文章内容', trigger: 'blur' },
                        { min: 5, message: '长度不能小于5字符', trigger: 'blur' }
                    ],
                    created_at: [
                        { type: 'string', required: true, message: '请选择日期', trigger: 'blur' }
                    ],
                },
            }
        },
        
        created() {
            this.getData(1);
        },
        computed: {
            data() {
                // return this.tableData.filter((d) => {
                //     let is_del = false;
                //     for (let i = 0; i < this.del_list.length; i++) {
                //         if (d.name === this.del_list[i].name) {
                //             is_del = true;
                //             break;
                //         }
                //     }
                //     if (!is_del) {
                //         if (d.address.indexOf(this.select_cate) > -1 &&
                //             (d.name.indexOf(this.select_word) > -1 ||
                //                 d.address.indexOf(this.select_word) > -1)
                //         ) {
                //             return d;
                //         }
                //     }
                // })
            }
        },
        methods: {

            // 获取文章的模拟数据 这里的api 是node的请求地址
            getData(pagenum) {
                let params = {
                    pagenum: pagenum, 
                    pagesize: this.pagesize,
                    select_word: this.select_word 
                }
                
                this.get('/acticleList', params).then(res => {
                    // console.log(res);
                    if(res.code == 0) {
                        this.total = res.data.total;
                        this.tableData = res.data.list;
                    }
                });
            },

            //按照条件搜索
            search() {
                this.getData(1);
            },
            //这个是element的一个方法
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
              //添加文章
            articleAdd() {
                this.form = { id: '', title: '', content: '', created_at: ''};
                this.editVisible = true;
            },

            //编辑
            handleEdit(index, row) {

                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    title: item.title,
                    content: item.content,
                    id: item.id,
                    created_at: item.created_at
                }
                this.editVisible = true;
            },
            //删除
            handleDelete(index, row) {
                this.idx = row.id;
                this.delVisible = true;
            },
            //删除全部
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(val);
            },
            // 保存编辑
            saveEdit(form) {
                //element ui 表单验证
                this.$refs[form].validate((valid) => {
                    if (valid) { //验证通过
                        if(this.form.id) {
                            this.post('/articleEdit', this.form).then(res => {
                                // console.log(res);
                                if(res.code == 0) {
                                    this.editVisible = false;
                                    this.$message.success(`修改第 ${this.idx+1} 行成功`);
                                    this.getData(1);
                                } else if(res.code == -1) {
                                    this.$message.error(`修改第 ${this.idx+1} 行失败`);
                                }
                            });
                        } else {
                            this.post('/articleAdd', this.form).then(res => {
                                if(res.code == 0) {
                                    this.editVisible = false;
                                    this.$message.success(`修改第 ${this.idx+1} 行成功`);
                                    this.getData(1);
                                } else {
                                    this.$message.error(`修改第 ${this.idx+1} 行失败`);
                                }
                            });
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //取消即是重置
            resetForm(form) {
                this.editVisible = false;
                this.$refs[form].resetFields();
            },

            //清除表单样式 也就是重置
            handleClose() {
               this.$refs['form'].resetFields();
            },

            // 确定删除
            deleteRow(){
                this.$axios.post('/api/articleDel', {id: this.idx}).then(res => {
                    console.log(res);
                    if(res) {
                        this.$message.success('删除成功');
                        this.delVisible = false;
                    } else {

                    }
                });
            },
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
</style>
