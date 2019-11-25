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
          <el-button type="primary" @click="dialogFormVisible = true;isEdit= false;form={}">添加</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="h20" />
    <el-card class="box-card">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column align="center" prop="ProductID" width="100px" label="商品id" />
        <el-table-column align="center" prop="InternalName" label="商品名称" />
        <el-table-column align="center" prop="InternalEnglishName" label="商品英文名称" />
        <el-table-column align="center" prop="Sku" label="商品公共suk" />
        <el-table-column align="center" prop="JD_Sku" label="京东sku" />
        <el-table-column align="center" prop="TM_Sku" label="天猫sku" />
        <el-table-column align="center" prop="SN_Sku" label="苏宁sku" />
        <el-table-column align="center" prop="IsMultiple" width="100px" label="是否关联" />
        <!-- <el-table-column align="center" prop="JoinProductID" label="关联商品id" /> -->
        <el-table-column align="center" prop="JoinProduct.InternalName" label="关联商品" />
        <el-table-column align="center" prop="JoinProductSum" width="100px" label="关联数量" />
        <el-table-column align="center" width="200px" label="操作">
          <template slot-scope="scope">
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
        <el-form-item label="公共sku">
          <el-input v-model="form.Sku" />
        </el-form-item>
        <el-form-item label="京东sku">
          <el-input v-model="form.JD_Sku" />
        </el-form-item>
        <el-form-item label="天猫sku">
          <el-input v-model="form.TM_Sku" />
        </el-form-item>
        <el-form-item label="苏宁sku">
          <el-input v-model="form.SN_Sku" />
        </el-form-item>
        <el-form-item label="是否关联">
          <el-switch v-model="form.IsMultiple" />
        </el-form-item>
        <el-form-item label="关联商品id">
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
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">立即创建</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '../../components/Pagination'
import { addGoods, editGoods, delGoods, getGoodsList } from '@/api/goods'
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
      dialogFormVisible: false,
      pageSize: 10,
      pageNumber: 1,
      pageCount: 1,
      isEdit: false,
      options: [],
      form: {
        InternalName: '',
        InternalEnglishName: '',
        Sku: '',
        JD_Sku: '',
        TM_Sku: '',
        SN_Sku: '',
        IsMultiple: false,
        JoinProductID: 0,
        JoinProductSum: 0
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
    async handleEdit (row) {
      this.isEdit = true
      this.form.InternalName = row.InternalName
      this.form.InternalEnglishName = row.InternalEnglishName
      this.form.Sku = row.Sku
      this.form.JD_Sku = row.JD_Sku
      this.form.TM_Sku = row.TM_Sku
      this.form.SN_Sku = row.SN_Sku
      this.form.IsMultiple = row.IsMultiple
      this.form.JoinProductID = row.JoinProductID
      this.form.JoinProductSum = row.JoinProductSum
      this.form.IsMultiple === 0 ? this.form.IsMultiple = false : this.form.IsMultiple = true
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
      this.form.IsMultiple === true ? this.form.IsMultiple = 1 : this.form.IsMultiple = 0
      const res = await editGoods(data)
      if (res.Code === 200) {
        this.dialogFormVisible = false
        this.getGoodsList()
      }
    },
    async addGoods () {
      var data = this.form
      data.Img = ''
      this.form.IsMultiple === true ? this.form.IsMultiple = 1 : this.form.IsMultiple = 0
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
        this.options.unshift({ ProductID: 0, TM_Sku: '请选择' })
      }
    },
    async getGoodsList () {
      var data = this.search
      data.pageIndex = this.pageNumber
      data.pageSize = this.pageSize
      data.IsMultiple = -1
      const res = await getGoodsList(data)
      if (res.Code === 200) {
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
