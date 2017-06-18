// 获得当前0点时间
export function getZeroTime() {
    let date = new Date()
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    date.setTime(date.getTime() + 3600 * 1000 * 24 * 1)
    return date
}