<template>
  <el-form
    ref="numberValidateForm"
    :model="numberValidateForm"
    label-width="150px"
    class="ruleForm"
  >
    <el-form-item
      label="最小金额(毛)"
      prop="min"
      :rules="[
        { required: true, message: '金额不能为空'},
        { type: 'number', message: '金额为数字值'}
      ]"
    >
      <el-input v-model.number="numberValidateForm.min" type="age" auto-complete="off" />
    </el-form-item>
    <el-form-item
      label="最大金额(毛)"
      prop="max"
      :rules="[
        { required: true, message: '金额不能为空'},
        { type: 'number', message: '金额必须为数字值'}
      ]"
    >
      <el-input v-model.number="numberValidateForm.max" type="age" auto-complete="off" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('numberValidateForm')">提交</el-button>
      <el-button @click="resetForm('numberValidateForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getRedboxSetting, updateRedboxSetting } from '@/api/luck'
import { hasPermission } from '../../utils'
export default {
  data() {
    return {
      numberValidateForm: {
        min: '',
        max: ''
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const res = await getRedboxSetting()
      this.numberValidateForm.min = res.content[0].min
      this.numberValidateForm.max = res.content[0].max
    },
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          const data = {
            min: this.numberValidateForm.min,
            max: this.numberValidateForm.max
          }
          const res = await updateRedboxSetting(data)
          if (res.status === '0') {
            this.$message({
              type: 'info',
              message: '操作成功'
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style scoped>
.ruleForm {
  width: 500px;
  margin-top: 50px;
}
</style>
