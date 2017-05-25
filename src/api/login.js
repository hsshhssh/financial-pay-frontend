import fetch from 'utils/fetch';

export function loginByEmail(email, password) {
  const data = {
    email,
    password
  };
  return fetch({
    url: '/login/loginbyemail',
    method: 'post',
    data
  });
}

export function loginByUserName(userName, password) {
  let params = new FormData();
  params.append("userName", userName);
  params.append("password", password);

  return fetch({
    url: '/pay/user/login',
    method: 'post',
    data: params,
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  });
}

export function logout() {
  return fetch({
    url: '/login/logout',
    method: 'post'
  });
}

export function getInfo(token) {
  return fetch({
    url: '/pay/user/info',
    method: 'get',
    params: { token }
  });
}

export function restPWD(userName, passwordOld, password) {
  let params = new FormData();
  params.append("userName", userName);
  params.append("password", password);
  params.append("passwordOld", passwordOld);

  return fetch({
    url: '/pay/user/reset',
    method: 'post',
    data: params,
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  })
}

export function getPayData(userId) {
  let params = new FormData();
  params.append("userId", userId);

  return fetch({
    url: '/xqh/financial/settlement/data',
    method: 'post',
    data: params,
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  })
}

