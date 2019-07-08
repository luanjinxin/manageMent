<template>
  <div class="app-container">
    <el-form>
      <el-form-item>
        分类名称
        <el-input v-model="className" style="width:150px" size="small" autocomplete="off" />&nbsp;&nbsp;
        <el-button v-if="hasButton('class:add')" size="small" type="primary" @click="addClass">新增</el-button>
        <el-button v-if="showAdd" size="small" type="primary" @click="updataClassName">确认</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" prop="classId" label="id" width="280" />
      <el-table-column align="center" prop="className" label="分类名称" width="280" />
      <el-table-column align="center" prop="isShow" label="是否显示" width="280" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="hasButton('class:edit')"
            type="text"
            size="small"
            @click="updataClassByid(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="hasButton('class:hidden')"
            type="text"
            size="small"
            @click="updataClassShowByid(scope.row)"
          >{{ scope.row.isShow==='不显示' ? '显示':'隐藏' }}</el-button>
          <el-button
            v-if="hasButton('class:del')"
            type="text"
            size="small"
            @click="deleteClassByid(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getClass, addClass, updataClassByid, deleteClassByid, updataClassShowByid } from '@/api/class'
import { hasPermission } from '../../utils'
export default {
  data() {
    return {
      className: '',
      showAdd: false,
      tableData: []
    }
  },
  created() {
    this.getClass()
  },
  methods: {
    hasButton(a) {
      return hasPermission(a)
    },
    async getClass() {
      const res = await getClass()
      if (res.message === '成功') {
        res.content.map(itme => {
          itme.isShow === 0 ? itme.isShow = '不显示' : itme.isShow = '显示'
        })
        this.tableData = res.content
      }
    },
    async addClass() {
      if (!this.className) {
        this.$message({
          type: 'error',
          message: '请输入分类名称'
        })
      } else {
        const data = {
          className: this.className,
          isShow: 1
        }
        const res = await addClass(data)
        if (res.message === '成功') {
          this.$message({
            type: 'info',
            message: '新增成功'
          })
          this.className = ''
          this.getClass()
        }
      }
    },
    async deleteClassByid(row) {
      const data = {
        classId: row.classId
      }
      const res = await deleteClassByid(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '删除成功'
        })
        this.getClass()
      }
    },
    async updataClassShowByid(row) {
      const data = {
        classId: row.classId,
        isShow: row.isShow === '不显示' ? 1 : 0
      }
      console.log('1111' + row.isShow)
      const res = await updataClassShowByid(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '设置成功'
        })
        this.getClass()
      }
    },
    updataClassByid(row) {
      this.className = row.className
      this.classId = row.classId
      this.showAdd = true
    },
    async  updataClassName() {
      const data = {
        classId: this.classId,
        className: this.className
      }
      if (!this.className) {
        this.$message({
          type: 'error',
          message: '请输入分类名称'
        })
      } else {
        const res = await updataClassByid(data)
        if (res.message === '成功') {
          this.$message({
            type: 'info',
            message: '更新成功'
          })
          this.showAdd = false
          this.className = ''
          this.getClass()
        }
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

