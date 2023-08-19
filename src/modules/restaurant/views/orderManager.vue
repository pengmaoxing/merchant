<template>
  <div class="app-container" v-loading="loading">
    <!--搜索-->
    <div class="filter-container">
      <el-input
        style="width: 200px"
        type="tel"
        placeholder="订单号"
        v-model="queryList.orderNumber" @keyup.enter.native="search">
      </el-input>
      <el-select v-model="queryList.repastWay" placeholder="请选择">
        <el-option value="" label="全部订单"></el-option>
        <el-option value="1" label="堂食"></el-option>
        <el-option value="2" label="外带"></el-option>
        <el-option value="3" label="外卖"></el-option>
      </el-select>
      <el-date-picker
        v-model="searchTime"
        type="daterange"
        :clearable="false"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <!--<el-button icon="el-icon-data-line" class="right-btn" @click="exportReport">导出报表</el-button>-->
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
        prop="orderNumber"
        label="订单编号"
        width="200">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="下单时间"
        width="200">
      </el-table-column>
      <el-table-column
        label="桌号">
        <template slot-scope="scope">
          {{scope.row.deskName||'无'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="foodAmount"
        label="菜份数">
      </el-table-column>
      <el-table-column
        prop="cusAmount"
        label="用餐人数">
      </el-table-column>
      <el-table-column
        prop="tolMoney"
        label="订单金额(元)">
      </el-table-column>
      <el-table-column
        prop="refundMoney"
        label="退款金额(元)">
      </el-table-column>
      <el-table-column
        prop="actPayMoney"
        label="实付金额(元)">
      </el-table-column>
      <el-table-column
        prop="repastWayText"
        label="就餐方式">
        <template slot-scope="scope">

          <span v-if="scope.row.repastWayText==='外卖配送'">
            {{scope.row.repastWayText}}
             <el-popover
               placement="top-start"
               title="收货信息"
               width="200"
               trigger="hover">
               <div>餐具数量：{{scope.row.mealAmount}}</div>
               <div>收货人：{{scope.row.contact}}</div>
               <div>电话：{{scope.row.phone}}</div>
               <div>地址：{{scope.row.address}}</div>
                <el-button type="text" slot="reference">收货信息</el-button>
          </el-popover>
          </span>
          <span v-else-if="scope.row.repastWayText==='已配送'">
            {{scope.row.repastWayText}}
             <el-popover
               placement="top-start"
               title="收货信息"
               width="200"
               trigger="hover">
               <div>餐具数量：{{scope.row.mealAmount}}</div>
               <div>收货人：{{scope.row.contact}}</div>
               <div>电话：{{scope.row.phone}}</div>
               <div>地址：{{scope.row.address}}</div>
                <el-button type="text" slot="reference">收货信息</el-button>
          </el-popover>
          </span>
          <span v-else>{{scope.row.repastWayText}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column-->
      <!--prop="repastWayText"-->
      <!--label="就餐方式">-->
      <!--<template slot-scope="scope">-->
      <!--{{scope.row.repastWay|repastWayFil}}-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column
        prop="repastOrderStatusText"
        label="订单状态">
      </el-table-column>
      <el-table-column
        label="操作"
        width="230">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="showOrderDetailDialog(scope.row)">查看详情
          </el-button>
          <template>
            <el-button v-if="scope.row.repastOrderStatusText=='退款申请'"
                       size="mini"
                       type="success"
                       @click="refundOpen(scope.row)"
            >退款处理
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total-elements="totalElements"
      :change-callback="getOrderList"
      ref="page"></pagination>
    <!--设置默认分享活动样式模态框-->
    <el-dialog
      title="订单详情"
      :visible.sync="orderDetailDialog"
    >
      <el-form :model="orderDetail">
        <el-form-item label="订单状态" :label-width="formLabelWidth">
          <span>{{orderDetail.repastOrderStatusText}}</span>
        </el-form-item>
        <el-form-item label="订单编号" :label-width="formLabelWidth">
          <span>{{orderDetail.orderNumber}}</span>
        </el-form-item>
        <el-form-item label="下单时间" :label-width="formLabelWidth">
          <span>{{orderDetail.createTime||'未知'}}</span>
        </el-form-item>
        <el-form-item label="餐桌编号" :label-width="formLabelWidth">
          <span>{{orderDetail.deskName||'无'}}</span>
        </el-form-item>
        <el-form-item label="菜份数" :label-width="formLabelWidth">
          <span>{{orderDetail.foodAmount}}</span>
        </el-form-item>
        <el-form-item label="用餐人数" :label-width="formLabelWidth">
          <span>{{orderDetail.cusAmount}}</span>
        </el-form-item>

        <template v-if="orderDetail.repastWayText=='外卖配送'||orderDetail.repastWayText=='已配送'">
          <el-form-item label="收货人" :label-width="formLabelWidth">
            <span>{{orderDetail.contact}}</span>
          </el-form-item>
          <el-form-item label="联系方式" :label-width="formLabelWidth">
            <span>{{orderDetail.phone}}</span>
          </el-form-item>
          <el-form-item label="收货地址" :label-width="formLabelWidth">
            <span>{{orderDetail.address}}</span>
          </el-form-item>
          <el-form-item label="餐具数量" :label-width="formLabelWidth">
            <span>{{orderDetail.mealAmount}}</span>
          </el-form-item>
        </template>


        <el-form-item label="退款金额" :label-width="formLabelWidth">
          <span>{{orderDetail.refundMoney}}</span>
        </el-form-item>
        <el-form-item label="订单金额" :label-width="formLabelWidth">
          <span>{{orderDetail.tolMoney}}</span>
        </el-form-item>
        <el-form-item label="实付金额" :label-width="formLabelWidth">
          <span>{{orderDetail.actPayMoney}}</span>
        </el-form-item>
        <el-form-item label="退款金额" :label-width="formLabelWidth">
          <span>{{orderDetail.refundMoney}}</span>
        </el-form-item>
        <el-form-item label="就餐方式" :label-width="formLabelWidth">
          <span>{{orderDetail.repastWay | repastWayFil}}</span>
        </el-form-item>


        <el-table :data="orderItemList">
          <el-table-column property="foodName" label="菜品名称"></el-table-column>
          <el-table-column property="amount" label="数量"></el-table-column>
          <el-table-column property="unitPrice" label="单价"></el-table-column>
        </el-table>
      </el-form>
    </el-dialog>

    <!--退款-->
    <el-dialog
      title="退款操作"
      :visible.sync="refundVisible"
      width="576px"
      :before-close="refundClose">
      <div>
        <el-form label-width="120px">
          <el-form-item label="本单实际金额：">
            {{orderDetail.tolMoney}}元
          </el-form-item>
          <el-form-item label="同意退款金额：">
            <el-input-number v-model="refundForm.refundPayPrice"
                             :precision="2"
                             :step="0.01"
                             :min="0" :max="orderDetail.tolMoney"
                             label="描述文字"></el-input-number>
            元
            <el-button type="text" @click="allRefund">全额退款</el-button>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
    <el-button @click="refundClose">取 消</el-button>
    <el-button @click="rejectRefund" :loading="btnLoading">拒 绝</el-button>
    <el-button type="primary" @click="verifyRefund" :loading="btnLoading">同 意</el-button>
  </span>
    </el-dialog>


  </div>
</template>

<script>
  import {
    getOrderList,
    getOrderDetail,
    verifyRefund,
    rejectRefund
  } from '../api/orderManager'
  import pagination from '@/components/pagination/index'

  export default {
    components: {pagination},
    name: 'orderManager',
    data() {
      return {
        loading: false,
        btnLoading: false,
        totalElements: 0, // 数据条数
        queryList: {
          orderNumber: '',
          phone: '',
          repastWay: ''
        }, // 搜索数据
        orderDetail: {
          orderNumber: '',
          createTime: '',
          deskName: '',
          foodAmount: '',
          cusAmount: '',
          actPayMoney: '',
          refundMoney: '',
          tolMoney: '',
          repastWayText: '',
          repastOrderStatusText: '',
          address: '',
          contact: '',
          phone: '',
          mealAmount: 0,
        },
        orderItemList: [],
        orderItemListDialog: true,
        tableData: [], // 表格数据
        formLabelWidth: '120px',
        searchTime: '',
        options: [],
        orderDetailDialog: false,

        //退款
        refundVisible: false,
        refundForm: {
          orderId: '',
          refundPayPrice: 0,
        }


      }
    },
    filters: {
      repastWayFil: function (val) {
        if (val === '' || val == null) {
          return '未知'
        }
        let text = '';
        switch (parseInt(val)) {
          case 1:
            text = '堂食';
            break;
          case 2:
            text = '外带';
            break;
          default:
            text = '未知';
            break;
        }

        return text

      }
    },
    mounted() {
      this.initTime();
      this.getOrderList(1, 10)
    },
    methods: {
      /**
       * 导出报表
       */
      exportReport: function () {
        this.$message.info('开发中')
      },


      //时间初始化
      initTime() {
        let date = new Date();
        let date1 = new Date(date.getTime() + 1000 * 60 * 60 * 24);
        let end = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate();
        let lw = new Date(date - 1000 * 60 * 60 * 24 * 30);
        let lastY = lw.getFullYear();
        let lastM = lw.getMonth() + 1;
        let lastD = lw.getDate();
        let start = lastY + "-" + (lastM < 10 ? "0" + lastM : lastM) + "-" + (lastD < 10 ? "0" + lastD : lastD);
        this.searchTime = [start, end];
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /*
       * 获取订单列表
       * */
      getOrderList(number, pageSize) {
        this.loading = true;
        getOrderList(number, pageSize, this.queryList, this.searchTime[0], this.searchTime[1]).then(response => {
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
      //显示订单详情
      showOrderDetailDialog(row) {
        this.orderDetail.orderNumber = row.orderNumber;
        this.orderDetail.createTime = row.createTime;
        this.orderDetail.deskName = row.deskName;
        this.orderDetail.foodAmount = row.foodAmount;
        this.orderDetail.cusAmount = row.cusAmount;
        this.orderDetail.actPayMoney = row.actPayMoney;
        this.orderDetail.refundMoney = row.refundMoney;
        this.orderDetail.tolMoney = row.tolMoney;
        this.orderDetail.repastWay = row.repastWay;
        this.orderDetail.repastWayText = row.repastWayText;
        this.orderDetail.address = row.address;
        this.orderDetail.contact = row.contact;
        this.orderDetail.phone = row.phone;
        this.orderDetail.mealAmount = row.mealAmount;
        this.orderDetail.repastOrderStatusText = row.repastOrderStatusText;
        //获取订单详情

        getOrderDetail(row.orderId).then(response => {
          let data = response.obj;
          console.log('111' + data);
          this.orderItemList = data
        });
        this.orderDetail.money = row.money,
          this.orderDetail.actPayMoney = row.actPayMoney,
          this.orderDetailDialog = true
      },

      //退款
      refundOpen(scope) {
        this.orderDetail = scope;
        this.refundForm.orderId = scope.orderId;
        this.refundForm.refundPayPrice = scope.refundMoney;
        this.refundVisible = true
      },

      refundClose: function () {
        this.refundVisible = false
      },

      /**
       * 同意退款
       */
      verifyRefund: function () {
        let form = this.refundForm;
        this.btnLoading = true;
        verifyRefund(form).then(res => {
          this.$message.success('退款成功！');
          this.refundClose();
          this.$refs['page'].refresh();
          setTimeout(() => {
            this.btnLoading = false
          }, 500)

        }).catch(e => {
          setTimeout(() => {
            this.btnLoading = false
          }, 500)
        })
      },

      rejectRefund: function () {
        let id = this.refundForm.orderId;
        rejectRefund(id).then(res => {
          this.$message.success('已拒绝退款！');
          this.refundClose();
          this.$refs['page'].refresh();
          setTimeout(() => {
            this.btnLoading = false
          }, 500)
        }).catch(e => {
          setTimeout(() => {
            this.btnLoading = false
          }, 500)
        })
      },
      /**
       * 全额
       */
      allRefund: function () {
        this.$set(this.refundForm, 'refundPayPrice', this.orderDetail.tolMoney)
      },

      /*
      * 搜索
      * */
      search() {
        this.$refs.page.search()
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  body .el-table th.gutter {
    display: table-cell !important;
  }

  .dialog_body {
    width: 100%;
    height: 300px;
    overflow: auto
  }

  .dialog_body_data {
    padding: 10px;
  }

  .right-btn {
  }

  .el-date-editor .el-range-separator {
    font-size: 12px !important;
  }


</style>
