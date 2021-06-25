<template>
  <xr-create
    :loading="loading"
    :title="title"
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
              v-if="data && (data.form_type == 'contract' || data.form_type == 'contacts')"
              :value="fieldForm[data.field]"
              :disabled="data.disabled"
              :relation="data.relation"
              :relative-type="data.form_type"
              @value-change="otherChange($event, data)"
            />
            <xh-product
              v-if="data && data.form_type == 'product'"
              :value="fieldForm[data.field]"
              @value-change="otherChange($event, data)"
            />
          </template>
        </wk-form-items>
      </el-form>
    </create-sections>
  </xr-create>
</template>

<script>
import { filedGetFieldAPI } from '@/api/crm/common'
import { crmReturnVisitSaveAPI } from '@/api/crm/visit'

import XrCreate from '@/components/XrCreate'
import CreateSections from '@/components/CreateSections'
import WkFormItems from '@/components/NewCom/WkForm/WkFormItems'
import {
  CrmRelativeCell
} from '@/components/CreateCom'

import CustomFieldsMixin from '@/mixins/CustomFields'
import { objDeepCopy } from '@/utils'
// import { isEmpty } from '@/utils/types'

export default {
  // 新建编辑
  name: 'VisitCreate',

  components: {
    XrCreate,
    CreateSections,
    CrmRelativeCell,
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
      fieldRules: {}
    }
  },

  computed: {
    title() {
      return this.action.type === 'update' ? '编辑回访' : '新建回访'
    }
  },

  watch: {},

  created() {
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
        // label: crmTypeModel.visit
        types: 'crm_visit',
        module: 'crm',
        controller: 'visit',
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

              // 禁止某些业务组件选择 仅新建限制
              if (temp.form_type == 'contacts' ||
                temp.form_type == 'contract' ||
                temp.form_type == 'customer'
              ) {
                if (this.action.type == 'relative') {
                  const relativeDisInfos = {
                    customer: { customer: true },
                    contract: { customer: true, contract: true }
                  }

                  // 在哪个类型下添加
                  const relativeTypeDisInfos = relativeDisInfos[this.action.crmType]
                  if (relativeTypeDisInfos) {
                  // 包含的字段值
                    temp.disabled = relativeTypeDisInfos[item.form_type] || false
                  }
                } else if (this.action.type == 'save') {
                  temp.disabled = item.form_type === 'contract' || item.form_type === 'contacts'
                }
              }

              // 处理关联
              if (this.action.type == 'save') {
                if (item.form_type == 'contract') {
                  temp['relation'] = {}
                }
              }
              if (this.action.type == 'relative' || this.action.type == 'update') {
                const customerItem = this.getItemRelatveInfo(list, 'customer')
                if (customerItem) {
                  if (item.form_type == 'contacts') {
                    customerItem['moduleType'] = 'customer'
                    temp['relation'] = customerItem
                  } else if (item.form_type == 'contract') {
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
          const params = this.getSubmiteParams(this.baseFields, this.fieldForm)

          // this.submiteParams(params)
          if (this.action.type === 'update') {
            params.action_id = this.action.id
          }
          this.submiteParams(params)
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

      crmReturnVisitSaveAPI(params)
        .then(res => {
          this.loading = false

          this.$message.success(
            this.action.type == 'update' ? '编辑成功' : '添加成功'
          )

          this.close()

          // 保存成功
          this.$emit('save-success', {
            type: 'visit'
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
          if (fieldItem.form_type === 'contract' || fieldItem.form_type === 'contacts') {
            if (data.value.length > 0) {
              fieldItem.disabled = false
              const customerItem = data.value[0]
              customerItem['moduleType'] = 'customer'
              customerItem['params'] = { check_status: 2 }
              fieldItem['relation'] = customerItem
            } else {
              fieldItem.disabled = true
              fieldItem['relation'] = {}
              this.fieldForm[fieldItem.field] = []
            }
          }
        })
      }
      this.$set(this.fieldForm, field.field, data.value)
      this.$refs.crmForm.validateField(field.field)
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
