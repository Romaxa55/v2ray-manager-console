import request from '@/utils/request'

export function listNotice() {
  return request({
    url: '/api/notice',
    method: 'get',
  })
}

export function addNotice(data) {
  return request({
    url: '/api/notice',
    method: 'post',
    data
  })
}

export function updateNotice(data) {
  return request({
    url: '/api/notice',
    method: 'put',
    data
  })
}
export function getNotice(id) {
  return request({
    url: `/api/notice/${id}`,
    method: 'get'
  })
}
export function delNotice(id) {
  return request({
    url: `/api/notice/${id}`,
    method: 'delete'
  })
}
