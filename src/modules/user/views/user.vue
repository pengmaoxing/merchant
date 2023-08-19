<template>
  <div class="app-container" v-loading="loading">
    <div class="filter-container">
      <el-input
        style="width: 200px"
        class="filter-item"
        placeholder="姓名"
        v-model="queryList.name" @keyup.enter.native="search" size="small"></el-input>
      <el-input
        style="width: 200px"
        type="tel"
        class="filter-item"
        placeholder="手机"
        v-model="queryList.phone" @keyup.enter.native="search" size="small"></el-input>
      <el-button type="primary" icon="el-icon-search" class="filter-item" @click="search" size="small">搜索</el-button>
      <el-button class="filter-item" @click="reset" size="small">重置</el-button>
    </div>
    <div class="action-container">
      <el-button type="primary" icon="el-icon-plus" size="small" @click="openAddDialog">添加用户</el-button>
      <el-button icon="el-icon-refresh" size="small" @click="refresh">刷新</el-button>
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
        prop="id"
        label="用户ID">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机">
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <template v-if="scope.row.sex===1">男</template>
          <template v-else-if="scope.row.sex===2">女</template>
        </template>
      </el-table-column>
      <el-table-column
        prop="storeName"
        label="所属门店">
      </el-table-column>
      <el-table-column label="角色">
        <template slot-scope="scope">
          <template v-if="scope.row.userType==='1'">商户</template>
          <template v-else-if="scope.row.userType==='2'">店长</template>
          <template v-else-if="scope.row.userType==='3'">店员</template>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <template v-if="scope.row.status===1">启用</template>
          <template v-else-if="scope.row.status===2">禁用</template>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="270">
        <template slot-scope="scope">
          <el-button
            type="text"
            :disabled="scope.row.userType==='1'"
            @click="openEditDialog(scope.row)">编辑
          </el-button>
          <el-button
            type="text"
            @click="resetPasswordDialogOpen(scope.row)">重置密码
          </el-button>
          <el-button type="text" @click="rooterDeatil(scope.row)">详情</el-button>
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
      :before-close="closeAddDialog"
      width="500px">
      <el-form :model="form">
        <el-form-item label="用户名" :required="true" :label-width="formLabelWidth">
          <el-input class="input-width" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" :required="true" :label-width="formLabelWidth">
          <el-input class="input-width" type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :required="true" :label-width="formLabelWidth">
          <el-input class="input-width" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="手机" :required="true" :label-width="formLabelWidth">
          <el-input class="input-width" v-model="form.phone" type="tel"></el-input>
        </el-form-item>
        <el-form-item label="选择性别" :required="true" :label-width="formLabelWidth">
          <el-select
            v-model="form.sex"
            collapse-tags
            placeholder="请选择">
            <el-option
              v-for="item in sexOption"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="userType=='1'" :required="true" label="选择门店" :label-width="formLabelWidth">
          <el-select
            v-model="form.storeId"
            collapse-tags
            placeholder="请选择">
            <el-option
              v-for="item in storeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="userType=='1'" :required="true" label="选择角色" :label-width="formLabelWidth">
          <el-select
            v-model="form.userType"
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
        <el-form-item label="选择状态" :required="true" :label-width="formLabelWidth">
          <el-select
            v-model="form.status"
            collapse-tags
            placeholder="请选择">
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth">
          <el-upload
            class="logo-uploader"
            :action="url"
            :data="filesData"
            name="files"
            :show-file-list="false"
            :on-success="createLogoSuccess"
            :on-error="handleLogoFailed"
            :before-upload="beforeLogoUpload"
            :headers="headers">
            <img v-if="createdSrc" :src="createdSrc" class="logo">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="富友终端" :label-width="formLabelWidth">
          <el-input class="input-width" v-model="form.fyTermId" placeholder="请输入富友POS机的终端号"></el-input>
        </el-form-item>
        <el-form-item label="中间件设备id" :label-width="formLabelWidth">
          <el-input class="input-width" v-model="form.sbId" placeholder="请输入中间件设备id"></el-input>
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
      :before-close="closeEditDialog"
      width="500px">
      <el-form>
        <el-form-item label="姓名" :required="true" :label-width="formLabelWidth">
          <el-input class="input-width" v-model="currentRow.name"></el-input>
        </el-form-item>
        <el-form-item label="手机" :required="true" :label-width="formLabelWidth">
          <el-input class="input-width" v-model="currentRow.phone" type="tel"></el-input>
        </el-form-item>

        <el-form-item label="选择性别" :required="true" :label-width="formLabelWidth">
          <el-select
            v-model="currentRow.sex"
            collapse-tags
            placeholder="请选择">
            <el-option
              v-for="item in sexOption"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="userType=='1'" label="选择门店" :required="true" :label-width="formLabelWidth">
          <el-select
            v-model="currentRow.storeId"
            collapse-tags
            placeholder="请选择">
            <el-option
              v-for="item in storeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="userType=='1'" label="选择角色" :required="true" :label-width="formLabelWidth">
          <el-select
            v-model="currentRow.userType"
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
        <el-form-item label="选择状态" :required="true" :label-width="formLabelWidth">
          <el-select
            v-model="currentRow.status"
            collapse-tags
            placeholder="请选择">
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="图片" :label-width="formLabelWidth">
          <el-upload
            class="logo-uploader"
            :action="url"
            :data="filesData"
            name="files"
            :show-file-list="false"
            :on-success="editLogoSuccess"
            :on-error="handleLogoFailed"
            :before-upload="beforeLogoUpload"
            :headers="headers">
            <img v-if="createdSrc" :src="createdSrc" class="logo">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="富友终端" :label-width="formLabelWidth">
          <el-input class="input-width" v-model="currentRow.fyTermId" placeholder="请输入富友POS机的终端号"></el-input>
        </el-form-item>
        <el-form-item label="中间件设备id" :label-width="formLabelWidth">
          <el-input class="input-width" v-model="currentRow.sbId" placeholder="请输入中间件设备id"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeEditDialog">取 消</el-button>
        <el-button type="primary" @click="editUser" :loading="btnLoading">确 定</el-button>
      </div>
    </el-dialog>

    <!--重置密码对话框 -->
    <el-dialog
      title="重置业务员密码"
      :visible.sync="resetPasswordDialog"
      width="576px"
      :before-close="resetPasswordDialogClose">

      <el-form :model="resetForm" :rules="rules" ref="resetForm" label-width="100px">
        <el-form-item label="新密码" prop="password">
          <el-input v-model="resetForm.password" type="password"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="resetPasswordDialogClose">取 消</el-button>
    <el-button type="primary" @click="saveNewPssword">提 交</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getUser, addUser, editUser, resetPassword, storeListByMctId} from '../api/user'
  import {returnThumbnailUrl, uploadUrl} from '@/modules/file/api/upload'
  import pagination from '@/components/pagination/index'

  export default {
    components: {pagination},
    name: 'user',
    data() {
      return {
        filesData: {
          module: 'user'
        }, // 携带参数
        createdSrc: '',
        editSrc: '',
        headers: {
          authorized: sessionStorage.token
        },
        url: uploadUrl + '/user',
        resetPasswordDialog: false,//重置密码对话框
        resetPWid: '',
        resetForm: {
          password: '',
        },
        rules: {
          password: [
            {required: true, message: '请输入新的密码', trigger: 'blur'},
            {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
          ]
        },
        loading: false,
        btnLoading: false,
        multipleSelection: [], // 选中数据-多选
        totalElements: 0, // 数据条数
        queryList: {
          name: '',
          phone: ''
        }, // 搜素数据
        tableData: [], // 表格数据
        addDialog: false, // 添加角色模态框
        form: {
          username: '',
          password: '',
          name: '',
          phone: '',
          sex: 1,
          storeId: '',
          status: 1,
          userType: '',// 下拉框多选值
          photoId: '',
          sbId: '',
          fyTermId: ''
        }, // 添加用户数据
        formLabelWidth: '120px',
        options: [{value: '2', name: '店长'}, {value: '3', name: '店员'}],
        sexOption: [{value: 1, name: '男'}, {value: 2, name: '女'}],
        statusOption: [{value: 1, name: '启用'}, {value: 2, name: '注销'}],
        storeOptions: [],
        editDialog: false, // 编辑角色模态框
        currentRow: {
          id: '',
          name: '',
          phone: '',
          sex: '',
          storeId: '',
          status: '',
          userType: '',// 下拉框多选值
          fyTermId: '',
          sbId:''
        },// 当前表格对象
        userType: '1'
      }
    },
    mounted() {
      //获取列表
      this.getUserList()
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleDelete(row) {
        this.multipleSelection.push(row)
        this.deleteRoles()
      },
      /*
       * 获取用户列表
       * */
      getUserList(number, pageSize) {
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

      //重置密码
      resetPasswordDialogOpen: function (data) {
        //获取被修改的ID
        this.resetPWid = data.id
        this.resetPasswordDialog = true

      },
      resetPasswordDialogClose: function () {
        this.resetForm.password = ''
        this.resetPasswordDialog = false
      },
      saveNewPssword: function () {
        console.log('表单密码:' + this.resetForm.password)
        //保存密码
        resetPassword(this.resetPWid, this.resetForm.password).then(response => {
          this.$message({
            message: response.msg,
            type: 'success'
          })
          this.resetForm.password = ''
          this.resetPasswordDialog = false
        }).catch(() => {
          this.loading = false
        })
      },

      /*
       * 添加用户
       * */
      /*
       * 打开添加用户模态框
       * */
      openAddDialog() {
        let userType = sessionStorage.getItem('userType')
        this.userType = userType
        this.getStores()
        this.createdSrc = ''
        this.addDialog = true

      },
      /*
       * 关闭添加用户模态框
       * */
      closeAddDialog() {
        this.addDialog = false
        this.form = {
          username: '',
          password: '',
          name: '',
          phone: '',
          sex: 1,
          storeId: '',
          status: 1,
          userType: '',// 下拉框多选值
          photoId: '',
          fyTermId: '',
          sbId: ''
        }
        this.createdSrc = ''
      },
      /*
       * 添加用户
       * */
      addUser() {
        this.loading = true
        this.btnLoading = true
        console.log(this.form)
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
      openEditDialog(row) {
        console.log(row)
        this.currentRow.id = row.id
        this.currentRow.phone = row.phone
        this.currentRow.name = row.name
        this.currentRow.sex = row.sex
        this.currentRow.storeId = row.storeId
        this.currentRow.status = row.status
        this.currentRow.photoId = row.photoId
        this.currentRow.userType = row.userType
        this.currentRow.fyTermId = row.fyTermId
        this.currentRow.sbId = row.sbId
        this.getStores()
        this.createdSrc = this.getPicUrl(this.currentRow.photoId)
        this.editDialog = true
      },

      getPicUrl(picid) {
        console.log(returnThumbnailUrl(picid))
        return returnThumbnailUrl(picid)
      },
      /*
       * 关闭编辑用户模态框
       * */
      closeEditDialog(row) {
        this.currentRow = {
          id: '',
          name: '',
          phone: '',
          sex: '1',
          storeId: '',
          status: '1',
          userType: '',// 下拉框多选值
          sbId: '',// 下拉框多选值
          fyTermId: ''
        }
        this.editDialog = false
      },
      /*
       * 编辑用户
       * */
      editUser() {
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
    * 获取门店列表
    * */
      getStores() {
        if (!this.storeOptions.length) {
          storeListByMctId().then(response => {
            this.storeOptions = response.obj
          }).catch(() => {
          })
        }
      },

      //跳转详情页
      rooterDeatil(data) {
        //console.log(data)
        //query发送ID到详情
        let id = data.id
        this.$router.push({path: '/user/views/userDetail', query: {id: id}})
      },

      //创建模态框 上传
      createLogoSuccess(response, file) {
        //保存图片ID
        this.photoId = response.obj
        console.log(response)
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.form.photoId = response.obj
        this.createdSrc = returnThumbnailUrl(response.obj)
      },
      //编辑模态框 上传
      editLogoSuccess(response, file) {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.currentRow.photoId = response.obj
        this.createdSrc = returnThumbnailUrl(response.obj)
      },
      //图片上传失败
      handleLogoFailed() {
        this.$message({
          message: '图片上传失败',
          type: 'error'
        })
      },
      //对上传图片做限制
      beforeLogoUpload(file) {
        let isImage = file.type.substring(0, 5) === 'image'
        if (!isImage) {
          this.$message.error('只能上传图片')
          return false
        }
        return true
      },

      /*
     * 刷新
     * */
      refresh() {
        this.$refs.page.refresh()
      },
      /*
      * 搜索
      * */
      search() {
        this.$refs.page.search()
      },
      /*
      * 重置
      * */
      reset() {
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

  .input-width {
    width: 217px;
  }
</style>
