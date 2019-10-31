<template>
  <div class="app-container">
    <el-form ref="form" :inline="true" :model="form" class="demo-form-inline" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.userName" />
      </el-form-item>
      <el-form-item label="角色名">
        <el-select v-model="form.roleId" filterable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          />
        </el-select>&nbsp;&nbsp;
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="hasButton('user:select')"
          size="medium"
          type="primary"
          @click="getUser()"
        >查询</el-button>
        <el-button v-if="hasButton('user:add')" size="medium" type="primary" @click="addUser()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" prop="userId" label="用户id" width="100" />
      <el-table-column align="center" prop="userName" label="用户名" width="180" />
      <el-table-column align="center" prop="loginName" label="登录名" width="180" />
      <el-table-column align="center" prop="roleName" label="角色名" width="180" />
      <el-table-column align="center" prop="userEmail" label="邮箱" width="180" />
      <el-table-column align="center" prop="creatTime" label="创建时间" width="120" />
      <el-table-column align="center" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="hasButton('user:restPassWord')"
            type="text"
            size="small"
            @click="updataLoginPwdByid(scope.row)"
          >密码重置</el-button>
          <el-button
            v-if="hasButton('user:edit')"
            type="text"
            size="small"
            @click="updataRole(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="hasButton('user:del')"
            type="text"
            size="small"
            @click="deleteUseryid(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="pageCount>0"
      :total="pageCount"
      :page.sync="pageNumber"
      :limit.sync="pageSize"
      @pagination="getArticle()"
    />
    <el-dialog width="500px" :title="Title" :visible.sync="DialogFormVisible">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="ruleForm.userName" :disabled="Title==='新增用户'?false: true" />
        </el-form-item>
        <el-form-item label="用户邮箱">
          <el-input v-model="ruleForm.userEmail" />
        </el-form-item>
        <el-form-item label="登陆名" prop="loginName">
          <el-input v-model="ruleForm.loginName" :disabled="Title==='新增用户'?false: true" />
        </el-form-item>
        <el-form-item v-if="Title==='新增用户'" label="登陆密码" prop="loginPwd">
          <el-input v-model="ruleForm.loginPwd" />
        </el-form-item>
        <el-form-item label="角色名" prop="roleId">
          <el-select v-model="ruleForm.roleId" placeholder="请选择角色名">
            <el-option
              v-for="item in options"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >{{ Title==='新增用户'?'立即新增':'确认更改' }}</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getRole } from '@/api/role'
import { getUser, updataUserHideReplyByid, updataUserIsBlackListByid, updataLoginPwdByid, addUser, updataRoleIdByid, deleteUseryid } from '@/api/user'
import { hasPermission } from '../../utils'
import Pagination from '../../components/Pagination'
export default {
  name: 'ComplexTable',
  components: { Pagination },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      ruleForm: {
        userName: '',
        loginName: '',
        loginPwd: '',
        roleId: '',
        userEmail: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户', trigger: 'blur' }
        ],
        loginName: [
          { required: true, message: '请输入登陆名', trigger: 'blur' }
        ],
        loginPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择用户角色', trigger: 'blur' }
        ]
      },
      form: {
        userName: '',
        isBlackList: '',
        hideReply: '',
        roleId: ''
      },
      isBlackList: {
        0: '否',
        1: '是'
      },
      hideReply: {
        0: '否',
        1: '是'
      },
      DialogFormVisible: false,
      Title: '',
      deatilsContent: '',
      tableData: [],
      options: [],
      pageSize: 10,
      pageNumber: 1,
      pageCount: 0
    }
  },
  created() {
    this.getUser()
    this.getRole()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          if (this.Title === '新增用户') {
            const res = await addUser(this.ruleForm)
            if (res.message === '成功') {
              this.$message({
                type: 'info',
                message: '新增成功'
              })
              this.getUser()
              this.DialogFormVisible = false
            }
          } else {
            this.updataRoleIdByid()
          }
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    addUser() {
      this.ruleForm = {
        userName: '',
        loginName: '',
        loginPwd: '',
        roleId: '',
        userEmail: ''
      }
      this.DialogFormVisible = true
      this.Title = '新增用户'
    },
    deleteUseryid(row) {
      var data = {
        userId: row.userId
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteUseryid(data)
        if (res.message === '成功') {
          this.$message({
            type: 'info',
            message: '删除成功'
          })
          this.getUser()
        }
      })
    },
    updataRole(row) {
      this.ruleForm = {
        userName: '',
        loginName: '',
        loginPwd: '',
        roleId: '',
        userEmail: ''
      }
      this.DialogFormVisible = true
      this.Title = '编辑用户'
      this.ruleForm.userName = row.userName
      this.ruleForm.userEmail = row.userEmail
      this.ruleForm.loginName = row.loginName
      this.ruleForm.roleId = Number(row.roleId)
      this.ruleForm.userId = Number(row.userId)
    },
    async updataRoleIdByid() {
      const data = {
        roleId: this.ruleForm.roleId,
        userEmail: this.ruleForm.userEmail,
        userId: this.ruleForm.userId
      }
      const res = await updataRoleIdByid(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '更新成功'
        })
        this.DialogFormVisible = false
        this.getUser()
      }
    },
    async updataUserHideReplyByid(row) {
      const data = {
        userId: row.userId,
        hideReply: row.hideReply === '是' ? 0 : 1
      }
      const res = await updataUserHideReplyByid(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '操作成功'
        })
        this.getUser()
      }
    },
    async updataUserIsBlackListByid(row) {
      const data = {
        userId: row.userId,
        isBlackList: row.isBlackList === '是' ? 0 : 1
      }
      const res = await updataUserIsBlackListByid(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '操作成功'
        })
        this.getUser()
      }
    },
    async updataLoginPwdByid(row) {
      await this.$confirm('是否重置密码重置不可恢复？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      })
      const data = {
        userId: row.userId
      }
      const res = await updataLoginPwdByid(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '密码重置成功'
        })
        this.getUser()
      }
    },
    async getRole() {
      const data = {
        pageSize: 100,
        pageNumber: 1
      }
      const res = await getRole(data)
      if (res.message === '成功') {
        this.options = res.content
      }
    },
    // 判断有没有按钮权限
    hasButton(a) {
      return hasPermission(a)
    },
    async getUser() {
      const data = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      }
      const res = await getUser(Object.assign(data, this.form))
      if (res.message === '成功') {
        res.content.map(item => {
          item.isBlackList = this.isBlackList[item.isBlackList]
          item.hideReply = this.hideReply[item.hideReply]
        })
        this.tableData = res.content
        this.pageNumber = res.page.pageNumber
        this.pageCount = res.page.pageCount
      }
    }
  }
}
</script>
<style scoped >
.app-container {
  /* display: flex;
  flex-direction: row; */
}
.left {
  float: left;
  width: 300px;
  border: 1px #ebeef5 solid;
  border-radius: 3px;
}
.left .title {
  width: 100%;
  height: 30px;
  float: left;
  background: #304156;
  border-radius: 3px 3px 0 0;
  color: #fff;
  text-align: center;
  font-size: 14px;
  margin-top: 0;
  margin-bottom: 0;
  line-height: 30px;
}
.left .list {
  width: 100%;
  height: calc(100vh - 157px);
  overflow-y: scroll;
}
.left .list::-webkit-scrollbar {
  background-color: #ebeef5;
  width: 0px;
}
.right {
  float: left;
  width: 80%;
  margin-left: 40px;
  flex: 1;
  height: calc(100vh - 125px);
}
</style>

