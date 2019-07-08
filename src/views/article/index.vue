<template>
  <div class="app-container">
    <el-form ref="form" :model="form">
      <el-form-item label="文章标题:" :label-width="'100px'">
        <el-input v-model="form.articleTitle" style="width:220px" autocomplete="off" />&nbsp;&nbsp; 文章分类&nbsp;&nbsp;
        <el-select v-model="form.articleClassId" filterable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.classId"
            :label="item.className"
            :value="item.classId"
          />
        </el-select>&nbsp;&nbsp;
        发布时间&nbsp;&nbsp;
        <el-date-picker
          v-model="form.articleDate"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
        />&nbsp;&nbsp;
        发布人&nbsp;&nbsp;
        <el-input v-model="form.userName" style="width:220px" autocomplete="off" />
        <el-button
          v-if="hasButton('article:select')"
          size="medium"
          type="primary"
          @click="getArticle()"
        >查询</el-button>
        <el-button
          v-if="hasButton('article:add')"
          size="medium"
          type="primary"
          @click="addArticle()"
        >新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" prop="articleId" label="文章id" width="80" />
      <el-table-column
        align="center"
        prop="articleTitle"
        :show-overflow-tooltip="true"
        label="文章标题"
        width="180"
      />
      <el-table-column
        align="center"
        prop="articleContent"
        :show-overflow-tooltip="true"
        label="文章内容"
      />
      <el-table-column align="center" prop="articleDate" label="创建时间" width="180" />
      <el-table-column align="center" prop="setArticleRecommend" label="文章推荐" width="100" />
      <el-table-column align="center" prop="setImgRecommend" label="图文推荐" width="100" />
      <el-table-column align="center" prop="isShow" label="是否显示" width="100" />
      <el-table-column align="center" prop="userName" label="作者" width="100" />
      <el-table-column align="center" fixed="right" label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            v-if="hasButton('article:edit')"
            type="text"
            size="small"
            @click="addArticle(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="hasButton('article:details')"
            type="text"
            size="small"
            @click="getDeatils(scope.row)"
          >详情</el-button>
          <el-button
            v-if="hasButton('article:setArticleRecommend')"
            type="text"
            size="small"
            @click="setArticleRecommend(scope.row)"
          >{{ scope.row.setArticleRecommend==='是'?'取消推荐':'文章推荐' }}</el-button>
          <el-button
            v-if="hasButton('article:setImgRecommend')"
            type="text"
            size="small"
            @click="setImgRecommend(scope.row)"
          >{{ scope.row.setImgRecommend==='是'?'取消推荐':'图文推荐' }}</el-button>
          <el-button
            v-if="hasButton('article:hidenArticle')"
            type="text"
            size="small"
            @click="setIsShowArticle(scope.row)"
          >{{ scope.row.isShow==='是'?'隐藏':'显示' }}</el-button>
          <el-button
            v-if="hasButton('article:del')"
            type="text"
            size="small"
            @click="deleteArticleByid(scope.row)"
          >删除</el-button>
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
    <el-dialog width="1200px" :title="Title" :visible.sync="DialogFormVisible">
      <div class="editor-content" v-html="deatilsContent" />
    </el-dialog>
  </div>
</template>
<script>
import { getArticle, deleteArticleByid, setArticleRecommend, setImgRecommend, setIsShowArticle } from '@/api/atricle'
import { getClass } from '@/api/class'
import { hasPermission } from '../../utils'
import Pagination from '../../components/Pagination'
import router from '../../router'
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
      form: {
        articleTitle: '',
        articleClassId: '',
        articleDate: '',
        userName: ''
      },
      DialogFormVisible: false,
      Title: '',
      deatilsContent: '',
      tableData: [],
      options: [],
      pageSize: 10,
      pageNumber: 1,
      pageCount: 0
    }
  },
  created() {
    this.getArticle()
    this.getClass()
  },
  methods: {
    addArticle(row) {
      if (row) {
        router.push(`/article/article?id=${row.articleId}`)
      } else {
        router.push('/article/article')
      }
    },
    getDeatils(row) {
      this.DialogFormVisible = true
      this.Title = row.articleTitle
      this.deatilsContent = row.articleContent
      console.log(row)
    },
    async deleteArticleByid(row) {
      const data = {
        articleId: row.articleId
      }
      const res = await deleteArticleByid(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '删除成功'
        })
        this.getArticle()
      }
    },
    async setArticleRecommend(row) {
      const data = {
        articleId: row.articleId,
        setArticleRecommend: row.setArticleRecommend === '是' ? 0 : 1
      }
      const res = await setArticleRecommend(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '设置成功'
        })
        this.getArticle()
      }
    },
    async setIsShowArticle(row) {
      const data = {
        articleId: row.articleId,
        isShow: row.isShow === '是' ? 1 : 0
      }
      const res = await setIsShowArticle(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '设置成功'
        })
        this.getArticle()
      }
    },
    async setImgRecommend(row) {
      const data = {
        articleId: row.articleId,
        setImgRecommend: row.setImgRecommend === '是' ? 0 : 1
      }
      const res = await setImgRecommend(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '设置成功'
        })
        this.getArticle()
      }
    },
    async getClass() {
      const res = await getClass()
      if (res.message === '成功') {
        this.options = res.content
      }
    },
    // 判断有没有按钮权限
    hasButton(a) {
      return hasPermission(a)
    },
    async getArticle() {
      const data = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      }
      const res = await getArticle(Object.assign(data, this.form))
      if (res.message === '成功') {
        res.content.map(item => {
          item.setImgRecommend === 0 ? item.setImgRecommend = '否' : item.setImgRecommend = '是'
          item.setArticleRecommend === 0 ? item.setArticleRecommend = '否' : item.setArticleRecommend = '是'
          item.isShow === 0 ? item.isShow = '是' : item.isShow = '否'
        })
        this.tableData = res.content
        this.pageNumber = res.page.pageNumber
        this.pageCount = res.page.pageCount
      }
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

