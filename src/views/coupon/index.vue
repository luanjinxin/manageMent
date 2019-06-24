<template>
  <div class="app-container">
    <el-form>
      <el-form-item label="名称:" :label-width="'50px'">
        <el-input v-model="search" style="width:150px" size="small" autocomplete="off" />&nbsp;&nbsp;
        <el-button size="small" type="primary" @click="getCoupon()">查询</el-button>
        <el-button size="small" type="primary" @click="getCoupon(1)">查询线上优惠券</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" prop="batch_name" label="优惠券名称" width="180" />
      <el-table-column align="center" prop="create_time" label="创建时间" width="120" />
      <el-table-column align="center" prop="end_time" label="结束时间" width="120" />
      <el-table-column align="center" prop="create_user" label="创建人" width="150" />
      <el-table-column show-overflow-tooltip align="center" prop="remark" label="使用规则" />
      <el-table-column align="center" prop="limit_price" label="使用金额" width="120" />
      <el-table-column align="center" prop="price" label="券金额" width="120" />
      <el-table-column align="center" prop="send_num" label="发券数量" width="120" />
      <el-table-column align="center" prop="remind_num" label="剩余数量" width="100" />
      <el-table-column align="center" prop="city" label="发放城市" width="100" />
    </el-table>
    <pagination
      v-show="pageCount>0"
      :total="pageCount"
      :page.sync="pageNumber"
      :limit.sync="pageSize"
      @pagination="getCoupon()"
    />
  </div>
</template>
<script>
import { getCoupon } from '@/api/coupon'
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
      isGetNow: 0,
      form: {},
      search: '',
      title: '',
      pageSize: 10,
      pageNumber: 1,
      pageCount: 0,
      formLabelWidth: '120px',
      dialogFormVisible: false,
      filterText: '',
      tableData: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.getCoupon()
    console.log('111111111')
  },
  methods: {
    hasButton(a) {
      return hasPermission(a)
    },
    getCoupon(id) {
      if (id === 1) {
        this.isGetNow = 1
        this.pageNumber = 1
      } else {
        this.isGetNow = 0
      }
      var data = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        menueName: this.search,
        isGetNow: this.isGetNow
      }
      getCoupon(data).then(res => {
        res.content.coupons.map(item => {
          item.create_time = item.create_time.substring(0, 10)
          item.end_time = item.end_time.substring(0, 10)
          item.limit_price = (item.limit_price / 100).toFixed(2)
          item.price = (item.price / 100).toFixed(2)
        })
        this.tableData = res.content.coupons
        this.pageNumber = res.page.pageNumber
        this.pageCount = res.page.pageCount
      })
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
</style>

