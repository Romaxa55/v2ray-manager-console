<template>
  <div class="errPage-container">
    <el-button icon="el-icon-arrow-left" class="pan-back-btn" @click="back">
      Назад
    </el-button>
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">
          Ой!
        </h1>
        gif источник <a href="https://zh.airbnb.com/" target="_blank">airbnb</a> страница
        <h2>У вас нет доступа к этой странице</h2>
        <h6>Если у вас есть претензии, обратитесь к вашему руководителю</h6>
        <ul class="list-unstyled">
          <li>Или вы можете:</li>
          <li class="link-type">
            <router-link to="/dashboard">
              Вернуться на главную
            </router-link>
          </li>
          <li class="link-type">
            <a href="https://www.taobao.com/">Просто посмотреть</a>
          </li>
          <li><a href="#" @click.prevent="dialogVisible=true">Нажмите, чтобы посмотреть картинку</a></li>
        </ul>
      </el-col>
      <el-col :span="12">
        <img :src="errGif" width="313" height="428" alt="Девочка уронила свое мороженое.">
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" title="Просто посмотреть">
      <img :src="ewizardClap" class="pan-img">
    </el-dialog>
  </div>
</template>

<script>
import errGif from '@/assets/401_images/401.gif'

export default {
  name: 'Page401',
  data() {
    return {
      errGif: errGif + '?' + +new Date(),
      ewizardClap: 'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646',
      dialogVisible: false
    }
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/dashboard' })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .errPage-container {
    width: 800px;
    max-width: 100%;
    margin: 100px auto;
    .pan-back-btn {
      background: #008489;
      color: #fff;
      border: none!important;
    }
    .pan-gif {
      margin: 0 auto;
      display: block;
    }
    .pan-img {
      display: block;
      margin: 0 auto;
      width: 100%;
    }
    .text-jumbo {
      font-size: 60px;
      font-weight: 700;
      color: #484848;
    }
    .list-unstyled {
      font-size: 14px;
      li {
        padding-bottom: 5px;
      }
      a {
        color: #008489;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
