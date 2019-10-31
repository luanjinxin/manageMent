<template>
  <div class="app-container">
    <p>注:八个扇叶概率综的和相加为1000</p>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" prop="id" label="id" width="100" />
      <el-table-column align="center" prop="probability" label="中奖概率(‰)" width="100" />
      <el-table-column align="center" prop="name" label="奖品名称" />
      <el-table-column align="center" prop="getProductNum" label="已抽中奖品个数" width="150" />
      <el-table-column align="center" prop="num" label="剩余奖品个数" width="200" />
      <el-table-column prop="image" align="center" label="中奖图片" width="200">
        <!-- 图片的显示 -->
        <template slot-scope="scope">
          <img :src="scope.row.productImg" min-width="70" height="70" >
        </template>
      </el-table-column>
      <el-table-column prop="image" align="center" label="转盘图片" width="200">
        <!-- 图片的显示 -->
        <template slot-scope="scope">
          <img :src="scope.row.img" min-width="70" height="70" >
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="hasButton('luckSetting:edit')"
            type="text"
            size="small"
            @click="edit(scope.row)"
          >修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog width="450px" :title="Title" :visible.sync="DialogFormVisible">
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item>
          奖品图:
          <el-upload
            class="avatar-uploader"
            action="https://api.vitarealm.cn/file_upload"
            :show-file-list="false"
            :on-success="handProductSuccess"
          >
            <img v-if="productImageUrl" :src="productImageUrl" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item>
          转盘图:
          <el-upload
            class="avatar-uploader"
            action="https://api.vitarealm.cn/file_upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="商品名称" prop="roleId">
          <el-col :span="15">
            <el-select v-model="productId" placeholder="请选择商品">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="概率(%)">
          <el-col :span="14">
            <el-input v-model="probability" type="number" />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="close">取消修改</el-button>
          <el-button type="primary" @click="submitForm">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getLuckSetting, selectLuckProduct, updateLuckSetting } from '@/api/luck'
import { hasPermission } from '../../utils'
export default {
  name: 'ComplexTable',
  data() {
    return {
      Title: '',
      DialogFormVisible: false,
      tableData: [],
      id: 0,
      productId: 0,
      imageUrl: '',
      productImageUrl: '',
      probability: 0,
      options: []
    }
  },
  created() {
    this.getLuckSet()
    this.getProduct()
  },
  methods: {
    edit(item) {
      this.Title = '抽奖编辑'
      this.DialogFormVisible = true
      this.id = item.id
      this.productId = item.productId
      this.imageUrl = item.img
      this.productImageUrl = item.productImg
      this.probability = item.probability
    },
    close() {
      this.DialogFormVisible = false
    },
    async getProduct() {
      const data = {
        pageSize: 100,
        pageNumber: 1
      }
      const res = await selectLuckProduct(data)
      if (res.message === '成功') {
        this.options = res.content
      }
    },
    handleAvatarSuccess(e) {
      this.imageUrl = `${e.content}`
      console.log(e)
    },
    handProductSuccess(e) {
      this.productImageUrl = `${e.content}`
      console.log(e)
    },
    async submitForm() {
      const data = {
        id: this.id,
        img: this.imageUrl,
        productImg: this.productImageUrl,
        probability: this.probability,
        productId: this.productId
      }
      const res = await updateLuckSetting(data)
      if (res.message === '成功') {
        this.getLuckSet()
        this.DialogFormVisible = false
        this.$message({
          type: 'info',
          message: '操作成功'
        })
      }
    },
    async getLuckSet() {
      const res = await getLuckSetting()
      if (res.message === '成功') {
        this.tableData = res.content
      }
    },
    // 判断有没有按钮权限
    hasButton(a) {
      return hasPermission(a)
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
