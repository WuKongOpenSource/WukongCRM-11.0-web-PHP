<template>
  <div class="system-customer">
    <xr-header
      icon-class="wk wk-double-gear"
      icon-color="#1CBAF5"
      label="自定义字段设置" />
    <div class="customer-content">
      <el-table
        v-loading="loading"
        :data="tableList"
        :height="tableHeight"
        highlight-current-row
        style="width: 100%">
        <el-table-column
          prop="name"
          label="模块"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <img
              :src="getCustomFieldIcon( scope.row.types)"
              class="table-item-icon" >
            <span class="table-item-label">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="update_time"
          label="更新时间"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="table-item-time">{{ scope.row.update_time == 0 ? '暂无' : scope.row.update_time }}</span>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleCustomField('edit', scope.row, scope.$index)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表单预览 -->
    <preview-field-view
      v-if="showTablePreview"
      :types="tablePreviewData.types"
      :types-id="tablePreviewData.typesId"
      :label="tablePreviewData.label"
      @hiden-view="showTablePreview=false"/>
  </div>
</template>

<script>
import { customFieldIndexAPI } from '@/api/admin/crm'

import PreviewFieldView from '@/views/admin/components/PreviewFieldView'
import XrHeader from '@/components/XrHeader'

export default {
  name: 'CustomField',

  components: {
    PreviewFieldView,
    XrHeader
  },

  data() {
    return {
      loading: false,
      tableHeight: document.documentElement.clientHeight - 140, // 表的高度
      // 自定义字段设置
      tableList: [],
      // 展示表单预览
      tablePreviewData: { types: '', typesId: '' },
      showTablePreview: false
    }
  },

  created() {
    // 控制table的高度
    window.onresize = () => {
      self.tableHeight = document.documentElement.clientHeight - 140
    }

    this.getDetail()
  },

  methods: {
    /**
     * 详情
     */
    getDetail() {
      this.loading = true
      customFieldIndexAPI()
        .then(res => {
          this.tableList = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 列表的编辑和预览
     */
    handleCustomField(type, item, index) {
      if (type == 'edit') {
        this.$router.push({
          name: 'customField',
          params: {
            // type: {
            //   1: 'crm_leads',
            //   2: 'crm_customer',
            //   3: 'crm_contacts',
            //   4: 'crm_product',
            //   5: 'crm_business',
            //   6: 'crm_contract',
            //   7: 'crm_receivables',
            //   17: 'crm_visit'
            // }[item.label],
            type: item.types,
            id: 'none',
            label: {
              'crm_leads': 1,
              'crm_customer': 2,
              'crm_contacts': 3,
              'crm_product': 4,
              'crm_business': 5,
              'crm_contract': 6,
              'crm_receivables': 7,
              'crm_visit': 17,
              'crm_invoice': 18,
              'crm_receivables_plan': 19
            }[item.types]
          }
        })
      } else if (type == 'preview') {
        this.tablePreviewData = item
        this.showTablePreview = true
      }
    },

    /**
     * 根据自定义字段types 获取展示icon
     */
    getCustomFieldIcon(types) {
      if (types === 'crm_leads') {
        return require('@/assets/img/crm/leads.png')
      } else if (types === 'crm_customer') {
        return require('@/assets/img/crm/customer.png')
      } else if (types === 'crm_contacts') {
        return require('@/assets/img/crm/contacts.png')
      } else if (types === 'crm_business') {
        return require('@/assets/img/crm/business.png')
      } else if (types === 'crm_contract') {
        return require('@/assets/img/crm/contract.png')
      } else if (types === 'crm_product') {
        return require('@/assets/img/crm/product.png')
      } else if (types === 'crm_receivables') {
        return require('@/assets/img/crm/receivables.png')
      } else if (types === 'crm_visit') {
        return require('@/assets/img/crm/visit.png')
      } else if (types === 'crm_invoice') {
        return require('@/assets/img/crm/invoice.png')
      } else if (types === 'crm_receivables_plan') {
        return require('@/assets/img/crm/receivables_plan.png')
      }
      return require('@/assets/img/crm/product.png')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.system-customer {
  height: 100%;
}
.customer-content {
  border-top: 1px solid $xr-border-line-color;
  border-bottom: 1px solid $xr-border-line-color;
}

.table-item-label {
  vertical-align:middle;
}
.table-item-icon {
  width: 30px;
  height: 30px;
  margin-right: 8px;
  vertical-align:middle;
  border-radius: 4px;
}

.table-item-time {
  color: #999;
}

.el-table {
  /deep/ .el-table__body td {
    height: 60px;
  }
}
</style>
