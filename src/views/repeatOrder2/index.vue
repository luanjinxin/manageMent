<template>
  <div class="wrap">
    <el-card class="box-card">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="平台">
          <el-select v-model="search.type" filterable placeholder="请选择平台">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="search.keyword" />
        </el-form-item>
        <!-- <el-form-item>
          <el-date-picker
            v-model="value2"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="sure(0)">确认导入重复订单</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sure(1)">取消导入重复订单</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getOrderList">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="h20" />
    <el-card class="box-card">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column align="center" width="80px" prop="OtherStr" label="平台" />
        <el-table-column align="center" prop="OrderNo" width="180px" label="订单号" />
        <el-table-column align="center" prop="BuyUserName" label="会员名" />
        <el-table-column align="center" prop="ProductName" label="商品名称" />
        <el-table-column align="center" width="80px" prop="Count" label="购买数量" />
        <el-table-column align="center" width="80px" prop="RealPrice" label="实际付款" />
        <el-table-column align="center" width="90px" prop="ReceiveName" label="收件人姓名" />
        <el-table-column align="center" prop="ReceivePhone" label="收件人电话" />
        <el-table-column align="center" show-overflow-tooltip prop="ReceiveAddress" label="收件人地址" />
        <el-table-column align="center" prop="CreateTime" label="创建时间" />
        <!-- <el-table-column align="center" prop="PayTime" label="支付时间" /> -->
      </el-table>
      <pagination
        v-show="pageCount > 0"
        :total="pageCount"
        :page.sync="pageNumber"
        :limit.sync="pageSize"
        @pagination="getOrderList"
      />
    </el-card>
  </div>
</template>
<script>
import Pagination from '../../components/Pagination'
import moment from 'moment'
import { getGoodsList, OrderRepeatList, ConfirmOrderRepeat } from '@/api/goods2'
export default {
  components: { Pagination },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      value2: [],
      data: {
        type: 7
      },
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      pageSize: 10,
      pageNumber: 1,
      pageCount: 1,
      options: [
        {
          value: 1,
          label: '天猫'
        },
        {
          value: 11,
          label: '天猫UCS'
        },
        {
          value: 12,
          label: '天猫AVA'
        },
        {
          value: 2,
          label: '京东'
        },
        {
          value: 3,
          label: '苏宁'
        },
        {
          value: 4,
          label: '斑马'
        },
        {
          value: 5,
          label: 'ICBC'
        },
        {
          value: 6,
          label: '拼多多'
        },
        {
          value: 7,
          label: '小红书'
        },
        {
          value: 8,
          label: '考拉'
        },
        {
          value: 9,
          label: '蜜芽'
        },
        {
          value: 10,
          label: '寺库'
        },
        {
          value: 13,
          label: '贝贝网'
        }
      ],
      option: [],
      search: { keyword: '', type: 7 },
      tableData: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    sure(type) {
      this.$confirm('此操作不可逆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          var data = {
            type: this.search.type,
            methodsType: type,
            isAll: 1
          }
          const res = await ConfirmOrderRepeat(data)
          if (res.Code === 200) {
            this.$message({
              type: 'info',
              message: '操作成功'
            })
            this.getOrderList()
          }
          // this.$message({
          //   type: 'success',
          //   message: '操作成功!'
          // });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    async getSelectList() {
      var data = {
        pageIndex: 1,
        pageSize: 200,
        IsMultiple: 0
      }
      const res = await getGoodsList(data)
      if (res.Code === 200) {
        this.option = res.Data
      }
    },
    FormatToDate(val) {
      if (val != null) {
        var date = new Date(
          parseInt(val.replace('/Date(', '').replace(')/', ''), 10)
        )
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      }
      return ''
    },
    async getOrderList() {
      var self = this
      var data = this.search
      if (this.value2.length > 0) {
        data.sDate = `${moment(this.value2[0]).format('YYYY-MM-DD') +
          ' 00:00:00'}`
        data.eDate = `${moment(this.value2[1]).format('YYYY-MM-DD') +
          ' 23:59:59'}`
      }
      data.pageIndex = this.pageNumber
      data.pageSize = this.pageSize
      // data.IsMultiple = -1;
      const res = await OrderRepeatList(data)
      if (res.Code === 200) {
        res.Data.map(item => {
          item.PayTime = self.FormatToDate(item.PayTime)
          item.CreateTime = self.FormatToDate(item.CreateTime)
          item.RealPrice = item.RealPrice.toFixed(2)
        })
        this.tableData = res.Data
        this.pageCount = res.Count
      }
    }
  }
}
</script>
<style scoped>
.wrap {
  width: 100%;
  padding: 20px;
}
.h20 {
  width: 100%;
  height: 20px;
}
</style>
