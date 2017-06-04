/* eslint-disable prefer-const */
import fetch from 'utils/fetch';
import {deleteEmptyProperty} from 'utils/filter';
import {deepCoyp} from 'utils/copy';

export function appList(search, page, size) {
  let searchCopy = deepCoyp(search)
  deleteEmptyProperty(searchCopy)

  let params = new FormData()
  params.append('search', JSON.stringify(searchCopy))
  params.append('page', page)
  params.append('size', size)
  return fetch({
    url: '/xqh/financial/pay/app/list',
    method: 'post',
    data: params,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
}

export function appCreate(body) {
    let bodyCopy = deepCoyp(body)
    return fetch ({
        url: '/xqh/financial/pay/app',
        method: 'put',
        data: bodyCopy
    });
}
export function appUpdate(body) {
    let bodyCopy = deepCoyp(body)
    return fetch ({
        url: '/xqh/financial/pay/app',
        method: 'post',
        data: bodyCopy
    });
}