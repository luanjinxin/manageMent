<template>
  <div class="app-container">
    <div class="left">
      <p class="title">权限列表</p>
      <div class="list">
        <el-tree
          ref="tree2"
          :data="data2"
          :props="defaultProps"
          node-key="menueId"
          :filter-node-method="filterNode"
          :default-expanded-keys="[0]"
          class="filter-tree"
          @node-click="getMenue"
        />
      </div>
    </div>
    <div class="right">
      <el-form>
        <el-form-item label="名称:" :label-width="'50px'">
          <el-input v-model="search" style="width:150px" size="small" autocomplete="off" />&nbsp;&nbsp;
          <el-button
            v-if="hasButton('power:select')"
            size="small"
            type="primary"
            @click="getPowerByPid(menuePid)"
          >查询</el-button>
          <el-button v-if="hasButton('power:add')" size="small" type="primary" @click="addPower">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column align="center" prop="menueId" label="权限id" width="130" />
        <el-table-column align="center" prop="menueName" label="名称" width="130" />
        <el-table-column align="center" prop="menueType" label="类型" width="130" />
        <el-table-column align="center" prop="ico_view" label="图标" width="130" />
        <el-table-column align="center" prop="menueAction" label="按钮名称" width="130" />
        <el-table-column align="center" prop="menuePath" label="路由地址" width="130" />
        <el-table-column align="center" prop="menueUrl" label="path" />
        <el-table-column align="center" fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              v-if="hasButton('power:edit')"
              type="text"
              size="small"
              @click="editPower(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="hasButton('power:del')"
              type="text"
              size="small"
              @click="deleteMenue(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="pageCount>0"
        :total="pageCount"
        :page.sync="pageNumber"
        :limit.sync="pageSize"
        @pagination="getPowerByPid(menuePid)"
      />
    </div>
    <el-dialog width="550px" :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.menueName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-radio v-model="form.menueType" label="0">菜单</el-radio>
          <el-radio v-model="form.menueType" label="1">按钮</el-radio>
        </el-form-item>
        <el-form-item label="图标" :label-width="formLabelWidth">
          <el-input v-model="form.ico_view" autocomplete="off" />
        </el-form-item>
        <el-form-item label="按钮名称" :label-width="formLabelWidth">
          <el-input v-model="form.menueAction" autocomplete="off" />
        </el-form-item>
        <el-form-item label="路由地址" :label-width="formLabelWidth">
          <el-input v-model="form.menuePath" autocomplete="off" />
        </el-form-item>
        <el-form-item label="path" :label-width="formLabelWidth">
          <el-input v-model="form.menueUrl" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getPower, getPowerByPid, getPowerByid, updataPowerByid, addPower, deletePowerByid } from '@/api/power'
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
      form: {},
      menueType: {
        '0': '菜单',
        '1': '按钮'
      },
      search: '',
      title: '',
      menueId: 0,
      menuePid: 0,
      pageSize: 10,
      pageNumber: 1,
      pageCount: 0,
      formLabelWidth: '120px',
      dialogFormVisible: false,
      filterText: '',
      tableData: [],
      data2: [{
        menueId: 0,
        menueName: '权限结构',
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'menueName'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.getPower()
    this.getPowerByPid(0)
  },
  methods: {
    hasButton(a) {
      return hasPermission(a)
    },
    addPower() {
      this.title = '新增权限'
      this.dialogFormVisible = true
    },
    async  addPowerRole() {
      const data = {
        menuePid: this.menuePid
      }
      const res = await addPower(Object.assign(data, this.form))
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '新增成功'
        })
        this.dialogFormVisible = false
        this.getPowerByPid(this.menuePid)
        this.getPower()
      }
    },
    editPower(a) {
      this.title = '编辑权限'
      this.menueId = a.menueId
      this.getPowerByid(a.menueId)
      this.dialogFormVisible = true
    },
    getMenue(data) {
      this.menuePid = data.menueId
      this.getPowerByPid(data.menueId)
    },
    getPower() {
      getPower().then(res => {
        this.data2[0].children = res.content.menue
      })
    },
    async  getPowerByPid(pid) {
      const data = {
        pid: pid,
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        menueName: this.search
      }
      const res = await getPowerByPid(data)
      if (res.message === '成功') {
        this.tableData = res.content
        this.pageNumber = res.page.pageNumber
        this.pageCount = res.page.pageCount
      }
    },
    async getPowerByid(id) {
      const data = {
        id: id
      }
      const res = await getPowerByid(data)
      if (res.message === '成功') {
        this.form = res.content[0]
      }
    },
    sure() {
      if (this.title === '编辑权限') {
        this.updataPowerByid()
      } else {
        this.addPowerRole()
      }
    },
    async  updataPowerByid() {
      const data = {
        id: this.menueId
      }
      const res = await updataPowerByid(Object.assign(data, this.form))
      if (res.message === '成功') {
        this.dialogFormVisible = false
        this.$message({
          type: 'info',
          message: '更新成功'
        })
        this.getPowerByPid(this.menuePid)
      }
    },
    async  deleteMenue(menueId) {
      // await this.$confirm('删除后不可恢复是否删除？', '确认信息', {
      //   distinguishCancelAndClose: true,
      //   confirmButtonText: '删除',
      //   cancelButtonText: '取消'
      // })
      var data = {
        menueId: menueId.menueId
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deletePowerByid(data)
        if (res.message === '成功') {
          this.$message({
            type: 'info',
            message: '删除成功'
          })
          this.getPowerByPid(this.menuePid)
          this.getPower()
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
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

