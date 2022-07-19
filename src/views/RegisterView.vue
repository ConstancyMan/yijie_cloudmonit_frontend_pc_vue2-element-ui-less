<template>
  <!-- 注册页主盒子： -->
  <div class='register_box'>
    <!-- 表单 -->
    <el-form  ref="reg_form_ref" class='reg_form' :model='regForm' :rules="rules" >
      <!-- 企业名称可选： -->
      <el-form-item>
        <el-input v-model='regForm.company' placeholder="请输入企业名" type="text" clearable/>
      </el-form-item>
      <!-- 账号，必填： -->
      <el-form-item prop="userName">
        <el-input v-model='regForm.userName' placeholder="请输入账号" type="text" clearable/>
      </el-form-item>
      <!--密码，必填 ： -->
      <el-form-item prop="passWord">
        <el-input v-model='regForm.passWord' placeholder="请输入用户密码" type="password" show-password/>
      </el-form-item>
      <!-- 验证密码，必填： -->
      <el-form-item prop="passWordAgain">
        <el-input v-model='regForm.passWordAgain' placeholder="请确认用户密码" type="password" show-password/>
      </el-form-item>
      <!-- 手机号码，必填： -->
      <el-form-item prop="phone">
        <el-input v-model='regForm.phone' placeholder="请输入手机号" type="text" autocomplete="off"/>
      </el-form-item>
      <!-- 短信验证码，必填： -->
      <el-form-item prop="authCode">
        <el-input v-model='regForm.authCode' placeholder="请输入短信验证码" class='auth_code' type="text"/>
        <el-button class='get_auth_cod_btn' plain :disabled='isTrue' @click='sendNoteHandle'>{{btnTxt}}</el-button>
      </el-form-item>
      <!-- 提交按钮： -->
      <el-button class='reg_from_btn' type="primary" size='small' @click='submitRegistHandle'>提交</el-button>
      <!-- 取消按钮： -->
      <el-button class='reg_from_btn exit_btn' plain size='small' @click='exitRegistHandle'>取消</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    // 自定义密码校验规则
    const testPassWord = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码!'))
      } else {
        if (this.regForm.passWordAgain !== '') {
          this.$refs.reg_form_ref.validateField('passWordAgain')
        }
        callback()
      }
    }
    // 自定义二次校验密码规则
    const testPassWordAgain = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码!'))
      } else if (value !== this.regForm.passWord) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // 自定义校验手机号码规则
    const testphonenumber = (rule, value, callback) => {
      const regPhone = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (regPhone.test(value)) {
        // 验证通过调用回调
        return callback()
      }
      // 验证不通过的回调，需要传入一个new Errow对象
      callback(new Error('请输入正确的手机号码！'))
    }
    return {
      // 表单对象
      regForm: {
        company: '', // 公司名称
        userName: '', // 用户名
        passWord: '', // 用户密码
        passWordAgain: '',
        phone: '', // 用户手机
        authCode: ''// 短信验证码
      },
      // 控制获取短信按钮是否可被点击
      isTrue: false,
      // 获取短信按钮文本
      btnTxt: '获取验证码',
      // 表单校验规则
      rules: {
        userName: [// 用户名校验
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        passWord: [// 密码校验
          { validator: testPassWord, trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        passWordAgain: [// 二次密码校验
          { validator: testPassWordAgain, trigger: 'blur' },
          { min: 6, max: 16, message: '确认长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        phone: [// 手机号码校验
          { validator: testphonenumber, trigger: 'blur' },
          { required: true, message: '请输入11位手机号码', trigger: 'blur' }
        ],
        authCode: [// 验证码校验
          { required: true, min: 4, max: 4, message: '请输入4位短信验证码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 提交表单，进行注册
    submitRegistHandle () {
      // 对表单数据校验通过后在提交
      this.$refs.reg_form_ref.validate(async valid => {
        if (valid) {
          const responseObject = await this.$http.post('/api/register', this.regForm)
          if (responseObject.status !== 200) return this.message.error('提示:服务端注册接口错误!')
          const cod = responseObject.data.cod
          switch (cod) {
            case 200:
              this.$message.success('提示:注册成功!')
              this.$router.push('/login')
              break
            case 201:
              this.$message('提示:用户已存在!')
              break
            case 202:
              this.$message.error('提示:短信验证码不正确!')
              break
          }
        } else {
          // 表单校验失败，做出提示：
          this.message({
            message: '提示：输入有误',
            type: 'warning'
          })
        }
      })
    },
    // 退出注册页
    exitRegistHandle () {
      this.$router.push('/login')
    },
    // 获取验证码
    async sendNoteHandle () {
      if (/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.regForm.phone)) {
        this.isTrue = true
        let sec = 60
        // 倒计时防止多次获取验证码：
        const timer = setInterval(() => {
          sec--
          sec = sec < 10 ? '0' + sec : sec
          this.btnTxt = '等待(' + sec + ')秒'
        }, 1000)
        // 停止倒计时：
        setTimeout(() => {
          this.isTrue = false
          this.btnTxt = '获取验证码'
          clearInterval(timer)
        }, 60000)
        // 请求短信验证码接口
        const responseObject = await this.$http.post('/api/notechecks', this.regForm)
        if (responseObject.status !== 200) return this.message.error('提示:获取短信验证码接口错误!')
        const cod = responseObject.data.cod
        switch (cod) {
          case 200:
            this.$message.success('提示:获取短信验证码成功!')
            break
          case 201:
            this.$message.error('提示:获取短信验证码失败!')
            break
        }
      } else {
        this.message.error('提示：手机号码错误！')
      }
    }
  }
}
</script>
<style scoped lang="less">
  // 注册页背景颜色：
  @registerBoxBgColor: #1b1b1b;
  // 表单背景颜色：
  @fromBgColor: rgba(55, 55, 55, 0.4);
  /* 注册页主盒子 */
  .register_box {
    width: 100%;
    height: 100%;
    background: @registerBoxBgColor url('../assets/images/bg.svg') no-repeat top center;
    background-size: cover;
    /* form表单 */
    .reg_form {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 400px;
      height: auto;
      padding: 10px;
      border-radius: 10px;
      transform: translate(-50%,-50%);
      background: @fromBgColor;
      /* 按钮 */
      .reg_from_btn {
        float: right;
      }
      /* 获取短信按钮 */
      .get_auth_cod_btn{
        margin-left: 1px;
        height: 50px;
      }
      /* 验证码 */
      .auth_code{
        width:285px;
      }
      /* 退出按钮 */
      .exit_btn{
        margin-right:10px;
      }
    }
  }
</style>
