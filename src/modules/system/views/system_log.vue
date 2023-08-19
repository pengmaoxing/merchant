<template>
    <div class="app-container" v-loading="loading">
        <div class="action-container">
            <el-button  icon="el-icon-delete" size="small" type="primary" @click="deleteLog">批量删除</el-button>
            <el-button  icon="el-icon-delete" size="small" type="danger" @click="deleteAllLog">删除全部</el-button>
            <el-button  icon="el-icon-refresh" size="small" @click="refresh">刷新</el-button>
        </div>
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
                    label="操作名称">
            </el-table-column>
            <el-table-column
                    prop="requestType"
                    label="请求类型">
            </el-table-column>
            <el-table-column
                    prop="requestUrl"
                    label="请求路径">
            </el-table-column>
            <el-table-column
                    prop="requestParam"
                    label="请求参数">
            </el-table-column>
            <el-table-column
                    prop="username"
                    label="登录用户">
            </el-table-column>
            <el-table-column
                    prop="ip"
                    label="IP">
            </el-table-column>
            <el-table-column
                    prop="costTime"
                    label="耗时(毫秒)">
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="操作时间">
            </el-table-column>
        </el-table>
        <pagination
                :total-elements="totalElements"
                :change-callback="getLogList"
                ref="page"></pagination>
    </div>
</template>

<script>
import { getLog, deleteLog, deleteAllLog } from '@/modules/system/api/system_log'
import pagination from '@/components/pagination/index'

export default {
  name: 'systemLog',
  data () {
    return {
      loading: true,
      tableData: [], // 表格数据
      totalElements: 0, // 数据条数
      multipleSelection: [] // 多选
    }
  },
  components: { pagination },
  mounted () {
    this.getLogList(1, 10)
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = []
      val.forEach((item) => {
        this.multipleSelection.push(item.id)
      })
    },
    /*
    * 获取日志
    * */
    getLogList (number, pageSize) {
      this.loading = true
      getLog(number, pageSize).then(response => {
        let data = response.obj
        this.tableData = data.content
        this.totalElements = data.totalElements
        setTimeout(() => {
          this.loading = false
        }, 500)
      }).catch(() => {
        this.loading = false
      })
    },
    /*
    * 删除日志
    * */
    deleteLog () {
      this.$confirm('是否删除日志？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.multipleSelection.length) {
          this.loading = true
          deleteLog(this.multipleSelection).then(response => {
            this.$message({
              message: response.msg,
              type: 'success'
            })
            this.multipleSelection = []
            this.$refs.page.refresh()
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.$message({
            message: '请选择日志',
            type: 'warning'
          })
        }
      })
    },
    /*
   * 删除日志
   * */
    deleteAllLog () {
      this.$confirm('是否删除全部日志？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteAllLog().then(response => {
          this.$message({
            message: response.msg,
            type: 'success'
          })
          this.$refs.page.refresh()
        }).catch(() => {
          this.loading = false
        })
      })
    },
    /*
   * 刷新
   * */
    refresh () {
      this.$refs.page.refresh()
    }
  }
}
</script>

<style scoped>

</style>
