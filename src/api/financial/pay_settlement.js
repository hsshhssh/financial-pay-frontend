/* eslint-disable indent */
import fetch from 'utils/fetch';
import {deleteEmptyProperty} from 'utils/filter';
import {deepCoyp} from 'utils/copy';

export function settlementList(search, page, size) {
  // console.log(search)
  let searchCopy = deepCoyp(search)
  deleteEmptyProperty(searchCopy)
  console.log(search)
  let params = new FormData();
  params.append('search', JSON.stringify(searchCopy));
  params.append('page', page);
  params.append('size', size);
  
  return fetch({
    url: '/xqh/financial/settlement/app/list',
    method: 'post',
    data: params,
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  });
}

export function appSettlementList(day) {
    return fetch({
        url: '/xqh/financial/settlement/app/' + day,
        method: 'get'
    });
}