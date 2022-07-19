<template>
  <!-- resetpwd_main_box页面主盒子 -->
  <div class='resetpwd_main_box'>
    <span>&nbsp;</span>
    <!-- 步骤和表单盒子 -->
    <div class='step_form_box'>
      <!-- 步骤盒子 -->
      <div class="step_box">
        <el-steps align-center :active="currentStep" finish-status="success" process-status="finish">
          <el-step title="输入用户名"></el-step>
          <el-step title="输入新的密码"></el-step>
          <el-step title="获取短信验证码"></el-step>
          <el-step title="输入短信验证码"></el-step>
          <el-step title="提交密码"></el-step>
        </el-steps>
      </div>
      <!-- form表单 -->
      <el-form ref="reset_from_ref" class='resetpwd_form' :model="resetPwdForm" :rules='rules' label-position="left" label-width="80px">
        <el-form-item label="用户名称" prop='userName'>
          <el-input @blur="blurChangeStepHandle" v-model="resetPwdForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="更新密码" prop='userPassWord'>
          <el-input @blur="blurChangeStepHandle" v-model="resetPwdForm.userPassWord"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop='phone'>
          <el-input @blur="blurChangeStepHandle" v-model="resetPwdForm.phone"></el-input>
        </el-form-item>
        <!-- 短信验证码，必填： -->
        <el-form-item label="短信验证" prop='authCode'>
          <el-input @blur="blurChangeStepHandle" v-model='resetPwdForm.authCode' placeholder="请输入短信验证码" class='auth_code_input' type="text"/>
          <el-button class='auth_code_btn' plain :disabled='isTrue' @click='sendNoteHandle'>{{btnTxt}}</el-button>
        </el-form-item>
        <el-form-item class='submit_exit_box'>
          <el-button @click='exitResetPwdHandle'>取消</el-button>
          <el-button type="primary" @click="submitNewPwdHandle">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    const testphonenumber = (rule, value, callback) => {
      const regphone = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (regphone.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号码！'))
    }
    return {
      // 重置密码对象
      resetPwdForm: {
        userName: '', // 用户名
        phone: '', // 手机号码
        userPassWord: '', // 用户密码
        authCode: '' // 验证码
      },
      currentStep: 0, // 步骤提示
      btnTxt: '获取验证码', // 获取短信按钮默认字符
      isTrue: false, // 控制获取短信按钮是否可用
      // 对表单校验的规则
      rules: {
        userName: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入注册手机号码', trigger: 'blur' },
          { validator: testphonenumber, trigger: 'blur' }
        ],
        userPassWord: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        authCode: [
          { required: true, min: 4, max: 4, message: '请输入4位短信验证码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 退出密码重置
    exitResetPwdHandle () {
      this.$router.push('login')
    },
    // 获取验证码
    sendNoteHandle () {
      if (/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.resetPwdForm.phone)) {
        this.isTrue = true
        let sec = 60
        const timer = setInterval(() => {
          sec--
          sec = sec < 10 ? '0' + sec : sec
          this.btnTxt = '等待(' + sec + ')秒'
        }, 1000)
        setTimeout(() => {
          this.isTrue = false
          this.btnTxt = '获取验证码'
          clearInterval(timer)
        }, 60000)
        // 请求短信验证码接口
        const responseObject = this.$http.post('/api/resetnote', this.resetPwdForm)
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
        this.$message.error('提示：手机号码错误！')
      }
    },
    // 提交修改密码
    async submitNewPwdHandle () {
      this.$refs.reset_from_ref.validate(async valid => {
        if (valid) {
          const responseObject = await this.$http.post('/api/resetpwd', this.resetPwdForm)
          if (responseObject.status !== 200) return this.message.error('提示:服务端重置密码接口错误!')
          const cod = responseObject.data.cod
          switch (cod) {
            case 200:
              this.$message.success('提示:重置密码成功!')
              this.$router.push('/login')
              break
            case 201:
              this.$message.error('提示:短信验证码不正确!')
              break
            case 202:
              this.$message.error('提示:此账号不存在!')
              break
          }
        } else {
          this.$message.error('提示：表单数据不合法!')
          this.$refs.reset_from_ref.resetFields()
          this.currentStep = 0
        }
      })
    },
    // 改变步骤组件当前值
    blurChangeStepHandle () {
      if (this.resetPwdForm.userName) this.currentStep = 1
      if (this.resetPwdForm.userName && this.resetPwdForm.userPassWord) this.currentStep = 2
      if (this.resetPwdForm.userName && this.resetPwdForm.userPassWord && this.resetPwdForm.phone) this.currentStep = 3
      if (this.resetPwdForm.userName && this.resetPwdForm.userPassWord && this.resetPwdForm.phone && this.resetPwdForm.authCode) this.currentStep = 4
    }
  }
}
</script>
<style scoped lang="less">
  // 表单背景颜色：
  @fromBgColor: rgba(55, 55, 55, 0.4);
  // f
  @richColor: #fafafa;
  /* resetpwd_main_box页面主盒子 */
  .resetpwd_main_box {
    width: 100%;
    height: 100%;
    background: @fromBgColor url('../assets/images/bg.svg')  no-repeat top center;
    background-size: cover;
    // 步骤和表单盒子
    .step_form_box {
      width: 70%;
      margin: 50px auto;
      padding: 20px;
      padding-bottom: 50px;
      border-radius: 5px;
      background: @fromBgColor;
      // 步骤盒子
      .step_box {
        width: 80%;
        height: 70px;
        margin: 30px auto;
      }
      // form表单
      .resetpwd_form {
        width:60%;
        margin:0 auto;
        /* 按钮 */
        .submit_exit_box {
          float:right;
        }
        /* 验证码 */
        .auth_code_input {
          width: 70%;
        }
        /* 获取短信按钮 */
        .auth_code_btn{
          width:30%;
          height:50px;
        }
      }
    }
  }
</style>
