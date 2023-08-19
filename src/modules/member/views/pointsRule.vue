<template>
  <div class="app-container" v-loading="loading">
    <el-card class="box-card">
      <!--标签页-->
      <el-tabs v-model="tabsNum" @tab-click="tabsChange">
          <el-tab-pane label="积分规则" key="0" name="0">
            <!--************************************-->
            <div>
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <el-tooltip class="item" effect="light" content="积分可通过消费或赠送获得，累计后可兑换商品/服务等。" placement="right">
                    <span class="card_title">积分规则<i class="el-icon-question"></i></span>
                  </el-tooltip>
                </div>
                <div class="point_rule_box">
                  <template v-if="!mode">
                    <el-form :inline="true" class="point_rule_inline">
                      <el-form-item label="每消费：" label-width="200px">
                        <span class="rule_text">{{pointeRuleForm.consumptionAmount}} 元</span>
                      </el-form-item>
                      <el-form-item label="赠送：" label-width="100px">
                        <span class="rule_text">{{pointeRuleForm.credits}} 积分</span>
                      </el-form-item>
                    </el-form>
                  </template>
                  <template v-if="mode">
                    <el-form :inline="true" class="point_rule_inline">
                      <el-form-item label="每消费：" label-width="200px">
                        <el-input-number v-model="pointeRuleForm.consumptionAmount" :precision="2" :step="1" :min="0.01"
                                         :max="9999"
                                         size="medium"></el-input-number>
                        元
                      </el-form-item>
                      <el-form-item label="赠送：" label-width="100px">
                        <el-input-number v-model="pointeRuleForm.credits" :precision="0" :step="1" :min="0" :max="99999"
                                         size="medium"></el-input-number>
                        积分
                      </el-form-item>
                    </el-form>

                  </template>
                </div>
              </el-card>

              <el-card class="box-card" style="margin-top: 20px">
                <div slot="header" class="clearfix">
                  <span class="card_title">其他设置</span>
                </div>
                <div class="point_rule_box">
                  <template v-if="!mode">
                    <el-form :inline="true" class="point_rule_inline">
                      <el-form-item label="储值消费是否积分：" label-width="200px">
                        <el-radio v-model="pointeRuleForm.isTrue" disabled :label="0">不积分</el-radio>
                        <el-radio v-model="pointeRuleForm.isTrue" disabled :label="1">积分</el-radio>
                      </el-form-item>
                    </el-form>
                  </template>
                  <template v-if="mode">
                    <el-form :inline="true" class="point_rule_inline">
                      <el-form-item label="储值消费是否积分：" label-width="200px">
                        <el-radio v-model="pointeRuleForm.isTrue" :label="0">不积分</el-radio>
                        <el-radio v-model="pointeRuleForm.isTrue" :label="1">积分</el-radio>
                      </el-form-item>
                    </el-form>
                  </template>
                </div>
              </el-card>
            </div>

            <div style="margin-top: 20px;text-align: center">
              <!--尝试过渡-->
              <transition name="fade" mode="out-in">
                <div v-if="!mode" key="mode1">
                  <el-button type="primary" @click="changeRulesMode">修 改</el-button>
                </div>
                <div v-else key="mode2">
                  <el-button type="primary" @click="submitSaveRules" v-loading="btnLoading" :disabled="btnLoading">保 存
                  </el-button>
                  <el-button @click="cancelSaveRule">取 消</el-button>
                </div>
              </transition>
            </div>

            <!--************************************-->
          </el-tab-pane>

          <el-tab-pane label="积分商城" key="1" name="1">
            <!--************************************-->
            <div class="" title="输入搜索条件">
              <div class="block">
                <el-input placeholder="输入商品名称" v-model="pointStoreSearchForm.productName" size="medium"></el-input>
              </div>
              <div class="block">
                <el-select size="medium" clearable v-model="pointStoreSearchForm.status" placeholder="请选择兑换状态">
                  <el-option
                    v-for="item in exchangeStatus"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="block" style="margin-left: 10px">
                <el-button type="primary" size="medium" @click="pointStoreSearchSubmit">查 询</el-button>
                <el-button size="medium" @click="pointStoreSearchReset">重 置</el-button>
              </div>
              <div class="block" style="float: right">
                <el-button type="primary" size="medium" @click="goAddPage">新 增</el-button>
              </div>
            </div>
            <el-divider></el-divider>
            <!--表格-->
            <div>
              <el-table
                :data="pointItemTable"
                style="width: 100%">
                <el-table-column
                  type="index"
                  label="序号"
                  width="50">
                </el-table-column>
                <el-table-column
                  label="兑换商品及名称"
                  width="400">
                  <template slot-scope="scope">
                    <div class="item-img-name" @click="checkItem(scope.row)">
                      <img :src="getImg(scope.row.imgUrl)" width="60" height="60" alt="商品图片">
                      <span class="item_name">{{scope.row.productName}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="兑换有效期"
                  width="350px">
                  <template slot-scope="scope">
                    <span>{{scope.row.exchangeStart}} - {{scope.row.exchangeEnd}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="credits"
                  label="所需积分"
                  width="100px">
                </el-table-column>
                <el-table-column
                  label="已兑换/总量（件）">
                  <template slot-scope="scope">
                    <span>{{scope.row.exchangeNum||'0'}} / {{scope.row.productNums}} &nbsp</span>
                    <el-tooltip v-if="scope.row.status=='1'" class="item" effect="light" content="点击修改库存"
                                placement="right">
                      <i style="color:#409EFF !important;"
                         class="el-icon-edit" @click="editInventoryOpen(scope.row)"
                      ></i>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column
                  label="兑换状态">
                  <template slot-scope="scope">
                    {{scope.row.status|productStatusFil}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="150">
                  <template slot-scope="scope">
                    <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                      操 作<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                      <el-dropdown-menu slot="dropdown">
                        <!--需要状态判断-->
                        <el-dropdown-item @click.native="checkItem(scope.row)">查 看</el-dropdown-item>
                        <el-dropdown-item v-if="scope.row.status=='1'" @click.native="endsEarly(scope.row)">提前结束
                        </el-dropdown-item>
                        <el-dropdown-item v-if="scope.row.status=='2'" @click.native="deletaItem(scope.row)">删 除
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>

              <pagination
                :total-elements="pointItemTotalElement"
                :change-callback="getItemList"
                ref="page"></pagination>
            </div>

            <!--模态框-->
            <el-dialog
              title="修改活动库存"
              :visible.sync="editInventoryVisible"
              width="576px"
              :before-close="editInventoryClose">
              <div>
                <el-form label-width="160px" :model="editForm">
                  <el-form-item label="活动名称：">
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
                                     size="medium"></el-input-number>
                    <span>件</span>
                  </el-form-item>
                </el-form>
              </div>

              <span slot="footer" class="dialog-footer">
    <el-button @click="editInventoryClose">取 消</el-button>
    <el-button type="primary" @click="editInventorySubmit">确 定</el-button></span>
            </el-dialog>

            <!--************************************-->
          </el-tab-pane>

          <el-tab-pane label="兑换记录" key="2" name="2">
            <!--************************************-->
            <div class="" title="输入搜索条件">
              <div class="block">
                <el-input placeholder="输入手机号码" v-model="exchangeRecordSearchForm.phone" size="medium"></el-input>
              </div>
              <div class="block">
                <el-date-picker
                  v-model="exchangeRecordSearchForm.start_exchangeTime"
                  @change="dayCheck"
                  type="date"
                  :clearable="false"
                  size="medium"
                  placeholder="开始日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="timestamp"
                  style="width: 190px">
                </el-date-picker>
                至
                <el-date-picker
                  v-model="exchangeRecordSearchForm.end_exchangeTime"
                  @change="dayCheck"
                  type="date"
                  size="medium"
                  :clearable="false"
                  placeholder="结束日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="timestamp"
                  style="width: 190px">
                </el-date-picker>
              </div>
              <div class="block" style="margin-left: 10px">
                <el-button type="primary" size="medium" @click="exchangeRecordSearchSubmit">查 询</el-button>
                <el-button size="medium" @click="exchangeRecordSearchReset">重 置</el-button>
                <el-button size="medium" @click="exchangeRecordSearchExport">导 出</el-button>
              </div>
            </div>
            <!--表格-->
            <div>
              <el-table
                :data="recordTable"
                style="width: 100%">
                <el-table-column
                  type="index"
                  label="序号"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="exchangeTime"
                  label="兑换时间">
                  <template slot-scope="scope">
                    <!--如果没有取货则兑换时间则显示&#45;&#45;-->
                    <span>{{scope.row.exchangeTime||'未兑换'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="兑换商品及名称"
                  width="300">
                  <template slot-scope="scope">
                    <div class="item-img-name">
                      <img :src="getImg(scope.row.imageURL)" width="60" height="60" alt="商品图片">
                      <span class="item_name">{{scope.row.productName}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="conCredits"
                  label="消耗积分">
                </el-table-column>
                <el-table-column
                  prop="goodCodes"
                  label="提货码">
                </el-table-column>
                <el-table-column
                  prop="phone"
                  label="手机号">
                </el-table-column>
                <el-table-column
                  prop="avaCredits"
                  label="可用积分">
                </el-table-column>
                <el-table-column
                  label="使用状态">
                  <template slot-scope="scope">
                    <span>{{scope.row.status|takeStatusFil}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="operator"
                  label="操作人"
                  width="150">
                </el-table-column>
              </el-table>

              <pagination
                :total-elements="recordTableTotalElement"
                :change-callback="getRecordList"
                ref="page"></pagination>
            </div>

            <!--************************************-->
          </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import pagination from '@/components/pagination/index'
  import {returnThumbnailUrl, uploadUrl} from '@/modules/file/api/upload' //图片操作API
  import {
    findPointsRuler,
    savePointsRuler,
    getPointProduct,
    modifyProductStock,
    deletePointProduct,
    overPointProduct,
    findRecord,
    exportRecord
  } from '../api/pointsRule'

  export default {
    name: 'pointsRule',
    components: {pagination},
    data() {
      return {
        loading: true, //加载
        btnLoading: false,//按钮锁定与加载
        tabsNum: '0',//标签页
        //*************↓积分规则标签页***************
        mode: false,//修改模式
        increasePoints: '',//储值增加积分
        pointeRuleForm: {
          id: '',
          consumptionAmount: 0,
          credits: 0,
          isTrue: 0
        },//积分规则
        //**************↓积分商城**************
        pointStoreSearchForm: {
          productName: '',
          status: ''
        },//积分商城搜索
        PSSFpageNum: 1,
        PSSFpageSize: 1,
        searchFormTmp: {
          t: '',
          n: '',
          ty: '',
          p: ''
        },//搜索记录
        exchangeStatus: [
          {value: 0, name: '未开始'},
          {value: 1, name: '进行中'},
          {value: 2, name: '结束了'},
        ],//兑换状态
        pointItemTable: [
          {
            id: '18895684788',
            name: '奥迪A8',
            startTime: '2018-12-12',
            endTime: '2019-12-12',
            point: '1999',
            carry: 5,
            stock: 10,
            status: '1',
          }
        ],//积分商品表格
        pointItemTotalElement: 0,//总条数
        editInventoryVisible: false,//修改库存模态框
        editTmpTitle: '',//混合标题
        editForm: {
          id: '',
          mode: '2',
          now: 0,
          num: 0
        },//编辑表单
        //**************↓兑换记录**************
        exchangeRecordSearchForm: {
          phone: '',
          start_exchangeTime: '',
          end_exchangeTime: ''
        },//兑换记录搜索表单
        recordTable: [],
        recordTableTotalElement: 0
      }
    },
    filters: {
      //商品/互动状态
      productStatusFil: function (val) {
        let v = parseInt(val)
        let text = '未知'
        switch (v) {
          case  0:
            text = '未开始'
            break
          case  1:
            text = '进行中'
            break
          case 2:
            text = '结束了'
            break
        }
        return text
      },
      //取货状态
      takeStatusFil: function (val) {
        let v = parseInt(val)
        let text = '暂无状态'
        switch (v) {
          case  0:
            text = '未取货'
            break
          case  1:
            text = '已取货'
            break
          default:
            text = '未知'
            break
        }
        return text
      },
    },
    mounted() {
      //返回后页面保持  ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
      this.tabsNum = this.$route.query.t == undefined ? '0' : this.$route.query.t //标签页
      this.pointStoreSearchForm.productName = this.$route.query.n == undefined ? '' : this.$route.query.n //搜索 商品名字
      this.pointStoreSearchForm.status = this.$route.query.ty == undefined ? '' : this.$route.query.ty //搜索 状态
      let pagenum = this.$route.query.p == undefined ? '' : this.$route.query.p //分页
      let pagesize = this.$route.query.ps == undefined ? '' : this.$route.query.ps //条数
      if (pagenum != '') {
        this.getItemList(pagenum, pagesize)
      }
      //返回后页面保持 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

      // 页面数据初始化,标签0的积分规则
      this.getPointsRule()

    },
    methods: {
      /**
       * ****************************积分规则********************************
       */
      /**
       * 切换标签页
       */
      tabsChange: function () {
        //把积分规则页的编辑模式关闭
        if (this.mode === true) {
          this.cancelSaveRule()
        }

        if (this.tabsNum == '0') {
          this.cancelSaveRule()
        } else if (this.tabsNum == '1') {
          this.getItemList(1, 10)
        } else if (this.tabsNum == '2') {
          this.exchangeRecordSearchSubmit()
        }

      },

      /**
       * 获取积分规则目前参数
       */
      getPointsRule: function () {
        findPointsRuler().then(res => {
          console.log(res)
          let data = res.obj
          this.pointeRuleForm.id = data.id //赋值id
          this.pointeRuleForm.consumptionAmount = data.consumptionAmount //赋值id
          this.pointeRuleForm.credits = data.credits //赋值id
          this.pointeRuleForm.isTrue = data.isTrue //赋值id
          this.loading = false //关闭加载
        }).catch(e => {
          this.$message.error('获取规则失败')
        })

      },

      /**
       * 进入修改模式
       */
      changeRulesMode: function () {
        this.mode = true
      },

      /**
       * 保存修改
       */
      submitSaveRules: function () {
        this.btnLoading = true;
        let form = this.pointeRuleForm
        console.log(form)
        savePointsRuler(form).then(res => {
          this.mode = false
          this.getPointsRule()
          this.btnLoading = false;
          this.$message.success('积分规则保存成功')
        }).catch(e => {
          this.btnLoading = false;
          this.$message.error('保存失败，' + e)
        })

      },
      /**
       * 取消修改
       */
      cancelSaveRule: function () {
        this.mode = false
        this.getPointsRule()
        //this.$message('未发生修改。')
      },

      /**
       * ****************************积分商城********************************
       */

      /**
       * 查询
       */
      pointStoreSearchSubmit: function () {
        this.getItemList(1, 10)
      },
      /**
       * 重置
       */
      pointStoreSearchReset: function () {
        this.pointStoreSearchForm = {
          productName: '',
          status: ''
        }
        this.$message('重置')
        this.pointStoreSearchSubmit()
      },
      /**
       * 获取商品列表
       */
      getItemList: function (pageNumber, pageSize) {
        console.log(pageNumber, '+', pageSize)
        this.PSSFpageNum = pageNumber
        this.PSSFpageSize = pageSize
        let form = this.pointStoreSearchForm

        getPointProduct(pageNumber, pageSize, form).then(res => {
          console.log(res)
          let data = res.obj
          this.pointItemTable = data.content
          this.pointItemTotalElement = data.totalElements

        }).catch(e => {
          this.$message.error('获取列表出错' + e)
        })
      },

      /**
       * 查看详情
       */
      checkItem: function (data) {
        let id = data.id
        if (id === '' || id == null || id == undefined) {
          this.$message.error('uuid not found')
        } else {
          let t = this.tabsNum
          let n = this.pointStoreSearchForm.productName
          let ty = this.pointStoreSearchForm.status
          let p = this.PSSFpageNum
          let ps = this.PSSFpageSize
          this.$router.push({path: '/member/views/pointGoodsDetail', query: {id: id, t: t, n: n, ty: ty, p: p, ps: ps}})
        }
      },
      /**
       * 提前结束对话框
       */
      endsEarly: function (data) {
        console.log(data)
        this.$confirm('确定提前结束吗？', '提前结束兑换活动', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          type: 'warning'
        }).then(() => {
          let id = data.id //活动/商品ID
          // console.log(id)
          this.endsEarlySubmit(id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })

        })
      },
      /**
       * 提交提前结束
       */
      endsEarlySubmit: function (id) {
        overPointProduct(id).then(res => {
          this.$message.success('提前结束成功')
          this.getItemList(this.PSSFpageNum, 10)
        }).catch(e => {
          this.$message.error('结束活动失败' + e)
        })

      },
      /**
       * 删除活动对话框
       */
      deletaItem: function (data) {
        console.log(data)
        this.$confirm('确定删除吗？', '删除活动', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          type: 'warning'
        }).then(() => {
          let id = data.id //活动/商品ID
          this.deletaItemSubmit(id)
        }).catch(() => {

          this.$message({
            type: 'info',
            message: '已取消删除'
          })

        })
      },
      /**
       * 提交删除活动
       */
      deletaItemSubmit: function (id) {
        deletePointProduct(id).then(res => {
          this.$message.success('删除成功')
          this.getItemList(this.PSSFpageNum, 10)
        }).catch(e => {
          this.$message.error('删除失败' + e)
        })
      },

      /**
       * 打开修改库存模态框
       */
      editInventoryOpen: function (data) {
        console.log(data)
        this.editTmpTitle = data.credits + '积分兑换商品 “ ' + data.productName + ' ”'
        this.editForm.id = data.id
        this.editForm.now = data.productNums
        this.editInventoryVisible = true
      },
      /**
       * 关闭修改库存模态框
       */
      editInventoryClose: function () {
        this.editTmpTitle = ''
        this.editInventoryReset()
        this.editInventoryVisible = false
      },
      /**
       * 修改库存提交编辑
       */
      editInventorySubmit: function () {
        let data = this.editForm
        let result = 0
        //判断增加还是减少，根据库存量做增减计算。
        if (data.mode == 1) {
          result = data.now - data.num  //减去
        } else if (data.mode == 2) {
          result = parseInt(data.now) + parseInt(data.num) //增加
        }
        //提交修改
        modifyProductStock(data.id, result).then(res => {
          this.editInventoryClose()
          this.getItemList(this.PSSFpageNum, 10)
          this.$refs.page.refresh()
        }).catch(e => {
          this.$message.error('修改失败，请刷新重试')
        })

        console.log(data)
      },
      /**
       *修改库存重置表单
       */
      editInventoryReset: function () {
        this.editForm = {
          id: '',
          mode: '2',
          num: 0
        }
      },
      /**
       *前往新增
       */

      goAddPage: function () {
        let t = this.tabsNum //切换到第二页
        this.$router.push({path: '/pointGoods/pointGoodsAdd', query: {t: t || 1}})
      },

      /**
       * ****************************兑换记录********************************
       */
      /**
       * 提交搜索
       */
      exchangeRecordSearchSubmit: function () {
        this.getRecordList(1, 10) //获取列表 1页，10条
      },
      /**
       * 重置搜索
       */
      exchangeRecordSearchReset: function () {
        this.exchangeRecordSearchForm = {
          phone: '',
          start_exchangeTime: '',
          end_exchangeTime: ''
        }
        this.$message('重置')
        this.exchangeRecordSearchSubmit()
      },
      /**
       * 导出
       */
      exchangeRecordSearchExport: function () {
        this.$message('敬请期待')
        // exportRecord().then(res => {
        //   window.location.href = res
        // }).catch(e => {
        //
        // })
      },

      /**
       * 获取列表
       */
      getRecordList: function (pageNumber, pageSize) {
        let data = this.exchangeRecordSearchForm

        let searchData = {
          phone: data.phone,
          start_exchangeTime: data.start_exchangeTime == null ? '' : this.format(data.start_exchangeTime),
          end_exchangeTime: data.end_exchangeTime == null ? '' : this.format(data.end_exchangeTime),
        }
        console.log(searchData)
        findRecord(pageNumber, pageSize, searchData).then(res => {
          let data = res.obj
          this.recordTable = data.content
          this.recordTableTotalElement = data.totalElements

        }).catch(e => {
          this.$message.error('获取详情错误' + e)

        })
      },
      /**
       * ****************************通    用********************************
       */

      /**
       * 换取图片
       */
      getImg: function (val) {
        let reg = /^[0-9]*$/
        if (reg.test(val)) {
          return returnThumbnailUrl(val)
        } else {
          let base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAIAAAC2BqGFAAAFLklEQVR42u2dfVPyMAzA9/0/GyLKy4kep6Kgk0NRFJ2gPD13t+vTbqVbm6QdyV+Ks01/ZFmbplmyZ0GRhBEwaAbNwqAZNINmYdAMmoVBM+gG8v7+3rGWx8dHBl1POs4yn88ZdKWkadrxLQz6P/n5+emAyenpKYO2dRTj8fj397f03xeLhU0L9/f3xwsa4q6fzWZhepIkNMqDwQDUF11fXx8LaOEEShEMh0O0r7P9oD8+PpBHfn5+rnfX6/XaDPrl5UUf8/f3N5WnaifozWZDO9TpdEqoAB7oEBzlaDSiUiOhokw12dIfxTjzkISKMiHr3W6HrwY46OVyGWA4Al+NhNCcg2ItZoERg1YGc3t7Kz48OzsLk3VVOCV00NvttopmIKz1lXqUoM1jCIR1+0GHM+fzHtJCBd3r9WzwhWDXOL0n5NqTs1Y89Ww2ixX08/Oz+WJy1ghdJ4HoTeuvlVBqm0GT2zX0BiM46FrhZkLW0J36By08sovGVKzjA+2uMQlrcecdHWgq1hGDdllo4bOWO3p9fY0J9MPDg8ebA5o16LYLLOgsyxxbw7Rr0PA0LGixunVvEI213P7JyUlMoH2F0nFYg7YPC/rz8xOIAgQLueV+vx8T6Lu7O48tQ9s1nObgoLvdrt/GQVnLbW42m6NYsJCwPsaVIb6/FiuUyECLByDCnNe7XccXVFKUXi6XUbCOHjTootkja9BABxTowWCAFgnywjrWPUNF9cvLy8BZtwQ0QijZhbVyYvfr6ysm0GJlRbsX1XgDHkg9ypSwQOxavnixWEQPGuiWdGTdhiRHEqOuxVo/p9US0FRJGpbprKAqYR+twDm+aWPXyp9Wq1XcoKkciJl1Cw8LCRkOh0GxHo/HLTz+Ruus9xbHwrzsIIcCmpZ1qV0X1o2jA2p1A32c2+2WkDVmuSXseh1UpTP0fr1nboQFusppwq0bS7vzmAcRLug9VgWei4uL0l7SNMUfMlnxqm63C4dbON/QCoVRlmObTCaGWVeDXKH1eh1sYUf6AoNXV1eWNRmn0+nb29tutxP/JXz609NTlXMIsHZmKLVJ4Upmos0g4wANgRs6ThQx6FzMZS/jKrIbNGhZsixTkhdiKRgdGejWCINm0AyahUEzaAbNCBg0g2Zh0C0BXZTOtbm43+9DHEEFFcPoHKMoh0Hr6SalQRz7EI+vN2CJX70HniIDbQ7xMOjmt5W7Hg1ayEHrn6dpavZXuekEClrupnSEgYDO340xmUyiBJ33IbSf/0mu6FySvY8XX7mD1ov3l6oROujGD0Mc0KvVqkinU0TZVj8IGmJDxwq0UrzCxnU0PuzXDLTyygb5siLHw951kIE2m1J+2psQdH7UbjQa6e3kP6/Xa3cfjbFgybKscM0G1yE/62tVQW9mPvL3rZQjM5tboKCr0n/kWW3VCRE00OYu4gB90HUU34SLxspDta4ayuKlqF0hLF1PO48V9P7vZV+OGruAllGKGV5pOST5Ai8PQ1jQcIksLqDFxE720QcVOF7Q+jzBZQmuzOr0kl9m0Dc3N35nRw1Be5+rFVUc3EGXJtvpcY8q0LUO6ccH2n4CrnyugNaTz6tOXMUB2q/r0K+0jzZUuY7S+ah8nOLoLNpwRNsFdFWYyQzaPtM3JtDFu191B+oXtKXrKKbbEKECGtchryyUEIR9pLB0keKiW63znRGALr2Ra/VS9Z25gC7iq0DBLxrXka/NvCxqPbqO0nuLEjQLaqyDhUEzaAbNCBg0g2Zh0AyaQbMw6DbJP0zQqPbAWqsMAAAAAElFTkSuQmCC'
          return base64
        }

      },

      /**
       * 日期检查
       */

      dayCheck: function () {
        let data = this.exchangeRecordSearchForm
        if (data.start_exchangeTime > data.end_exchangeTime && data.end_exchangeTime != '') {
          this.exchangeRecordSearchForm.start_exchangeTime = ''
          this.$message('开始日期不能晚于结束日期')
        }
      },
      /**
       * 工具
       * @param ts 时间戳
       * @returns {string} 格式化事时间
       */
      //时间格式化
      format(ts) {
        if (ts == '') {
          return ''
        }
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
      add0(m) {
        return m < 10 ? '0' + m : m
      },
    },
  }
</script>

<style scoped>
  /*public*/
  .block {
    display: inline-block;
    vertical-align: middle;
  }

  .card_title {
    font-size: 14px;
  }

  .point_rule_box {
    padding: 0;
  }

  .point_rule_inline {
    padding: 0;
  }

  .point_rule_inline .point_rule_inline {
    margin-bottom: 0 !important;
  }

  .rule_text {
    color: #409EFF;
  }

  .item_name {
    margin-left: 8px;
  }

  .item-img-name {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .item-img-name img {
    height: 60px;
    width: auto;
  }

  .item-img-name img {
    border-radius: 4px;
  }

  .item-img-name span:hover {
    color: #409eff;
  }

</style>
