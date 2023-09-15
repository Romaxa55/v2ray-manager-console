<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>About me</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <div>Hello</div>
          {{ user.role }}
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}</div>
        <div class="user-role text-center text-muted">{{ user.role | uppercaseFirst }}</div>

      </div>
    </div>
<div class="user-bio">
    <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="edit" /><span>Изменить пароль</span></div>
          <el-form  :model="postForm" :rules="rules" ref="postForm">
            <el-form-item label="Старый пароль" prop="oldPassword" ><el-input placeholder="Старый пароль" show-password v-model="postForm.oldPassword"></el-input></el-form-item>
            <el-form-item  label="Новый пароль" prop="newPassword"><el-input placeholder="Новый пароль" show-password  v-model="postForm.newPassword"></el-input></el-form-item>

              <el-form-item>

                 <el-button @click="chPw()" >提交</el-button>
                 </el-form-item>

          </el-form>
      </div>
</div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import md5 from 'js-md5'
import { changepassword } from '@/api/user'
export default {
  components: { PanThumb },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          roles: '',

        }
      }
    }
  },data(){
    return{
    postForm: {},
    rules:{
        oldPassword: { required: true, min: 6, trigger: 'blur' },
        newPassword: { required: true, min: 6, trigger: 'blur' },
    }
  }
  },methods:{
    chPw(){

          this.$confirm(' Стоит ли продолжать?', 'Уведомление', {
          confirmButtonText: 'Конечно',
          cancelButtonText: 'Отмена',
          type: 'warning'
        }).then(() => {

          this.$refs.postForm.validate(valid =>{
          if(valid){
            var data= {oldPassword:md5(this.postForm.oldPassword),newPassword:md5(this.postForm.newPassword)};
            changepassword(data).then(response =>{
             this.$notify({
              title: 'Успешно',
              message: 'Отправлено успешно',
              type: 'success',
              duration: 2000
            })

            })

          }else{

          return false
          }
              })

        }).catch(() => {

        });



    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
