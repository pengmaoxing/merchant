<template>
  <div class="app-container" v-loading="loading">
    <div class="action-container">
      <!--公司-->
      <el-input v-model="searchForm.name" @keyup.enter.native="search" placeholder="店名" size="small"
                class="formItem"></el-input>
      <!--状态-->
      <el-select v-model="searchForm.status" @change="search" clearable placeholder="状态" size="small"
                 class="formItem">
        <el-option
          v-for="item in statusOption"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <!--按钮-->
      <el-button type="primary" size="small" @click="search">查询</el-button>
      <el-button type="primary" size="small" @click="newMemberOpen">新增</el-button>
    </div>

    <!--表格-->
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="name"
        label="门店名称">
      </el-table-column>
      <el-table-column
        prop="storeNo"
        label="门店编号">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <template v-if="scope.row.status===1">启用</template>
          <template v-else-if="scope.row.status===2">注销</template>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间">
      </el-table-column>
      <el-table-column
        label="操作"
        width="380">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="openEditDialog(scope.row)">编辑
          </el-button>
          <el-button type="text" @click="rooterDeatil(scope.row)">详情</el-button>
          <el-button type="text" @click="bindDev(scope.row)">绑定云音箱设备</el-button>
          <el-button type="text" @click="unbindDev(scope.row)">解绑云音箱设备</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total-elements="totalElements"
      :change-callback="getTableList"
      ref="page"></pagination>


    <!--新增模态框-->
    <el-dialog
      title="新增"
      width="576px"
      :visible.sync="newMember"
      :before-close="newMemberClose">
      <el-form :model="storeForm" :rules="Rules" ref="ruleForm" :label-width="newFormLabelWidth">
        <el-form-item label="店名：">
          <el-input v-model.trim="storeForm.name"
                    class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="编号：">
          <el-input v-model.trim="storeForm.storeNo"
                    class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select
            v-model="storeForm.status"
            class="formItem"
            collapse-tags>
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省份：">
          <el-select v-model="storeForm.province"
                     placeholder="请选择省份"
                     class="formItem"
                     @change="getProv($event)">
            <el-option :value="n"
                       :key="index"
                       :label="n"
                       v-for="(n,index) in dataProv[0]['prov']">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市：">
          <el-select v-model="storeForm.city" placeholder="请选择城市"
                     class="formItem"
                     @change="getCity($event)">
            <el-option :value="n"
                       :key="index"
                       :label="n"
                       v-for="(n,index) in dataCity">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="区/县：" prop="area">
          <el-select v-model="storeForm.area" placeholder="请选择区/县"
                      class="formItem">
            <el-option :value="n"
                       :key="index"
                       :label="n"
                       v-for="(n,index) in dataCountry">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="联系地址：">
          <el-input v-model.trim="storeForm.address"
                    class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="地址备注：">
          <el-input v-model.trim="storeForm.addressNote"
                    class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="门店电话：">
          <el-input v-model.trim="storeForm.phone"
                    class="formItem"></el-input>
        </el-form-item>
        <!--<el-form-item label="支付凭证描述：" >-->
        <!--<el-input v-model="storeForm.paymentDesciption"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="图片">
          <el-upload
            class="logo-uploader"
            :action="url"
            :data="filesData"
            name="files"
            :show-file-list="false"
            :on-success="createLogoSuccess"
            :on-error="handleLogoFailed"
            :before-upload="beforeLogoUpload"
            :headers="headers">
            <img v-if="createdSrc" :src="createdSrc" class="logo">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="云喇叭token：">
          <el-input v-model.trim="storeForm.hornToken"
                    class="formItem"></el-input>
          <el-tooltip class="item" effect="light"
                      :content="hornTokenTips" placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="云喇叭序列号：">
          <el-input v-model.trim="storeForm.hornSerial"
                    class="formItem"></el-input>
          <el-tooltip class="item" effect="light"
                      :content="hornSerialTips" placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="newMemberClose">取消</el-button>
    <el-button type="primary" @click="addStore()">确定</el-button>
  </span>
    </el-dialog>
    <!--新增模态框-->

    <!--编辑模态框-->
    <el-dialog
      title="编辑门店信息"
      width="576px"
      :visible.sync="editMember"
      :before-close="editMemberClose">
      <el-form :model="editStoreForm" :rules="Rules" ref="ruleForm" :label-width="newFormLabelWidth">

        <el-form-item label="店名：">
          <el-input v-model.trim="editStoreForm.name"
                    class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="编号：">
          <el-input v-model.trim="editStoreForm.storeNo"
                    class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select
            v-model="editStoreForm.status"
            class="formItem"
            collapse-tags>
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省份：">
          <el-select v-model="editStoreForm.province" placeholder="请选择省份"
                     class="formItem"
                     @change="getProv($event)">
            <el-option :value="n"
                       :key="index"
                       :label="n"
                       v-for="(n,index) in dataProv[0]['prov']">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市：">
          <el-select v-model="editStoreForm.city" placeholder="请选择城市"
                     class="formItem"
                     @change="getCity($event)">
            <el-option :value="n"
                       :key="index"
                       :label="n"
                       v-for="(n,index) in dataCity">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="区/县：" prop="area">
          <el-select v-model="editStoreForm.area" placeholder="请选择区/县"
                      class="formItem">
            <el-option :value="n"
                       :key="index"
                       :label="n"
                       v-for="(n,index) in dataCountry">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="联系地址：">
          <el-input v-model.trim="editStoreForm.address"
                    class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="地址备注：">
          <el-input v-model.trim="editStoreForm.addressNote"
                    class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="门店电话：">
          <el-input v-model.trim="editStoreForm.phone"
                    class="formItem"></el-input>
        </el-form-item>
        <!--<el-form-item label="支付凭证描述：" >-->
        <!--<el-input v-model="editStoreForm.paymentDesciption"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="图片">
          <el-upload
            class="logo-uploader"
            :action="url"
            :data="filesData"
            name="files"
            :show-file-list="false"
            :on-success="editLogoSuccess"
            :on-error="handleLogoFailed"
            :before-upload="beforeLogoUpload"
            :headers="headers">
            <img v-if="editSrc" :src="editSrc" class="logo">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="云喇叭token：">
          <el-input v-model.trim="editStoreForm.hornToken" class="formItem"></el-input>
          <el-tooltip class="item" effect="light"
                      :content="hornTokenTips" placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="云喇叭序列号：">
          <el-input v-model.trim="editStoreForm.hornSerial" class="formItem"></el-input>
          <el-tooltip class="item" effect="light"
                      :content="hornSerialTips" placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editMemberClose">取 消</el-button>
    <el-button type="primary" @click="editOpera">确 定</el-button>
  </span>
    </el-dialog>
    <!--编辑模态框-->

  </div>
</template>

<script>
  import {
    getTableList,
    addStore,
    editStore,
    bindCloudSound,
    unbindCloudSound
  } from '../api/store'
  import pagination from '@/components/pagination/index'
  import {returnThumbnailUrl, uploadUrl} from '@/modules/file/api/upload'
  import cityJson from '@/assets/city/city.json'

  export default {
    name: 'store',
    components: {pagination},
    data() {
      return {
        filesData: {
          module: 'store'
        }, // 携带参数
        createdSrc: '',
        editSrc: '',
        headers: {
          authorized: sessionStorage.token
        },
        url: uploadUrl + '/store',

        tableData: [], // 表格数据
        multipleSelection: [], // 选中数据-多选
        totalElements: 0, // 数据条数
        loading: false, // loading效果
        btnLoading: false,
        formLabelWidth: '150px', // label宽度
        newFormLabelWidth: '150px', // label宽度
        //查询------------------------------------------------------------
        advancedSearch: false,//高级查询模态
        searchForm: {
          name: '', //公司名
          status: ''//状态
        },//搜索用的表单
        statusOption: [{value: 1, name: '启用'}, {value: 2, name: '注销'}], //状态选择器

        //新增--------------------------------------------------------------
        newMember: false,//新增模态框
        storeForm: {
          name: '',//名称
          storeNo: '',//编号
          province: '',//省
          city: '',//市
          area:'',//区
          address: '',//详细地址
          addressNote: '',
          phone: '',//号码
          // paymentDesciption: '',
          status: 1,//状态
          photoId: '',//图片id
          hornToken: '',
          hornSerial: '',
        },
        //编辑
        editMember: false,//编辑模态框
        editStoreForm: {
          id: '',
          name: '',//名称
          storeNo: '',//编号
          province: '',//省
          city: '',//市
          area:'',//区
          address: '',//详细地址
          addressNote: '',
          phone: '',//号码
          // paymentDesciption: '',
          status: '',//状态
          photoId: '',//图片id
          hornToken: '',
          hornSerial: '',
        },//编辑表单

        //省市联动--------------------------
        cityDetail: '',
        dataProv: cityJson['selectProv'],
        dataCity: '',
        dataCountry: '',
        provIndex: '',
        cityIndex: '',
        dialogForm: {
          name: '',
          selectProv: '',
          selectCity: '',
          selectCountry: '',
          mark: ''
        },
        selectItems: [],
        //省市联动--------------------------
        //新增判断规则
        Rules: {
          name: [
            {required: true, message: '请输入店名', trigger: 'blur'},
            {min: 2, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur'}
          ],
          storeNo: [
            {required: true, message: '请输入联系人名字', trigger: 'blur'},
            {min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur'}
          ],
          province: [
            {required: true, message: '请选择省份', trigger: 'blur'}
          ],
          city: [
            {required: true, message: '请选择城市/县', trigger: 'blur'}
          ],
          address: [
            {required: true, message: '请输入具体的地址', trigger: 'blur'},
            {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
          ],
        },
        //提示文案
        hornTokenTips: '云喇叭设备厂家提供',
        hornSerialTips: '云喇叭设备上的sn码'
      }
    },
    mounted() {
      this.getTableList()
    },
    methods: {

      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /**
       * 模态框操作  start----------------------------------------
       **/
      //高级查询
      advancedSearchOpen: function () {
        this.advancedSearch = true
      },
      advancedSearchClose: function () {
        this.advancedSearch = false
      },

      //省市
      getProv: function (prov) {
        this.provIndex = this.dataProv[0]['prov'].indexOf(prov);
        this.dataCity = this.dataProv[this.provIndex + 1]['0_' + this.provIndex];
        this.dialogForm.selectCity = this.dataCity[0];
        this.cityDetail = this.dataProv[this.provIndex + 1]['class1'];
        this.dataCountry = this.cityDetail[0]['class2'];
        this.dialogForm.selectCountry = this.dataCountry[0];
        this.storeForm.city = '';
        this.editStoreForm.city = ''
      },
      getCity: function (city) {
        this.cityIndex = this.dataCity.indexOf(city);
        this.dataCountry = this.cityDetail[this.cityIndex]['class2'];
        this.dialogForm.selectCountry = this.dataCountry[0];
        this.storeForm.area = '';
        this.editStoreForm.area = ''
      },

      /*
     * 获取门店列表
    * */
      getTableList(number, pageSize) {
        this.loading = true;
        getTableList(number, pageSize, this.searchForm).then(response => {
          let data = response.obj;
          console.log(data);
          this.tableData = data.content;
          this.totalElements = data.totalElements;
          setTimeout(() => {
            this.loading = false
          }, 500)
        }).catch(() => {
          this.loading = false
        })
      },
      //新增
      newMemberOpen: function () {
        this.storeForm = {
          name: '',//名称
          storeNo: '',//编号
          province: '',//省
          city: '',//市
          address: '',//详细地址
          addressNote: '',
          phone: '',//号码
          // paymentDesciption: '',
          status: 1,//状态
          photoId: '',//图片id
          hornToken: '',
          hornSerial: '',
        };
        this.createdSrc = '';
        this.newMember = true
      },
      newMemberClose: function () {
        this.storeForm = {
          name: '',//名称
          storeNo: '',//编号
          province: '',//省
          city: '',//市
          address: '',//详细地址
          addressNote: '',
          phone: '',//号码
          // paymentDesciption: '',
          status: 1,//状态
          photoId: '',//图片id
          hornToken: '',
          hornSerial: '',
        };
        this.createdSrc = '';
        this.newMember = false
      },
      //添加门店
      addStore: function () {
        addStore(this.storeForm).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.btnLoading = false;
          this.storeForm = {
            name: '',//名称
            storeNo: '',//编号
            province: '',//省
            city: '',//市
            address: '',//详细地址
            addressNote: '',
            phone: '',//号码
            // paymentDesciption: '',
            status: 1,//状态
            photoId: '',//图片id
            hornToken: '',
            hornSerial: '',
          };
          this.createdSrc = '';
          this.newMember = false; //关闭模态框
          this.$refs.page.refresh()
        }).catch(e => {
          this.loading = false
        })
      },

      //编辑
      openEditDialog: function (row) {
        console.log(row);
        //打开模态框
        this.editStoreForm.id = row.id;
        this.editStoreForm.name = row.name;
        this.editStoreForm.storeNo = row.storeNo;
        this.editStoreForm.province = row.province;
        this.editStoreForm.city = row.city;
        this.editStoreForm.address = row.address;
        this.editStoreForm.addressNote = row.addressNote;
        this.editStoreForm.phone = row.phone;
        // this.editStoreForm.paymentDesciption = row.paymentDesciption
        this.editStoreForm.status = row.status;
        this.editStoreForm.photoId = row.photoId;
        this.editStoreForm.hornToken = row.hornToken;
        this.editStoreForm.hornSerial = row.hornSerial;
        this.getProv(row.province);

        setTimeout(()=>{
          this.editStoreForm.city=row.city;
          this.getCity(row.city);
        },100);

        setTimeout(()=>{
          this.editStoreForm.area=row.area;
        },200);


        this.editSrc = this.getPicUrl(row.photoId);
        //获取这个门店的信息
        this.editMember = true
      },

      getPicUrl(picid) {

        //暂无图片替换图
        let noimg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAIAAAC2BqGFAAAFLklEQVR42u2dfVPyMAzA9/0/GyLKy4kep6Kgk0NRFJ2gPD13t+vTbqVbm6QdyV+Ks01/ZFmbplmyZ0GRhBEwaAbNwqAZNINmYdAMmoVBM+gG8v7+3rGWx8dHBl1POs4yn88ZdKWkadrxLQz6P/n5+emAyenpKYO2dRTj8fj397f03xeLhU0L9/f3xwsa4q6fzWZhepIkNMqDwQDUF11fXx8LaOEEShEMh0O0r7P9oD8+PpBHfn5+rnfX6/XaDPrl5UUf8/f3N5WnaifozWZDO9TpdEqoAB7oEBzlaDSiUiOhokw12dIfxTjzkISKMiHr3W6HrwY46OVyGWA4Al+NhNCcg2ItZoERg1YGc3t7Kz48OzsLk3VVOCV00NvttopmIKz1lXqUoM1jCIR1+0GHM+fzHtJCBd3r9WzwhWDXOL0n5NqTs1Y89Ww2ixX08/Oz+WJy1ghdJ4HoTeuvlVBqm0GT2zX0BiM46FrhZkLW0J36By08sovGVKzjA+2uMQlrcecdHWgq1hGDdllo4bOWO3p9fY0J9MPDg8ebA5o16LYLLOgsyxxbw7Rr0PA0LGixunVvEI213P7JyUlMoH2F0nFYg7YPC/rz8xOIAgQLueV+vx8T6Lu7O48tQ9s1nObgoLvdrt/GQVnLbW42m6NYsJCwPsaVIb6/FiuUyECLByDCnNe7XccXVFKUXi6XUbCOHjTootkja9BABxTowWCAFgnywjrWPUNF9cvLy8BZtwQ0QijZhbVyYvfr6ysm0GJlRbsX1XgDHkg9ypSwQOxavnixWEQPGuiWdGTdhiRHEqOuxVo/p9US0FRJGpbprKAqYR+twDm+aWPXyp9Wq1XcoKkciJl1Cw8LCRkOh0GxHo/HLTz+Ruus9xbHwrzsIIcCmpZ1qV0X1o2jA2p1A32c2+2WkDVmuSXseh1UpTP0fr1nboQFusppwq0bS7vzmAcRLug9VgWei4uL0l7SNMUfMlnxqm63C4dbON/QCoVRlmObTCaGWVeDXKH1eh1sYUf6AoNXV1eWNRmn0+nb29tutxP/JXz609NTlXMIsHZmKLVJ4Upmos0g4wANgRs6ThQx6FzMZS/jKrIbNGhZsixTkhdiKRgdGejWCINm0AyahUEzaAbNCBg0g2Zh0C0BXZTOtbm43+9DHEEFFcPoHKMoh0Hr6SalQRz7EI+vN2CJX70HniIDbQ7xMOjmt5W7Hg1ayEHrn6dpavZXuekEClrupnSEgYDO340xmUyiBJ33IbSf/0mu6FySvY8XX7mD1ov3l6oROujGD0Mc0KvVqkinU0TZVj8IGmJDxwq0UrzCxnU0PuzXDLTyygb5siLHw951kIE2m1J+2psQdH7UbjQa6e3kP6/Xa3cfjbFgybKscM0G1yE/62tVQW9mPvL3rZQjM5tboKCr0n/kWW3VCRE00OYu4gB90HUU34SLxspDta4ayuKlqF0hLF1PO48V9P7vZV+OGruAllGKGV5pOST5Ai8PQ1jQcIksLqDFxE720QcVOF7Q+jzBZQmuzOr0kl9m0Dc3N35nRw1Be5+rFVUc3EGXJtvpcY8q0LUO6ccH2n4CrnyugNaTz6tOXMUB2q/r0K+0jzZUuY7S+ah8nOLoLNpwRNsFdFWYyQzaPtM3JtDFu191B+oXtKXrKKbbEKECGtchryyUEIR9pLB0keKiW63znRGALr2Ra/VS9Z25gC7iq0DBLxrXka/NvCxqPbqO0nuLEjQLaqyDhUEzaAbNCBg0g2Zh0AyaQbMw6DbJP0zQqPbAWqsMAAAAAElFTkSuQmCC';

        if (picid == null || picid == '' || picid == undefined) {
          return noimg
        }
        return returnThumbnailUrl(picid)
      },
      //关闭编辑框
      editMemberClose: function () {
        this.editMember = false
      },
      //确认修改
      editOpera() {
        this.loading = true;
        this.btnLoading = true;
        editStore(this.editStoreForm).then(response => {
          this.$message({
            message: response.msg,
            type: 'success'
          });
          this.btnLoading = false;
          this.editMemberClose();
          this.$refs.page.refresh()
        }).catch(() => {
          this.btnLoading = false;
          this.loading = false
        })
      },

      //跳转详情页
      rooterDeatil(data) {
        //console.log(data)
        //query发送ID到详情
        let id = data.id;
        this.$router.push({path: '/store/views/storeDetail', query: {id: id}})
      },

      /**
       * 模态框操作 end----------------------------------------
       **/
      //创建模态框 上传
      createLogoSuccess(response, file) {
        //保存图片ID
        this.photoId = response.obj;
        console.log(response);
        this.$message({
          message: response.msg,
          type: 'success'
        });
        this.storeForm.photoId = response.obj;
        this.createdSrc = returnThumbnailUrl(response.obj)
      },
      //编辑模态框 上传
      editLogoSuccess(response, file) {
        this.$message({
          message: response.msg,
          type: 'success'
        });
        this.editStoreForm.photoId = response.obj;
        this.editSrc = returnThumbnailUrl(response.obj)
      },
      //图片上传失败
      handleLogoFailed() {
        this.$message({
          message: '图片上传失败',
          type: 'error'
        })
      },
      //对上传图片做限制
      beforeLogoUpload(file) {
        let isImage = file.type.substring(0, 5) === 'image';
        if (!isImage) {
          this.$message.error('只能上传图片');
          return false
        }
        return true
      },

      /**
       * 绑定设备
       */
      bindDev: function (row) {
        let id = row.id;
        if (id === '' || id == null) {
          this.$message.error('id数据错误，无法操作');
          return false
        }
        bindCloudSound(id).then(res => {
          this.$message.success('绑定成功')
        }).catch(e => {

        })
      },

      unbindDev:function(row){
        let id = row.id;

        if (id === '' || id == null) {
          this.$message.error('id数据错误，无法操作');
          return false
        }

        this.$confirm('此操作将解绑云音箱设备, 是否继续?', '重要操作', {
          confirmButtonText: '解 绑',
          cancelButtonText: '取 消',
          type: 'warning'
        }).then(() => {
          console.log('发起解绑');
          unbindCloudSound(id).then(res => {
            this.$message.success('解绑成功')
          }).catch(e => {

          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },


      /*
   * 搜索
   * */
      search() {
        this.$refs.page.search()
      },
      /*
      * 重置
      * */
      reset() {
        this.searchForm = {
          company: '', //公司名
          contact: '',//联系人
          status: ''//状态
        };//搜索用的表单
        this.$refs.page.search()
      },

      /*
     * 刷新
     * */
      refresh() {
        this.$refs.page.refresh()
      }
    },
    filters: {
      //列表状态过滤器
      statusfilter: function (s) {
        let text = '';
        if (s == '' || s == null || s == undefined) { // "",null,undefined
          text = 'error'
        } else {
          switch (s) {
            case '1':
              text = '未启用';
              break;
            case '2':
              text = '待审核';
              break;
            case '3':
              text = '已签约';
              break;
            case '4':
              text = '过期';
              break;
            case '5':
              text = '注销';
              break;
            default :
              text = '未知';
              break
          }
        }
        return text
      }

    }
  }
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .formItem {
    width: 250px;
  }

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
    width: auto;
    max-width: 200px;
    height: auto;
    max-height: 200px;
    display: block;
  }
</style>
