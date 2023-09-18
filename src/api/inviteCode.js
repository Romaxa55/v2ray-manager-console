import request from '@/utils/request'

/**
 * Получить список кодов приглашения
 * @param {*} page
 */
export function list(page) {
  return request({
    url: `/invite-code`,
    method: 'get',
    params: page
  })
}

/**
 * 删除
 * @param {*} id
 */
export function del(id) {
  return request({
    url: `/invite-code/${id}`,
    method: 'DELETE'
  })
}
/**
 * 更新v2ray账号
 * @param  data
 */
export function generate(data) {
  return request({
    url: `/invite-code`,
    method: 'post',
    data
  })
}

