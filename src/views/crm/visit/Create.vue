<template>
  <xr-create
    :loading="loading"
    :title="title"
    @close="close"
    @save="saveClick">
    <create-sections title="基本信息">
      <wk-form
        ref="crmForm"
        :model="fieldForm"
        :rules="fieldRules"
        :field-from="fieldForm"
        :field-list="fieldList"
        label-position="top"
        @change="formChange"
      >
        <template slot-scope="{ data }">
          <crm-relative-cell
            v-if="data && data.formType == 'customer'"
            :value="fieldForm[data.field]"
            :disabled="data.disabled"
            relative-type="customer"
            @value-change="otherChange($event, data)"
          />
          <crm-relative-cell
            v-if="data && (data.formType == 'contract' || data.formType == 'contacts')"
            :value="fieldForm[data.field]"
            :disabled="data.disabled"
            :relation="data.relation"
            :relative-type="data.formType"
            @value-change="otherChange($event, data)"
          />
          <xh-product
            v-if="data && data.formType == 'product'"
            :value="fieldForm[data.field]"
            @value-change="otherChange($event, data)"
          />
        </template>
      </wk-form>
    </create-sections>
  </xr-create>
</template>

<script>
import { filedGetFieldAPI } from '@/api/crm/common'
import { crmReturnVisitSaveAPI } from '@/api/crm/visit'

import XrCreate from '@/components/XrCreate'
import CreateSections from '@/components/CreateSections'
import WkForm from '@/components/NewCom/WkForm'
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
    WkForm
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
        action: this.action.type
      }

      if (this.action.type == 'update') {
        params.action_id = this.action.id
      }

      filedGetFieldAPI(params)
        .then(res => {
          const list = res.data || []

          const fieldList = []
          const fieldRules = {}
          const fieldForm = {}
          list.forEach(item => {
            const temp = {}
            temp.field = item.field
            temp.formType = item.form_type
            temp.fieldId = item.fieldId
            temp.inputTips = item.input_tips
            temp.name = item.name
            temp.setting = item.setting
            temp.value = item.value

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
            if (temp.formType == 'contacts' ||
                temp.formType == 'contract' ||
                temp.formType == 'customer'
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
            fieldForm[temp.field] = this.getItemValue(item, this.action.data, this.action.type)
            fieldList.push(temp)
          })

          this.baseFields = list
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
      const crmForm = this.$refs.crmForm.instance
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
    },

    /**
     * 地址change
     */
    otherChange(data, field) {
      if (field.formType === 'customer') {
        this.fieldList.forEach(fieldItem => {
          if (fieldItem.formType === 'contract' || fieldItem.formType === 'contacts') {
            if (data.value.length > 0) {
              fieldItem.disabled = false
              const customerItem = data.value[0]
              customerItem['moduleType'] = 'customer'
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
      this.$refs.crmForm.instance.validateField(field.field)
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
