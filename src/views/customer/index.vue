<template>
  <div class="app-container">
    <el-form ref="form" :inline="true" :model="form" class="demo-form-inline" label-width="80px">
      <el-form-item label="注册时间">
        <el-date-picker
          v-model="form.creatTime"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
        />&nbsp;&nbsp;
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="form.parentsName" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" @click="getCustomer()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" @click="handleDownload">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" prop="id" label="id" width="100" />
      <el-table-column align="center" prop="creatTime" label="注册时间" width="100" />
      <el-table-column align="center" prop="parentsName" label="姓名" width="100" />
      <el-table-column align="center" prop="idCard" label="身份证号" width="200" />
      <el-table-column align="center" prop="phone" label="电话" width="200" />
      <el-table-column align="center" prop="childrenName" label="孩子姓名" width="100" />
      <el-table-column align="center" prop="sexs" label="孩子性别" width="100" />
      <el-table-column align="center" prop="childrenAge" label="孩子年龄" width="100" />
      <el-table-column align="center" prop="newaddress" label="详细地址" />
    </el-table>
    <pagination
      v-show="pageCount>0"
      :total="pageCount"
      :page.sync="pageNumber"
      :limit.sync="pageSize"
      @pagination="getCustomer()"
    />
  </div>
</template>
<script>
import { selectCustomer } from '@/api/luck'
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
      form: {
        parentsName: '',
        phone: '',
        creatTime: ''
      },
      filename: '顾客信息列表',
      exportList: null,
      autoWidth: true,
      bookType: 'xlsx',
      tableData: [],
      options: [],
      pageSize: 10,
      pageNumber: 1,
      pageCount: 0
    }
  },
  created() {
    this.getCustomer()
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
    async getCustomer() {
      const data = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      }
      const res = await selectCustomer(Object.assign(data, this.form))
      if (res.message === '成功') {
        res.content.map(item => {
          item.newaddress = item.cprovince + item.ccity + item.carea + item.address
          item.sexs = item.childrenSex === 0 ? '男' : '女'
        })
        this.tableData = res.content
        this.pageNumber = res.page.pageNumber
        this.pageCount = res.page.pageCount
      }
    },
    // 判断有没有按钮权限
    hasButton(a) {
      return hasPermission(a)
    },
    // 导出exlce
    handleDownload() {
      const { export_json_to_excel } = require('../../utils/exportExcle')
      const tHeader = ['注册时间', '姓名', '身份证号', '电话', '孩子姓名', '孩子性别', '孩子年龄', '详细地址']
      const filterVal = ['creatTime', 'parentsName', 'idCard', 'phone', 'childrenName', 'sexs', 'childrenAge', 'newaddress']
      const list = this.tableData
      // this.exportList
      const data = this.formatJson(filterVal, list)
      export_json_to_excel({
        header: tHeader,
        data,
        filename: this.filename,
        autoWidth: this.autoWidth,
        bookType: this.bookType
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
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
