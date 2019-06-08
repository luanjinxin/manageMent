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
          class="filter-tree"
          @node-click="getMenue"
        />
      </div>
    </div>
    <div class="right">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="menueId" label="权限id" width="180" />
        <el-table-column prop="menueName" label="名称" width="180" />
        <el-table-column prop="menueType" label="类型" width="180" />
        <el-table-column prop="menuePath" label="路由地址" width="180" />
        <el-table-column prop="menueUrl" label="path" />
      </el-table>
    </div>
  </div>
</template>
<script>
import { getPower, getPowerByPid } from '@/api/power'
export default {

  data() {
    return {
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
  },
  methods: {
    getMenue(data) {
      this.getPowerByPid(data.menueId)
    },
    getPower() {
      getPower().then(res => {
        this.data2[0].children = res.content.menue
      })
    },
    getPowerByPid(pid) {
      var data = {
        pid: pid
      }
      getPowerByPid(data).then(res => {
        this.tableData = res.content
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

