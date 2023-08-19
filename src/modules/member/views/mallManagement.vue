<template>
  <div class="app-container">
    <!--搜索条-->
    <div class="search-bar">
      <!--<el-input v-model="searchForm.name" class="input-width"></el-input>-->
      <el-button @click="resetList">刷新</el-button>
      <el-button @click="multipleDelete" type="danger">批量删除</el-button>
      <el-button type="primary" icon="el-icon-s-grid" style="float: right" @click="categoryOpen">类目管理</el-button>
      <el-button type="primary" icon="el-icon-edit" style="float: right" @click="addGoodOpen">新增商品</el-button>
    </div>

    <!--列表-->
    <div class="table-box">
      <template>
        <el-table
          :data="itemTable"
          @selection-change="selectionChange"
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
            label="主图（封面）"
            width="150">
            <template slot-scope="scope">
              <el-popover
                placement="right-end"
                trigger="hover">
                <img :src="imgFil(scope.row.imageUrl)" class="ticket-img-preview" :title="'预览：'+scope.row.luxuryName"
                     :alt="scope.row.name">
                <img slot="reference" :src="imgFil(scope.row.imageUrl)" class="ticket-img-box" alt="">
                <!--<el-button >hover 激活</el-button>-->
              </el-popover>

            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="商品简称"
            :show-overflow-tooltip="true"
            width="120">
          </el-table-column>
          <el-table-column
            prop="luxuryName"
            label="商品全称"
            :show-overflow-tooltip="true"
            width="200">
          </el-table-column>
          <el-table-column
            prop="note"
            label="介绍"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="bigCategoryName"
            label="一级分类"
            width="100">
          </el-table-column>
          <el-table-column
            prop="smallCategoryName"
            label="二级分类"
            width="100">
          </el-table-column>
          <el-table-column
            prop="money"
            label="指导标价（元）"
            :show-overflow-tooltip="true"
            width="300">
          </el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="modifyGoodOpen(scope.row)">编辑</el-button>
              <el-button type="text" @click="deleteGood(scope.row.id)" style="color: red!important;">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total-elements="itemTotal"
          :change-callback="findGoodsListSubmit"
          ref="goodList"></pagination>
      </template>
    </div>

    <!--模态框群-->
    <template>
      <!--类目管理-->
      <el-dialog
        title="类目管理"
        :visible.sync="categoryVisible"
        width="576px"
        :close-on-click-modal="false"
        :append-to-body="true"
        :before-close="categoryClose">
        <div class="classify-admin">
          <template v-for="(item,index) in categoryTree">
            <div class="big-classify" :key="index">
              <el-tag type="warning" closable @click="bigModify(item.id,item.name)" @close="deleteBig(item.id,item)"
                      effect="dark">{{item.name}}
              </el-tag>
            </div>
            <div class="line-div"></div>
            <div class="small-classify" v-for="(it,ix) in item.children">
              <el-tag type="warning" closable size="medium"
                      @click="smallModify(item.id,it.id,it.name)"
                      @close="deleteSmall(it.id)">{{it.name}}
              </el-tag>
            </div>
            <div class="small-classify">
              <el-button class="button-new-tag" size="mini" @click="addSmall(item.id)">+ 增加</el-button>
            </div>
          </template>
          <div class="big-classify">
            <el-button type="warning" class="button-new-tag" size="medium" @click="addBig()">+ 增加一级类目</el-button>
          </div>

        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="categoryClose">完 成</el-button>
  </span>
      </el-dialog>

      <!--新增编辑-->
      <el-dialog
        title="商品上架"
        :visible.sync="addGoodVisible"
        :close-on-click-modal="false"
        :append-to-body="true"
        width="576px"
        :before-close="addGoodClose">

        <div>
          <el-form :model="addGood" ref="addGood" label-width="120px" label-suffix="：">

            <el-form-item label="商品封面" prop="imageUrl">
              <el-upload
                class="logo-uploader"
                :action="url"
                :accept="accept"
                :data="filesData"
                name="file"
                :show-file-list="false"
                :on-success="goodPicUploadSuccess"
                :on-error="imageFailed"
                :before-upload="beforeImgUpload"
                :headers="headers">
                <img v-if="goodImageUrl"
                     :src="goodImageUrl" class="logo">
                <i v-else class="el-icon-plus logo-uploader-icon"></i>
              </el-upload>
            </el-form-item>

            <el-form-item label="副图">
              <el-upload
                class="logo-uploader"
                :action="url"
                :accept="accept"
                :data="filesData"
                name="file"
                :show-file-list="false"
                :on-success="goodPic2UploadSuccess"
                :on-error="imageFailed"
                :before-upload="beforeImgUpload"
                :headers="headers">
                <img v-if="goodImageUrl2" :src="goodImageUrl2" class="logo">
                <i v-else class="el-icon-plus logo-uploader-icon"></i>
              </el-upload>
              <el-upload
                class="logo-uploader"
                :action="url"
                :accept="accept"
                :data="filesData"
                name="file"
                :show-file-list="false"
                :on-success="goodPic3UploadSuccess"
                :on-error="imageFailed"
                :before-upload="beforeImgUpload"
                :headers="headers">
                <img v-if="goodImageUrl3" :src="goodImageUrl3" class="logo">
                <i v-else class="el-icon-plus logo-uploader-icon"></i>
              </el-upload>

              <el-upload
                class="logo-uploader"
                :action="url"
                :accept="accept"
                :data="filesData"
                name="file"
                :show-file-list="false"
                :on-success="goodPic4UploadSuccess"
                :on-error="imageFailed"
                :before-upload="beforeImgUpload"
                :headers="headers">
                <img v-if="goodImageUrl4" :src="goodImageUrl4" class="logo">
                <i v-else class="el-icon-plus logo-uploader-icon"></i>
              </el-upload>

              <el-upload
                class="logo-uploader"
                :action="url"
                :accept="accept"
                :data="filesData"
                name="file"
                :show-file-list="false"
                :on-success="goodPic5UploadSuccess"
                :on-error="imageFailed"
                :before-upload="beforeImgUpload"
                :headers="headers">
                <img v-if="goodImageUrl5" :src="goodImageUrl5" class="logo">
                <i v-else class="el-icon-plus logo-uploader-icon"></i>
              </el-upload>
            </el-form-item>


            <el-form-item label="商品简称" prop="name">
              <el-input v-model.trim="addGood.name" placeholder="商品的简要名称(小程序用，8字内)"></el-input>
            </el-form-item>
            <el-form-item label="商品全称" prop="luxuryName">
              <el-input v-model.trim="addGood.luxuryName" placeholder="商品的完整名称(详细页用，20字内)"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="money">
              <el-input-number v-model.trim="addGood.money" :step="100" :precision="2" :min="0">

              </el-input-number>
              <span>&nbsp元</span>
            </el-form-item>
            <el-form-item label="介绍" prop="note">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8}"
                resize="vertical"
                placeholder="请输入内容"
                show-word-limit
                maxlength="255"
                v-model.trim="addGood.note">
              </el-input>
            </el-form-item>
            <el-form-item label="一级类目" prop="bigCategoryId">
              <el-select v-model="addGood.bigCategoryId" @change="findSmallCategory" placeholder="请选择一级类目">
                <el-option v-for="(item,index) in bigCategory"
                           :key="index"
                           :value="item.id"
                           :label="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="二级类目" prop="smallCategoryId">
              <el-select v-model="addGood.smallCategoryId" placeholder="请选择二级类目">
                <el-option v-for="(item,index) in smallCategory"
                           :key="index"
                           :value="item.id"
                           :label="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>

        </div>

        <span slot="footer" class="dialog-footer">
    <el-button @click="addGoodClose">取 消</el-button>
    <el-button type="primary" @click="goodSubmitCheck" :loading="btnLoading">确 定</el-button>
  </span>
      </el-dialog>

    </template>
  </div>
</template>

<script>
  import pagination from '@/components/pagination/index'
  import {returnThumbnailUrl, uploadUrl, newUploadUrl, returnFilesUrl} from '@/modules/file/api/upload' //图片操作API
  import {url} from '@/utils/request'
  import {
    findGoodsList, goodSave, goodModify, findBigCategory, findSmallCategory
    , findAllCategory, smallCategoryAdd, smallCategoryDelete, bigCategoryDelete,
    bigCategoryAdd, bigCategoryModify, smallCategoryModify, goodDelete, goodDeleteIds
  } from '../api/mallManagement'

  export default {
    name: "mallManagement",
    components: {pagination},
    data() {
      return {
        searchForm: {
          name: "",
        },
        btnLoading: false,
        itemTable: [],
        itemTotal: 0,

        bigCategory: [], //大类目
        smallCategory: [], //小类目
        multipleSelection: [], //多选
        //类目管理
        categoryVisible: false,
        categoryTree: [],
        selectTree: [],

        //图片
        //图片上传
        accept: 'image/png,image/jpg,image/jpeg',
        filesData: {
          module: 'image'
        },
        url: newUploadUrl + '/upload/path/file_upload',
        headers: {
          authorized: sessionStorage.token
        },


        //创建商品
        addGoodVisible: false,
        addGood: {
          id: '',
          name: '',//简称
          luxuryName: '',
          money: 0,
          note: '',
          imageUrl: '',
          imageUrl2: '',
          imageUrl3: '',
          imageUrl4: '',
          imageUrl5: '',
          bigCategoryId: '',
          smallCategoryId: '',
        },
        goodImageUrl: '',
        goodImageUrl2: '',
        goodImageUrl3: '',
        goodImageUrl4: '',
        goodImageUrl5: '',

      }
    },
    mounted() {
      this.findAllCategory();
      this.findGoodsListSubmit()
    },
    methods: {
      /**
       * 多选
       */
      selectionChange: function (val) {
        this.multipleSelection = val;
      },

      /**
       * 多选删除
       */
      multipleDelete: function () {
        console.log(this.multipleSelection);

        let goodIds = [];
        this.multipleSelection.forEach(item => {
          goodIds.push(item.id)
        });
        console.log(goodIds);

        let title = '';
        if (goodIds.length <= 0) {
          this.$message.error('还未选择条目');
          return false
        } else if (goodIds.length === 1) {
          title = '此操作将删除这款商品，是否继续？';
        } else {
          title = '此操作将删除这些商品，是否继续？';
        }

        this.$confirm(title, '删除操作', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.multipleDeleteSubmit(goodIds) //删除
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      //提交批量删除
      multipleDeleteSubmit: function (ids) {
        goodDeleteIds(ids).then(res => {
          this.$message.success(res.msg)
          setTimeout(() => {
            this.resetList()
          }, 200)
        }).catch(e => {

        })
      },


      secondPicUpload: function (response) {
        // secondPicList
        console.log(response);
        // this.addGood.imageUrl = response.obj.fileName;
        this.secondPicLocalList.push(response.obj.fileName);
        console.log(this.secondPicList);
        console.log(this.secondPicLocalList)
      },

      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleChange(file, fileList) {
        this.secondPicList = fileList.slice(-4);
      },


      /**
       * 获取列表
       */
      findGoodsListSubmit: function (pageNum, pageSize) {
        findGoodsList(pageNum, pageSize).then(res => {
          let data = res.obj;
          this.itemTable = data.content;
          this.itemTotal = data.totalElements
        }).catch(e => {
          console.log(response);
          this.$message({
            message: '上传成功',
            type: 'success'
          });
          this.addGood.imageUrl = response.obj.fileName;
        })
      },

      resetList: function () {
        this.$refs['goodList'].refresh()
      },
      /**
       * 删除商品
       */
      deleteGood: function (id) {
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          goodDelete(id).then(res => {
            this.resetList()
          }).catch(e => {

          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },


      /**
       *创建商品
       */

      //打开
      addGoodOpen: function () {
        this.findBigCategory();
        this.addGoodVisible = true;
      },
      modifyGoodOpen: function (raw) {
        this.addGoodVisible = true;

        this.$nextTick(() => {
          this.$set(this.addGood, 'id', raw.id);
          this.$set(this.addGood, 'name', raw.name);
          this.$set(this.addGood, 'luxuryName', raw.luxuryName);
          this.$set(this.addGood, 'money', raw.money);
          this.$set(this.addGood, 'note', raw.note);
          this.$set(this.addGood, 'imageUrl', raw.imageUrl);
          this.$set(this.addGood, 'imageUrl2', raw.imageUrl2);
          this.$set(this.addGood, 'imageUrl3', raw.imageUrl3);
          this.$set(this.addGood, 'imageUrl4', raw.imageUrl4);
          this.$set(this.addGood, 'imageUrl5', raw.imageUrl5);
          this.$set(this.addGood, 'bigCategoryId', raw.bigCategoryId);
          this.goodImageUrl = this.imgFil(raw.imageUrl);//换取图片
          this.goodImageUrl2 = this.imgFil(raw.imageUrl2);//换取图片
          this.goodImageUrl3 = this.imgFil(raw.imageUrl3);//换取图片
          this.goodImageUrl4 = this.imgFil(raw.imageUrl4);//换取图片
          this.goodImageUrl5 = this.imgFil(raw.imageUrl5);//换取图片
          this.findBigCategory();//获取大类
          this.findSmallCategory(raw.bigCategoryId); //获取二类
          setTimeout(() => {
            this.$set(this.addGood, 'smallCategoryId', raw.smallCategoryId);
          }, 100);
        })


      },
      //关闭
      addGoodClose: function () {
        this.$refs['addGood'].resetFields();
        this.addGood.id = null;
        this.$set(this.addGood, 'imageUrl', '');
        this.$set(this.addGood, 'imageUrl2', '');
        this.$set(this.addGood, 'imageUrl3', '');
        this.$set(this.addGood, 'imageUrl4', '');
        this.$set(this.addGood, 'imageUrl5', '');
        this.goodImageUrl = '';
        this.goodImageUrl2 = '';
        this.goodImageUrl3 = '';
        this.goodImageUrl4 = '';
        this.goodImageUrl5 = '';
        setTimeout(() => {
          this.addGoodVisible = false;
        }, 10)
      },

      //获取大类目
      findBigCategory: function () {
        findBigCategory().then(res => {
          let data = res.obj;
          this.bigCategory = data;
          this.smallCategory = []
        }).catch(e => {

        })
      },
      //清空二级
      clearLevel2: function () {
        this.addGood.smallCategoryId = ''
      },
      //获取小类目
      findSmallCategory: function (id) {
        console.log(`大类目id：${id}，正在获取小类目`);
        findSmallCategory(id).then(res => {
          let data = res.obj;
          this.smallCategory = data;
          this.clearLevel2()
        }).catch(e => {

        })
      },
      //商品照片上传成功
      goodPicUploadSuccess(response, file) {
        console.log(response);
        this.$message({
          message: '上传成功',
          type: 'success'
        });
        this.addGood.imageUrl = response.obj.fileName;
        this.goodImageUrl = this.imgFil(response.obj.fileName)
      },

      //商品照片2上传成功
      goodPic2UploadSuccess(response, file) {
        console.log(response);
        this.$message({
          message: '上传成功',
          type: 'success'
        });
        this.addGood.imageUrl2 = response.obj.fileName;
        this.goodImageUrl2 = this.imgFil(response.obj.fileName)
      },

      //商品照片3上传成功
      goodPic3UploadSuccess(response, file) {
        console.log(response);
        this.$message({
          message: '上传成功',
          type: 'success'
        });
        this.addGood.imageUrl3 = response.obj.fileName;
        this.goodImageUrl3 = this.imgFil(response.obj.fileName)
      },

      //商品照片4上传成功
      goodPic4UploadSuccess(response, file) {
        console.log(response);
        this.$message({
          message: '上传成功',
          type: 'success'
        });
        this.addGood.imageUrl4 = response.obj.fileName;
        this.goodImageUrl4 = this.imgFil(response.obj.fileName)
      },

      //商品照片3上传成功
      goodPic5UploadSuccess(response, file) {
        console.log(response);
        this.$message({
          message: '上传成功',
          type: 'success'
        });
        this.addGood.imageUrl5 = response.obj.fileName;
        this.goodImageUrl5 = this.imgFil(response.obj.fileName)
      },

      goodSubmitCheck: function () {
        let form = JSON.parse(JSON.stringify(this.addGood));
        console.log(form);
        form.merchantId = sessionStorage.merchantId;
        if (form.id === '' || form.id === null || form.id == 0) {
          //新增模式
          delete form.id;
          this.goodAddSubmit(form)
        } else {
          this.goodModifySubmit(form)
        }

      },
      goodAddSubmit: function (form) {
        console.log(`发起新建保存了`);
        this.btnLoading = true;
        goodSave(form).then(res => {
          this.$message.success(res.msg);
          this.$refs['addGood'].resetFields();
          this.addGoodClose();
          this.resetList();
          setTimeout(() => {
            this.btnLoading = false
          })

        }).catch(e => {
          this.btnLoading = false
        })
      },
      goodModifySubmit: function (form) {
        console.log(`发起编辑保存了`);
        this.btnLoading = true;
        goodModify(form).then(res => {
          this.$message.success(res.msg);
          this.$refs['addGood'].resetFields();
          this.addGoodClose();
          this.resetList();
          setTimeout(() => {
            this.btnLoading = false
          })

        }).catch(e => {
          this.btnLoading = false
        })
      },

      /**
       * 类目管理
       */
      //打开
      categoryOpen: function () {
        this.findAllCategory();
        this.categoryVisible = true
      },
      //关闭
      categoryClose: function () {
        this.categoryVisible = false
      },
      /**
       * 获取全类目
       */
      findAllCategory: function () {
        findAllCategory().then(res => {
          let data = res.obj;
          this.categoryTree = data
        }).catch(e => {

        })
      },
      //删除某个一级
      deleteBig: function (id, items) {
        console.log(id);
        let title = '';
        if (items.children.length > 0) {
          title = '此类目还有下级类目，是否继续删除此类目?'
        } else {
          title = '此操作将永久删除该一级类目, 是否继续?'
        }

        this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          bigCategoryDelete(id).then(res => {
            this.$message.success(res.msg);
            this.findAllCategory()
          }).catch(e => {

          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      },
      //删除某个二级
      deleteSmall: function (id) {
        console.log(id);
        this.$confirm('此操作将永久删除该类目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          smallCategoryDelete(id).then(res => {
            this.$message.success(res.msg);
            this.findAllCategory()
          }).catch(e => {

          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //添加一个一级
      addBig: function () {
        this.$prompt('请输入一级类目名称', '新建一级类目', {
          confirmButtonText: '创建',
          cancelButtonText: '取消',
        }).then(({value}) => {
          bigCategoryAdd(value).then(res => {
            this.$message.success(res.msg);
            this.findAllCategory()
          }).catch(e => {

          })
        }).catch(() => {

        });
      },
      //添加一个二级
      addSmall: function (id) {
        console.log(id);
        this.$prompt('请输入二级类目名称', '新建二级类目', {
          confirmButtonText: '创建',
          cancelButtonText: '取消',
        }).then(({value}) => {
          smallCategoryAdd(id, value).then(res => {
            this.$message.success(res.msg);
            this.findAllCategory()
          }).catch(e => {

          })
        }).catch(() => {

        });
      },

      //一级编辑
      bigModify: function (id, name) {
        console.log('编辑', id);
        this.$prompt('输入新的一级类目名称', '编辑一级类目名称', {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          inputValue: name,
        }).then(({value}) => {
          bigCategoryModify(id, value).then(res => {
            this.$message.success(res.msg);
            this.findAllCategory()
          }).catch(e => {

          })
        }).catch(() => {

        });
      },
      //二级编辑
      smallModify: function (bid, id, name) {
        //bid 大类id
        console.log('编辑', bid, id);
        this.$prompt('输入新的二级类目名称', '编辑二级类目名称', {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          inputValue: name,
        }).then(({value}) => {
          smallCategoryModify(bid, id, value).then(res => {
            this.$message.success(res.msg);
            this.findAllCategory()
          }).catch(e => {

          })
        }).catch(() => {

        });
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
        if (isImageSize > 500 * 1000) {
          this.$message.error(`仅支持500KB以下图片！`);
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

  .search-bar {
    width: 100%;
    height: auto;

    .input-width {
      width: 200px;
    }
  }

  .table-box {

  }

  /*图片上传*/
  .logo-uploader {
    width: 178px;
    height: 178px;

    display: inline-block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;


  }

  .el-upload:after {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
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


  .classify-admin {
    cursor: default;
  }

  .big-classify {
    font-family: "Microsoft YaHei UI";
    font-size: 24px;
    color: #FF803E;
    cursor: pointer;
    user-select: none;
  }

  .line-div {
    margin: 10px 0 10px 0;
    width: 100%;
    height: 1px;
    background-color: #ff803e;
  }

  .small-classify {
    display: inline-block;
    font-size: 15px;
    color: #ffb181;
    margin-right: 10px;
    margin-bottom: 20px;
    cursor: pointer;
  }

  .ticket-img-preview {
    width: 300px;
    height: 300px;
    border-radius: 10px;
  }

  .ticket-img-box {
    border-radius: 8px;
    width: 100px;
    height: 100px
  }

</style>
