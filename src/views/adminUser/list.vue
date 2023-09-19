<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list"  border fit highlight-current-row  style="width: 100%">
      <el-table-column prop="email" label="Email" align="" />
      <el-table-column prop="role" label="Роль" align="center" />

      <el-table-column prop="remark" label="Примечание" align="center" />
      <!-- Вставляем новую колонку для уровня -->
      <el-table-column prop="status" label="Статус" align="center">
          <template slot-scope="{row}">
              <span>{{ row.status | statusFilter1 }}</span>
          </template>
      </el-table-column>
      <el-table-column label="Действие" align="center">
        <template slot-scope="scope">
        <el-row class="mb-4" style="display: flex; align-items: center; justify-content: space-between;">
          <el-button type="danger" size="small" @click="updateStatus(scope.row.id,scope.row.status)" round>{{ scope.row.status | statusFilter3 }}</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row.id)" round icon="el-icon-delete" />
          </el-row>
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
        1: 'Забанить',
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
<style>
.el-table th {
    font-size: 12px; /* или любой другой размер, который вам подходит */
}
</style>
