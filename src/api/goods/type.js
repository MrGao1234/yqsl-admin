import request from '@/utils/request'

export default{
    typeList(){
        return request({
            url: `/goods/goodsType/selGoodsType`,
            method: 'GET',
            async: false
        })
    },

}
