<template>
  <div class="app-container">
    <el-form ref="form" :inline="true" :model="form" class="demo-form-inline" label-width="80px">
      <el-form-item label="中奖时间">
        <el-date-picker
          v-model="form.luckTime"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
        />&nbsp;&nbsp;
      </el-form-item>
      <el-form-item label="奖品">
        <el-select v-model="form.productId" filterable placeholder="请选择">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>&nbsp;&nbsp;
      </el-form-item>
      <el-form-item label="是否发货">
        <el-radio v-model="form.isSend" label="1">是</el-radio>
        <el-radio v-model="form.isSend" label="0">否</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="hasButton('user:select')"
          size="medium"
          type="primary"
          @click="getCustomer()"
        >查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasButton('user:select')" size="medium" type="primary" @click="rest()">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="hasButton('user:select')"
          size="medium"
          type="primary"
          @click="handleDownload"
        >导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <!-- <el-table-column align="center" prop="id" label="id" width="100" /> -->
      <el-table-column align="center" prop="creatTime" label="抽奖时间" width="160" />
      <el-table-column align="center" prop="name" label="中奖人" width="100" />
      <el-table-column align="center" prop="phone" label="电话" width="180" />
      <el-table-column align="center" prop="childrenName" label="孩子姓名" width="80" />
      <el-table-column align="center" prop="age" label="孩子年龄" width="80" />
      <el-table-column align="center" prop="productName" label="奖品" width="100" />
      <el-table-column align="center" prop="address" show-overflow-tooltip label="收货地址" />
      <el-table-column align="center" prop="remarks" show-overflow-tooltip label="备注" />
      <el-table-column align="center" prop="isSends" label="是否发货" width="80" />
      <el-table-column align="center" fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            v-if="hasButton('luckInfo:send') && scope.row.isSend===0"
            type="text"
            size="small"
            @click="editIsSend(scope.row)"
          >发货</el-button>
          <el-button v-else type="text" size="small">已发货</el-button>
          <el-button
            v-if="hasButton('luckInfo:send')"
            type="text"
            size="small"
            @click="editRemarks(scope.row)"
          >备注</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="pageCount>0"
      :total="pageCount"
      :page.sync="pageNumber"
      :limit.sync="pageSize"
      @pagination="getCustomer()"
    />
    <el-dialog width="450px" :title="Title" :visible.sync="DialogFormVisible">
      <el-form label-width="100px" class="demo-ruleForm">
        <el-input v-if="Title!=='备注修改'" v-model="emailName" placeholder="请输入快递公司" type="text" />
        <el-form-item v-if="Title!=='备注修改'" />
        <el-input
          v-if="Title==='备注修改'"
          v-model="remarks"
          :autosize="{ minRows: 8, maxRows: 10}"
          type="textarea"
        />
        <el-input
          v-else
          v-model="emailNumber"
          :autosize="{ minRows: 8, maxRows: 10}"
          placeholder="请输入快递单号"
          type="textarea"
        />
        <el-form-item />
        <el-form-item />
        <el-form-item>
          <el-button type="primary" @click="close">取消修改</el-button>
          <el-button type="primary" @click="submitForm">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { selectLuckProductList, selectLuckProduct, updateLuckProductList, updateLuckIsSend, updateLuckProductListRemarks } from '@/api/luck'
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
        isSend: '',
        productId: '',
        luckTime: ''
      },
      id: 0,
      remarks: '',
      emailNumber: '',
      emailName: '',
      filename: '中奖顾客列表',
      exportList: null,
      autoWidth: true,
      fromId: '',
      bookType: 'xlsx',
      tableData: [],
      options: [],
      pageSize: 10,
      pageNumber: 1,
      pageCount: 0,
      touser: '',
      name: ''
    }
  },
  created() {
    this.getCustomer()
    this.getProduct()
  },
  methods: {
    rest() {
      this.form.isSend = ''
      this.form.productId = ''
      this.form.luckTime = ''
    },
    close() {
      this.DialogFormVisible = false
    },
    async  submitForm() {
      const data = {
        id: this.id
      }
      if (this.Title === '备注修改') {
        data.remarks = this.remarks
        const res = await updateLuckProductListRemarks(data)
        if (res.message === '成功') {
          this.DialogFormVisible = false
          this.getCustomer()
          this.$message({
            type: 'info',
            message: '操作成功'
          })
        }
      } else {
        data.emailNumber = this.emailNumber
        data.touser = this.touser
        data.name = this.name
        data.emailName = this.emailName
        data.fromId = this.fromId
        const res = await updateLuckProductList(data)
        if (res.message === '成功') {
          this.DialogFormVisible = false
          this.getCustomer()
          this.$message({
            type: 'info',
            message: '操作成功'
          })
        }
      }
    },
    editRemarks(row) {
      this.DialogFormVisible = true
      this.Title = '备注修改'
      this.id = row.lid
      this.remarks = row.remarks
    },
    async editIsSend(row) {
      var data = {
        id: row.id
      }
      const res = await updateLuckIsSend(data)
      if (res.message === '成功') {
        this.getCustomer()
        this.$message({
          type: 'info',
          message: '操作成功'
        })
      }
    },
    async getProduct() {
      const data = {
        pageSize: 100,
        pageNumber: 1
      }
      const res = await selectLuckProduct(data)
      if (res.message === '成功') {
        this.options = res.content
      }
    },
    async edit(row) {
      this.DialogFormVisible = true
      this.Title = '快递信息'
      this.id = row.lid
      this.touser = row.openid
      this.emailNumber = row.emailNumber
      this.name = row.name
      this.emailName = row.emailName
      this.fromId = row.fromId
    },
    async getCustomer() {
      const data = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      }
      const res = await selectLuckProductList(Object.assign(data, this.form))
      if (res.message === '成功') {
        res.content.map(item => {
          // item.newaddress = item.cprovice + item.ccity + item.carea + item.address
          // item.sexs = item.childrenSex === 0 ? '男' : '女'
          item.isSends = item.isSend === 0 ? '否' : '是'
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
      const tHeader = ['抽奖时间', '中奖人', '电话', '孩子姓名', '孩子年龄', '奖品', '收货地址', '备注']
      const filterVal = ['creatTime', 'name', 'phone', 'childrenName', 'age', 'productName', 'address', 'remarks']
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
