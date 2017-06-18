/* eslint-disable indent */
import fetch from 'utils/fetch'
import { deleteEmptyProperty } from 'utils/filter'
import { deepCoyp } from 'utils/copy'

export function userList(search, page, size) {
    const searchCopy = deepCoyp(search)
    deleteEmptyProperty(searchCopy)

    const params = new FormData()
    params.append('search', JSON.stringify(searchCopy))
    params.append('page', page)
    params.append('size', size)
    return fetch({
        url: '/pay/user/list',
        method: 'post',
        data: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
}

export function userListNoPage() {
    const params = new FormData()
    params.append('search', '{}')
    params.append('page', 1)
    params.append('size', 1000)
    return fetch({
        url: '/pay/user/list',
        method: 'post',
        data: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
}

export function userCreate(body) {
    const bodyCopy = deepCoyp(body)
    return fetch({
        url: '/pay/user',
        method: 'put',
        data: bodyCopy
    })
}

export function userUpdate(body) {
    const bodyCopy = deepCoyp(body)
    return fetch({
        url: '/pay/user',
        method: 'post',
        data: bodyCopy
    })
}