import fetch from 'utils/fetch'
import { deleteEmptyProperty } from 'utils/filter'
import { deepCoyp } from 'utils/copy'

export function payVerifyList(search, page, size) {
    const searchCopy = deepCoyp(search)
    deleteEmptyProperty(searchCopy)

    const params = new FormData()
    params.append('search', JSON.stringify(searchCopy))
    params.append('page', page)
    params.append('size', size)
    return fetch({
        url: '/xqh/financial/pay/verify/search',
        method: 'post',
        data: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
}

export function updatePayVerify(body) {
    const bodyCopy = deepCoyp(body)
    bodyCopy.transfer1 = bodyCopy.transfer1Yuan * 100;
    bodyCopy.transfer2 = bodyCopy.transfer2Yuan * 100;
    bodyCopy.transfer3 = bodyCopy.transfer3Yuan * 100;
    bodyCopy.transfer4 = bodyCopy.transfer4Yuan * 100;
    bodyCopy.transfer5 = bodyCopy.transfer5Yuan * 100;
    bodyCopy.transfer6 = bodyCopy.transfer6Yuan * 100;

    return fetch({
        url: '/xqh/financial/pay/verify',
        method: 'post',
        data: bodyCopy
    })
}