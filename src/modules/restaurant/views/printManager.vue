<template>
  <div class="app-container" v-loading="loading">
    <div>
      <!--<el-button type="primary" @click="addPrintOpen">添加打印机</el-button>-->
      <!--<el-button @click="listRefresh">刷新</el-button>-->
    </div>
    <el-divider content-position="left">打印机管理</el-divider>
    <div>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          prop="name"
          label="打印机名称">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="ukey"
          label="ukey">
        </el-table-column>
        <el-table-column
          prop="sn"
          label="sn">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="打印次数">
        </el-table-column>
        <el-table-column
          label="操作"
          width="250px">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="modifyPrintOpen(scope.row)">修 改</el-button>
            <!--<el-button type="warning" size="small" @click="delPrint(scope.row)">删 除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total-elements="tableTotalElement"
        :change-callback="getPrintList"
        ref="page"></pagination>
    </div>


    <!--模态框-->
    <!--新增-->
    <el-dialog
      title="新增打印机"
      :visible.sync="addPrintVisible"
      width="576px"
      :before-close="addPrintClose">
      <div>
        <el-form :model="addPrintForm" ref="addPrintForm" :rules="printRules" label-width="100px" class="demo-ruleForm">

          <el-form-item label="打印机名称" prop="name">
            <el-input v-model="addPrintForm.name"></el-input>
          </el-form-item>

          <el-form-item label="uKey" prop="uKey">
            <el-input v-model="addPrintForm.uKey"></el-input>
          </el-form-item>

          <el-form-item label="SN" prop="sn">
            <el-input v-model="addPrintForm.sn"></el-input>
          </el-form-item>

          <el-form-item label="打印次数" prop="amount">
            <el-input-number v-model="addPrintForm.amount" :precision="0" :step="1" :min="1" :max="5"></el-input-number>
          </el-form-item>

        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addPrintClose">取 消</el-button>
    <el-button type="primary" @click="submitNewPrint" :loading="btnLoading">确 定</el-button>
  </span>
    </el-dialog>

    <!--编辑-->
    <el-dialog
      title="编辑打印机"
      :visible.sync="modifyPrintVisible"
      width="576px"
      :before-close="modifyPrintClose">
      <div>
        <el-form :model="modifyPrintForm" ref="modifyPrintForm" :rules="printRules" label-width="100px"
                 class="demo-ruleForm">

          <el-form-item label="打印机名称" prop="name">
            <el-input v-model="modifyPrintForm.name"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="name">
            <el-input v-model="modifyPrintForm.email"></el-input>
          </el-form-item>
          <el-form-item label="uKey" prop="uKey">
            <el-input v-model="modifyPrintForm.uKey"></el-input>
          </el-form-item>

          <el-form-item label="SN" prop="sn">
            <el-input v-model="modifyPrintForm.sn"></el-input>
          </el-form-item>

          <el-form-item label="打印次数" prop="amount">
            <el-input-number v-model="modifyPrintForm.amount" :precision="0" :step="1" :min="1"
                             :max="5"></el-input-number>
          </el-form-item>

        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="modifyPrintClose">取 消</el-button>
    <el-button type="primary" @click="submitModifyPrint" :loading="btnLoading">确 定</el-button>
  </span>
    </el-dialog>

  </div>

</template>

<script>
  import {getPrintList, savePrint, modifyPrint, deletePrint} from '../api/printManager'
  import pagination from '@/components/pagination/index'

  export default {
    name: "printManager",
    components: {pagination},
    data() {
      return {
        loading: false, //加载
        btnLoading: false,
        tableData: [],
        tableTotalElement: 0,

        //打印机
        addPrintVisible: false,
        modifyPrintVisible: false,
        addPrintForm: {
          name: '',
          uKey: '',
          sn: '',
          amount: 1,
        },
        modifyPrintForm: {
          id: '',
          name: '',
          email:'',
          uKey: '',
          sn: '',
          amount: 1,
        },
        printRules: {
          name: [
            {required: true, message: '请输入打印机名称', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],
          uKey: [
            {required: true, message: '请输入打印机uKey', trigger: 'blur'},
          ],
          sn: [
            {required: true, message: '请输入打印机sn', trigger: 'blur'},
          ],
          amount: [
            {required: true, message: '必须输入打印次数', trigger: 'change'},
          ],
        }
      }
    },
    created() {
      //按键添加打印机
      let that = this;
      document.onkeydown = function (event) {
        if (78 === event.keyCode && event.shiftKey && event.altKey) {
          that.addPrintOpen()
        }
      }
    },
    mounted() {
      //获取打印机列表
      this.getPrintList()
    },
    methods: {
      /**
       * 刷新
       */
      listRefresh: function () {
        this.$refs['page'].refresh()
      },

      /**
       * 获取打印机列表
       */
      getPrintList: function () {
        getPrintList().then(res => {
          let data = res.obj;
          this.tableData = data.content;
          this.tableTotalElement = data.totalElements
        }).catch(e => {

        })
      },


      /**
       * 打开新增打印机模态框
       */
      addPrintOpen: function () {
        this.addPrintVisible = true
      },
      /**
       * 关闭新增打印机模态框
       */
      addPrintClose: function () {
        this.$refs['addPrintForm'].resetFields();
        this.$refs['page'].refresh();
        this.addPrintVisible = false
      },
      /**
       * 提交打印机
       */
      submitNewPrint: function () {
        this.btnLoading = true;
        this.$refs['addPrintForm'].validate((valid) => {
          if (valid) {
            let form = this.addPrintForm;
            savePrint(form).then(res => {
              this.$message.success('添加成功！');
              this.addPrintClose();
              setTimeout(() => {
                this.btnLoading = false
              }, 1000)
            }).catch(e => {
              this.btnLoading = false
            })
          } else {
            this.$message.error('还有未填写的内容！');
            this.btnLoading = false;
            return false;
          }
        });


      },


      /**
       * 打开编辑打印机模态框
       */
      modifyPrintOpen: function (data) {
        this.modifyPrintForm.id = data.id;
        this.modifyPrintForm.name = data.name;
        this.modifyPrintForm.email = data.email;
        this.modifyPrintForm.uKey = data.ukey;
        this.modifyPrintForm.sn = data.sn;
        this.modifyPrintForm.amount = data.amount || 1;

        this.modifyPrintVisible = true
      },
      /**
       * 关闭编辑打印机模态框
       */
      modifyPrintClose: function () {
        this.$refs['modifyPrintForm'].resetFields();
        this.$refs['page'].refresh();
        this.modifyPrintVisible = false
      },
      /**
       * 提交编辑打印机
       */
      submitModifyPrint: function () {
        this.btnLoading = true;
        this.$refs['modifyPrintForm'].validate((valid) => {
          if (valid) {
            let form = this.modifyPrintForm;
            modifyPrint(form).then(res => {
              this.$message.success('修改成功！');
              this.modifyPrintClose();
              setTimeout(() => {
                this.btnLoading = false
              }, 1000)
            }).catch(e => {
              this.btnLoading = false
            })
          } else {
            this.$message.error('还有未填写的内容！');
            this.btnLoading = false;
            return false;
          }
        });


      },

      /**
       * 删除
       */
      delPrint: function (data) {
        let id = data.id;
        if (id == '' || id == null) {
          return
        }

        this.$confirm('此操作将删除该打印机, 是否继续?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          deletePrint(id).then(res => {
            this.$message.success('删除成功！');
            this.$refs['page'].refresh()
          }).catch(e => {

          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      },

    }
  }
</script>

<style scoped>

</style>
