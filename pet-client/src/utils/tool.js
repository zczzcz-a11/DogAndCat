// 防抖函数
export const debounce = (fn, wait) => {
    let time = null;
    return function(){
        clearTimeout(time);
        time = setTimeout(()=>{
            fn.apply(this)
        }, wait)
    }
}

// 节流函数
export const throttle = (fn, wait) => {
    let canRun = true;
    return function () {
        if (!canRun)
            return;
        canRun = false;
        setTimeout(() => {
            fn.apply(this);
            canRun = true;
        }, wait)
    }
}

// 格式化时间戳
export const timeInterval = (dateTime, type) => {
    
    dateTime = Number(dateTime);
    let date = new Date(new Date().toLocaleDateString()).getTime();
    if (dateTime.toString().length == 10) dateTime *= 1000;
    let timestamp = new Date(dateTime);
    let timer = (date - timestamp) / 1000;

    let year = timestamp.getFullYear(),
        month = timestamp.getMonth() + 1,
        day = timestamp.getDate(),
        hour = timestamp.getHours(),
        min = timestamp.getMinutes();

    if(min < 10) min = `0${min}`;

    let tips = '';
    if(type){
        if(new Date().getFullYear() !== year){
            return `${year}年${month}月${day}日 ${hour}:${min}`;
        }
        switch (true) {
            case timer < 0:
                tips = `${hour}:${min}`;
                break;
            case timer >= 0 && timer < 365 * 86400:
                tips = `${month}月${day}日 ${hour}:${min}`;
                break;
        }
    }else{
        if(new Date().getFullYear() !== year){
            return `${year}年${month}月${day}日 ${hour}:${min}`;
        }
        switch (true) {
            case timer < 0:
                tips = `${hour}:${min}`;
                break;
            case timer >= 0 && timer < 365 * 86400:
                tips = `${month}月${day}日`;
                break;
        }
    }
    return tips; 

}
