export function deleteEmptyProperty(object){
    for (var i in object) {
        var value = object[i];
        // sodino.com
        // console.log('typeof object[' + i + ']', (typeof value));
        if (typeof value === 'object') {
            if (Array.isArray(value)) {
                if (value.length == 0) {
                    delete object[i];
                    // console.log('delete Array', i);
                    continue;
                }
            }
            deleteEmptyProperty(value);
            if (isEmpty(value)) {
                // console.log('isEmpty true', i, value);
                delete object[i];
                // console.log('delete a empty object');
            }
        } else {
            if (value === '' || value === null || value === undefined) {
                delete object[i];
                // console.log('delete ', i);
            } else {
                // console.log('check ', i, value);
            }
        }
    }
}

function isEmpty(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
}