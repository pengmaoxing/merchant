<template>
  <!--合并于储值记录-->
  <div class="app-container" v-loading="loading">
    <el-card class="box-card">
      <!--搜索-->
      <div class="search_header_bar">
        <div>
          <!--搜索条件表单-->
          <div class="block">
            <el-input v-model="searchForm.number" size="medium" placeholder="交易单号/手机号"
                      style="width: 150px"></el-input>
          </div>
          <div class="block">
            <el-input v-model="searchForm.cashier" size="medium" placeholder="收银员"
                      style="width: 150px"></el-input>
          </div>
          <div class="block">
            <el-select v-model="searchForm.storeId" size="medium" placeholder="交易门店"
                       style="width: 150px"
                       v-if="userType==1">
              <el-option
                v-for="item in storeOption"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="block">
            <el-select v-model="searchForm.payWay" size="medium" placeholder="支付方式"
                       style="width: 150px">
              <el-option
                v-for="item in payOption"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <!--日期-->
          <div class="block">
            <div class="block">
              <el-date-picker
                v-model="searchForm.startTime"
                type="date"
                size="medium"
                placeholder="开始日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="timestamp"
                style="width: 190px">
              </el-date-picker>
              至
              <el-date-picker
                v-model="searchForm.endTime"
                type="date"
                size="medium"
                placeholder="结束日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="timestamp"
                style="width: 190px">
              </el-date-picker>
            </div>
          </div>

          <!--按钮-->
          <div class="block" style="margin-left: 10px">
            <el-button size="medium" type="primary" @click="submitSearch">查 询</el-button>
            <el-button size="medium" type="" @click="reset">重 置</el-button>
            <el-button size="medium" type="" @click="exportTable">导 出</el-button>
          </div>
        </div>
        <div style="margin-top: 10px">
          <div class="block">
            <el-radio-group v-model="dayRange" size="medium" @change="changeDays">
              <el-radio-button label="0">今日</el-radio-button>
              <el-radio-button label="1">昨日</el-radio-button>
              <el-radio-button label="2">近7日</el-radio-button>
              <el-radio-button label="3">近1月</el-radio-button>
            </el-radio-group>
          </div>
        </div>

      </div>
      <!--卡片-->
      <div class="card_group">
        <!--消费金额-->
        <div class="card_item">
          <el-card class="box-card">
            <div class="text item tools_box">
              <div class="tools_img">
                <img src="../../../assets/images/member/消费金额.png" alt="">
              </div>
              <div class="tools_text">
                <p>消费金额
                  <el-tooltip class="item" effect="light" content="会员消费流水的金额之和。" placement="top-start">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </p>
                <p>15</p>
              </div>
            </div>
          </el-card>
        </div>
        <!--会员优惠-->
        <div class="card_item">
          <el-card class="box-card">
            <div class="text item tools_box">
              <div class="tools_img">
                <img src="../../../assets/images/member/会员优惠.png" alt="">
              </div>
              <div class="tools_text">
                <p>会员优惠
                  <el-tooltip class="item" effect="light" content="消费记录中享受会员优惠金额之和（目前仅有优惠券）" placement="top-start">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </p>
                <p>50</p>
              </div>
            </div>
          </el-card>
        </div>
        <!--扣款金额-->
        <div class="card_item">
          <el-card class="box-card">
            <div class="text item tools_box">
              <div class="tools_img">
                <img src="../../../assets/images/member/扣款金额.png" alt="">
              </div>
              <div class="tools_text">
                <p>扣款金额
                  <el-tooltip class="item" effect="light" content="使用会员储值卡支付的交易流水扣款金额之和。" placement="top-start">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </p>
                <p>15</p>
              </div>
            </div>
          </el-card>
        </div>
        <!--退款金额-->
        <div class="card_item">
          <el-card class="box-card">
            <div class="text item tools_box">
              <div class="tools_img">
                <img src="../../../assets/images/member/退款金额.png" alt="">
              </div>
              <div class="tools_text">
                <p>退款金额
                  <el-tooltip class="item" effect="light" content="使用会员储值卡支付的流水单，退款后金额之和" placement="top-start">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </p>
                <p>50</p>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <!--分割线-->
      <el-divider></el-divider>
      <!--表格-->

      <div>
        <!--表格-->
        <el-table
          :data="transTable"
          style="width: 100%">
          <el-table-column
            type='index'
            label="序号"
            width="60">
          </el-table-column>
          <el-table-column
            prop="storedNum"
            label="交易单号"
            width="180px">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="交易时间">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号">
          </el-table-column>
          <el-table-column
            prop="tradeTypeText"
            label="交易类型">
          </el-table-column>
          <el-table-column
            prop="tradingMoney"
            label="交易金额">
          </el-table-column>
          <el-table-column
            prop="giftMoney"
            label="赠送金额">
          </el-table-column>
          <el-table-column
            prop="postTradingMoney"
            label="交易后余额">
          </el-table-column>
          <el-table-column
            prop="operationUser"
            label="操作人">
          </el-table-column>
          <el-table-column
            prop="payWayText"
            label="支付方式">
          </el-table-column>
          <el-table-column
            prop="sourceText"
            label="来源">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="goDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total-elements="transTableTotalElement"
          :change-callback="getTransList"
          ref="page"></pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  import pagination from '@/components/pagination/index'
  import {
    findOrderPayWayOption,
    findStoreOption,
    findRecordList
  } from '../api/purchaseHistory'

  export default {
    name: 'purchaseHistory',
    components: {pagination},
    data () {
      return {
        loading: false,
        dayRange: '0',
        userType: 1,
        searchForm: {
          number: '',
          cashier: '',
          storeId: '',
          payWay: '',
          startTime: '',
          endTime: '',
        },//搜索条件
        storeOption: [],
        payOption: [],
        //表格
        transTable: [
          {
            orderNum: '123456789',
            phone: '18950000000',
            amount: '100.00',
            discount: '20.00',
            actual: '80.00',
            payStatus: '1',
            payWay: '1',
            store: '戴尔',
          }
        ],
        transTableTotalElement: 0,

      }
    },
    mounted () {
      //获取用户类型
      this.userType = sessionStorage.getItem('userType') || 3

      //设置默认日期
      this.changeDays()

      //获取列表
      this.getTransList()

      //用户类型不同 操作不同
      if (this.userType == 1) {
        this.getStoreOptionList()
        this.getPayWayOptionList()
      } else {
        this.getPayWayOptionList()
      }

    },
    methods: {
      /**
       * 获取交易门店Option
       */
      getStoreOptionList: function () {
        findStoreOption().then(res => {
          let data = res.obj
          this.storeOption = data
        }).catch(e => {

        })
      },

      /**
       * 获取支付方式Option
       */
      getPayWayOptionList: function () {
        findOrderPayWayOption().then(res => {
          let data = res.obj
          this.payOption = data
        }).catch(e => {

        })
      },

      /**
       * 修改日期范围
       */
      changeDays: function () {
        let timestamp = (new Date()).getTime()
        let range = this.dayRange
        this.searchForm.startTime = ''
        this.searchForm.endTime = ''
        if (range == '0') {
          this.searchForm.startTime = timestamp
          this.searchForm.endTime = timestamp
        } else if (range == '1') {
          this.searchForm.startTime = (timestamp - (60 * 60 * 24 * 1000))
          this.searchForm.endTime = (timestamp - (60 * 60 * 24 * 1000))
        } else if (range == '2') {
          this.searchForm.startTime = (timestamp - (60 * 60 * 24 * 1000 * 6))
          this.searchForm.endTime = timestamp
        } else if (range == '3') {
          this.searchForm.startTime = (timestamp - (60 * 60 * 24 * 1000 * 30))
          this.searchForm.endTime = timestamp
        }

        //this.$message('日期选项已回到今日')
      },
      /**
       * 提交搜索
       */
      submitSearch: function () {
        this.getTransList(1, 10)
      },
      /**
       * 获取列表
       */
      getTransList: function (pageNum, pageSize) {
        let form = this.searchForm
        let data = this.deepCopy(form)
        data.startTime = this.format(data.startTime)
        data.endTime = this.format(data.endTime)

        findRecordList(pageNum, pageSize, data).then(res => {
          let data = res.obj
          this.transTable = data.content
          this.transTableTotalElement = data.totalElements
          this.loading = false
        }).catch(e => {

        })

      },

      /**
       * 前往详情
       */
      goDetail: function (row) {
        let data = row.orderNum
        if (data === '' || data == null || data == undefined) {
          this.$message.error('没有卡号')
        } else {
          this.$router.push({path: '/member/views/purchaseDetail', query: {id: data}})
        }
      },

      /**
       * reset 重置搜索
       */
      reset: function () {
        this.searchForm = {
          number: '',
          cashier: '',
          storeId: '',
          payWay: '',
          startTime: '',
          endTime: '',
        }
        this.changeDays()
        //列表搜索
      },
      /**
       * 导出
       */
      exportTable: function () {
        this.$message('敬请期待')
      },

      /**
       * 深拷贝 防止对象污染用的
       */
      deepCopy: function (obj) {
        var result = Array.isArray(obj) ? [] : {}
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
              result[key] = this.deepCopy(obj[key])   //递归
            } else {
              result[key] = obj[key]
            }
          }
        }
        return result
      },
      /**
       * @param ts 时间戳
       * @returns {string} 格式化事时间
       */
      //时间格式化
      format (ts) {
        let time = new Date(ts)
        let y = time.getFullYear()
        let m = time.getMonth() + 1
        let d = time.getDate()
        return y + '-' + this.add0(m) + '-' + this.add0(d)
      },

      /**
       * 补充0
       * @param  m 月和日，补齐2位
       * @returns {string} 补齐2二位后的时间
       */
      add0 (m) {
        return m < 10 ? '0' + m : m
      },
    }
  }
</script>

<style scoped>
  /*public*/
  .block {
    display: inline-block;
    vertical-align: middle;
  }

  .search_header_bar {

  }

  /*卡片*/
  .card_group {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
  }

  .card_item {
    padding: 0;
    width: 15%;
    max-width: 100%;
    margin: 20px 1% 0 1%;
  }


  .tools_box {
    padding: 0 0;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }


  .tools_img {
    width: 30%;
    text-align: left;
  }

  .tools_text {
    width: 70%;
    text-align: right;
  }

  .tools_text p {
    margin: 0;
    padding: 0;
    cursor: default;
  }

  .tools_text p:nth-child(1) {
    font-size: 12px;
    color: #888;
  }

  .tools_text p:nth-child(2) {
    padding: 5px 0 0 0;
    font-size: 20px;
    color: #3f3f3f;
  }

</style>
