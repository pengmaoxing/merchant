<template>
  <div class="app-container" v-loading="loading">
    <div class="action-container">
      <el-button type="primary" icon="el-icon-plus" size="small" @click="openDeskTypeAddDialog">添加桌型</el-button>
      <!--<el-button icon="el-icon-delete" size="small" @click="deleteDeskTypes">批量删除</el-button>-->
      <el-button icon="el-icon-refresh" size="small" @click="refresh">刷新</el-button>
      <el-button icon="el-icon-caret-left" size="small" @click="goback" style="float: right">返回上一页</el-button>
    </div>

    <!--表格-->
    <template>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="桌型">
        </el-table-column>
        <el-table-column
          prop="deskRoomName"
          label="位置">
        </el-table-column>
        <el-table-column
          prop="minAmount"
          label="最少人数"
        >
        </el-table-column>
        <el-table-column
          prop="maxAmount"
          label="最多人数"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
        >
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          align="left">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="primary"
              @click="openEditDialog(scope.row)">编辑
            </el-button>
            <!--删除-->
            <!--<el-button-->
              <!--icon="el-icon-delete"-->
              <!--size="mini"-->
              <!--@click="deleteDeskTypes(scope.row)">删除-->
            <!--</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total-elements="totalElements"
        :change-callback="getdeskTypeList"
        ref="page"></pagination>
    </template>


    <!--模态框-->
    <template>
      <el-dialog
        title="添加位置"
        :visible.sync="deskTypeAddDialog"
        :before-close="closeDeskTypeAddDialog">
        <el-form :model="form">
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="位置" :label-width="formLabelWidth">
            <el-input v-model="form.deskRoomName"></el-input>
          </el-form-item>
          <el-form-item label="最少人数" :label-width="formLabelWidth">
            <el-input-number v-model="form.minAmount" :min="1" :max="99" :step="1"  :precision="0"></el-input-number>
          </el-form-item>
          <el-form-item label="最多人数" :label-width="formLabelWidth">
            <el-input-number v-model="form.maxAmount" :min="1" :max="99" :step="1"  :precision="0"></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDeskTypeAddDialog">取 消</el-button>
          <el-button type="primary" @click="addDeskType" :loading="btnLoading">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="编辑位置"
        :visible.sync="editDialog"
        :before-close="closeEditDialog">
        <el-form>
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="currentRow.name"></el-input>
          </el-form-item>
          <el-form-item label="位置" :label-width="formLabelWidth">
            <el-input v-model="currentRow.deskRoomName"></el-input>
          </el-form-item>
          <el-form-item label="最少人数" :label-width="formLabelWidth">
            <el-input v-model="currentRow.minAmount" type="number"></el-input>
          </el-form-item>
          <el-form-item label="最多人数" :label-width="formLabelWidth">
            <el-input v-model="currentRow.maxAmount" type="number"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeEditDialog">取 消</el-button>
          <el-button type="primary" @click="editDeskType" :loading="btnLoading">确 定</el-button>
        </div>
      </el-dialog>
    </template>

  </div>
</template>

<script>
  import {deskTypeList, deskTypeAdd, deskTypeUpdate, deskTypeLogicalDel} from '../api/tableManager'
  import pagination from '@/components/pagination/index'

  export default {
    components: {pagination},
    name: 'tableType',
    data() {
      return {
        loading: false,
        btnLoading: false,
        multipleSelection: [], // 选中数据-多选
        totalElements: 0, // 数据条数
        queryList: {}, // 搜素数据
        tableData: [], // 表格数据
        deskTypeAddDialog: false, // 添加角色模态框
        form: {
          name: '', //名称
          deskRoomName: '',//位置
          minAmount: '', //最少人数
          maxAmount: '', //最多人数
        }, // 添加位置数据
        formLabelWidth: '120px',
        options: [],
        editDialog: false, // 编辑位置模态框
        currentRow: {
          id: '',
          name: '',
          deskRoomName: '',
          minAmount: '',
          maxAmount: '',
        } // 当前表格对象
      }
    },
    mounted() {
      this.getdeskTypeList()
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleDelete(row) {
        this.multipleSelection.push(row);
        this.deleteDeskTypes()
      },
      /*
       * 获取位置列表
       * */
      getdeskTypeList(number, pageSize) {
        this.loading = true;
        deskTypeList(number, pageSize, this.queryList).then(response => {
          let data = response.obj;
          console.log(data);
          this.totalElements = data.totalElements;
          this.tableData = data.content;
          setTimeout(() => {
            this.loading = false
          }, 500)
        }).catch(() => {
          this.loading = false
        })
      },

      /*
       * 添加位置
       * */
      /*
       * 打开添加位置模态框
       * */
      openDeskTypeAddDialog() {
        this.deskTypeAddDialog = true
      },
      /*
       * 关闭添加位置模态框
       * */
      closeDeskTypeAddDialog() {
        this.deskTypeAddDialog = false;
        this.form = {
          name: '',
        }
      },
      /*
       * 添加位置
       * */
      addDeskType() {
        this.loading = true;
        this.btnLoading = true;
        this.form.storeId = sessionStorage.getItem("storeId");
        deskTypeAdd(this.form).then(response => {
          this.$message({
            message: response.msg,
            type: 'success'
          });
          this.btnLoading = false;
          this.closeDeskTypeAddDialog();
          this.$refs.page.refresh()
        }).catch(() => {
          this.btnLoading = false;
          this.loading = false
        })
      },

      /*
      * 删除位置
      * */
      deleteDeskTypes(data) {
        this.$confirm('是否删除桌型？将会删除所有关联的餐桌', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          let ids = data.id;
          deskTypeLogicalDel(ids).then(response => {
            this.$message({
              message: response.msg,
              type: 'success',
              duration: 1000
            });
            this.multipleSelection = [];
            this.$refs.page.refresh()
          }).catch(() => {
            this.loading = false
          })

        })
      },

      /*
       * 编辑位置
       * */
      /*
       * 打开编辑位置模态框
       * */
      openEditDialog(row) {
        this.currentRow.id = row.id;
        this.currentRow.name = row.name;
        this.currentRow.deskRoomName = row.deskRoomName;
        this.currentRow.minAmount = row.minAmount;
        this.currentRow.maxAmount = row.maxAmount;
        this.editDialog = true
      },
      /*
       * 关闭编辑位置模态框
       * */
      closeEditDialog(row) {
        this.editDialog = false
      },
      /*
       * 编辑位置
       * */
      editDeskType() {
        this.loading = true;
        this.btnLoading = true;
        deskTypeUpdate(this.currentRow).then(response => {
          this.$message({
            message: response.msg,
            type: 'success'
          });
          this.btnLoading = false;
          this.closeEditDialog();
          this.$refs.page.refresh()
        }).catch(() => {
          this.btnLoading = false;
          this.loading = false
        })
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

      /**
       * 返回上一页
       */
      goback: function () {
        this.$router.go('-1')
      }
    }
  }
</script>

<style scoped>
  body .el-table th.gutter {
    display: table-cell !important;
  }
</style>
