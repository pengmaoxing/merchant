import request from '@/utils/request'
import {url} from '@/utils/request'
import {uploadPrefix, project} from './constant'

export const uploadUrl = url + uploadPrefix + '/upload/files_upload' + project
export const newUploadUrl = url + uploadPrefix;

// 上传
export function uploadFile (form, module) {
  // 返回一个Promise对象
  return request({
    url: uploadUrl + '/' + module,
    method: 'post',
    data: form
  })
}

//返回缩略图Url
export function returnThumbnailUrl (filesPath) {
  return returnUrl(filesPath, 'thumbnail/')
}

//返回正常文件Url
export function returnFilesUrl (filesPath) {
  return returnUrl(filesPath, '')
}

//工具类
function returnUrl (filesPath, biasPath) {
  let echoPrefix = url + uploadPrefix + '/upload/resource/'
  let fileNames = filesPath.split('-')
  if (fileNames.length === 1) {
    let echoPath = echoPrefix + biasPath + fileNames[0]
    return echoPath
  } else {
    let echoPaths
    for (i = 0; i < fileNames.length; i++) {
      echoPaths[i] = echoPrefix + biasPath + fileNames[i]
    }
    return echoPaths
  }
}
