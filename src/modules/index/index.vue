<template>
  <div class="app-container" v-loading="loading">
    <!--卡片-->
    <div class="header_bar">
      <!--左边-->
      <div class="header_left">
        <!--左上-->
        <div class="header_left_top">
          <el-card class="box-card ">
            <div slot="header" class="clearfix">
              <span>数据总览</span>
            </div>
            <div class="text item totalData">

              <!--<div class="column_line"></div>-->
              <template>
                <div><img src="../../assets/images/index/路径 4803.png" alt=""></div>
                <div class="total_item">
                  <p class="total_title">今日订单总金额</p>
                  <p class="total_num"> {{cardData.todayOrderAmount || 0}}</p>
                </div>

                <div><img src="../../assets/images/index/路径 4801.png" alt=""></div>
                <div class="total_item">
                  <p class="total_title">今日订单数总数</p>
                  <p class="total_num"> {{cardData.todayOrderCount || 0}}</p>
                </div>

                <div><img src="../../assets/images/index/组 1004.png" alt=""></div>
                <div class="total_item">
                  <p class="total_title">今日客户实付</p>
                  <p class="total_num"> {{cardData.todayActAmount || 0}}</p>
                </div>


                <div><img src="../../assets/images/index/路径 4807.png" alt=""></div>

                <div class="total_item">
                  <p class="total_title">订单金额</p>
                  <p class="total_num"> {{cardData.orderAmount || 0}}</p>
                </div>

                <div><img src="../../assets/images/index/路径 4808.png" alt=""></div>

                <div class="total_item">
                  <p class="total_title">订单数总数</p>
                  <p class="total_num"> {{cardData.orderCount || 0}}</p>
                </div>

                <div><img src="../../assets/images/index/组 1006.png" alt=""></div>

                <div class="total_item">
                  <p class="total_title">新增会员</p>
                  <p class="total_num">{{cardData.newMember || 0}}</p>
                </div>

                <div><img src="../../assets/images/index/组 993.png" alt=""></div>
                <div class="total_item">
                  <p class="total_title">会员总量</p>
                  <p class="total_num">{{cardData.totalMember || 0}}</p>
                </div>
              </template>
            </div>
          </el-card>
        </div>
        <!--左下-->

      </div>
    </div>
    <!--底部大区-->
    <div class="bottom_box">
      <!--收款统计-->
      <el-card class="box-card chart_card_right" style="height:320px">
        <el-tabs class="right_tabs" v-model="receivablesActiveName" @tab-click="changeReceivablesTabs">
          <el-tab-pane label="周" name="0">
            <div id="orderChart0" class="chart_img"
                 v-loading="receivablesNull"
                 element-loading-text="没有数据"
                 element-loading-spinner="el-icon-view"
                 element-loading-background="rgba(255, 255, 255, 1)">
            </div>
          </el-tab-pane>
          <el-tab-pane label="月" name="1">
            <div id="orderChart1" class="chart_img"
                 v-loading="receivablesNull"
                 element-loading-text="没有数据"
                 element-loading-spinner="el-icon-view"
                 element-loading-background="rgba(255, 255, 255, 1)">
            </div>
          </el-tab-pane>
          <el-tab-pane label="季" name="2">
            <div id="orderChart2" class="chart_img"
                 v-loading="receivablesNull"
                 element-loading-text="没有数据"
                 element-loading-spinner="el-icon-view"
                 element-loading-background="rgba(255, 255, 255, 1)">
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <div class="region">
        <!-- 会员活动分析 -->
        <el-card class="box-card">
          <div id="right_chart" class="chart_img"
               v-loading="activeNull"
               element-loading-text="没有数据"
               element-loading-spinner="el-icon-view"
               element-loading-background="rgba(255, 255, 255, 1)"></div>
        </el-card>
      </div>

    </div>


    <div class="bottom_box">
      <!-- 支付方式 -->
      <el-card class="box-card chart_card">
        <div id="left_chart" class="chart_img"
             v-loading="payWayNull"
             element-loading-text="没有数据"
             element-loading-spinner="el-icon-view"
             element-loading-background="rgba(255, 255, 255, 1)"></div>
      </el-card>

      <!--订单-->
      <el-card class="box-card chart_card_right" style="height:320px">
        <el-tabs class="right_tabs" v-model="orderActiveName" @tab-click="changeOrderTabs">
          <el-tab-pane label="订单" name="0">
            <div id="right_charts0" class="chart_img"
                 v-loading="orderNull"
                 element-loading-text="没有数据"
                 element-loading-spinner="el-icon-view"
                 element-loading-background="rgba(255, 255, 255, 1)">
            </div>
          </el-tab-pane>
          <el-tab-pane label="退款" name="1">
            <div id="right_charts1" class="chart_img"
                 v-loading="orderNull"
                 element-loading-text="没有数据"
                 element-loading-spinner="el-icon-view"
                 element-loading-background="rgba(255, 255, 255, 1)">
            </div>
          </el-tab-pane>
          <!--<el-tab-pane label="佣金" name="2">-->
            <!--<div id="right_charts2" class="chart_img"-->
                 <!--v-loading="orderNull"-->
                 <!--element-loading-text="没有数据"-->
                 <!--element-loading-spinner="el-icon-view"-->
                 <!--element-loading-background="rgba(255, 255, 255, 1)">-->
            <!--</div>-->
          <!--</el-tab-pane>-->
        </el-tabs>
      </el-card>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue'
  import {
    getStatisticsData, //商户首页统计 卡片
    getStatisticsOrder, //获取订单类数据
    getStatisticsReceivables, //获取统计类数据
  } from './api/index.js'

  export default {
    name: 'index',
    data() {
      return {
        loading: false,//加载圈


        chartLoading: true,
        receivablesNull: true, //收款统计为空
        orderNull: true, //当日订单为空
        payWayNull: true, //支付方式为空
        activeNull: true, //会员活跃为空


        //卡片数据
        cardData: {
          todayOrderAmount: 0, //今日订单总额
          todayOrderCount: 0, //今日订单总数
          todayActAmount: 0, //今日客户实付
          orderAmount: 0,//订单金额
          orderCount: 0,//订单总数
          newMember: 0,//新增会员
          totalMember: 0,//会员总量
        },
        memberActiveChart: [], //活跃分析
        payWayChart: [], //支付通道

        receivablesActiveName: '0', //统计tab
        orderActiveName: '0' //订单tab

      }
    },
    mounted() {
      //获取基本数据
      this.getCardData()
    },
    methods: {
      /**
       * 切换统计
       */
      changeReceivablesTabs() {
        let tabs = this.receivablesActiveName
        this.getStatisticsReceivables(tabs)

      },
      /**
       * 切换当日订单
       */
      changeOrderTabs() {
        let tabs = this.orderActiveName
        this.getStatisticsOrder(tabs)
      },

      /**
       * 获取订单接口
       */
      getStatisticsOrder: function (type) {
        getStatisticsOrder(type).then(res => {
          let data = res.obj
          this.drawOrderChart(data)
        }).catch(e => {

        })
      }, /**
       * 获取统计接口
       */
      getStatisticsReceivables: function (type) {
        getStatisticsReceivables(type).then(res => {
          let data = res.obj
          this.drawReceivablesDetail(data)
        }).catch(e => {

        })
      },


      /**
       * 获取卡片数据
       */
      getCardData: function () {
        getStatisticsData().then(res => {
          let data = res.obj
          this.cardDateSet(data)

          //接下来获取订单
          this.getStatisticsOrder(0)
          //接下来统计
          this.getStatisticsReceivables(0)
        }).catch(e => {

        })
      },

      /**
       * 卡片数据填充
       */
      cardDateSet: function (resData) {
        this.cardData.newMember = resData.newMember || 0
        this.cardData.orderAmount = resData.orderAmount || 0
        this.cardData.orderCount = resData.orderCount || 0
        this.cardData.todayActAmount = resData.todayActAmount || 0
        this.cardData.todayOrderAmount = resData.todayOrderAmount || 0
        this.cardData.todayOrderCount = resData.todayOrderCount || 0
        this.cardData.totalMember = resData.totalMember || 0

        this.memberActiveChart = resData.memberActiveChart
        this.payWayChart = resData.payWayChart

        this.drawActiveData()
        this.drawPayWayData()

      },

      /**
       * 会员活跃
       */
      drawActiveData: function () {
        let resData = this.memberActiveChart
        if (!resData) {
          return false
        }

        let title = []
        for (let i in resData) {
          title.push(resData[i].name)
        }

        var right_chart = this.$echarts.init(document.getElementById('right_chart'))
        //定义图表
        this.activeNull = false
        right_chart.setOption({
          color: ['#37A1D9', '#FE9E7F', '#66DFE2', '#FFE68F'],    //设置每个图例的颜色
          title: {text: '会员活动分析', textStyle: {color: '#333', fontWeight: 'bold', fontSize: '16'}},
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} 人 (占{d}%)'
          },
          legend: {
            orient: 'vertical',
            top: '30',
            right: '0',
            data: title
          },
          series: [
            {
              name: '会员活跃占比',
              type: 'pie',
              radius: ['55%', '70%'],     //设置内外半径
              center: ['50%', '55%'],   //设置圆心的坐标
              data: resData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })

      },

      /**
       * 支付方式
       */
      drawPayWayData: function () {
        let resData = this.payWayChart
        if (!resData) {
          return false
        }

        let title = []
        for (let i in resData) {
          title.push(resData[i].name)
        }
        var left_chart = this.$echarts.init(document.getElementById('left_chart'))
        //定义图表
        this.leftDataNull = false
        left_chart.setOption({
          color: ['#66DFE2', '#3EBDFF','rgb(255,173,139)','rgb(255,230,143)'],
          title: {text: '支付方式', textStyle: {color: '#333', fontWeight: 'bold', fontSize: '16'}},
          tooltip: {
            trigger: 'item',
            formatter: '{a} (占{d}%)'
          },
          legend: {
            orient: 'vertical',
            top: '30',
            right: '0',
            data: title
          },
          series: [
            {
              //name: '支付方式及占比',
              name: '支付方式',
              type: 'pie',
              radius: '70%',
              center: ['50%', '50%'],
              data: resData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
      },


      /**
       * 订单
       * @param data
       */
      drawOrderChart: function (data) {
        console.log(data)
        this.orderNull = false
        var orderChart = this.$echarts.init(document.getElementById('right_charts' + this.orderActiveName))
        orderChart.setOption({
          color: ['#FE9E7F', '#37A1D9'],
          title: {text: '当日数据', textStyle: {color: '#333', fontWeight: 'bold', fontSize: '16'}},
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} @ {c}'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.xdata
          },//X轴标题

          yAxis: {
            type: 'value',
          },
          series: [{
            data: data.ydata,
            name: '金额',
            type: 'line',
            areaStyle: {
              color: 'white'
            }
          }]  //数据数组，多个数据，legend需要对于标题name
        })
        setTimeout(() => {
          orderChart.resize();
        }, 200);

      },

      /**
       * 统计
       * @param data
       */
      drawReceivablesDetail: function (data) {
        if (data == []) {
          this.receivablesNull = true
        }
        this.receivablesNull = false
        //定义图表
        var receivables_chart = this.$echarts.init(document.getElementById('orderChart' + this.receivablesActiveName))
        receivables_chart.setOption({
          color: '#37A1D9',
          legend: {
            orient: 'vertical',
            top: '0',
            right: '0',
            data: ['金额','数量']
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.xdata
          },//X轴标题

          yAxis: [
            {name:'金额',type:'value'},
            {name:'数量',type:'value'},
          ],
          series: [{
            data: data.num,
            name: '数量',
            type: 'line',
            smooth: true,
            yAxisIndex:0,
            tooltip:{
              trigger:'axis'
            },
            areaStyle: {},
            itemStyle: {
              normal: {
                //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new this.$echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: 'red'},  //0%处的颜色
                    {offset: 0.5, color: 'pink'},//50%处的颜色
                    {offset: 1, color: 'white'}  //100%处的颜色
                  ]
                )
              }
            }
          },
            {
              data: data.ydata,
              name: '金额',
              type: 'line',
              smooth: true,
              areaStyle: {},
              yAxisIndex:1,
              tooltip:{
                trigger:'axis'
              },
              itemStyle: {
                normal: {
                  //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                  color: new this.$echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: '#66DFE2'},  //0%处的颜色
                      {offset: 0.5, color: '#66DFE2'},//50%处的颜色
                      {offset: 1, color: 'white'}  //100%处的颜色
                    ]
                  )
                }
              }
            }
          ]  //数据数组，多个数据，legend需要对于标题name
        })

        setTimeout(() => {
          receivables_chart.resize();
        }, 200);


      }
    }
  }
</script>

<style scoped>
  .clearfix span {
    /* color: #FF000000; */
    font-size: 18px;
    font-weight: bold
  }

  .header_bar {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .header_left {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .header_left_top {
    width: 100%;
  }

  .header_right {
    width: 38%;
    margin-left: 2%;
  }

  /*数据简报*/
  .totalData {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .total_item {
    text-align: center;
  }

  .total_title {
    font-size: 14px;
    color: #808080;
  }

  .total_num {
    padding: 0;
    margin: 0;
    font-size: 26px;
    line-height: 30px;
  }

  .column_line {
    height: 60px;
    width: 1px;
    background-color: #c1c1c1;
  }

  /*卡片*/
  .card_group {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }

  .card_item {
    width: 23%;

  }

  .card_item_title {
    background-color: #FF803E;
    letter-spacing: 0.1em;
    padding: 4px 8px;
    font-size: 12px;
    color: white;
    border: none;
  }

  .card_item_content {
    width: 100%;
    background: #f9f9f9;
    height: 900px;
    text-align: center;
  }

  .card_item_content span {
    line-height: 80px;
    font-size: 40px;
    color: #FF803E;
    /*text-shadow: 1px 1px 0px #37544b;*/
  }

  /*底部*/
  .bottom_box {
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .region0, .chart_card_right {
    width: 59%;
  }

  .region, .chart_card {
    width: 39%;
  }

  .chart_img {
    width: 100%;
    height: 280px;
  }

  @media (max-width: 1024px) {
    .card_item {
      width: 50%;
    }

    .bottom_box {
      flex-wrap: wrap;
    }

    .region {
      width: 100%
    }
  }
</style>
