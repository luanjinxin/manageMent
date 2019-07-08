<template>
  <div class="components-container">
    <el-form>
      <el-form-item label="标题:" :label-width="'50px'">
        <el-input v-model="title" style="width:250px" autocomplete="off" />&nbsp;&nbsp;
        <el-select v-model="value" filterable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.classId"
            :label="item.className"
            :value="item.classId"
          />
        </el-select>&nbsp;&nbsp;
        <el-date-picker
          v-model="dataTime"
          value-format="yyyy-MM-dd-HH-mm-ss"
          type="datetime"
          placeholder="选择日期"
        />&nbsp;&nbsp;
        <el-button v-if="isAdd" type="primary" @click="addArticle">新增</el-button>
        <el-button v-else type="primary" @click="updateArticle">确认修改</el-button>
      </el-form-item>
    </el-form>
    <aside />
    <div>
      <tinymce v-model="content" :height="400" />
    </div>
    <!-- <div class="editor-content" v-html="content" /> -->
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { addArticle, getArticleByid, updateArticleByid } from '@/api/atricle'
import { getClass } from '@/api/class'
import router from '../../router'
export default {
  name: 'TinymceDemo',
  components: { Tinymce },
  data() {
    return {
      content: '',
      title: '',
      data: '',
      options: [],
      value: '',
      dataTime: '',
      isAdd: true,
      articleId: 0
    }
  },
  created() {
    this.getClass()
    if (this.$route.query.id) {
      this.getArticleByid(this.$route.query.id)
      this.isAdd = false
    } else {
      this.isAdd = true
    }
  },
  methods: {
    async getClass() {
      const res = await getClass()
      if (res.message === '成功') {
        this.options = res.content
      }
    },
    async updateArticle() {
      const data = {
        articleId: this.articleId,
        articleTitle: this.title,
        articleContent: this.content,
        articleClassId: this.value,
        articleDate: this.dataTime
      }
      const res = await updateArticleByid(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '修改成功'
        })
        this.$router.go(-1)
      }
    },
    async getArticleByid(id) {
      const data = {
        articleId: Number(id)
      }
      const res = await getArticleByid(data)
      if (res.message === '成功') {
        this.articleId = res.content[0].articleId
        this.title = res.content[0].articleTitle
        this.value = res.content[0].articleClassId
        this.dataTime = res.content[0].articleDate
        this.content = res.content[0].articleContent
        console.log(JSON.stringify(res))
      }
    },
    async addArticle() {
      if (!this.title) {
        this.$message({
          type: 'error',
          message: '标题不能为空'
        })
        return false
      }
      if (!this.content) {
        this.$message({
          type: 'error',
          message: '内容不能为空'
        })
        return false
      }
      if (!this.value) {
        this.$message({
          type: 'error',
          message: '分类不能为空'
        })
        return false
      }
      if (!this.dataTime) {
        this.$message({
          type: 'error',
          message: '时间不能为空'
        })
        return false
      }
      const data = {
        articleTitle: this.title,
        articleContent: this.content,
        articleClassId: this.value,
        articleClickNum: 0,
        articleDate: this.dataTime
      }
      const res = await addArticle(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '新增成功'
        })
        this.title = ''
        this.content = ''
        this.value = ''
        this.dataTime = ''
        router.push('/article/index')
      }
    }
  }
}
</script>

<style scoped>
.editor-content {
  margin-top: 20px;
}
.components-container {
  width: 96%;
  float: left;
  margin-left: 2%;
  margin-top: 20px;
}
</style>
