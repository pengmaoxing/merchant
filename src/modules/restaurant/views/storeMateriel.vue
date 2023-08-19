<template>
  <div class="app-container">
    <!--物料下载页面-->
    <div class="material_download_box">
      <!--小程序物料-->
      <div class="unit">
        <div class="unit_title">
          <span>小程序物料</span>
        </div>
        <div class="unit_content square">
          <ul style="margin: 0 -14px 0 -14px">
            <!--列表-->
            <li class="card_square">
              <div class="card_square_content">
                <!--物料图片-->
                <div class="content-img"><img src="@/assets/material/material.png" style="margin: 0 auto"></div>
                <!--遮罩-->
                <div class="zz">扫一扫进入小程序</div>
                <!--下载按钮-->
                <div class="content-download" title="点击下载" @click="materialDownload"><i class="el-icon-download"></i>
                </div>
              </div>
              <!--物料标题-->
              <p>小程序二维码</p>
            </li>

            <!--<li class="card_square">-->
              <!--<div class="card_square_content">-->

                <!--&lt;!&ndash;物料图片&ndash;&gt;-->
                <!--<div class="content-img"><img src="@/assets/material/material.png" style="margin: 0 auto"></div>-->
                <!--&lt;!&ndash;遮罩&ndash;&gt;-->
                <!--<div class="zz">扫一扫点餐</div>-->
                <!--&lt;!&ndash;下载按钮&ndash;&gt;-->
                <!--<div class="content-download" title="点击下载" @click="materialDownload"><i class="el-icon-download"></i></div>-->
              <!--</div>-->
              <!--&lt;!&ndash;物料标题&ndash;&gt;-->
              <!--<p>点餐-亚克力立牌</p>-->
            <!--</li>-->
            <!--<li class="card_square">-->
              <!--<div class="card_square_content">-->
                <!--&lt;!&ndash;物料图片&ndash;&gt;-->
                <!--<div class="content-img"><img src="@/assets/material/material.png" style="margin: 0 auto"></div>-->
                <!--&lt;!&ndash;遮罩&ndash;&gt;-->
                <!--<div class="zz">扫一扫点餐</div>-->
                <!--&lt;!&ndash;下载按钮&ndash;&gt;-->
                <!--<div class="content-download" title="点击下载" @click="materialDownload"><i class="el-icon-download"></i></div>-->
              <!--</div>-->
              <!--&lt;!&ndash;物料标题&ndash;&gt;-->
              <!--<p>点餐-桌面二维码贴纸</p>-->
            <!--</li>-->
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getMaterial} from '../api/material'
  import Vue from 'vue'
  import {url} from '@/utils/request'

  export default {
    name: "storeMateriel",
    data() {
      return {}
    },
    methods: {
      /**
       * 下载物料
       **/
      materialDownload: function () {

        // getMaterial().then(res => {
        //
        // }).catch(e => {
        //
        // })

        // 直接下载
        let mid = sessionStorage.getItem('merchantId') || '';
        if (mid == null || mid === '') {
          this.$message.error('uuid error , not download')
          return false
        }
        let urlStr = `${url}/repast/material/download?merchantId=${mid}`;
        window.location.href = urlStr
      }
    }
  }
</script>

<style scoped>
  .material_download_box {
    padding: 0 20px 0 20px;
    overflow: hidden;
  }

  .unit {
    width: 100%;
    overflow: hidden;
    margin-bottom: 20px;
  }

  .unit_title {
    width: 200px;
    height: 20px;
    font-weight: bold;
    padding: 0 0 0 10px;
    border-left: 10px solid #ff803e;
    vertical-align: middle;
  }

  .unit_title span {
    line-height: 20px;
    color: #466087;
  }

  .square {
    width: 100%;
    margin-top: 20px;
    margin-left: -20px;
    margin-right: -14px;
    overflow: hidden;
  }

  .square ul li {
    display: inline-block;
  }

  .card_square {
    padding-left: 14px;
    padding-right: 14px;
    list-style: none;
  }

  .card_square p {
    width: 160px;
    text-align: center;
    color: #8b8b8b;
    font-size: 14px;
    margin-top: -10px;
    cursor: default;
  }

  .card_square_content {
    position: relative;
    margin-bottom: 16px;
    height: 200px;
    width: 160px;
    border-radius: 5px;
    background-color: white;
    border: 1px solid #d0d0d0;
  }

  .content-img {
    position: relative;
    top: 0;
    left: 0;
    width: 158px;
    height: 170px;
    overflow: hidden;
    padding: 10px 10px 10px 10px;
    border-radius: 5px 5px 0 0;
    text-align: center;
  }

  .content-img img {
    height: 150px;
    max-height: 100%;
    overflow: hidden;
    margin: 0 auto;
  }

  .content-download {
    cursor: pointer;
    background-color: #eeeeee;
    position: relative;
    left: 0;
    top: 0;
    height: 28px;
    border-radius: 0 0 5px 5px;
    text-align: center;
  }

  .content-download i {
    margin: 0 auto;
    font-size: 20px;
    line-height: 28px;
    font-weight: bold;
    color: rgb(255, 128, 62);
  }

  .content-download:hover i {
    color: white;
  }

  .content-download:hover {
    background-color: rgb(255, 128, 62);
    transition: all .5s ease;
  }

  .card_square_content:hover {
    border: 1px solid rgb(255, 128, 62);
  }

  .zz {
    position: absolute;
    top: 0;
    left: 0;
    width: 158px;
    height: 170px;
    border-radius: 5px 5px 0 0;
    background-color: rgba(0, 0, 0, 0);
    color: rgba(0, 0, 0, 0);
    font-weight: lighter;
    font-size: 13px;
    line-height: 170px;
    word-wrap: break-word;
    word-break: break-all;
    text-align: center;
    transition: all 0.3s ease;
  }

  .zz:hover {
    background-color: rgba(0, 0, 0, .6);
    color: white;
    cursor: default;
  }
</style>
