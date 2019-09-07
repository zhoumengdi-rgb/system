<template>
  <div>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      size="mini"
      label-width="100px"
      class="demo-ruleForm m-form"
    >
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
        <el-button type="primary" @click="loginForm">登陆</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {get,post} from "../../utils/request";
export default {
    data(){
    var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 18) {
              callback(new Error('必须年满18岁'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
      return{
        ruleForm: {
          pass: '', //密码
          checkPass: '', //确认密码
          username: '' //用户名
        },
        rules: { //校验规则
          pass: [
            { required:true,validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { required:true,validator: validatePass2, trigger: 'blur' }
          ],
          username: [
            { required:true, trigger: 'blur',message:"请输入用户名" }
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
             let {username,pass} = this.ruleForm;
             post('/api/registry',{
                 username,
                 password:pass
             }).then(res =>{
                 if(res.code === 1){
                    this.$message({
                        message: '注册成功',
                        type: 'success'
                    });
                    this.$router.replace('/login')
                 }else{
                     this.$message.error("注册失败")
                 }
             })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      loginForm() {
        this.$router.replace('/login');
      },
    }
}
</script>   

<style>
    .m-form{
        text-align: center;
        width: 70%;
        margin: 100px auto;
    }
</style>