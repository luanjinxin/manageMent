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
          <el-button type="primary" @click="getOrderList">查询</el-button>
          <el-button type="primary" @click="getProduct">查询所有商品</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="exportData">导出</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="delAll">删除所有</el-button>
        </el-form-item>
        <el-form-item>
          <el-upload
            ref="upload"
            class="upload-demo"
            action="http://excel.vitarealm.cn/Upload/UploadResource"
            :data="data"
            :headers="headers"
            multiple
            :limit="1"
            :on-success="success"
            :on-error="error"
          >
            <el-button size="medium" type="primary" @click="setType(1,1)">天猫</el-button>
            <el-button size="medium" type="primary" @click="setType(2,1)">京东</el-button>
            <el-button size="medium" type="primary" @click="setType(3,1)">苏宁</el-button>
            <el-button size="medium" type="primary" @click="setType(4,0)">斑马</el-button>
            <el-button size="medium" type="primary" @click="setType(5,1)">ICBC</el-button>
            <el-button size="medium" type="primary" @click="setType(6,0)">拼多多</el-button>
            <el-button size="medium" type="primary" @click="setType(7,0,1)">小红书(前)</el-button>
            <el-button size="medium" type="primary" @click="setType(7,0,0)">小红书(后)</el-button>
            <el-button size="medium" type="primary" @click="setType(8,1)">考拉</el-button>
            <el-button size="medium" type="primary" @click="setType(9,0)">蜜芽</el-button>
            <el-button size="medium" type="primary" @click="setType(10,1)">寺库</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="h20" />
    <el-card class="box-card">
      <div v-if="showSum" slot="header" class="clearfix">
        <span>销售数量:{{ SumCount }}--------销售总金额:{{ SumPrice }}</span>
      </div>
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
        <el-table-column align="center" width="200px" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="update(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            <p></p>
          </template>
        </el-table-column>
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
    <el-dialog title="订单信息" width="500px" :visible.sync="dialogFormVisibles">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="平台">
          <el-input v-model="form.OtherStr" />
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="form.OrderNo" />
        </el-form-item>
        <el-form-item label="会员名">
          <el-input v-model="form.BuyUserName" />
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="form.ProductName" />
        </el-form-item>
        <el-form-item label="购买数量">
          <el-input v-model="form.Count" />
        </el-form-item>
        <el-form-item label="实际付款">
          <el-input v-model="form.RealPrice" />
        </el-form-item>
        <el-form-item label="收件人姓名">
          <el-input v-model="form.ReceiveName" />
        </el-form-item>
        <el-form-item label="收件人电话">
          <el-input v-model="form.ReceivePhone" />
        </el-form-item>
        <el-form-item label="收件人地址">
          <el-input v-model="form.ReceiveAddress" />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="form.CreateTime" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">立即修改</el-button>
          <el-button @click="dialogFormVisibles = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="导入结果" :visible.sync="dialogVisible" width="30%">
      <span>成功导入{{ OK }}条,失败导入{{ Fail }}条</span>
      <div v-if="ErrorList.length>0">
        <h5>错误列表</h5>
        <span v-if="showHerf" class="herf" @click="goRepeatList">点击去处理重复订单</span>
        <p v-for="(item,index) in ErrorList" :key="index">{{ item.Msg }}</p>
      </div>
      <div class="h20" />
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '../../components/Pagination'
import { getToken } from '@/utils/auth'
import moment from 'moment'
import axios from 'axios'
import {
  getGoodsList,
  getOrderList,
  ImportData,
  GetImportResult,
  DelOrder,
  GetProductStatistics,
  OrderEdit
} from '@/api/goods'
import { async } from 'q'
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
      dialogVisible: false,
      dialogFormVisibles: false,
      value2: [],
      data: {
        type: 1
      },
      headers: { Authorization: getToken() },
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
      showSum: false,
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
      option: [],
      loading: '',
      search: { keyword: '', type: -1 },
      tableData: [],
      Fail: 0,
      OK: 0,
      form: {},
      showHerf: false,
      ErrorList: [],
      dataType: 0,
      isPointPrice: 0,
      isType: 0,
      SumCount: 0,
      SumPrice: 0,
      list: []
    }
  },
  created() {
    this.getOrderList()
    this.getSelectList()
  },
  methods: {
    update(row) {
      this.dialogFormVisibles = true
      this.form = row
      console.log(JSON.stringify(row))
    },
    async getProduct() {
      var that = this
      this.list = []
      this.option.map(async item => {
        var data = this.search
        data.ProductID = item.ProductID
        const res = await GetProductStatistics(data)
        if (res.Code === 200) {
          var d = {}
          d.SumCount = res.Data.SumCount
          d.SumPrice = res.Data.SumPrice.toFixed(2)
          d.name = item.InternalName
          that.list.push(d)
        }
      })
      console.log(JSON.stringify(this.list))
    },
    async submit() {
      var data = this.form
      let res = await OrderEdit(data)
      if (res.Code === 200) {
        this.$message({
          type: 'info',
          message: '删除成功'
        })
        this.getOrderList()
      }
    },
    async delAll() {
      this.$confirm('此操作会删除条件所有订单, 谨慎操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          var check = []
          var data = { orderNo: check, isAll: 1, type: this.search.type }
          if (this.value2.length > 0) {
            data.sDate = `${moment(this.value2[0]).format('YYYY-MM-DD') +
              ' 00:00:00'}`
            data.eDate = `${moment(this.value2[1]).format('YYYY-MM-DD') +
              ' 23:59:59'}`
          }
          const res = await DelOrder(data)
          if (res.Code === 200) {
            this.$message({
              type: 'info',
              message: '删除成功'
            })
            this.getOrderList()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    async handleDelete(row) {
      this.$confirm('此操作会删除相关所有订单信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          var check = []
          check.push(row.OrderList.OrderNo)
          console.log(JSON.stringify(row))
          const res = await DelOrder({ orderNo: check, isAll: 0 })
          if (res.Code === 200) {
            this.$message({
              type: 'info',
              message: '删除成功'
            })
            this.getOrderList()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    setType(a, b, c) {
      console.log(a, b)
      this.dataType = a
      this.data.type = a
      this.isPointPrice = b
      if (a == 1 || a == 2 || a == 8) {
        this.isGiving = 1
      } else {
        this.isGiving = 0
      }
      if (c) {
        this.isType = c
      }
    },
    goRepeatList() {
      this.$router.push('/order/repeatOrder')
    },
    async exportData() {
      var data = this.search
      if (this.value2.length > 0) {
        data.sDate = `${moment(this.value2[0]).format('YYYY-MM-DD') +
          ' 00:00:00'}`
        data.eDate = `${moment(this.value2[1]).format('YYYY-MM-DD') +
          ' 23:59:59'}`
      }
      data.pageIndex = this.pageNumber
      data.pageSize = this.pageSize
      data.IsMultiple = -1
      axios({
        // 用axios发送post请求
        method: 'post',
        url: 'http://excel.vitarealm.cn/order/Export', // 请求地址
        data: data, // 参数
        responseType: 'blob', // 表明返回服务器返回的数据类型
        headers: {
          Authorization: getToken()
        }
      }).then(res => {
        // 处理返回的文件流
        var blob = new Blob([res.data], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
        })
        var contentDisposition = res.headers['content-disposition']
        var filename = '订单.xls'
        var downloadElement = document.createElement('a')
        var href = window.URL.createObjectURL(blob) // 创建下载的链接
        downloadElement.style.display = 'none'
        downloadElement.href = href
        downloadElement.download = filename // 下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() // 点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      })
    },
    success(response, file, fileList) {
      // this.$message({
      //   type: "info",
      //   message: "上传成功"
      // });
      this.ImportData(response.link)
    },
    async GetImportResult() {
      const that = this
      const res = await GetImportResult({ type: this.dataType })
      if (res.Code === 200) {
        if (res.Data !== null) {
          try {
            const result = JSON.parse(res.Data)
            if (result.Fail || result.OK) {
              this.ErrorList = result.ErrorList
              this.Fail = result.Fail
              this.OK = result.OK
              this.dialogVisible = true
            }
          } catch (error) {
            this.$message({
              showClose: true,
              message: res.Data,
              duration: 8000
            })
          }
          this.loading.close()
          this.$refs.upload.clearFiles()
          this.getOrderList()
        } else {
          setTimeout(() => {
            that.GetImportResult()
          }, 3000)
        }
      }
    },
    async ImportData(url) {
      const data = {
        type: this.dataType,
        isPointPrice: this.isPointPrice,
        path: url,
        isGiving: this.isGiving
      }
      this.showHerf = false
      if (this.dataType == 7) {
        data.isType = this.isType
        data.isRecordMultiple = 1
        this.showHerf = true
      }
      if (this.dataType == 8) {
        data.isRecordMultiple = 1
      }
      const res = ImportData(data)
      this.loading = this.$loading({
        lock: true,
        text: '订单正在导入请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout(() => {
        this.GetImportResult()
      }, 0)
    },
    error() {
      this.$message({
        type: 'info',
        message: '上传失败'
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
      data.IsMultiple = -1
      const res = await getOrderList(data)
      if (res.Code === 200) {
        res.Data.map(item => {
          item.RealPrice = item.RealPrice.toFixed(2)
          item.CreateTime = this.FormatToDate(item.CreateTime)
        })
        // if (res.Data.length > 0) {
        //   this.SumCount = res.Data[0].SumCount
        //   this.SumPrice = res.Data[0].SumPrice.toFixed(2)
        // }
        if (this.search.productID) {
          this.showSum = true
        } else {
          this.showSum = false
        }
        this.tableData = res.Data
        this.pageCount = res.Count
      }
      const result = await GetProductStatistics(data)
      if (res.Code === 200) {
        this.SumCount = result.Data.SumCount
        this.SumPrice = result.Data.SumPrice.toFixed(2)
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
.h20 {
  width: 100%;
  height: 20px;
}
.herf {
  cursor: pointer;
  color: #409eff;
}
.el-dialog__body {
  padding: 0px 20px !important;
  color: #606266;
  font-size: 14px;
}
.clearfix span {
  font-size: 13px;
  color: #606266;
}
</style>
