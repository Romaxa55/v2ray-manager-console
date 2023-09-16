<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column  align="center" width="120px" label="Название">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
        <el-table-column  align="center" label="Срок" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.toDate | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="130px" align="center" label="Статус">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status |statusFilter2 }}
          </el-tag>
        </template>
      </el-table-column>


        <el-table-column  align="center" label="Текст">
        <template slot-scope="scope">
           <div v-html="scope.row.content" />

        </template>
      </el-table-column>
      <el-table-column align="center" label="Действие" width="241">
        <template slot-scope="scope">
          <router-link :to="'/notice/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              Ред.
            </el-button>
          </router-link>
          <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">Удалить</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { listNotice, delNotice } from '@/api/notice'
//import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'NoticeList',
 // components: {  },
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
        '1': 'Опубликовано',
        '0': 'Черновик'
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
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleDelete(id) {
      this.$confirm('Это действие приведет к безвозвратному удалению. Продолжить?', 'Уведомление', {
        confirmButtonText: 'Подтвердить',
        cancelButtonText: 'Отменить',
        type: 'warning'
      }).then(() => {
        delNotice(id).then(() => {
          this.$message({
            type: 'success',
            message: 'Успешно удалено!'
          })
          this.getList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Удаление отменено'
          })
        })
      })
    },
    getList() {
      this.listLoading = true
      listNotice(this.listQuery).then(response => {
        this.list = response.obj
     //   this.total = response.obj.total
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
