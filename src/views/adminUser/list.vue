<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column width="200px" align="center" label="email">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="Роль">
        <template slot-scope="scope">
          <span>{{ scope.row.role ||statusFilter2 }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="Примечание">
        <template slot-scope="scope">
          <span>{{ scope.row.remark}}</span>
          <span ><el-button type="text" @click="addRemark(scope.row.email,scope.row.id)">Изменить примечания</el-button></span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="Статус">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.status |statusFilter1 }}
          </el-tag>

        </template>
      </el-table-column>

      <el-table-column align="center" label="Действие" width="241">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="updateStatus(scope.row.id,scope.row.status)">{{ scope.row.status | statusFilter3 }}</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">Удалить</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>

</template>

<script>
import { userList, updateUserStatus, delUser,addremark } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const switchStatus = function(status) {
  if (status === 1) return 0
  else if (status === 0) return 1
  else throw new Error('ошибка статуса')
}
export default {
  name: 'ServerList',
  components: { Pagination },
  filters: {
    statusFilter1(status) {
      const statusMap = {
        1: 'Активный',
        0: 'Заблокирован'
      }
      return statusMap[status]
    },
    statusFilter2(status) {
      const statusMap = {
        'admin': 'Администратор',
        'vip': 'Модератор'
      }
      return statusMap[status]
    },
    statusFilter3(status) {
      const statusMap = {
        1: 'Банить',
        0: 'Разбанить'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10
      }
      ,
    }
  },
  created() {
    this.getList()
  },
  methods: {
   addRemark(email,userId) {
        this.$prompt('Пожалуйста, введите примечание для '+email, 'Уведомление', {
          confirmButtonText: 'Конечно',
          cancelButtonText: 'Отмена',

        }).then(({ value }) => {

          addremark({'id':userId,'remark':value}).then(()=>{
          this.$message({
            type: 'success',
            message: 'Примечание успешно изменено на: ' + value
          });
          this.getList()
          })

        }).catch(() => {

        });
      },
    updateStatus(id, status) {
      var toStatus = switchStatus(status)
      var user = {}
      user.id = id
      user.status = toStatus
      updateUserStatus(user).then(
        () => {
          this.$message({
            type: 'success',
            message: 'Успешно изменено!'
          })
          this.getList()
        })
    },
    handleDelete(id) {
      this.$confirm('Эта операция будет удалена без возможности восстановления. Продолжить?', 'Уведомление', {
        confirmButtonText: 'Конечно',
        cancelButtonText: 'Отмена',
        type: 'warning'
      }).then(() => {
        delUser(id).then(() => {
          this.$message({
            type: 'success',
            message: 'Успешно удалено!'
          })
          this.getList()
        })
      })
    },
    getList() {
      this.listLoading = true
      userList(this.listQuery).then(response => {
        this.list = response.obj.content
        this.total = response.obj.total
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
