<template>
    <div class="app-container" v-loading="loading">
        <div class="action-container">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="openAddSubmenuDialog">添加子节点</el-button>
            <el-button icon="el-icon-plus" size="small" @click="openAddMenuDialog">添加一级菜单</el-button>
            <el-button  icon="el-icon-delete" size="small" @click="deletePermission">批量删除</el-button>
            <el-button  icon="el-icon-refresh" size="small" @click="refresh">刷新</el-button>
        </div>
        <el-tree :data="permissionList"
                 node-key="id"
                 highlight-current
                 :props="defaultProps"
                 @node-click="handleNodeClick"
                 :default-expanded-keys="defaultExpandKeys"
                 :expand-on-click-node="false"
                 show-checkbox
                 ref="tree"
                 class="permissionTree"></el-tree>
        <el-form ref="form" :model="currentNode" label-width="80px" class="editForm">
            <el-form-item label="名称">
                <el-input v-model="currentNode.name"></el-input>
            </el-form-item>
            <el-form-item label="路径">
                <el-input v-model="currentNode.path"></el-input>
            </el-form-item>
            <el-form-item label="图标">
                <el-input v-model="currentNode.icon" :disabled="currentNode.type === 1"></el-input>
                <a title="参考图标" href="http://beta.bhpcash.io:8008/admin/icons/icons.html" target="_blank">
                    <i class="el-icon-info" style="position: absolute;right: -24px;top: 13px;cursor: pointer"></i>
                </a>
            </el-form-item>
            <el-form-item label="排序值">
                <el-input-number v-model="currentNode.sortOrder" :min="1"  label="描述文字"></el-input-number>
            </el-form-item>
            <el-form-item label="是否启用">
                <el-switch v-model="currentNode.delFlag"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-edit" type="primary" @click="editPermission">修改</el-button>
            </el-form-item>
        </el-form>
        <el-dialog
                title="添加一级菜单"
                :visible.sync="addMenuDialog"
                :before-close="closeAddMenuDialog">
            <el-form :model="menuForm">
                <el-form-item label="名称" :label-width="formLabelWidth">
                    <el-input v-model="menuForm.name"></el-input>
                </el-form-item>
                <el-form-item label="路径" :label-width="formLabelWidth">
                    <el-input v-model="menuForm.path"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAddMenuDialog">取 消</el-button>
                <el-button type="primary" @click="addMenu" :loading="btnLoading">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
                title="添加子节点"
                :visible.sync="addSubmenuDialog"
                :before-close="closeAddSubmenuDialog">
            <el-form :model="submenuForm">
                <el-form-item label="名称" :label-width="formLabelWidth">
                    <el-input v-model="submenuForm.name"></el-input>
                </el-form-item>
                <el-form-item label="路径" :label-width="formLabelWidth">
                    <el-input v-model="submenuForm.path"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAddSubmenuDialog">取 消</el-button>
                <el-button type="primary" @click="addSubmenu" :loading="btnLoading">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getAllPermission, addPermission, deletePermissions, editPermission } from '@/modules/system/api/permission'

export default {
  name: 'permission',
  data () {
    return {
      loading: false, // loading效果
      btnLoading: false, // 按钮loading效果
      menuForm: {
        name: '',
        path: '',
        level: 1,
        type: 0,
        parentId: '',
        delFlag: 1,
        sortOrder: 1,
        visible: 1
      }, // 添加一级菜单数据
      addMenuDialog: false, // 添加一级菜单模态框
      submenuForm: {
        name: '',
        path: '',
        level: 1,
        type: 0,
        parentId: '',
        delFlag: 1,
        sortOrder: 1,
        visible: 1
      }, // 添加二级菜单/按钮数据
      addSubmenuDialog: false, // 添加一级菜单模态框
      permissionList: [], // 权限列表
      defaultProps: {
        label: 'name'
      }, // tree字段配置
      currentNode: this.resetCurrentNode(), // 当前对象
      formLabelWidth: '120px',
      defaultExpandKeys: []
    }
  },
  mounted () {
    this.getAllPermission()
  },
  methods: {
    /*
    * 选中所有权限
    * */
    handleNodeClick (data) {
      if (data.delFlag === 1) {
        this.currentNode.delFlag = true
      } else if (data.delFlag === -1) {
        this.currentNode.delFlag = false
      }
      this.currentNode.id = data.id
      this.currentNode.name = data.name
      this.currentNode.path = data.path
      this.currentNode.level = data.level
      this.currentNode.type = data.type
      this.currentNode.sortOrder = data.sortOrder
      this.currentNode.icon = data.icon
    },
    /*
    * 修改权限
    * */
    editPermission () {
      console.log(this.currentNode)
      if (this.currentNode.id === '') {
        this.$message({
          message: '请选择节点',
          type: 'warning'
        })
      } else {
        this.loading = true
        editPermission({
          id: this.currentNode.id,
          name: this.currentNode.name,
          path: this.currentNode.path,
          delFlag: this.currentNode.delFlag ? 1 : -1,
          sortOrder: this.currentNode.sortOrder,
          icon: this.currentNode.icon
        }).then(response => {
          this.$message({
            message: response.msg,
            type: 'success'
          })
          this.refresh()
        }).catch(() => {
          this.loading = false
        })
      }
    },
    /*
    * 获取所有权限
    * */
    getAllPermission () {
      this.loading = true
      getAllPermission().then(response => {
        console.log(response.obj)
        this.permissionList = response.obj
        response.obj.forEach((item) => {
          this.defaultExpandKeys.push(item.id)
        })
        setTimeout(() => {
          this.loading = false
        }, 500)
      }).catch(() => {
        this.loading = false
      })
    },
    /*
    * 打开添加一级菜单模态框
    * */
    openAddMenuDialog () {
      this.addMenuDialog = true
    },
    /*
    * 关闭添加一级菜单模态框
    * */
    closeAddMenuDialog () {
      this.addMenuDialog = false
      this.menuForm = {
        name: '',
        path: '',
        level: 1,
        type: 0,
        parentId: ''
      }
    },
    /*
    * 添加一级菜单模态框
    * */
    addMenu () {
      this.btnLoading = true
      this.loading = true
      addPermission(this.menuForm).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.btnLoading = false
        this.closeAddMenuDialog()
        this.refresh()
      }).catch(() => {
        this.btnLoading = false
        this.loading = false
      })
    },
    /*
    * 打开添加子节点模态框
    * */
    openAddSubmenuDialog () {
      if (this.currentNode.id === '') {
        this.$message({
          message: '请选择父节点',
          type: 'warning'
        })
      } else if (this.currentNode.type === 1) {
        this.$message({
          message: '该节点无法添加子节点',
          type: 'warning'
        })
      } else {
        this.submenuForm.level = this.currentNode.level + 1
        this.submenuForm.parentId = this.currentNode.id
        if (this.currentNode.level === 2) {
          this.submenuForm.type = 1
        }
        this.addSubmenuDialog = true
      }
    },
    /*
    * 关闭添加子节点模态框
    * */
    closeAddSubmenuDialog () {
      this.addSubmenuDialog = false
      this.submenuForm = {
        name: '',
        path: '',
        level: 1,
        type: 0,
        parentId: ''
      }
    },
    /*
    * 添加子节点
    * */
    addSubmenu () {
      this.btnLoading = true
      this.loading = true
      addPermission(this.submenuForm).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.btnLoading = false
        this.closeAddSubmenuDialog()
        this.refresh()
      }).catch(() => {
        this.btnLoading = false
        this.loading = false
      })
    },
    /*
    * 添加子节点
    * */
    deletePermission () {
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      if (checkedKeys.length) {
        this.$confirm('是否删除节点？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          deletePermissions(checkedKeys).then(response => {
            this.$message({
              message: response.msg,
              type: 'success'
            })
            this.refresh()
          }).catch(() => {
            this.loading = false
          })
        })
      } else {
        this.$message({
          message: '请选择节点',
          type: 'warning'
        })
      }
    },
    /*
    * 重置当前节点
    * */
    resetCurrentNode () {
      return {
        id: '',
        name: '',
        path: '',
        icon: '',
        sortOrder: 1,
        delFlag: true,
        level: 1,
        type: 1
      }
    },
    /*
    * 刷新页面
    * */
    refresh () {
      this.currentNode = this.resetCurrentNode()
      this.getAllPermission()
    }
  }
}
</script>

<style scoped>
    .editForm{
        width: 600px;
        margin: 30px auto;
    }
    .permissionTree{
        width: 300px;
        position: absolute;
        top: 82px;
        left: 20px;
    }
    .app-container{
        overflow: hidden;
    }
</style>
