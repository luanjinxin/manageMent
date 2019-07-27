<template>
  <div class="app-container">
    <el-form>
      <el-form-item>
        <el-button v-if="hasButton('banner:add')" size="small" type="primary" @click="add">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" prop="bannerId" label="BannerId" width="280" />
      <el-table-column align="center" prop="friendlyName" label="缩略图" width="280">
        <template slot-scope="scope">
          <img style="width:200px;height:100px" :src="scope.row.bannerUrl" >
        </template>
      </el-table-column>
      <el-table-column align="center" prop="bannerUrl" label="BannerUrl" />
      <el-table-column align="center" width="180" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="hasButton('banner:edit')"
            type="text"
            size="small"
            @click="updataBanner(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="hasButton('banner:del')"
            type="text"
            size="small"
            @click="deleteBannerByid(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog width="500px" :title="Title" :visible.sync="DialogFormVisible">
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item>
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:1888/file_upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >{{ Title==='新增Banner图'?'立即新增':'确认更改' }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getBanner, addBanner, updataBannerByid, deleteBannerByid } from '@/api/banner'
import { hasPermission } from '../../utils'
export default {
  data() {
    return {
      className: '',
      tableData: [],
      DialogFormVisible: false,
      Title: '',
      imageUrl: '',
      bannerId: 0
    }
  },
  created() {
    this.getBanner()
  },
  methods: {
    submitForm() {
      if (this.Title === '新增Banner图') {
        this.addBanner()
      } else {
        this.updataBannerByid()
      }
    },
    handleAvatarSuccess(e) {
      this.imageUrl = `${e.content}`
      console.log(e)
    },
    hasButton(a) {
      return hasPermission(a)
    },
    add() {
      this.Title = '新增Banner图'
      this.DialogFormVisible = true
    },
    updataBanner(row) {
      this.Title = '编辑Banner图'
      this.DialogFormVisible = true
      this.imageUrl = row.bannerUrl
      this.bannerId = row.bannerId
    },
    async getBanner() {
      const res = await getBanner()
      if (res.message === '成功') {
        this.tableData = res.content
      }
    },
    async addBanner() {
      const data = {
        bannerUrl: this.imageUrl
      }
      const res = await addBanner(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '新增成功'
        })
        this.DialogFormVisible = false
        this.getBanner()
      }
    },
    async deleteBannerByid(row) {
      const data = {
        bannerId: row.bannerId
      }
      const res = await deleteBannerByid(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '删除成功'
        })
        this.getBanner()
      }
    },
    async updataBannerByid() {
      const data = {
        bannerId: this.bannerId,
        bannerUrl: this.imageUrl
      }
      const res = await updataBannerByid(data)
      if (res.message === '成功') {
        this.$message({
          type: 'info',
          message: '更新成功'
        })
        this.DialogFormVisible = false
        this.getBanner()
      }
    }
  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

