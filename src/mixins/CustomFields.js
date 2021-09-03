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
      if (item.form_type == 'contacts' ||
          item.form_type == 'customer' ||
          item.form_type == 'contract' ||
          item.form_type == 'business'
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
      } else if (
        item.form_type == 'user' ||
        item.form_type == 'structure' ||
        item.form_type == 'file'
      ) {
        if (type === 'update') {
          return item.value ? objDeepCopy(item.value) : []
        } else {
          return (item.default_value && !!item.default_value)
            ? objDeepCopy(item.default_value)
            : []
        }
      } else {
        if (
          item.form_type == 'number' ||
          item.form_type == 'floatnumber' ||
          item.form_type == 'percent'
        ) {
          if (type == 'update') {
            return isEmpty(item.value) ? undefined : item.value
          } else {
            return isEmpty(item.default_value) ? undefined : item.default_value
          }
        } else if (item.form_type == 'detail_table' || item.form_type == 'detail_table') {
          const baseFieldList = item.value || [item.fieldExtendList]
          // 二维数组
          const tableValue = []
          baseFieldList.forEach(bigItem => {
            const subForm = {}
            tableValue.push(subForm)
            bigItem.forEach(subItem => {
              // 未转换 取 field 值
              if ([
                'select',
                'checkbox'
              ].includes(subItem.form_type)) {
                subItem.optionsData = null
              }
              subForm[subItem.field] = this.getItemValue(subItem, null, type)
            })
          })
          return tableValue
        } else {
          if (type == 'update') {
            return item.value || ''
          } else {
            return item.default_value || ''
          }
        }
      }
    },

    /**
     * 验证唯一
     */
    getUniquePromise(field, value, detail) {
      return new Promise((resolve, reject) => {
        // var validatesParams = {}
        // validatesParams.field_id = field.field_id
        // if (isArray(value)) {
        //   let postValue = ''
        //   if (value.length > 0) {
        //     if (
        //       field.form_type == 'user' ||
        //           field.form_type == 'structure'
        //     ) {
        //       postValue = value
        //         .map(valueItem => {
        //           return field.form_type == 'user'
        //             ? valueItem.userId
        //             : valueItem.id
        //         })
        //         .join(',')
        //     } else if (field.field == 'categoryId') {
        //       if (value && value.length) {
        //         postValue = value[value.length - 1]
        //       } else {
        //         postValue = ''
        //       }
        //     } else if (field.form_type == 'checkbox') {
        //       postValue = value.join(',')
        //     }
        //   }
        //   validatesParams.val = postValue
        // } else {
        //   validatesParams.val = value
        //   validatesParams.types = field.types
        //   validatesParams.field = field.field
        // }
        // if (detail.type == 'update') {
        //   validatesParams.id = detail.action_id || detail.id
        // }
        var validatesParams = {}
        validatesParams.field_id = field.field_id
        validatesParams.val = this.getRealParams(field, value)
        validatesParams.types = field.types
        validatesParams.field = field.field
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
     * 获取字段默认内容
     */
    getFormItemDefaultProperty(item, isCopy = true) {
      const temp = isCopy ? objDeepCopy(item) : item
      temp.field = item.field
      temp.field = item.field

      // 细化 precisions
      if ((item.form_type || item.form_type) === 'date_interval') {
        // 1 日期  2 时间日期
        if (item.precisions === 2) {
          temp.dateType = 'datetimerange'
          temp.dateValueFormat = 'yyyy-MM-dd HH:mm:ss'
        } else {
          temp.dateType = 'daterange'
          temp.dateValueFormat = 'yyyy-MM-dd'
        }
      } else if ((item.form_type || item.form_type) === 'position') {
        // 1 省/地区、市、区/县、详细地址 2 省/地区、市、区/县
        // 3 省/地区、市 4 省/地区
        temp.showDetail = item.precisions === 1
        temp.hideArea = item.precisions === 3 || item.precisions === 4
        temp.onlyProvince = item.precisions === 4
      } else if ((item.form_type || item.form_type) === 'detail_table') {
        // 校准默认单元数据
        // authLevel 1 不能查看不能编辑 2可查看  3 可编辑可查看
        const fieldForm = {}
        temp.fieldExtendList.forEach(extendItem => {
          const copyExtendItem = objDeepCopy(extendItem)
          this.getFormItemDefaultProperty(extendItem, false)
          extendItem.show = extendItem.is_hidden !== 1
          if (extendItem.show) {
            extendItem.rules = this.getRules(copyExtendItem)
          }
          this.getItemRadio(extendItem, extendItem)
          fieldForm[extendItem.field] = this.getItemValue(extendItem)
        })
        temp.fieldForm = fieldForm // 用于追加新事项

        const fieldExtendList = objDeepCopy(item.fieldExtendList)
        const baseFieldList = isEmpty(item.value) ? [fieldExtendList] : item.value
        // 二维数组
        const tableFieldList = []
        baseFieldList.forEach(bigItem => {
          const subValue = []
          bigItem.forEach(subItem => {
            const copySubItem = objDeepCopy(subItem)
            const subTemp = this.getFormItemDefaultProperty(subItem, false)
            // 特殊字段允许多选
            this.getItemRadio(subItem, subTemp)
            subTemp.show = subTemp.is_hidden !== 1
            if (subTemp.show) {
              subTemp.rules = this.getRules(copySubItem)
            }
            subValue.push(subTemp)
          })
          tableFieldList.push(subValue)
        })
        temp.fieldList = tableFieldList
      }
      return temp
    },

    /**
     * 获取二维数组字段
     * @param {*} array
     * @param {*} form_type
     */
    getItemWithFromType(array, form_type) {
      let item = null
      for (let index = 0; index < array.length; index++) {
        const children = array[index]
        for (let childIndex = 0; childIndex < children.length; childIndex++) {
          const element = children[childIndex]
          if (element.form_type === form_type) {
            item = element
            break
          }
        }

        if (item) {
          break
        }
      }

      return item
    },

    /**
     * 循环二维数组
     * @param {*} array
     * @param {*} result
     */
    itemsForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        const children = array[index]
        for (let childIndex = 0; childIndex < children.length; childIndex++) {
          const element = children[childIndex]
          callback(element, index, childIndex, children)
        }
      }
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
      if (field.form_type == 'single_user') {
        data.radio = true
      } else if (field.form_type == 'user' || field.form_type == 'structure' || field.form_type == 'user' || field.form_type == 'structure') {
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
        const childIsArray = list.length > 0 && isArray(list[0])
        const crmObj = childIsArray ? this.getItemWithFromType(list, fromType) : list.find(listItem => {
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
      // var params = { address: [] }
      var params = {}
      for (let index = 0; index < array.length; index++) {
        const field = array[index]
        let dataValue = null
        if (field.hasOwnProperty('show')) {
          dataValue = field.show ? data[field.field] : null
        } else {
          dataValue = data[field.field]
        }
        if (field.form_type == 'product') {
          this.getProductParams(params, dataValue)
        } else if (field.form_type == 'map_address') {
          this.getCustomerAddressParams(params, dataValue)
        } else if (field.field_type == 1) {
          const fieldValue = this.getRealParams(field, dataValue)
          params[field.field] = isEmpty(fieldValue) ? '' : fieldValue
        } else if (field.form_type !== 'desc_text') { //  描述文字忽略
          field.value = this.getRealParams(field, dataValue, data)
          params[field.field] = field.value
          // params.field.push({
          //   field: field.field,
          //   field_type: field.field_type,
          //   name: field.name,
          //   type: field.type,
          //   field_id: field.field_id,
          //   value: this.getRealParams(field, dataValue)
          // })
        }
        //  else {
        //   field.value = this.getRealParams(field, dataValue, data)
        //   params[field.field] = field.value
        // }
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
      params['address'] = (dataValue.address && dataValue.address.filter(item => item).length > 0)
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
        // if (isArray(dataValue)) {
        //   return dataValue.join(',')
        // }
        return dataValue
      } else if (field.form_type == 'date') {
        if (dataValue) {
          return dataValue
        }
        // delete data[field.field]
        return ''
      } else if (field.form_type == 'datetime') {
        if (dataValue) {
          return moment(dataValue).unix()
        }
        // delete data[field.field]
        return ''
      } else if (field.form_type == 'number') {
        if (dataValue) {
          return dataValue
        }
        return ''
      } else if (field.form_type == 'detail_table') {
        const fieldExtendList = field.fieldExtendList || []
        const values = []
        const tableValues = Array.isArray(dataValue) ? dataValue : []

        for (let tableValueIndex = 0; tableValueIndex < tableValues.length; tableValueIndex++) {
          const tableValue = tableValues[tableValueIndex]
          // 去除空值数据
          if (!this.getFormValueIsEmpty(fieldExtendList, tableValue)) {
            const valuesItems = []
            fieldExtendList.forEach(tableField => {
              const copyTableField = objDeepCopy(tableField)
              delete copyTableField.companyId
              copyTableField.value = this.getRealParams(copyTableField, tableValue[copyTableField.field])
              valuesItems.push(copyTableField)
            })
            values.push(valuesItems)
          }
        }

        return values
      }

      return dataValue
    },
    /**
     * 判断对象值是否是空
     */
    getFormValueIsEmpty(fieldList, valueObj) {
      for (let index = 0; index < fieldList.length; index++) {
        const field = fieldList[index]
        const value = valueObj[field.field]
        // if (field.form_type === 'select' || field.form_type === 'checkbox') {
        //   if (isObject(value) && !isEmpty(value.select)) {
        //     return false
        //   }
        // } else if (field.form_type === 'location') {
        if (field.form_type === 'location') {
          if (isObject(value) && (!isEmpty(value.lat) || !isEmpty(value.lng) || !isEmpty(value.address))) {
            return false
          }
        } else if (!isEmpty(value)) {
          return false
        }
      }
      return true
    },
    /**
     * 获取逻辑表单隐藏id
     */
    getFormAssistIds(list, valueObj) {
      let allIds = []
      list.forEach(items => {
        items.forEach(item => {
          if ([
            'select',
            'checkbox'
          ].includes((item.form_type || item.form_type)) &&
          item.remark === 'options_type' &&
          item.optionsData) {
            for (const key in item.optionsData) {
              allIds = allIds.concat(item.optionsData[key] || [])
            }
          }
        })
      })

      allIds = allIds.filter(o => Boolean(o))
      allIds = Array.from(new Set(allIds))

      const ignoreIds = []
      this.getFormAssistData(list, valueObj, allIds, ignoreIds)
      return allIds.filter(o => !ignoreIds.includes(o))
    },

    /**
     * 获取信息
     */
    getFormAssistData(list, valueObj, allIds, ignoreIds) {
      // let ignorIds = []
      const ignoreLength = ignoreIds.length
      list.forEach(items => {
        items.forEach(item => {
          if ([
            'select',
            'checkbox'
          ].includes((item.form_type || item.form_type)) &&
          item.remark === 'options_type' &&
          item.optionsData) {
            let value = valueObj ? valueObj[item.field || item.field] : item.value
            if (!allIds.includes(item.formAssistId)) {
              if ((item.form_type || item.form_type) === 'select') {
                if (isEmpty(value)) {
                  value = []
                } else {
                  value = item.setting.includes(value) ? [value] : ['其他']
                }
              } else if ((item.form_type || item.form_type) === 'checkbox') {
                if (isArray(value)) {
                  const copyValue = objDeepCopy(value)
                  const otherItem = copyValue.filter((name) => !item.setting.includes(name))
                  if (otherItem.length > 0) {
                    const newValue = copyValue.filter((name) => !otherItem.includes(name))
                    newValue.push('其他')
                    value = newValue
                  }
                } else {
                  value = []
                }
              }

              for (const key in item.optionsData) {
                if (value && value.includes(key)) {
                  const keyValue = item.optionsData[key] || []
                  for (let index = 0; index < keyValue.length; index++) {
                    const id = keyValue[index]
                    if (!ignoreIds.includes(id)) {
                      ignoreIds.push(id)
                    }
                  }
                }
              }
            }
          }
        })
      })

      if (ignoreLength !== ignoreIds.length) {
        const newAllIds = allIds.filter(o => !ignoreIds.includes(o))
        this.getFormAssistData(list, valueObj, newAllIds, ignoreIds)
      }
    },

    /**
     * 获取表单展示内容
     * data 用于相关模块新建填充模块值
     * type 新建编辑
     */
    getFormContentByOptionsChange(fieldList, formObj, rules = {}, data = {}, type) {
      const allFieldRules = this.fieldRules || rules
      const actionData = this.action && this.action.data ? this.action.data : data
      const actionType = this.action && this.action.type ? this.action.type : type

      const fieldRules = {}
      const fieldForm = {}

      // 依据最新的值，获取隐藏的ids
      const assistIds = this.getFormAssistIds(fieldList, formObj)
      this.itemsForEach(fieldList, fieldItem => {
        fieldItem.show = !assistIds.includes(fieldItem.formAssistId)
        // 展示 并且 允许编辑，加入验证规则
        if (fieldItem.show && !fieldItem.disabled) {
          if (allFieldRules[fieldItem.field]) {
            fieldRules[fieldItem.field] = allFieldRules[fieldItem.field]
          } else {
            fieldRules[fieldItem.field] = this.getRules(fieldItem)
          }
        }

        // 值获取
        if (fieldItem.show) {
          if (formObj[fieldItem.field]) {
            fieldForm[fieldItem.field] = formObj[fieldItem.field]
          } else {
            fieldForm[fieldItem.field] = this.getItemValue(fieldItem, actionData, actionType)
          }
        }
      })

      return {
        fieldForm,
        fieldRules
      }
    }

  }
}
