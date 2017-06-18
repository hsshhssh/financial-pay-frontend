import fetch from 'utils/fetch';

export function appListNoPage(userId) {
  let params
  if (typeof userId !== 'undefined' && userId && userId !== 0) {
    params = new FormData();
    params.append('userId', userId);
  }


  return fetch({
    url: '/xqh/financial/pay/app/listNoPage',
    method: 'post',
    data: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}