import { filedValidatesAPI } from '@/api/crm/common'

import { isArray, isEmpty, isObject } from '@/utils/types'
import { objDeepCopy } from '@/utils'
import GenerateRulesMixin from '@/components/NewCom/WkForm/GenerateRules'
import moment from 'moment'
export default {
  mixins: [GenerateRulesMixin],

  props: {},

  methods: {
    /**
     * 获取初始value值
     * detail 主要用于关联模块
     * type update 读取 value 判断 save 读取 default_value 判断
     */
    getItemValue(item, detail, type) {
      detail = detail || {}
      if ((item.formType || item.form_type) == 'contacts' ||
          (item.formType || item.form_type) == 'customer' ||
          (item.formType || item.form_type) == 'contract' ||
          (item.formType || item.form_type) == 'business'
      ) {
        // crm相关信息特殊处理
        if (type === 'update') {
          return item.value ? objDeepCopy(item.value) : []
        } else {
          const relativeData = detail[item.form_type]
          return relativeData ? [relativeData] : []
        }
      } else if (item.form_type == 'category' || item.form_type == 'category') {
        // 产品类别
        return item.value ? item.value.map(item => parseInt(item)) : []
        // return item.value ? item.value : ''
      } else if (item.form_type == 'product' || item.form_type == 'product') {
        // 关联产品
        return item.value
      } else if (item.form_type == 'map_address' || item.form_type == 'map_address') {
        if (type == 'update') {
          if (item.value.address) {
            item.value.address = item.value.address.length == 0 ? '' : item.value.address
          }
          return item.value
        } else {
          return {}
        }
      } else if (item.form_type == 'single_user') {
        if (type === 'update') {
          return isObject(item.value) && item.value.id
            ? item.value.id
            : ''
        } else {
          return isObject(item.default_value) && item.default_value.id
            ? objDeepCopy(item.default_value.id)
            : ''
        }
      } else if (item.form_type == 'user' ||
            item.form_type == 'structure' ||
            item.form_type == 'file' ||
            item.formType == 'user' ||
            item.formType == 'structure' ||
            item.formType == 'file'
      ) {
        if (type === 'update') {
          return item.value ? objDeepCopy(item.value) : []
        } else {
          return (item.default_value && !!item.default_value)
            ? objDeepCopy(item.default_value)
            : []
        }
      } else {
        if (type == 'update') {
          return item.value || ''
        } else {
          return item.default_value || ''
        }
      }
    },

    /**
     * 验证唯一
     */
    getUniquePromise(field, value, detail) {
      return new Promise((resolve, reject) => {
        var validatesParams = {}
        validatesParams.fieldId = field.fieldId
        if (isArray(value)) {
          let postValue = ''
          if (value.length > 0) {
            if (
              field.formType == 'user' ||
                  field.formType == 'structure'
            ) {
              postValue = value
                .map(valueItem => {
                  return field.formType == 'user'
                    ? valueItem.userId
                    : valueItem.id
                })
                .join(',')
            } else if (field.fieldName == 'categoryId') {
              if (value && value.length) {
                postValue = value[value.length - 1]
              } else {
                postValue = ''
              }
            } else if (field.formType == 'checkbox') {
              postValue = value.join(',')
            }
          }
          validatesParams.val = postValue
        } else {
          validatesParams.val = value
          validatesParams.types = field.types
          validatesParams.field = field.field
        }
        if (detail.type == 'update') {
          validatesParams.id = detail.action_id || detail.id
        }

        filedValidatesAPI(validatesParams).then(res => {
          // status 1 通过 0
          const resData = res || {}
          if (res.code === 200) {
            resolve()
          } else {
            if (resData.ownerUserName) {
              reject(`${field.name}已存在，负责人为“${resData.ownerUserName}”`)
            } else if (resData.poolNames && resData.poolNames.length > 0) {
              reject(`${field.name}已存在，当前位于公海“${resData.poolNames.join('，')}”`)
            } else {
              reject(`${field.name}已存在`)
            }
          }
        }).catch(() => {
          reject(`${field.name}已存在`)
        })
      })
    },

    /**
     * 获取字段是否可编辑
     */
    getItemIsCanEdit(item, type) {
      // authLevel 1 不能查看不能编辑 2可查看  3 可编辑可查看
      // return (type === 'update' && item.authLevel == 3) || type !== 'update'
      // return (type === 'update' && item.writeStatus === 1) || type !== 'update'
      return item.writeStatus === 1
    },

    /**
     * user single_user structure
     */
    getItemRadio(field, data) {
      if (field.formType == 'single_user') {
        data.radio = true
      } else if (field.formType == 'user' || field.formType == 'structure' || field.form_type == 'user' || field.form_type == 'structure') {
        data.radio = false
      }
    },

    /**
     * 获取error错误
     */
    getFormErrorMessage(crmForm) {
      // 提示第一个error
      if (crmForm.fields) {
        for (
          let index = 0;
          index < crmForm.fields.length;
          index++
        ) {
          const ruleField = crmForm.fields[index]
          if (ruleField.validateState == 'error') {
            this.$message.error(ruleField.validateMessage)
            break
          }
        }
      }
    },

    /**
     * 获取相关联item
     */
    getItemRelatveInfo(list, fromType) {
      let crmItem = null
      if (this.action.type == 'relative') {
        crmItem = this.action.data[fromType]
      } else {
        const crmObj = list.find(listItem => {
          return listItem.form_type === fromType
        })
        if (crmObj && crmObj.value && crmObj.value.length > 0) {
          crmItem = crmObj.value[0]
        }
      }
      return crmItem
    },

    /**
     * 获取提交参数
     */
    getSubmiteParams(array, data) {
      var params = { address: [] }
      for (let index = 0; index < array.length; index++) {
        const field = array[index]
        if (field.form_type == 'product') {
          this.getProductParams(params, data[field.field])
        } else if (field.form_type == 'map_address') {
          this.getCustomerAddressParams(params, data[field.field])
        } else if (field.field_type == 1) {
          const fieldValue = this.getRealParams(field, data[field.field])
          params[field.field] = isEmpty(fieldValue) ? '' : fieldValue
        } else {
          field.value = this.getRealParams(field, data[field.field], data)
          params[field.field] = field.value
        }
      }
      return params
    },

    /**
     * 获取产品提交参数
     */
    getProductParams(params, dataValue) {
      if (dataValue) {
        params['product'] = dataValue.product ? dataValue.product.map(item => {
          item.sales_price = item.sales_price == '' ? 0 : item.sales_price
          item.num = item.num == '' ? 0 : item.num
          item.discount = item.discount == '' ? 0 : item.discount
          item.product_id = item.product_id || ''
          item.category_id_info = item.categoryName || '默认'
          return item
        }) : []
        params['total_price'] = dataValue.total_price
          ? dataValue.total_price
          : 0
        params['discount_rate'] = dataValue.discount_rate
          ? dataValue.discount_rate
          : 0
      } else {
        params['product'] = []
        params['total_price'] = ''
        params['discount_rate'] = ''
      }
    },

    /**
     * 获取客户位置提交参数
     */
    getCustomerAddressParams(params, dataValue) {
      params['address'] = dataValue.address
        ? dataValue.address
        : ''
      params['detail_address'] = dataValue.detail_address
      params['location'] = dataValue.location
      params['lng'] = dataValue.lng
      params['lat'] = dataValue.lat
    },

    /**
     * 关联客户 联系人等数据要特殊处理
     */
    getRealParams(field, dataValue, data) {
      if (
        field.field == 'customer_id' ||
        field.field == 'contacts_id' ||
        field.field == 'business_id' ||
        field.field == 'leads_id' ||
        field.field == 'contract_id') {
        if (dataValue && dataValue.length) {
          return dataValue[0][field.field]
        } else {
          return ''
        }
      } else if (
        field.form_type == 'user' ||
        field.form_type == 'structure'
      ) {
        return dataValue ? dataValue.join(',') : ''
      } else if (field.form_type == 'file') {
        if (dataValue && dataValue.length > 0) {
          return dataValue.map(item => item.file_id)
        }
        return []
      } else if (field.form_type == 'category') {
        if (dataValue && dataValue.length > 0) {
          return dataValue[dataValue.length - 1]
        }
        return ''
      } else if (field.form_type == 'checkbox') {
        if (dataValue && dataValue.length > 0) {
          return dataValue.join(',')
        }
        return ''
      } else if (field.form_type == 'date') {
        if (dataValue) {
          return dataValue
        }
        delete data[field.field]
        return
      } else if (field.form_type == 'datetime') {
        if (dataValue) {
          return moment(dataValue).unix()
        }
        delete data[field.field]
        return
      }

      return dataValue
    }

  }
}
