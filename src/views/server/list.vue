<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="serverName" label="Имя" align="center" />
      <el-table-column prop="clientDomain" label="Domain" align="center" />
      <el-table-column prop="proxyIp" label="Proxy" align="center" />
      <el-table-column prop="v2rayIp" label="v2ray Ip" align="center" />
      <el-table-column prop="wsPath" label="wsPath" align="center" />
      <el-table-column prop="level" label="Level" align="center">
        <template slot-scope="{row}">
          <span>{{ row.level | levelFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="alterId" label="alterId" align="center" />
      <el-table-column prop="desc" label="Описание" align="center" />
      <el-table-column prop="status" label="Состояние сервера" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status |statusFilter2 }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Действие" align="center">
        <template slot-scope="scope">
        <el-row class="mb-4" style="display: flex; align-items: center; justify-content: space-between;">
          <router-link :to="'/server/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit" circle style="margin-right: 5px;" />
          </router-link>
          <el-button type="danger" size="small" @click="handleDelete(scope.row.id) " icon="el-icon-delete" circle/>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { serverList, deleteServer } from '@/api/server'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ServerList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '0': 'danger'
      }
      return statusMap[status]
    },
    statusFilter2(status) {
      const statusMap = {
        '1': 'В сети',
        '0': 'Не в сети'
      }
      return statusMap[status]
    },
    levelFilter(level) {
      const levelMap = {
        '0': 'Уровень 0',
        '1': 'Уровень 1',
        '2': 'Уровень 2',
        '3': 'Уровень 3'
      }
      return levelMap[level]
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
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleDelete(id) {
      this.$confirm('После выполнения этой операции восстановление будет невозможно. Вы уверены, что хотите продолжить?', 'Подсказка', {
        confirmButtonText: 'Уверен',
        cancelButtonText: 'Отмена',
        type: 'warning'
      }).then(() => {
        deleteServer(id).then(() => {
          this.$message({
            type: 'success',
            message: 'Успешно удалено!'
          })
          this.getList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Восстановлено'
          })
        })
      })
    },
    getList() {
      this.listLoading = true
      serverList(this.listQuery).then(response => {
        this.list = response.obj.content
        this.total = response.obj.total
        this.listLoading = false
      })
    }
  }
}
</script>

<style>
.el-table th {
    font-size: 12px; /* или любой другой размер, который вам подходит */
}
</style>


