import fetch from 'utils/fetch';
import {deleteEmptyProperty} from 'utils/filter';
import {deepCoyp} from 'utils/copy';

export function payCRFList(search, page, size) {
  let searchCopy = deepCoyp(search)
  deleteEmptyProperty(searchCopy)
  console.log(search)
  let params = new FormData();
  params.append('search', JSON.stringify(searchCopy));
  params.append('page', page);
  params.append('size', size);
  
  return fetch({
    url: '/xqh/financial/pay/cfr/list',
    method: 'post',
    data: params,
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  });
}

export function callback(id){
  let params = new FormData();
  params.append('id', id);

  return fetch({
    url: '/xqh/financial/pay/cfr/callback',
    method: 'post',
    data: params,
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  })
}