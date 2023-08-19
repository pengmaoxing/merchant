<template>
  <div class="app-container" v-loading="loading">
    <div class="action-container">
      <el-button icon="el-icon-plus" size="small" type="primary"
                 @click="openCreatedDialog">添加二维码
      </el-button>

      <!--<el-button type="danger" icon="el-icon-delete" size="small"-->
      <!--@click="">删除-->
      <!--</el-button>-->
      <el-button icon="el-icon-refresh" size="small" @click="refresh">刷新</el-button>
      <!--选择门店-->
      <el-select v-if="userType==1" clearable v-model="searchForm.store" @change="searchQr" placeholder="选择门店"
                 size="small"
                 style="width: 120px">
        <el-option
          v-for="item in storeOption"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <!--选择二维码-->
      <!--<el-select v-model="searchForm.qr" clearable  @change="searchQr" placeholder="选择二维码" size="small" style="width: 140px">-->
      <!--<el-option-->
      <!--v-for="item in qrOption"-->
      <!--:key="item.value"-->
      <!--:label="item.name"-->
      <!--:value="item.value">-->
      <!--</el-option>-->
      <!--</el-select>-->
      <!--选择用户-->
      <!--      <el-select v-model="searchForm.user" clearable @change="searchQr" placeholder="选择用户" size="small"-->
      <!--                 style="width: 140px">-->
      <!--        <el-option-->
      <!--          v-for="item in userOption"-->
      <!--          :key="item.value"-->
      <!--          :label="item.name"-->
      <!--          :value="item.value">-->
      <!--        </el-option>-->
      <!--      </el-select>-->

      <el-input v-model="searchForm.name" placeholder="请输入二维码名" @input="searchQr" size="small"
                style="width: 140px"></el-input>

      <!--二维码状态-->
      <el-select v-model="searchForm.status" clearable @change="searchQr" placeholder="二维码状态" size="small"
                 style="width: 140px">
        <el-option
          v-for="item in statusOption"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <span class="tips">查看当前状态是“启用”或“禁用”的二维码</span>

      <!--批量下载-->
      <div style="float: right">
        <el-button v-if="!multipleSelectionMode" icon="el-icon-delete"
                   size="small"
                   @click="changeDelMode">批量下载
        </el-button>
        <el-button type="danger" v-if="multipleSelectionMode"
                   size="small"
                   @click="downloadBatchQrCode"
                   icon="el-icon-delete">下载
        </el-button>
        <el-button v-if="multipleSelectionMode"
                   size="small"
                   icon="el-icon-close" @click="multipleSelectionMode=false">
          取消
        </el-button>
      </div>


    </div>
    <!--方块视图-->
    <div class="Area_box">

      <div :span="6" v-for="(item, index) in tableData" :key="item.id" class="qr-box">
        <div :class="{'no-select':multipleSelectionMode}">
              <span :class="{selectImg:item.active}" @click.stop="pitchon(item,item.id)">
              </span>
        </div>
        <el-card>
          <div>
            <div class="qrcode-item">
              <div class="qrcode-content">
                <span class="qr_image">
                  <img
                    :src="item.qrCode|qrcodeFil"
                    alt="">
                </span>
              </div>
              <div class="qrcode-info">
                <div class="qrcode-text">
                  <label class="label-left">店名:</label>
                  <div class="label-right">{{item.storeName}}</div>
                </div>
                <div class="qrcode-text">
                  <label class="label-left">用户:</label>
                  <div class="label-right">{{item.userName}}</div>
                </div>
                <div class="qrcode-text">
                  <label class="label-left">名称:</label>
                  <div class="label-right">{{item.name}}</div>
                </div>
                <div class="qrcode-text">
                  <label class="label-left">金额:</label>
                  <div class="label-right">{{item.money}}</div>
                </div>
                <div class="qrcode-text">
                  <label class="label-left">描述:</label>
                  <div class="label-right">{{item.description}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="qr_btn">
            <!--<el-button size="small" @click="downLoadQE">下载</el-button>-->
            <div class="open status" v-if="item.status==1"></div>
            <div class="off status" v-if="item.status==2"></div>
            <div class="nullstatus status" v-if="item.status==null"></div>
            <el-button v-if="item.status==1" size="small" @click="offQR(item.id)">设为禁用</el-button>
            <el-button v-if="item.status==2" size="small" @click="onQR(item.id)">设为启用</el-button>
            <el-button size="small" @click="openEditDialog(item)">修改</el-button>
            <el-button size="small" @click="downloadQrCode(item)">下载</el-button>
            <!--<el-button size="small">绑定设备</el-button>-->
          </div>
        </el-card>
      </div>

    </div>

    <!--分页-->
    <pagination
      v-if="!multipleSelectionMode"
      :total-elements="totalElements"
      :change-callback="getqrcodeList"
      ref="page"></pagination>
    <!--添加二维码dialog-->
    <el-dialog
      title="添加二维码"
      :visible.sync="createdDialog"
      :before-close="closeCreatedDialog">
      <el-form :model="form" ref="form">
        <el-form-item label="名称:" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item v-if="userType=='1'" label="门店" :label-width="formLabelWidth" prop="storeId">
          <el-select v-model="form.storeId" placeholder="请选择门店" @change="createFindUser">
            <el-option
              v-for="item in storeOption"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="用户" prop="userId" :label-width="formLabelWidth">
          <!--<el-select v-if="userType=='1'" v-model="form.userId" placeholder="请选择用户">-->
          <!--<el-option-->
          <!--v-for="item in createdUserOption"-->
          <!--:key="item.value"-->
          <!--:label="item.name"-->
          <!--:value="item.value">-->
          <!--</el-option>-->
          <!--</el-select>-->

          <el-select v-model="form.userId" placeholder="请选择用户">
            <el-option
              v-for="item in createdUserOption"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="金额:" :label-width="formLabelWidth" prop="money">
          <el-input v-model="form.money"></el-input>
        </el-form-item>
        <el-form-item label="描述:" :label-width="formLabelWidth">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeCreatedDialog">取 消</el-button>
        <el-button type="primary" @click="addprinterArea" :loading="btnLoading">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog
      title="编辑二维码信息"
      :visible.sync="editDialog"
      :before-close="closeEditDialog">
      <el-form :model="editQRForm" ref="editQRForm">

        <el-form-item label="二维码名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="editQRForm.name"></el-input>
        </el-form-item>

        <el-form-item v-if="userType=='1'" label="门店" prop="storeId" :label-width="formLabelWidth">
          <el-select v-model="editQRForm.storeId" placeholder="请选择门店" @change="editFindUser">
            <el-option
              v-for="item in storeOption"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="用户" prop="userId" :label-width="formLabelWidth">
          <!--<el-select v-if="userType=='1'" v-model="editQRForm.userId" placeholder="请选择用户">-->
          <!--<el-option-->
          <!--v-for="item in editUserOption"-->
          <!--:key="item.value"-->
          <!--:label="item.name"-->
          <!--:value="item.value">-->
          <!--</el-option>-->
          <!--</el-select>-->

          <el-select v-model="editQRForm.userId" placeholder="请选择用户">
            <el-option
              v-for="item in editUserOption"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="二维码金额" :label-width="formLabelWidth" prop="money">
          <el-input v-model="editQRForm.money"></el-input>
        </el-form-item>
        <el-form-item label="二维码描述" :label-width="formLabelWidth">
          <el-input v-model="editQRForm.description"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeEditDialog">取 消</el-button>
        <el-button type="primary" @click="editQR" :loading="btnLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    downloadQrCode,
    qrcodeList,
    qrcodeAdd,
    qrcodeUpdate,
    findMerchant,
    findUser,
    onQRCODE,
    offQRCODE,
    findUserByStore,
    downloadBatchQrCode
  } from '../api/qrcode'
  import pagination from '@/components/pagination/index'
  import Vue from 'vue'
  import {returnThumbnailUrl, returnFilesUrl, uploadUrl} from '@/modules/file/api/upload'
  import {url} from '@/utils/request'
  // Vue.prototype.publicUrl=
  export default {
    name: 'printerArea',
    data() {
      var validateActualPrice = (rule, value, callback) => {
        let reg = /^(\d+|\d+\.\d{1,2})$/;
        if (!reg.test(value)) {
          callback(new Error('金额格式错误'))
        } else {
          callback()
        }
      };
      return {
        tableData: [], // 表格数据
        totalElements: 0, // 数据条数
        multipleSelection: [], // 选中数据-多选
        loading: true, // loading效果
        createdDialog: false, // 二维码模态框
        formLabelWidth: '120px',
        printerOptions: [],
        specListForm: {
          list: [],
        },
        form: {
          name: '',
          money: '',
          storeId: '',
          userId: '',
          description: '',
          status: '1'
        }, // 二维码数据
        btnLoading: false, // 按钮loading
        editDialog: false, // 编辑模态框,
        editQRForm: {
          id: '',
          name: '',
          storeId: '',
          userId: '',
          money: '',
          description: '',
        },
        headers: {
          authorized: sessionStorage.token
        }, // 请求头部
        userType: '',//用户权限类型

        //  搜索
        searchForm: {
          store: '',
          qr: '',
          user: '',
          status: '',
          name: ''
        },//搜索条件
        storeOption: [],//门店选项
        qrOption: [
          {value: 0, name: '二维码1'},
          {value: 1, name: '二维码2'},
          {value: 2, name: '二维码3'},
        ],//二维码选项
        userOption: [],//用户选项
        createdUserOption: [],//用户选项
        editUserOption: [],//用户选项
        statusOption: [
          {value: 1, label: '启用'},
          {value: 2, label: '禁用'}
        ],//状态选项

        //规则
        QrRules: {
          name: [
            {required: true, message: '必须输入名称', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],
          money: [
            {required: true, message: '必须输入金额', trigger: 'blur'},
            {validator: validateActualPrice, trigger: 'blur'}
          ],
          userId: [
            {required: true, message: '请选择用户', trigger: 'blur'}
          ],
          storeId: [
            {required: true, message: '请选择门店', trigger: 'blur'}
          ],
        },

        //批量下载
        multipleSelectionMode: false,//多选删除模式
        multipleSelection: [], // 选中数据-多选
      }
    },
    components: {pagination},

    mounted() {
      //缺省获取列表
      this.getqrcodeList(1, 10);
      //用户类型
      this.userType = sessionStorage.getItem('userType');


      //获取用户下拉
      // this.getUserOption();
      //获取用户下拉By store
      // this.createFindUser()
    },
    filters: {
      //二维码换成http路径
      qrcodeFil: function (val) {
        //resource
        let urltxt = url + '/resource/' + val;
        return urltxt
      }
    },

    methods: {
      /**
       * 多选操作
       */
      changeDelMode: function () {
        if (this.tableData.length > 0) {
          this.multipleSelectionMode = !this.multipleSelectionMode
        } else {
          this.$message.error('没有二维码可以操作')
        }
      },
      /**
       * 汇集选中的餐桌，并修改样式,
       * 取消时候，删除被选中列表
       * */
      pitchon(qrcode, qrid) {
        console.log(qrid);
        if (this.multipleSelectionMode) {
          if (qrcode.active) {
            Vue.set(qrcode, 'active', false);  //为item添加不存在的属性，需要使用vue提供的Vue.set( object, key, value )方法
            for (let i = 0; i < this.multipleSelection.length; i++) {
              if (this.multipleSelection[i].id === qrid) {
                this.multipleSelection.splice(i, 1);
              }
            }
            // console.log(this.multipleSelection)
          } else {
            Vue.set(qrcode, 'active', true);
            this.multipleSelection.push({id: qrid});
            // console.log(this.multipleSelection)
          }
        }
        console.log(this.tableData)
      },
      /**
       * 批量下载
       */
      downloadBatchQrCode: function () {

        let arr = this.tableData;
        console.log(arr);
        let temp = [];
        for (let i in arr) {
          if (arr[i].active) {
            let obj = {};
            obj['storeName'] = arr[i].storeName;
            obj['qrCodePathStr'] = arr[i].qrCode;
            obj['qrCodeUrl'] = arr[i].qrCodeUrl;
            temp.push(obj)
          }
        }

        downloadBatchQrCode(JSON.stringify(temp)).then(res => {

          this.$message.success('准备下载...')
          setTimeout(() => {
            let url = this.getQrcode(res.obj);
            let a = document.createElement('a');
            a.setAttribute("href", url);
            a.setAttribute("download", '二维码zip');
            a.click();
          }, 300);


        }).catch(e => {

        })
      },

      /**
       *获取门店下拉
       */
      getStoreOption: function () {
        findMerchant().then(res => {
          console.log("门店列表",res);
          let data = res.obj;
          this.storeOption = data
        }).catch(e => {

        })
      },
      /**
       * 搜索
       */
      searchQr: function () {
        this.getqrcodeList(1, 10)
      },

      /**
       *获取用户下拉
       */
      getUserOption: function () {
        findUser().then(res => {
          console.log(res);
          let data = res.obj;
          this.userOption = data
          this.createdUserOption = data
        }).catch(e => {

        })
      },
      /**
       * 获取二维码列表
       * */
      getqrcodeList: function (number, pageSize) {
        this.loading = true;
        qrcodeList(number, pageSize, this.searchForm).then(response => {
          let data = response.obj;
          //console.log(data)
          this.totalElements = data.totalElements;
          this.tableData = data.content;
          console.log(this.tableData);
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },

      downloadQrCode: function (row) {
        this.$confirm("是否下载" + row.storeName + "二维码？", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.loading = true;
          downloadQrCode(row.storeName, row.qrCode, row.qrCodeUrl).then(res => {
            console.log(res);
            let url = this.getQrcode(res.obj);
            if (url) {
              this.downloadIamge(url, 'pic')
            }
            this.loading = false
          }).catch(e => {
            this.loading = false;
            this.$message.error('下载失败')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消下载'
          });
        });
      },
      /**
       * 下载
       */
      downloadIamge(imgsrc, name) {//下载图片地址和图片名
        var image = new Image();
        // 解决跨域 Canvas 污染问题
        image.setAttribute("crossOrigin", "anonymous");
        image.onload = function () {
          var canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          var context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, image.width, image.height);
          var url = canvas.toDataURL("image/png"); //转base

          var a = document.createElement("a");
          var event = new MouseEvent("click");
          a.download = '二维码';
          a.href = url;
          a.dispatchEvent(event);
        };
        image.src = imgsrc;
      },
      getQrcode: function (val) {
        //resource
        let urltxt = url + '/resource/' + val;
        return urltxt
      },

      /**
       * 刷新
       * */
      refresh() {
        this.$refs.page.refresh()
      },

      /**
       * 通过门店ID获取用户 新增
       */
      createFindUser: function () {
        let id = this.form.storeId;
        this.$set(this.form, 'userId', '');
        findUserByStore(id).then(res => {
          let data = res.obj;
          this.createdUserOption = data
        }).catch(e => {
        })
      },
      /**
       * 通过门店ID获取用户 编辑
       */
      editFindUser: function () {
        this.$set(this.editQRForm, 'userId', '');
        findUserByStore(this.editQRForm.storeId).then(res => {
          this.editUserOption = res.obj
        }).catch(e => {

        })
      },

      /*
      * 打开二维码模态框
      * */
      openCreatedDialog() {
        this.form = {
          name: '',
          money: '',
          description: '',
        };
        //获取门店下拉
        let ut = this.userType
        if (ut == 1) {
          this.getStoreOption();
        } else if (ut == 2 || ut == 3) {
          this.getUserOption()
        }

        this.createdDialog = true
      },
      /*
      * 关闭二维码模态框
      * */
      closeCreatedDialog() {
        this.form = {
          name: '',
          money: '',
          description: '',
        };
        this.createdUserOption = []
        this.createdDialog = false
      },
      /*
      * 添加二维码
      * */
      addprinterArea() {

        this.$refs['form'].validate((valid) => {
          if (valid) {
            console.log('ok')
          } else {
            this.$message.error('还有未输入的内容。');
            return false
          }
        });
        this.loading = true;
        this.btnLoading = true;
        qrcodeAdd(this.form).then(response => {
          this.$message({
            message: response.msg,
            type: 'success'
          });
          this.btnLoading = false;
          this.closeCreatedDialog();
          this.getqrcodeList()
        }).catch(() => {
          this.btnLoading = false;
          this.loading = false
        })
      },
      /*
      * 打开编辑二维码模态框
      * */
      openEditDialog(row) {
        console.log(row)
        this.editQRForm.id = row.id;
        this.editQRForm.money = row.money;
        this.editQRForm.storeId = row.storeId;
        this.editQRForm.userId = row.userId;
        this.editQRForm.name = row.name;
        this.editQRForm.description = row.description;

        if (this.userType == 1) {
          this.getStoreOption();
          findUserByStore(row.storeId).then(res => {
            this.editUserOption = res.obj
          }).catch(e => {

          })
        } else if (this.userType == 2||this.userType == 3) {
          findUser().then(res => {
            console.log(res);
            let data = res.obj;
            this.editUserOption = data
          }).catch(e => {

          })
        }

        this.editDialog = true

      },
      /*
      * 关闭编辑二维码模态框
      * */
      closeEditDialog() {

        this.$refs['editQRForm'].resetFields();
        this.editDialog = false
      },
      /*
      * 编辑二维码
      * */
      editQR() {

        this.$refs['editQRForm'].validate((valid) => {
          if (valid) {
          } else {
            this.$message.error('还有未输入的内容。');
            return false
          }
        });

        this.loading = true;
        this.btnLoading = true;
        qrcodeUpdate(this.editQRForm).then(response => {
          this.$message({
            message: response.msg,
            type: 'success'
          });
          this.btnLoading = false;
          this.loading = false;
          this.closeEditDialog();
          this.refresh()
        }).catch(() => {
          this.loading = false;
          this.btnLoading = false
        })
      },
      /**
       *关闭二维码
       */
      offQR: function (data) {
        offQRCODE(data).then(res => {
          this.$message.success('禁用二维码成功');
          this.refresh()
        }).catch(e => {

        })
      },
      /**
       *开启二维码
       */
      onQR: function (data) {
        onQRCODE(data).then(res => {
          this.$message.success('启用二维码成功');
          this.refresh()
        }).catch(e => {

        })

      },
      /**
       *下载二维码
       */
      downLoadQE: function (data) {

      },

      getImg: function (id) {
        //console.log('图片ID' + id)
        if (id == null || id == '') {
          return ''
        }
        return returnThumbnailUrl(id)
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

<style scoped>
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

  /*方块视图*/

  .Area_box {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

  }

  .qr-box {
    width: 24%;
    margin-right: 1%;
    margin-bottom: 1%;
    height: auto;
  }


  /*卡片*/
  .qrcode-item .qrcode-content {
    float: left;
    display: inline;
  }

  .qrcode-item .qrcode-info {
    padding-top: 4px;
  }

  .qr_image {
    width: 140px;
    height: 140px;
  }

  .qr_image img {
    width: 140px;
    height: 140px;
  }

  .qrcode-text {
    font-size: 14px;
    line-height: 22px;
  }

  .qrcode-text .label-left {
    display: inline-block;
    color: #808080;
    max-width: 100%;
    margin-bottom: 5px;
    font-weight: 700;
  }

  .qrcode-text .label-right {
    padding: 0 0 0 3px;
    display: inline-block;
    color: #515151;
  }

  .qr_btn {
    padding: 0 0 0 8px;
    clear: both;
  }

  .tips {
    font-size: 13px;
    color: #808080;
  }

  .status {
    display: inline-block;
    margin-right: 10px;
    width: 10px;
    height: 10px;
    border-radius: 5px;

  }

  .open {
    background-color: #409eff;
  }

  .off {
    background-color: #f56c6c;
  }

  .nullstatus {
    background-color: #808080;
  }


  .no-select {
    position: relative;
    left: -13px;
    top: 20px;
  }

  .no-select span {
    display: inline-block;
    width: 26px;
    height: 26px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg4RTkyNERERTIwOTExRTc4M0E3Q0JFQjFGNjcwNEQ4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg4RTkyNERFRTIwOTExRTc4M0E3Q0JFQjFGNjcwNEQ4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODhFOTI0REJFMjA5MTFFNzgzQTdDQkVCMUY2NzA0RDgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODhFOTI0RENFMjA5MTFFNzgzQTdDQkVCMUY2NzA0RDgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4CHjQDAAACOklEQVR42ryWT2saURTF7xgULW6sOxdulNYGoTtFIRZcpIsGWvoVAq7bbJOsUrJtu9Tv0JJAskjRkCAocS2p9c/GhTvrQo2C4OQcmQlDEydRZ3rhcnlvZs5v7rx5715FVVUxs1wu9wLhA3wTvg73a5e68Gv4L/hRJpOpm+ko80AAvEE48Hq9G+FwWAKBgPh8PnG73TKdTmU4HMpgMJBOpyOtVkv6/X4R9+8DePkkEABuhG8AZGKxmBIKhURRFNOsqUFYpVJRAc9h6hOA47kgQJ4jnASDwUQ6nRaXyyWL2GQykUKhIO12u4zhFmB/74EAeYZwHo1G44lE4tEszLIrl8tSrVavMEwDdsN5h+Ge7/hM8WQyuTRk9uZ4lhrUoqY+79AXHmuynUqlxCqjFjW1n+ouoy9ceKfTaRmIWtSkNsdr+G1fg3zIN1jlkz1k3A71ej2INTtiRh+5T6yG6OtFbTII2uBmtMs07RRBEaZol2naLwny81ixyzweD4PfIf/JCOqOx2PbAKPRaHbSE1Tr9Xq2gTTtPwQVedTbZZp2kaCfzWZTHiuAyx6w1Ib9mA2y2Wyx0WioVhs1qU2G/tftsWixnlhl1KImq+5delpW2Xw+b1k21KKmrm/cR59Rjq9KpdJK68VnqUEtas4r5exwTlHK4yuWckLeobp2zZoTnhlfV2xOdvQS/tR26xDApLHd0s6u2Y7nZjS0WyVM7wJwsVBfZwBGEN7D38Jf/dNA/oafwY8BqJnp3AowAD6ixkbfro4JAAAAAElFTkSuQmCC) no-repeat;
    background-size: 100% 100%;
  }

  .selectImg {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg5QTUyOUQ0RTIwOTExRTc4OTQyRTZEMkZEMkExQjJCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg5QTUyOUQ1RTIwOTExRTc4OTQyRTZEMkZEMkExQjJCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODlBNTI5RDJFMjA5MTFFNzg5NDJFNkQyRkQyQTFCMkIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODlBNTI5RDNFMjA5MTFFNzg5NDJFNkQyRkQyQTFCMkIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4I2x8gAAACmUlEQVR42mIU3MVACKgBcQAQuwGxFhALQ8XfAvE1IAaZsAGIb+EzhBGPRfZA3AzEtgzEgcNAXAvEB7FJMmER4wDiGUC8nwRLGKBq90P1chCySAiI9wFxOsi3DKQDRqjefVCzsFrEBcTbgNiSgXJgCTWLC5tFE4HYnIF6wBxqJopFoIhPZqA+SIaaDbeohcw4QQHMjMwMrer9DJdtHyHHGchsBhYg1gdiG0ot4WHhZZinu5LBRcSToflOFbIUyGx9kEVBlFoiwyHHsMJwC4MWjy5D+906hv777ehKglhIzCsYwJDPlGG54SYGMTYJhs67DQzd95qxKbMDxZEGuZb4iAUybDbZD7HkXiMY4wDqTEhlFxyocmsw8LLw4bUkV6GUYYHeGgYuZm6wL0C+wQOEsRVBDHvNTjEcsrjAoMdriCHHysjKMFFrNkOjahcDEyMTQ8+9FnC8EAJM0FIYBSx6OptBnlORYafZMYZoqUS4uACrIMMqo+0MsdIpYH7v/VaGtru1xITyW1DpDSqXHFELLEaGSdpz4ZYcfLeX4f63Owyeon4M4uySYDFQykJLxvjAAWbOWAYlWO5FBrvebGFQ59Zk0ODRZlDgVGIw4DMB5xVwWfWgk6HpTiUp6WYxKOjWYZP5+/8vQ/qVGIbdb7ahiE9+0M3QeLuC1AS6FmTRRSA+gk32179fDAmXQhk2v1rH8O3vV3Dqqr9dRqolILMvwmpYe2ilxUjlQvU/EDuB4giWvEHV72walN4gMw+g10eFQHySipachJqJUfF9A2JvKll2EmrWN1xthrfQPDUTGr7kxMlMaLy8JdQK+g7EGVALj5FgyTGoBRnIPiGmXQcDoNLdH4jdgVgTrQF5HYh3AvFGIL6BzxCAAAMA+QyhURDFaMoAAAAASUVORK5CYII=) no-repeat !important;
    background-size: 100% 100%;
  }

</style>
