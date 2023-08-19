import request from '@/utils/request'
import qs from 'qs'

// 获取会员列表
export function findMemberList(pageNumber, pageSize, memberNum, phone, start_createTime, end_createTime) {
  return request({
    url: '/member/member/member_list',
    method: 'get',
    params: {
      pageSize,
      pageNumber,
      memberNum,
      phone,
      start_createTime,
      end_createTime
    }
  })
}

// 修改用户信息
export function editMember(memberInfo) {
  return request({
    url: '/member/member/update',
    method: 'post',
    data: qs.stringify(
      memberInfo
    )
  })
}

// 获取用户详情
export function memberDetail(id) {
  return request({
    url: '/member/member/merchant_member_detail',
    method: 'get',
    params: {
      id,
    }
  })
}

//导出用户信息
export function memberExport() {
  return request({
    url: '/member/member/member_export',
    method: 'get',
  })
}

//分析
export function findAnalyseCard(startTime, endTime) {
  return request({
    url: '/member/statistics/member_analyse_card',
    method: 'get',
    params: {
      startTime,
      endTime
    }
  })
}

//会员分析 按时间

export function findAnalyseByTime(startTime, endTime) {
  return request({
    url: '/member/statistics/member_analyse_chart_by_time',
    method: 'get',
    params: {
      startTime,
      endTime
    }
  })
}

//会员分析 按渠道

export function findAnalyseByChannel(startTime, endTime) {
  return request({
    url: '/member/statistics/member_analyse_chart_by_channel',
    method: 'get',
    params: {
      startTime,
      endTime
    }
  })
}

//会员分析 按性别

export function findAnalyseBySex(startTime, endTime) {
  return request({
    url: '/member/statistics/member_analyse_chart_by_sex',
    method: 'get',
    params: {
      startTime,
      endTime
    }
  })
}

//会员活跃度分析
export function findAnalyseByActivity(startTime, endTime) {
  return request({
    url: '/member/statistics/member_analyse_consume_activity_level',
    method: 'get',
    params: {
      startTime,
      endTime
    }
  })
}

///

export function findOneUserRecored(pageNum, pageSize, data) {
  return request({
    url: '/member/stored_recored/list',
    method: 'get',
    params: {
      pageNumber: pageNum,
      pageSize: pageSize,
      memberId: data.id,
      tradeType: data.tradeType,
      storedNum: data.number,
      start_createTime: data.startTime,
      end_createTime: data.endTime,
    }
  })
}

export function findOneUserPoint(pageNum, pageSize, data) {
  return request({
    url: '/member/credits_info/person_Info',
    method: 'get',
    params: {
      pageNumber: pageNum,
      pageSize: pageSize,
      memberId: data.id,
      infoType: data.pointType,
      start_tradeTime: data.startTime,
      end_tradeTime: data.endTime,
    }
  })
}


//查找全部商品
export function findMaintenanceGoods() {
  return request({
    url: '/luxury/goods/find_all',
    method: 'get',
    params: {}
  })
}

//查找会员配置
export function findMaintenanceConfig(id) {
  return request({
    url: '/member/maintenance/find_re',
    method: 'get',
    params: {
      memberId: id
    }
  })
}


//保存保养
export function saveMaintenanceGoods(form) {
  return request({
    url: '/member/maintenance/save_re',
    method: 'post',
    data: qs.stringify(
      form
    )
  })
}

//足迹
export function getMemberFootList(pageSize, pageNumber, id) {
  return request({
    url: '/member/foot/list',
    method: 'get',
    params: {
      pageSize: pageSize, pageNumber: pageNumber, memberId: id
    }
  })
}

//足迹
export function getMemberFootCount(pageSize = 0, pageNumber = 0, id) {
  return request({
    url: '/member/foot/count_goods',
    method: 'get',
    params: {
      memberId: id
    }
  })
}

//查找消息配置
export function findMessageConfig(id) {
  return request({
    url: '/member/message/find_re',
    method: 'get',
    params: {
      merchantId: id
    }
  })
}

//查找消息配置
export function saveMessageConfig(form) {
  return request({
    url: '/member/message/save',
    method: 'post',
    data: qs.stringify(
      form
    )
  })
}

//查找消息配置
export function modifyMessageConfig(form) {
  return request({
    url: '/member/message/update',
    method: 'post',
    data: qs.stringify(
      form
    )
  })
}






