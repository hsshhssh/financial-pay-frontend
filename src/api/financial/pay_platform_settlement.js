import fetch from 'utils/fetch'
import { deleteEmptyProperty } from 'utils/filter'
import { deepCoyp } from 'utils/copy'

export function platformSettlementList(search, page, size) {
    const searchCopy = deepCoyp(search)
    deleteEmptyProperty(searchCopy)

    const params = new FormData()
    params.append('search', JSON.stringify(searchCopy))
    params.append('page', page)
    params.append('size', size)
    return fetch({
        url: '/xqh/financial/pay/platformSettlement/list',
        method: 'post',
        data: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
}

export function simplePlatformList() {

    return fetch({
        url: '/xqh/financial/pay/platformSettlement/simplePlatform/list',
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
}
