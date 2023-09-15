<template>
<div>

     <div class="editor-container">

       <el-form :model="defaultform" ref="defaultform"  label-width="80px" class="form"  :rules="rules" >

          <el-form-item label="Название объявления" prop="name">
            <el-input v-model="defaultform.name"></el-input>
          </el-form-item>


            <el-form-item label="Время окончания" prop="toDate">
            <!-- <el-input v-model="form.todate"></el-input> -->
             <el-date-picker
           v-model="defaultform.toDate"
           align="right"
           type="date"
           placeholder="Выберите дату"
           value-format="timestamp"
           :picker-options="pickerOptions">
         </el-date-picker>
             </el-form-item>

              <el-form-item label="Статус объявления" prop="status">
           <el-select v-model="defaultform.status">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
            </el-form-item>

            <el-form-item label="内容" prop="content">
             <markdown-editor ref="markdownEditor" v-model="defaultform.content" height="300px"  />
            </el-form-item>

             <el-form-item>
           <el-button type="primary" @click="onSubmit">立即创建</el-button>

  </el-form-item>
       </el-form>

    </div>
</div>

</template>

<script>
import MarkdownEditor from '@/components/MarkdownEditor'
import { getNotice,addNotice,updateNotice } from '@/api/notice'


const defaultRules ={
      name:{ required: true, trigger: 'blur' },
        toDate:{ required: true, trigger: 'blur' },
        status:{ required: true, trigger: 'blur' },
        content:{ required: true, trigger: 'blur' }
}
export default {
  name: 'noticeDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  components: { MarkdownEditor },
  data() {
    return {
      rules:Object.assign({}, defaultRules),
      defaultform:{
        name:"",
        toDate: "",
        status:1,
        content:""
        },
       statusOptions: [{ value: 1, label: 'В сети' }, { value: 0, label: 'Не в сети' }],
       pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          },
          shortcuts: [ {
            text: 'неделю спустя',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          },
          {
            text: 'месяц',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', date);
            }
          },
           {
            text: 'три месяца',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30*3);
              picker.$emit('pick', date);
            }
          },{
            text: 'год спустя',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30*12);
              picker.$emit('pick', date);
            }
          }
          ]
        },
  }
},created(){
   if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }
},
  computed:{

  } ,
  methods: {
    onSubmit(){
      console.log(this.defaultform)
        this.$refs.defaultform.validate(valid => {
        if (valid) {
          this.defaultform.content= this.$refs.markdownEditor.getHtml();
          this.loading = true
          var req = this.isEdit ? updateNotice(this.defaultform) : addNotice(this.defaultform)
          req.then(response => {

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
    },
  fetchData(id){
      getNotice(id).then(response => {
        this.defaultform = response.obj
      })
  }
  }
}
</script>
<style scoped>
.editor-container{
  margin-bottom: 30px;
}

.form{
  margin-top: 30px;
  margin-left:30px;
  margin-right:30px;
}
.tag-title{
  margin-bottom: 5px;}
</style>
