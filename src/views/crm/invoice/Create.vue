<template>
  <xr-create
    v-loading="loading"
    :title="title"
    :confirm-button-text="confirmButtonText"
    @close="close"
    @save="saveClick">
    <create-sections title="基本信息">
      <el-form
        ref="crmForm"
        :model="baseFrom"
        :rules="rules"
        label-position="top">
        <el-form-item
          v-for="(item, index) in baseFields"
          :key="item.key"
          :prop="item.field">
          <span slot="label">
            {{ item.name }}
            <span style="color:#999;">
              {{ item.tips || '' }}
            </span>
          </span>
          <component
            :is="item.formType | typeToComponent"
            :value="baseFrom[item.field]"
            :index="index"
            :item="item"
            :relation="item.relation"
            :relative-type="item.formType"
            :disabled="item.disabled"
            :clearable="false"
            @value-change="fieldValueChange"/>
        </el-form-item>
      </el-form>
    </create-sections>

    <create-sections title="发票信息">
      <div style="padding: 10px 20px; text-align: right;">
        <el-popover
          v-model="showPopover"
          placement="top"
          width="700"
          style="padding: 0 !important;"
          trigger="click">
          <crm-relative
            v-if="showSelectView"
            ref="crmrelative"
            :show="showPopover"
            :action="titleAction"
            radio
            crm-type="invoiceTitle"
            @close="showPopover=false"
            @changeCheckout="titleSelectChange"/>
          <el-button
            slot="reference"
            :disabled="!baseFrom.customer_id"
            type="primary"
            @click="showSelectView=true">选择发票信息</el-button>
        </el-popover>
      </div>
      <el-form
        ref="otherFrom"
        :model="otherFrom"
        :rules="otherRules"
        label-position="top">
        <el-form-item
          v-for="(item, index) in otherFields"
          v-show="!item.hidden"
          :key="item.key"
          :prop="item.field">
          <span slot="label">
            {{ item.name }}
            <span style="color:#999;">
              {{ item.tips || '' }}
            </span>
          </span>
          <component
            :is="item.formType | typeToComponent"
            :value="otherFrom[item.field]"
            :index="index"
            :item="item"
            :relative-type="item.formType"
            :disabled="item.disabled"
            :clearable="false"
            @value-change="otherFieldValueChange"/>
        </el-form-item>
      </el-form>
    </create-sections>

    <create-sections title="邮寄信息">
      <el-form
        ref="mailFrom"
        :model="mailFrom"
        :rules="mailRules"
        label-position="top">
        <el-form-item
          v-for="(item, index) in mailFields"
          :key="item.key"
          :prop="item.field">
          <span slot="label">
            {{ item.name }}
            <span style="color:#999;">
              {{ item.tips || '' }}
            </span>
          </span>
          <component
            :is="item.formType | typeToComponent"
            :value="mailFrom[item.field]"
            :index="index"
            :item="item"
            :relative-type="item.formType"
            :disabled="item.disabled"
            :clearable="false"
            @value-change="mailFieldValueChange"/>
        </el-form-item>
      </el-form>
    </create-sections>

    <create-sections
      v-if="isOpenExamine"
      title="审核信息">
      <div
        v-if="examineInfo.config===0 || examineInfo.config===1"
        slot="header"
        class="examine-type">{{ examineInfo.config===1 ? '固定审批流' : '授权审批人' }}</div>
      <create-examine-info
        ref="examineInfo"
        :types-id="editId"
        types="crm_invoice"
        @value-change="examineValueChange" />
    </create-sections>
  </xr-create>
</template>

<script>
import { crmInvoiceSaveAPI, crmInvoiceUpdateAPI, crmInvoiceNumberConfigAPI } from '@/api/crm/invoice'
import { crmCustomerInvoiceInfoAPI } from '@/api/crm/customer'

import XrCreate from '@/components/XrCreate'
import CreateSections from '@/components/CreateSections'
import CreateExamineInfo from '@/components/Examine/CreateExamineInfo'

import {
  XhInput,
  XhTextarea,
  XhSelect,
  XhDate,
  CrmRelativeCell
} from '@/components/CreateCom'
import CrmRelative from '@/components/CreateCom/CrmRelative'

export default {
  // 订单创建
  name: 'InvoiceCreate',
  components: {
    XrCreate,
    CreateSections,
    CreateExamineInfo,
    XhInput,
    XhTextarea,
    XhSelect,
    XhDate,
    CrmRelativeCell,
    CrmRelative
  },
  filters: {
    /** 根据type 找到组件 */
    typeToComponent(formType) {
      if (formType == 'text' || formType == 'floatnumber') {
        return 'XhInput'
      } else if (formType == 'select') {
        return 'XhSelect'
      } else if (formType == 'contract' || formType == 'customer') {
        return 'CrmRelativeCell'
      } else if (formType == 'date') {
        return 'XhDate'
      } else if (formType == 'textarea') {
        return 'XhTextarea'
      }
    }
  },
  props: {
    detail: Object
  },
  data() {
    return {
      loading: false,
      baseFields: [],
      rules: {
        customer_id: [
          { required: true, message: '请选择客户名称', trigger: 'change' }
        ],
        contract_id: [
          { required: true, message: '请选择合同编号', trigger: 'change' }
        ],
        invoice_money: [
          { required: true, message: '请输入开票金额', trigger: ['blur', 'change'] }
        ],
        invoice_type: [
          { required: true, message: '请选择开票类型', trigger: 'change' }
        ]
      },
      baseFrom: {
      },
      showPopover: false,
      titleAction: {
        type: 'default'
      },
      showSelectView: false,
      // 发票信息
      otherFields: [],
      otherRules: {
        title_type: [
          { required: true, message: '请选择抬头类型', trigger: 'change' }
        ]
      },
      otherFrom: {
        title_type: 1
      },

      // 邮寄信息
      mailFields: [],
      mailRules: {},
      mailFrom: {},
      // 审批信息
      examineInfo: {}
    }
  },
  computed: {
    editId() {
      if (this.detail) {
        return this.detail.invoice_id
      }
      return ''
    },

    title() {
      return this.isEdit ? '编辑发票' : '新建发票'
    },

    isEdit() {
      return !!this.editId
    },

    isOpenExamine() {
      if (this.examineInfo) {
        // 初始状态是空对象默认展示，请求之后，根据status判断
        return Object.keys(this.examineInfo).length > 0 ? this.examineInfo.examineStatus : true
      }
      return false
    },

    confirmButtonText() {
      if (this.isOpenExamine) {
        return '提交审核'
      }
      return '保存'
    }
  },
  watch: {},
  created() {
    this.getInvoiceNumberConfig()
    if (this.detail && this.detail.customerId) {
      this.baseFrom = {
        customer_id: [{
          name: this.detail.customerName,
          customer_id: this.detail.customerId
        }],
        contract_id: this.detail.contract_id ? [{
          num: this.detail.contract_number,
          contract_id: this.detail.contract_id
        }] : []

      }
    }
    // 是编辑
    if (this.detail) {
      const baseFrom = {}
      baseFrom.invoice_apple_number = this.detail.essential && this.detail.essential.invoice_apple_number
      baseFrom.customer_id = (this.detail.essential && this.detail.essential.customer_id) ? [{
        name: this.detail.essential.customer_name,
        customer_id: this.detail.essential.customer_id
      }] : []

      if (this.detail.essential && this.detail.essential.customer_id) {
        this.titleAction = {
          type: 'default',
          request: crmCustomerInvoiceInfoAPI,
          showScene: false,
          showSearch: false,
          showCreate: false,
          canShowDetail: true,
          params: {
            customer_id: this.detail.essential.customer_id
          }
        }
      } else if (this.detail.customerId) {
        this.titleAction = {
          type: 'default',
          request: crmCustomerInvoiceInfoAPI,
          showScene: false,
          showSearch: false,
          showCreate: false,
          canShowDetail: true,
          params: {
            customer_id: this.detail.customerId
          }
        }
      }
      if (this.detail.essential) {
        baseFrom.contract_id = this.detail.essential.contract_id ? [{
          num: this.detail.essential.contract_number,
          contract_id: this.detail.essential.contract_id
        }] : []

        baseFrom.contract_money = this.detail.essential.contract_money
        baseFrom.invoice_money = this.detail.essential.invoice_money
        baseFrom.invoice_date = this.detail.essential.invoice_date
        baseFrom.invoice_type = this.detail.essential.invoice_type
        baseFrom.remark = this.detail.essential.remark
        this.baseFrom = baseFrom
      }
      const otherFrom = {}
      if (this.detail.invoice) {
        otherFrom.title_type = this.detail.invoice.title_type
        otherFrom.invoice_title = this.detail.invoice.invoice_title
        otherFrom.tax_number = this.detail.invoice.tax_number
        otherFrom.deposit_bank = this.detail.invoice.deposit_bank
        otherFrom.deposit_account = this.detail.invoice.deposit_account
        otherFrom.deposit_address = this.detail.invoice.deposit_address
        otherFrom.phone = this.detail.invoice.phone
        this.otherFrom = otherFrom
      }
      const mailFrom = {}
      if (this.detail.posting) {
        mailFrom.contacts_name = this.detail.posting.contacts_name
        mailFrom.contacts_mobile = this.detail.posting.contacts_mobile
        mailFrom.contacts_address = this.detail.posting.contacts_address
        this.mailFrom = mailFrom
      }
    }
  },
  mounted() {},

  beforeDestroy() {},
  methods: {
    getInvoiceNumberConfig() {
      crmInvoiceNumberConfigAPI({ type: 'crm_invoice' }).then(res => {
        this.getField(res.data.status)
      }).catch(() => {})
    },

    getField(status) {
      if (!status) {
        this.$set(this.rules, 'invoice_apple_number', [
          { required: true, message: '请输入发票申请编号', trigger: ['blur', 'change'] }
        ])
      }
      this.baseFields = [
        {
          name: '发票申请编号',
          field: 'invoice_apple_number',
          formType: 'text',
          autoGeneNumber: status,
          setting: []
        },
        {
          name: '客户名称',
          field: 'customer_id',
          formType: 'customer',
          setting: []
        },
        {
          name: '合同编号',
          field: 'contract_id',
          formType: 'contract',
          disabled: !(this.detail && (this.detail.customer_id || this.detail.customerId)),
          relation: this.detail && (this.detail.customer_id || this.detail.customerId) ? {
            moduleType: 'customer',
            params: { check_status: 2 },
            customerName: this.detail.customer_name,
            customer_id: this.detail.customer_id || this.detail.customerId
          } : null,
          setting: []
        },
        {
          name: '合同金额',
          field: 'contract_money',
          formType: 'text',
          disabled: true,
          setting: []
        },
        {
          name: '开票金额（元）',
          field: 'invoice_money',
          formType: 'floatnumber',
          setting: []
        },
        {
          name: '开票日期',
          field: 'invoice_date',
          formType: 'date',
          setting: []
        },
        {
          name: '开票类型',
          field: 'invoice_type',
          formType: 'select',
          setting: [{
            name: '增值税专用发票',
            value: 1
          }, {
            name: '增值税普通发票',
            value: 2
          }, {
            name: '国税通用机打发票',
            value: 3
          }, {
            name: '地税通用机打发票',
            value: 4
          }, {
            name: '收据',
            value: 5
          }]
        },
        {
          name: '备注',
          field: 'remark',
          formType: 'textarea',
          setting: []
        }]


      this.otherFields = [
        {
          name: '抬头类型',
          field: 'title_type',
          formType: 'select',
          setting: [{
            name: '单位',
            value: 1
          }, {
            name: '个人',
            value: 2
          }]
        }, {
          name: '开票抬头',
          field: 'invoice_title',
          formType: 'text',
          setting: []
        },
        {
          name: '纳税人识别号',
          field: 'tax_number',
          formType: 'text',
          hidden: false,
          setting: []
        },
        {
          name: '开户行',
          field: 'deposit_bank',
          formType: 'text',
          hidden: false,
          setting: []
        }, {
          name: '开户账号',
          field: 'deposit_account',
          formType: 'text',
          hidden: false,
          setting: []
        }, {
          name: '开票地址',
          field: 'deposit_address',
          formType: 'text',
          hidden: false,
          setting: []
        }, {
          name: '电话',
          field: 'phone',
          formType: 'text',
          setting: []
        }]

      this.mailFields = [{
        name: '联系人',
        field: 'contacts_name',
        formType: 'text',
        setting: []
      },
      {
        name: '联系方式',
        field: 'contacts_mobile',
        formType: 'text',
        setting: []
      },
      {
        name: '邮寄地址',
        field: 'contacts_address',
        formType: 'text',
        setting: []
      }]
    },

    titleSelectChange(data) {
      const dataValue = data.data
      if (dataValue && dataValue.length) {
        const titleData = dataValue[0]
        for (let index = 0; index < this.otherFields.length; index++) {
          const element = this.otherFields[index]
          this.$set(this.otherFrom, element.field, titleData[element.field])
        }

        const hidden = titleData.titleType == 2
        this.otherFields[2].hidden = hidden
        this.otherFields[3].hidden = hidden
        this.otherFields[4].hidden = hidden
        this.otherFields[5].hidden = hidden
      }
    },

    fieldValueChange(data) {
      const item = this.baseFields[data.index]
      const dataValue = data.value
      this.$set(this.baseFrom, item.field, dataValue)

      if (item.formType == 'customer') {
        const contractItem = this.baseFields[data.index + 1]
        if (dataValue.length) {
          contractItem.disabled = false
          const customerItem = dataValue[0]
          customerItem['moduleType'] = 'customer'
          customerItem['params'] = { check_status: 2 }
          contractItem['relation'] = customerItem

          this.$set(this.mailFrom, 'contactsName', customerItem.contactsName)
          this.$set(this.mailFrom, 'contactsMobile', customerItem.contactsMobile)
          this.$set(this.mailFrom, 'contactsAddress', customerItem.contactsAddress)

          this.titleAction = {
            type: 'default',
            request: crmCustomerInvoiceInfoAPI,
            showScene: false,
            showSearch: false,
            showCreate: false,
            canShowDetail: true,
            params: {
              customer_id: customerItem.customer_id
            }
          }
        } else {
          contractItem.disabled = true
          contractItem['relation'] = {}
        }

        this.$set(this.baseFrom, 'contract_id', [])
        this.$set(this.baseFrom, 'invoice_money', '')
        this.$set(this.baseFrom, 'contract_money', '')
        this.$refs.crmForm.validateField(item.field)
      } else if (item.formType == 'contract') {
        const contractValue = dataValue && dataValue.length ? dataValue[0] : null
        this.$set(this.baseFrom, 'contract_money', contractValue ? contractValue.money : '')
        this.$set(this.baseFrom, 'invoice_money', contractValue ? contractValue.money : '')
        this.$refs.crmForm.validateField(item.field)
      }
    },

    otherFieldValueChange(data) {
      const item = this.otherFields[data.index]
      const dataValue = data.value
      if (item.field == 'title_type') {
        const hidden = dataValue == 2
        this.otherFields[2].hidden = hidden
        this.otherFields[3].hidden = hidden
        this.otherFields[4].hidden = hidden
        this.otherFields[5].hidden = hidden
      }
      this.$set(this.otherFrom, item.field, dataValue)
    },

    mailFieldValueChange(data) {
      const item = this.mailFields[data.index]
      const dataValue = data.value
      this.$set(this.mailFrom, item.field, dataValue)
    },

    // 审批信息值更新
    examineValueChange(data) {
      this.examineInfo = data
    },

    close() {
      this.$emit('close')
    },

    saveClick() {
      this.$refs.crmForm.validate(valid => {
        if (valid) {
          const params = {
            examineStatus: this.examineInfo.examineStatus
          }
          for (let index = 0; index < this.baseFields.length; index++) {
            const element = this.baseFields[index]
            if (!element.disabled) {
              if (element.formType == 'customer') {
                const customerValue = this.baseFrom.customer_id && this.baseFrom.customer_id.length ? this.baseFrom.customer_id[0] : null
                params[element.field] = customerValue ? customerValue.customer_id : ''
              } else if (element.formType == 'contract') {
                const contractValue = this.baseFrom.contract_id && this.baseFrom.contract_id.length ? this.baseFrom.contract_id[0] : null
                params[element.field] = contractValue ? contractValue.contract_id : ''
              } else {
                params[element.field] = this.baseFrom[element.field]
              }
            }
          }

          for (let index = 0; index < this.otherFields.length; index++) {
            const element = this.otherFields[index]
            if (!element.disabled) {
              params[element.field] = this.otherFrom[element.field]
            }
          }

          for (let index = 0; index < this.mailFields.length; index++) {
            const element = this.mailFields[index]
            if (!element.disabled) {
              params[element.field] = this.mailFrom[element.field]
            }
          }

          if (this.isEdit) {
            params.invoice_id = this.detail.invoice_id
            params.batchId = this.detail.batchId
          }

          this.getExamineValidateResult((result) => {
            if (result) {
              if (this.examineInfo.config === 0) {
                params['check_user_id'] = this.examineInfo.value[0].id
              }

              console.log(params)

              const request = this.isEdit ? crmInvoiceUpdateAPI : crmInvoiceSaveAPI
              this.loading = true
              request(params)
                .then(res => {
                  this.loading = false
                  this.close()
                  // 回到保存成功
                  this.$emit('save-success')
                })
                .catch(() => {
                  this.loading = false
                })
            }
          })
        }
      })
    },

    /**
     * 获取审批验证结果
     */
    getExamineValidateResult(callBack) {
      if (this.isOpenExamine) {
        this.$refs.examineInfo.validateField((result) => {
          callBack(result)
        })
      } else {
        callBack(true)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -23px;
  /deep/ .el-form-item.is-required .el-form-item__label:before {
    margin-right: 0;
  }
}

.el-form-item {
  flex: 0 0 50%;
  flex-shrink: 0;
  padding: 0 40px;
  padding-bottom: 10px;
  margin-bottom: 4px;
  /deep/ .el-form-item__label {
    color: #333333;
    padding: 5px 0;
    line-height: inherit;
  }

  /deep/ .el-form-item__error {
    padding-top: 2px;
  }
}

.xh-product {
  padding: 0 15px;
}

// 审核信息 里的审核类型
.examine-type {
  font-size: 12px;
  color: white;
  background-color: #fd715a;
  padding: 0 8px;
  margin-left: 5px;
  height: 16px;
  line-height: 16px;
  border-radius: 8px;
  transform: scale(0.8, 0.8);
}
</style>
