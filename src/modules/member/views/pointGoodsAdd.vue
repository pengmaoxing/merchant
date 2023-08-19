<template>
  <div class="app-container" v-loading="loading">
    <el-form :model="itemForm" :rules="rules" ref="itemForm" label-width="180px" class="demo-ruleForm">
      <el-card class="box-card">
        <div slot="header" class="clearfix" style="height:20px;padding: 0">
          <span>创建活动</span>
          <el-button style="float: right; height: 20px;margin: 0;padding: 0" type="text" @click="goBack">返回</el-button>
        </div>
        <!--第一行-->
        <div>
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix" style="height:20px;padding: 0">
              <span>基本信息</span>
            </div>

            <!--表单-->


            <el-form-item label="兑换时间" required>
              <el-form-item prop="exchangeStart" class="block">
                <el-date-picker type="date" placeholder="开始日期"
                                v-model="itemForm.exchangeStart"
                                format="yyyy 年 MM 月 dd 日"
                                @change="dayCheck"
                                value-format="timestamp"
                                style="width: 190px;">

                </el-date-picker>
              </el-form-item>
              至
              <el-form-item prop="exchangeEnd" class="block">
                <el-date-picker type="date" placeholder="结束日期"
                                v-model="itemForm.exchangeEnd"
                                @change="dayCheck"
                                format="yyyy 年 MM 月 dd 日"
                                value-format="timestamp"
                                style="width: 190px;">

                </el-date-picker>
              </el-form-item>
            </el-form-item>

            <el-form-item label="兑换说明">
              <el-input
                type="textarea"
                :rows="6"
                placeholder="请输入兑换说明"
                v-model="itemForm.exchangeMessage"
                show-word-limit
                maxlength="200"
                :style="formwidth">
              </el-input>
            </el-form-item>


          </el-card>
        </div>

        <!--第二行-->
        <div style="margin-top: 20px">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix" style="height:20px;padding: 0">
              <span>规则配置</span>
            </div>

            <!--表单-->

            <el-form-item label="兑换所需积分" prop="credits">
              <el-input-number v-model="itemForm.credits"
                               :precision="0"
                               :min="0"
                               :max="999999"
                               :style="formwidth"></el-input-number>
              积分
            </el-form-item>


            <el-form-item label="商品名称" prop="productName">
              <el-input v-model="itemForm.productName" :style="formwidth" placeholder="商品名称"></el-input>
            </el-form-item>


            <el-form-item label="商品价格" prop="productMoney">
              <el-input-number v-model="itemForm.productMoney"
                               :precision="0"
                               :min="0"
                               :max="999999"
                               :style="formwidth"></el-input-number>
              元
            </el-form-item>


            <el-form-item label="商品图片" prop="imgUrl">
              <el-upload
                class="logo-uploader"
                :action="url"
                :data="filesData"
                name="files"
                :show-file-list="false"
                :on-success="successSubmitImage"
                :on-error="failedSubmitImage"
                :before-upload="checkImage"
                :headers="headers">
                <img v-if="itemImageURL" :src="itemImageURL" class="logo">
                <i v-else class="el-icon-plus logo-uploader-icon"></i>
              </el-upload>
              <span class="image_tips">建议比例1:1，支持JPG、PNG格式，大小在1M以内</span>
            </el-form-item>


            <el-form-item label="商品数量" prop="productNums">
              <el-input-number v-model="itemForm.productNums"
                               :precision="0"
                               :min="1"
                               :max="99999"
                               label=""
                               :style="formwidth"></el-input-number>
              件（库存）
            </el-form-item>

            <el-form-item label="每位用户限兑">
              <el-select v-model="itemForm.isLimited" placeholder="请选择">
                <el-option label="不限制" :value="2"></el-option>
                <el-option label="设定每人兑换上限" :value="1"></el-option>
              </el-select>
              &nbsp
              <el-form-item prop="limitedNum" v-if="itemForm.isLimited=='1'" class="block">

                <el-input-number v-model="itemForm.limitedNum"
                                 :precision="0"
                                 :min="1"
                                 :max="itemForm.productNums"
                ></el-input-number>
                件
              </el-form-item>
            </el-form-item>

          </el-card>
        </div>

        <div class="card-btn">
          <el-button type="primary" @click="submitItem" v-loading="btnLoading" :disabled="btnLoading">确认创建活动</el-button>
          <el-button type="" @click="goBack">取 消</el-button>
        </div>
      </el-card>
    </el-form>
  </div>
</template>

<script>
  import {addProduct} from '../api/pointsRule'
  import {returnThumbnailUrl, uploadUrl} from '@/modules/file/api/upload' //图片操作API
  export default {
    name: 'pointGoodsAdd',
    data() {
      var validateLimit = (rule, value, callback) => {
        console.log(this.itemForm.isLimited)
        console.log(value)
        if (this.itemForm.isLimited == 1) {
          if (value == '') {
            callback(new Error('请填写'))
          } else if (value == 0) {
            callback(new Error('不能为0'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      return {
        loading: false,
        btnLoading: false, //按钮锁定
        id: '',//商品id
        formwidth: 'width: 403px',
        itemForm: {
          exchangeStart: '',
          exchangeEnd: '',
          exchangeMessage: '',
          credits: '',
          productName: '',
          productMoney: '',
          imgUrl: '',
          productNums: '',
          isLimited: 1,
          limitedNum: 1,
          status: 0,
          interrupt: 0
        },

        itemImageURL: '',
        rules: {
          exchangeStart: [
            {required: true, message: '请选择开始时间', trigger: 'blur'},
          ],
          exchangeEnd: [
            {required: true, message: '请选择结束时间', trigger: 'blur'}
          ],
          credits: [
            {required: true, message: '请输入所需积分', trigger: 'blur'}
          ],
          productName: [
            {required: true, message: '请输入商品名称', trigger: 'blur'}
          ],
          productMoney: [
            {required: true, message: '请输入商品价格', trigger: 'blur'}
          ],
          imageId: [
            {required: true, message: '还未上传图片', trigger: 'blur'}
          ],
          productNums: [
            {required: true, message: '请输入商品数量', trigger: 'blur'}
          ],
          limitedNum: [
            {validator: validateLimit, trigger: 'blur'}
          ]
        },

        //***************************
        filesData: {
          module: 'image'
        },
        url: uploadUrl + '/user',
        headers: {
          authorized: sessionStorage.token
        },
      }
    },
    methods: {

      successSubmitImage(response, file) {
        //保存图片ID
        console.log(response)
        this.$message({
          message: '图片上传成功！',
          type: 'success'
        })
        this.itemForm.imgUrl = response.obj
        this.itemImageURL = returnThumbnailUrl(response.obj)
      },

      /*
    * 上传失败
    * */
      failedSubmitImage() {
        this.$message({
          message: '图片上传失败',
          type: 'error'
        })
      },
      /*
   * 对类型、大小做限制
   * */
      checkImage(file) {
        let isImage = file.type.substring(0, 5) === 'image'
        if (!isImage) {
          this.$message.error('只允许图片格式（jpg / jpeg / png）')
          return false
        }
        return true
      },

      /**
       *提交表单
       */
      submitItem: function () {

        var that = this //否则定时器里的方法无法使用 e.g that.funName
        console.log(this.itemForm)
        this.$refs['itemForm'].validate((valid) => {
          if (valid) {
            //验证通过,发送请求
            this.btnLoading = true; //锁定按钮
            let form = this.itemForm
            let data = {
              exchangeStart: this.format(form.exchangeStart),
              exchangeEnd: this.format(form.exchangeEnd),
              exchangeMessage: form.exchangeMessage,
              credits: form.credits,
              productName: form.productName,
              productMoney: form.productMoney,
              imgUrl: form.imgUrl,
              productNums: form.productNums,
              isLimited: form.isLimited,
              limitedNum: form.limitedNum,
              status: 0,
              interrupt: 0,
              exchangeNum: 0
            }
            addProduct(data).then(res => {
              this.$message.success('添加成功')
              this.btnLoading = false; //解锁按钮
              //返回列表页面
              setTimeout(function () {
                that.goBack()
              }, 1000)
            }).catch(e => {
              this.btnLoading = false; //解锁按钮
              this.$message.error('添加失败' + e)
            })
          } else {
            this.btnLoading = false; //解锁按钮
            this.$message.error('还有未填写的内容')
            return false
          }
        })
      },

      /**
       * 日期检查
       */

      dayCheck: function () {
        let data = this.itemForm
        if (data.startTime > data.endTime && data.endTime != '') {
          this.itemForm.startTime = data.endTime - (60 * 60 * 24 * 1000)
          this.$message('开始日期不能晚于结束日期,已设置默认开始时间')
        }
      },

      /**
       * 返回上一页
       */
      goBack: function () {
        this.$router.go('-1')
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
    }
  }
</script>

<style scoped>
  /*public*/
  .block {
    display: inline-block;
    vertical-align: middle;
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

  .image_tips {
    font-size: 12px;
    color: #1e6abc;
    vertical-align: middle;
  }

  .card-btn {
    margin-top: 20px;
    text-align: center;
  }

</style>
