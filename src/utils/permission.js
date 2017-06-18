import store from 'store';

// 判断是否是管理员的权限
export function isAdminRole() {
  const roles = store.getters.roles

  if (roles.indexOf('admin') >= 0) {
    return true
  } else {
    return false
  }
}

// 获取用户id
export function getUidWithUndefined() {
  if (isAdminRole()) {
    return undefined
  } else {
    return store.getters.uid
  }
}