<template>
  <div class="dashboard-editor-container">
    <el-form v-if="account" size="mini">
      <el-row :gutter="20">
        <el-col :lg="24" :sm="24" :xs="24" class="card-panel-col">
          <el-card>
            <div slot="header">
              Счет: {{ account.accountNo }}
            </div>
            <el-form-item label="Доступ:">
              {{ account.level |levelFilter }}
            </el-form-item>
            <el-form-item label="Активен до:">
              <span>
              <font v-if="account.toDate>new Date().getTime()">  {{
                  account.toDate | parseTime('{y}-{m}-{d} {h}:{i}')
                }}</font>
              <font v-else color="red">  {{ account.toDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</font>
            </span>
            </el-form-item>

            <el-form-item label="Статус:">
              <span>
              <font v-if="account.status == 1">  {{ account.status |accountStatusFilter }}</font>
              <font v-else color="red">  {{ account.status |accountStatusFilter }}</font>
            </span>
            </el-form-item>

            <el-form-item v-if="account.statVO" label="Платежный день:">
              <span>{{ account.statVO.toDate  | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-form-item>
            <el-form-item label="Лимит скорости:">
              <span></span>
              <span>{{ account.speed }} Кбит/с</span>
            </el-form-item>
            <el-form-item label="Расчет цикла:">
              <!-- <span>周期：</span> -->
              {{ account.cycle }} дней = циклу
            </el-form-item>
            <el-form-item label="Трафик:">

            <span>
              <font v-if="(account.statVO?(account.statVO.flow/1024/1024/1024).toFixed(2) : 0)<account.bandwidth">{{
                  account.statVO ? (account.statVO.flow / 1024 / 1024 / 1024).toFixed(2) : 0
                }}</font>
              <font v-else color="red">{{
                  account.statVO ? (account.statVO.flow / 1024 / 1024 / 1024).toFixed(2) : 0
                }}</font>
              из {{ account.bandwidth }} GB</span>
            </el-form-item>
            <el-form-item label="Лимит коннектов:">{{ account.maxConnection }}
            </el-form-item>


            <el-form-item label="URL подписки (рекомендуется):">
              <el-col :lg="12" :sm="12" :xs="24">
                <el-input v-model="account.subscriptionUrl">
                  <el-button slot="prepend" @click="generatorNewSubscriptionUrl()">
                    <div v-if="!account.subscriptionUrl">Создать</div>
                    <div v-if="account.subscriptionUrl">Обновить</div>
                  </el-button>
                  <el-button slot="append" @click="handlerCopy(account.subscriptionUrl,$event)">Копировать</el-button>
                </el-input>

              </el-col>

            </el-form-item>


          </el-card>
        </el-col>

        <el-col :lg="24" :sm="24" :xs="24" class="card-panel-col">
          <el-card>
            <div slot="header">
              Учетная запись V2Ray
            </div>


            <el-row>

              <el-col :lg="12" :sm="24" :xs="24">

                <el-form-item label="Сервер:">
                  <el-select v-model="serverId" placeholder="Пожалуйста, выберите сервер" @change="serverChange">
                    <el-option
                      v-for="item in serverList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>

                  </el-select>
                </el-form-item>
                <div v-if="v2rayAccount">

                  <el-form-item label="Адрес сервера:">{{ v2rayAccount.add }}</el-form-item>
                  <el-form-item label="Сетевой порт:">{{ v2rayAccount.port }}</el-form-item>
                  <el-form-item label="Идентификатор пользователя:">{{ v2rayAccount.id }}</el-form-item>
                  <el-form-item label="Доп. идентификатор (alterId):">{{ v2rayAccount.aid }}</el-form-item>
                  <el-form-item label="Метод кодирования:">auto</el-form-item>
                  <el-form-item label="Протокол передачи данных:">{{ v2rayAccount.net }}</el-form-item>
                  <el-form-item label="Метод обфускации:">{{ v2rayAccount.type }}</el-form-item>
                  <el-form-item label="Доменное имя (если используется):">{{ v2rayAccount.host }}</el-form-item>
                  <el-form-item label="Путь для WebSocket (если используется):">{{ v2rayAccount.path }}</el-form-item>
                  <el-form-item label="Использовать защищенное соединение (TLS)?:">{{ v2rayAccount.tls }}</el-form-item>
                  <el-form-item label="Описание выбранного сервера:">{{ server.desc }}</el-form-item>


                </div>
              </el-col>

              <el-col :lg="12" :sm="24" :xs="24">
                <div v-if="v2rayAccount">
                  <el-form-item label="">
                    <el-col :lg="20" :sm="20" :xs="24">
                      <el-input v-model="toColip">
                        <el-button slot="append" @click="handlerCopy(toColip,$event)">Копировать</el-button>
                      </el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="">
                    <vue-qr :text="toColip" qid="qrcode"/>
                  </el-form-item>


                </div>
              </el-col>

            </el-row>


          </el-card>
        </el-col>


      </el-row>

    </el-form>
  </div>
</template>
<script>
import {generatorSubscriptionUrl, getAccount, getV2rayAccount} from '@/api/account'
import {availableServers, getServer} from '@/api/server'
import Pagination from '@/components/Pagination'
import clip from '@/utils/clipboard'
import {Base64} from 'js-base64'
import VueQr from 'vue-qr'
import store from '@/store'
import permission from '@/directive/permission/index.js'

var oneDayms = 3600 * 1000 * 24
export default {
  name: 'UserAccount',
  components: {Pagination, VueQr},
  directives: {permission},
  filters: {
    levelFilter(status) {
      const statusMap = {
        0: 'Уровень 0',
        1: 'Уровень 1',
        2: 'Уровень 2',
        3: 'Уровень 3'
      }
      return statusMap[status]
    },
    created() {
      // Здесь вы можете получить список серверов, например, с API или другого источника данных
      // После получения списка серверов:
      if (this.serverList.length > 0) {
        this.serverId = this.serverList[0].value; // Установка serverId значением первого сервера в списке
      }
    },
    parseTime(time) {
      if (!time) return ''
      const date = new Date(time)
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}.${month}.${year} ${hours}:${minutes}`
    },
    speedFilter: function (v) {
      if (v <= 1024) {
        return 'Плавный'
      } else if (v > 1024 && v <= 2024) {
        return 'Высокоскоростной'
      } else {
        return 'Сверхскоростной'
      }
    },
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '0': 'danger'
      }
      return statusMap[status]
    }, accountStatusFilter(status) {
      const statusMap = {
        '1': 'Активный',
        '0': 'Заблокирован'
      }
      return statusMap[status]
    },
    statusFilter2(status) {
      const statusMap = {
        '1': 'Онлайн',
        '0': 'Оффлайн'
      }
      return statusMap[status]
    }

  },
  data() {
    return {
      serverId: null,
      server: null,
      accountFormOptions: [{
        value: 1,
        label: 'Нормальный'
      }, {
        value: 0,
        label: 'Заблокирован'
      }],
      accountForm: {
        id: null,
        fromDate: null,
        toDate: null,
        cycle: null,
        accountNo: null,
        status: null,
        bandwidth: null,
        fromDate: null,
        fromDate: null,
        status: '1',
        addDay: 0
      },
      connections: 0,// connections
      accountDialog: false,

      roles: store.getters.roles,
      v2rayAccount: null,
      toColip: '',
      opAccountId: null,
      serverTotal: 0,
      chooseServerId: null,
      serverListQuery: {
        page: 1,
        pageSize: 10
      },
      isEdit: false,
      serverList: null,
      account: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 50,
        userEmail: ''
      }
    }
  },
  computed: {},
  created() {
    this.getRemoteAccount()
    this.getServerList()
  },
  methods: {
    generatorNewSubscriptionUrl() {


      if (this.isEdit) {
        this.$confirm('Подтвердите обновление? После успеха предыдущий адрес подписки будет недействительным.', 'Подсказка', {
          confirmButtonText: 'Подтвердить',
          cancelButtonText: 'Отменить',
          type: 'warning',
          roundButton: true,
          center: false
        }).then(() => {
          this.trueGeneratorSubscriptionUrl()

        }).catch(() => {

        });
      } else {
        this.trueGeneratorSubscriptionUrl()
      }


    },
    trueGeneratorSubscriptionUrl() {
      generatorSubscriptionUrl().then(response => {
        this.getRemoteAccount();
        this.$message.success('Адрес подписки успешно обновлен, предыдущий адрес стал недействительным.')
      })
    },
    handlerCopy(text, event) {
      //   console.log(Base64.encode('dankogai'))
      clip(text, event)
    }
    , serverChange() {
      getServer(this.serverId).then(response => {
        this.server = response.obj
      })
      getV2rayAccount({'serverId': this.serverId}).then(response => {
        this.v2rayAccount = response.obj
        this.toColip = 'vmess://' + Base64.encode(JSON.stringify(this.v2rayAccount))
      })
    },
    getServerList() {
      availableServers().then(response => {
        this.serverList = []


        for (var i in response.obj) {
          var server = response.obj[i]
          var localserver = {}
          localserver.value = server.id
          localserver.label = server.serverName
          this.serverList[i] = localserver

        }
        if (this.serverList.length > 0) {
          this.serverId = this.serverList[0].value;
          this.serverChange(); // Вызываем метод serverChange для обновления данных на основе выбранного сервера
        }

      })
    },
    formatDate(date) {
      if (!date) return ''
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var date = date.getDate()
      var hour = date.getHours()
      var minute = date.getMinutes()
      var second = date.getSeconds()
      return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
    },
    getRemoteAccount() {
      // var isAdmin=this.roles.indexOf('admin')>-1;


      getAccount(1).then(response => {
        this.account = response.obj
        this.isEdit = this.account.subscriptionUrl ? true : false
        // for (var i = 0; i < this.list.length; i++) {
        //   var content = this.list[i].content
        //   this.list[i].content = content ? JSON.parse(content) : {}
        //   this.list[i].toColip = 'vmess://' + Base64.encode(content)
        // }
        // console.log(this.list);

      })
    }
  }
}
</script>
<style lang="scss" scoped>
.form-item {
  margin-bottom: 10px;
}

.card-panel-col {
  margin-right: 10px;
  margin-bottom: 20px;
}

.dashboard-editor-container {

  padding: 10px;
  // background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
