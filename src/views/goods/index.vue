<template>
  <div class="wrap">
    <el-card class="box-card">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="商品名称或sku">
          <el-input v-model="search.keyword" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getGoodsList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="
              dialogFormVisible = true;
              isEdit = false;
              form = {};
            "
          >添加</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="h20" />
    <el-card class="box-card">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column align="center" prop="ProductID" width="100px" label="商品id" />
        <el-table-column
          align="center"
          width="150px"
          show-overflow-tooltip
          prop="InternalName"
          label="商品名称"
        />
        <el-table-column
          align="center"
          width="150px"
          show-overflow-tooltip
          prop="InternalEnglishName"
          label="商品英文名称"
        />
        <el-table-column align="center" prop="Price" label="价格" />
        <!-- <el-table-column align="center" prop="Sku" label="商品公共suk" /> -->
        <el-table-column align="center" width="100px" prop="JD_Sku" label="京东sku" />
        <el-table-column
          align="center"
          width="150px"
          show-overflow-tooltip
          prop="TM_Sku"
          label="天猫sku"
        />
        <el-table-column align="center" width="100px" prop="SN_Sku" label="苏宁sku" />
        <el-table-column align="center" width="100px" prop="BM_Sku" label="斑马sku" />
        <el-table-column align="center" width="100px" prop="ICBC_Sku" label="ICbCsku" />
        <el-table-column align="center" width="100px" prop="PDD_Sku" label="拼多多sku" />
        <el-table-column align="center" width="100px" prop="XHS_Sku" label="小红书sku" />
        <el-table-column align="center" width="100px" prop="KL_Sku" label="考拉sku" />
        <el-table-column align="center" width="100px" prop="MY_Sku" label="蜜芽sku" />
        <el-table-column align="center" width="100px" prop="SK_Sku" label="寺库sku" />
        <el-table-column align="center" prop="IsMultiples" width="100px" label="是否关联" />
        <!-- <el-table-column align="center" prop="JoinProductID" label="关联商品id" /> -->
        <!-- <el-table-column align="center" width="100px" prop="JoinProduct.InternalName" label="关联商品" />
        <el-table-column align="center" prop="JoinProductSum" width="100px" label="关联数量" />-->
        <el-table-column align="center" width="300px" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleAbout(scope.row)">关联</el-button>
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="pageCount > 0"
        :total="pageCount"
        :page.sync="pageNumber"
        :limit.sync="pageSize"
        @pagination="getGoodsList"
      />
    </el-card>
    <el-dialog title="商品信息" width="500px" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="商品名称">
          <el-input v-model="form.InternalName" />
        </el-form-item>
        <el-form-item label="商品英文名">
          <el-input v-model="form.InternalEnglishName" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.Price" />
        </el-form-item>
        <!-- <el-form-item label="公共sku">
          <el-input v-model="form.Sku" />
        </el-form-item>-->
        <el-form-item label="京东sku">
          <el-input v-model="form.JD_Sku" />
        </el-form-item>
        <el-form-item label="天猫sku">
          <el-input v-model="form.TM_Sku" />
        </el-form-item>
        <el-form-item label="苏宁sku">
          <el-input v-model="form.SN_Sku" />
        </el-form-item>
        <el-form-item label="斑马sku">
          <el-input v-model="form.BM_Sku" />
        </el-form-item>
        <el-form-item label="ICbCsku">
          <el-input v-model="form.ICBC_Sku" />
        </el-form-item>
        <el-form-item label="拼多多sku">
          <el-input v-model="form.PDD_Sku" />
        </el-form-item>
        <el-form-item label="小红书sku">
          <el-input v-model="form.XHS_Sku" />
        </el-form-item>
        <el-form-item label="考拉sku">
          <el-input v-model="form.KL_Sku" />
        </el-form-item>
        <el-form-item label="蜜芽sku">
          <el-input v-model="form.MY_Sku" />
        </el-form-item>
        <el-form-item label="寺库sku">
          <el-input v-model="form.SK_Sku" />
        </el-form-item>
        <!-- <el-form-item label="是否关联">
          <el-switch v-model="form.IsMultiple" />
        </el-form-item>-->
        <!-- <el-form-item label="关联商品id">
          <el-select v-model="form.JoinProductID" filterable placeholder="请选择商品">
            <el-option
              v-for="item in options"
              :key="item.ProductID"
              :label="item.TM_Sku"
              :value="item.ProductID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联商品数量">
          <el-input v-model="form.JoinProductSum" />
        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="submit">立即创建</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="titile" width="500px" :visible.sync="dialogFormVisibles">
      <el-form>
        <el-form-item label="关联商品">
          <el-select ref="select" v-model="JoinProductID" filterable placeholder="请选择商品">
            <el-option
              v-for="item in options"
              :key="item.ProductID"
              :label="item.InternalName"
              :value="item.ProductID"
            />
          </el-select>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          <el-button type="primary" @click="check()">选择</el-button>
        </el-form-item>
        <el-form-item
          v-for="(item,index) in checkList"
          :key="index"
          label-width="150px"
          :label="item.name"
        >
          <el-input v-model="item.Count" style="width:118px" />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          <el-button type="danger" @click="handleDeleteCheck(item.ProductID)">删除</el-button>
        </el-form-item>
        <el-form-item>
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          <el-button type="primary" @click="submits">确认</el-button>
          <el-button @click="dialogFormVisibles = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '../../components/Pagination'
import { addGoods, getJoinList, editGoods, delGoods, getGoodsList, JoinProduct } from '@/api/goods'
export default {
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
      JoinProductID: 0,
      dialogFormVisible: false,
      dialogFormVisibles: false,
      pageSize: 10,
      pageNumber: 1,
      pageCount: 1,
      isEdit: false,
      options: [],
      checkList: [],
      ProductID: 0,
      titile: '',
      form: {
        InternalName: '',
        InternalEnglishName: '',
        Sku: '',
        JD_Sku: '',
        TM_Sku: '',
        SN_Sku: '',
        BM_Sku: '',
        ICBC_Sku: '',
        PDD_Sku: '',
        XHS_Sku: '',
        KL_Sku: '',
        MY_Sku: '',
        SK_Sku: '',
        // IsMultiple: false,
        // JoinProductID: 0,
        // JoinProductSum: 0,
        Price: 0
      },
      search: { keyword: '' },
      tableData: []
    }
  },
  created () {
    this.getSelectList()
    this.getGoodsList()
  },
  methods: {
    submit () {
      if (this.isEdit) {
        this.editGoods()
      } else {
        this.addGoods()
      }
    },
    check () {
      var data = {
        Count: 0,
        productID: this.JoinProductID,
        name: this.$refs.select.selectedLabel
      }
      this.checkList.push(data)
    },
    handleDeleteCheck (id) {
      this.checkList.map((item, index) => {
        if (item.ProductID == id) {
          this.checkList.splice(index, 1)
        }
      })
    },
    async submits () {
      const newlist = []
      var check = JSON.parse(JSON.stringify(this.checkList))
      check.map(item => {
        var d = {
          Count: item.Count,
          productID: item.productID
        }
        newlist.push(d)
      })
      const data = {
        productList: newlist,
        productID: this.ProductID
      }
      const res = await JoinProduct(data)
      if (res.Code === 200) {
        this.$message({
          type: 'info',
          message: '关联成功'
        })
        this.dialogFormVisibles = false
        this.getGoodsList()
      }
    },
    async handleAbout (row) {
      this.checkList = []
      this.JoinProductID = 0
      this.titile = row.InternalName
      this.dialogFormVisibles = true
      this.ProductID = row.ProductID
      const data = {
        productID: row.ProductID,
        pageIndex: 1,
        pageSize: 100
      }
      const res = await getJoinList(data)
      if (res.Code === 200) {
        if (res.Data.length > 0) {
          res.Data.map(item => {
            var data = {
              Count: item.Count,
              productID: item.ProductID,
              name: item.InternalName
            }
            this.checkList.push(data)
          })
        } else {
          this.checkList = []
        }
      }
    },
    async handleEdit (row) {
      this.isEdit = true
      this.form.InternalName = row.InternalName
      this.form.InternalEnglishName = row.InternalEnglishName
      this.form.Sku = row.Sku
      this.form.JD_Sku = row.JD_Sku
      this.form.TM_Sku = row.TM_Sku
      this.form.SN_Sku = row.SN_Sku
      this.form.BM_Sku = row.BM_Sku
      this.form.ICBC_Sku = row.ICBC_Sku
      this.form.PDD_Sku = row.PDD_Sku
      this.form.XHS_Sku = row.XHS_Sku
      this.form.KL_Sku = row.KL_Sku
      this.form.MY_Sku = row.MY_Sku
      this.form.SK_Sku = row.SK_Sku
      this.form.IsMultiple = row.IsMultiple
      // this.form.JoinProductID = row.JoinProductID
      // this.form.JoinProductSum = row.JoinProductSum
      this.form.Price = row.Price
      this.form.IsMultiple === 0
        ? (this.form.IsMultiple = false)
        : (this.form.IsMultiple = true)
      this.form.ProductID = row.ProductID
      this.dialogFormVisible = true
    },
    async handleDelete (row) {
      const res = await delGoods({ ProductID: row.ProductID })
      if (res.Code === 200) {
        this.$message({
          type: 'info',
          message: '删除成功'
        })
        this.getGoodsList()
      }
    },
    async editGoods () {
      var data = this.form
      data.Img = ''
      data.IsGiving = 0
      this.form.IsMultiple === true
        ? (this.form.IsMultiple = 1)
        : (this.form.IsMultiple = 0)
      const res = await editGoods(data)
      if (res.Code === 200) {
        this.dialogFormVisible = false
        this.getGoodsList()
      }
    },
    async addGoods () {
      var data = this.form
      data.Img = ''
      data.IsGiving = 0
      this.form.IsMultiple === true
        ? (this.form.IsMultiple = 1)
        : (this.form.IsMultiple = 0)
      const res = await addGoods(data)
      if (res.Code === 200) {
        this.dialogFormVisible = false
        this.getGoodsList()
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
        this.options = res.Data
        this.options.unshift({ ProductID: 0, InternalName: '请选择' })
      }
    },
    async getGoodsList () {
      var data = this.search
      data.pageIndex = this.pageNumber
      data.pageSize = this.pageSize
      data.IsMultiple = -1
      const res = await getGoodsList(data)
      if (res.Code === 200) {
        res.Data.map(item => {
          if (item.IsMultiple == 0) {
            item.IsMultiples = '否'
          } else {
            item.IsMultiples = '是'
          }
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
