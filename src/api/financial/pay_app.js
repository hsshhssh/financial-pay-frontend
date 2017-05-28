import fetch from 'utils/fetch';
import {deleteEmptyProperty} from 'utils/filter';
import {deepCoyp} from 'utils/copy';

export function appListNoPage(userId) {
  let params = new FormData();
  params.append("userId", userId);

  return fetch({
    url: '/xqh/financial/pay/app/listNoPage',
    method: 'post',
    data: params,
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  });
}