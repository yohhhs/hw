<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card style="background: rgba(255,255,255,.2)" :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          欢迎登录
        </p>
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="userName">
              <Input v-model="form.userName" placeholder="请输入账号">
                <span slot="prepend">
                    <Icon :size="16" type="ios-person"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" placeholder="请输入密码">
                <span slot="prepend">
                    <Icon :size="14" type="md-lock"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import { login, getPermissions } from '@/api/request'
  import { settingRoutes } from '@/common/js/util'
  import { page404 } from "@/router/routers";
  export default {
    data () {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('密码不能为空'))
        }
        if (!(/^[a-zA-Z0-9_]{6,16}$/.test(value))) {
          return callback(new Error('密码由6-16位的字母、数字或_组成'))
        }
        callback()
      }
      return {
        form: {
          userName: '',
          password: ''
        },
        rules: {
          userName: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ],
          password: [
            { validator: validatePass, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      /*handleSubmit () {
        let con = '{"develop-setting":"开发设置","permissions-setting":"权限设置","school-permissions-setting":"学校权限设置","system-setting":"系统管理","user-setting":"系统用户管理","role-setting":"系统角色管理","school-setting":"学校设置","account-setting":"账号管理","school-message":"消息管理","base-setting":"基础设置","version-control":"版本控制","circle-manager":"圈子管理","type-manager":"组类型管理","interest-group":"兴趣组管理","topic-manager":"话题管理","trends-info":"动态管理","recommend-setting":"推荐设置","re-active":"活动推荐","re-massgroup":"大众团推荐","re-account":"用户推荐","active-manager":"活动管理","h5-active":"h5活动管理","game":"赛事","game-list":"赛事列表","game-group":"组别","game-person":"参赛人员","grade-manager":"成绩管理","message-center":"消息中心","message-push":"消息推送","message-review":"消息审核"}'
        let per = '[{"route":"develop-setting","children":[{"route":"permissions-setting"},{"route":"school-permissions-setting"}]},{"route":"system-setting","children":[{"route":"user-setting","handles":["添加","编辑","删除"]},{"route":"role-setting","handles":["添加","编辑","删除"]}]},{"route":"school-setting","children":[{"route":"account-setting","handles":["添加","编辑","查看"]},{"route":"school-message","handles":["添加"]}]},{"route":"base-setting","children":[{"route":"version-control"}]},{"route":"circle-manager","children":[{"route":"type-manager","handles":["添加"]},{"route":"interest-group","handles":["添加"]},{"route":"topic-manager","handles":["添加"]},{"route":"trends-info"}]},{"route":"recommend-setting","children":[{"route":"re-active","handles":["添加"]},{"route":"re-massgroup","handles":["添加"]},{"route":"re-account"}]},{"route":"active-manager","children":[{"route":"h5-active","handles":["添加"]}]},{"route":"game","children":[{"route":"game-list","handles":["新建赛事"]},{"route":"game-group","handles":["设置组别"]},{"route":"game-person"},{"route":"grade-manager"}]},{"route":"message-center","children":[{"route":"message-push","handles":["添加"]},{"route":"message-review"}]}]'
        let routes = settingRoutes(JSON.parse(con), JSON.parse(per))
        this.$router.addRoutes([...routes, page404])
        this.$nextTick(() => {
          this.$router.push({name: 'home-index'});
      })
      },*/
      handleSubmit () {
        this.$refs.loginForm.validate((valid) => {
            if (valid) {
              let phone = this.form.userName
              let password = this.form.password
              login({
                phone,
                password
              }).then(data => {
                if (data !== 'isError') {
                  window.sessionStorage.setItem('ym-token', data)
                  getPermissions().then(data => {
                    if (data !== 'isError') {
                      let routes = settingRoutes(JSON.parse(data.contrast), JSON.parse(data.permissionsTree))
                      this.$router.addRoutes([...routes])
                      this.$router.push({name:'home-index'})
                      window.localStorage.setItem('user', this.form.userName)
                    }
                  })
                }
              })
            }
        })
      }
    }
  }
</script>

<style lang="less">
  .login{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-image: url('https://file.iviewui.com/iview-admin/login_bg.jpg');
    background-size: cover;
    background-position: center;
    &-con{
      position: absolute;
      right: 160px;
      top: 50%;
      transform: translateY(-60%);
      width: 300px;
      &-header{
        font-size: 16px;
        font-weight: 300;
        text-align: center;
        padding: 30px 0;
      }
      .form-con{
        padding: 10px 0 0;
      }
      .login-tip{
        font-size: 10px;
        text-align: center;
        color: #c3c3c3;
      }
    }
  }
</style>
