<template>
  <div class="app-container">
    <el-form>
      <el-form-item label="名称:" :label-width="'50px'">
        <el-input v-model="search" style="width:150px" size="small" autocomplete="off" />&nbsp;&nbsp;
        <el-button size="small" type="primary" @click="getPowerByRoleName()">查询</el-button>
        <el-button v-if="hasButton('role:add')" size="small" type="primary" @click="addRole">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" prop="roleId" label="角色id" width="330" />
      <el-table-column align="center" prop="roleName" label="角色名称" width="430" />
      <el-table-column align="center" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editRole(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="getRoleByid(scope.row)">查询权限</el-button>
          <el-button type="text" size="small" @click="editRoleByid(scope.row)">编辑权限</el-button>
          <el-button type="text" size="small" @click="deleteRoleByid(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="pageCount>0"
      :total="pageCount"
      :page.sync="pageNumber"
      :limit.sync="pageSize"
      @pagination="getPowerByRoleName()"
    />
    <!-- 角色名称修改 -->
    <el-dialog width="550px" :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="form.roleName" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色权限查询 -->
    <el-dialog width="400px" :title="roleTitle" :visible.sync="roleDialogFormVisible">
      <el-tree
        ref="tree1"
        :data="data2"
        :props="defaultProps"
        node-key="menueId"
        :filter-node-method="filterNode"
        :default-expanded-keys="[0]"
        class="filter-tree"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 角色权限修改 -->
    <el-dialog width="400px" :title="roleTitle" :visible.sync="editRoleDialogFormVisible">
      <el-tree
        ref="tree2"
        show-checkbox
        :data="data3"
        :props="defaultProps"
        node-key="menueId"
        :filter-node-method="filterNode"
        :default-expanded-keys="[0]"
        :default-checked-keys="roleIds"
        class="filter-tree"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getRole, getPowerByRoleName, updataRoleNameByid, addRole, deleteRoleByid, getRolesByid, updataRolesByid } from '@/api/role'
import { getPower } from '@/api/power'
import { hasPermission } from '../../utils'
import Pagination from '../../components/Pagination'
export default {
  name: 'ComplexTable',
  components: { Pagination },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      form: {},
      roleDialogFormVisible: false,
      editRoleDialogFormVisible: false,
      roleTitle: '',
      search: '',
      title: '',
      roleIds: [],
      menueId: 0,
      menuePid: 0,
      pageSize: 10,
      pageNumber: 1,
      pageCount: 0,
      editRoleId: 0,
      formLabelWidth: '120px',
      dialogFormVisible: false,
      filterText: '',
      tableData: [],
      data2: [{
        menueId: 0,
        menueName: '角色权限',
        children: []
      }],
      data3: [{
        menueId: 0,
        menueName: '角色权限',
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'menueName'
      }
    }
  },
  created() {
    this.getRoleByRoleName()
  },
  methods: {
    // 判断有没有按钮权限
    hasButton(a) {
      return hasPermission(a)
    },
    async saveRole() {
      const data = {
        roleId: this.editRoleId,
        menueId: this.$refs.tree2.getCheckedKeys().join(',')
      }
      const res = await updataRolesByid(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '修改成功'
        })
        this.editRoleDialogFormVisible = false
        this.getRoleByRoleName()
      }
      console.log(this.$refs.tree2.getCheckedKeys().join(','))
    },
    editRoleByid(roleId) {
      this.data2[0].children = []
      this.roleTitle = '角色权限编辑'
      this.editRoleDialogFormVisible = true
      this.editRoleId = roleId.roleId
      this.getRoleByRoleid(roleId.roleId)
    },
    getRoleByid(roleId) {
      this.data2[0].children = []
      this.roleTitle = '角色权限查询'
      this.roleDialogFormVisible = true
      this.getRoleByRoleid(roleId.roleId)
    },
    async getRoleByRoleid(id) {
      const data = {
        roleId: id
      }
      const res = await getRolesByid(data)
      if (res.message === '成功') {
        if (this.roleTitle === '角色权限编辑') {
          const result = await getPower()
          if (result.message === '成功') {
            this.data3[0].children = result.content.menue
          }
          var roleIds = []
          roleIds = res.roleId.split(',')
          this.$nextTick(() => {
            this.roleIds = [...roleIds.map(Number)]
          })
        } else {
          this.data2[0].children = res.content
        }
      }
    },
    addRole() {
      this.title = '新增角色'
      this.form = {}
      this.dialogFormVisible = true
    },
    async addRoles() {
      var data = {
        roleName: this.form.roleName
      }
      const res = await addRole(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '新增成功'
        })
        this.dialogFormVisible = false
        this.getRoleByRoleName()
      }
    },
    editRole(a) {
      this.title = '编辑角色'
      this.roleId = a.roleId
      this.form = a
      this.dialogFormVisible = true
    },
    sure() {
      if (this.title === '编辑角色') {
        this.updateRoleName()
      } else {
        this.addRoles()
      }
    },
    async  updateRoleName() {
      const data = {
        roleId: this.form.roleId,
        roleName: this.form.roleName
      }
      const res = await updataRoleNameByid(data)
      this.dialogFormVisible = false
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '更新成功'
        })
        this.getRoleByRoleName()
      }
    },
    async getRole() {
      const data = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      }
      const res = await getRole(data)
      if (res.message === '成功') {
        this.tableData = res.content
        this.pageNumber = Number(res.page.pageNumber)
        this.pageCount = Number(res.page.pageCount)
      }
    },
    async getRoleByRoleName() {
      const data = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        roleName: this.search
      }
      const res = await getPowerByRoleName(data)
      if (res.message === '成功') {
        this.tableData = res.content
        this.pageNumber = res.page.pageNumber
        this.pageCount = res.page.pageCount
      }
    },
    async  deleteRoleByid(roleId) {
      await this.$confirm('删除后不可恢复是否删除？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      })
      const data = {
        roleId: roleId.roleId
      }
      const res = await deleteRoleByid(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '删除成功'
        })
        this.getRoleByRoleName()
      }
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

