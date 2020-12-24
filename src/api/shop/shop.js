import request from '@/utils/request'

export default{
    shopList(name){
        return request({
            url: `/goods/shop/shopList`,
            method: 'GET',
            params: {name},
            async: false
        })
    },
    saveShop(powerShop){
        return request({
            url: `/goods/shop/registerShop`,
            method: 'POST',
            data: powerShop,
            async: false
        })
    },
    delShop(id,userId){
        return request({
            url: `/goods/shop/cancalShop`,
            method: 'POST',
            params: {id,userId},
            async: false 
        })
    }

}
