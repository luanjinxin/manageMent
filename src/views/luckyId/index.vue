<template>
  <div class="app-container">
    <el-form ref="form" :inline="true" :model="form" class="demo-form-inline" label-width="80px">
      <el-form-item label="使用时间">
        <el-date-picker
          v-model="form.useTime"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
        />&nbsp;&nbsp;
      </el-form-item>
      <el-form-item label-width="130px" label="是否使用">
        <el-radio v-model="form.isUse" label="1">是</el-radio>
        <el-radio v-model="form.isUse" label="0">否</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" @click="getluck()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" @click="rest()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" prop="id" label="id" width="100" />
      <el-table-column align="center" prop="luckId" label="序列号key" />
      <el-table-column align="center" prop="isUse" label="是否使用" width="230" />
      <el-table-column align="center" prop="useTime" label="使用时间" width="200" />
      <el-table-column align="center" prop="creatTime" label="创建时间" width="320" />
    </el-table>
    <pagination
      v-show="pageCount>0"
      :total="pageCount"
      :page.sync="pageNumber"
      :limit.sync="pageSize"
      @pagination="getluck()"
    />
  </div>
</template>
<script>
import { getLuckId } from '@/api/luck'
import { hasPermission } from '../../utils'
import Pagination from '../../components/Pagination'
export default {
  name: 'ComplexTable',
  components: { Pagination },
  data () {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
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
  created () {
    this.getluck()
  },
  methods: {
    rest () {
      this.form.isUse = ''
      this.form.useTime = ''
    },
    async getluck () {
      const data = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      }
      if (this.form.isUse) {
        data.isUse = this.form.isUse
      }
      if (this.form.useTime) {
        data.useTime = this.form.useTime
      }
      const res = await getLuckId(data)
      if (res.message === '成功') {
        res.content.map(item => {
          item.isUse === 0 ? item.isUse = '未使用' : item.isUse = '已使用'
          item.useTime === '0' ? item.useTime = '———' : ''
        })
        this.tableData = res.content
        this.pageNumber = res.page.pageNumber
        this.pageCount = res.page.pageCount
      }
    },
    // 判断有没有按钮权限
    hasButton (a) {
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
