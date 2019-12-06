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
          <el-select
            v-model="search.productID"
            filterable
            placeholder="请选择商品"
          >
            <el-option
              v-for="item in option"
              :key="item.ProductID"
              :label="item.TM_Sku"
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
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialogFormVisible = true"
            >导出</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-upload
            class="upload-demo"
            action="http://excel.vitarealm.cn/Upload/UploadResource"
            :data="data"
            :headers="headers"
            multiple
            :limit="1"
            :on-success="success"
            :on-error="error"
          >
            <el-button size="medium" type="primary">天猫</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="h20" />
    <el-card class="box-card">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column align="center" prop="OrderType" label="平台" />
        <el-table-column
          align="center"
          prop="OrderNo"
          width="100px"
          label="订单号"
        />
        <el-table-column
          align="center"
          prop="OrderGood.ProductName"
          label="商品名称"
        />
        <el-table-column
          align="center"
          prop="OrderGood.Count"
          label="购买数量"
        />
        <el-table-column
          align="center"
          prop="OrderGood.TotalPrice "
          label="实际付款"
        />
        <el-table-column align="center" prop="ReceiveName" label="收件人姓名" />
        <el-table-column
          align="center"
          prop="ReceivePhone"
          label="收件人电话"
        />
        <el-table-column
          align="center"
          prop="ReceiveAddress"
          label="收件人地址"
        />
        <el-table-column align="center" prop="CreateTime " label="创建时间" />
        <el-table-column align="center" prop="PayTime " label="支付时间" />
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
import Pagination from "../../components/Pagination";
import { getToken } from "@/utils/auth";
import moment from "moment";
import { getGoodsList, getOrderList, ImportData } from "@/api/goods";
export default {
  components: { Pagination },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
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
        sort: "+id"
      },
      pageSize: 10,
      pageNumber: 1,
      pageCount: 1,
      options: [
        {
          value: 1,
          label: "天猫"
        }
      ],
      option: [],
      search: { keyword: "" },
      tableData: []
    };
  },
  created() {
    this.getOrderList();
    this.getSelectList();
  },
  methods: {
    success(response, file, fileList) {
      this.$message({
        type: "info",
        message: "上传成功"
      });
      this.ImportData(response.link);
      console.log(JSON.stringify(response));
    },
    async ImportData(url) {
      const data = {
        type: this.data.type,
        path: url
      };
      const res = await ImportData(data);
      if (res.Code === 200) {
        this.$message({
          type: "info",
          message: "数据导入成功"
        });
        this.getOrderList();
      }
    },
    error() {
      this.$message({
        type: "info",
        message: "上传失败"
      });
    },
    async getSelectList() {
      var data = {
        pageIndex: 1,
        pageSize: 200,
        IsMultiple: 0
      };
      const res = await getGoodsList(data);
      if (res.Code === 200) {
        this.option = res.Data;
      }
    },
    async getOrderList() {
      var data = this.search;
      if (this.value2.length > 0) {
        data.sDate = `${moment(this.value2[0]).format("YYYY-MM-DD") +
          " 00:00:00"}`;
        data.eDate = `${moment(this.value2[1]).format("YYYY-MM-DD") +
          " 23:59:59"}`;
      }
      data.pageIndex = this.pageNumber;
      data.pageSize = this.pageSize;
      data.IsMultiple = -1;
      const res = await getOrderList(data);
      if (res.Code === 200) {
        this.tableData = res.Data;
        this.pageCount = res.Count;
      }
    }
  }
};
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
