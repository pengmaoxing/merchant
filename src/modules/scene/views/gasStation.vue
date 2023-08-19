<template>
  <div class="app-container" v-loading="loading">
    <div class="search_bar">
      <div>
        <!--上方选项-->
        <div>
          <!--选项条-->
          <div class="block">
            <el-radio-group v-model="searchDays" size="medium" @change="changeDays($event)">
              <el-radio-button label="0">近7日</el-radio-button>
              <el-radio-button label="1">近15日</el-radio-button>
              <el-radio-button label="2">近30日</el-radio-button>
            </el-radio-group>
          </div>
          <!--日期选择-->
          <div class="block">
            <el-date-picker
              @change="checkDataRange"
              v-model="searchForm.days"
              :clearable="false"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期时间"
              end-placeholder="结束日期时间"
              value-format="timestamp"
              :default-time="['00:00:00', '23:59:59']"
              size="medium">
            </el-date-picker>
          </div>


          <!--按钮-->
          <div class="block">
            <el-button type="primary" size="medium" @click="refreshOrderList" style="margin-left: 10px">搜 索
            </el-button>
            <el-button type="primary" size="medium" @click="gasSkuPriceOpen">油品设置</el-button>
          </div>

        </div>
      </div>
    </div>
    <!--分割线-->
    <el-divider content-position="left">订单</el-divider>
    <!--表格-->
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="60">
      </el-table-column>
      <el-table-column
        prop="orderNo"
        label="订单编号"
        width="200">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="订单时间"
        width="200">
      </el-table-column>
      <el-table-column
        prop="name"
        label="油品名称">
      </el-table-column>
      <el-table-column
        prop="gasPrice"
        label="油品价格">
      </el-table-column>
      <el-table-column
        prop="gasAmount"
        label="加油升数">
      </el-table-column>
      <el-table-column
        prop="totalMoney"
        label="总金额(元)">
      </el-table-column>
      <el-table-column
        prop="reduceMoney"
        label="优惠金额(元)">
      </el-table-column>
      <el-table-column
        prop="realMoney"
        label="实付金额(元)">
      </el-table-column>
    </el-table>
    <pagination
      :total-elements="totalElements"
      :change-callback="getOrderList"
      ref="orderList"></pagination>
    <!--模态框-->
    <template>
      <!--油品设置-->
      <el-dialog
        title="油品价格设置"
        :visible.sync="gasSkuPriceVisible"
        width="576px"
        :before-close="gasSkuPriceClose">
        <div>
          <el-form :model="gasSkuPriceForm" ref="gasSkuPriceForm" :rules="gasSkuPriceRules" label-width="120px"
                   label-suffix="：">
            <el-form-item label="0#柴油" prop="gas0">
              <el-input-number v-model="gasSkuPriceForm.gas0" class="input-width" :step="0.01" :precision="2"
                               :min="0.00"
                               :max="999999999"></el-input-number>
            </el-form-item>
            <el-form-item label="92#汽油" prop="gas92">
              <el-input-number v-model="gasSkuPriceForm.gas92" class="input-width" :step="0.01" :precision="2"
                               :min="0.00"
                               :max="999999999"></el-input-number>
            </el-form-item>
            <el-form-item label="95#汽油" prop="gas95">
              <el-input-number v-model="gasSkuPriceForm.gas95" class="input-width" :step="0.01" :precision="2"
                               :min="0.00"
                               :max="999999999"></el-input-number>
            </el-form-item>
            <el-form-item label="98#汽油" prop="gas98">
              <el-input-number v-model="gasSkuPriceForm.gas98" class="input-width" :step="0.01" :precision="2"
                               :min="0.00"
                               :max="999999999"></el-input-number>
            </el-form-item>

          </el-form>

        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="gasSkuPriceClose">取 消</el-button>
          <el-button type="primary" @click="submitGasPriceBefore" :loading="btnLoading">保 存</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>

<script>
  import pagination from '@/components/pagination/index'

  import {
    getOrderList,
    getGasPrice,
    saveGasPrice
  } from '../api/gasStation'

  export default {
    name: "gasStation",
    components: {pagination},
    data() {
      return {
        loading: true,
        userType: '',//登录用户类型
        merchantId: '',

        btnLoading: false,

        searchDays: '0',//搜索天数
        searchForm: {
          days: [],
        },
        tableData: [],//列表
        totalElements: 0,

        gasSkuPriceVisible: false,
        gasSkuPriceForm: {
          id: '',
          gas0: 0,
          gas92: 0,
          gas95: 0,
          gas98: 0,
        },
        gasSkuPriceRules: {
          gas0: [
            {required: true, message: '必须输入单价', trigger: ['blur', 'change']}
          ],
          gas92: [
            {required: true, message: '必须输入单价', trigger: ['blur', 'change']}
          ],
          gas95: [
            {required: true, message: '必须输入单价', trigger: ['blur', 'change']}
          ],
          gas98: [
            {required: true, message: '必须输入单价', trigger: ['blur', 'change']}
          ],
        }
      }
    },
    mounted() {
      //获取用户类型
      this.userType = sessionStorage.getItem('userType');
      //获取用户ID
      this.merchantId = sessionStorage.merchantId;
      //默认搜索列表
      this.defaultSearch()
    },
    methods: {
      /**
       * 第一次默认查询
       */
      defaultSearch() {
        //设定7天日期//2
        this.searchDays = '0';
        this.changeDays(0)
      },
      /**
       *检查时间
       * 如果不对，则修改为里结束日期的前31天。
       */
      checkDataRange() {
        console.log(this.searchForm.days);
        if (this.searchForm.days == null) {
          this.$set(this.searchForm, 'days', []);
          return
        }
        let timestamp = (new Date()).getTime();
        let startTime = this.searchForm.days[0];
        let endTime = this.searchForm.days[1];
        if (endTime - startTime > 24 * 60 * 60 * 1000 * 90) {
          this.$message.error('前后时间不能超过90天');
          this.$set(this.searchForm.days, 0, timestamp - (24 * 60 * 60 * 1000 * 90));
          this.$set(this.searchForm.days, 1, timestamp)
        } else if (endTime > timestamp) {
          this.$message.error('日期不能大于当天');
          this.$set(this.searchForm.days, 1, timestamp)
        }
        this.refreshOrderList()
      },
      /**
       * 快捷方式修改日期
       * @param event 日期范围选项
       */
      changeDays: function (event) {
        let timestamp = (new Date()).getTime();
        // 0=7  1=15 2=30
        if (event == 0) {
          //当日0点
          this.$set(this.searchForm.days, 0, new Date(new Date().toLocaleDateString()).getTime() - (24 * 60 * 60 * 1000 * 6));
          this.$set(this.searchForm.days, 1, new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
        } else if (event == 1) {
          let startTime = new Date(new Date().toLocaleDateString()) - (24 * 60 * 60 * 1000 * 15);
          let endTime = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1;
          this.$set(this.searchForm.days, 0, startTime);
          this.$set(this.searchForm.days, 1, endTime)
        } else if (event == 2) {
          let startTime = new Date(new Date().toLocaleDateString()).getTime() - (24 * 60 * 60 * 1000 * 30);
          let endTime = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1;
          this.$set(this.searchForm.days, 0, startTime);
          this.$set(this.searchForm.days, 1, endTime)
        }
        this.refreshOrderList()
      },


      /**
       * 刷新订单列表
       */
      refreshOrderList: function () {
        this.loading=true
        setTimeout(()=>{
          this.$refs['orderList'].refresh()
        },200)
      },

      /**
       * 获取订单列表
       */
      getOrderList: function (pageNumber, pageSize) {
        let id = this.merchantId;
        let st = this.format(this.searchForm.days[0]) || '';
        let et = this.format(this.searchForm.days[1]) || '';
        console.log(pageNumber, pageSize, st, et);
        getOrderList(pageNumber, pageSize, id, st, et).then(res => {
          let data = res.obj;
          this.tableData = data.content;
          this.totalElements=data.totalElements

          this.loading=false
        }).catch(e => {

        })
      },

      /**
       * 油品设置模态框
       */
      gasSkuPriceOpen: function () {
        this.openFindPrice()

      },

      gasSkuPriceClose: function () {
        this.formReset();
        this.gasSkuPriceVisible = false
      },
      //回显数据
      openFindPrice: function () {
        let id = this.merchantId;
        getGasPrice(id).then(res => {
          let data = res.obj;
          if (data) {
            this.gasSkuPriceForm.id = data.id || '';
            this.gasSkuPriceForm.gas0 = data.gas0 || 0;
            this.gasSkuPriceForm.gas92 = data.gas92 || 0;
            this.gasSkuPriceForm.gas95 = data.gas95 || 0;
            this.gasSkuPriceForm.gas98 = data.gas98 || 0
          } else {
            for (let i in this.gasSkuPriceForm) {
              console.log(`gasSkuPriceForm的${i}重新赋值0`);
              this.gasSkuPriceForm[i] = 0
            }
          }
          this.gasSkuPriceVisible = true
        }).catch(e => {

        })
      },
      submitGasPriceBefore: function () {
        this.$refs['gasSkuPriceForm'].validate((valid) => {
          if (valid) {
            this.submitGasPrice()
          } else {
            this.$message.error('还有未正确填写的内容');
            return false;
          }
        });
      },
      //提交数据
      submitGasPrice: function () {
        this.btnLoading = true;
        let form = JSON.parse(JSON.stringify(this.gasSkuPriceForm));
        form.merchantId = this.merchantId;
        console.log(form);
        saveGasPrice(form).then(res => {
          this.$message.success(`${res.msg}`);
          setTimeout(() => {
            this.btnLoading = false
          });
          this.gasSkuPriceClose()
        }).catch(e => {
          this.btnLoading = false
        })
      },

      formReset: function () {
        this.$refs['gasSkuPriceForm'].resetFields()
      },


      /**
       * 工具
       */
      //时间格式化
      format(ts) {
        let time = new Date(ts);
        let y = time.getFullYear();
        let m = time.getMonth() + 1;
        let d = time.getDate();
        let hour = time.getHours();
        let minute = time.getMinutes();
        let second = time.getSeconds();
        // return y + '-' + this.add0(m) + '-' + this.add0(d)
        return `${y}-${this.add0(m)}-${this.add0(d)} ${this.add0(hour)}:${this.add0(minute)}:${this.add0(second)}`
      },
      /**
       * 补充0
       * @param  m 月和日，补齐2位
       * @returns {string} 补齐2二位后的时间
       */
      add0(m) {
        return m < 10 ? '0' + m : m
      },
    }
  }
</script>

<style lang="scss" scoped>

  .block {
    display: inline-block;
    vertical-align: middle;
  }

  .search_bar {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }


  .input-width {
    width: 360px;
  }


</style>
