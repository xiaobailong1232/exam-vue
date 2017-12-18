<template>
  <el-upload
    class="upload"
    action="https://upload.qbox.me"
    :data="dataObj"
    :limit="1"
    :before-upload="beforeUpload"
    :on-success="handleSuccess"
    :on-error="handleError"
    list-type="picture"
    :file-list="fileList"
    :on-exceed="handleOutLimit"
    accept="image/*">
    <el-button size="small" icon="el-icon-upload">上传图片</el-button>
  </el-upload>
</template>

<script>
  import { getToken } from '@/api/qiniu'
  
  export default {
    name: 'QiniuUpload',
    data() {
      return {
        dataObj: {
          token: '',
          key: ''
        },
        image_uri: [],
        fileList: []
      }
    },
    methods: {
      beforeUpload() {
        const _self = this
        return new Promise((resolve, reject) => {
          getToken().then(response => {
            const key = response.data.qiniu_key
            const token = response.data.qiniu_token
            _self._data.dataObj.token = token
            _self._data.dataObj.key = key
            resolve(true)
          }).catch(err => {
            console.log(err)
            reject(false)
          })
        })
      },
      // 触发父级的事件
      handleSuccess(response) {
        this.$emit('success', response)
      },
      // 上传失败
      handleError(err) {
        switch (err.status) {
          case 614:
            this.$message.error('目标资源已存在')
            break
          case 419:
            this.$message.error('用户账号被冻结')
            break
          default:
            this.$message.error('上传失败，错误码为：' + err.status)
        }
      },
      // 超出范围
      handleOutLimit() {
        this.$message.error('超出上传图片数量')
      }
    }
  }
</script>

<style scoped>
  .upload {
    width: 400px;
  }
</style>
