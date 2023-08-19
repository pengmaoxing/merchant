<template>
      <div :id='Id'  :class="{fullScreen: isFullScreen}"></div>
</template>

<script>
import {returnFilesUrl,returnThumbnailUrl,uploadFile,uploadUrl} from '@/modules/file/api/upload'
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/modern/theme'
import { getPlugins } from './requireEditorPlugins'
export default {
  name: 'richTextEditor',
  props: {
    plugins: {
      type: String,
      default: 'hr lists link image imagetools media preview anchor pagebreak insertdatetime code colorpicker table textcolor searchreplace fullscreen wordcount'
    },
    toolbar: {
      type: Array,
      default () {
        return [
          'bold italic underline strikethrough fontsizeselect alignleft aligncenter alignright alignjustify outdent indent blockquote undo redo removeformat',
          'hr numlist bullist link image media preview anchor pagebreak insertdatetime forecolor backcolor searchreplace fullscreen'
        ]
      }
    },
    editorHeight: {
      type: Number,
      default: 600
    },
    Id:{
      type:Number,
      require:true,
    },
    module:{
      type:String,
      require:true
    }
  },
  data () {
    return {
      uploadDialog: false,
      isFullScreen: false,
      content:'',
    }
  },
  created(){
    this.init();
  },
  // mounted () {
  //   getPlugins(this.plugins, this.initEditor)
  // },
  methods: {
    /*
    * 初始化编辑器
    * */
   init(){
      getPlugins(this.plugins, this.initEditor)
   },
    initEditor () {
     console.log(this.module)
      let _self = this;
     // console.log(this.$el.tinymce);
      tinymce.init({
        selector: `#${this.Id}`,
        language_url: '/static/tinymce/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/static/tinymce/skins/lightgray',
        height: _self.editorHeight,
        plugins: _self.plugins,
        toolbar: _self.toolbar,
        images_upload_url: '/resource/images/',
        images_upload_handler: function (blobInfo, success, failure) {
          let formData = new FormData();
          formData.append('files', blobInfo.blob(), blobInfo.filename());
          formData.append('module', 'token')
           uploadFile(formData,"article").then(response => {
              // success('http://beta.bhpcash.io:8758/resource/images/'+imgArr.join(''));
             //success('http://pic2.ooopic.com/12/40/58/18bOOOPIC9c.jpg');
             success(returnFilesUrl(response.obj));
            }).catch((err) => {
              failure('Invalid JSON: ' + err);
            })
        },

        init_instance_callback (editor) {
          console.log(editor)

        },
        setup (editor) {
          editor.on('FullscreenStateChanged', (e) => {
           _self.isFullScreen = e.state
          });
        },

       branding: false
      })
    },
    /*
    * 打开上传图片模态框
    * */
    openUploadDialog () {
      this.uploadDialog = true
    },
    /*
    * 关闭上传图片模态框
    * */
    closeUploadDialog () {
      this.uploadDialog = false
    },
    /**
     * 获取富文本内容
     * */
    getContent () {
      this.content = tinymce.activeEditor.getContent()
    },
    /**
     * 设置富文本内容
     */
    setContent(value){
      console.log(123);
      console.log(tinymce);
      tinymce.activeEditor.setContent(value);
    },
    /**
     * 销毁富文本编辑器（重新初始化编辑器，需先销毁）
     */
    destory(){
      tinymce.remove(`#${this.Id}`);
    }
  }
}
</script>

<style scoped>
    .tinymce{
        position: relative;
    }
    /* 保证样式用于子组件 */
    .tinymce >>> .mce-fullscreen{
        z-index: 10000;
    }
    .upload-image{
        position: absolute;
        top: 4px;
        right: 4px;
    }
    .fullScreen .upload-image{
        z-index: 10000;
        position: fixed;
    }
</style>
