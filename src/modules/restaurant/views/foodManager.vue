<template>
  <div class="app-container">

    <!--搜索操作-->
    <div>
      <el-button type="" @click="itemRefesh">刷新</el-button>
      <el-button type="" @click="foodTypeOpen">管理菜型</el-button>
      <!--餐盒费设置-->
      <template>
        <el-popover
          placement="bottom"
          v-model="setPackageFeeVisible">
          <div style="margin: 10px 0;">
            <el-input-number v-model="packageFee"
                             size="mini" :precision="2"
                             :min="0" :max="999"
                             label="餐盒费">
            </el-input-number>
            &nbsp元
          </div>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="setPackageFeeVisible = false">取消</el-button>
            <el-button type="primary" size="mini"
                       @click="setCurrentPackageFee">保存
            </el-button>
          </div>
          <el-button slot="reference" @click="getCurrentPackageFee">餐盒费设置</el-button>
        </el-popover>
        <el-button type="" @click="taokeOutSettingOpen">外卖配置</el-button>
      </template>
      <!--批量删除-->
      <template>
        <el-button v-if="!multipleSelectionMode" icon="el-icon-delete"
                   @click="changeDelMode">批量删除
        </el-button>
        <el-button type="danger" v-if="multipleSelectionMode" icon="el-icon-delete" @click="deleteFoodGroup">删除
        </el-button>
        <el-button v-if="multipleSelectionMode" icon="el-icon-close" @click="multipleSelectionMode=false">
          取消
        </el-button>
      </template>

      <el-input v-model="foodQuery.name" :clearable="true"
                placeholder="菜品名" @input="itemRefesh"
                style="width: 270px"></el-input>
    </div>

    <!--列表-->

    <div class="food-square">
      <div class="desk_all_box">
        <el-row>
          <!--添加菜品-->
          <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4" class="desk_square">
            <div class="desk_square_content add_desk" @click="addFoodDialogOpen">
              <p class="">
                <i></i>
                <span style="color: gray">添加菜品</span>
              </p>
            </div>
          </el-col>
          <!--菜列表-->
          <template v-for="item in tableData">
            <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4" class="desk_square">
              <div class="desk_square_content" @click="editFoodOpen(item)"
                   :style="{background:`url('${getImg(item.photoId)}') no-repeat center center`,backgroundSize:`100%`}">
                <div class="table_num">
                  <span class="item_1">{{item.name||'未知菜名'}}</span>
                  <span class="item_2">{{item.foodTypeName||'未知类型'}}</span>
                  <span class="item_3">￥{{item.sellMoney||'未知价格'}}</span>
                  <span class="inventory-right">剩余：{{item.inventory}} 件</span>
                </div>
                <p :class="{'no-select':multipleSelectionMode}">
                  <span :class="{selectImg:item.active}" @click.stop="pitchon(item,item.id)"></span>
                </p>
              </div>
            </el-col>
          </template>
        </el-row>
      </div>
      <pagination
        :total-elements="totalElements"
        :change-callback="getFoodList"
        ref="page"></pagination>
    </div>


    <!--模态框-->
    <template>
      <!--添加编辑菜品-->
      <el-dialog
        :title="saveModeTitle"
        :visible.sync="addFoodVisible"
        :close-on-click-modal="false"
        width="576px"
        :before-close="addFoodDialogClose">
        <div>

          <el-form :model="foodForm" ref="foodForm" :rules="foodFormRule" label-width="140px">

            <el-form-item label="菜型：" prop="foodTypeId">
              <el-select v-model="foodForm.foodTypeId" placeholder="选中菜品类型" class="input-width">
                <el-option v-for="(item,index) in foodTypeOption" :key="index"
                           :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="菜名：" prop="name">
              <el-input v-model="foodForm.name" class="input-width"></el-input>
            </el-form-item>

            <el-form-item label="描述：" prop="description">
              <el-input v-model="foodForm.description" class="input-width"></el-input>
            </el-form-item>

            <el-form-item label="库存：" prop="inventory">
              <el-input-number v-model="foodForm.inventory" :precision="0"
                               :step="50" class="input-width"
                               :min="1" :max="99999"
                               label="库存数量"></el-input-number>
              （份）
            </el-form-item>

            <el-form-item label="价格：" prop="sellMoney">
              <el-input-number v-model="foodForm.sellMoney" :precision="2"
                               :step="1" class="input-width"
                               :min="0.01" :max="99999"
                               label="销售价格">
              </el-input-number>
              （元）
            </el-form-item>

            <el-form-item label="照片：">
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
                <img v-if="photoUrl" :src="photoUrl" class="logo"/>
                <i v-else class="el-icon-plus logo-uploader-icon"></i>
              </el-upload>
            </el-form-item>

          </el-form>

        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addFoodDialogClose">取 消</el-button>
    <el-button type="primary" @click="submitNewFood" :loading="addLoading">保 存</el-button>
  </span>
      </el-dialog>

      <!--添加查看菜品类型-->
      <el-dialog
        title="菜品类型"
        :visible.sync="foodTypeVisible"
        width="400px"
        :before-close="foodTypeClose">
        <div>
          <el-table
            :data="foodTypeOption"
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号">
            </el-table-column>
            <el-table-column
              prop="name"
              label="菜型">
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                           icon="el-icon-edit"
                           @click="editFoodType(scope.row)"
                           circle></el-button>
                <!--删除-->
                <!--<el-button type="danger"-->
                <!--icon="el-icon-delete"-->
                <!--@click="delFoodType(scope.row)"-->
                <!--circle></el-button>-->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
           <el-button @click="foodTypeClose">关 闭</el-button>
           <el-button type="primary" @click="foodTypeAdd">添 加</el-button>
        </span>
      </el-dialog>

      <!--添加编辑菜品-->
      <el-dialog
        title="输入菜品名称"
        :visible.sync="foodTypeAddVisible"
        width="30%"
        :before-close="foodTypeAddClose">
        <div>
          <el-form :model="newFoodTypeForm" ref="newFoodTypeForm" label-width="120px">
            <el-form-item label="菜品类型：">
              <el-input v-model="newFoodTypeForm.name"></el-input>
            </el-form-item>
          </el-form>

        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="foodTypeAddClose">取 消</el-button>
    <el-button type="primary" @click="foodTypeAddSave">确 定</el-button>
  </span>
      </el-dialog>

      <!--外卖配置-->
      <el-dialog
        title="外卖配置"
        :visible.sync="taokeOutSettingVisible"
        width="576px"
        :close-on-click-modal="false"
        :before-close="taokeOutSettingClose">
        <div>
          <el-form label-width="150px" label-suffix="：" :model="taokeOutSetForm" ref="taokeOutSetForm"
                   :rules="taokeOutSetRules">
            <el-form-item label="配送距离" prop="distance">
              <el-input-number v-model="taokeOutSetForm.distance" :min="0" :step="1" :precision="0"
                               label="配送距离"></el-input-number>
              <span class="tips">米</span>
            </el-form-item>

            <el-form-item label="配送费" prop="money">
              <el-input-number v-model="taokeOutSetForm.money" :min="0" :max="999999999" :precision="2" :step="1"
                               label="配送费用"></el-input-number>
              <span class="tips">元</span>
            </el-form-item>

            <el-form-item label="腾讯地图appKey" prop="mapKey">
              <el-input v-model="taokeOutSetForm.mapKey" placeholder="腾讯地图appKey"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="taokeOutSettingClose">取 消</el-button>
          <el-button type="primary" @click="taokeOutSettingSaveBefore" :loading="btnLoading">保 存</el-button>
        </div>
      </el-dialog>
    </template>

  </div>
</template>

<script>
  import {
    getFoodList,
    addFood,
    editFood,
    deleteFood,
    getPackageMoney,
    savePackageMoney,
    getFoodType,
    saveFoodType,
    modifyFoodType,
    deleteFoodType,

    getTakeOutConfig,
    updateTakeOutConfig
  } from '@/modules/restaurant/api/food'

  import {returnThumbnailUrl, returnFilesUrl, uploadUrl} from '@/modules/file/api/upload' //图片操作API

  import Vue from 'vue'


  import pagination from '@/components/pagination/index'

  export default {
    name: "foodManager",
    components: {pagination},
    data() {
      return {
        loading: false, //加载
        btnLoading: false,

        multipleSelectionMode: false,//多选删除模式
        multipleSelection: [], // 选中数据-多选

        //表格
        foodQuery: {
          name: ''
        },
        tableData: [],
        totalElements: 0,

        //餐盒费
        setPackageFeeVisible: false,//显示轻量模态框
        packageFee: 0.01, //餐盒费
        packageFeeSetById: '',
        //新增菜品
        addFoodVisible: false,

        foodForm: {
          name: '',
          inventory: 0,
          sellMoney: 0,
          description: '',
          foodTypeId: '',
          photoId: '',
        },
        photoUrl: '',
        foodFormRule: {},
        addLoading: false,//按钮锁定

        saveMode: 'new', //new 新菜  modify 修改
        saveModeTitle: '创建新菜', //new 新菜  modify 修改

        //图片
        filesData: {
          module: 'image'
        },
        url: uploadUrl + '/user',
        headers: {
          authorized: sessionStorage.token
        },

        //菜品类型
        foodTypeOption: [],
        foodTypeTotalElements: 0,
        foodTypeVisible: false,//菜品类型编辑模态框
        foodTypeAddVisible: false,
        newFoodTypeForm: {
          name: ''
        },
        foodTypeMode: 'new', //新增修改模式
        currentFoodTypeValue: '',

        //外卖配置
        taokeOutSettingVisible: false,
        taokeOutSetForm: {
          id: '',
          distance: 0,
          money: 0.00,
          mapKey: '',
        },
        taokeOutSetRules: {
          distance: [
            {required: true, message: '必须配置配送距离', trigger: ['blur', 'change']}
          ],
          money: [
            {required: true, message: '必须配置配送费用', trigger: ['blur', 'change']}
          ],
          mapKey: [
            {required: true, message: '必须配置地图appKey', trigger: ['blur', 'change']}
          ]
        },

      }
    },
    mounted() {
      this.itemRefesh()//菜列表
      this.getFoodTypeList() //菜类型列表
    },
    watch: {
      /*
     * 监听多选模式是否取消，如果取消，清除所有被选中的deskId
     * */
      multipleSelectionMode: function (newValue) {
        if (newValue == false) {
          this.multipleSelection = [];
        }
      },
    },
    methods: {
      /**
       * 外卖配置
       */
      taokeOutSettingOpen: function () {
        this.getTakeOutConfig();
        this.taokeOutSettingVisible = true
      },
      taokeOutSettingClose: function () {
        this.taokeOutSettingVisible = false
      },
      getTakeOutConfig: function () {

        getTakeOutConfig().then(res => {
          let data = res.obj;

          this.taokeOutSetForm.id = data.id;
          this.taokeOutSetForm.distance = data.distance || 0;
          this.taokeOutSetForm.money = data.money || 0.0;
          this.taokeOutSetForm.mapKey = data.mapKey || '';

        }).catch(e => {

        })
      },
      taokeOutSettingSaveBefore: function () {
        this.$refs['taokeOutSetForm'].validate((valid) => {
          if (valid) {
            this.taokeOutSettingSave()
          } else {
            this.$message.error('还有配置未填写');
            return false;
          }
        });
      },
      //保存
      taokeOutSettingSave: function () {
        this.btnLoading = true;
        let form = JSON.parse(JSON.stringify(this.taokeOutSetForm));
        updateTakeOutConfig(form).then(res => {
          this.$message.success(res.msg);
          this.taokeOutSettingClose();
          setTimeout(()=>{
            this.btnLoading = false
          },1000)
        }).catch(e => {
          this.btnLoading = false
        })
      },


      /**
       * 多选操作
       */
      changeDelMode: function () {
        if (this.tableData.length > 0) {
          this.multipleSelectionMode = !this.multipleSelectionMode
        } else {
          this.$message.error('没有菜品可以操作')
        }
      },
      /*
     * 汇集选中的餐桌，并修改样式,
     * 取消时候，删除被选中列表
     * */
      pitchon(food, foodid) {
        if (this.multipleSelectionMode) {
          if (food.active) {
            Vue.set(food, 'active', false);  //为item添加不存在的属性，需要使用vue提供的Vue.set( object, key, value )方法
            for (let i = 0; i < this.multipleSelection.length; i++) {
              if (this.multipleSelection[i].id === foodid) {
                this.multipleSelection.splice(i, 1);
              }
            }
            // console.log(this.multipleSelection)
          } else {
            Vue.set(food, 'active', true);
            this.multipleSelection.push({id: foodid});
            // console.log(this.multipleSelection)
          }
        }
      },

      /**
       * 删除菜
       **/
      deleteFoodGroup() {
        this.$confirm('是否删除这些菜品？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.multipleSelection.length) {
            this.loading = true;
            let ids = [];
            this.multipleSelection.forEach((item) => {
              ids.push(item.id)
            });
            deleteFood(ids).then(response => {
              this.$message({
                message: response.msg,
                type: 'success',
                duration: 1000
              });
              this.multipleSelection = [];
              this.multipleSelectionMode = false;//多选模式取消
              this.$refs.page.refresh()
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.$message({
              message: '请选择菜品',
              type: 'warning',
              duration: 1000
            })
          }
        })
      },

      /**
       * 菜品类型
       */
      getFoodTypeList: function () {
        getFoodType().then(res => {
          let data = res.obj;
          this.foodTypeOption = data
        }).catch(e => {

        })
      },
      /**
       * 菜品类型编辑模态框打开
       */
      foodTypeOpen: function () {
        this.getFoodTypeList();
        this.foodTypeVisible = true
      },

      /**
       * 菜品类型编辑模态框
       */
      foodTypeClose: function () {
        this.foodTypeVisible = false
      },

      /**
       * 添加菜品
       */
      foodTypeAdd: function () {
        this.foodTypeMode = 'new';
        this.foodTypeAddVisible = true
      },
      /**
       * 添加菜品关闭
       */
      foodTypeAddClose: function () {
        this.newFoodTypeForm.name = '';
        this.foodTypeAddVisible = false
      },

      /**
       * 修改菜型
       */
      editFoodType: function (data) {
        this.foodTypeMode = 'modify';
        this.currentFoodTypeValue = data.value;
        this.newFoodTypeForm.name = data.name;
        this.foodTypeAddVisible = true
      },


      /**
       * 保存添加
       */
      foodTypeAddSave: function () {
        let form = this.newFoodTypeForm;

        if (form.name === '' || form.name == null) {
          this.$message.error('还未填写');
          return false
        }


        if (this.foodTypeMode === 'new') {
          saveFoodType(form).then(res => {
            this.$message.success('添加成功');
            this.foodTypeAddClose();
            this.getFoodTypeList()
          }).catch(e => {

          })

        } else if (this.foodTypeMode === 'modify') {
          let id = this.currentFoodTypeValue;
          if (id === '' || id == null) return;

          modifyFoodType(id, form).then(res => {
            this.$message.success('修改成功');
            this.foodTypeAddClose();
            this.getFoodTypeList()
          }).catch(e => {

          })
        }


      },

      /**
       * 删除
       */
      delFoodType: function (data) {
        this.$confirm('此操作将删除该菜型及下属菜品, 是否继续?', '删除', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteFoodType(data.value).then(res => {
            this.$message.success('删除成功');
            this.getFoodTypeList();
            this.itemRefesh()
          }).catch(e => {

          })
        }).catch(() => {
        });

      },


      /**
       * 获取列表
       */
      getFoodList: function (number, pageSize) {
        this.loading = true;
        let form = this.foodQuery;
        getFoodList(number, pageSize, form).then(response => {
          let data = response.obj.content;
          this.tableData = data;
          console.log(this.tableData);
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].operator = true // 额外加上一个operator属性，可作为添加到默认菜单标志
          }
          this.totalElements = response.obj.totalElements;
          this.loading = false
        }).catch(() => {
          this.loading = false
        })

      },


      /**
       * 添加菜品
       */
      addFoodDialogOpen: function () {
        this.saveMode = 'new';  //变更模态框
        this.saveModeTitle = '创建新菜'; //变更模态框

        this.foodForm = {
          id: '',
          name: '',
          inventory: 0,
          sellMoney: 0,
          description: '',
          foodTypeId: '',
          photoId: '',
        };

        this.addFoodVisible = true
      },
      addFoodDialogClose: function () {
        this.$refs['foodForm'].resetFields();
        this.foodForm.photoId = '';
        this.photoUrl = '';
        this.addFoodVisible = false
      },

      submitNewFood: function () {
        this.addLoading = true;
        let form = this.foodForm;
        if (form.photoId === '' || form.photoId === null) {
          this.$message.error('菜品图片还未上传。');
          //定时取消锁定
          setTimeout(() => {
            this.addLoading = false;
          }, 200);
          //退出
          return false
        }
        if (this.saveMode === 'new') {
          delete this.foodForm.id; //删除id属性
          addFood(form).then(res => {
            this.$message.success('保存成功');
            this.addLoading = false;
            this.addFoodDialogClose();
            this.$refs.page.refresh()
          }).catch(e => {
            this.addLoading = false;
          })
        } else if (this.saveMode === 'modify') {
          editFood(form).then(res => {
            this.$message.success('修改成功');
            this.addLoading = false;
            this.addFoodDialogClose();
            this.$refs.page.refresh()
          }).catch(e => {
            this.addLoading = false;
          })
        }
      },


      /**
       * 查看并修改菜品
       */
      editFoodOpen: function (data) {
        this.saveMode = 'modify';  //变更模态框
        this.saveModeTitle = '编辑菜品'; //变更模态框

        if (data) {
          this.foodForm.id = data.id;
          this.foodForm.name = data.name || '';
          this.foodForm.inventory = data.inventory || 0;
          this.foodForm.sellMoney = data.sellMoney || 0;
          this.foodForm.description = data.description || '';
          this.foodForm.foodTypeId = data.foodTypeId || '';
          this.foodForm.photoId = data.photoId || '';
          this.photoUrl = this.getImg(data.photoId)
        }
        this.addFoodVisible = true
      },

      /**
       * 获取最新的包装费
       */
      getCurrentPackageFee: function () {
        getPackageMoney().then(res => {
          let data = res.obj;
          this.packageFeeSetById = data.id;
          this.packageFee = data.mealFee
        }).catch(e => {

        })
      },

      /**
       * 保存包装费
       */
      setCurrentPackageFee: function () {
        savePackageMoney(this.packageFee, this.packageFeeSetById).then(res => {
          this.$message.success('餐盒费保存成功');
          this.setPackageFeeVisible = false
        }).catch(e => {

        })
      },
      /**
       * 上传图片
       */
      successSubmitImage(response, file) {
        //保存图片ID
        console.log(response);
        this.$message({
          message: '菜品图片上传成功！',
          type: 'success'
        });
        this.foodForm.photoId = response.obj;
        this.photoUrl = returnFilesUrl(response.obj)
      },

      /**
       * 上传失败
       */
      failedSubmitImage() {
        this.$message({
          message: '图片上传失败',
          type: 'error'
        })
      },
      /**
       * 对类型、大小做限制
       */
      checkImage(file) {
        let isImage = file.type.substring(0, 5) === 'image';
        if (!isImage) {
          this.$message.error('只允许图片格式（jpg / jpeg / png）');
          return false
        }
        return true
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

      /**
       * 刷新
       */
      itemRefesh: function () {
        this.$refs.page.refresh()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  .food-square {
    width: 100%;
    max-width: 100%;

    margin-top: 20px;

    /*方块显示*/
    .desk_all_box {
      width: 100%;
      height: 100%;
      overflow: hidden;
      padding: 20px 0 20px 0;
      margin-left: -14px;
      margin-right: -14px;
      /*background-color: #e8e4e5;*/
    }

    .desk_square {
      padding-left: 14px;
      padding-right: 14px;
    }

    .desk_square_content {
      position: relative;
      margin-bottom: 16px;
      height: 98px;
      border-radius: 5px;
      background-color: white;
      border: 1px solid #d0d0d0;
      box-shadow: 0px 2px 5px 0px #cac7c79c;
    }

    .desk_square :hover {
      cursor: pointer;
    }

    .add_desk > p {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 84px;
      height: 18px;
      margin-top: -9px;
      margin-left: -42px;
    }

    .add_desk > p span {
      position: relative;
      top: -3px;
      left: 4px;
      font-size: 14px;
      color: #fafafa;
    }

    .add_desk > p i {
      display: inline-block;
      width: 18px;
      height: 18px;
      margin-top: -9px;
      background: url(data:image/png;base64,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) no-repeat;
      background-size: 100% 100%;
    }

    .table_num {
      padding: 10px;
      height: 100%;
      background-color: rgba(255, 255, 255, .70);
      border-radius: 5px;

      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: flex-start;
    }

    .table_num span {
      display: block;
      color: rgb(63, 63, 63);
      text-shadow: 1px 1px 6px #cacaca;
    }

    .item_1 {
      font-size: 20px;
    }

    .item_2 {
      color: gray;
      font-size: 14px;
    }

    .item_3 {
      color: gray;
      font-size: 14px;
    }
  }

  .input-width {
    width: 270px;
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

  .no-select {
    position: absolute;
    top: -25px;
    right: -10px;
    width: 26px;
    height: 26px;
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

  .inventory-right {
    position: absolute;
    right: 10px;
    bottom: 10px;

    font-size: 14px;
  }

  .tips {
    color: gray;
    font-size: 13px;
    margin-left: 10px;
  }
</style>
