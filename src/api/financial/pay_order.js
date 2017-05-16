import { fetch } from 'utils/fetch';

export function orderList() {
  
  let search = {id_gt: 1};

  let params = new FormData();
  params.append('search', JSON.stringify(search));

  return fetch({
  	baseURL: 'http://localhost:8080',
    url: '/xqh/financial/pay/order/list',
    method: 'post',
    data: params,
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  });
}