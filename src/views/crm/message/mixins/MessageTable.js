/** crm自定义列表 公共逻辑 */
import {
  filedGetTableFieldAPI
} from '@/api/crm/common'
import {
  crmMessageCheckContractAPI,
  crmMessageCheckReceivablesAPI,
  crmMessageTodayLeadsAPI,
  crmMessageTodayCustomerAPI,
  crmMessageTodayBusinessAPI,
  crmMessageFollowLeadsAPI,
  crmMessageFollowCustomerAPI,
  crmMessagEndContractAPI,
  crmMessagRemindreceivablesplanAPI,
  crmMessagRemindCustomerAPI,
  crmMessagVisitRemindAPI,
  crmMessageCheckInvoiceAPI
} from '@/api/crm/message'
import CheckStatusMixin from '@/mixins/CheckStatusMixin'
import { invoiceHeaderFields } from '../../invoice/js/fields'

export default {
  components: {},
  data() {
    return {
      loading: false, // 加载动画
      tableHeight: document.documentElement.clientHeight - 300, // 表的高度
      list: [],
      fieldList: [],
      currentPage: 1,
      pageSize: 15,
      pageSizes: [15, 30, 45, 60],
      total: 0
    }
  },

  mixins: [CheckStatusMixin],

  computed: {
    // 展示options下拉选择
    showOptions() {
      if (this.infoType == 'putInPoolRemind' || this.infoType == 'returnVisitRemind') {
        return false
      }
      return true
    }
  },

  mounted() {
    this.$bus.on('message-scroll', tableHeight => {
      this.tableHeight = tableHeight
    })

    this.$bus.on('examine-handle-bus', () => {
      this.getList()
    })

    /** 控制table的高度 */
    window.onresize = () => {
      this.updateTableHeight()
    }
  },

  methods: {
    /**
     * 当某一行被点击时会触发该事件
     * @param {*} row
     * @param {*} column
     * @param {*} event
     */
    handleRowClick(row, column, event) {
      if (this.crmType === 'leads') {
        if (column.property === 'name') {
          this.rowID = row.leads_id
          this.rowType = 'leads'
          this.showDview = true
        } else {
          this.showDview = false
        }
      } else if (this.crmType === 'customer') {
        if (column.property === 'name') {
          this.rowID = row.customer_id
          this.rowType = 'customer'
          this.showDview = true
        } else {
          this.showDview = false
        }
      } else if (this.crmType === 'contacts') {
        if (column.property === 'customer_name') {
          this.rowID = row.customer_id
          this.rowType = 'customer'
          this.showDview = true
        } else if (column.property === 'name') {
          this.rowID = row.contacts_id
          this.rowType = 'contacts'
          this.showDview = true
        } else {
          this.showDview = false
        }
      } else if (this.crmType === 'business') {
        if (column.property === 'customer_name') {
          this.rowID = row.customer_id
          this.rowType = 'customer'
          this.showDview = true
        } else if (column.property === 'name') {
          this.rowID = row.business_id
          this.rowType = 'business'
          this.showDview = true
        } else {
          this.showDview = false
        }
      } else if (this.crmType === 'contract') {
        if (column.property === 'customer_name') {
          this.rowID = row.customer_id
          this.rowType = 'customer'
          this.showDview = true
        } else if (column.property === 'business_name') {
          this.rowID = row.business_id
          this.rowType = 'business'
          this.showDview = true
        } else if (column.property === 'contacts_name') {
          this.rowID = row.contacts_id
          this.rowType = 'contacts'
          this.showDview = true
        } else if (column.property === 'num') {
          this.rowID = row.contract_id
          this.rowType = 'contract'
          this.showDview = true
        } else {
          this.showDview = false
        }
      } else if (this.crmType === 'product') {
        if (column.property === 'name') {
          this.rowID = row.product_id
          this.showDview = true
        } else {
          this.showDview = false
        }
      } else if (this.crmType === 'receivables') {
        if (column.property === 'customer_name') {
          this.rowID = row.customer_id
          this.rowType = 'customer'
          this.showDview = true
        } else if (column.property === 'contractNum') {
          this.rowID = row.contract_id
          this.rowType = 'contract'
          this.showDview = true
        } else if (column.property === 'number') {
          this.rowID = row.receivables_id
          this.rowType = 'receivables'
          this.showDview = true
        } else {
          this.showDview = false
        }
      } else if (this.crmType === 'receivables_plan') {
        if (column.property === 'customer_name') {
          this.rowID = row.customer_id
          this.rowType = 'customer'
          this.showDview = true
        } else if (column.property === 'contractNum' || column.property === 'contract_name') {
          this.rowID = row.contract_id
          this.rowType = 'contract'
          this.showDview = true
        } else {
          this.showDview = false
        }
      } else if (this.crmType === 'invoice') {
        if (column.property === 'customer_name') {
          this.rowID = row.customer_id
          this.rowType = 'customer'
          this.showDview = true
        } else if (column.property === 'contractNum') {
          this.rowID = row.contract_id
          this.rowType = 'contract'
          this.showDview = true
        } else if (column.property === 'invoice_apple_number') {
          this.rowID = row.invoice_id
          this.rowType = 'invoice'
          this.showDview = true
        } else {
          this.showDview = false
        }
      }
    },

    /** 获取列表数据 */
    getList(loading = true) {
      this.loading = loading
      var crmIndexRequest = this.getIndexRequest()
      const params = {
        page: this.currentPage,
        limit: this.pageSize,
        types: 'list'
      }
      //       page: 1
      // limit: 15
      // types: list
      // isSub: 0
      // type: 1
      if (this.showSubType) {
        params.isSub = { 1: 0, 2: 1 }[this.isSubType]
      }

      if (this.showOptions) {
        params.type = this.optionsType
      }

      const filterObj = this.filterObj.obj
      if (filterObj && Object.keys(filterObj).length > 0) {
        // params.data = filterObj
        filterObj.forEach(element => {
          params[ element.type ] = element
        })
      }

      crmIndexRequest(params)
        .then(res => {
          this.list = res.data.list
          this.total = res.data.dataCount

          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    /** 获取列表请求 */
    getIndexRequest() {
      return {
        'todayLeads': crmMessageTodayLeadsAPI,
        'todayCustomer': crmMessageTodayCustomerAPI,
        'todayBusiness': crmMessageTodayBusinessAPI,
        'followLeads': crmMessageFollowLeadsAPI,
        'followCustomer': crmMessageFollowCustomerAPI,
        'checkContract': crmMessageCheckContractAPI,
        'checkReceivables': crmMessageCheckReceivablesAPI,
        'remindReceivablesPlan': crmMessagRemindreceivablesplanAPI,
        'endContract': crmMessagEndContractAPI,
        'putInPoolRemind': crmMessagRemindCustomerAPI,
        'returnVisitRemind': crmMessagVisitRemindAPI,
        'checkInvoice': crmMessageCheckInvoiceAPI
      }[this.infoType]
    },

    /** 获取字段 */
    getFieldList() {
      console.log('this.crmType', this.crmType)
      if (this.crmType == 'receivables_plan' || this.crmType == 'invoice') {
        let list = []
        if (this.crmType == 'receivables_plan') {
          list = [{
            field: 'num',
            form_type: 'text',
            name: '期数'
          },
          {
            field: 'customer_name',
            form_type: 'customer_name',
            name: '客户名称'
          },
          {
            field: 'contract_name',
            form_type: 'contract_name',
            name: '合同编号'
          },
          {
            field: 'money',
            form_type: 'text',
            name: '计划回款金额'
          },
          {
            field: 'return_date',
            form_type: 'text',
            name: '计划回款日期'
          },
          {
            field: 'return_type',
            form_type: 'text',
            name: '计划回款方式'
          },
          {
            field: 'remind',
            form_type: 'text',
            name: '提前几日提醒'
          },
          {
            field: 'remark',
            form_type: 'text',
            name: '备注'
          }]
          this.handelFieldList(list)
        } else if (this.crmType == 'invoice') {
          this.fieldList = invoiceHeaderFields
        }
        // 获取好字段开始请求数据
        this.getList()
        return
      }

      filedGetTableFieldAPI({
        // label: crmTypeModel[this.crmType]
        types: 'crm_' + this.crmType,
        module: 'crm',
        controller: this.crmType,
        action: 'index'
      })
        .then(res => {
          this.handelFieldList(res.data)

          // 获取好字段开始请求数据
          this.getList()
        })
        .catch(() => {
          this.loading = false
        })
    },

    handelFieldList(list) {
      for (let index = 0; index < list.length; index++) {
        const element = list[index]
        var width = 0
        if (!element.width) {
          if (element.name && element.name.length <= 6) {
            width = element.name.length * 15 + 45
          } else {
            width = 140
          }
        } else {
          width = element.width
        }

        this.fieldList.push({
          prop: element.fieldName || element.field,
          label: element.name,
          width: width
        })
      }

      // // 待进入公海的客户 添加距进入公海天数字段
      // if (this.infoType == 'putInPoolRemind') {
      //   this.fieldList.push({
      //     prop: 'poolDay',
      //     label: '距进入公海天数',
      //     width: 140
      //   })
      // }
    },

    /** 格式化字段 */
    fieldFormatter(row, column) {
      // 如果需要格式化
      if (column.property == 'invoiceType') {
        return {
          1: '增值税专用发票',
          2: '增值税普通发票',
          3: '国税通用机打发票',
          4: '地税通用机打发票',
          5: '收据'
        }[row[column.property]]
      }
      return row[column.property] === '' || row[column.property] === null ? '--' : row[column.property]
    },

    // 更改每页展示数量
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },

    // 更改当前页数
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },

    // 0待审核、1审核中、2审核通过、3审核未通过
    getStatusStyle(status) {
      return {
        backgroundColor: this.getCRMStatusColor(status)
      }
    },

    /**
     * 更新表高
     */
    updateTableHeight() {
      var offsetHei = document.documentElement.clientHeight
      var removeHeight = Object.keys(this.filterObj).length > 0 ? 360 : 300
      this.tableHeight = offsetHei - removeHeight
    }
  },

  beforeDestroy() {
    this.$bus.off('message-scroll')
    this.$bus.off('examine-handle-bus')

    if (document.getElementById('crm-table')) {
      document.getElementById('crm-table').removeEventListener('click', e => {
        e.stopPropagation()
      })
    }
  }
}
