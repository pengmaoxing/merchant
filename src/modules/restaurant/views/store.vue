<template>
  <div class="app-container" v-loading="loading">
    <!--功能按钮-->
    <div class="action-container">
      <el-button icon="el-icon-refresh" size="small" @click="refresh">刷新</el-button>
    </div>
    <!--表格数据-->
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        type="index"
        width="80"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="name"
        label="门店名称">
      </el-table-column>
      <el-table-column
        prop="address"
        label="门店地址">
      </el-table-column>
      <el-table-column
        prop="username"
        label="店长账号">
      </el-table-column>
      <el-table-column
        prop="foodType"
        label="餐饮行业">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间">
      </el-table-column>
    </el-table>
    <!--分页-->
    <pagination
      :total-elements="totalElements"
      :change-callback="getTableList"
      ref="page">
    </pagination>
  </div>


</template>

<script>
  import {getTableList} from '@/modules/restaurant/api/store'
  import pagination from '@/components/pagination/index'

  export default {
    name: 'merchant',
    data() {
      return {
        // addStoreFlag: false, // 是否显示添加门店按钮
        addDialog: false,
        tableData: [], // 表格数据
        totalElements: 0, // 数据条数
        multipleSelection: [], // 选中数据-多选
        loading: true, // loading效果
        headers: {
          accessToken: sessionStorage.token
        }
      }
    },
    components: {pagination},
    created() {
      this.getTableList()
    },
    methods: {

      /**
       * 获取列表
       */
      getTableList: function (number, pageSize) {
        this.loading = true;
        getTableList(number, pageSize).then(response => {
          let data = response.obj;
          this.tableData = data.content;
          this.totalElements = data.totalElements;
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },

      /**
       * 刷新
       */
      refresh() {
        this.$refs.page.refresh()
      },
    }
  }
</script>

<style scoped>

</style>
