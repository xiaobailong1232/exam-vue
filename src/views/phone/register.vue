<template>
  <div class="app-container">
    <el-card class="box-card" v-loading="loading">
      <div slot="header" class="clearfix">
        <span>注册</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="0">
        <el-form-item prop="name">
          <el-input v-model="form.name">
            <span slot="prepend">姓名</span>
          </el-input>
        </el-form-item>
    
        <el-form-item prop="phone">
          <el-input v-model="form.phone">
            <span slot="prepend">手机</span>
          </el-input>
        </el-form-item>
    
        <el-form-item prop="code">
          <el-input v-model="form.code">
            <span slot="prepend">验证码</span>
            <el-button slot="append" @click="sendSMS" :disabled="stop"><span v-if="stop">{{ timer }}</span><span v-else>获取短信</span></el-button>
          </el-input>
        </el-form-item>
    
        <el-form-item prop="email">
          <el-input v-model="form.email">
            <span slot="prepend">邮箱</span>
          </el-input>
        </el-form-item>
    
        <el-form-item prop="password">
          <el-input type="password" v-model="form.password" @keyup.delete.native="form.password = ''">
            <span slot="prepend">密码</span>
          </el-input>
        </el-form-item>
    
        <el-form-item prop="password_confirmation">
          <el-input type="password" v-model="form.password_confirmation" @keyup.delete.native="form.password_confirmation = ''">
            <span slot="prepend">确认密码</span>
          </el-input>
        </el-form-item>
    
        <el-form-item>
          <el-button style="background: #419765;color:#F5FAF7;" @click="hanleSubmit('form')">注册</el-button>
          <el-button style="background: #419765;color:#F5FAF7;" @click="resetFields('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 弹出层 start -->
    <el-dialog title="恭喜你，注册成功！" :visible.sync="showUser" width="90%" center>
      <p>您是第 {{ user.id }} 注册的用户，</p>
      <p>您的姓名是：{{ user.name }}，</p>
      <p>您注册的手机是 {{ user.phone }}</p>
      <p>您注册的邮箱是 {{ user.email }}</p>
      <span>请在微信小程序中使用『注册手机』 或 『注册邮箱』进行登录</span>
    </el-dialog>
    <!-- 弹出层 start -->
  </div>
</template>

<script>
  import { isPhone } from '@/utils/validate'
  
  import { sendSMS, register } from '@/api/register'
  
  export default {
    created() {
      this.form.group_id = this.$route.params.groupId
    },
    data() {
      const validatePassword = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          callback(new Error('请输入密码'))
        } else if (value.length < 6) {
          callback(new Error('密码最小长度为6'))
        } else {
          callback()
        }
      }
      const validatePassword2 = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      const validatePhone = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          callback(new Error('请输入手机'))
        } else if (!isPhone(value)) {
          callback(new Error('手机不合法!'))
        } else {
          callback()
        }
      }
      return {
        loading: false,
        showUser: false,
        timer: 60, // 默认倒数30秒
        stop: false, // 默认是停止的，但界面加载之后会变成false
        interval: null, // setInterval的对象
        user: {
          id: '',
          name: '',
          phone: '',
          email: ''
        },
        form: {
          name: null,
          phone: null,
          email: null,
          code: null,
          group_id: null
        },
        rules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ],
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            { len: 6, message: '验证码长度为 6', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          password_confirmation: [
            { validator: validatePassword2, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      hanleSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            console.log('error submit!!')
            return false
          }
          this.loading = true
          register(this.form).then(response => {
            this.user.id = response.data.id
            this.user.name = response.data.name
            this.user.email = response.data.email
            this.user.phone = response.data.phone
            this.showUser = true
          }).catch(err => {
            console.log(err)
          }).finally(() => {
            this.loading = false
          })
        })
      },
      resetFields(formName) {
        this.$refs[formName].resetFields()
      },
      // 验证码发送
      sendSMS() {
        if (this.form.phone === '' || this.form.phone === undefined) {
          this.$message.error('请输入手机')
          return false
        }
        if (!isPhone(this.form.phone)) {
          this.$message.error('手机格式错误')
          return false
        }
        this.loading = true
        sendSMS(this.form.phone).then(() => {
          this.$message.success('发送成功')
          this.startTimer()
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.loading = false
        })
      },
      // 开始计时器
      startTimer() {
        // 如果是false就开始倒计时，如果是true就停止倒计时
        if (this.stop === false) {
          this.interval = setInterval(this.update, 1000)
        }
        this.stop = !this.stop
      },
      // 更新计时器
      update() {
        if (this.timer <= 0) {
          clearInterval(this.interval)
          this.timer = 60
        } else {
          this.timer--
        }
      }
    }
  }
</script>

<style>
  .app-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    background: rgba(0, 0, 0, 0.2);
    border:1px solid #e6ebf5;
    box-shadow:0 2px 12px 0 rgba(0,0,0,.1);border-radius: 3px;
  }
  
  .app-container{
    display: -webkit-box;
    -webkit-box-pack:center;
    -webkit-box-align:center;
    -webkit-box-orient: vertical;
    text-align: center
  }
  
  .el-card__header{
    background: #F3F3F3;
    color: #333333;
    font-weight: bold;
    font-size: 20px;
  }
</style>
