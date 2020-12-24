<template>
  <div class="app-container">

    <!-- 操作部分 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable placeholder="按名称搜索" style="width: 200px;float:left;margin-right:5px;" class="filter-item" />
      
      <el-select v-model="listQuery.brandId" filterable clearable placeholder="请选择品牌">
        <el-option label="所有品牌" value="0"></el-option>
        <el-option
          v-for="item in brandList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      
      <el-select v-model="listQuery.typeId" filterable clearable placeholder="请选择类型">
        <el-option label="所有类型" value="0"></el-option>
        <el-option
          v-for="item in typeList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

      <el-button type="primary" icon="el-icon-search" @click="getGoodsList">查询</el-button>

      <el-button type="primary" icon="el-icon-circle-plus-outline" style="float:right" @click="addGoods">添加品牌</el-button>
    </div>

    <!-- 主题表格 -->
    <el-table @row-click="clickTable" ref="table" v-loading="listLoading" :data="goodsData.records" fit highlight-current-row style="width: 100%;" height="calc(100vh - 210px)">
  
      <el-table-column type="index" label=" " align="center" width="80">
         
      </el-table-column>

      <el-table-column
        prop="avatar"
        label="商品图片"
        width="150">
        <template slot-scope="scope">
          <img style="border-radius:20px" :src="scope.row.avartal" width="40" height="40"/>
        </template>
      </el-table-column>

      <el-table-column
        prop="name"
        label="商品名称"
        width="200">
      </el-table-column>

      <el-table-column
        label="单价"
        width="150">
        <template slot-scope="scope">
            ￥{{scope.row.price}}
        </template>
      </el-table-column>

      <el-table-column
        label="规格"
        width="150">
        <template slot-scope="scope">
            {{scope.row.spec}}{{scope.row.specUnit}} / {{scope.row.unit}}
        </template>
      </el-table-column>

      <el-table-column
        label="保质期"
        >
        <template slot-scope="scope">
            {{scope.row.qualityDate}} / {{scope.row.qualityUnit}}
        </template>
      </el-table-column>

      <el-table-column
        prop="status"
        label="状态"
        width="150"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          
          <el-tag
            :type="scope.row.status == '0' ? 'primary' : 'success'"
            disable-transitions>{{ scope.row.status == '0' ? '已上架' : '已下架' }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column
        fixed="right"
        label="操作"
        width="180"
        align="center"
        >
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click.native.stop="updateGoods(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click.native.stop="confirmDel(scope.row)">删除 </el-button>
        </template>
      </el-table-column>

      <el-table-column type="expand" width=1>
          
        <template slot-scope="props">
          <el-form label-position="left" block>
              <el-form-item label="商品名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="所属品牌">
                <span>{{ props.row.goodsBrand.name }}</span>
              </el-form-item>
              <el-form-item label="所属类型">
                <span>{{ props.row.goodsType.name }}</span>
              </el-form-item>
              <el-form-item label="产品介绍">
                <span>{{ props.row.message }}</span>
              </el-form-item>
          </el-form>
        </template>
      
      </el-table-column>

    </el-table>
    
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total= goodsData.total
      :current-page= goodsData.current
      style="float:left;margin-top:10px"
      @current-change="handleCurrentChange"
      >
    </el-pagination>

    <!-- 增加修改框 -->
    <el-dialog
      title="商品管理"
      :visible.sync="dialogVisible" label-width="80px"
      width="30%"
      style="padding-bottom:20px;"
      >
      

      <el-form :model="currentGoods" :rules="rules" ref="currentBrandForm" label-width="80px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="currentGoods.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>


        <el-form-item label="商品图片">  
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
              :style="{backgroundImage:'url('+ currentGoods.avartal +')'}" 
              style="position:absolution;outline:none;width:80px;height:80px;background-size:cover;">
            </el-button>
            
          </el-upload>
        </el-form-item>


        <el-form-item label="商品单价" prop="price">
          <el-input
            style="width:100px;"
            placeholder="0.0"
            v-model="currentGoods.price">
            <i slot="prefix">￥</i>
          </el-input>
        </el-form-item>

        <el-row>
          <el-col :span="8" style="margin-right:-75px">
            <el-form-item label="产品规格">
              <el-input v-model="currentGoods.spec" placeholder="容量"></el-input> 
            </el-form-item>
          </el-col>

          <el-col :span="11" style="margin-right:-75px">
            <el-form-item>
            <el-select v-model="currentGoods.specUnit" placeholder='容量单位' filterable>
              <el-option
                v-for="item in capacityList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

          <el-col :span="11">
            <el-form-item>
            <el-select v-model="currentGoods.unit" placeholder='包装单位' filterable>
              <el-option
                v-for="item in specsList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

        

        <el-row>
          <el-col :span="10" style="margin-right:-75px">
            <el-form-item label="保质期" prop="qualityDate">
              <el-input v-model="currentGoods.qualityDate" placeholder="0"></el-input> 
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item >
              <el-select style="width:150px;display:inline-block" v-model="currentGoods.qualityUnit" placeholder='请选择日期单位' filterable>
                <el-option
                  v-for="item in dateList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>


        <el-form-item label="商品状态">
            <el-radio v-model="currentGoods.status" label='0'>上架</el-radio>
            <el-radio v-model="currentGoods.status" label='1'>下架</el-radio>
        </el-form-item>

        <el-form-item label="选择品牌" prop="brandId">
          <el-select v-model="currentGoods.brandId" filterable placeholder="请选择品牌">
            <el-option
              v-for="item in brandList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择类型">
          <el-select v-model="currentGoods.typeId" filterable placeholder="请选择类型">
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>



        <el-form-item label="商品介绍">
          <el-input 
              type="textarea" 
              v-model="currentGoods.message" 
          >
          </el-input>
        </el-form-item>

        

        <el-form-item>
          <el-button type="primary" @click="conFirmUpdateGoods">确定</el-button>
          <el-button @click="cancleDalog">取消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

  </div>
</template>

<style>
  
   ::-webkit-scrollbar {
     width: 0 !important;
   }
   ::-webkit-scrollbar {
     width: 0 !important;height: 0;
   }

</style>


<script>

import goods from '@/api/goods/goods.js'
import brands from '@/api/goods/brand.js'

import types from '@/api/goods/type.js'

export default {
  created(){
    this.uploadFileUrl = process.env.BASE_API + '/files/fileOperate/fileUpload'
    this.getGoodsList()
    
    brands.brandList()
      .then(response => {
        //数据列表
        this.brandList = response.data.data.brandList
      }) 
    types.typeList()
      .then(response =>{
        this.typeList = response.data.data.typeList
      })
    goods.selUnit('r')
      .then(response => {
        this.capacityList = response.data.data.data
        console.log(this.capacityList)
      })
    goods.selUnit('g')
      .then(response => {
        this.specsList = response.data.data.data
      })
    goods.selUnit('d')
      .then(response => {
        this.dateList = response.data.data.data
      })
      
    
  },

  data() {
    return {
        uploadFileUrl: null,
        fileList: [],
        currentGoods: {},
        dialogVisible : false,
        fileButtonFlag: {
            loadingFlag: false,
            disabledFlag: false
        },
        listLoading: true,

        listQuery: {
        },

        //品牌列表
        brandList: [],
        //类型列表
        typeList: [],
        //单位列表
        capacityList: [],
        specsList: [],
        dateList: [],

        //当前
        goodsData: {
            current: 1,
            size: 10
        },
        rules: {
          name: [
            { required: true, message: '请输入品牌名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          price:[
            { required: true, message: '金额不能为空',trigger:"blur"},
            { pattern: /^-?\d+\.?\d*$/, message: '金额必须为数字值',trigger:"blur"}
          ],
          qualityDate:[
            { required: true, message:'请输入保质期', trigger: 'blur'},
            { type: 'number', transform: (value) => Number(value), message: '必须为数字',trigger:"blur"}
          ],
          brandId:[
            {required: true, message:'请选择品牌', trigger: 'blur'}
          ]
        }
    }
  },

  methods: {
   handleCurrentChange(val) {
        this.brandData.current = val
        this.getGoodsList()
    },
    
    //获取产品列表
    getGoodsList(){
      this.listLoading = true
      goods.goodsList(this.listQuery.name,this.listQuery.brandId,this.listQuery.typeId,this.goodsData.current,this.goodsData.size)
        .then(response => {
          this.listLoading = false
          this.goodsData = response.data.data.data

      })
    },
    clickTable(row,index,e){
      let $table = this.$refs.table;
      this.goodsData.records.map((item) => {
          if (row.id != item.id) {
          $table.toggleRowExpansion(item, false)
          }
      })
      $table.toggleRowExpansion(row)
    },

    confirmDel(rows){
      this.$confirm('确定删除该商标?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        goods.delgoods(rows.id)
          .then(response => {
            if(response.data.success){
              
              if(this.goodsData.records.length == 1) {
                this.goodsData.current = this.goodsData.current - 1
           
              }
              this.getGoodsList()
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
    },
    
    addGoods(){
      this.currentGoods = {}
      this.dialogVisible = true
      
    },

    updateGoods(rows){
       this.currentGoods = JSON.parse(JSON.stringify(rows))
       this.dialogVisible = true
    },

    uploadSuccess(response, file, fileList){   
      this.fileButtonFlag.loadingFlag = false
      this.fileButtonFlag.disabledFlag = false   

      this.currentGoods.avartal = process.env.BASE_API + fileList[fileList.length - 1].response.data.imageUrl

    },
    beforeUpload(file){
      this.fileButtonFlag.loadingFlag = true
      this.fileButtonFlag.disabledFlag = true
    },
    cancleDalog(){
      this.dialogVisible=false
      
    },
    conFirmUpdateGoods(){

      var validateFlag = true
      this.$refs['currentBrandForm'].validate((valid) => {
        if (valid) {
          validateFlag = false
        }
      })
      
      if(validateFlag){
         return
      }

      if( typeof(this.currentGoods.id)=="undefined" ){
        goods.saveGoods(this.currentGoods)
          .then(response => {
            if(response.data.success){
              this.goodsData.current = this.goodsData.pages

              this.getGoodsList()

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
        goods.updGoods(this.currentGoods)
          .then(response => {
            if(response.data.success){
              this.getGoodsList()

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

  }
}
</script>