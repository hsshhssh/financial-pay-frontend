/* eslint-disable indent */
import fetch from 'utils/fetch'
import { deleteEmptyProperty } from 'utils/filter'
import { deepCoyp } from 'utils/copy'

export function switchPayPlatform(body) {
    const bodyCopy = deepCoyp(body)
    return fetch({
        url: '/xqh/financial/pay/appPlatform/switchPlatform',
        method: 'post',
        data: bodyCopy
    })
}