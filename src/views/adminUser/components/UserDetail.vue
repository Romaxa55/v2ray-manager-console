<template>
 <el-row class="small">
    <div class="container small">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container" label-width="100px">

      <el-form-item label="Email" prop="email">
        <el-input v-model="postForm.email" />
      </el-form-item>

      <el-form-item label="Пароль" prop="password">
        <el-input v-model="postForm.password" />
      </el-form-item>

      <el-form-item label="Роль" prop="role">

        <el-select v-model="postForm.role">
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
        Сохранить
      </el-button>
    </el-form>
    </div>
 </el-row>
</template>

<script>
import { addUser } from '@/api/user'
import md5 from 'js-md5'
const defaultForm = {
  email: '',
  password: '123456',
  role: 'vip'
}
const defaultRules = {
  email: { required: true, trigger: 'blur' },
  password: { required: true, min: 6, trigger: 'blur' },
  role: { required: true, trigger: 'blur' }

}

export default {
  name: 'ServerDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: Object.assign({}, defaultRules),
      tempRoute: {},
      roleOptions: [{ value: 'vip', label: 'Участник' }, { value: 'admin', label: 'Администратор' }]

    }
  },
  computed: {

  },
  created() {
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {

    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const formData = Object.assign({}, this.postForm)
          formData.password = md5(formData.password)
          addUser(formData).then(response => {
            this.$notify({
              title: 'Успешно',
              message: 'Отправлено успешно',
              type: 'success',
              duration: 2000
            })
          }).catch(err => {
            console.log(err)
          }).finally(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}

</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  display: flex;
  justify-content: center;
  align-items: center; /* для вертикального центрирования, если нужно */
  padding: 20px;
}

.el-form {
  flex: 1; /* занимает всю доступную ширину, но можно настроить по желанию */
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-right: 20px; /* отступ от боковой панели */
}


.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
