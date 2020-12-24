<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="按名称搜索" style="width: 200px;float:left" class="filter-item" @keyup.enter.native="getBrandList(1)" />
      <el-button type="primary" icon="el-icon-circle-plus-outline" style="float:right" @click="saveGoodsBrand">添加品牌</el-button>
    </div>

    <el-table v-loading="listLoading" :data="brandData.records" fit highlight-current-row style="width: 100%;" height="calc(100vh - 210px)">

      <el-table-column type="index" label=" " width="50">
      </el-table-column>

      <el-table-column
        prop="avatar"
        label="品牌商标"
        width="150">
        <template slot-scope="scope">
          <img style="border-radius:20px" :src="scope.row.avatar" width="40" height="40"/>
        </template>
      </el-table-column>

      <el-table-column
        prop="name"
        label="品牌名称"
        width="150">
      </el-table-column>

      <el-table-column
        prop="message"
        label="品牌说明">
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="180"
        align="center"
        >
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="updateBrand(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="confirmDel(scope.row)">删除 </el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 页面 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="brandData.total"
      :page-size="brandData.size"
      :current-page="brandData.current"
      style="float:left;margin-top:10px"
      @current-change="handleCurrentChange"
      >
    </el-pagination>


    <!-- 修改添加框 -->
    <el-dialog
      title="品牌管理"
      :visible.sync="dialogVisible" label-width="80px"
      width="30%">

      <el-form :model="currentBrand" :rules="rules" ref="currentBrandForm" label-width="80px">
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="currentBrand.name"></el-input>
        </el-form-item>
        <el-form-item label="品牌商标">
          <el-upload
            :file-list="fileList"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload"
            :action="uploadFileUrl"
            :show-file-list='false'>

            <el-button
              v-loading= "fileButtonFlag.loadingFlag"
              element-loading-text= "上传中"
              element-loading-spinner= "el-icon-loading"
              size="small"
              circle
              :style="{backgroundImage:'url('+ currentBrand.avatar +')'}"
              style="position:absolution;outline:none;width:80px;height:80px;background-size:cover;">
            </el-button>

          </el-upload>


        </el-form-item>

        <el-form-item label="品牌介绍">
          <el-input type="textarea" v-model="currentBrand.message"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="conFirmUpdateBrand">确定</el-button>
          <el-button @click="dialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

  </div>
</template>
<script>

import brand from '@/api/goods/brand.js'
export default {
  created(){
    this.uploadFileUrl = process.env.BASE_API + '/files/fileOperate/fileUpload'
    this.getBrandList()
  },

  data() {
    return {
      
      //文件上传
      uploadFileUrl: null,
      fileList: [],

      fileButtonFlag: {
        loadingFlag: false,
        disabledFlag: false
      },
      dialogVisible: false,

      // 修改或新增时当前 brand
      currentBrand: {
        avatar: "",
        isDeleted: null,
        message: null,
        name: "",
        status: ''
      },

      //商品列表
      brandData: {
        current: 1,
        size: 10
      },

      //加载圆圈
      listLoading: true,

      //按名称搜索
      listQuery: {
        name: "",
      },
      rules: {
          name: [
            { required: true, message: '请输入品牌名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ]
      }
    }
  },

  methods: {

    beforeUpload(file){
    
      this.fileButtonFlag.loadingFlag = true
      this.fileButtonFlag.disabledFlag = true

    },

    uploadSuccess(response, file, fileList){
      
      

      this.fileButtonFlag.loadingFlag = false
      this.fileButtonFlag.disabledFlag = false
      this.currentBrand.avatar = process.env.BASE_API + fileList[0].response.data.imageUrl

      //将fileList 置空
       this.fileList = []
    },


    getBrandList(searchPage){

      this.listLoading = true

      //模糊查询的时候跑第一页
      var page;
      if(typeof(searchPage)=="undefined"){
        page = this.brandData.current
      }else{
        page = 1
      }

      brand.brandList(this.listQuery.name,page,this.brandData.size)
        .then(response => {
          this.listLoading = false

          //数据列表
          this.brandData = response.data.data.brandList
      })
    },

    handleCurrentChange(val) {
        this.brandData.current = val
        this.getBrandList()
    },

    updateBrand(rows){
       this.currentBrand = JSON.parse(JSON.stringify(rows))
       this.dialogVisible = true
    },

    saveGoodsBrand(){
      this.currentBrand = {
        status: '0'
      }
      this.dialogVisible = true

    },

    conFirmUpdateBrand(){
      
      var validateFlag = true
      this.$refs['currentBrandForm'].validate((valid) => {
        if (valid) {
          validateFlag = false
        }
      })
      
      if(validateFlag){
         return
      }

      //清除搜索框
      this.listQuery = {}

      // 根据是否有 id 来判断是添加还是修改
      if( typeof(this.currentBrand.id)=="undefined" ){
        brand.saveBrand(this.currentBrand)
          .then(response => {
            if(response.data.success){
              // this.brandData.current = this.brandData.pages

              this.getBrandList()

              this.dialogVisible = false

              this.$message({
                type: 'success',
                message: '添加成功!'
              });
            }else{
              this.$message.error('添加失败');
            }
          })
      }else{
        brand.updBrand(this.currentBrand)
          .then(response => {
            if(response.data.success){
              this.getBrandList()

              this.dialogVisible = false

              this.$message({
                type: 'success',
                message: '修改成功!'
              });
            }else{
              this.$message.error('修改失败');
            }
          })
      }
    },

    confirmDel(rows){
      this.$confirm('确定删除该商标?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        brand.delBrand(rows.id)
          .then(response => {
            if(response.data.success){

              if(this.brandData.records.length == 1) {
                this.brandData.current = this.brandData.current - 1

              }
              this.getBrandList()
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }else{
              this.$message.error('删除失败');
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style scoped>

</style>
