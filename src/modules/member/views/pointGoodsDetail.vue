<template>
  <div class="app-container" v-loading="loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="height:20px;padding: 0">
        <span>积分兑换规则详情</span>
        <el-button style="float: right; height: 20px;margin: 0;padding: 0" type="text" @click="goBack">返回上一页</el-button>
      </div>
      <!--第一行-->
      <div>
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix" style="height:20px;padding: 0">
            <span>基本信息</span>
          </div>

          <!--内容-->
          <div>
            <table class="info_table">
              <tr>
                <td>兑换时间</td>
                <td>{{goodDetail.exchangeStart}} - {{goodDetail.exchangeEnd}}</td>
              </tr>
              <tr>
                <td>兑换说明</td>
                <td>{{goodDetail.exchangeMessage}}</td>
              </tr>
            </table>
          </div>
        </el-card>
      </div>

      <!--第二行-->
      <div style="margin-top: 20px">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix" style="height:20px;padding: 0">
            <span>规则配置</span>
          </div>

          <div>
            <table class="info_table">
              <tr>
                <td>兑换所需积分</td>
                <td>{{goodDetail.credits||0}}积分</td>
              </tr>
              <tr>
                <td>商品名称</td>
                <td>{{goodDetail.productName||'网络不佳...'}}</td>
              </tr>
              <tr>
                <td>商品价格</td>
                <td>{{goodDetail.productMoney||0}}元</td>
              </tr>
              <tr>
                <td>商品图片</td>
                <td>
                  <template>
                    <el-popover
                      placement="left"
                      title=""
                      trigger="hover"
                      width="700">
                      <img :src="getImg(goodDetail.imgUrl)" width="100%"/>
                      <img slot="reference" :src="getImg(goodDetail.imgUrl)" :alt="goodDetail.productName"
                           class="item-image">
                    </el-popover>
                  </template>
                  <!--第一版显示图片-->
                  <!--<img :src="getImg(goodDetail.imgUrl)" width="200" height="200" alt="" class="item-image">-->

                </td>
              </tr>
              <tr>
                <td>商品数量</td>
                <td>{{goodDetail.productNums}}件</td>
              </tr>
              <tr>
                <td>每位用户限领</td>
                <template v-if="goodDetail.isLimited==2">
                  <td>不限</td>
                </template>
                <template v-else-if="goodDetail.isLimited==1">
                  <td>{{goodDetail.limitedNum}}份</td>
                </template>

              </tr>
            </table>
          </div>
        </el-card>
      </div>


    </el-card>
  </div>
</template>

<script>
  import {findGoodDetail} from '../api/pointsRule'
  import {returnThumbnailUrl, returnFilesUrl, uploadUrl} from '@/modules/file/api/upload' //图片操作API
  export default {
    name: 'pointGoodsDetail',
    data () {
      return {
        loading: true,
        id: '',//商品id
        searchFormTmp: {
          t: '',
          n: '',
          ty: '',
          p: '',
          ps: ''
        },
        goodDetail: {},//详情
      }
    },
    mounted () {
      this.id = this.$route.query.id == undefined ? '' : this.$route.query.id //接收ID

      this.searchFormTmp.t = this.$route.query.t == undefined ? '' : this.$route.query.t
      this.searchFormTmp.n = this.$route.query.n == undefined ? '' : this.$route.query.n
      this.searchFormTmp.ty = this.$route.query.ty == undefined ? '' : this.$route.query.ty
      this.searchFormTmp.p = this.$route.query.p == undefined ? '' : this.$route.query.p
      this.searchFormTmp.ps = this.$route.query.ps == undefined ? '' : this.$route.query.ps

      if (this.id == '') {
        this.$message.error('无法获取商品或活动的ID，请勿直接进入该页')
      } else {
        this.getDetails(this.id)
      }
    },
    methods: {
      /**
       *
       */

      /**
       * 获取详情
       */
      getDetails: function (id) {
        findGoodDetail(id).then(res => {
          this.goodDetail = res.obj
          this.loading = false

        }).catch(e => {

        })
      },

      /**
       * 返回上一页
       */
      goBack: function () {
        let t = this.searchFormTmp.t
        let n = this.searchFormTmp.n
        let ty = this.searchFormTmp.ty
        let p = this.searchFormTmp.p
        let ps = this.searchFormTmp.ps
        this.$router.push({path: '/member/views/pointsRule', query: {t: t, n: n, ty: ty, p: p, ps: ps}})
      },

      /**
       * 换取图片
       */
      getImg: function (val) {
        let reg = /^[0-9]*$/
        if (reg.test(val)) {
          return returnFilesUrl(val)
        } else {
          let base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAIAAAC2BqGFAAAFLklEQVR42u2dfVPyMAzA9/0/GyLKy4kep6Kgk0NRFJ2gPD13t+vTbqVbm6QdyV+Ks01/ZFmbplmyZ0GRhBEwaAbNwqAZNINmYdAMmoVBM+gG8v7+3rGWx8dHBl1POs4yn88ZdKWkadrxLQz6P/n5+emAyenpKYO2dRTj8fj397f03xeLhU0L9/f3xwsa4q6fzWZhepIkNMqDwQDUF11fXx8LaOEEShEMh0O0r7P9oD8+PpBHfn5+rnfX6/XaDPrl5UUf8/f3N5WnaifozWZDO9TpdEqoAB7oEBzlaDSiUiOhokw12dIfxTjzkISKMiHr3W6HrwY46OVyGWA4Al+NhNCcg2ItZoERg1YGc3t7Kz48OzsLk3VVOCV00NvttopmIKz1lXqUoM1jCIR1+0GHM+fzHtJCBd3r9WzwhWDXOL0n5NqTs1Y89Ww2ixX08/Oz+WJy1ghdJ4HoTeuvlVBqm0GT2zX0BiM46FrhZkLW0J36By08sovGVKzjA+2uMQlrcecdHWgq1hGDdllo4bOWO3p9fY0J9MPDg8ebA5o16LYLLOgsyxxbw7Rr0PA0LGixunVvEI213P7JyUlMoH2F0nFYg7YPC/rz8xOIAgQLueV+vx8T6Lu7O48tQ9s1nObgoLvdrt/GQVnLbW42m6NYsJCwPsaVIb6/FiuUyECLByDCnNe7XccXVFKUXi6XUbCOHjTootkja9BABxTowWCAFgnywjrWPUNF9cvLy8BZtwQ0QijZhbVyYvfr6ysm0GJlRbsX1XgDHkg9ypSwQOxavnixWEQPGuiWdGTdhiRHEqOuxVo/p9US0FRJGpbprKAqYR+twDm+aWPXyp9Wq1XcoKkciJl1Cw8LCRkOh0GxHo/HLTz+Ruus9xbHwrzsIIcCmpZ1qV0X1o2jA2p1A32c2+2WkDVmuSXseh1UpTP0fr1nboQFusppwq0bS7vzmAcRLug9VgWei4uL0l7SNMUfMlnxqm63C4dbON/QCoVRlmObTCaGWVeDXKH1eh1sYUf6AoNXV1eWNRmn0+nb29tutxP/JXz609NTlXMIsHZmKLVJ4Upmos0g4wANgRs6ThQx6FzMZS/jKrIbNGhZsixTkhdiKRgdGejWCINm0AyahUEzaAbNCBg0g2Zh0C0BXZTOtbm43+9DHEEFFcPoHKMoh0Hr6SalQRz7EI+vN2CJX70HniIDbQ7xMOjmt5W7Hg1ayEHrn6dpavZXuekEClrupnSEgYDO340xmUyiBJ33IbSf/0mu6FySvY8XX7mD1ov3l6oROujGD0Mc0KvVqkinU0TZVj8IGmJDxwq0UrzCxnU0PuzXDLTyygb5siLHw951kIE2m1J+2psQdH7UbjQa6e3kP6/Xa3cfjbFgybKscM0G1yE/62tVQW9mPvL3rZQjM5tboKCr0n/kWW3VCRE00OYu4gB90HUU34SLxspDta4ayuKlqF0hLF1PO48V9P7vZV+OGruAllGKGV5pOST5Ai8PQ1jQcIksLqDFxE720QcVOF7Q+jzBZQmuzOr0kl9m0Dc3N35nRw1Be5+rFVUc3EGXJtvpcY8q0LUO6ccH2n4CrnyugNaTz6tOXMUB2q/r0K+0jzZUuY7S+ah8nOLoLNpwRNsFdFWYyQzaPtM3JtDFu191B+oXtKXrKKbbEKECGtchryyUEIR9pLB0keKiW63znRGALr2Ra/VS9Z25gC7iq0DBLxrXka/NvCxqPbqO0nuLEjQLaqyDhUEzaAbNCBg0g2Zh0AyaQbMw6DbJP0zQqPbAWqsMAAAAAElFTkSuQmCC'
          return base64
        }

      }

    }
  }
</script>

<style scoped>
  .info_table {
    width: 100%;
  }

  .info_table tr td {
    height: 40px;
    font-size: 14px;
    color: #7c7c7c;
  }

  .info_table tr td:nth-child(odd) {
    width: 200px;
    text-align: right;
  }

  .info_table tr td:nth-child(odd):after {
    content: '：';
  }

  .info_table tr td:nth-child(even) {
    padding: 0 0 0 20px;
  }

  .item-image {
    width: auto;
    max-width: 768px;
    height: 200px;

    border-radius: 8px;

    border: 1px dashed #c9dff5;
  }

</style>
