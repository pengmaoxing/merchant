<template>
  <div class="app-container" v-loading="loading">

    <!--订单管理-->
    <div class="order-container" v-show="currentPage==='order'">
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
              <el-button type="primary" size="medium" @click="refreshOrderList" style="margin-left: 10px"
                         icon="el-icon-search">搜 索
              </el-button>
              <el-button size="medium" @click="goToTicketSetting" icon="el-icon-setting">景点与票务设置</el-button>
            </div>

          </div>
        </div>
      </div>
      <!--分割线-->
      <el-divider content-position="left">订单</el-divider>
      <template>
        <el-table
          :data="orderTableData"
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
          <el-table-column
            label="详情">
            <template slot-scope="scope">
              <el-button type="text" @click="orderDetailsOpen(scope.row.id)">订单详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total-elements="orderTotalElements"
          :change-callback="getOrderList"
          ref="orderList"></pagination>
      </template>

      <!--模态框-->
      <template>
        <el-dialog
          title="订单详情"
          :visible.sync="orderDetailsVisivble"
          :close-on-click-modal="false"
          width="576px"
          :before-close="orderDetailsClose">
          <div>
            <el-table
              :data="orderDetails"
              style="width: 100%">
              <el-table-column
                type="index"
                label="序号"
                width="50">
              </el-table-column>
              <el-table-column
                prop="name"
                label="票名"
                :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column
                prop="number"
                label="份数"
                width="100">
              </el-table-column>
            </el-table>
          </div>
          <span slot="footer" class="dialog-footer">
    <el-button @click="orderDetailsClose">关 闭</el-button>
  </span>
        </el-dialog>
      </template>


    </div>
    <!--票务商品管理-->
    <div class="ticket-container" v-show="currentPage==='ticket'">
      <div class="search_bar">
        <div style="width: 100%">
          <!--按钮-->
          <div class="block">
            <el-button type="primary" size="medium" @click="" icon="el-icon-plus" @click="ticketEditOpen">添加票型
            </el-button>
            <el-button type="danger" size="medium" @click="" icon="el-icon-delete" @click="ticketDeleteBefore">批量删除
            </el-button>
          </div>
          <div class="block" style="float: right">
            <el-button type="primary" size="medium" @click="spotManagementOpen" icon="el-icon-edit-outline">景点信息管理
            </el-button>
            <el-button size="medium" @click="goToOrderList" icon="el-icon-arrow-left">返回订单列表</el-button>
          </div>
        </div>
      </div>
      <!--分割线-->
      <el-divider content-position="left">票务</el-divider>
      <template>
        <el-table
          ref="ticketMultipleTable"
          :data="ticketTableData"
          @selection-change="ticketMultiple"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            width="60">
          </el-table-column>
          <el-table-column
            label="门票封面">
            <template slot-scope="scope">
              <img :src="imgFil(scope.row.imageUrl)" class="ticket-img-box" alt="">
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="门票名称">
          </el-table-column>
          <el-table-column
            prop="description"
            label="门票描述（内部）">
          </el-table-column>
          <el-table-column
            prop="introduction"
            label="门票介绍（客户）">
          </el-table-column>
          <el-table-column
            prop="price"
            label="门票价格(元)">
          </el-table-column>
          <el-table-column
            prop="number"
            label="门票库存(份)">
          </el-table-column>
          <el-table-column
            label="详情">
            <template slot-scope="scope">
              <el-button type="text" @click="ticketEditModifyOpen(scope.row)">编辑门票</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total-elements="ticketTotalElements"
          :change-callback="getTicketList"
          ref="ticketList"></pagination>
      </template>
      <!--模态框-->
      <template>

        <!--景点信息管理-->
        <el-dialog
          title="景点信息管理"
          :visible.sync="spotManagementVisible"
          width="576px"
          :close-on-click-modal="false"
          :before-close="spotManagementClose">
          <div>
            <el-form :model="scenicForm" :rules="scenicRules" ref="scenicForm" label-width="120px" label-suffix="：">
              <el-form-item label="景区照" prop="imageUrl">
                <el-upload
                  class="logo-uploader"
                  :action="url"
                  :accept="accept"
                  :data="filesData"
                  name="file"
                  :show-file-list="false"
                  :on-success="scenicPicUploadSuccess"
                  :on-error="imageFailed"
                  :before-upload="beforeImgUpload"
                  :headers="headers">
                  <img v-if="scenicImgURL"
                       :src="scenicImgURL" class="logo">
                  <i v-else class="el-icon-plus logo-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="营业时间">
                <el-form-item class="block" prop="startTime">
                  <el-time-picker
                    class="time-input-width"
                    v-model="scenicForm.startTime"
                    placeholder="开始营业时间"
                    format="HH:mm"
                    value-format="HH:mm">
                  </el-time-picker>
                </el-form-item>
                <span>至</span>
                <el-form-item class="block" prop="endTime">
                  <el-time-picker
                    class="time-input-width"
                    v-model="scenicForm.endTime"
                    placeholder="结束营业时间"
                    format="HH:mm"
                    value-format="HH:mm">
                  </el-time-picker>
                </el-form-item>
              </el-form-item>
              <el-form-item label="景点名称" prop="name">
                <el-input v-model.trim="scenicForm.name" class="input-width" placeholder="请输入景点名称"></el-input>
              </el-form-item>
              <el-form-item label="景点简介" prop="note">
                <el-input v-model.trim="scenicForm.note" class="input-width" placeholder="请输入景点简介"></el-input>
              </el-form-item>

            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
    <el-button @click="spotManagementClose">取 消</el-button>
    <el-button type="primary" @click="scenicSubmitBefore" :loading="btnLoading">确 定</el-button>
  </span>
        </el-dialog>

        <!--门票添加编辑-->
        <el-dialog
          title="门票配置"
          :visible.sync="ticketEditVisible"
          :close-on-click-modal="false"
          width="576px"
          :before-close="ticketEditClose">
          <div>
            <el-form :model="ticketForm" ref="ticketForm" label-width="120px" label-suffix="：">

              <el-form-item label="门票封面" prop="imageUrl">
                <el-upload
                  class="logo-uploader"
                  :action="url"
                  :accept="accept"
                  :data="filesData"
                  name="file"
                  :show-file-list="false"
                  :on-success="ticketPicUploadSuccess"
                  :on-error="imageFailed"
                  :before-upload="beforeImgUpload"
                  :headers="headers">
                  <img v-if="ticketFormImgURL"
                       :src="ticketFormImgURL" class="logo">
                  <i v-else class="el-icon-plus logo-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="门票名称" prop="name">
                <el-input v-model.trim="ticketForm.name" placeholder="门票的销售名称" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="门票描述" prop="description">
                <el-input v-model.trim="ticketForm.description" placeholder="面向工作人员的描述" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="门票库存" prop="number">
                <el-input-number v-model.trim="ticketForm.number" :precision="0" :step="10" :min="0" :max="999999999"
                                 class="input-width"></el-input-number>
              </el-form-item>
              <el-form-item label="门票价格" prop="price">
                <el-input-number v-model.trim="ticketForm.price" :precision="2" :step="1" :min="0" :max="999999999"
                                 class="input-width"></el-input-number>
              </el-form-item>
              <el-form-item label="门票介绍" prop="introduction">
                <el-input v-model.trim="ticketForm.introduction" placeholder="面向客户的描述，显示在客户端"
                          class="input-width"></el-input>
              </el-form-item>

            </el-form>

          </div>
          <span slot="footer" class="dialog-footer">
    <el-button @click="ticketEditClose">取 消</el-button>
    <el-button type="primary" @click="ticketSubmitBefore" :loading="btnLoading">确 定</el-button>
  </span>
        </el-dialog>

      </template>
    </div>

  </div>
</template>

<script>
  import pagination from '@/components/pagination/index'
  import {returnThumbnailUrl, uploadUrl, newUploadUrl, returnFilesUrl} from '@/modules/file/api/upload' //图片操作API
  import {url} from '@/utils/request'
  import {
    getOrderList,
    getTicketList,
    findScenic,
    scenicSave,
    scenicModify,
    ticketSave,
    ticketModify,
    ticketDelete,
    getTicketType
  } from '../api/ticketSales'

  export default {
    name: "ticketSales",
    components: {pagination},
    data() {
      return {
        loading: true,
        currentPage: 'order',  //order与ticket
        btnLoading: false,

        //图片上传
        accept: 'image/png,image/jpg,image/jpeg',
        filesData: {
          module: 'image'
        },
        url: newUploadUrl + '/upload/path/file_upload',
        headers: {
          authorized: sessionStorage.token
        },

        //订单页
        searchDays: '0',//搜索天数标记
        searchForm: {
          days: [],
        },
        orderTableData: [],//列表
        orderTotalElements: 0,

        orderDetailsVisivble: false,
        orderDetails: [],

        //票务页
        ticketTableData: [],
        ticketTotalElements: 0,

        spotManagementVisible: false,

        scenicForm: {
          id: '',
          name: '',
          merchantId: '',
          startTime: '',
          endTime: '',
          imageUrl: '',
          note: ''
        },
        scenicImgURL: '',
        scenicRules: {
          imageUrl: [
            {required: true, message: '图片还未上传', trigger: ['blur', 'change']},
          ],
          startTime: [
            {required: true, message: '请选择开始时间', trigger: ['blur', 'change']},
          ],
          endTime: [
            {required: true, message: '请选择结束时间', trigger: ['blur', 'change']},
          ],
          note: [
            {required: true, message: '请输入简介', trigger: 'blur'},
            {min: 1, max: 18, message: '长度在 1 到 18个字符', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入景点名称', trigger: 'blur'},
            {min: 1, max: 10, message: '长度在 1 到 10个字符', trigger: 'blur'}
          ],
        },

        ticketEditVisible: false,
        ticketForm: {
          id: '',
          name: '',
          description: '',
          number: 0,
          price: 0,
          imageUrl: '',
          introduction: '',
          merchantId: '',
        },
        ticketFormImgURL: '',
        multipleSelection: [],//多选
      }
    },
    mounted() {
      //获取用户ID
      this.merchantId = sessionStorage.merchantId;
      //发起默认搜索
      this.defaultSearch()
    },
    methods: {
      //---------------------------------------订单-------------------------------------------
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
        setTimeout(() => {
          this.$refs['orderList'].refresh()
        }, 200)
      },

      /**
       * 获取订单列表
       */
      getOrderList: function (pageNumber, pageSize) {
        let id = this.merchantId;
        let st = this.format(this.searchForm.days[0]) || '';
        let et = this.format(this.searchForm.days[1]) || '';
        console.log(pageNumber, pageSize, st, et);
        // 订单接口
        getOrderList(pageNumber, pageSize, id, st, et).then(res => {
          let data = res.obj;
          this.orderTableData = data.content;
          this.orderTotalElements = data.totalElements;
          this.loading = false
        }).catch(e => {

        })
      },

      /**
       * 打开订单详情
       */
      orderDetailsOpen: function (id) {
        getTicketType(id).then(res => {
          this.orderDetails = res.obj;
          this.orderDetailsVisivble = true
        }).catch(e => {

        })

      },
      orderDetailsClose: function () {
        this.orderDetailsVisivble = false
      },

      /**
       * 前往票务设置
       */
      goToTicketSetting: function () {
        this.loading = true;
        this.currentPage = 'ticket';
        this.refreshTicketList()
      },

      //---------------------------------------票务设置-------------------------------------------
      goToOrderList: function () {
        this.currentPage = 'order'
      },

      /**
       * 刷新订单列表
       */
      refreshTicketList: function () {
        setTimeout(() => {
          this.$refs['ticketList'].refresh()
        }, 200)
      },

      /**
       * 获取订单列表
       */
      getTicketList: function (pageNumber, pageSize) {
        let id = this.merchantId;
        console.log(pageNumber, pageSize);
        // 订单接口
        getTicketList(pageNumber, pageSize, id).then(res => {
          let data = res.obj;
          this.ticketTableData = data.content;
          this.ticketTotalElements = data.totalElements;
          this.loading = false
        }).catch(e => {

        })
      },

      /**
       * 景点信息管理
       */
      spotManagementClose: function () {
        this.$refs['scenicForm'].resetFields();
        this.scenicForm.id = '';
        this.scenicForm.imageUrl = '';
        this.scenicImgURL = '';
        this.spotManagementVisible = false
      },
      spotManagementOpen: function () {
        this.findScenic();
        this.spotManagementVisible = true
      },
      //获取景点信息
      findScenic: function () {
        findScenic().then(res => {
          let data = res.obj;
          this.scenicForm.imageUrl = data.imageUrl;
          this.scenicForm.startTime = data.startTime;
          this.scenicForm.endTime = data.endTime;
          this.scenicForm.note = data.note;
          this.scenicForm.name = data.name;
          this.scenicForm.id = data.id || '';

          this.scenicImgURL = this.imgFil(data.imageUrl)
        }).catch(e => {

        })
      },
      //景点照片上传成功
      scenicPicUploadSuccess(response, file) {
        console.log(response);
        this.$message({
          message: '上传成功',
          type: 'success'
        });
        this.scenicForm.imageUrl = response.obj.fileName;
        this.scenicImgURL = this.imgFil(response.obj.fileName)
      },

      scenicSubmitBefore: function () {
        console.log(this.scenicForm);
        let form = this.scenicForm;
        form.merchantId = this.merchantId;
        this.$refs['scenicForm'].validate((valid) => {
          if (valid) {
            if (form.id === '' || form.id === null) {
              this.scenicSubmitSave(form) //保存
            } else {
              this.scenicSubmitModify(form) //修改
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      scenicSubmitSave: function (form) {
        delete form.id;
        this.btnLoading = true;
        scenicSave(form).then(res => {
          this.$message.success('保存成功');
          setTimeout(() => {
            this.btnLoading = false
          }, 1000);
          this.spotManagementClose()
        }).catch(e => {
          this.btnLoading = false
        })
      },
      scenicSubmitModify: function (form) {
        this.btnLoading = true;
        scenicModify(form).then(res => {
          this.$message.success('保存成功');
          setTimeout(() => {
            this.btnLoading = false
          }, 1000);
          this.spotManagementClose()
        }).catch(e => {
          this.btnLoading = false
        })
      },

      /**
       * 门票
       */
      ticketEditClose: function () { //关闭
        try {
          this.$refs['ticketForm'].resetFields();

          this.$set(this.ticketForm, 'id', null);
          this.$set(this.ticketForm, 'name', '');
          this.$set(this.ticketForm, 'price', 0);
          this.$set(this.ticketForm, 'introduction', '');
          this.$set(this.ticketForm, 'number', 0);
          this.$set(this.ticketForm, 'imageUrl', '');
          this.$set(this.ticketForm, 'description', '');


          this.ticketFormImgURL = '';

          console.log(this.ticketForm)
        } catch (e) {
          console.log(e)
        }

        this.refreshTicketList(); //刷新
        this.ticketEditVisible = false
      },
      ticketEditOpen: function () { //新建打开
        this.ticketEditVisible = true
      },
      ticketEditModifyOpen: function (data) { //编辑打开

        try {
          this.ticketForm.id = data.id;
          this.ticketForm.name = data.name;
          this.ticketForm.description = data.description;
          this.ticketForm.number = data.number;
          this.ticketForm.price = data.price;
          this.ticketForm.imageUrl = data.imageUrl;
          this.ticketForm.introduction = data.introduction;
          this.ticketForm.merchantId = data.merchantId;

          this.ticketFormImgURL = this.imgFil(data.imageUrl);

          console.log(this.ticketForm);
        } catch (e) {
          console.log(e)
        }

        this.ticketEditVisible = true
      },
      //门票照片上传成功
      ticketPicUploadSuccess(response, file) {
        console.log(response);
        this.$message({
          message: '门票封面上传成功',
          type: 'success'
        });
        this.ticketForm.imageUrl = response.obj.fileName;
        this.ticketFormImgURL = this.imgFil(response.obj.fileName)
      },
      ticketSubmitBefore: function () {
        console.log(this.ticketForm);
        let form = JSON.parse(JSON.stringify(this.ticketForm));
        form.merchantId = this.merchantId;

        this.$refs['ticketForm'].validate((valid) => {
          if (valid) {
            if (form.id === '' || form.id === null || form.id === undefined) {
              console.log('save');
              this.ticketSubmitSave(form)
            } else {
              console.log('modify');
              this.ticketSubmitModify(form)
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      ticketSubmitSave: function (form) {
        delete form.id;
        this.btnLoading = true;
        ticketSave(form).then(res => {
          this.$message.success('保存成功');
          setTimeout(() => {
            this.btnLoading = false
          }, 1000);
          this.ticketEditClose()
        }).catch(e => {
          this.btnLoading = false
        })
      },
      ticketSubmitModify: function (form) {
        this.btnLoading = true;
        ticketModify(form).then(res => {
          this.$message.success('修改成功');
          setTimeout(() => {
            this.btnLoading = false
          }, 1000);
          this.ticketEditClose()
        }).catch(e => {
          this.btnLoading = false
        })
      },
      /**
       * 多选删除
       */
      ticketMultiple: function (obj) {
        this.multipleSelection = obj;
        console.log(this.multipleSelection)
      },
      ticketDeleteBefore: function () {
        this.$confirm('此操作将永久删除该门票, 是否继续?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.ticketDeleteSubmit()

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      ticketDeleteSubmit: function () {
        let arr = [];
        let ids = [];
        arr = this.multipleSelection;

        arr.forEach((item) => {
          ids.push(item.id)
        });

        if (ids.length > 0) {
          this.btnLoading = true;
          ticketDelete(ids).then(res => {
            this.$message.success('删除成功');
            setTimeout(() => {
              this.btnLoading = false
            }, 500);
            this.refreshTicketList() //刷新
          }).catch(e => {
            this.btnLoading = false
          })
        } else {
          this.$message.info('需要选择门票才能删除')
        }

      },

      //---------------------------------------工具-------------------------------------------
      /**
       *图片上传失败
       **/
      imageFailed() {
        this.$message({
          message: '图片上传失败',
          type: 'error'
        })
      },
      beforeImgUpload(file) {
        let isImage = file.type.substring(0, 5) === 'image';
        let isImageSize = file.size;
        console.log('图片大小: ' + isImageSize + ' b');
        if (!isImage) {
          this.$message.error('只允许图片格式（jpg / jpeg / png）');
          return false
        }
        if (isImageSize > 1024 * 1000) {
          this.$message.error(`仅支持1024KB以下图片！`);
          return false
        }
        return true
      },
      /**
       *获取图片
       */
      imgFil: function (val) {
        if (val === '' || val == null) {
          return ''
        }
        let urltxt = '';
        urltxt = url + '/filepath/' + val;
        return urltxt
      },


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

  .time-input-width {
    width: 150px;
  }


  .ticket-container {
    width: 100%;
  }

  /*图片上传*/
  .logo-uploader {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .logo-uploader:hover {
    border-color: #409EFF;
  }

  .logo-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .logo {
    width: 178px;
    height: 178px;
    display: block;
  }

  .ticket-img-box {
    border-radius: 8px;
    width: 100px;
    height: 100px
  }

</style>
