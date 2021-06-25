<template>
  <xr-create
    :loading="loading"
    :title="title"
    :confirm-button-text="sureBtnTitle"
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
          @change="formChange"
        >
          <template slot-scope="{ data }">
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
            <xh-receivables-plan
              v-if="data && data.form_type == 'receivables_plan'"
              :value="fieldForm[data.field]"
              :disabled="data.disabled"
              :receivables-id="editId"
              :relation="data.relation"
              @value-change="otherChange($event, data)"
            />
          </template>
        </wk-form-items>
      </el-form>
    </create-sections>
    <create-sections
      v-if="isOpenExamine"
      title="审核信息">
      <template slot="header">
        <div
          v-if="examineInfo.config===1 || examineInfo.config===0"
          class="examine-type">{{ examineInfo.config===1 ? '固定审批流' : '授权审批人' }}</div>
        <el-tooltip
          v-if="examineInfo && examineInfo.remark"
          :content="examineInfo.remark"
          effect="dark"
          placement="top">
          <i class="wk wk-help wk-help-tips" style="height: 13px;"/>
        </el-tooltip>
      </template>
      <create-examine-info
        ref="examineInfo"
        :types-id="action.id"
        types="crm_receivables"
        @value-change="examineValueChange" />
    </create-sections>

    <el-button
      slot="footer"
      type="primary"
      plain
      @click.native="debouncedSaveField(true)">保存草稿</el-button>
  </xr-create>
</template>

<script>
import { filedGetFieldAPI } from '@/api/crm/common'
import { crmReceivablesSaveAPI } from '@/api/crm/receivables'

import XrCreate from '@/components/XrCreate'
import CreateSections from '@/components/CreateSections'
import WkFormItems from '@/components/NewCom/WkForm/WkFormItems'
import {
  XhReceivablesPlan,
  CrmRelativeCell
} from '@/components/CreateCom'
import CreateExamineInfo from '@/components/Examine/CreateExamineInfo'

import CustomFieldsMixin from '@/mixins/CustomFields'
import { debounce } from 'throttle-debounce'
import { objDeepCopy } from '@/utils'
// import { isEmpty } from '@/utils/types'

export default {
  // 新建编辑
  name: 'ReceivablesCreate',

  components: {
    XrCreate,
    CreateSections,
    CrmRelativeCell,
    XhReceivablesPlan,
    CreateExamineInfo,
    WkFormItems
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
      baseFields: [],
      fieldList: [],
      fieldForm: {},
      fieldRules: {},

      // 审批信息
      examineInfo: {}
    }
  },

  computed: {
    title() {
      return this.action.type === 'update' ? '编辑回款' : '新建回款'
    },

    editId() {
      return this.action.type == 'update' ? this.action.id : ''
    },

    // 合同 回款 下展示审批人信息
    isOpenExamine() {
      if (this.examineInfo) {
        // 初始状态是空对象默认展示，请求之后，根据status判断
        return Object.keys(this.examineInfo).length > 0 ? this.examineInfo.examineStatus : true
      }
      return false
    },

    // 确认名称
    sureBtnTitle() {
      if (this.isOpenExamine) {
        return '提交审核'
      }
      return '保存'
    }
  },

  watch: {},

  created() {
    this.debouncedSaveField = debounce(300, this.saveClick)

    this.getField()
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
        // label: crmTypeModel.receivables
        types: 'crm_receivables',
        module: 'crm',
        controller: 'receivables',
        action: this.action.type,
        format: 2
      }

      if (this.action.type == 'update') {
        params.action_id = this.action.id
      }

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

              const canEdit = this.getItemIsCanEdit(item, this.action.type)
              // 是否能编辑权限
              if (canEdit) {
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
              if (temp.form_type == 'receivables_plan' ||
                temp.form_type == 'contract' ||
                temp.form_type == 'customer') {
                if (this.action.type == 'relative') {
                  const relativeDisInfos = {
                    contacts: { customer: true },
                    customer: { customer: true },
                    business: { customer: true },
                    contract: { customer: true, contract: true }
                  }

                  // 在哪个类型下添加
                  const relativeTypeDisInfos = relativeDisInfos[this.action.crmType]
                  if (relativeTypeDisInfos) {
                  // 包含的字段值
                    temp.disabled = relativeTypeDisInfos[item.form_type] || false
                  }
                } else if (this.action.type != 'update') {
                  temp.disabled = item.form_type === 'contract' || item.form_type === 'receivables_plan'
                }
              }

              // 处理关联
              if (this.action.type == 'relative' || this.action.type == 'update') {
              // 回款计划 需要合同信息
                if (item.form_type === 'receivables_plan') {
                  const contractItem = this.getItemRelatveInfo(list, 'contract')
                  if (contractItem) {
                    contractItem['moduleType'] = 'contract'
                    temp['relation'] = contractItem
                  }
                // 合同 需要客户信息
                } else if (item.form_type == 'contract') {
                  const customerItem = this.getItemRelatveInfo(list, 'customer')
                  if (customerItem) {
                    customerItem['moduleType'] = 'customer'
                    customerItem['params'] = { check_status: 2 }
                    temp['relation'] = customerItem
                  }
                }
              }

              // 特殊字段允许多选
              this.getItemRadio(item, temp)

              // 获取默认值
              if (temp.show) {
                fieldForm[temp.field] = this.getItemValue(item, this.action.data, this.action.type)
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


          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 保存
     */
    saveClick(isDraft = false) {
      this.loading = true
      const crmForm = this.$refs.crmForm
      crmForm.validate(valid => {
        if (valid) {
          if (this.isOpenExamine) {
            /** 验证审批数据 */
            if (isDraft) {
              // 不验证数据 验证审批人
              this.$refs.examineInfo.validateField((result) => {
                if (result) {
                  const params = this.getSubmiteParams(this.baseFields, this.fieldForm)
                  if (
                    this.examineInfo.config === 0 &&
                    this.examineInfo.hasOwnProperty('value') &&
                    this.examineInfo.value.length
                  ) {
                    params['check_user_id'] = this.examineInfo.value[0].id
                  }
                  params['examineStatus'] = this.examineInfo.examineStatus
                  params.is_draft = 1
                  this.submiteParams(params)
                } else {
                  this.loading = false
                }
              })
            } else {
              this.$refs.examineInfo.validateField((result) => {
                if (result) {
                  const params = this.getSubmiteParams(this.baseFields, this.fieldForm)

                  params['examineStatus'] = this.examineInfo.examineStatus
                  if (this.examineInfo.config === 0) {
                    params['check_user_id'] = this.examineInfo.value[0].id
                  }
                  this.submiteParams(params)
                } else {
                  this.loading = false
                }
              })
            }
          } else {
            const params = this.getSubmiteParams(this.baseFields, this.fieldForm)
            if (isDraft) {
              params.is_draft = 1
            }
            this.submiteParams(params)
          }
        } else {
          this.loading = false
          // 提示第一个error
          this.getFormErrorMessage(crmForm)
          return false
        }
      })
    },

    /**
     * 提交上传
     */
    submiteParams(params) {
      if (this.action.type == 'update') {
        params.id = this.action.id
        params.batchId = this.action.batchId
      }

      // 相关添加时候的多余提交信息
      if (
        this.action.relativeData &&
        Object.keys(this.action.relativeData).length
      ) {
        params = { ...params, ...this.action.relativeData }
      }
      crmReceivablesSaveAPI(params)
        .then(res => {
          this.loading = false

          this.$message.success(
            this.action.type == 'update' ? '编辑成功' : '添加成功'
          )

          this.close()

          // 保存成功
          this.$emit('save-success', {
            type: 'receivables'
          })
        })
        .catch(() => {
          this.loading = false
        })
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
      ].includes(field.formType) &&
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
            } else {
              fieldItem.disabled = true
              fieldItem['relation'] = {}
            }
            this.fieldForm[fieldItem.field] = []
          } else if (fieldItem.form_type === 'receivables_plan') {
            fieldItem.disabled = true
            fieldItem['relation'] = {}
            this.fieldForm[fieldItem.field] = ''
          }
        })
      } else if (field.form_type === 'contract') {
        const planItem = this.getItemWithFromType(this.fieldList, 'receivables_plan')
        if (planItem) {
          if (data.value.length > 0) {
            planItem.disabled = false
            var contractItem = data.value[0]
            contractItem['moduleType'] = 'contract'
            planItem['relation'] = contractItem
          } else {
            planItem.disabled = true
            planItem['relation'] = {}
          }
          this.fieldForm[planItem.field] = ''
        }
      } else if (field.form_type === 'receivables_plan') {
        const dataValue = data.data || {}
        this.fieldForm.return_time = dataValue.return_date
        this.fieldForm.money = dataValue.money
        this.fieldForm.return_type = dataValue.return_type
      }
      this.$set(this.fieldForm, field.field, data.value)
      this.$refs.crmForm.validateField(field.field)
    },

    /**
     * 审批信息值更新
     */
    examineValueChange(data) {
      this.examineInfo = data
    },

    /**
     * 关闭
     */
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.wk-form {
  /deep/ .el-form-item.is-product {
    flex: 0 0 100%;
  }
}
</style>
