<template>
    <div class="app-container" v-loading="loading">
        <div class="action-container">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="openAddDialog">添加角色</el-button>
            <el-button  icon="el-icon-delete" size="small" @click="deleteRoles">批量删除</el-button>
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
                    prop="name"
                    label="角色名称">
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
                    prop="defaultRole"
                    label="是否设置为注册用户默认角色">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.defaultRole"
                            size="mini"
                            type="success"
                            @click="setDefault(scope.row, false)">取消默认</el-button>
                    <el-button v-else
                               size="mini"
                               type="primary"
                               @click="setDefault(scope.row, true)">设置默认</el-button>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="warning"
                            @click="openAccessDialog(scope.row)">分配权限</el-button>
                    <el-button
                            size="mini"
                            type="primary"
                            @click="openEditDialog(scope.row)">编辑</el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination
                :total-elements="totalElements"
                :change-callback="getRoleList"
                ref="page"></pagination>
        <el-dialog
                title="添加角色"
                :visible.sync="addDialog"
                :before-close="closeAddDialog">
            <el-form :model="form">
                <el-form-item label="角色名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth">
                    <el-checkbox v-model="form.isDefault">是否设为默认角色</el-checkbox>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAddDialog">取 消</el-button>
                <el-button type="primary" @click="addRole" :loading="btnLoading">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
                title="编辑角色"
                :visible.sync="editDialog"
                :before-close="closeEditDialog">
            <el-form>
                <el-form-item label="角色名称" :label-width="formLabelWidth">
                    <el-input v-model="currentRow.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeEditDialog">取 消</el-button>
                <el-button type="primary" @click="editRole" :loading="btnLoading">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
                title="权限分配"
                :visible.sync="accessDialog"
                :before-close="closeAccessDialog"
                class="accessDialog">
            <div class="block">
                <el-tree
                        :data="permissionList"
                        show-checkbox
                        ref="tree"
                        node-key="id"
                        :default-checked-keys="currentRow.permissions"
                        :default-expanded-keys="expandedKeys"
                        :expand-on-click-node="false">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                  </span>
                </el-tree>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAccessDialog">取 消</el-button>
                <el-button type="primary" @click="getCheckedNodes" :loading="btnLoading">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getRole, setDefault, addRole, deleteRoles, editRole, setPermission } from '@/modules/system/api/role'
import { getAllPermission } from '@/modules/system/api/permission'
import pagination from '@/components/pagination/index'

export default {
  name: 'role',
  components: { pagination },
  data () {
    return {
      tableData: [], // 表格数据
      multipleSelection: [], // 选中数据-多选
      totalElements: 0, // 数据条数
      loading: true, // loading效果
      btnLoading: false,
      addDialog: false, // 添加角色模态框
      editDialog: false, // 编辑角色模态框
      accessDialog: false, // 分配模态框
      form: {
        name: '',
        isDefault: false
      }, // 添加角色数据
      currentRow: {
        id: '',
        name: '',
        permissions: [] // 当前角色的权限
      }, // 当前表格对象
      formLabelWidth: '150px', // label宽度
      permissionList: [], // 所有权限
      expandedKeys: [] // 默认展开的权限id
    }
  },
  mounted () {
    this.getRoleList(1, 10)
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleDelete (row) {
      this.multipleSelection = []
      this.multipleSelection.push(row)
      this.deleteRoles()
    },
    /*
     * 获取角色列表
     * */
    getRoleList (number, pageSize) {
      this.loading = true
      getRole(number, pageSize).then(response => {
        let data = response.obj
        console.log(data)
        this.tableData = data.content
        this.totalElements = data.totalElements
        setTimeout(() => {
          this.loading = false
        }, 500)
      }).catch(() => {
        this.loading = false
      })
    },
    /*
    * 设置默认角色
    * */
    setDefault: function (row, isDefault) {
      this.loading = true
      setDefault(row.id, isDefault).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.$refs.page.refresh()
      }).catch(() => {
        this.loading = false
      })
    },
    /*
   * 添加角色
   * */
    openAddDialog () {
      this.addDialog = true
    },
    closeAddDialog () {
      this.addDialog = false
      this.form.isDefault = false
      this.form.name = ''
    },
    addRole () {
      this.loading = true
      this.btnLoading = true
      addRole(this.form.name, this.form.isDefault).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.btnLoading = false
        this.closeAddDialog()
        this.$refs.page.refresh()
      }).catch(() => {
        this.loading = false
      })
    },
    /*
    * 删除角色
    * */
    deleteRoles () {
      this.$confirm('是否删除角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.multipleSelection.length) {
          this.loading = true
          let ids = []
          this.multipleSelection.forEach((item) => {
            ids.push(item.id)
          })
          deleteRoles(ids).then(response => {
            this.$message({
              message: response.msg,
              type: 'success',
              duration: 1000
            })
            this.multipleSelection = []
            this.$refs.page.refresh()
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.$message({
            message: '请选择角色',
            type: 'warning',
            duration: 1000
          })
        }
      })
    },
    /*
    * 编辑角色
    * */
    openEditDialog (row) {
      this.currentRow.id = row.id
      this.currentRow.name = row.name
      this.editDialog = true
    },
    closeEditDialog () {
      this.editDialog = false
    },
    editRole () {
      this.loading = true
      this.btnLoading = true
      editRole(this.currentRow.id, this.currentRow.name).then(response => {
        this.$message({
          message: response.msg,
          type: 'success',
          duration: 1000
        })
        this.btnLoading = false
        this.closeEditDialog()
        this.$refs.page.refresh()
      }).catch(() => {
        this.loading = false
      })
    },
    /*
    * 打开权限分配
    * */
    openAccessDialog (row) {
      this.accessDialog = true
      this.currentRow.id = row.id
      this.currentRow.name = row.name
      row.permissions.forEach(item => {
        if (item.type === 1) {
          this.currentRow.permissions.push(item.id)
        }
      })
      getAllPermission().then(response => {
        this.permissionList = this.recursionPermission(response.obj)
        response.obj.forEach((item) => {
          this.expandedKeys.push(item.id)
        })
      }).catch(() => {})
    },
    /*
    * 关闭权限分配
    * */
    closeAccessDialog () {
      this.accessDialog = false
      this.currentRow.permissions = []
      this.resetChecked()
    },
    /*
    * 分配权限
    * */
    getCheckedNodes () {
      this.loading = true
      this.btnLoading = true
      let set = new Set(this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys()))
      let permissions = Array.from(set)
      setPermission(this.currentRow.id, permissions).then(response => {
        this.closeAccessDialog()
        this.$message({
          message: response.msg,
          type: 'success',
          duration: 1000
        })
        this.btnLoading = false
        this.$refs.page.refresh()
      }).catch(() => {
        this.btnLoading = false
        this.loading = false
      })
    },
    /*
    * 递归权限
    * */
    recursionPermission (items) {
      let permissionList = []
      items.forEach(item => {
        let newItem = {
          id: item.id,
          label: item.name,
          children: item.children
        }
        permissionList.push(newItem)
        if (newItem.children) {
          newItem.children = this.recursionPermission(newItem.children)
        }
      })
      return permissionList
    },
    /*
    * 重置权限树，避免闪动bug
    * */
    resetChecked () {
      this.$refs.tree.setCheckedKeys([])
    },
    /*
   * 刷新
   * */
    refresh () {
      this.$refs.page.refresh()
    }
  }
}
</script>

<style scoped>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>
