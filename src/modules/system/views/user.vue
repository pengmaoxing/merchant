<template>
    <div class="app-container" v-loading="loading">
        <div class="filter-container">
            <el-input
                    style="width: 200px"
                    class="filter-item"
                    placeholder="姓名"
                    v-model="queryList.name" @keyup.enter.native="search"></el-input>
            <el-input
                    style="width: 200px"
                    type="tel"
                    class="filter-item"
                    placeholder="手机"
                    v-model="queryList.phone" @keyup.enter.native="search"></el-input>
            <el-input
                    style="width: 200px"
                    type="email"
                    class="filter-item"
                    placeholder="邮箱"
                    v-model="queryList.email" @keyup.enter.native="search"></el-input>
            <el-button type="primary" icon="el-icon-search" class="filter-item" @click="search">搜索</el-button>
            <el-button class="filter-item" @click="reset">重置</el-button>
        </div>
        <div class="action-container">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="openAddDialog">添加用户</el-button>
            <el-button  icon="el-icon-refresh" size="small" @click="refresh">刷新</el-button>
        </div>
        <el-table
                :data="tableData"
                border
                style="width: 100%"
                @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="username"
                    label="用户名">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名">
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="手机">
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="邮箱">
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    prop="updateTime"
                    label="更新时间">
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="270">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="primary"
                            @click="openEditDialog(scope.row)">编辑</el-button>
                    <el-button
                            v-if="scope.row.delFlag===1"
                            size="mini"
                            type="danger"
                            @click="disableUser(scope.row.id)">禁用</el-button>
                    <el-button
                            v-else-if="scope.row.delFlag===-1"
                            size="mini"
                            type="success"
                            @click="enableUser(scope.row.id)">启用</el-button>
                    <el-button
                            size="mini"
                            @click="resetPassword(scope.row.id)">重置密码</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination
                :total-elements="totalElements"
                :change-callback="getUserList"
                ref="page"></pagination>
        <el-dialog
                title="添加用户"
                :visible.sync="addDialog"
                :before-close="closeAddDialog">
            <el-form :model="form">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input type="password" v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="选择角色" :label-width="formLabelWidth">
                    <el-select
                            v-model="form.roles"
                            multiple
                            collapse-tags
                            placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="手机" :label-width="formLabelWidth">
                    <el-input v-model="form.phone" type="tel"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="form.email" type="email"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAddDialog">取 消</el-button>
                <el-button type="primary" @click="addUser" :loading="btnLoading">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="编辑用户"
            :visible.sync="editDialog"
            :before-close="closeEditDialog">
            <el-form>
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="currentRow.name"></el-input>
                </el-form-item>
                <el-form-item label="手机" :label-width="formLabelWidth">
                    <el-input type="tel" v-model="currentRow.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input type="email" v-model="currentRow.email"></el-input>
                </el-form-item>
                <el-form-item label="选择角色" :label-width="formLabelWidth">
                    <el-select
                            v-model="currentRow.roles"
                            multiple
                            collapse-tags
                            placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeEditDialog">取 消</el-button>
                <el-button type="primary" @click="editUser" :loading="btnLoading">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getUser, disableUser, enableUser, addUser, editUser, resetPassword } from '@/modules/system/api/user'
import { selectRole } from '@/modules/system/api/role'
import pagination from '@/components/pagination/index'

export default {
  components: { pagination },
  name: 'user',
  data () {
    return {
      loading: false,
      btnLoading: false,
      multipleSelection: [], // 选中数据-多选
      totalElements: 0, // 数据条数
      queryList: {
        name: '',
        email: '',
        phone: ''
      }, // 搜素数据
      tableData: [], // 表格数据
      addDialog: false, // 添加角色模态框
      form: {
        username: '',
        password: '',
        name: '',
        phone: '',
        email: '',
        roles: [] // 下拉框多选值
      }, // 添加用户数据
      formLabelWidth: '120px',
      options: [],
      editDialog: false, // 编辑角色模态框
      currentRow: {
        id: '',
        name: '',
        phone: '',
        email: '',
        roles: []
      } // 当前表格对象
    }
  },
  mounted () {
    this.getUserList()
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleDelete (row) {
      this.multipleSelection.push(row)
      this.deleteRoles()
    },
    /*
     * 获取用户列表
     * */
    getUserList (number, pageSize) {
      this.loading = true
      getUser(number, pageSize, this.queryList).then(response => {
        let data = response.obj
        console.log(data)
        this.totalElements = data.totalElements
        this.tableData = data.content
        setTimeout(() => {
          this.loading = false
        }, 500)
      }).catch(() => {
        this.loading = false
      })
    },
    /*
     * 禁用用户
     * */
    disableUser (id) {
      this.$confirm('是否禁用该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        disableUser(id).then(response => {
          this.$message({
            message: response.msg,
            type: 'success',
            duration: 1000
          })
          this.$refs.page.refresh()
        }).catch(() => {
          this.loading = false
        })
      })
    },
    /*
     * 启用用户
     * */
    enableUser (id) {
      this.$confirm('是否启用该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.loading = true
        enableUser(id).then(response => {
          this.$message({
            message: response.msg,
            type: 'success',
            duration: 1000
          })
          this.$refs.page.refresh()
        }).catch(() => {
          this.loading = false
        })
      })
    },
    /*
     * 添加用户
     * */
    /*
     * 打开添加用户模态框
     * */
    openAddDialog () {
      this.addDialog = true
      this.getRoles()
    },
    /*
     * 关闭添加用户模态框
     * */
    closeAddDialog () {
      this.addDialog = false
      this.form = {
        username: '',
        password: '',
        name: '',
        phone: '',
        email: '',
        roles: [] // 下拉框多选值
      }
    },
    /*
     * 添加用户
     * */
    addUser () {
      this.loading = true
      this.btnLoading = true
      addUser(this.form).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.btnLoading = false
        this.closeAddDialog()
        this.$refs.page.refresh()
      }).catch(() => {
        this.btnLoading = false
        this.loading = false
      })
    },
    /*
     * 编辑用户
     * */
    /*
     * 打开编辑用户模态框
     * */
    openEditDialog (row) {
      this.currentRow.id = row.id
      this.currentRow.name = row.name
      this.currentRow.phone = row.phone
      this.currentRow.email = row.email
      this.currentRow.roles = []
      if (row.roles) {
        row.roles.forEach(item => {
          this.currentRow.roles.push(item.id)
        })
      }
      this.editDialog = true
      this.getRoles()
    },
    /*
     * 关闭编辑用户模态框
     * */
    closeEditDialog (row) {
      this.editDialog = false
    },
    /*
     * 编辑用户
     * */
    editUser () {
      this.loading = true
      this.btnLoading = true
      editUser(this.currentRow).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.btnLoading = false
        this.closeEditDialog()
        this.$refs.page.refresh()
      }).catch(() => {
        this.btnLoading = false
        this.loading = false
      })
    },
    /*
    * 重置密码
    * */
    resetPassword (id) {
      this.$confirm('是否重置密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        resetPassword(id).then(response => {
          this.$message({
            message: response.msg,
            type: 'success'
          })
          this.$refs.page.refresh()
        }).catch(() => {
          this.loading = false
        })
      })
    },
    /*
    * 获取角色列表
    * */
    getRoles () {
      if (!this.options.length) {
        selectRole().then(response => {
          this.options = response.obj
        }).catch(() => {})
      }
    },
    /*
   * 刷新
   * */
    refresh () {
      this.$refs.page.refresh()
    },
    /*
    * 搜索
    * */
    search () {
      this.$refs.page.search()
    },
    /*
    * 重置
    * */
    reset () {
      this.queryList = {
        name: '',
        email: '',
        phone: ''
      }
      this.$refs.page.search()
    }
  }
}
</script>

<style scoped>
    body .el-table th.gutter {
        display: table-cell !important;
    }
</style>
