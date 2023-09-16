<template>
  <div class="app-container ">

    <el-row :gutter="15">

      <el-col :span="3">
        <el-input v-model="listQuery.userEmail" placeholder="email"/>
      </el-col>
      <el-col :span="2">
        <el-button @click="getList">Поиск</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="listLoading" :data="list" fit highlight-current-row style="width: 100%">

      <el-table-column align="left" label="Информация об аккаунте">
        <template slot-scope="scope">
          <div><span>Пользователь: {{ scope.row.userVO ? scope.row.userVO.email : '' }}</span></div>
          <div><span>ID Аккаунт: {{ scope.row.accountNo }}</span></div>
          <div><span>Примечание: {{ scope.row.userVO ? scope.row.userVO.remark : '' }}</span></div>
          <div>
            <span> Срок действия: </span>
            <span>
              <font v-if="scope.row.toDate > new Date().getTime()">
                  {{ scope.row.toDate | parseTime('{y}-{m}-{d} {h}:{i}') }}
              </font>
              <font v-else color="red">
                  {{ scope.row.toDate | parseTime('{y}-{m}-{d} {h}:{i}') }}
              </font>
            </span>
          </div>
          <div v-if="scope.row.statVO">
            <span>Время расчета: {{ scope.row.statVO.toDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </div>
        </template>
      </el-table-column>


      <el-table-column align="left" label="">
        <template slot-scope="scope">
          <div><span>Скорость: {{ scope.row.speed | speedFilter }}</span></div>
          <div>Цикл: {{ scope.row.cycle }} дней/цикл</div>
          <div>Трафик: <span>
                <font
                  v-if="(scope.row.statVO ? (scope.row.statVO.flow / 1024 / 1024 / 1024).toFixed(2) : 0) < scope.row.bandwidth">
                    {{ scope.row.statVO ? (scope.row.statVO.flow / 1024 / 1024 / 1024).toFixed(2) : 0 }}
                </font>
                <font v-else color="red">
                    {{ scope.row.statVO ? (scope.row.statVO.flow / 1024 / 1024 / 1024).toFixed(2) : 0 }}
                </font>
                /{{ scope.row.bandwidth }}GB/цикл</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="left" label="">
        <template slot-scope="scope">
          <div>Кол-во соед.: {{ scope.row.maxConnection }}/аккаунт</div>
          <div>Уровень аккаунта: {{ scope.row.level | levelFilter }}</div>
          <div>Статус аккаунта: {{ scope.row.status | accountStatusFilter }}</div>
        </template>
      </el-table-column>

      <el-table-column align="left" label="">
        <template slot-scope="scope">
          <div>
            <el-link icon="el-icon-edit" type="primary" @click="openAccountDidlog(scope.row)">Редактировать аккаунт
            </el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :limit.sync="listQuery.pageSize" :page.sync="listQuery.page" :total="total"
                @pagination="getList"/>

    <!-- Управление аккаунтом -->
    <el-dialog :before-close="handlerAccountCloseDialog" :visible.sync="accountDialog" title="Изменить">
      <el-form ref="accountForm" :model="accountForm" label-width="150px"> <!-- Увеличена ширина подписи -->
        <el-form-item label="Аккаунт">
          <el-input v-model="accountForm.accountNo"/>
        </el-form-item>
        <el-form-item label="Цикл">
          <el-input v-model="accountForm.cycle"/>
        </el-form-item>
        <el-form-item label="Срок действия">
          <el-date-picker
            v-model="accountForm.fromDate"
            type="datetime"
            value-format="timestamp"
          />
          <span>до</span>
          <el-date-picker
            v-model="accountForm.toDate"
            type="datetime"
            value-format="timestamp"
          />
        </el-form-item>
        <el-form-item label="Добавить N дней">
          <el-input v-model="accountForm.addDay" size="medium">
            <el-button slot="append" @click="addToDate">Добавить</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="Скорость">
          <el-input v-model="accountForm.speed"/>
        </el-form-item>
        <el-form-item label="Трафик">
          <el-input v-model="accountForm.bandwidth"/>
        </el-form-item>
        <el-form-item label="Соед. на сервер:">
          <el-input v-model="accountForm.maxConnection"/>
        </el-form-item>
        <el-form-item label="Уровень аккаунта" prop="level">
          <el-select v-model="accountForm.level">
            <el-option
              v-for="item in levelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Статус">
          <el-select v-model="accountForm.status" placeholder="Статус">
            <el-option
              v-for="item in accountFormOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitUpdateAccount">Отправить</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


  </div>
</template>

<script>
import {accountsList, getAccounts, updateAccount, updateAccountServer} from '@/api/account'
import {serverList} from '@/api/server'
import Pagination from '@/components/Pagination'
import clip from '@/utils/clipboard'
import {Base64} from 'js-base64'
import VueQr from 'vue-qr'
import store from '@/store'
import permission from '@/directive/permission/index.js'

var oneDayms = 3600 * 1000 * 24
export default {
  name: 'UserAccount',
  components: { Pagination, VueQr },
  directives: { permission },
  filters: {
     accountStatusFilter(status) {
      const statusMap = {
        '1': 'Активный',
        '0': 'Заблокирован'
      }
      return statusMap[status]
    },
    speedFilter: function(v) {
      if (v <= 1024) {
        return 'Обычный'
      } else if (v > 1024 && v <= 2024) {
        return 'Быстрый'
      } else {
        return 'Супер быстрый'
      }
    },
    levelFilter(status) {
      const statusMap = {
        0: 'Уровень 0',
        1: 'Уровень 1',
        2: 'Уровень 2',
        3: 'Уровень 3'
      }
      return statusMap[status]
    },
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '0': 'danger'
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
      levelOptions: [{value: 0, label: 'Уровень 0'}, {value: 1, label: 'Уровень 1'}, {value: 2, label: 'Уровень 2'}, {
        value: 3,
        label: 'Уровень 3'
      }],
      accountFormOptions: [{
        value: 1,
        label: 'Активный'
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
        addDay: 0,
        level:0
      },

      accountDialog: false,

      roles: store.getters.roles,
      toColip: '',
      opAccountId: null,
      serverTotal: 0,
      chooseServerId: null,
      serverListQuery: {
        page: 1,
        pageSize: 10
      },
      serverDialog: false,
      serverList: null,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 50,
        userEmail: ''
      }
    }
  },
  computed: {

  },
  created() {
    this.getList()
  },
  methods: {
    onChange(v) {
      console.log(v)
    },
    addToDate() {
      var toTime = this.accountForm.toDate
      this.accountForm.toDate = toTime + oneDayms * this.accountForm.addDay
    },
    handlerAccountCloseDialog(done) {
      done()
    },
    openAccountDidlog(row) {
      this.accountForm = row
      this.accountDialog = true
    //  console.log(row)
    //  this.accountForm.rangeDate= [new Date().setTime(this.accountForm.fromDate),new Date().setTime(this.accountForm.toDate)]
    },
    handlerCopy(text, event) {
      //   console.log(Base64.encode('dankogai'))
      clip(text, event)
    },
    submitUpdateAccount() {
      console.log(this.accountForm)
      this.accountForm.content = null
      updateAccount(this.accountForm).then(_ => {
        this.$message.success('Отправлено успешно')
        this.getList()
      })
    },
    submitUpdateServer() {
      if (!this.chooseServerId) {
        this.$message.error('Пожалуйста, выберите сервер')
        this.$refs.multipleTable.clearSelection()
        return
      }
      var data = { 'id': this.opAccountId, 'serverId': this.chooseServerId }
      updateAccountServer(data).then(response => {
        this.$message.success('Успешно отправлено, исходный аккаунт станет недействительным, пожалуйста, используйте новый аккаунт')
        this.getList()
      })
    },
    handlerServerCloseDialog(done) {
      this.$refs.multipleTable.clearSelection()
      this.chooseServerId = null
      this.opAccountId = null
      done()
    },
    handleCurrentChange(rows) {
      this.chooseServerId = null
      if (rows.length > 1) {
        this.$message.error('Можно выбрать только один сервер')

        return
      }
      if (rows.length < 1) {
        return
      }
      var row = rows[0]
      this.chooseServerId = row && row.id ? row.id : null
      console.log(this.chooseServerId)
    },
    getServerList() {
      serverList(this.serverListQuery).then(response => {
        this.serverList = response.obj.content
        this.serverTotal = response.obj.total
      })
    },

    changeServerDidlog(accountId) {
      this.serverDialog = true
      this.opAccountId = accountId
      this.getServerList()
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
    getList() {
      var isAdmin = this.roles.indexOf('admin') > -1
      this.listLoading = true
      var req = isAdmin ? accountsList(this.listQuery) : getAccounts(1)
      req.then(response => {
        this.list = response.obj.content
        for (var i = 0; i < this.list.length; i++) {
          var content = this.list[i].content
          this.list[i].content = content ? JSON.parse(content) : {}
          this.list[i].toColip = 'vmess://' + Base64.encode(content)
        }
        // console.log(this.list);
        this.total = response.obj.total
        this.listLoading = false
      })
    }
  }
}
</script>
<style scoped>

.mainDiv {
  margin-left: 10%;
  margin-right: 10%;

}

.box-card {
  width: 480px;
}
</style>
