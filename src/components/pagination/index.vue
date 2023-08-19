<template>
    <div class="pagination-container">
        <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="comCurrentPage"
                :page-sizes="pageSizes"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalElements">
        </el-pagination>
    </div>
</template>

<script>
export default {
  name: 'pagination',
  data () {
    return {
      pageSize: this.pageSizes[0],
      comCurrentPage: this.currentPage
    }
  },
  props: {
    pageSizes: {
      type: Array,
      default () {
        return [10, 20, 50, 100]
      }
    }, // 每页显示数量
    totalElements: {
      type: Number,
      required: true
    }, // 数据总量
    currentPage: {
      type: Number,
      default: 1
    }, // 当前页
    changeCallback: {
      type: Function,
      required: true
    }
  },
  methods: {
    /*
    每页显示数量改变
    * */
    handleSizeChange (val) {
      this.pageSize = val
      this.changeCallback(this.comCurrentPage, this.pageSize)
    },
    /*
    页面跳转
    * */
    handleCurrentChange (val) {
      this.comCurrentPage = val
      this.changeCallback(this.comCurrentPage, this.pageSize)
    },
    /*
    刷新
    * */
    refresh () {
      console.log('执行了刷新')
      this.changeCallback(this.comCurrentPage, this.pageSize)
    },
    /*
    搜素/初始化列表
    * */
    search () {
      this.pageSize = this.pageSizes[0]
      this.comCurrentPage = 1
      this.changeCallback(this.comCurrentPage, this.pageSize)
    }
  }
}
</script>

<style scoped>

</style>
