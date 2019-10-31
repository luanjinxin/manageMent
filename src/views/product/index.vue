<template>
  <div class="app-container">
    <el-form ref="form" :inline="true" :model="form" class="demo-form-inline" label-width="80px">
      <el-form-item>
        <el-button v-if="hasButton('product:add')" size="medium" type="primary" @click="Addluck">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="hasButton('product:select')"
          size="medium"
          type="primary"
          @click="getluck()"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" prop="id" label="id" width="200" />
      <el-table-column align="center" prop="name" label="奖品名称" />
      <el-table-column align="center" prop="num" label="奖品库存" width="230" />
      <el-table-column align="center" prop="getProductNum" label="已抽走奖品" width="230" />
      <el-table-column align="center" fixed="right" label="操作" width="350">
        <template slot-scope="scope">
          <el-button
            v-if="hasButton('product:edit')"
            type="text"
            size="small"
            @click="editLuck(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="hasButton('product:del')"
            type="text"
            size="small"
            @click="deleteLuck(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="pageCount>0"
      :total="pageCount"
      :page.sync="pageNumber"
      :limit.sync="pageSize"
      @pagination="getluck()"
    />
    <el-dialog width="500px" :title="Title" :visible.sync="DialogFormVisible">
      <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品名称" prop="userName">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="商品库存">
          <el-input v-model="ruleForm.num" type="number" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addLuck(Title)">{{ Title==='新增奖品'?'立即新增':'确认更改' }}</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { selectLuckProduct, deleteLuckProduct, addLuckProduct, updateLuckProduct } from '@/api/luck'
import { hasPermission } from '../../utils'
import Pagination from '../../components/Pagination'
export default {
  name: 'ComplexTable',
  components: { Pagination },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      Title: '',
      DialogFormVisible: false,
      ruleForm: {
        name: '',
        num: '',
        id: 0
      },
      isUse: {
        0: '否',
        1: '是'
      },
      form: {
        isUse: '',
        useTime: ''
      },
      tableData: [],
      options: [],
      pageSize: 10,
      pageNumber: 1,
      pageCount: 0
    }
  },
  created() {
    this.getluck()
  },
  methods: {
    async Addluck() {
      this.Title = '新增奖品'
      this.DialogFormVisible = true
    },
    editLuck(item) {
      this.Title = '编辑奖品'
      this.DialogFormVisible = true
      this.ruleForm.id = item.id
      this.ruleForm.name = item.name
      this.ruleForm.num = item.num
    },
    async getluck() {
      const data = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      }
      const res = await selectLuckProduct(data)
      if (res.message === '成功') {
        this.tableData = res.content
        this.pageNumber = res.page.pageNumber
        this.pageCount = res.page.pageCount
      }
    },
    async deleteLuck(item) {
      await this.$confirm('删除后不可恢复是否删除？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      })
      const data = {
        id: item.id
      }
      const res = await deleteLuckProduct(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '删除成功'
        })
        this.getluck()
      }
    },
    close() {
      this.DialogFormVisible = false
      this.ruleForm.name = ''
      this.ruleForm.num = ''
    },
    async addLuck() {
      if (!this.ruleForm.name) {
        this.$message.error('请输入奖品名称')
        return
      }
      if (!this.ruleForm.num) {
        this.$message.error('请输入奖品数量')
        return
      }
      const data = {
        id: this.ruleForm.id,
        name: this.ruleForm.name,
        num: this.ruleForm.num
      }
      if (this.Title === '新增奖品') {
        const res = await addLuckProduct(data)
        if (res.message === '成功') {
          this.$message({
            type: 'info',
            message: '添加成功'
          })
          this.DialogFormVisible = false
          this.ruleForm.name = ''
          this.ruleForm.num = ''
          this.getluck()
        }
      } else {
        const res = await updateLuckProduct(data)
        if (res.message === '成功') {
          this.$message({
            type: 'info',
            message: '修改成功'
          })
          this.DialogFormVisible = false
          this.ruleForm.name = ''
          this.ruleForm.num = ''
          this.getluck()
        }
      }
    },
    // 判断有没有按钮权限
    hasButton(a) {
      return hasPermission(a)
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
