import request from '@/utils/request'

export default{
    saveGoods(goodsMsg){
        return request({
            url: `/goods/goodsMsg/addGoodsMsg`,
            method: 'POST',
            data: goodsMsg,
            async: false
        })
    },
    goodsList( name,brandId,typeId,pageNumber,pageSize ){
        return request({
            url: `/goods/goodsMsg/selGoodsMsg`,
            method: 'POST',
            data: { name,brandId,typeId,pageNumber,pageSize },
            async: false
        })
    },
    delgoods(id){
        return request({
            url: `/goods/goodsMsg/delGoodsMsg`,
            method: 'POST',
            params: { id },
            async: false
        })
    },
    updGoods(goodsMsg){
        return request({
            url: `/goods/goodsMsg/updGoodsMsg`,
            method: 'POST',
            data: goodsMsg,
            async: false
        })
    },
    selUnit(type){
        return request({
            url: `/goods/goodsMsg/selUnit`,
            method: 'GET',
            params: {type},
            async: false
        })
    }

}