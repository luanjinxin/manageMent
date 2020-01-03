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
        <el-form-item label="会员名">
          <el-input v-model="search.keyword" />
        </el-form-item>
        <el-form-item label="商品名">
          <el-select v-model="search.productID" filterable placeholder="请选择商品">
            <el-option
              v-for="item in option"
              :key="item.ProductID"
              :label="item.InternalName"
              :value="item.ProductID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="总数量">
          <el-select v-model="search.sumCountType" filterable placeholder="请选择条件">
            <el-option v-for="item in option1" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.sumCount" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="总价钱">
          <el-select v-model="search.sumPriceType" filterable placeholder="请选择条件">
            <el-option v-for="item in option2" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.sumPrice" placeholder="请输入价钱" />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="value2"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">查询</el-button>

          <!-- <el-button type="primary" @click="creatDate">1</el-button> -->
          <el-button type="primary" @click="setCustomerList">客户订单信息生成</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div v-if="showSum" slot="header" class="clearfix">
        <span>下单次数:{{ result.sumCount }}--------订单总金额:{{ result.sumPrice }}-------购买人数{{ result.sumAppuser }}-------复购率{{ result.fugou }}%</span>
      </div>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column align="center" width="80px" prop="Type" label="平台" />
        <el-table-column align="center" prop="BuyUserName" width="180px" label="会员名" />
        <el-table-column align="center" prop="Name" label="姓名" />
        <el-table-column align="center" prop="Phone" label="电话" />
        <el-table-column align="center" width="80px" prop="SumCount" label="购买次数" />
        <el-table-column align="center" width="80px" prop="SumPrice" label="购买金额" />
        <el-table-column align="center" show-overflow-tooltip prop="ReceiveAddress" label="收件人地址" />
        <el-table-column align="center" prop="BuyLastTime" label="最后购买时间" />
        <el-table-column align="center" prop="BuyHistory" label="购买商品" />
      </el-table>
      <pagination
        v-show="pageCount > 0"
        :total="pageCount"
        :page.sync="pageNumber"
        :limit.sync="pageSize"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>
<script>
import Pagination from '../../components/Pagination'
import moment from 'moment'
import {
  getGoodsList,
  GetCustomerList,
  UpdateAppUserStatis,
  UpdateOrder,
  AddAppUser,
  GetPlatformStatis
} from '@/api/goods'
export default {
  components: { Pagination },
  data () {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      showSum: false,
      result: {},
      search: { keyword: '', type: -1 },
      option: [],
      option1: [{ id: 0, name: '>=' }, { id: 1, name: '<' }],
      option2: [{ id: 0, name: '>=' }, { id: 1, name: '<' }],
      options: [
        {
          value: -1,
          label: '全部'
        },
        {
          value: 1,
          label: '天猫'
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
        }
      ],
      type: {
        1: '天猫',
        2: '京东',
        3: '苏宁',
        4: '斑马',
        5: 'ICBC',
        6: '拼多多',
        7: '小红书',
        8: '考拉',
        9: '蜜芽',
        10: '寺库'
      },
      value2: [],
      pageNumber: 1,
      pageSize: 10,
      pageCount: 0,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      }
    }
  },
  created () {
    this.getSelectList()
    this.getList()
  },
  methods: {
    async creatDate () {
      // await UpdateOrder({})
      // await AddAppUser({})
      await UpdateAppUserStatis({})
    },
    FormatToDate (val) {
      if (val != null) {
        var date = new Date(
          parseInt(val.replace('/Date(', '').replace(')/', ''), 10)
        )
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      }
      return ''
    },
    async setCustomerList () {
      const res = await UpdateAppUserStatis({})
      console.log(res)
    },
    async getList () {
      var data = this.search
      if (this.value2.length > 0) {
        data.sDate = `${moment(this.value2[0]).format('YYYY-MM-DD') +
          ' 00:00:00'}`
        data.eDate = `${moment(this.value2[1]).format('YYYY-MM-DD') +
          ' 23:59:59'}`
      }
      data.pageIndex = this.pageNumber
      data.pageSize = this.pageSize
      const res = await GetCustomerList(data)
      if (res.Code === 200) {
        res.Data.map(item => {
          item.BuyLastTime = this.FormatToDate(item.BuyLastTime)
          item.Type = this.type[item.Type]
        })
        this.tableData = res.Data
        this.pageCount = res.Count
      }
      if (data.type !== -1) {
        this.showSum = true
        const result = await GetPlatformStatis(data)
        if (result.Code === 200) {
          result.Data.sumPrice = (result.Data.sumPrice).toFixed(2)
          result.Data.fugou = (result.Data.sumCount / result.Data.sumAppuser).toFixed(2)
          this.result = result.Data
        }
      }
    },
    async getSelectList () {
      var data = {
        pageIndex: 1,
        pageSize: 200,
        IsMultiple: 0
      }
      const res = await getGoodsList(data)
      if (res.Code === 200) {
        this.option = res.Data
      }
    }
  }
}
</script>
<style>
.wrap {
  width: 100%;
  padding: 20px;
}
</style>
