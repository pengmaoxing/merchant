<template>
  <div class="app-container" v-loading="loading">
    <!--顶部操作-->
    <div class="action-container">
      <el-button type="primary" icon="el-icon-refresh" size="small" @click="refresh">刷新</el-button>
      <el-button icon="el-icon-delete" size="small" v-if="!multipleSelectionMode"
                 @click="multipleSelectionMode=!multipleSelectionMode">批量删除
      </el-button>
      <el-button type="danger" v-if="multipleSelectionMode" icon="el-icon-delete" size="small" @click="deleteDeskRooms">
        删除
      </el-button>
      <el-button v-if="multipleSelectionMode" icon="el-icon-close" size="small" @click="multipleSelectionMode=false">
        取消
      </el-button>
      <el-button icon="el-icon-caret-left" size="small" @click="goback" style="float: right">返回上一页</el-button>
    </div>

    <!--桌广场-->
    <template>
      <div class="desk_all_box">
        <el-row>
          <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4" class="desk_square">
            <div class="desk_square_content add_desk" @click="openDeskRoomAddDialog">
              <p class="">
                <i></i>
                <span>添加位置</span>
              </p>
            </div>
          </el-col>

          <template v-for="room in tableData">
            <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4" class="desk_square">
              <div class="desk_square_content">
                <div class="table_num">
                  <p style="text-align: center">
                    <span>{{room.name}}</span>
                  </p>
                </div>
                <div class="table_type">
                <span @click="openEditDialog(room)"
                      style="position: absolute;top: 50%;font-size: 14px;color: #666666;margin-top: -10px;left: 15px">编辑</span>
                  <span @click="deleteRoom(room)"
                        style="position: absolute;top: 50%;font-size: 14px;color: #666666;margin-top: -10px;right: 15px">删除</span>
                </div>
                <p :class="{'no-select':multipleSelectionMode}">
                  <span :class="{selectImg:room.active}" @click.stop="pitchon(room,room.id)"></span>
                </p>
              </div>
            </el-col>
          </template>

        </el-row>


      </div>
      <pagination
        :total-elements="totalElements"
        :change-callback="getDeskRoomList"
        ref="page"></pagination>
    </template>

    <!--模态框-->
    <template>
      <el-dialog
        title="添加位置"
        :visible.sync="deskRoomAddDialog"
        :before-close="closeDeskRoomAddDialog">
        <el-form :model="form">

          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDeskRoomAddDialog">取 消</el-button>
          <el-button type="primary" @click="addDeskRoom" :loading="btnLoading">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="编辑位置"
        :visible.sync="editDialog"
        :before-close="closeEditDialog">
        <el-form>
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="currentRow.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeEditDialog">取 消</el-button>
          <el-button type="primary" @click="editDeskRoom" :loading="btnLoading">确 定</el-button>
        </div>
      </el-dialog>
    </template>
  </div>
</template>

<script>
  import {deskRoomList, deskRoomAdd, deskRoomUpdate, deskRoomLogicalDel} from '../api/tableManager'
  import pagination from '@/components/pagination/index'
  import Vue from 'vue'

  export default {
    components: {pagination},
    name: 'tableRoom',
    data() {
      return {
        loading: false,
        btnLoading: false,
        multipleSelection: [], // 选中数据-多选
        multipleSelectionMode: false,//多选模式
        totalElements: 0, // 数据条数
        queryList: {}, // 搜素数据
        tableData: [], // 表格数据
        deskRoomAddDialog: false, // 添加角色模态框
        form: {
          name: '',
        }, // 添加位置数据
        formLabelWidth: '120px',
        options: [],
        editDialog: false, // 编辑位置模态框
        currentRow: {
          id: '',
          name: '',
        } // 当前表格对象
      }
    },
    mounted() {
      this.getDeskRoomList()
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleDelete(row) {
        this.multipleSelection.push(row)
        this.deleteDeskRooms()
      },
      /*
       * 获取位置列表
       * */
      getDeskRoomList(number, pageSize) {
        this.loading = true
        deskRoomList(number, pageSize, this.queryList).then(response => {
          let data = response.obj
          console.log(data)
          this.totalElements = data.totalElements
          this.tableData = data.content
          setTimeout(() => {
            this.loading = false
          }, 500)
        }).catch(() => {
          this.loading = false
        })
      },

      /*
       * 添加位置
       * */
      /*
       * 打开添加位置模态框
       * */
      openDeskRoomAddDialog() {
        this.deskRoomAddDialog = true
      },
      /*
       * 关闭添加位置模态框
       * */
      closeDeskRoomAddDialog() {
        this.deskRoomAddDialog = false
        this.form = {
          name: '',
        }
      },
      /*
       * 添加位置
       * */
      addDeskRoom() {
        this.loading = true
        this.btnLoading = true
        deskRoomAdd(this.form).then(response => {
          this.$message({
            message: response.msg,
            type: 'success'
          })
          this.btnLoading = false
          this.closeDeskRoomAddDialog()
          this.$refs.page.refresh()
        }).catch(() => {
          this.btnLoading = false
          this.loading = false
        })
      },
      /*
     * 汇集选中的位置，并修改样式,
     * 取消时候，删除被选中列表
     * */
      pitchon(room, id) {
        if (room.active) {
          Vue.set(room, 'active', false)  //为item添加不存在的属性，需要使用vue提供的Vue.set( object, key, value )方法

          for (let i = 0; i < this.multipleSelection.length; i++) {
            if (this.multipleSelection[i].id === id) {
              this.multipleSelection.splice(i, 1);
            }
          }
          console.log(this.multipleSelection)

        } else {
          Vue.set(room, 'active', true)
          this.multipleSelection.push({id: id});
          console.log(this.multipleSelection)
        }
      },
      /*
      * 删除单个位置
      * */
      deleteRoom(room) {
        // 删除单个位置
        let ids = [];
        ids.push(room.id);
        this.$confirm('是否删除位置', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deskRoomLogicalDel(ids).then(response => {
            this.$message({
              message: response.msg,
              type: 'success',
              duration: 1000
            });
            this.$refs.page.refresh()
          }).catch(() => {
            this.loading = false
          })
        })
      },
      /*
      * 删除位置
      * */
      deleteDeskRooms() {
        this.$confirm('是否删除位置？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.multipleSelection.length) {
            this.loading = true
            let ids = []
            this.multipleSelection.forEach((item) => {
              ids.push(item.id)
            })
            deskRoomLogicalDel(ids).then(response => {
              this.$message({
                message: response.msg,
                type: 'success',
                duration: 1000
              })
              this.multipleSelection = []
              this.$refs.page.refresh()
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.$message({
              message: '请选择位置',
              type: 'warning',
              duration: 1000
            })
          }
        })
      },

      /*
       * 编辑位置
       * */
      /*
       * 打开编辑位置模态框
       * */
      openEditDialog(row) {
        this.currentRow.id = row.id
        this.currentRow.name = row.name
        this.editDialog = true
      },
      /*
       * 关闭编辑位置模态框
       * */
      closeEditDialog(row) {
        this.editDialog = false
      },
      /*
       * 编辑位置
       * */
      editDeskRoom() {
        this.loading = true
        this.btnLoading = true
        deskRoomUpdate(this.currentRow).then(response => {
          this.$message({
            message: response.msg,
            type: 'success'
          })
          this.btnLoading = false
          this.closeEditDialog()
          this.$refs.page.refresh()
        }).catch(() => {
          this.btnLoading = false
          this.loading = false
        })
      },

      /*
     * 刷新
     * */
      refresh() {
        this.$refs.page.refresh()
      },
      /*
      * 搜索
      * */
      search() {
        this.$refs.page.search()
      },

      /**
       * 返回上一页
       */
      goback: function () {
        this.$router.go('-1')
      }
    }
  }
</script>

<style scoped>
  body .el-table th.gutter {
    display: table-cell !important;
  }

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
    color: #999999;
  }

  .add_desk > p i {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-top: -9px;
    background: url(data:image/png;base64,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) no-repeat;
    background-size: 100% 100%;
  }

  .add_desk :hover p i {
    background-size: 100% 100%;
    background: url(data:image/png;base64,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) no-repeat;
  }

  .table_num {
    width: 100%;
    height: 64px;
    line-height: 64px;
    margin-top: -17px;
    background-color: #626262;
    border-radius: 4px 4px 0 0;
  }

  .table_num span {
    color: white;
    font-size: 20px;
  }

  .table_type {
    position: relative;
    width: 100%;
    height: 34px;
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

</style>
