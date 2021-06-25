<template>
  <div v-loading="loading" class="rc-cont">
    <flexbox
      v-if="!isSeas"
      class="rc-head"
      direction="row-reverse">
      <el-button
        class="xr-btn--orange rc-head-item"
        icon="el-icon-plus"
        type="primary"
        @click="createClick('title')">新建发票抬头</el-button>
    </flexbox>
    <el-table
      :data="titleList"
      :height="tableHeight"
      stripe
      style="width: 100%;border: 1px solid #E6E6E6;">
      <el-table-column
        v-for="(item, index) in titleFieldList"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :formatter="titleFieldFormatter"
        show-overflow-tooltip/>
      <el-table-column
        label="操作"
        width="100"
        fixed="right">
        <template slot-scope="scope">
          <flexbox justify="center">
            <el-button
              type="text"
              @click.native="handleTitle('edit', scope)">编辑</el-button>
            <el-button
              type="text"
              @click.native="handleTitle('delete', scope)">删除</el-button>
          </flexbox>
        </template>
      </el-table-column>
    </el-table>

    <flexbox
      class="rc-head"
      direction="row-reverse"
      style="margin-top: 15px;">
      <el-button
        v-if="!isSeas"
        class="xr-btn--orange rc-head-item"
        icon="el-icon-plus"
        type="primary"
        @click="createClick('invoice')">新建发票</el-button>
    </flexbox>
    <el-table
      :data="list"
      :height="tableHeight"
      :cell-class-name="cellClassName"
      stripe
      style="width: 100%;border: 1px solid #E6E6E6;"
      @row-click="handleRowClick">
      <el-table-column
        v-for="(item, index) in fieldList"
        :key="index"
        :prop="item.prop"
        :formatter="invoicefieldFormatter"
        :label="item.label"
        :width="item.width"
        show-overflow-tooltip/>
      <el-table-column
        v-if="canUpdateStatus"
        :resizable="false"
        label="操作"
        fixed="right"
        width="150">
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.invoice_status == 1"
            :type="scope.row.invoice_status == 1 ? '' : 'primary'"
            plain
            @click.native="markReceivables(scope)">{{ scope.row.invoice_status == 1 ? '已开票':'标记为开票' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <c-r-m-full-screen-detail
      :visible.sync="showFullDetail"
      :id="showFullId"
      crm-type="invoice"
      @handle="detailHandle"/>
    <create
      v-if="isCreate"
      :action="{ type: 'relative', crmType: crmType, data: {
        customer: {
          customer_name: detail.name,
          customer_id: detail.customer_id
        },
        contacts_name: detail.contacts_name,
        contacts_mobile: detail.contacts_mobile,
        contacts_address: detail.contacts_address,
      }}"
      @save-success="getInvoiceList"
      @close="isCreate=false"/>
    <invoice-title-set
      :visible.sync="titleCreateShow"
      :customer-id="id"
      :detail="titleDetail"
      @change="getTitleList" />
    <mark-invoice
      :visible.sync="markShow"
      :detail="rowDetail"
      @change="getInvoiceList"
    />
  </div>
</template>

<script type="text/javascript">
import {
  crmCustomerInvoiceAPI,
  crmCustomerInvoiceInfoAPI
} from '@/api/crm/customer'
import { crmInvoiceDeleteInvoiceInfoAPI } from '@/api/crm/invoice'


import CheckStatusMixin from '@/mixins/CheckStatusMixin'
import { separator } from '@/filters/vueNumeralFilter/filters'
import InvoiceTitleSet from '../invoice/components/InvoiceTitleSet'
import MarkInvoice from '../invoice/components/MarkInvoice'
import Create from '../invoice/Create'
import { mapGetters } from 'vuex'

export default {
  name: 'RelativeInvoice', // 相关回访

  components: {
    Create,
    InvoiceTitleSet,
    MarkInvoice,
    CRMFullScreenDetail: () => import('@/components/CRMFullScreenDetail')
  },

  mixins: [CheckStatusMixin],

  props: {
    /** 模块ID */
    id: [String, Number],
    /** 没有值就是全部类型 有值就是当个类型 */
    crmType: {
      type: String,
      default: ''
    },
    /** 是公海 默认是客户 */
    isSeas: {
      type: Boolean,
      default: false
    },
    /** 客户和 合同下 可新建 抬头 */
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  data() {
    return {
      loading: false,
      list: [],
      fieldList: [],
      tableHeight: '250px',
      showFullDetail: false,
      showFullId: '', // 查看全屏详情的 ID
      isCreate: false, // 新建发票发票
      titleList: [],
      titleFieldList: [],

      titleCreateShow: false,
      titleDetail: null,

      rowDetail: {},
      markShow: false
    }
  },

  inject: ['rootTabs'],

  computed: {
    ...mapGetters(['crm']),
    // 是否能操作
    canUpdateStatus() {
      return this.crm && this.crm.invoice && this.crm.invoice.updateInvoiceStatus
    }
  },

  watch: {
    id(val) {
      this.list = []
      this.titleList = []
      this.getInvoiceList()
      this.getTitleList()
    },

    'rootTabs.currentName'(val) {
      if (val === 'RelativeInvoice') {
        this.getInvoiceList(false)
        this.getTitleList(false)
      }
    }
  },

  mounted() {
    this.titleFieldList = [
      { prop: 'title_type', width: '120', label: '抬头类型' },
      { prop: 'invoice_title', width: '120', label: '开票抬头' },
      { prop: 'tax_number', width: '120', label: '纳税人识别号' },
      { prop: 'deposit_bank', width: '120', label: '开户行' },
      { prop: 'deposit_account', width: '120', label: '开户账号' },
      { prop: 'deposit_address', width: '120', label: '开票地址' },
      { prop: 'phone', width: '120', label: '电话' },
      { prop: 'create_user_name', width: '120', label: '创建人' },
      { prop: 'create_time', width: '120', label: '创建时间' }
    ]

    this.getTitleList()

    this.fieldList = [
      { prop: 'invoice_apple_number', width: '120', label: '发票申请编号' },
      { prop: 'contract_number', width: '120', label: '合同名称' },
      { prop: 'contract_money', width: '120', label: '合同金额' },
      { prop: 'invoice_money', width: '120', label: '开票金额（元）' },
      { prop: 'invoice_date', width: '120', label: '开票日期' },
      { prop: 'real_invoice_date', width: '120', label: '实际开票日期' },
      { prop: 'invoice_type', width: '120', label: '开票类型' },
      { prop: 'invoice_number', width: '120', label: '发票号码' },
      { prop: 'logistics_number', width: '120', label: '物流单号' },
      { prop: 'owner_user_name', width: '120', label: '负责人' },
      { prop: 'check_status', width: '120', label: '审核状态' }
    ]
    this.getInvoiceList()
  },

  methods: {
    /**
     * 抬头列表
     */
    getTitleList(loading = true) {
      this.loading = loading
      crmCustomerInvoiceInfoAPI({ customer_id: this.id, pageType: 'all' })
        .then(res => {
          this.loading = false
          this.titleList = res.data.list
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 发票列表
     */
    getInvoiceList(loading = true) {
      this.loading = loading
      crmCustomerInvoiceAPI({ customer_id: this.id, pageType: 'all' })
        .then(res => {
          this.loading = false
          this.list = res.data.list
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
    /**
     * 当某一行被点击时会触发该事件
     */
    handleRowClick(row, column, event) {
      if (column.property == 'invoice_apple_number') {
        this.showFullId = row.invoice_id
        this.showFullDetail = true
      }
    },

    /**
     * 新建发票和抬头
     */
    createClick(type) {
      if (type == 'invoice') {
        this.isCreate = true
      } else if (type == 'title') {
        this.titleDetail = null
        this.titleCreateShow = true
      }
    },

    /**
     * 编辑操作
     */
    handleTitle(type, item) {
      if (type == 'edit') {
        this.titleDetail = item.row
        this.titleCreateShow = true
      } else if (type == 'delete') {
        this.$confirm('您确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            crmInvoiceDeleteInvoiceInfoAPI({
              info_id: item.row.info_id
            })
              .then(res => {
                this.titleList.splice(item.$index, 1)
                this.$message.success('删除成功')
              })
              .catch(() => {})
          })
          .catch(() => {})
      }
    },

    /**
     * 发票格式化字段
     */
    invoicefieldFormatter(row, column) {
      if (column.property === 'check_status') {
        return this.getStatusName(row.check_status)
      } else if (column.property == 'invoice_type') {
        return {
          1: '增值税专用发票',
          2: '增值税普通发票',
          3: '国税通用机打发票',
          4: '地税通用机打发票',
          5: '收据'
        }[row[column.property]]
      } else if (column.property == 'contract_money' || column.property == 'invoice_money') {
        return separator(row[column.property] || 0)
      }
      return row[column.property] === '' || row[column.property] === null ? '--' : row[column.property]
    },

    /**
     * 抬头格式化字段
     */
    titleFieldFormatter(row, column) {
      if (column.property === 'title_type') {
        return {
          1: '单位',
          2: '个人'
        }[row[column.property]]
      }
      return row[column.property] === '' || row[column.property] === null ? '--' : row[column.property]
    },

    /**
     * 通过回调控制class
     */
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'invoice_apple_number') {
        return 'can-visit--underline'
      } else {
        return ''
      }
    },

    /**
     * 详情操作
     */
    detailHandle(data) {
      if (data.type === 'delete') {
        this.getInvoiceList()
        this.$nextTick(() => {
          this.$bus.emit('crm-tab-num-update')
        })
      }
    },

    /**
     * 开票操作
     */
    markReceivables(scope) {
      this.rowDetail = scope.row
      this.markShow = true
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/relativecrm.scss';
</style>
