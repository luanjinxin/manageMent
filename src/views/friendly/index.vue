<template>
  <div class="app-container">
    <el-form>
      <el-form-item>
        <el-button v-if="hasButton('friendly:add')" size="small" type="primary" @click="add">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" prop="friendlyId" label="友情链接id" width="280" />
      <el-table-column align="center" prop="friendlyName" label="友情链接名称" width="280" />
      <el-table-column align="center" prop="friendlyUrl" label="友情链接url" width="280" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="hasButton('friendly:edit')"
            type="text"
            size="small"
            @click="updataFriendly(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="hasButton('friendly:del')"
            type="text"
            size="small"
            @click="deleteFriendlyByid(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog width="500px" :title="Title" :visible.sync="DialogFormVisible">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="友情链接名称" prop="friendlyName">
          <el-input v-model="ruleForm.friendlyName" />
        </el-form-item>
        <el-form-item label="友情链接Url" prop="friendlyUrl">
          <el-input v-model="ruleForm.friendlyUrl" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >{{ Title==='新增友情链接'?'立即新增':'确认更改' }}</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getFriendly, addFriendly, deleteFriendlyByid, updataFriendlyByid } from '@/api/friendly'
import { hasPermission } from '../../utils'
export default {
  data() {
    return {
      className: '',
      tableData: [],
      DialogFormVisible: false,
      Title: '',
      ruleForm: {
        friendlyName: '',
        friendlyUrl: ''
      },
      rules: {
        friendlyName: [
          { required: true, message: '请输入友情链接名称', trigger: 'blur' }
        ],
        friendlyUrl: [
          { required: true, message: '请输入友情链接url', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getFriendly()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          if (this.Title === '新增友情链接') {
            this.addFriendly()
          } else {
            this.updataFriendlyByid()
          }
        }
      })
    },
    hasButton(a) {
      return hasPermission(a)
    },
    add() {
      this.Title = '新增友情链接'
      this.DialogFormVisible = true
    },
    updataFriendly(row) {
      this.Title = '编辑友情链接'
      this.DialogFormVisible = true
      this.ruleForm.friendlyName = row.friendlyName
      this.ruleForm.friendlyUrl = row.friendlyUrl
      this.ruleForm.friendlyId = row.friendlyId
    },
    async getFriendly() {
      const res = await getFriendly()
      if (res.message === '成功') {
        this.tableData = res.content
      }
    },
    async addFriendly() {
      const res = await addFriendly(this.ruleForm)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '新增成功'
        })
        this.DialogFormVisible = false
        this.getFriendly()
      }
    },
    async deleteFriendlyByid(row) {
      const data = {
        friendlyId: row.friendlyId
      }
      const res = await deleteFriendlyByid(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '删除成功'
        })
        this.getFriendly()
      }
    },
    async updataFriendlyByid() {
      const data = {
        friendlyId: this.ruleForm.friendlyId,
        friendlyName: this.ruleForm.friendlyName,
        friendlyUrl: this.ruleForm.friendlyUrl
      }
      const res = await updataFriendlyByid(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '更新成功'
        })
        this.DialogFormVisible = false
        this.getFriendly()
      }
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

