<template>
  <!-- login页面主盒子 -->
  <div class='login_box'>
    <!-- 左上角大标题 -->
    <h2>{{headerText}}</h2>
    <!-- 登录表单域 -->
    <el-form  ref="login_from_ref" class='user_form' :model='loginForm' :rules="rules">
      <!-- 迎宾语 -->
      <h6><span>登录</span>  欢迎使用 </h6>
      <!-- 用户名 -->
      <el-form-item prop="userName">
        <el-input v-model='loginForm.userName' placeholder="请输入账号" class="user_infor" prefix-icon="el-icon-user-solid" type="text"/>
      </el-form-item>
      <!-- 用密码 -->
      <el-form-item prop="userPassword">
        <el-input v-model='loginForm.userPassword' placeholder="请输入用户密码" class="user_infor" prefix-icon="el-icon-unlock" type="password"/>
      </el-form-item>
      <!-- 登录按钮 -->
      <el-button  class='user_infor submit_btn' type="primary" @click='loginHandle'>登录</el-button>
      <!-- 注册链接 -->
      <router-link class='link_btn' to="register">注册账号</router-link>&nbsp;&nbsp;
      <!-- 忘记密码链接 -->
      <router-link class='link_btn' to="resetpwd">忘记密码</router-link>
    </el-form>
  </div>
</template>
<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

// export default {
//   name: 'HomeView',
//   components: {
//     HelloWorld
//   }
// }
export default {
  data () {
    return {
      loginForm: { // login表单对象：
        userName: '', // 用户名
        userPassword: ''// 用户密码
      },
      headerText: '', // 左上角标题
      rules: { // 表单校验规则：
        userName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击登录按钮调用loginHandle方法对数据进行校验并发起对ajax请求：
    loginHandle () {
      this.$refs.login_from_ref.validate(async valid => {
        // 表单校验通过：
        if (valid) {
          const responseObject = await this.$http.post('/api/login', this.loginForm)
          // 当服务端发生错误时：
          if (responseObject.status !== 200) return this.ElMessage.error('提示:服务端登录接口错误!')
          // 处理用户登录结果：
          const cod = responseObject.data.cod
          switch (cod) {
            case 200:
              this.$message.success('提示:登录成功!')
              window.sessionStorage.setItem('token', responseObject.data.token)
              // 将当前用户userid存到store中
              // this.$store.state.userId = responseObject.data.userId，这样修改可以实现功能，但是不科学
              this.$store.commit('setUserId', responseObject.data.userId)
              this.$router.push('/home')
              break
            case 201:
              this.$message.error('提示:密码错误!')
              break
            case 202:
              this.$message('提示:用户不存在!')
              break
          }
        } else {
          // 表单校验失败：
          this.$message({
            message: '提示:输入有误,请重新输入!',
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
 /* login页面主盒子 */
  .login_box {
    width: 100%;
    height: 100%;
    background: #1b1b1b url('../assets/images/bg.svg')  no-repeat top center;
    background-size: cover;
    /* 左上角大标题 */
    h2 {
      margin: 0 70px;
      padding-top: 10px;
      font-size: 30px;
      line-height: 30px;
      color: #fafafa;
    }
    /* 登录表单域 */
    .user_form {
      position: relative;
      left: 60%;
      top: 15%;
      width: 458px;
      padding: 0 10px 10px;
      /* border:1px solid rgb(6, 42, 248); */
      background:rgba(55, 55, 55, 0.4);
      border-radius: 5px;
      /* 用户名和用户密码及登录按钮 */
      .user_infor {
        display: block;
        width: 450px;
        height: 50px;
        margin-bottom: 20px;
        border-radius: 5px;
        outline: none;
      }
      /* 迎宾语 */
      h6 {
        font-size: 16px;
        padding-right: 50px;
        color: #4696e6;
        // 迎宾语加粗部分
        span{
          font-size: 25px;
        }
      }
      // 登录按钮
      .submit_btn{
        width: 455px!important;
        background: #4696e6;
      }
      /* 注册和找回密码 */
      a {
        font-size:14px;
        line-height:14px;
        color:rgb(40, 60, 233);
        text-decoration:none;
      }
      a:hover {
        color: #fafafa;
      }
    }
  }
</style>
