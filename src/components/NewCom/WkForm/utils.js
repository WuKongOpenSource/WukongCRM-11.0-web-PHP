import { isArray, isObject, isEmpty } from '@/utils/types'
import CheckStatusMixin from '@/mixins/CheckStatusMixin'
import CustomFieldsMixin from '@/mixins/CustomFields'
import { separator } from '@/filters/vueNumeralFilter/filters'
import { getWkDateTime } from '@/utils'

/**
 * 获取自定义字段展示值
 * @param {*} form_type
 * @param {*} value
 * @param {*} placeholder
 * @param {*} item 自定义字段模型
 * @returns 字符串
 */
export function getFormFieldShowName(form_type, value, placeholder = '--', item) {
  if (form_type === 'position') {
    return isArray(value) ? value.map(item => item.name).join() : placeholder
  } else if (form_type === 'floatnumber') {
    return isEmpty(value) ? '' : separator(value)
  } else if (form_type === 'date') {
    return getWkDateTime(value)
  } else if (form_type === 'location') {
    return isObject(value) ? value.address : placeholder
  } else if (form_type === 'date_interval') {
    return isArray(value) ? value.join('-') : placeholder
  } else if (form_type === 'percent') {
    return isEmpty(value) ? placeholder : `${value}%`
  } else if (form_type === 'single_user') {
    if (isObject(value)) {
      return value.realname || placeholder
    }
    return value || placeholder
  } else if (form_type === 'select') {
    const newValue = CustomFieldsMixin.methods.getRealParams({ form_type }, value)
    if (isEmpty(newValue)) {
      return placeholder
    } else {
      return newValue
    }
  } else if (form_type === 'checkbox') {
    const newValue = CustomFieldsMixin.methods.getRealParams({ form_type }, value)
    if (isEmpty(newValue)) {
      return placeholder
    } else {
      if (isArray(newValue)) {
        return newValue.join(',')
      } else {
        return newValue
      }
    }
  } else if (form_type === 'structure') {
    if (isArray(value)) {
      return value.map(item => item.name).join() || placeholder
    }
    return value || placeholder
  } else if (form_type === 'user') {
    if (isArray(value)) {
      return value.map(item => item.realname).join() || placeholder
    }
    return value || placeholder
  } else if (form_type === 'check_status') {
    return CheckStatusMixin.methods.getStatusName(value)
  }

  return isEmpty(value) ? placeholder : value
}
