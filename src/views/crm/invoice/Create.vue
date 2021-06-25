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
        :model="fieldForm"
        :rules="fieldRules"
        :validate-on-rule-change="false"
        class="wk-form"
        label-position="top">
        <wk-form-items
          v-for="(children, index) in fieldList"
          :key="index"
          :field-from="fieldForm"
          :field-list="children"
          :ignore-fields="ignoreFields"
          @change="formChange"
        >
          <template slot-scope="{ data, index }">
            <el-select
              v-if="data && data.field == 'invoice_type'"
              v-model="fieldForm[data.field]"
              style="width: 100%;"
              @change="formChange(data, index, $event)">
              <el-option
                v-for="item in invoiceTypeOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"/>
            </el-select>
            <crm-relative-cell
              v-if="data && data.form_type == 'customer'"
              :value="fieldForm[data.field]"
              :disabled="data.disabled"
              relative-type="customer"
              @value-change="otherChange($event, data)"
            />
            <crm-relative-cell
              v-if="data && data.form_type == 'contract'"
              :value="fieldForm[data.field]"
              :disabled="data.disabled"
              :relation="data.relation"
              :relative-type="data.form_type"
              @value-change="otherChange($event, data)"
            />
          </template>
        </wk-form-items>
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
            crm-type="invoice_title"
            @close="showPopover=false"
            @changeCheckout="titleSelectChange"/>
          <el-button
            slot="reference"
            :disabled="!(fieldForm.customer_id && fieldForm.customer_id.length > 0)"
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
            :is="item.form_type | typeToComponent"
            :value="otherFrom[item.field]"
            :index="index"
            :item="item"
            :relative-type="item.form_type"
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
            :is="item.form_type | typeToComponent"
            :value="mailFrom[item.field]"
            :index="index"
            :item="item"
            :relative-type="item.form_type"
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
import { filedGetFieldAPI } from '@/api/crm/common'
import { crmInvoiceSaveAPI, crmInvoiceUpdateAPI } from '@/api/crm/invoice'
import { crmCustomerInvoiceInfoAPI } from '@/api/crm/customer'

import XrCreate from '@/components/XrCreate'
import WkFormItems from '@/components/NewCom/WkForm/WkFormItems'
import CreateSections from '@/components/CreateSections'
import CreateExamineInfo from '@/components/Examine/CreateExamineInfo'

import CustomFieldsMixin from '@/mixins/CustomFields'
import { objDeepCopy } from '@/utils'

import {
  XhInput,
  XhTextarea,
  XhSelect,
  XhDate,
  XhReceivablesPlan,
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
    XhReceivablesPlan,
    XhTextarea,
    XhSelect,
    XhDate,
    CrmRelativeCell,
    CrmRelative,
    WkFormItems
  },
  filters: {
    /** 根据type 找到组件 */
    typeToComponent(form_type) {
      if (form_type == 'text' || form_type == 'floatnumber') {
        return 'XhInput'
      } else if (form_type == 'select') {
        return 'XhSelect'
      } else if (form_type == 'contract' || form_type == 'customer') {
        return 'CrmRelativeCell'
      } else if (form_type == 'date') {
        return 'XhDate'
      } else if (form_type == 'textarea') {
        return 'XhTextarea'
      }
    }
  },
  mixins: [CustomFieldsMixin],
  props: {
    action: {
      type: Object,
      default: () => {
        return {
          type: 'save',
          id: '',
          data: {}
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      invoiceTypeOptions: [{
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
      }],
      ignoreFields: ['invoice_type'],
      baseFields: [],
      fieldList: [],
      fieldForm: {},
      fieldRules: {},
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
      return this.action.type == 'update' ? this.action.id : ''
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
    this.getField()
    // if (this.detail && this.detail.customer_id) {
    //   this.fieldForm = {
    //     customer_id: [{
    //       name: this.detail.customerName,
    //       customer_id: this.detail.customer_id
    //     }],
    //     contract_id: this.detail.contract_id ? [{
    //       num: this.detail.contract_number,
    //       contract_id: this.detail.contract_id
    //     }] : []

    //   }
    // }
    // // 是编辑
    // if (this.detail) {
    //   const fieldForm = {}
    //   fieldForm.invoice_apple_number = this.detail.essential && this.detail.essential.invoice_apple_number
    //   fieldForm.customer_id = (this.detail.essential && this.detail.essential.customer_id) ? [{
    //     name: this.detail.essential.customer_name,
    //     customer_id: this.detail.essential.customer_id
    //   }] : []

    //   if (this.detail.essential && this.detail.essential.customer_id) {
    //     this.titleAction = {
    //       type: 'default',
    //       request: crmCustomerInvoiceInfoAPI,
    //       showScene: false,
    //       showSearch: false,
    //       showCreate: false,
    //       canShowDetail: true,
    //       params: {
    //         customer_id: this.detail.essential.customer_id
    //       }
    //     }
    //   } else if (this.detail.customer_id) {
    //     this.titleAction = {
    //       type: 'default',
    //       request: crmCustomerInvoiceInfoAPI,
    //       showScene: false,
    //       showSearch: false,
    //       showCreate: false,
    //       canShowDetail: true,
    //       params: {
    //         customer_id: this.detail.customer_id
    //       }
    //     }
    //   }
    //   if (this.detail.essential) {
    //     fieldForm.contract_id = this.detail.essential.contract_id ? [{
    //       num: this.detail.essential.contract_number,
    //       contract_id: this.detail.essential.contract_id
    //     }] : []

    //     fieldForm.contract_money = this.detail.essential.contract_money
    //     fieldForm.invoice_money = this.detail.essential.invoice_money
    //     fieldForm.invoice_date = this.detail.essential.invoice_date
    //     fieldForm.invoice_type = this.detail.essential.invoice_type
    //     fieldForm.remark = this.detail.essential.remark
    //     this.fieldForm = fieldForm
    //   }
    //   const otherFrom = {}
    //   if (this.detail.invoice) {
    //     otherFrom.title_type = this.detail.invoice.title_type
    //     otherFrom.invoice_title = this.detail.invoice.invoice_title
    //     otherFrom.tax_number = this.detail.invoice.tax_number
    //     otherFrom.deposit_bank = this.detail.invoice.deposit_bank
    //     otherFrom.deposit_account = this.detail.invoice.deposit_account
    //     otherFrom.deposit_address = this.detail.invoice.deposit_address
    //     otherFrom.phone = this.detail.invoice.phone
    //     this.otherFrom = otherFrom
    //   }
    //   const mailFrom = {}
    //   if (this.detail.posting) {
    //     mailFrom.contacts_name = this.detail.posting.contacts_name
    //     mailFrom.contacts_mobile = this.detail.posting.contacts_mobile
    //     mailFrom.contacts_address = this.detail.posting.contacts_address
    //     this.mailFrom = mailFrom
    //   }
    // }
  },
  mounted() {},

  beforeDestroy() {},
  methods: {
    /**
     * 获取数据
     */
    getField() {
      this.loading = true
      const params = {
        types: 'crm_invoice',
        module: 'crm',
        controller: 'invoice',
        action: this.action.type,
        format: 2
      }

      if (this.action.type == 'update') {
        params.action_id = this.action.id
      }

      // if (this.action.type == 'update') {
      //   params.id = this.action.id
      // }

      filedGetFieldAPI(params)
        .then(res => {
          const list = res.data || []

          const assistIds = this.getFormAssistIds(list)

          const baseFields = []
          const fieldList = []
          const fieldRules = {}
          const fieldForm = {}
          list.forEach(children => {
            const fields = []
            children.forEach(item => {
              const temp = this.getFormItemDefaultProperty(item)
              temp.show = !assistIds.includes(item.formAssistId)

              if (this.ignoreFields.includes(temp.field)) {
                // 防止影响普通单选的验证方式
                delete temp.optionsData
                delete item.optionsData
              }

              const canEdit = this.getItemIsCanEdit(item, this.action.type)
              // 是否能编辑权限
              if (temp.show && canEdit) {
              // 自动生成编号
                if (item.autoGeneNumber == 1) {
                  temp.placeholder = '根据编号规则自动生成，支持手动输入'
                  const copyItem = objDeepCopy(item)
                  copyItem.isNull = 0
                  fieldRules[temp.field] = this.getRules(copyItem)
                } else {
                  fieldRules[temp.field] = this.getRules(item)
                }
              }

              // 是否可编辑
              temp.disabled = !canEdit

              // 禁止某些业务组件选择
              if (
                temp.form_type == 'contract' ||
                temp.form_type == 'customer') {
                if (this.action.type === 'save') {
                  temp.disabled = item.form_type === 'contract'
                } else if (this.action.type == 'relative') {
                  const customerObj = this.action.data.customer
                  if (temp.form_type == 'customer') {
                    temp.disabled = !!customerObj
                  } else {
                    temp.disabled = !customerObj
                  }
                }
              }

              // 合同金额字段展示用
              if (temp.field === 'contract_money') {
                temp.disabled = true
              }

              // 处理关联
              if (this.action.type == 'update' ||
              this.action.type == 'relative') {
                if (item.form_type == 'contract') { // 合同 需要客户信息
                  const customerItem = this.getItemRelatveInfo(list, 'customer')
                  if (customerItem) {
                    customerItem['moduleType'] = 'customer'
                    customerItem['params'] = { check_status: 2 }
                    temp['relation'] = customerItem

                    this.$set(this.mailFrom, 'contacts_name', customerItem.contacts_name)
                    this.$set(this.mailFrom, 'contacts_mobile', customerItem.contacts_mobile)
                    this.$set(this.mailFrom, 'contacts_address', customerItem.contacts_address)

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
                  }
                }
              }

              // 特殊字段允许多选
              this.getItemRadio(item, temp)

              // 获取默认值
              if (temp.show) {
                if (this.ignoreFields.includes(temp.field)) {
                  fieldForm[temp.field] = this.isEdit ? temp.value : temp.default_value
                } else {
                  fieldForm[temp.field] = this.getItemValue(item, this.action.data, this.action.type)
                }
              }
              fields.push(temp)
              baseFields.push(item)
            })
            fieldList.push(fields)
          })

          this.baseFields = baseFields
          this.fieldList = fieldList
          this.fieldForm = fieldForm
          this.fieldRules = fieldRules

          // // 审核信息
          // this.initWkFlowData({
          //   params: { label: 3 },
          //   fieldForm: this.fieldForm
          // }, res => {
          //   this.wkFlowList = res.list
          //   this.flowRemarks = res.resData ? res.resData.remarks : ''
          // })

          // 获取其他块字段
          this.getOtherField()
          // relative 下赋值联系人信息
          if (this.isEdit || this.action.type === 'relative') {
            const detail = this.action.detail
            const invoice = detail.invoice
            const otherFrom = {}
            otherFrom.title_type = invoice.title_type
            otherFrom.invoice_title = invoice.invoice_title
            otherFrom.tax_number = invoice.tax_number
            otherFrom.deposit_bank = invoice.deposit_bank
            otherFrom.deposit_account = invoice.deposit_account
            otherFrom.deposit_address = invoice.deposit_address
            otherFrom.phone = invoice.phone
            this.otherFrom = otherFrom
            const posting = detail.posting
            const mailFrom = {}
            mailFrom.contacts_name = posting.contacts_name
            mailFrom.contacts_mobile = posting.contacts_mobile
            mailFrom.contacts_address = posting.contacts_address
            this.mailFrom = mailFrom
          }
          this.loading = false
        })
        .catch((e) => {
          this.loading = false
        })
    },

    getOtherField() {
      this.otherFields = [
        {
          name: '抬头类型',
          field: 'title_type',
          form_type: 'select',
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
          form_type: 'text',
          setting: []
        },
        {
          name: '纳税人识别号',
          field: 'tax_number',
          form_type: 'text',
          hidden: false,
          setting: []
        },
        {
          name: '开户行',
          field: 'deposit_bank',
          form_type: 'text',
          hidden: false,
          setting: []
        }, {
          name: '开户账号',
          field: 'deposit_account',
          form_type: 'text',
          hidden: false,
          setting: []
        }, {
          name: '开票地址',
          field: 'deposit_address',
          form_type: 'text',
          hidden: false,
          setting: []
        }, {
          name: '电话',
          field: 'phone',
          form_type: 'text',
          setting: []
        }]

      this.mailFields = [{
        name: '联系人',
        field: 'contacts_name',
        form_type: 'text',
        setting: []
      },
      {
        name: '联系方式',
        field: 'contacts_mobile',
        form_type: 'text',
        setting: []
      },
      {
        name: '邮寄地址',
        field: 'contacts_address',
        form_type: 'text',
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

        const hidden = titleData.title_type == 2
        this.otherFields[2].hidden = hidden
        this.otherFields[3].hidden = hidden
        this.otherFields[4].hidden = hidden
        this.otherFields[5].hidden = hidden
      }
    },

    // fieldValueChange(data) {
    //   const item = this.baseFields[data.index]
    //   const dataValue = data.value
    //   this.$set(this.fieldForm, item.field, dataValue)

    //   if (item.form_type == 'customer') {
    //     const contractItem = this.baseFields[data.index + 1]
    //     if (dataValue.length) {
    //       contractItem.disabled = false
    //       const customerItem = dataValue[0]
    //       customerItem['moduleType'] = 'customer'
    //       customerItem['params'] = { check_status: 2 }
    //       contractItem['relation'] = customerItem

    //       this.$set(this.mailFrom, 'contacts_name', customerItem.contacts_name)
    //       this.$set(this.mailFrom, 'contacts_mobile', customerItem.contacts_mobile)
    //       this.$set(this.mailFrom, 'contacts_address', customerItem.contacts_address)

    //       this.titleAction = {
    //         type: 'default',
    //         request: crmCustomerInvoiceInfoAPI,
    //         showScene: false,
    //         showSearch: false,
    //         showCreate: false,
    //         canShowDetail: true,
    //         params: {
    //           customer_id: customerItem.customer_id
    //         }
    //       }
    //     } else {
    //       contractItem.disabled = true
    //       contractItem['relation'] = {}
    //     }

    //     this.$set(this.fieldForm, 'contract_id', [])
    //     this.$set(this.fieldForm, 'invoice_money', '')
    //     this.$set(this.fieldForm, 'contract_money', '')
    //     this.$refs.crmForm.validateField(item.field)
    //   } else if (item.form_type == 'contract') {
    //     const contractValue = dataValue && dataValue.length ? dataValue[0] : null
    //     this.$set(this.fieldForm, 'contract_money', contractValue ? contractValue.money : '')
    //     this.$set(this.fieldForm, 'invoice_money', contractValue ? contractValue.money : '')
    //     this.$refs.crmForm.validateField(item.field)
    //   }
    // },

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
          // const params = {
          //   examineStatus: this.examineInfo.examineStatus
          // }
          const params = this.getSubmiteParams(this.baseFields, this.fieldForm)
          // for (let index = 0; index < this.baseFields.length; index++) {
          //   const element = this.baseFields[index]
          //   if (!element.disabled) {
          //     if (element.form_type == 'customer') {
          //       const customerValue = this.fieldForm.customer_id && this.fieldForm.customer_id.length ? this.fieldForm.customer_id[0] : null
          //       params[element.field] = customerValue ? customerValue.customer_id : ''
          //     } else if (element.form_type == 'contract') {
          //       const contractValue = this.fieldForm.contract_id && this.fieldForm.contract_id.length ? this.fieldForm.contract_id[0] : null
          //       params[element.field] = contractValue ? contractValue.contract_id : ''
          //     } else {
          //       params[element.field] = this.fieldForm[element.field]
          //     }
          //   }
          // }

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
            params.invoice_id = this.action.id
            // params.batchId = this.detail.batchId
          }

          this.getExamineValidateResult((result) => {
            if (result) {
              if (this.examineInfo.config === 0) {
                params['check_user_id'] = this.examineInfo.value[0].id
              }
              params['examineStatus'] = this.examineInfo.examineStatus
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
    },
    /**
     * 验证唯一
     */
    UniquePromise({ field, value }) {
      return this.getUniquePromise(field, value, this.action)
    },
    /**
     * change
     */
    formChange(field, index, value, valueList) {
      // 审批流逻辑
      // this.debouncedGetWkFlowList(field.field, this.fieldForm)

      if ([
        'select',
        'checkbox'
      ].includes(field.form_type) &&
          field.remark === 'options_type' &&
          field.optionsData) {
        const { fieldForm, fieldRules } = this.getFormContentByOptionsChange(this.fieldList, this.fieldForm)
        this.fieldForm = fieldForm
        this.fieldRules = fieldRules
      }
    },
    /**
     * 地址change
     */
    otherChange(data, field) {
      if (field.form_type === 'customer') {
        this.itemsForEach(this.fieldList, fieldItem => {
          if (fieldItem.form_type === 'contract') {
            // 如果是合同 改变合同样式和传入客户ID
            if (data.value.length > 0) {
              fieldItem.disabled = false
              const customerItem = data.value[0]
              customerItem['moduleType'] = 'customer'
              customerItem['params'] = { check_status: 2 }
              fieldItem['relation'] = customerItem

              this.$set(this.mailFrom, 'contacts_name', customerItem.contacts_name)
              this.$set(this.mailFrom, 'contacts_mobile', customerItem.contacts_mobile)
              this.$set(this.mailFrom, 'contacts_address', customerItem.contacts_address)

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
              fieldItem.disabled = true
              fieldItem['relation'] = {}
              // 重置发票信息
              this.otherFields.forEach(item => {
                if (item.field !== 'title_type') {
                  this.otherFrom[item.field] = ''
                }
              })
            }
            this.fieldForm[fieldItem.field] = []
          }
        })


        // this.$set(this.fieldForm, 'contract_id', [])
        this.$set(this.fieldForm, 'invoice_money', '')
        this.$set(this.fieldForm, 'contract_money', '')
        // this.debouncedGetWkFlowList('invoice_money', this.fieldForm)
      } else if (field.form_type === 'contract') {
        const contractValue = data.value && data.value.length ? data.value[0] : null
        this.$set(this.fieldForm, 'contract_money', contractValue ? contractValue.money : '')
        this.$set(this.fieldForm, 'invoice_money', contractValue ? contractValue.money : '')
        // this.debouncedGetWkFlowList('invoice_money', this.fieldForm)
      }
      this.$set(this.fieldForm, field.field, data.value)
      this.$refs.crmForm.validateField(field.field)
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
