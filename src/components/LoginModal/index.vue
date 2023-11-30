<template>
  <Teleport to="body">
    <div
      class="teleport-login-modal-warp"
      @click.self.stop="handleClose"
    >
      <div class="content">
        <i
          class="close"
          @click="handleClose"
        ></i>
        <n-card>
          <n-tabs
            :value="currentTab"
            :default-value="currentTab"
            size="large"
            :on-update:value="tabChange"
          >
            <n-tab-pane
              name="pwdlogin"
              tab="账密登录"
            >
              <n-form
                ref="loginFormRef"
                label-placement="left"
                size="large"
                :model="loginForm"
                :rules="loginRules"
              >
                <n-form-item path="id">
                  <n-input
                    v-model:value="loginForm.id"
                    type="text"
                    placeholder="请输入账号"
                  >
                    <template #prefix>
                      <n-icon
                        size="20"
                        class="lang"
                      >
                        <PersonOutline></PersonOutline>
                      </n-icon>
                    </template>
                  </n-input>
                </n-form-item>
                <n-form-item path="password">
                  <n-input
                    v-model:value="loginForm.password"
                    type="password"
                    show-password-on="mousedown"
                    placeholder="请输入密码"
                    @focus="onFocus"
                    @blur="onBlur"
                    @keyup.enter="handleLoginSubmit"
                  >
                    <template #prefix>
                      <n-icon
                        size="20"
                        class="lang"
                      >
                        <LockClosedOutline></LockClosedOutline>
                      </n-icon>
                    </template>
                  </n-input>
                </n-form-item>
              </n-form>
              <n-button
                type="primary"
                block
                secondary
                strong
                @click="handleLoginSubmit"
              >
                登录
              </n-button>
            </n-tab-pane>
            <!-- <n-tab-pane
              name="codelogin"
              tab="免密登录"
            >
              <n-form
                ref="registerFormRef"
                label-placement="left"
                size="large"
                :model="registerForm"
                :rules="registerRules"
              >
                <n-form-item path="email">
                  <n-input
                    v-model:value="registerForm.email"
                    placeholder="请输入邮箱"
                  >
                    <template #prefix>
                      <n-icon
                        size="20"
                        class="lang"
                      >
                        <MailOutline></MailOutline>
                      </n-icon>
                    </template>
                  </n-input>
                </n-form-item>
                <n-form-item path="code">
                  <n-input-group>
                    <n-input
                      v-model:value="registerForm.code"
                      placeholder="请输入验证码"
                      @keyup.enter="handleRegisterSubmit"
                    />
                    <n-button
                      type="primary"
                      ghost
                      :disabled="downCount !== 0"
                      :loading="sendCodeLoading"
                      @click="sendCode()"
                    >
                      发送{{ downCount !== 0 ? `(${downCount})` : '' }}
                    </n-button>
                  </n-input-group>
                </n-form-item>
              </n-form>
              <n-button
                type="primary"
                block
                secondary
                strong
                @click="handleRegisterSubmit"
              >
                登录
              </n-button>
            </n-tab-pane> -->
          </n-tabs>
        </n-card>
        <div class="other-login">
          <span>第三方登录：</span>
          <div
            class="logo-wrap"
            @click="handleQQLogin()"
          >
            <img
              class="qq-logo"
              src="@/assets/img/qq_logo.webp"
            />
          </div>
          <div
            class="logo-wrap"
            @click="handleGithubLogin"
          >
            <img
              class="qq-logo"
              src="@/assets/img/github_logo.webp"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { LockClosedOutline, PersonOutline } from '@vicons/ionicons5';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { fetchSendLoginCode, fetchSendRegisterCode } from '@/api/emailUser';
import { useQQLogin } from '@/hooks/use-login';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';

const loginRules = {
  id: { required: true, message: '请输入账号', trigger: 'blur' },
  password: { required: true, message: '请输入密码', trigger: 'blur' },
};
const registerRules = {
  email: { required: true, message: '请输入邮箱', trigger: 'blur' },
  code: { required: true, message: '请输入验证码', trigger: 'blur' },
};

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const appStore = useAppStore();

const loginForm = ref({
  id: '',
  password: '',
});
const registerForm = ref({
  email: '',
  code: '',
});
const loginFormRef = ref(null);
const registerFormRef = ref(null);
const currentTab = ref('pwdlogin');
const sendCodeLoading = ref(false);
const downCount = ref(0);

const emits = defineEmits(['close']);

function handleGithubLogin() {
  window.$message.warning('敬请期待！');
}
function handleQQLogin() {
  useQQLogin();
}

function handleClose() {
  appStore.showLoginModal = false;
  emits('close');
}

const handleLogin = async () => {
  let token = null;
  if (currentTab.value === 'codelogin') {
    token = await userStore.codeLogin({
      email: registerForm.value.email,
      code: registerForm.value.code,
    });
  } else {
    token = await userStore.pwdLogin({
      id: +loginForm.value.id,
      password: loginForm.value.password,
    });
  }
  if (token) {
    window.$message.success('登录成功!');
    userStore.getUserInfo();
    appStore.showLoginModal = false;
  }
};
const handleRegister = async () => {
  const { token } = await userStore.register({
    email: registerForm.value.email,
    code: registerForm.value.code,
  });
  if (token) {
    window.$message.success('注册成功!');
  }
};
const handleLoginSubmit = (e) => {
  e.preventDefault();
  // @ts-ignore
  loginFormRef.value.validate((errors) => {
    if (!errors) {
      handleLogin();
    }
  });
};
const handleRegisterSubmit = (e) => {
  e.preventDefault();
  // @ts-ignore
  registerFormRef.value.validate((errors) => {
    if (!errors) {
      if (currentTab.value === 'register') {
        handleRegister();
      } else {
        handleLogin();
      }
    }
  });
};
/** 发送验证码 */
const sendCode = async () => {
  if (registerForm.value.email === '')
    return window.$message.warning('请输入邮箱!');
  try {
    sendCodeLoading.value = true;
    if (currentTab.value === 'codelogin') {
      await fetchSendLoginCode(registerForm.value.email);
    } else {
      await fetchSendRegisterCode(registerForm.value.email);
    }
    sendCodeLoading.value = false;
    window.$message.success('发送成功!');
    downCount.value = 60;
    const timer = setInterval(() => {
      downCount.value -= 1;
      if (downCount.value === 0) {
        clearInterval(timer);
      }
    }, 1000);
  } catch (error: any) {
    sendCodeLoading.value = false;
    console.log(error);
  }
};
const tabChange = (v) => {
  currentTab.value = v;
};
const focus = ref(false);
const onFocus = () => {
  focus.value = true;
};
const onBlur = () => {
  focus.value = false;
};
</script>

<style lang="scss" scoped>
.teleport-login-modal-warp {
  z-index: 100 !important;

  @extend %maskBg;
  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 350px;
    border-radius: 5px;
    background-color: #fff;
    transform: translate(-50%, -50%);
    .close {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 1;
      width: 18px;
      height: 18px;
      cursor: pointer;

      @include cross(#ccc, 3px);
    }

    .top {
      position: absolute;
      top: 0;
      left: 50%;
      z-index: 100;
      width: 120px;
      transform: translate(-50%, -90%);
      &.close {
        z-index: 0;
        transform: translate(-50%, -99%);
      }
    }

    .title {
      margin: 10px 0;
      text-align: center;
    }

    .other-login {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin: 5px 0;
      .logo-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: #f4f8fb;
        cursor: pointer;
        .qq-logo {
          width: 26px;
          height: 26px;
        }
      }
    }
  }
}
</style>
