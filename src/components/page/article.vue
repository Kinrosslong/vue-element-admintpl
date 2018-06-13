<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                <el-form-item label="日期">
                    <el-date-picker type="date" placeholder="选择日期" 
                    v-model="form.created_at" value-format="yyyy-MM-dd"
                    style="width: 100%;" format="yyyy 年 MM 月 dd 日">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                    <el-input v-model="form.content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
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
                idx: -1
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
                this.$axios.get('/api/acticleList', {params:params}).then(res => {
                    this.total = res.data.total;
                    this.tableData = res.data.list;
                }).catch(error => {
                    console.log(error)
                });
            },

            //按照条件搜索
            search() {
                this.getData();
            },
            //这个是element的一个方法
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
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
                this.idx = index;
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
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                console.log(this.form);
                this.form = {};
                this.$axios.post('/api/saveEdit', this.form).then(res => {
                    console.log();
                    // if(res.code) {
                    //     this.editVisible = false;
                    //     this.$message.success(`修改第 ${this.idx+1} 行成功`);
                    // } else {
                    //     this.$message.error(`修改第 ${this.idx+1} 失败`);
                    // }
                });
               
            },
            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
            }
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
