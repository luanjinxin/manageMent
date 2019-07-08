<template>
  <div class="app-container">
    <el-form ref="form" :inline="true" :model="form" class="demo-form-inline" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.userName" />
      </el-form-item>
      <el-form-item label="文章标题">
        <el-input v-model="form.articleTitle" />
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="hasButton('reply:select')"
          size="medium"
          type="primary"
          @click="getReply()"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :cell-class-name="getCell"
      row-key="replyId"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column align="center" prop="replyId" label="回复id" width="80" />
      <el-table-column
        align="center"
        prop="articleTitle"
        :show-overflow-tooltip="true"
        label="文章标题"
        width="280"
      />
      <el-table-column
        align="center"
        prop="replyContent"
        :show-overflow-tooltip="true"
        label="回复内容"
      />
      <el-table-column align="center" prop="userName" label="回复人" width="120" />
      <el-table-column align="center" prop="replyUserName" label="被回复人" width="120" />
      <el-table-column align="center" prop="creatDate" label="回复时间" width="180" />
      <el-table-column align="center" prop="isShowRpely" label="是否显示" width="100" />
      <el-table-column align="center" label="操作" width="230">
        <template slot-scope="scope">
          <el-button
            v-if="hasButton('reply:reply')"
            type="text"
            size="small"
            @click="relpy(scope.row)"
          >回复</el-button>
          <el-button
            v-if="hasButton('reply:hidden')"
            type="text"
            size="small"
            @click="setIsShowReply(scope.row)"
          >{{ scope.row.isShow===0? '隐藏' : '显示' }}</el-button>
          <el-button
            v-if="hasButton('user:blackList')"
            type="text"
            size="small"
            @click="updataUserIsBlackListByid(scope.row)"
          >{{ scope.row.isBlackList===0?'封号': '解封' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="pageCount>0"
      :total="pageCount"
      :page.sync="pageNumber"
      :limit.sync="pageSize"
      @pagination="getArticle()"
    />
    <el-dialog width="500px" :title="Title" :visible.sync="DialogFormVisible">
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item label="回复内容">
          <el-input v-model="replyContent" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button @click="sure()">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getReply, addReply, setIsShowReply } from '@/api/reply'
import { updataUserIsBlackListByid } from '@/api/user'
import Pagination from '../../components/Pagination'
import { hasPermission } from '../../utils'
export default {
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
      pageSize: 10,
      pageNumber: 1,
      pageCount: 0,
      className: '',
      replyContent: '',
      tableData: [],
      DialogFormVisible: false,
      Title: '',
      form: {
        userName: '',
        articleTitle: ''
      },
      row: {}
    }
  },
  created() {
    this.getReply()
  },
  methods: {
    getCell({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 4) {
        console.log(JSON.stringify(row.articlePid))
        return row.replyPid === 0 ? 'red' : 'bloue'
      }
    },
    hasButton(a) {
      return hasPermission(a)
    },
    async getReply() {
      const data = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      }
      const res = await getReply(Object.assign(data, this.form))
      if (res.message === '成功') {
        res.content.map(item => {
          item.replyUserName = `@作者`
          item.isShowRpely = item.isShow === 0 ? '显示' : '隐藏'
          item.children.map(a => {
            a.replyUserName = `@${a.replyUserName}`
            a.isShowRpely = a.isShow === 0 ? '显示' : '隐藏'
          })
        })
        this.tableData = res.content
        this.pageNumber = res.page.pageNumber
        this.pageCount = res.page.pageCount
      }
    },
    relpy(row) {
      this.row = row
      this.DialogFormVisible = true
    },
    async updataUserIsBlackListByid(row) {
      const data = {
        userId: row.userId,
        isBlackList: row.isBlackList === 1 ? 0 : 1
      }
      const res = await updataUserIsBlackListByid(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '操作成功'
        })
        this.getReply()
      }
    },
    async sure() {
      const data = {
        replyContent: this.replyContent,
        articleId: this.row.articleId,
        replyPid: this.row.replyPid,
        replyUserId: this.row.userId
      }
      const res = await addReply(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '回复成功'
        })
        this.DialogFormVisible = false
        this.getReply()
      }
    },
    async setIsShowReply(row) {
      const data = {
        replyId: row.replyId,
        isShow: row.isShow === 0 ? 1 : 0
      }
      const res = await setIsShowReply(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '设置成功'
        })
        this.getReply()
      }
    }
  }
}
</script>

<style>
.line {
  text-align: center;
}
.red {
  color: red !important;
}
.bloue {
  color: #409eff;
}
</style>

