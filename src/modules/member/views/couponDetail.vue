<template>
  <div class="app-container" v-loading="loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>卡券详情</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="goBack">返回上一页</el-button>
      </div>
      <!--卡券实际详情-->
      <div>
        <!--主要信息-->
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>主要信息</span>
          </div>

          <div class="info-table">
            <table>
              <tr>
                <td>卡券名称</td>
                <td>{{couponDetail.name||'——'}}</td>
              </tr>
              <tr>
                <td>卡券面值</td>
                <td>{{couponDetail.money||'——'}}元</td>
              </tr>
              <tr>
                <td>卡券展示图</td>
                <td>
                  <img :src="getImg(couponDetail.photoId)" alt="卡券图片" width="320" height="240" class="bg-image">
                </td>
              </tr>
              <tr>
                <td>有效期</td>
                <td>
                  <template v-if="couponDetail.validType==0">
                    领取后{{couponDetail.claimedTime}}天有效
                  </template>
                  <template v-if="couponDetail.validType==1">
                    {{couponDetail.validTimeStart}}至{{couponDetail.validTimeEnd}}
                  </template>
                </td>
              </tr>
              <tr>
                <td>发放总量</td>
                <td>
                  <template v-if="couponDetail.totalInventory==99999999">
                    不限制
                  </template>
                  <template v-else>
                    {{couponDetail.totalInventory}}份
                  </template>

                </td>
              </tr>
              <tr>
                <td>活动有效时间</td>
                <td>{{couponDetail.actTimeStart}}至{{couponDetail.actTimeEnd}}</td>
              </tr>
              <tr>
                <td>卡券说明</td>
                <td>{{couponDetail.remark||'——'}}</td>
              </tr>
            </table>

          </div>

        </el-card>
        <!--规则配置-->
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>规则配置</span>
          </div>

          <div class="info-table">
            <table>
              <tr>
                <td>最低消费</td>
                <td>
                  <template v-if="couponDetail.miniExpendLimit==0">
                    无门槛
                  </template>
                  <template v-else>
                    {{couponDetail.miniExpendLimit}}元
                  </template>
                </td>
              </tr>
              <tr>
                <td>使用时段</td>
                <td>
                  <template v-if="couponDetail.useTimeWeek=='1,2,3,4,5,6,7' && couponDetail.useTimeDay=='00:00-23:59'">
                    任意时段可用（周一至周日，00:00至23:59）
                  </template>
                  <template v-else>
                    <p>{{couponDetail.useTimeWeek|weekBlockFil}}</p>
                    <p>{{couponDetail.useTimeDay}}</p>
                  </template>
                </td>
              </tr>
              <tr>
                <td>每位用户限领</td>
                <td>
                  <template v-if="couponDetail.claimUpperLimit==99999999">
                    不限制
                  </template>
                  <template v-else>
                    {{couponDetail.claimUpperLimit}}份
                  </template>
                </td>
              </tr>
              <tr>
                <td>使用门店</td>
                <td @click="storeOpen()" class="skyblue">
                  共{{couponDetail.storeIds|storeNumsCalcFil}}家门店
                </td>
              </tr>
            </table>

          </div>

        </el-card>
        <!--其他配置-->
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>其他配置</span>
          </div>

          <div class="info-table">
            <table>
              <tr>
                <td>过期提醒</td>
                <td>{{couponDetail.remindType|remindFil}}</td>
              </tr>
              <tr>
                <td>同步发布至</td>
                <td>
                  {{couponDetail.couponSourceType|couponSourceFil}}
                </td>
              </tr>
              <tr v-if="couponDetail.couponSourceType==1">
                <td>卡券颜色</td>
                <td>
                  <div class="el-color-picker el-color-picker--medium"><!---->
                    <div class="el-color-picker__trigger">
                <span class="el-color-picker__color is-alpha">
                  <span class="el-color-picker__color-inner"
                        :style="{backgroundColor:wxColorFil(couponDetail.wxColor)}">
                  </span>
                </span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="couponDetail.couponSourceType==1">
                <td>卡券标题</td>
                <td>
                  {{couponDetail.title||'——'}}
                </td>
              </tr>
              <tr v-if="couponDetail.couponSourceType==1">
                <td>预览</td>
                <td>
                  <el-button type="text" @click="showCouponSyncPreview">预览微信卡包</el-button>
                </td>
              </tr>

            </table>

          </div>

        </el-card>


      </div>


    </el-card>

    <!--门店模态框-->
    <el-dialog
      title="查看门店"
      :visible.sync="storeVisible"
      width="576px"
      :before-close="storeClose">
      <!--功能区-->
      <div>
        <div class="search_header">
          <div class="block">
            <el-input v-model="storeSearchForm.name" placeholder="请输入门店名称" @input="storeSearchSubmit"></el-input>
          </div>

          <div class="block" style="float: right">
            <el-button type="primary" @click="storeSearchSubmit">搜索</el-button>
            <el-button @click="storeSearchReset">重置</el-button>
          </div>

          <el-divider>门店列表</el-divider>

          <div class="store-list">
            <template>
              <el-table
                :data="storeTable"
                style="width: 100%">
                <el-table-column
                  type="index"
                  label="序号"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="门店"
                  show-overflow-tooltip
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="address"
                  show-overflow-tooltip
                  label="地址">
                </el-table-column>
              </el-table>
            </template>
          </div>

        </div>


      </div>


    </el-dialog>

    <!--//预览窗-->
    <!--LOGO还未获取-->
    <div class="sim-wxapp" id="wx-app" v-show="couponSyncPreview" @mousedown="mousedown">
      <div class="sim-wxapp-header">
        <span class="dialog-title">卡券预览</span>
        <i class="el-icon-close close-icon" style="float: right" @click="closeDialog"></i>
      </div>
      <div class="sim-body" :style="{backgroundColor:wxColorFil(couponDetail.wxColor)}">
        <!--导航条-->
        <div class="roof-img"></div>
        <!--LOGO-->
        <img :src="getImg(logo)" alt=""
             class="sim-logo">
        <!--卡片-->
        <div class="sim-info-panel">
          <div class="info-panel-content">
            <span class="brand-name">{{mecName}}</span>
            <br>
            <span class="brand-title">{{couponDetail.title}}</span>
            <br>
            <el-button size="mini" class="brand-button button-color">立即使用</el-button>
          </div>
          <!--使用条件-->
          <div class="sim-body-time">
            <div class="time-left">使用条件:</div>
            <div v-if="couponDetail.miniExpendLimit==0">
              <template>
                无门槛
              </template>
            </div>
            <div v-else>
              <template>
                满{{couponDetail.miniExpendLimit}}元可用
              </template>
            </div>


            <div class="time-left">有效期:</div>
            <div class="time-right">

              <span v-if="couponDetail.validType==0">领取后{{couponDetail.claimedTime}}天有效</span>
              <span
                v-if="couponDetail.validType==1">{{couponDetail.validTimeStart}} 至 {{couponDetail.validTimeEnd}}</span>

              <div class="time-checkbox">{{couponDetail.useTimeWeek|weekBlockFil}}</div>
              <div>
                {{couponDetail.useTimeDay}}
              </div>
            </div>

          </div>
          <div class="wx-pa">
            <span class="pa-title">公众号</span>
            <span class="el-icon-arrow-right close-icon" style="float: right"></span>
          </div>
        </div>


      </div>

    </div>


  </div>
</template>

<script>

  import {returnThumbnailUrl, returnFilesUrl, uploadUrl} from '@/modules/file/api/upload' //图片操作API
  import {findCouponItem, findStoreList} from '../api/coupon'
  import {url} from '@/utils/request'

  export default {
    name: 'couponDetail',
    data () {
      return {
        loading: true,
        storeVisible: false,//门店列表模态框
        couponDetail: {},//详情
        storeSearchForm: {
          name: ''
        },
        storeTable: [],
        urlId: '', //URL接收到的ID
        mecName: '',//卡券商户名
        logo: '',
        couponSyncPreview: false

      }
    },
    filters: {
      //过期提醒
      remindFil: function (val) {
        let v = parseInt(val);
        let txt = '';
        switch (v) {
          case 1:
            txt = '过期前三天提醒';
            break;
          case 2:
            txt = '不提醒';
            break;
          default:
            txt = '未定义';
            break
        }
        return txt
      },
      //卡包同步
      couponSourceFil: function (val) {
        let v = parseInt(val);
        let txt = '';
        switch (v) {
          case 1:
            txt = '同步微信卡包';
            break;
          case 2:
            txt = '不同步';
            break;
          default:
            txt = '未定义';
            break
        }
        return txt
      },
      //时段
      weekBlockFil: function (val) {
        if (val == '' || val == null || val === undefined) {
          return ''
        }
        if (val == '1,2,3,4,5,6,7') {
          return '周一至周日'
        }
        let str = val;
        let dayArray = str.split(',');
        let textArray = [];
        for (let i in dayArray) {
          if (dayArray[i] == 1) {
            textArray.push('周一 ')
          } else if (dayArray[i] == 2) {
            textArray.push('周二 ')
          } else if (dayArray[i] == 3) {
            textArray.push('周三 ')
          } else if (dayArray[i] == 4) {
            textArray.push('周四 ')
          } else if (dayArray[i] == 5) {
            textArray.push('周五 ')
          } else if (dayArray[i] == 6) {
            textArray.push('周六 ')
          } else if (dayArray[i] == 7) {
            textArray.push('周日 ')
          }
        }
        return textArray.join('')
      },

      //门店数量计算
      storeNumsCalcFil: function (val) {
        if (val == '' || val == null || val === undefined) {
          return ''
        }
        let str = val;
        let storeArray = str.split(',');
        let count = 0;
        for (let i in storeArray) {
          count++
        }
        return count

      },
      //颜色过滤

    },

    computed: {},
    mounted () {
      this.urlId = this.$route.query.id == undefined ? '' : this.$route.query.id; //接收ID
      this.mecName = sessionStorage.getItem('name') || '卡券预览';
      this.logo = sessionStorage.getItem('face') || ''; //获取商户LOGO
      // console.log(this.urlId)
      this.getDetails() //获取详情
    },
    methods: {
      /**
       *获取细节
       */
      getDetails: function () {
        let that = this;
        let id = this.urlId;
        this.loading = true; //显示加载
        findCouponItem(id).then(res => {
          // this.dataCheck(res.obj)
          this.couponDetail = res.obj;

          //仪式感
          setTimeout(function () {
            that.loading = false
          }, 500)

        }).catch(e => {

        })
      },

      /**
       * 门店列表开启
       */
      storeOpen: function () {
        this.getStoreList();
        this.storeVisible = true
      },

      /**
       * 门店列表关闭
       */
      storeClose: function () {
        this.storeVisible = false
      },

      /**
       *门店搜索
       */
      storeSearchSubmit: function () {
        this.getStoreList()
      },

      /**
       *门店搜索重置
       */
      storeSearchReset: function () {
        this.storeSearchForm = {
          name: ''
        };
        this.getStoreList()
      },
      /**
       *获取列表
       */
      getStoreList: function () {
        let id = this.urlId;
        let name = this.storeSearchForm.name || '';
        //获取列表 展示
        findStoreList(id, name).then(res => {
          let data = res.obj;
          this.storeTable = data
        }).catch(e => {

        })
      },

      //显示卡券预览
      showCouponSyncPreview: function () {
        let that = this;
        this.loading = true;
        setTimeout(function () {
          that.loading = false;
          that.couponSyncPreview = true
        }, 480)
      },

      /**
       * 返回上一页
       */
      goBack: function () {
        this.$router.go('-1')
      },

      /**
       * 颜色处理
       */
      wxColorFil: function (val) {
        if (val == '' || val == undefined || val == null) {
          return '#63b359'
        }

        let group = [
          {value: 'Color010', hex: '#63b359'},
          {value: 'Color020', hex: '#2c9f67'},
          {value: 'Color030', hex: '#509fc9'},
          {value: 'Color040', hex: '#5885cf'},
          {value: 'Color050', hex: '#9062c0'},
          {value: 'Color060', hex: '#d09a45'},
          {value: 'Color070', hex: '#e4b138'},
          {value: 'Color080', hex: '#ee903c'},
          {value: 'Color081', hex: '#f08500'},
          {value: 'Color082', hex: '#a9d92d'},
          {value: 'Color090', hex: '#dd6549'},
          {value: 'Color100', hex: '#cc463d'},
          {value: 'Color101', hex: '#cf3e36'},
          {value: 'Color102', hex: '#5E6671'},
        ];//颜色组

        for (let i in group) {
          if (group[i].value == val) {
            return group[i].hex
          }
        }
      },

      /**
       * 换取图片
       */
      getImg: function (val) {
        let reg = /^[0-9]*$/;
        if (reg.test(val)) {
          return returnFilesUrl(val)
        } else {
          let base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAIAAAC2BqGFAAAFLklEQVR42u2dfVPyMAzA9/0/GyLKy4kep6Kgk0NRFJ2gPD13t+vTbqVbm6QdyV+Ks01/ZFmbplmyZ0GRhBEwaAbNwqAZNINmYdAMmoVBM+gG8v7+3rGWx8dHBl1POs4yn88ZdKWkadrxLQz6P/n5+emAyenpKYO2dRTj8fj397f03xeLhU0L9/f3xwsa4q6fzWZhepIkNMqDwQDUF11fXx8LaOEEShEMh0O0r7P9oD8+PpBHfn5+rnfX6/XaDPrl5UUf8/f3N5WnaifozWZDO9TpdEqoAB7oEBzlaDSiUiOhokw12dIfxTjzkISKMiHr3W6HrwY46OVyGWA4Al+NhNCcg2ItZoERg1YGc3t7Kz48OzsLk3VVOCV00NvttopmIKz1lXqUoM1jCIR1+0GHM+fzHtJCBd3r9WzwhWDXOL0n5NqTs1Y89Ww2ixX08/Oz+WJy1ghdJ4HoTeuvlVBqm0GT2zX0BiM46FrhZkLW0J36By08sovGVKzjA+2uMQlrcecdHWgq1hGDdllo4bOWO3p9fY0J9MPDg8ebA5o16LYLLOgsyxxbw7Rr0PA0LGixunVvEI213P7JyUlMoH2F0nFYg7YPC/rz8xOIAgQLueV+vx8T6Lu7O48tQ9s1nObgoLvdrt/GQVnLbW42m6NYsJCwPsaVIb6/FiuUyECLByDCnNe7XccXVFKUXi6XUbCOHjTootkja9BABxTowWCAFgnywjrWPUNF9cvLy8BZtwQ0QijZhbVyYvfr6ysm0GJlRbsX1XgDHkg9ypSwQOxavnixWEQPGuiWdGTdhiRHEqOuxVo/p9US0FRJGpbprKAqYR+twDm+aWPXyp9Wq1XcoKkciJl1Cw8LCRkOh0GxHo/HLTz+Ruus9xbHwrzsIIcCmpZ1qV0X1o2jA2p1A32c2+2WkDVmuSXseh1UpTP0fr1nboQFusppwq0bS7vzmAcRLug9VgWei4uL0l7SNMUfMlnxqm63C4dbON/QCoVRlmObTCaGWVeDXKH1eh1sYUf6AoNXV1eWNRmn0+nb29tutxP/JXz609NTlXMIsHZmKLVJ4Upmos0g4wANgRs6ThQx6FzMZS/jKrIbNGhZsixTkhdiKRgdGejWCINm0AyahUEzaAbNCBg0g2Zh0C0BXZTOtbm43+9DHEEFFcPoHKMoh0Hr6SalQRz7EI+vN2CJX70HniIDbQ7xMOjmt5W7Hg1ayEHrn6dpavZXuekEClrupnSEgYDO340xmUyiBJ33IbSf/0mu6FySvY8XX7mD1ov3l6oROujGD0Mc0KvVqkinU0TZVj8IGmJDxwq0UrzCxnU0PuzXDLTyygb5siLHw951kIE2m1J+2psQdH7UbjQa6e3kP6/Xa3cfjbFgybKscM0G1yE/62tVQW9mPvL3rZQjM5tboKCr0n/kWW3VCRE00OYu4gB90HUU34SLxspDta4ayuKlqF0hLF1PO48V9P7vZV+OGruAllGKGV5pOST5Ai8PQ1jQcIksLqDFxE720QcVOF7Q+jzBZQmuzOr0kl9m0Dc3N35nRw1Be5+rFVUc3EGXJtvpcY8q0LUO6ccH2n4CrnyugNaTz6tOXMUB2q/r0K+0jzZUuY7S+ah8nOLoLNpwRNsFdFWYyQzaPtM3JtDFu191B+oXtKXrKKbbEKECGtchryyUEIR9pLB0keKiW63znRGALr2Ra/VS9Z25gC7iq0DBLxrXka/NvCxqPbqO0nuLEjQLaqyDhUEzaAbNCBg0g2Zh0AyaQbMw6DbJP0zQqPbAWqsMAAAAAElFTkSuQmCC';
          return base64
        }

      },

      //----------------------------------------------------
      closeDialog (e) {
        this.couponSyncPreview = false
        // alert(this.dialogVisible)
        // this.$store.commit('newDialogVisible', false)
      },
      mousedown (event) {
        // console.log(event)
        this.selectElement = document.getElementById('wx-app');
        var div1 = this.selectElement;
        this.selectElement.style.cursor = 'move';
        this.isDowm = true;
        var distanceX = event.clientX - this.selectElement.offsetLeft;
        var distanceY = event.clientY - this.selectElement.offsetTop;
        // alert(distanceX)
        // alert(distanceY)
        // console.log(distanceX)
        // console.log(distanceY)
        document.onmousemove = function (ev) {
          var oevent = ev || event;
          div1.style.left = oevent.clientX - distanceX + 'px';
          div1.style.top = oevent.clientY - distanceY + 'px'
        };
        document.onmouseup = function () {
          document.onmousemove = null;
          document.onmouseup = null;
          div1.style.cursor = 'default'
        }
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

  .search_header {

  }

  .box-card {
    margin-bottom: 20px;
  }

  .info-table {
    width: 100%;
  }

  .info-table table tr {
    font-size: 14px;
    color: #808080;
    height: 40px;
  }

  .info-table table tr td:nth-child(1) {
    width: 150px;
    text-align: right;
  }

  .info-table table tr td:nth-child(1):after {
    content: '：';
  }

  .info-table table tr td:nth-child(2) {
    padding: 0 0 0 30px;
  }

  .skyblue {
    cursor: pointer;
    color: #409eff;
  }

  .store-list {
    height: 350px;
    overflow-y: scroll;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  .bg-image {
    border-radius: 8px;
  }


  /*模拟微信*/
  .sim-wxapp {
    z-index: 2000;
    cursor: default;
    position: fixed;
    right: 0;
    top: 100px;
    width: 320px;
    height: 560px;
    background-color: #f3f3f3;
    box-shadow: 0 2px 15px 1px #cecece;
  }

  .sim-wxapp-header {
    cursor: move;
    background-color: #e4e4e4;
    font-style: unset;
    padding: 0 0 0 10px;
    height: 30px;
    width: 100%;
  }

  .dialog-title {
    line-height: 30px;
    font-size: 13px;
    color: #262626;
  }

  .pa-title {
    line-height: 30px;
    font-size: 13px;
    color: #2a2a2a;
  }

  .close-icon {
    cursor: default;
    line-height: 30px;
    padding: 0 10px 0 0;
  }

  /*虚拟界面*/
  .sim-body {
    background-color: #63b359;
    width: 320px;
    height: 560px;
  }

  .sim-logo {
    border: 1px solid #ccc;
    position: relative;
    left: 138px;
    border-radius: 50px;
    height: 50px;
    width: 50px;
  }

  .roof-img {
    background: url('../../../assets/images/member/head_bar.png') no-repeat;
    background-size: 100% 100%;
    margin-right: 5px;
    height: 55px;
    width: 320px;
  }

  .sim-info-panel {
    width: 280px;
    height: 300px;
    background: #FFF;
    border-radius: 5px;
    margin-left: 20px;
    margin-top: -26px;
  }

  .info-panel-content {
    text-align: center;
    padding-top: 38px;
  }

  .brand-name {
    color: #999;
    font-size: 14px;
  }

  .brand-title {
    font-size: 16px;
    color: #333;
  }

  .brand-button {
    cursor: pointer;
    border-radius: 5px;
    font-size: 14px;
    color: #fff;
    padding: 5px;
    width: 120px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
  }

  .button-color {
    background: #2c9f67;
    border: solid 1px #999;
  }

  .sim-body-time {
    height: 60px;
    margin-top: 65px;
    padding-left: 13px;
    border-bottom: 1px dashed #999;
    font-size: 13px;
  }

  .time-left {
    width: 75px;
    float: left;
  }

  .time-right {
    color: #999;
    width: 190px;
    float: right;
  }

  .wx-pa {
    color: black;
    font-style: normal;
    padding: 14px 10px;
    height: 50px;
  }


</style>
