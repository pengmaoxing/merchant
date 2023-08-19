/*
* 按需引入编辑器插件
* param 插件字符串
* */
export function getPlugins (str, callback) {
  let plugins = str.trim().split(/\s+/)
  plugins.forEach((value, index) => {
    require.ensure([], (require) => {
      require('tinymce/plugins/' + value)
      /* 执行初始化 */
      if (index === plugins.length - 1) {
        callback()
      }
    })
  })
}
