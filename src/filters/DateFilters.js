import Vue from 'vue'

// 年 月 日 过滤器
Vue.filter('formatDte',function(value){
    let date = new Date(value);
    let y = date.getFullYear();
    let MM = date.getMonth() + 1;
    MM = MM < 10 ? ('0' + MM) : MM;
    let d = date.getDate();
    d = d < 10 ? ('0'+ d) : d;
    
    return y + '-' + MM + '-' + d;
})

// 年龄过滤器
Vue.filter('getAge',function(value){

    function toDate(number) {
        let n = number;
        let date = new Date(n);
        let Y = date.getFullYear() + '/';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
        let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        return (Y + M + D)
    }


    let birthDate = toDate(value).substr(0, 4);
    let newDate = new Date().getFullYear();
    return (newDate - parseInt(birthDate));

    
})

