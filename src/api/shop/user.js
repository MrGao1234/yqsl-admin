import request from '@/utils/request'

export default{
    //查询空着的店长
    directorList(){
        return request({
            url: `/goods/powerUser/directorList`,
            method: 'GET',
            async: false
        })
    },
    //店铺ID和新的店长id
    updateDirector(shopId,oldUserId,newUserId){
        return request({
            url: `/goods/powerUser/updateDirector`,
            method: 'POST',
            params: {shopId,oldUserId,newUserId},
            async: false
        })
    },
    //查询店长和员工
    directorList(pageVo){
        return request({
            url: `/goods/powerUser/staffList`,
            method: 'POST',
            data: pageVo,
            async: false
        })
    },
    //删除员工
    removeStaff(id){
        return request({
            url: `/goods/powerUser/removeStaff`,
            method: 'POST',
            params: {id},
            async: false
        })
    },
    //新增员工
    addStaff(user){
        return request({
            url: `/goods/powerUser/addStaff`,
            method: 'POST',
            data: user,
            async: false
        })
    },
    //修改员工
    updateStaff(user){
        return request({
            url: `/goods/powerUser/updateStaff`,
            method: 'POST',
            data: user,
            async: false
        })
    }
   

}