<template>
  <div class="app-container">
    <el-form ref="searchForm" :model="searchForm">
      <el-form-item label="姓名:" :label-width="'50px'">
        <el-input v-model="searchForm.user_name" style="width:150px;" autocomplete="off" />&nbsp;&nbsp;
        手机号:
        <el-input v-model="searchForm.user_mobile" style="width:150px;" autocomplete="off" />&nbsp;&nbsp;
        团单号:
        <el-input v-model="searchForm.groupid" style="width:150px;" autocomplete="off" />&nbsp;&nbsp;
        定单号:
        <el-input v-model="searchForm.suborderid" style="width:150px;" autocomplete="off" />&nbsp;&nbsp;
        <el-date-picker
          v-model="dataReslt"
          type="daterange"
          align="right"
          unlink-panels
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        />&nbsp;&nbsp;
        <el-button size="medium" type="primary" @click="getCoupon()">查询</el-button>
        <el-button size="medium" @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :cell-class-name="getCell" :data="tableData" border style="width: 100%">
      <el-table-column align="center" prop="user_name" label="用户名" width="100" />
      <el-table-column align="center" prop="user_mobile" label="手机号" width="120" />
      <el-table-column align="center" prop="suborderid" label="订单号" width="240" />
      <el-table-column align="center" prop="groupid" label="团单号" width="240" />
      <el-table-column align="center" prop="state" label="状态" />
      <el-table-column align="center" prop="coupon_id" label="优惠券id" width="120" />
      <el-table-column align="center" prop="coupon_price" label="券金额" width="110" />
      <el-table-column align="center" prop="createtime" label="订单时间" width="110" />
      <el-table-column align="center" prop="order_price" label="订单金额" width="100" />
      <el-table-column align="center" prop="pay_type" label="支付类型" width="80" />
      <el-table-column align="center" fixed="right" label="操作" width="130">
        <template>
          <el-button type="text" size="small" @click.native.prevent="collapse(1, tableData)">用户</el-button>
          <el-button type="text" size="small" @click.native.prevent="collapse(2, tableData)">订单</el-button>
          <el-button type="text" size="small" @click.native.prevent="collapse(3, tableData)">团单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="pageCount>0"
      :total="pageCount"
      :page.sync="pageNumber"
      :limit.sync="pageSize"
      @pagination="getCoupon()"
    />
    <el-dialog width="1200px" :title="title" :visible.sync="dialogFormVisible">
      <el-form label-position="left" inline class="demo-table-expand" :model="form">
        <el-form-item label="名称" :label-width="formLabelWidth" />
        <el-form-item label="类型" :label-width="formLabelWidth" />
        <el-form-item label="图标" :label-width="formLabelWidth" />
        <el-form-item label="按钮名称" :label-width="formLabelWidth" />
        <el-form-item label="路由地址" :label-width="formLabelWidth" />
        <el-form-item label="path" :label-width="formLabelWidth" />
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getOrder, getUserInfoByMobile } from '@/api/transaction'
import { hasPermission } from '../../utils'
import Pagination from '../../components/Pagination'
export default {
  name: 'ComplexTable',
  components: { Pagination },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      searchForm: { user_name: '', user_mobile: '', suborderid: '', groupid: '' },
      dataReslt: [],
      activeName: 1,
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      isGetNow: 0,
      form: {},
      search: '',
      state: { 0: '待支付', 1: '进行中(已付款)', 2: '已关闭(支付超时)', 3: '订单超时未支付关闭', 4: '用户取消退款失败', 8: '用户取消退款成功', 10: '未成团待退款', 12: '未成团退款中', 14: '未成团退款失败', 18: '未成团已退款', 20: '已成团' },
      title: '',
      pageSize: 10,
      pageNumber: 1,
      pageCount: 0,
      formLabelWidth: '120px',
      filterText: '',
      tableData: [],
      rowInfo: {},
      userInfo: {}
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.getCoupon()
  },
  methods: {
    collapse(name) {
      switch (name) {
        case 1:
          this.title = '用户信息'
          this.dialogFormVisible = true
          this.getUserInfoByMobile(this.rowInfo.user_mobile)
          break
      }
    },
    getUserInfoByMobile(name) {
      console.log(name)
      var data = {
        user_mobile: name
      }
      getUserInfoByMobile(data).then(res => {
        this.userInfo = res.content
      })
    },
    expand(row) {
      this.rowInfo = row
      console.log(this.rowInfo)
    },
    resetForm(formName) {
      this.searchForm = { user_name: '', user_mobile: '', suborderid: '', groupid: '' }
      this.dataReslt = []
    },
    cellClick(row, column, cell, event) {
      console.log(row, column, cell, event)
    },
    getCell({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 9) {
        return row.pay_type === '余额支付' ? 'red' : 'green'
      }
    },
    hasButton(a) {
      return hasPermission(a)
    },
    getCoupon(id) {
      var data = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        isGetNow: this.isGetNow,
        start: this.dataReslt[0],
        end: this.dataReslt[1]
      }
      getOrder(Object.assign(data, this.searchForm)).then(res => {
        res.content.map(item => {
          item.createtime = item.createtime.substring(0, 10)
          item.order_price = (item.order_price / 100).toFixed(2)
          item.coupon_price = (item.coupon_price / 100).toFixed(2)
          item.state = this.state[item.state]
          item.pay_type === 28 ? item.pay_type = '微信支付' : item.pay_type = '余额支付'
        })
        this.tableData = res.content
        this.pageNumber = res.page.pageNumber
        this.pageCount = res.page.pageCount
      })
    }
  }
}
</script>
<style >
.app-container {
  /* display: flex;
  flex-direction: row; */
}
.left {
  float: left;
  width: 15%;
  height: calc(100vh - 125px);
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
.red {
  color: #a94442 !important;
}
.green {
  color: green !important;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>

