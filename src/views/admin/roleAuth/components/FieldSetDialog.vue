<template>
  <el-dialog
    :visible="visible"
    :append-to-body="true"
    :close-on-click-modal="false"
    :title="title"
    width="700px"
    @close="handleCancel">
    <div v-loading="loading" class="field-set-dialog">
      <el-table :data="list" height="50vh" border style="width: 100%">
        <el-table-column label="字段名称" prop="name"/>
        <el-table-column label="初步权限">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.canCheck" :disabled="!getCanOpreateRead(scope.row.read_operation)" @change="checkCheckboxChange(scope.row)">可以查看</el-checkbox>
            <el-checkbox v-model="scope.row.canEdit" :disabled="!getCanOpreateEdit(scope.row.write_operation)" @change="editCheckboxChange(scope.row)">可以修改</el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span
      slot="footer"
      class="dialog-footer">
      <el-button type="text" style="float: left;" @click="getFieldList">重置</el-button>
      <el-button @click="handleCancel">取消</el-button>
      <el-button
        v-debounce="handleConfirm"
        type="primary">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  systemRoleGetFieldAPI,
  systemRoleSetFieldAPI
} from '@/api/admin/role'
import crmTypeModel from '@/views/crm/model/crmTypeModel'

export default {
  name: 'FieldSetDialog',
  components: {},
  mixins: [],
  props: {
    label: [String, Number],
    roleId: [String, Number],
    visible: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      list: [],
      grant_id: ''
    }
  },
  computed: {
    title() {
      return `${crmTypeModel.convertTypeToName(this.label)}字段授权`
    }
  },
  watch: {
    visible: {
      handler() {
        if (this.visible) {
          this.getFieldList()
        }
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    getFieldList() {
      this.list = []
      this.loading = true
      systemRoleGetFieldAPI({ label: this.label, role_id: this.roleId, module: 'crm', column: crmTypeModel.typeToKeyData[this.label] }).then(res => {
        this.loading = false
        const list = res.data.content || []
        this.grant_id = res.data.grant_id
        // authLevel 1 不能查看不能编辑 2可查看  3 可编辑可查看
        list.forEach(item => {
          item.canCheck = item.read == 1
          item.canEdit = item.write == 1
        })
        this.list = res.data.content || []
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 取消选择
     */
    handleCancel() {
      // 重置状态
      this.$emit('update:visible', false)
    },

    // 1 都可以 2 能查看 3  能编辑 4  都不能
    getCanOpreateRead(operateType) {
      return operateType == 1 || operateType == 2
    },

    getCanOpreateEdit(operateType) {
      return operateType == 1 || operateType == 3
    },

    handleConfirm() {
      this.loading = true
      this.list.forEach(item => {
        // let authLevel = 3
        // if (item.canCheck && item.canEdit) {
        //   authLevel = 3
        // } else if (item.canCheck) {
        //   authLevel = 2
        // } else {
        //   authLevel = 1
        // }
        // item.authLevel = authLevel
        if (item.canCheck) {
          item.read = 1
        } else {
          item.read = 0
        }
        if (item.canEdit) {
          item.write = 1
        } else {
          item.write = 0
        }
      })
      this.list.forEach(item => {
        if (item.hasOwnProperty('acuthLevel')) delete item['acuthLevel']
        if (item.hasOwnProperty('canCheck')) delete item['canCheck']
        if (item.hasOwnProperty('canEdit')) delete item['canEdit']
      })
      systemRoleSetFieldAPI({ grant_id: this.grant_id, content: this.list }).then(res => {
        this.loading = false
        this.$message.success('操作成功')
        this.handleCancel()
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 编辑有效时查看必须有效
     */
    editCheckboxChange(data) {
      if (data.canEdit) {
        this.$set(data, 'canCheck', true)
      }
    },

    checkCheckboxChange(data) {
      if (!data.canCheck && data.canEdit) {
        this.$set(data, 'canEdit', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.field-set-dialog {
  color: #333;
  font-size: 12px;
}
</style>
