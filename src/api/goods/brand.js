import request from '@/utils/request'

export default{
    brandList(name,pageNumber,pageSize){
        return request({
            url: `/goods/brand/selBrands`,
            method: 'POST',
            data: { name,pageNumber,pageSize },
            async: false
        })
    },
    delBrand(id){
        return request({
            url: `/goods/brand/delBrand`,
            method: 'POST',
            params: { id },
            async: false
        })
    },
    updBrand(goodsBrand){
        return request({
            url: `/goods/brand/updBrand`,
            method: 'POST',
            data: goodsBrand,
            async: true
        })
    },
    saveBrand(g){
        return request({
            url: `/goods/brand/addBrand`,
            method: 'POST',
            data: g,
            async: true
        })
    }

}
