<template>
    <div class="tags-view-container">

    </div>
</template>

<script>
export default {
  name: 'tags-view',
  computed: {
    visitedViews () {
      return this.$store.getters.visitedViews
    }
  },
  mounted () {
    this.addVisitedView()
  },
  watch: {
    '$route' (to, from) {
      console.log(this.$route)
      this.addVisitedView()
    }
  },
  methods: {
    /*
    * 添加浏览地址
    * */
    addVisitedView () {
      this.$store.dispatch('addVisitedView', this.$route)
    },
    /*
    * 删除浏览地址
    * */
    deleteVisitedView (item) {
      this.$store.dispatch('deleteVisitedView', item).then(() => {
        if (this.$route.path === item.path) {
          let len = this.visitedViews.length
          if (len !== 0) {
            let latestView = this.visitedViews[len - 1].path
            this.$router.push({ path: latestView })
          } else {
            this.$router.push({ path: '/' })
          }
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .tags-view-container {
        .tags-view-wrapper {
            background: #fff;
            height: 34px;
            border-bottom: 1px solid #d8dce5;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
            .tags-view-item {
                display: inline-block;
                position: relative;
                height: 26px;
                line-height: 26px;
                border: 1px solid #d8dce5;
                color: #495060;
                background: #fff;
                padding: 0 8px;
                font-size: 12px;
                margin-left: 5px;
                margin-top: 4px;
                &:first-of-type {
                    margin-left: 15px;
                }
                &.active {
                    background-color: #42b983;
                    color: #fff;
                    border-color: #42b983;
                    &::before {
                        content: '';
                        background: #fff;
                        display: inline-block;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        position: relative;
                        margin-right: 2px;
                    }
                }
            }
        }
        .contextmenu {
            margin: 0;
            background: #fff;
            z-index: 100;
            position: absolute;
            list-style-type: none;
            padding: 5px 0;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 400;
            color: #333;
            box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
            li {
                margin: 0;
                padding: 7px 16px;
                cursor: pointer;
                &:hover {
                    background: #eee;
                }
            }
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss">
    //reset element css of el-icon-close
    .tags-view-wrapper {
        .tags-view-item {
            .el-icon-close {
                width: 16px;
                height: 16px;
                vertical-align: 2px;
                border-radius: 50%;
                text-align: center;
                transition: all .3s cubic-bezier(.645, .045, .355, 1);
                transform-origin: 100% 50%;
                &:before {
                    transform: scale(.6);
                    display: inline-block;
                    vertical-align: -3px;
                }
                &:hover {
                    background-color: #b4bccc;
                    color: #fff;
                }
            }
        }
    }
</style>
