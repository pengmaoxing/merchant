<template>
  <div class="app-container" v-loading="loading">

    <el-tabs v-model="tabsNum" @tab-click="changeTabs">
      <!-- 分页一 -->
      <el-tab-pane label="营销列表" name="1">
        <!--搜索条件-->
        <div class="search_header">
          <div class="block">
            <el-input v-model="couponSearchForm.name" placeholder="卡券名称" size="small"></el-input>
          </div>
          <div class="block">
            <el-select v-model="couponSearchForm.actStatus" placeholder="请选择活动状态" size="small">
              <el-option label="未开始" value="1"></el-option>
              <el-option label="进行中" value="2"></el-option>
              <el-option label="已结束" value="3"></el-option>
            </el-select>
          </div>
          <div class="block">
            <el-button type="primary" size="small" @click="submitSearchByList">查 询</el-button>
          </div>
          <div class="block">
            <el-button type="" size="small" @click="resetSearchByList">重 置</el-button>
          </div>
          <div class="block" style="float: right">
            <el-button type="primary" size="small" @click="goCreateCoupon">创建新卡券</el-button>
          </div>

        </div>

        <!--分割线-->
        <el-divider content-position="left">卡券列表</el-divider>

        <!--表格-->
        <div style="cursor: default">
          <el-table
            :data="couponTable"
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              label="卡券名称">
              <template slot-scope="scope">
                <el-button type="text" @click="goCouponDetail(scope.row)">{{scope.row.name}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="可领取时间">
              <template slot-scope="scope">
                <span>{{scope.row.actTimeStart|daysFil}}至{{scope.row.actTimeEnd|daysFil}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="卡券价值">
              <template slot-scope="scope">
                <template v-if="scope.row.miniExpendLimit===0">
                  满任意金额抵 {{scope.row.money}} 元
                </template>
                <template v-else-if="scope.row.miniExpendLimit>0">
                  满 {{scope.row.miniExpendLimit}} 元抵 {{scope.row.money}} 元
                </template>
              </template>
            </el-table-column>
            <el-table-column
              label="已领取/总发放（张）">
              <template slot-scope="scope">
                {{scope.row.changeInventory}} / {{scope.row.totalInventory|totalInventoryFil}}
                <i class="el-icon-edit bluetext point_cur"
                   v-if="scope.row.totalInventory!=99999999"
                   @click="editInventoryOpen(scope.row)"></i>
              </template>
            </el-table-column>
            <el-table-column
              label="状态">
              <template slot-scope="scope">
                {{scope.row.actStatus|actStatusFil}}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="100px">
              <template slot-scope="scope">
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link point_cur">
                      操 作<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                  <el-dropdown-menu slot="dropdown">
                    <!--需要状态判断-->
                    <el-dropdown-item @click.native="goCouponDetail(scope.row)">查 看</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.actStatus==2" @click.native="promotionOpen(scope.row)">推 广
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="copyCoupon(scope.row.id)">复 制</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.actStatus==2" @click.native="endsEarly(scope.row)">提前结束
                    </el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.actStatus==3" @click.native="deleteCoupon(scope.row)">删 除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            :total-elements="couponTableTotalElement"
            :change-callback="getCouponList"
            ref="page"></pagination>
        </div>


      </el-tab-pane>
      <!-- 分页二 -->
      <el-tab-pane label="营销分析" name="2">
        <div class="search_header">
          <div class="block">
            <el-select v-model="couponAnalysisName" size="small" filterable placeholder="按卡券名搜索">
              <el-option
                v-for="item in couponAnalysisNameOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <!--<el-input size="small" v-model="couponAnalysisName" placeholder=""></el-input>-->
          </div>
          <div class="block" style="margin-left: 10px">
            <el-button size="small" type="primary" @click="couponAnalysisSubmit">查询</el-button>
          </div>
          <div class="block">
            <span class="tips">* 活动数据统计从开始时间至当前时间，如活动已结束则统计到截止时间</span>
          </div>
        </div>
        <!--卡片数据显示-->
        <div>
          <div class="card_group">
            <div class="card_item">
              <el-card class="box-card">
                <div class="text item tools_box">
                  <div class="tools_img">
                    <img src="../../../assets/images/member/投放张数.png" alt="">
                  </div>
                  <div class="tools_text">
                    <p>投放张数</p>
                    <p>{{couponAnalysisData.totalNum||0}}</p>
                  </div>
                </div>
              </el-card>
            </div>
            <div class="card_item">
              <el-card class="box-card">
                <div class="text item tools_box">
                  <div class="tools_img">
                    <img src="../../../assets/images/member/领取张数.png" alt="">
                  </div>
                  <div class="tools_text">
                    <p>领取张数</p>
                    <p>{{couponAnalysisData.receiveNum||0}}</p>
                  </div>
                </div>
              </el-card>
            </div>
            <div class="card_item">
              <el-card class="box-card">
                <div class="text item tools_box">
                  <div class="tools_img">
                    <img src="../../../assets/images/member/验券张数.png" alt="">
                  </div>
                  <div class="tools_text">
                    <p>验券张数</p>
                    <p>{{couponAnalysisData.usedNum||0}}</p>
                  </div>
                </div>
              </el-card>
            </div>
          </div>

          <div class="card_group">
            <div class="card_item">
              <el-card class="box-card">
                <div class="text item tools_box">
                  <div class="tools_img">
                    <img src="../../../assets/images/member/带动消费.png" alt="">
                  </div>
                  <div class="tools_text">
                    <p>带动消费</p>
                    <p>￥{{couponAnalysisData.orderTotalMoney||0}}</p>
                  </div>
                </div>
              </el-card>
            </div>
            <div class="card_item">
              <el-card class="box-card">
                <div class="text item tools_box">
                  <div class="tools_img">
                    <img src="../../../assets/images/member/抵用金额.png" alt="">
                  </div>
                  <div class="tools_text">
                    <p>抵用金额</p>
                    <p>￥{{couponAnalysisData.preferentialMoney||0}}</p>
                  </div>
                </div>
              </el-card>
            </div>
            <div class="card_item">
              <el-card class="box-card">
                <div class="text item tools_box">
                  <div class="tools_img">
                    <img src="../../../assets/images/member/转化率.png" alt="">
                  </div>
                  <div class="tools_text">
                    <p>转化率</p>
                    <p>{{couponAnalysisData.conversion||0}}</p>
                  </div>
                </div>
              </el-card>
            </div>
          </div>

        </div>

        <el-divider content-position="left">图表</el-divider>

        <!--图表-->
        <div>
          <el-row :gutter="20">
            <!--左侧-->
            <el-col :span="12">
              <div>
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>卡券领取张数折线图</span>
                  </div>
                  <div id="couponNumChart" class="chart"
                       v-loading="couponDataChartNull"
                       element-loading-text="没有数据"
                       element-loading-spinner="el-icon-view"
                       element-loading-background="rgba(255, 255, 255,.8)"
                  ></div>
                </el-card>
              </div>
            </el-col>
            <!--右侧-->
            <el-col :span="12">
              <div>
                <!--第一行-->
                <el-card class="box-card" style="margin-bottom: 5px">
                  <div slot="header" class="clearfix">
                    <span>活动拉新效果</span>
                  </div>
                  <div class="datatable">

                    <table>
                      <tr>
                        <td>
                          拉新人数占比
                          <el-tooltip class="item" effect="light" content="领券的消费者首次在商户店铺消费的用户" placement="top">
                            <i class="el-icon-info"></i>
                          </el-tooltip>
                        </td>
                        <td>{{couponAnalysisData.newNum||0}}人</td>
                        <td>占{{(couponAnalysisData.newAccountedFor*100)||0}}%</td>
                      </tr>
                      <tr>
                        <td>
                          回头客人数占比
                          <el-tooltip class="item" effect="light" content="领券的消费者曾经在商户店铺消费的用户" placement="top">
                            <i class="el-icon-info"></i>
                          </el-tooltip>
                        </td>
                        <td>{{couponAnalysisData.repeatCustomersNum||0}}人</td>
                        <td>占{{(couponAnalysisData.repeatAccountedFor*100)||0}}%</td>
                      </tr>
                      <tr>
                        <td>
                          挽回流失人数占比
                          <el-tooltip class="item" effect="light" content="领券的消费者3个月内部曾再到商户店铺消费的用户" placement="top">
                            <i class="el-icon-info"></i>
                          </el-tooltip>
                        </td>
                        <td>{{couponAnalysisData.saveLoseNum||0}}人</td>
                        <td>占{{(couponAnalysisData.saveAccountedFor*100)||0}}%</td>
                      </tr>
                    </table>

                  </div>
                </el-card>
                <!--第二行-->
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>活动留存效果</span>
                  </div>
                  <div class="datatable">
                    <table>
                      <tr>
                        <td>
                          7天内
                          <el-tooltip class="item" effect="light" content="核销会员在7天内再次回头消费" placement="top">
                            <i class="el-icon-info"></i>
                          </el-tooltip>
                        </td>
                        <td>{{couponAnalysisData.sevenDayNum}}人</td>
                        <td>占{{(couponAnalysisData.sevenConversion*100)||0}}%</td>
                      </tr>
                      <tr>
                        <td>
                          1月内
                          <el-tooltip class="item" effect="light" content="核销会员在1月内再次回头消费" placement="top">
                            <i class="el-icon-info"></i>
                          </el-tooltip>
                        </td>
                        <td>{{couponAnalysisData.oneMonthNum}}人</td>
                        <td>占{{(couponAnalysisData.oneMonthConversion*100)||0}}%</td>
                      </tr>
                      <tr>
                        <td>
                          3月内
                          <el-tooltip class="item" effect="light" content="核销会员在3月内再次回头消费" placement="top">
                            <i class="el-icon-info"></i>
                          </el-tooltip>
                        </td>
                        <td>{{couponAnalysisData.threeMonthNum}}人</td>
                        <td>占{{(couponAnalysisData.threeMonthConversion*100)||0}}%</td>
                      </tr>
                    </table>

                  </div>
                </el-card>
              </div>
            </el-col>

          </el-row>
        </div>


      </el-tab-pane>
    </el-tabs>


    <!--编辑库存模态框-->
    <el-dialog
      title="修改卡券库存"
      :visible.sync="editInventoryVisible"
      width="576px"
      :before-close="editInventoryClose">
      <div>
        <el-form label-width="160px" :model="editForm">
          <el-form-item label="卡券名称：">
            <span>{{editTmpTitle}}</span>
          </el-form-item>
          <el-form-item label="增减选择：">
            <el-radio v-model="editForm.mode" label="1">减少库存</el-radio>
            <el-radio v-model="editForm.mode" label="2">增加库存</el-radio>
          </el-form-item>
          <el-form-item label="库存：">
            <template v-if="editForm.mode=='1'">减少</template>
            <template v-if="editForm.mode=='2'">增加</template>
            <el-input-number v-model="editForm.num" :precision="0" :step="1" :min="0" :max="99999"
                             size="small"></el-input-number>
            <span>件</span>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editInventoryClose">取 消</el-button>
    <el-button type="primary" @click="editInventorySubmit">确 定</el-button></span>
    </el-dialog>

    <!--推广模态框-->
    <el-dialog
      title="推广物料下载"
      :visible.sync="promotionVisible"
      width="576px"
      :before-close="promotionClose">
      <div class="qr-box">
        <img :src="getQR(promotionQR)" width="400" height="400" alt="">
      </div>
      <span slot="footer" class="dialog-footer">
        <!--<a :href="getQR(promotionQR)" download="qrcode.png">下载二维码</a>-->
    <el-button type="primary" @click="promotionDownLoad">右键图片另存为</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import pagination from '@/components/pagination/index'
  import {url} from '@/utils/request'
  import {
    findCouponList,
    modifyCouponStock,
    overCoupon,
    deleteCoupon,
    getQrCode,
    getCouponAnalysis,
    findCouponNameList
  } from '../api/coupon'

  const waitTime = Math.random().toFixed(0) * 500 + 400;
  export default {
    name: 'couponMarketing',
    components: {pagination},
    data() {
      return {
        loading: true,
        tabsNum: '1',
        couponAnalysisNameOptions: [],
        couponSearchForm: {
          name: '',
          actStatus: '',
        },
        couponTable: [],
        couponTableTotalElement: 0,
        //修改库存模态框
        editInventoryVisible: false,//修改库存模态框
        editTmpTitle: '',//混合标题
        editForm: {
          id: '',
          mode: '2',
          num: 0,
          now: 0,
        },//编辑表单
        promotionQR: '',
        promotionVisible: false,//推广模态框
        //图表
        couponDataChartNull: true,//图表数据为空

        //------------------------------
        couponAnalysisName: '',//需要搜索的卡券名称
        couponAnalysisData: {}, //卡券详细数据

      }
    },
    filters: {
      //日期分割
      daysFil: function (val) {
        let day = val.split(' ')[0];
        return day
      },
      //不限量过滤
      totalInventoryFil: function (val) {
        if (val == 99999999) {
          return '不限制'
        } else {
          return val
        }
      },
      //卡券状态
      actStatusFil: function (val) {
        let v = parseInt(val);
        let txt = '';
        switch (v) {
          case 1:
            txt = '未开始';
            break;
          case 2:
            txt = '进行中';
            break;
          case 3:
            txt = '已结束';
            break;
          default:
            txt = '未知';
            break
        }
        return txt
      }

    },
    mounted() {
      this.changeTabs();
      this.getNameList();
    },
    methods: {
      /**
       * **************************营销列表*****************************
       */
      /**
       * 切换标签页
       */
      changeTabs: function () {
        let tn = this.tabsNum;
        if (tn == '1') {
          this.resetSearchByList(); //重置条件
          this.submitSearchByList()
        } else if (tn == '2') {

        }

      },
      /**
       * 提交搜索
       */
      submitSearchByList: function () {
        this.getCouponList(1, 10)
      },

      /**
       * 重置搜索条件
       */
      resetSearchByList: function () {
        this.couponSearchForm = {
          name: '',
          actStatus: '',
        }
        this.submitSearchByList()
      },
      /**
       * 获取列表
       */
      getCouponList: function (pageNum, pageSize) {
        // console.log('翻页')
        let form = this.couponSearchForm;
        findCouponList(pageNum, pageSize, form).then(res => {
          let data = res.obj;
          this.couponTable = data.content;
          this.couponTableTotalElement = data.totalElements;
          this.loading = false
        }).catch(e => {
          this.$message.error('获取列表失败' + e)
        })
      },
      /**
       * 查看卡券详情
       */
      goCouponDetail: function (data) {
        let id = data.id;
        this.$router.push({path: '/couponMarketing/couponDetail', query: {id: id}})
        // console.log(data)
      },
      /**
       * 打开修改库存模态框
       */
      editInventoryOpen: function (data) {
        // console.log(data)
        this.editTmpTitle = data.name;
        this.editForm.id = data.id;
        this.editForm.now = data.totalInventory;
        this.editInventoryVisible = true
      },
      /**
       * 关闭修改库存模态框
       */
      editInventoryClose: function () {
        this.editTmpTitle = '';
        this.editInventoryReset();
        this.editInventoryVisible = false
      },
      /**
       * 修改库存提交编辑
       */
      editInventorySubmit: function () {

        let data = this.editForm;
        // console.log(data)
        let result = 0; //最后结果
        //判断增加还是减少，根据库存量做增减计算。
        if (data.mode == 1) {
          result = data.now - data.num  //减去
        } else if (data.mode == 2) {
          result = parseInt(data.now) + parseInt(data.num) //增加
        }
        modifyCouponStock(data.id, result).then(res => {
          this.editInventoryClose();
          this.$refs.page.refresh()
        }).catch(e => {
          this.$message.error('修改失败' + e)
        })
      },
      /**
       *修改库存重置表单
       */
      editInventoryReset: function () {
        this.editForm = {
          id: '',
          mode: '2',
          num: 0,
          now: 0
        }
      },
      /**
       * 提前结束对话框
       */
      endsEarly: function (data) {
        // console.log(data)
        this.$confirm('确定提前结束吗？', '提前结束卡券', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          type: 'warning'
        }).then(() => {
          let id = data.id; //活动/商品ID
          // console.log(id)
          this.endsEarlySubmit(id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })

        })
      },
      /**
       * 提交提前结束
       */
      endsEarlySubmit: function (id) {
        this.loading = true;
        let that = this;  //deep 复制当前this对象
        setTimeout(function () {
          overCoupon(id, 1, 3).then(res => {
            that.$message.success('提前结束成功');
            that.$refs.page.refresh()
          }).catch(e => {
            that.$message.error('结束活动失败' + e)
          })
        }, waitTime)

      },

      /**
       * 询问是否删除
       */
      deleteCoupon: function (data) {
        // console.log(data)
        this.$confirm('确定删除吗？', '删除卡券', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          type: 'warning'
        }).then(() => {
          let id = data.id; //活动/商品ID
          this.submitDeleteCoupon(id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })

        })
      },

      /**
       * 提交删除卡券
       */
      submitDeleteCoupon: function (id) {
        this.loading = true;
        let that = this;  //deep 复制当前this对象
        setTimeout(function () {
          //执行删除
          //使用that
          deleteCoupon(id).then(res => {
            that.$message.success('删除成功');
            that.$refs.page.refresh();
          }).catch(e => {
            that.$message.error('删除失败' + e)
          });
          that.loading = false
        }, waitTime)
      },

      /**
       * 打开推广模态框
       */
      promotionOpen: function (data) {
        // this.$message.success('敬请期待')
        let id = data.id;
        getQrCode(id).then(res => {
          this.promotionQR = res.obj
        }).catch(e => {

        });
        this.promotionVisible = true
      },

      /**
       * 推广二维码图片
       */
      getQR: function (val) {
        if (val == '' || val == null) {
          return ''
        } else {
          let txt = url + '/resource/' + val;
          return txt
        }

      },

      /**
       * 关闭推广模态框
       */
      promotionClose: function () {
        this.promotionVisible = false
      },
      /**
       * 推广模态框下载
       */
      promotionDownLoad: function () {
        // console.log('下载')
        // window.location = this.getQR(this.promotionQR)
      },

      /**
       * 复制卡券
       */
      copyCoupon: function (id) {
        this.$router.push({path: '/couponMarketing/createCoupon', query: {id: id}},)
      },

      /**
       *前往创建卡券
       */
      goCreateCoupon: function (data) {
        this.id = data.id;
        this.$router.push({path: '/couponMarketing/createCoupon'},)
      },

      /**
       * **************************营销分析*****************************
       */

      getNameList: function () {
        findCouponNameList().then(res => {
          let data = res.obj
          this.couponAnalysisNameOptions = data
        }).catch(e => {

        })
      },


      /**
       * 提交搜索
       */
      couponAnalysisSubmit: function () {
        let temp = this.couponAnalysisName;
        let name = '';
        if (temp == '' || temp == null) {
          this.$message.error('还没有输入卡券名称');
          return false
        } else {
          name = temp.trim();
          this.couponAnalysisName = name //去除空格的关键词
        }
        getCouponAnalysis(name).then(res => {
          let data = res.obj;
          this.couponAnalysisData = data;
          this.drawcouponAnalysisChart(data.newNumber, data.time)
        }).catch(e => {
          this.$message('没有这个卡券的数据')
        })
      },

      /**
       * 生成图表
       */
      drawcouponAnalysisChart: function (mem, time) {
        if (mem.length == 0 && time.length == 0) {
          this.couponDataChartNull = true;
          return
        }
        this.couponDataChartNull = false;
        let count = mem;
        let days = time;
        var chart = this.$echarts.init(document.getElementById('couponNumChart'));
        chart.setOption({
          // title: {text: '商户统计', textStyle: {color: '#333', fontWeight: 'lighter', fontSize: '16'}},
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} @ {c} ',
          },
          // legend: {
          //   data: ['新增会员量', '会员总量']
          // },
          toolbox: {
            feature: {
              magicType: {
                type: ['line', 'bar']
              },
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: days
          },//X轴标题
          yAxis: {
            type: 'value'
          },
          series: [{
            data: count,
            name: '卡券领取张数',
            type: 'line',
            smooth: true,
            areaStyle: {}
          }] //数据数组，多个数据，legend需要对于标题name
        })
      },

      /**
       * 拉新效果
       */
      newMemberTable: function () {

      },
      /**
       * 留存效果
       */
      retainMemberTable: function () {

      },
    }
  }
</script>

<style scoped>
  /*Public*/
  .block {
    display: inline-block;
    vertical-align: middle;
  }

  .tips {
    font-size: 14px;
    color: #409eff;

  }

  .search_header {

  }

  .bluetext {
    color: #409eff;
  }

  .point_cur {
    cursor: pointer;
  }

  /*卡片*/
  .card_group {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
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

  .chart {
    width: 100%;
    height: 300px;
  }

  .datatable {
    height: 99px
  }

  .datatable table {
    width: 100%;
    height: 100%;
  }

  .datatable table tr {
    height: 33%;
    font-size: 14px;
    color: #808080;
  }

  .datatable table tr:hover {
    cursor: default;
    background-color: #f8f8f8;
    color: #404040;
    font-weight: bold;
  }

  .datatable table tr td:nth-child(1) {
    width: 60%;
  }

  .qr-box {
    text-align: center;
  }

  @media (max-width: 1500px) {
    .card_item {
      width: 30%;
    }
  }

  @media (max-width: 1024px) {
    .card_item {
      width: 30%;
    }
  }

  @media (max-width: 768px) {

    .tools_img {
      display: none;
    }

    .tools_text {
      width: 100%;
      text-align: center;
    }
  }

</style>
