<template>
  <div class="app-container" v-loading="loading">
    <!--功能按钮-->
    <div class="action-container">
      <el-button  icon="el-icon-plus" size="small" type="primary" @click="openCreatedDialog">添加提款方式</el-button>
      <el-button  icon="el-icon-delete" size="small" @click="deleteMethod">批量删除</el-button>
      <el-button  icon="el-icon-refresh" size="small" @click="refresh">刷新</el-button>
    </div>
    <!--表格数据-->
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
        label="提款方式名称" >
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间" >
      </el-table-column>
      <el-table-column
        label="操作"
        align="left" max-width="20">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="openEditDialog(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <pagination
      :total-elements="totalElements"
      :change-callback="getTableList"
      ref="page">
    </pagination>
    <!--添加模态框-->
    <el-dialog
      title="添加增值服务"
      :visible.sync="createdDialog"
      :before-close="closeCreatedDialog">
      <el-form :model="form">
        <el-form-item label="提款方式" :label-width="formLabelWidth">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeCreatedDialog">取 消</el-button>
        <el-button type="primary" @click="createdMethod" :loading="btnLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑模态框-->
    <el-dialog
      title="修改增值服务"
      :visible.sync="editDialog"
      :before-close="closeEditDialog">
      <el-form :model="edit">
        <el-form-item label="提款方式" :label-width="formLabelWidth">
          <el-input v-model="edit.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeEditDialog">取 消</el-button>
        <el-button type="primary" @click="editMethod" :loading="btnLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>


</template>

<script>
  import {getTableList,deleteMethod,editMethod,createdMethod} from '@/modules/config/api/withdraw_way'
  import {returnFilesUrl,returnThumbnailUrl,uploadFile,uploadUrl} from '@/modules/file/api/upload'
  import pagination from '@/components/pagination/index'
  export default {
    name: 'withdraw_way',
    data () {
      return {
        tableData: [], // 表格数据
        module:'config',
        totalElements: 0, // 数据条数
        multipleSelection: [], // 选中数据-多选
        createdDialog: false, // 新建模态框
        editDialog: false, // 编辑模态框
        loading: true, // loading效果
        formLabelWidth: '120px',//设置宽度
        btnLoading: false, // 按钮loading
        //创建模态框src
        createdSrc: '',
        url: uploadUrl + "/config" ,
        //编辑模态框src
        editSrc: '',
        tablePhotoVisible: false,
        form:{
          name:'',
          iconId:'',
        },
        edit:{
          missionSourceId:'',
          name: '',
          iconId: '',
        },
        filesData: {
          module: 'config'
        },
        headers: {
          accessToken: sessionStorage.token
        }
      }
    },
    components: { pagination },
    created () {
      this.getTableList()
    },
    methods: {
      //表格列表
      getTableList: function(number, pageSize) {
        this.loading = true
        getTableList(number, pageSize).then(response => {
          let data = response.obj.content
          this.tableData = data
          this.totalElements = response.obj.totalElements
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      /*
       * 刷新
       * */
      refresh () {
        this.$refs.page.refresh()
      },
      //打开创建div
      openCreatedDialog () {
        this.form = {
          name:'',
        },
        this.createdDialog = true
      },

      //关闭菜品模态框
      closeCreatedDialog () {
        this.createdDialog = false
      },

      //创建方法
      createdMethod () {
        createdMethod(this.form).then(response => {
          this.$message({
            message: response.msg,
            type: 'success'
          })
          this.btnLoading = false
          this.closeCreatedDialog()
          this.refresh()
        }).catch(() => {
          this.btnLoading = false
          this.loading = false
        })
      },

      //编辑
      openEditDialog (row) {
        this.edit.withdrawWayId = row.id
        this.edit.name = row.name
        this.editDialog = true
      },

      closeEditDialog () {
        this.editDialog = false
      },
      //编辑确认
      editMethod() {
        editMethod(this.edit).then(response => {
          this.$message({
            message: response.msg,
            type: 'success',
            duration: 1000
          })
          this.editDialog = false
          this.$refs.page.refresh()
        }).catch(() => {
          this.loading = false
        })
      },

      isInteger(obj) {
        return Math.floor(obj) === obj
      },

      //批量删除
      deleteMethod () {
        this.$confirm('是否删除这些提款方式吗？', '提示', {
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
            deleteMethod(ids).then(response => {
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
              message: '请选择提款方式',
              type: 'warning',
              duration: 1000
            })
          }
        })
      },
      //删除
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      handleDelete (row) {
        this.multipleSelection.push(row)
        this.deleteMethod()
      },
      //创建模态框 上传
      createLogoSuccess (response, file) {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.form.iconId = response.obj
        this.createdSrc = returnThumbnailUrl(response.obj)
        console.log(this.createdSrc)
      },
      //编辑模态框 上传
      editLogoSuccess (response, file) {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.edit.iconId = response.obj
        this.editSrc = returnThumbnailUrl(response.obj)
      },
      //图片上传失败
      handleLogoFailed () {
        this.$message({
          message: '图片上传失败',
          type: 'error'
        })
      },
      //对上传图片做限制
      beforeLogoUpload (file) {
        let isImage = file.type.substring(0, 5) === 'image'
        if (!isImage) {
          this.$message.error('只能上传图片')
          return false
        }
        return true
      },
    }
  }
</script>

<style scoped>
  .logo-uploader {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .logo-uploader:hover {
    border-color: #409EFF;
  }
  .logo-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .logo {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
