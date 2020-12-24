<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="按名称搜索" style="width: 200px;float:left" class="filter-item" @keyup.enter.native="getShopList" />
      <el-button type="primary" icon="el-icon-circle-plus-outline" style="float:right" @click="saveGoodsBrand">注册店铺</el-button>
    </div>

    <el-table v-loading="listLoading" :data="shopList" fit highlight-current-row style="width: 100%;" height="calc(100vh - 210px)">

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" block>
              <el-form-item label="店长信息：">
                <span>{{ props.row.director.name }} &nbsp;&nbsp;&nbsp; {{props.row.director.account}}</span>  
              </el-form-item>

              <el-form-item label="店员信息：">
                <ul>
                  <li class="li_staff" v-for="cu in (props.row.clerkList)">
                      <span>{{ cu.name }} &nbsp;&nbsp;&nbsp; {{cu.account}}</span>
                  </li>
                </ul>
              </el-form-item>

              <el-form-item label="店铺实景：">

                 <div class="block" v-for="fit in props.row.baseImgList">
                   
                     <img :src="fit" class="image" width="100px" height="100px">
                    
                  </div>

              </el-form-item>

          </el-form>
        </template>
      </el-table-column>

      <el-table-column
        prop="name"
        label="店铺名称"
        width="200">
      </el-table-column>

      <el-table-column
        label="注册日期"
        width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.registerTime | formatDte}} </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="id"
        width="200"
        label="店铺号码">
      </el-table-column>

      <el-table-column
        prop="address"
        label="店铺地址">
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="180"
        align="center"
        >
       
        <template slot-scope="scope">

          <el-button size="mini" @click="updateDirectorButton((scope.row))">更换店长 </el-button>
          <el-button type="danger" size="mini" @click="confirmDel(scope.row)">删除 </el-button>
          
        </template>
      </el-table-column>
    
    </el-table>


    <!-- 更换店长框 -->
    <el-dialog
      
      title="更换店长"
      :visible.sync="dialogVisibleDirector" label-width="80px"
      width="30%">

      <el-form  label-width="80px">
        <el-form-item label="选择店长">
          <el-select v-model="newDirectorId" filterable clearable placeholder="请选择店长">
            <el-option
              v-for="item in directorList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updateDirector">确定</el-button>
          <el-button @click="cancleupdateDirector">取消</el-button>
        </el-form-item>

      </el-form>

    </el-dialog>


    <!-- 修改添加框 -->
    <el-dialog
      title="注册店铺"
      :before-close="closeDialog"
      :visible.sync="dialogVisible" label-width="80px"
      width="30%">

      <el-form :model="currentShop" label-width="80px">
        
        <el-form-item label="店铺名称">
          <el-input v-model="currentShop.name"></el-input>
        </el-form-item>

        <el-form-item label="注册日期">
          <div class="block">
            <el-date-picker
              v-model="currentShop.registerTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="店铺地址">
          <el-input v-model="currentShop.address"></el-input>
        </el-form-item>

        <el-form-item label="选择店长">
          <el-select v-model="currentShop.director.id" filterable clearable placeholder="请选择店长">
            <el-option
              v-for="item in directorList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上传图片">
          <el-upload
            ref="upload"
            class="upload-demo"
            :action="uploadFileUrl"
            :before-remove="beforeRemove"
            :on-remove="onRemove"
            :on-success="uploadSuccess"
            multiple
            :limit="5"
            :on-exceed="handleExceed">
            <el-button size="small" type="success">点击上传</el-button>
          </el-upload>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="conFirmUpdateGoods">确定</el-button>
          <el-button @click="VisiableDialogVisible">取消</el-button>
        </el-form-item>

      </el-form>

    </el-dialog>



  </div>

</template>

<style scoped>
  ul {
    padding-left:125px;
    margin-top:0px;
  }
  .li_staff {
    margin-left: -40px;
    list-style-type: none;
  }
  img {
    float: left;
    margin-right: 20px;
    cursor: pointer;
  }
</style>


<script>

import shop from '@/api/shop/shop.js'
import user from'@/api/shop/user.js'

import dateFilter from '@/filters/DateFilters.js'

export default {
  created(){
    this.uploadFileUrl = process.env.BASE_API + '/files/fileOperate/fileUpload'
    this.getShopList()

    this.getDirectorList()
  },

  filters: {
    // formData:function(value){
    //   return filter.formatDate(value)
    // }
  },

  data() {
    return {
      //文件上传
      uploadFileUrl: null,


      fileButtonFlag: {
        loadingFlag: false,
        disabledFlag: false
      },
      dialogVisible: false,
      dialogVisibleDirector: false,

      // 修改或新增时当前 
      currentShop: {
        name: '',
        address: '',
        registerTime: '',
        telephone: '',
        director: {
      
        },
        clerkList: [],
        baseImgList: []
      },
      
      newDirectorId: "",
      
      //店长列表
      directorList: [],

      //店铺列表
      shopList: [],

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
    
    clearUploadedImage () {
      this.$refs.upload.clearFiles();
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      var flag = this.$confirm(`确定移除 ${ file.name }？`);
      return flag;
    },
    onRemove(file, fileList){
      this.revertList(fileList)
    },
    uploadSuccess(response, file, fileList){
      this.revertList(fileList)
    },
    closeDialog(done){
      this.clearUploadedImage()
      done();

    },
    VisiableDialogVisible(){
      this.dialogVisible = false
      this.clearUploadedImage()
    },

    updateDirectorButton(row){
      
      this.dialogVisibleDirector = true
      this.currentShop = row
    },

    revertList(fileList){
      this.currentShop.baseImgList = []
      for(var i = 0;i < fileList.length;i++){
        this.currentShop.baseImgList.push(process.env.BASE_API + fileList[i].response.data.imageUrl)
      }
    },

    cancleupdateDirector(){
      this.newDirectorId = ''
      this.dialogVisibleDirector = false
    },

    updateDirector(){

      user.updateDirector(this.currentShop.id,this.currentShop.director.id,this.newDirectorId)
        .then(response => {
            this.$message({
              type: 'success',
              message: '更换店长成功!'
            });
            this.dialogVisibleDirector = false
            this.newDirectorId = ''
            this.getShopList()
            this.getDirectorList()
        })
    },

    getDirectorList(){
      user.directorList()
        .then(response =>{
            this.directorList = response.data.data.data
        })
      
    },

    getShopList(){
      this.listLoading = true

      shop.shopList(this.listQuery.name)
        .then(response => {
          this.listLoading = false
          //数据列表
          this.shopList = response.data.data.data

          
      })
    },

    saveGoodsBrand(){
      this.currentShop = {
        name: '',
        address: '',
        registerTime: '',
        telephone: '',
        director: {
      
        },
        clerkList: [],
        baseImgList: []
      } 
      this.dialogVisible = true
      
    },

    conFirmUpdateGoods(){
      
      //清除搜索框
      this.listQuery = {}

      shop.saveShop(this.currentShop)
        .then(response => {
          if(response.data.success){
            
            this.getShopList()

            this.dialogVisible = false

            this.$message({
              type: 'success',
              message: '添加成功!'
            
            });
            this.clearUploadedImage()
            this.getDirectorList()
          }else{
            this.$message.error('添加失败');
          }
        })
     
       
    },

    confirmDel(rows){
      this.$confirm('确定删除该商标?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        
        shop.delShop(rows.id,rows.director.id)
          .then(response => {
            if(response.data.success){

              
              this.getShopList()
              this.getDirectorList()

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
