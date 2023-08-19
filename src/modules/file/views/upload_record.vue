<template>
  <div class = "app-container" v-loading = "loading">
    <div class="action-container">
      <el-button icon = "el-icon-refresh" size = "small" @click="refresh">刷新</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="操作时间" >
      </el-table-column>
      <el-table-column
        prop="uploadDetails"
        label="完成细节" >
      </el-table-column>
      <el-table-column
        prop="practicalFilesName"
        label="实际文件名">

      </el-table-column>
      <el-table-column
        prop="hardDiskFilesName"
        label="硬盘存储名称" >
      </el-table-column>
    </el-table>
    <pagination
      :total-elements="totalElements"
      :change-callback="getUploadRecordList"
      ref="page">
    </pagination>
  </div>
</template>

<script>
import {uploadFile,returnFilesUrl,returnThumbnailUrl,uploadUrl} from '../api/upload'
import {getUploadRecordList} from '../api/upload_record'
import Pagination from "../../../components/pagination/index";
export default {
  name: 'uploadRecord',
  components: {Pagination},
  data () {
    return {
      tableData: [], // 表格数据
      loading: true, // loading效果
      totalElements: 0, // 数据条数
    }
  },
  created () {
    this.getUploadRecordList()
  },
  methods: {

    getUploadRecordList: function(number, pageSize){
      console.log(uploadUrl)
      this.loading = true
      getUploadRecordList(number, pageSize).then(response =>{
        let data = response.obj.content
        this.totalElements = response.obj.totalElements
        for(let i = 0; i <data.length; i++){
          let uploadRecordInfoVo = data[i].uploadRecordInfoVos
          let practicalFilesName = ''
          let hardDiskFilesName = ''
          for(let j = 0; j < uploadRecordInfoVo.length ; j++){
            console.log(returnFilesUrl(uploadRecordInfoVo[j].path))
            practicalFilesName +="《" + uploadRecordInfoVo[j].fileName +"》"
            hardDiskFilesName +="《" + uploadRecordInfoVo[j].pathName +"》"
          }
          data[i].practicalFilesName = practicalFilesName
          data[i].hardDiskFilesName = hardDiskFilesName
        }
        this.tableData = data
        this.loading = false
      }).catch((err) =>{
        console.log(err)
        this.loading = false
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
