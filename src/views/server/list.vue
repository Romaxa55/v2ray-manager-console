<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column width="100px" align="center" label="Имя">
        <template slot-scope="scope">
          <span>{{ scope.row.serverName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="Domain">
        <template slot-scope="scope">
          <span>{{ scope.row.clientDomain }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="Proxy">
        <template slot-scope="scope">
          <span>{{ scope.row.proxyIp }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="v2ray Ip">
        <template slot-scope="scope">
          <span>{{ scope.row.v2rayIp }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="wsPath">
        <template slot-scope="scope">
          <span>{{ scope.row.wsPath }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="Level">
        <template slot-scope="{row}">
          <span>{{ row.level | levelFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="alterId">
        <template slot-scope="{row}">
          <span>{{ row.alterId }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="Описание">
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="Состояние сервера">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status |statusFilter2 }}
          </el-tag>

        </template>
      </el-table-column>

      <el-table-column align="center" label="Действие" width="241">
        <template slot-scope="scope">
          <router-link :to="'/server/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              Ред.
            </el-button>
          </router-link>
          <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">Удалить</el-button>
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
      this.$confirm('Эта операция будет удалена без возможности восстановления. Продолжить?', 'Уведомление', {
        confirmButtonText: 'Конечно',
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
            message: 'Восстановить'
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
