<template>
  <div class="app-container">
    <!--详情卡片-->
    <el-card class="box-card">
      <div slot="header" class="card_header">
        <span>会员详情</span>
        <el-button type="text" style="margin-left: auto" @click="goBack">返回上一页</el-button>
      </div>
      <!--内容-->
      <div class="card_content">
        <div>
          <el-tabs v-model="memberTabsNum" @tab-click="memberTabsChange">
            <el-tab-pane label="基本信息" name="1">

              <el-card class="box-card" style="margin-top: 10px" shadow="never">
                <div slot="header" class="clearfix">
                  <span style="font-size: 14px">会员基本信息</span>
                </div>
                <div>
                  <!--基本信息的表格-->
                  <table class="simpleInformation">
                    <tr>
                      <td>名 称</td>
                      <td>{{memberInfo.nickname}}</td>
                    </tr>
                    <tr>
                      <td>卡 号</td>
                      <td>{{memberInfo.memberNum}}</td>
                    </tr>
                    <tr>
                      <td>手机号</td>
                      <td>{{memberInfo.phone}}</td>
                    </tr>
                    <tr>
                      <td>性 别</td>
                      <td>{{memberInfo.sex === 1?'男':'女'}}</td>
                    </tr>
                    <tr>
                      <td>生日</td>
                      <td>{{memberInfo.birthday}}</td>
                    </tr>
                    <tr>
                      <td>注册日期</td>
                      <td>{{memberInfo.createTime}}</td>
                    </tr>
                    <tr>
                      <td>最近更新日期</td>
                      <td>{{memberInfo.updateTime}}</td>
                    </tr>

                  </table>
                </div>

              </el-card>

            </el-tab-pane>
            <el-tab-pane label="储值账户" name="2">
              <!--储值账户-->
              <!--卡片-->
              <div class="card_group">

                <div class="card_item">
                  <el-card class="box-card">
                    <div class="text item tools_box">
                      <div class="tools_img">
                        <img src="../../../assets/images/member/储值余额.png" alt="">
                      </div>
                      <div class="tools_text">
                        <p>储值余额
                          <el-tooltip class="item" effect="light" content="(实际储值金额+赠送金额)-总消费金额" placement="top-start">
                            <i class="el-icon-info"></i>
                          </el-tooltip>
                        </p>
                        <p>￥{{walletCardDara.balance}}</p>
                      </div>
                    </div>
                  </el-card>
                </div>

                <!--<div class="card_item">-->
                <!--<el-card class="box-card">-->
                <!--<div class="text item tools_box">-->
                <!--<div class="tools_img">-->
                <!--<img src="../../../assets/images/member/储值总额.png" alt="">-->
                <!--</div>-->
                <!--<div class="tools_text">-->
                <!--<p>储值总额-->
                <!--<el-tooltip class="item" effect="light" content="实际储值金额+赠送金额" placement="top-start">-->
                <!--<i class="el-icon-info"></i>-->
                <!--</el-tooltip>-->
                <!--</p>-->
                <!--<p>￥{{walletCardDara.total}}</p>-->
                <!--</div>-->
                <!--</div>-->
                <!--</el-card>-->
                <!--</div>-->
              </div>
              <!--搜索-->
              <div>
                <!--单号-->
                <div class="block">
                  <el-input placeholder="交易单号" size="medium" v-model="walletAccountSearchForm.number"></el-input>
                </div>
                <!--日期-->
                <div class="block">
                  <el-date-picker
                    v-model="walletAccountSearchForm.startTime"
                    @change="walletAccountDayCheck"
                    type="date"
                    size="medium"
                    placeholder="开始日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    style="width: 190px">
                  </el-date-picker>
                  至
                  <el-date-picker
                    v-model="walletAccountSearchForm.endTime"
                    @change="walletAccountDayCheck"
                    type="date"
                    size="medium"
                    placeholder="结束日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    style="width: 190px">
                  </el-date-picker>
                </div>
                <!--交易类型-->
                <div class="block">
                  <el-select size="medium" v-model="walletAccountSearchForm.tradeType" placeholder="请选择交易类型"
                             style="width: 150px">
                    <el-option
                      v-for="item in transactionOption"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <!--门店-->
                <!--<div class="block">-->
                <!--<el-input placeholder="门店" size="medium" v-model="walletAccountSearchForm.store"-->
                <!--style="width: 150px"></el-input>-->
                <!--</div>-->


                <div class="block" style="margin-left: 10px">
                  <el-button size="medium" type="primary" @click="getWalletTransList(1,10)">查 询</el-button>
                  <el-button size="medium" type="" @click="walletAccountSearchReset">重 置</el-button>
                  <el-button size="medium" type="" @click="walletAccountSearchExport">导 出</el-button>
                </div>

              </div>
              <el-divider></el-divider>
              <!--表格-->
              <div>
                <!--表格-->
                <el-table
                  :data="walletTable"
                  style="width: 100%">
                  <el-table-column
                    type='index'
                    label="序号"
                    width="60">
                  </el-table-column>
                  <el-table-column
                    prop="storedNum"
                    label="交易单号"
                    width="220">
                  </el-table-column>
                  <el-table-column
                    prop="createTime"
                    label="交易时间">
                  </el-table-column>
                  <el-table-column
                    label="交易类型">
                    <template slot-scope="scope">
                      <span>{{scope.row.tradeType|tradeTypeFil}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="tradingMoney"
                    label="交易金额">
                  </el-table-column>
                  <el-table-column
                    prop="giftMoney"
                    label="赠送">
                  </el-table-column>
                  <el-table-column
                    prop="postTradingMoney"
                    label="交易后余额">
                  </el-table-column>
                  <el-table-column
                    label="支付方式">
                    <template slot-scope="scope">
                      <span>{{scope.row.payWay|payWayFil}}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <pagination
                  :total-elements="walletTableTotalElement"
                  :change-callback="getWalletTransList"
                  ref="page"></pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="积分账户" name="3">
              <!--卡片-->
              <div class="card_group">

                <div class="card_item">
                  <el-card class="box-card">
                    <div class="text item tools_box">
                      <div class="tools_img">
                        <img src="../../../assets/images/member/可用积分.png" alt="">
                      </div>
                      <div class="tools_text">
                        <p>可用积分
                          <el-tooltip class="item" effect="light" content="(实际累积积分+赠送积分)-总消耗积分" placement="top-start">
                            <i class="el-icon-info"></i>
                          </el-tooltip>
                        </p>
                        <p>￥{{pointCardDara.balance}}</p>
                      </div>
                    </div>
                  </el-card>
                </div>

                <!--<div class="card_item">-->
                <!--<el-card class="box-card">-->
                <!--<div class="text item tools_box">-->
                <!--<div class="tools_img">-->
                <!--<img src="../../../assets/images/member/积分总额.png" alt="">-->
                <!--</div>-->
                <!--<div class="tools_text">-->
                <!--<p>积分总额-->
                <!--<el-tooltip class="item" effect="light" content="实际累积积分+赠送积分" placement="top-start">-->
                <!--<i class="el-icon-info"></i>-->
                <!--</el-tooltip>-->
                <!--</p>-->
                <!--<p>￥{{pointCardDara.total}}</p>-->
                <!--</div>-->
                <!--</div>-->
                <!--</el-card>-->
                <!--</div>-->
              </div>
              <!--搜索-->
              <div>
                <!--日期-->
                <div class="block">
                  <el-date-picker
                    v-model="pointAccountSearchForm.startTime"
                    @change="pointAccountDayCheck"
                    type="date"
                    size="medium"
                    placeholder="开始日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    style="width: 190px">
                  </el-date-picker>
                  至
                  <el-date-picker
                    v-model="pointAccountSearchForm.endTime"
                    @change="pointAccountDayCheck"
                    type="date"
                    size="medium"
                    placeholder="结束日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    style="width: 190px">
                  </el-date-picker>
                </div>
                <!--交易类型-->
                <div class="block">
                  <el-select size="medium" v-model="pointAccountSearchForm.pointType" placeholder="请选择积分类型"
                             style="width: 150px">
                    <el-option
                      v-for="item in pointTransactionOption"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <!--按钮-->
                <div class="block" style="margin-left: 10px">
                  <el-button size="medium" type="primary" @click="getPointTransList(1,10)">查 询</el-button>
                  <el-button size="medium" type="" @click="pointAccountSearchReset">重 置</el-button>
                  <el-button size="medium" type="" @click="pointAccountSearchExport">导 出</el-button>
                </div>

              </div>
              <el-divider></el-divider>
              <!--表格-->
              <div>
                <!--表格-->
                <el-table
                  :data="pointTable"
                  style="width: 100%">
                  <el-table-column
                    type='index'
                    label="序号"
                    width="60">
                  </el-table-column>
                  <el-table-column
                    prop="tradeTime"
                    label="交易时间">
                  </el-table-column>
                  <el-table-column
                    prop="creditsType"
                    label="积分类型">
                  </el-table-column>
                  <el-table-column
                    prop="tradeScores"
                    label="交易积分">
                  </el-table-column>
                  <el-table-column
                    prop="avaCredits"
                    label="交易后积分">
                  </el-table-column>
                  <el-table-column
                    prop="operator"
                    label="操作人">
                    <template slot-scope="scope">
                      <span>{{scope.row.operator || '未知'}}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <pagination
                  :total-elements="pointTableTotalElement"
                  :change-callback="getPointTransList"
                  ref="page"></pagination>
              </div>

            </el-tab-pane>
          </el-tabs>
        </div>
        <!--<div class="edit_btn" v-if="memberTabsNum=='1'">-->
        <!--<el-button type="primary" size="medium" @click="editMemberOpen">编辑</el-button>-->
        <!--<el-button size="medium" @click="deleteMemberOpen">删除（未开放）</el-button>-->
        <!--</div>-->
      </div>
    </el-card>
    <!--足迹卡片-->
    <el-card class="box-card history">
      <div slot="header" class="clearfix">
        <span>商品浏览足迹</span>
      </div>
      <div class="card_content">
        <div>
          <el-tabs v-model="activeHistory" @tab-click="historyChange">
            <el-tab-pane label="浏览记录" name="footprint">
              <template>
                <el-table
                  :data="footprintTable"
                  style="width: 100%">
                  <el-table-column
                    prop="updateTime"
                    label="日期">
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="商品">
                  </el-table-column>
                </el-table>

                <pagination
                  :total-elements="footprintTableTotal"
                  :change-callback="getMemberFootList"
                  ref="footPage"></pagination>
              </template>
            </el-tab-pane>

            <el-tab-pane label="访问量统计" name="statistics">
              <template>
                <el-table
                  :data="statisticsTable"
                  style="width: 100%">
                  <el-table-column
                    prop="name"
                    label="商品">
                  </el-table-column>
                  <el-table-column
                    prop="count"
                    label="次数">
                  </el-table-column>
                </el-table>
                <pagination
                  :total-elements="footprintTableTotal"
                  :change-callback="getMemberFootList"
                  ref="statisticsPage"></pagination>
              </template>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-card>

    <!--模态框-->
    <el-dialog
      title="编辑会员"
      :visible.sync="editMemberDialogVisible"
      width="576px"
      :before-close="editMemberClose">
      <!--***-->
      <el-form :model="editForm" :rules="editMemberRules" ref="editForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone" readonly disabled></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio v-model="editForm.sex" :label="2">女</el-radio>
          <el-radio v-model="editForm.sex" :label="1">男</el-radio>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="editForm.birthday"
            type="date"
            size="medium"
            placeholder="选择生日"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-form>

      <!--***-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="editMemberClose">取 消</el-button>
    <el-button type="primary" @click="editMemberSubmit">保 存</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
  import pagination from '@/components/pagination/index'
  import {
    memberDetail
    , editMember
    , findOneUserRecored
    , findOneUserPoint,
    getMemberFootList,
    getMemberFootCount
  } from '../api/member'

  export default {
    name: 'memberDetail',
    components: {pagination},
    data() {
      return {
        loading: false,//加载
        memberTabsNum: '1',//默认标签页
        urlId: '', //接收URL中的id
        //基本信息***********************************
        editMemberDialogVisible: false,//编辑会员模态框
        memberInfo: {},
        editForm: {
          id: '',
          nickname: '',
          phone: '',
          sex: '',
          birthday: ''
        },
        editMemberRules: {
          nickname: [
            {required: true, message: '请输入完整姓名', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 2 到 12 个字符', trigger: 'blur'}
          ],
          sex: [
            {required: true, message: '必须选择性别', trigger: 'blur'},
          ],
          birthday: [
            {required: true, message: '必须选择生日', trigger: 'blur'},
          ]
        },//编辑表单验证
        deleteVisible: false,//删除

        //储值***************************************
        walletCardDara: {
          balance: 100,
          total: 10.0
        },//储值卡片数据
        walletAccountSearchForm: {
          id: '',
          number: '',
          startTime: '',
          endTime: '',
          tradeType: '',
          store: ''
        },//储值搜索条件
        transactionOption: [
          {value: '', name: '全部'},
          {value: 1, name: '充值'},
          {value: 2, name: '消费'},
          {value: 3, name: '退款'},
          {value: 4, name: '导入'}
        ],//交易类型选项
        walletTable: [
          {
            number: '12345',
            time: '2018-12-24 24:00:00',
            type: '1',
            price: 10.1,
            gift: 1.1,
            balance: 128,
            payWay: '1'
          }
        ],//表格数据
        walletTableTotalElement: 0,//总条数

        //积分*********************************
        pointCardDara: {
          balance: 0,
          total: 0
        },//卡片信息
        pointAccountSearchForm: {
          id: '',
          startTime: '',
          endTime: '',
          pointType: '',
        },//搜索条件
        pointTransactionOption: [
          {value: '', name: '全部'},
          {value: 1, name: '积分商品兑换'},
          {value: 2, name: '充值赠送'},
          {value: 3, name: '消费'},
          {value: 4, name: '退款'},
          {value: 6, name: '开卡赠送'},
        ],//交易类型选项
        pointTable: [
          {
            time: '2018-12-24 24:00:00',
            type: '1',
            point: 10.1,
            balance: 128,
            username: '收银员1'
          }
        ],//表格
        pointTableTotalElement: 0,//总条数


        //------------------足迹--------------------
        activeHistory: 'footprint',
        footprintTable: [],
        footprintTableTotal: 0,
        statisticsTable: [],
        statisticsTotal: 0,


      }
    },
    filters: {
      tradeTypeFil: function (val) {
        if (val == '' || val == null || val == undefined) {
          return '未知'
        }
        let text = '';
        switch (parseInt(val)) {
          case 1:
            text = '充值';
            break;
          case 2:
            text = '消费';
            break;
          case 3:
            text = '退款';
            break;
          case 4:
            text = '导入';
            break;
          default:
            text = '其他';
            break;
        }
        return text
      },
      payWayFil: function (val) {
        if (val == '' || val == null || val == undefined) {
          return '未知'
        }
        let text = '';
        switch (parseInt(val)) {
          case 1:
            text = '微信';
            break;
          case 2:
            text = '阿里';
            break;
          case 3:
            text = '会员储值卡';
            break;
          case 4:
            text = 'H5';
            break;
          case 6:
            text = '导入';
            break;
          default:
            text = '其他';
            break;
        }
        return text
      }
    },
    mounted() {
      //接收ID
      this.urlId = this.$route.query.id == undefined ? '' : this.$route.query.id; //接收ID
      this.walletCardDara.balance = this.$route.query.w || 0; //接收
      this.pointCardDara.balance = this.$route.query.sc || 0; //接收
      // 赋值id
      this.walletAccountSearchForm.id = this.urlId;
      this.pointAccountSearchForm.id = this.urlId;
      this.editForm.id = this.urlId;
      //获取详情
      this.getMemberDetail();

      this.historyChange()
    },
    methods: {
      /**
       * 足迹
       **/
      historyChange: function () {
        let name = this.activeHistory;
        console.log(name);
        if (name === 'footprint') {
          this.getMemberFootListRefresh()
        } else if (name === 'statistics') {
          this.getMemberFootCount()
        }
      },

      /**
       * 获取足迹
       */
      getMemberFootList: function (pageNumber = 1, pageSize = 10,) {
        getMemberFootList(pageSize, pageNumber, this.urlId).then(res => {
          let data = res.obj;
          this.footprintTable = data.content;
          this.footprintTableTotal = data.totalElements
        }).catch(e => {

        })
      },
      getMemberFootListRefresh: function () {
        this.$refs['footPage'].refresh()
      },

      getMemberFootCount: function (pageSize = 10, pageNumber = 1) {
        getMemberFootCount(pageSize, pageNumber, this.urlId).then(res => {
          let data = res.obj;
          let netObj = data;
          console.log(netObj);
          let array = [];
          for (let item in netObj) {
            console.log(item);
            let obj = {};
            obj.name = item;
            obj.count = netObj[item];
            array.push(obj)
          }
          console.log(array);

          this.statisticsTable = array
          // this.statisticsTableTotal = data.totalElements
        }).catch(e => {

        })
      },
      getMemberFootCountRefresh: function () {
        this.$refs['statisticsPage'].refresh()
      },
      /**
       * ******************基本信息*************************
       */

      /**
       * 获取基本信息
       */
      getMemberDetail: function () {
        memberDetail(this.urlId).then(response => {
          this.memberInfo = response.obj
        })
      },

      /**
       *删除会员提示框
       */
      deleteMemberOpen: function () {
        this.$confirm('确定删除吗？删除后会员积分将清空', '删除会员', {
          confirmButtonText: '确定删除',
          cancelButtonText: '取 消',
          type: 'warning'
        }).then(() => {
          let id = this.urlId;
          this.deleteMember(id)

        }).catch(() => {

          this.$message({
            type: 'info',
            message: '已取消删除'
          })

        })
      },

      /**
       *删除会员
       */
      deleteMember: function (data) {
        //被删除的id
        console.log(data);
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      },

      /**
       *打开编辑模态框
       */
      editMemberOpen: function () {
        let data = this.deepCopy(this.memberInfo);
        this.editForm.id = data.id;
        this.editForm.phone = data.phone;
        this.editForm.sex = data.sex;
        this.editForm.nickname = data.nickname;
        this.editForm.birthday = data.birthday || '1970-01-01';
        this.editMemberDialogVisible = true
      },

      /**
       *关闭编辑模态框
       */
      editMemberClose: function () {
        this.resetForm('editForm');
        this.editMemberDialogVisible = false
      },
      /**
       *提交编辑 并 关闭编辑模态框
       */
      editMemberSubmit: function () {

        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            //验证通过
            editMember(this.editForm).then(response => {
              this.$refs.page.refresh();
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.getMemberDetail();
              this.closeEditDialog()
            }).catch(() => {
              this.loading = false
            });

            this.resetForm('editForm');
            this.editMemberDialogVisible = false //关闭模态框
          } else {
            console.log('有未输入的内容');
            return false
          }
        })

      },

      /**
       * ******************储   值*************************
       */
      /**
       *检查时间
       * 如果不对，则修改为里结束日期的前31天。
       */
      walletAccountDayCheck() {
        // let timestamp = (new Date()).getTime()
        let startTime = this.walletAccountSearchForm.startTime;
        let endTime = this.walletAccountSearchForm.endTime;
        if (endTime < startTime && (startTime != '' && startTime != null) && (endTime != '' && endTime != null)) {
          this.$message.error('结束日期不能早于开始日期');
          this.$set(this.walletAccountSearchForm, 'startTime', this.walletAccountSearchForm.startTime);
          this.$set(this.walletAccountSearchForm, 'endTime', this.walletAccountSearchForm.startTime)
        }
      },

      /**
       * 获取列表
       */
      getWalletTransList: function (pageNum, pageSize) {
        //翻页控制遗留方法
        this.walletAccountSearchSubmit(pageNum, pageSize)
      },

      /**
       * 发起搜索
       */
      walletAccountSearchSubmit: function (pageNum, pageSize) {
        let data = this.walletAccountSearchForm;
        findOneUserRecored(pageNum, pageSize, data).then(res => {
          let data = res.obj;
          this.walletTable = data.content;
          this.walletTableTotalElement = data.totalElements //总条数
        }).catch(e => {

        });
        // console.log(data)
      },
      /**
       * 重置搜索
       */
      walletAccountSearchReset: function () {
        this.walletAccountSearchForm = {
          id: this.urlId,//ID不能清空
          number: '',
          startTime: '',
          endTime: '',
          tradeType: '',
          store: ''
        };
        this.getWalletTransList(1, 10) //重新发起搜索
      },
      /**
       * 导出
       */
      walletAccountSearchExport: function () {
        this.$message('敬请期待')
      },


      /**
       * ******************积    分*************************
       */

      pointAccountDayCheck: function () {
        // let timestamp = (new Date()).getTime()
        let startTime = this.pointAccountSearchForm.startTime;
        let endTime = this.pointAccountSearchForm.endTime;
        if (endTime < startTime && (startTime != '' && startTime != null) && (endTime != '' && endTime != null)) {
          this.$message.error('结束日期不能早于开始日期');
          this.$set(this.pointAccountSearchForm, 'startTime', this.pointAccountSearchForm.startTime);
          this.$set(this.pointAccountSearchForm, 'endTime', this.pointAccountSearchForm.startTime)
        }
      },

      /**
       * resetForm 重置表单
       */
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      /**
       * 获取列表
       */
      getPointTransList: function (pageNum, pageSize) {
        this.pointAccountSearchSubmit(pageNum, pageSize)
      },
      /**
       * 发起搜索
       */
      pointAccountSearchSubmit: function (pageNum, pageSize) {
        let data = this.pointAccountSearchForm;

        findOneUserPoint(pageNum, pageSize, data).then(res => {
          let data = res.obj;
          this.pointTable = data.creditsInfoDTOList;
          this.pointTableTotalElement = data.totalElements
        }).catch(e => {

        });
        console.log(data)
      },
      /**
       * 重置搜索
       */
      pointAccountSearchReset: function () {
        this.pointAccountSearchForm = {
          id: this.urlId,//ID不能清空
          startTime: '',
          endTime: '',
          pointType: '',
        };
        this.getPointTransList(1, 10) //重新发起搜索
      },
      /**
       * 导出
       */
      pointAccountSearchExport: function () {
        this.$message('敬请期待')
      },
      /**
       * ******************通    用*************************
       */
      /**
       * 切换标签页
       */
      memberTabsChange: function () {
        //console.log(this.memberTabsNum)
        let tabNum = this.memberTabsNum;
        if (tabNum == 1) {
          this.getMemberDetail()
        } else if (tabNum == 2) {
          this.getWalletTransList(1, 10)
        } else if (tabNum == 3) {
          this.getPointTransList(1, 10)
        }
      },

      /**
       * 返回上一页
       */
      goBack: function () {
        this.$router.go('-1')
      },
      /**
       * 深拷贝 防止对象污染用的
       */
      deepCopy: function (obj) {
        var result = Array.isArray(obj) ? [] : {};
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
    }
  }
</script>

<style scoped>
  .block {
    display: inline-block;
    vertical-align: middle;
    margin: 0 10px;
  }

  .card_content {
    position: relative;
  }

  .card_header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 0;
    height: 20px;
  }

  .edit_btn {
    position: absolute;
    right: 0;
    top: 0;
  }

  .simpleInformation {
    width: 100%;
  }

  .simpleInformation tr td {
    height: 36px;
    font-size: 14px;
    color: #333;
  }

  .simpleInformation tr td:nth-child(1) {
    color: #808080;
    width: 160px;
    text-align: right;
    padding: 0 10px 0 0;
  }

  .simpleInformation tr td:nth-child(1):after {
    content: '：';
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

  .history {
    margin-top: 15px;
  }


</style>
