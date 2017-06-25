/* eslint-disable indent */
import fetch from 'utils/fetch';
import {deleteEmptyProperty} from 'utils/filter';
import {deepCoyp} from 'utils/copy';

export function settlementList(search, page, size, sort) {
  // console.log(search)
    let searchCopy = deepCoyp(search)
    deleteEmptyProperty(searchCopy)
    let params = new FormData();
    params.append('search', JSON.stringify(searchCopy));
    params.append('page', page);
    params.append('size', size);
    if (sort) {
        let sortCopy = []
        sortCopy = JSON.parse(JSON.stringify(sort))
        sortCopy = sortCopy.filter(function(n){ return n!= undefined && n != '' });
        params.append('sort', JSON.stringify(sortCopy))
    }
    return fetch({
        url: '/xqh/financial/settlement/app/list',
        method: 'post',
        data: params,
        headers:{'Content-Type':'application/x-www-form-urlencoded'}
    });
}

export function userSettlementList(search, page, size, sort) {
  // console.log(search)
    let searchCopy = deepCoyp(search)
    deleteEmptyProperty(searchCopy)
    let params = new FormData();
    params.append('search', JSON.stringify(searchCopy));
    params.append('page', page);
    params.append('size', size);
    if (sort) {
        let sortCopy = []
        sortCopy = JSON.parse(JSON.stringify(sort))
        sortCopy = sortCopy.filter(function(n){ return n!= undefined && n != '' });
        params.append('sort', JSON.stringify(sortCopy))
    }
    return fetch({
        url: '/xqh/financial/settlement/user/list',
        method: 'post',
        data: params,
        headers:{'Content-Type':'application/x-www-form-urlencoded'}
    });
}

export function appSettlementList(day) {
    return fetch({
        url: '/xqh/financial/settlement/app/' + day,
        method: 'get'
    });
}

export function appMonthSettlement(userId, appId, month, year) {
    let params = new FormData();
    if(userId && userId > 0) {
        params.append('userId', userId)
    }
    if(appId && appId > 0) {
        params.append('appId', appId)
    }
    if(month && month > 0) {
        params.append('month', month)
    }
    if(year && year > 0) {
        params.append('year', year)
    }

    return fetch({
        url: '/xqh/financial/settlement/app/month',
        method: 'post',
        data: params,
        headers:{'Content-Type':'application/x-www-form-urlencoded'}
    })
}