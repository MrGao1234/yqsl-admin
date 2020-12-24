<template>
  <div class="app-container">

    <div class="filter-container">
      
      <el-input v-model="listQuery.name" clearable placeholder="按名称搜索" style="width: 200px;float:left;margin-right:5px;" class="filter-item" />
      
      <el-select v-model="listQuery.sex" filterable clearable placeholder="选择性别">
        <el-option label="男" value="1"></el-option>
        <el-option label="女" value="0"></el-option>
      </el-select>

      <el-select v-model="listQuery.duty" filterable clearable placeholder="选择职位">
        <el-option label="店长" value="2"></el-option>
        <el-option label="员工" value="3"></el-option>
      </el-select>
      
      <el-select v-model="listQuery.status" filterable clearable placeholder="员工状态">
        <el-option label="正常" value="0"></el-option>
        <el-option label="休假" value="1"></el-option>
        <el-option label="离职" value="2"></el-option>
      </el-select>

      <el-button type="primary" icon="el-icon-search" @click="getUserList">查询</el-button>
     
      <el-button type="primary" icon="el-icon-circle-plus-outline" style="float:right" @click="savePowerUser">添加人员</el-button>
    </div>

    <el-table @row-click="clickTable" ref="table" v-loading="listLoading" :data="userList" fit highlight-current-row style="width: 100%;" height="calc(100vh - 210px)">

      <el-table-column type="index" label=" " width="50">
      </el-table-column>

      <el-table-column
        prop="avatar"
        label="头像"
        width="150">
        <template slot-scope="scope">
          <img style="border-radius:20px" :src="scope.row.avatar" width="40" height="40"/>
        </template>
      </el-table-column>

      <el-table-column
        prop="account"
        label="账号"
        width="150">
      </el-table-column>

      <el-table-column
        prop="name"
        label="姓名"
        width="150">
      </el-table-column>

      <el-table-column
        label="年龄"
        width="150">
        <template slot-scope="scope">
          <span>{{scope.row.birthdayDate | getAge}} </span>
        </template>
      </el-table-column>


      <el-table-column
        prop="sex"
        label="性别"
        width="150"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            :color="scope.row.sex == '0' ? 'pink' : '#CAE4FF'"
            disable-transitions>{{ scope.row.sex == '0' ? '女' : '男' }}
          </el-tag>
        </template>
      </el-table-column>


      <el-table-column
        prop="duty"
        label="职位"
        width="150"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.duty == '2' ? 'warning' : 'info'"
            disable-transitions>{{ scope.row.duty == '2' ? '店长' : '员工' }}
          </el-tag>
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
            disable-transitions>{{ scope.row.status == '0' ? '正常' : '休假' }}
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
          <el-button type="warning" size="mini" @click.native.stop="updateBrand(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click.native.stop="confirmDel(scope.row)">删除 </el-button>
        </template>
      </el-table-column>

      <el-table-column type="expand" width="1">
        <template slot-scope="props">
          <el-form label-position="left" block>
              
              <el-form-item label="证件号码">
                <span>{{ props.row.idCard }}</span>
              </el-form-item>
              <el-form-item label="电话号码">
                <span>{{ props.row.telephone }}</span>
              </el-form-item>
          </el-form>
        </template>
      </el-table-column>

    </el-table>

    <!-- 页面 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="listQuery.total"
      :page-size="listQuery.pageSize"
      :current-page="listQuery.pageNumber"
      style="float:left;margin-top:10px"
      @current-change="getUserList"
      >
    </el-pagination>


    <!-- 增加修改框 -->
    <el-dialog
      title="人员管理"
      :visible.sync="dialogVisible" label-width="80px"
      :before-close="handleClose"
      width="25%"
      style="padding-bottom:20px;"
      >
      
      <el-form :model="currentUser" ref="currentUserForm" label-width="80px">
        
        <el-form-item label="人员姓名" prop="name">
          <el-input v-model="currentUser.name" placeholder="请输入姓名"></el-input>
        </el-form-item>

        <el-form-item label="人员头像">  
          <el-upload
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
              :style="{backgroundImage:'url('+ currentUser.avatar +')'}" 
              style="position:absolution;outline:none;width:80px;height:80px;background-size:cover;">
            </el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="人员性别">
          <template>
            <el-radio v-model="currentUser.sex" :label='1'>男</el-radio>
            <el-radio v-model="currentUser.sex" :label='0'>女</el-radio>
          </template>
        </el-form-item>

        <el-form-item label="出生日期">
          <div class="block">
            <el-date-picker
              v-model="currentUser.birthdayDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="人员职位">
          <template>
            <el-radio v-model="currentUser.duty" :label="2">店长</el-radio>
            <el-radio v-model="currentUser.duty" :label="3">员工</el-radio>
          </template>
        </el-form-item>
        
        <el-form-item label="电话号码">
          <el-input v-model="currentUser.telephone" placeholder="电话号码"></el-input>
        </el-form-item>

        <el-form-item label="证件号码">
          <el-input v-model="currentUser.idCard" placeholder="证件号码"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="commitForm">确定</el-button>
          <el-button @click="cancleForm">取消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>


  </div>
</template>

<script>

import user from '@/api/shop/user.js'
import DateFilters from '@/filters/DateFilters.js'

export default {
  created(){
    this.uploadFileUrl = process.env.BASE_API + '/files/fileOperate/fileUpload'
    this.getUserList()
  },

  data() {
    return {

      //按名称搜索
      listQuery: {
        name: "",
        sex: "",
        duty: "",
        status: "",
        pageSize: 10,
        pageNumber: 1,
        total: 0
      },
    
      //人员列表
      userList: [],

      //加载圆圈
      listLoading: true,

      //当前操作的user
      currentUser: {},
     
      dialogVisible: false,

      fileButtonFlag: {
            loadingFlag: false,
            disabledFlag: false
      },
      uploadFileUrl: null,
    }
  },

  methods: {
    //获取人员列表
    getUserList(){
        user.directorList(this.listQuery)
            .then(response => {
                this.userList = response.data.data.data.records
                this.listQuery.total = response.data.data.data.total
                this.listLoading = false
            })
    },

    //添加人员
    savePowerUser(){
      this.dialogVisible = true
    },

    //表格行点击事件
    clickTable(row,index,e){
      let $table = this.$refs.table;
      this.userList.map((item) => {
          if (row.id != item.id) {
          $table.toggleRowExpansion(item, false)
          }
      })
      $table.toggleRowExpansion(row)
    },


      //删除
    confirmDel(row){
      this.$confirm('确定删除该商标?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(row.id)
        user.removeStaff(row.id)
        .then(response =>{
          this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
          this.getUserList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
    
      })

    },


    //新增&&修改
    uploadSuccess(response, file, fileList){   
      this.fileButtonFlag.loadingFlag = false
      this.fileButtonFlag.disabledFlag = false 
      
      this.currentUser.avatar = process.env.BASE_API + file.response.data.imageUrl
    },

    updateBrand(row){
      console.log(row)
      this.currentUser = row
      this.dialogVisible = true
    },

    beforeUpload(file){
      this.fileButtonFlag.loadingFlag = true
      this.fileButtonFlag.disabledFlag = true
    },

    commitForm(){
      if( typeof(this.currentUser.id)=="undefined" ){
        user.addStaff(this.currentUser)
          .then(response =>{
            if(response.data.success){
              
              //添加成功，清楚currentUser,关闭对话框
              this.currentUser = {}
              this.dialogVisible = false
              this.getUserList()
                this.$message({
                      type: 'success',
                      message: '添加成功!'
                    });
            }else{
              this.$message.error('添加失败');
            }

          })
      }else{
        user.updateStaff(this.currentUser)
          .then(response =>{
            if(response.data.success){
              
              //添加成功，清楚currentUser,关闭对话框
              this.currentUser = {}
              this.dialogVisible = false
              // this.getUserList()
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

    cancleForm(){
      this.dialogVisible = false;
      this.currentUser = {}
    },

    handleClose(){
      this.currentUser = {}
      this.dialogVisible = false;
    }


  },


  

}
</script>