export default {
  methods: {
    /**
     * 判断是否为普通 整句 文本框
     * @param form_type 字段类型
     */
    isTrimInput(form_type) {
      return [
        'mobile',
        'email',
        'website'
      ].includes(form_type)
    },
    /**
     * 部门事件
     */
    depOrUserChange(item, index, value, valueList) {
      this.$emit('change', item, index, value, valueList)
    },

    /**
     * 常规组件change事件
     */
    commonChange(item, index, value) {
      this.$emit('change', item, index, value)
    },

    /**
     * 判断是空值
     */
    isEmptyValue(value) {
      return value === null || value == undefined
    },

    /**
     * 旧change回调
     */
    oldChange(dataValue, field, index) {
      this.$set(this.fieldFrom, field.field, dataValue.value)
      this.$emit('change', field, index, dataValue.value)
      // this.$refs.form.validateField(field.field)
      if (this.$refs.form) {
        this.$refs.form.validateField(field.field)
      }
    },

    /**
     * 选择省市区
     */
    selectProvince(data, item, index) {
      this.fieldFrom[item.field].province = data.value
      this.addressChange(item, index, data, this.fieldFrom[item.field])
    },

    selectCity(data, item, index) {
      this.fieldFrom[item.field].city = data.value
      this.addressChange(item, index, data, this.fieldFrom[item.field])
    },

    selectArea(data, item, index) {
      this.fieldFrom[item.field].area = data.value
      this.addressChange(item, index, data, this.fieldFrom[item.field])
    },

    addressChange(item, index, value) {
      this.$emit('change', item, index, value)
    },

    /**
     * 获取提示语
     */
    getTips(data) {
      const tips = data.tips || data.input_tips
      return tips ? `（${tips}）` : ''
    },
    /**
     * 判断展示
     */
    getShowValue(item) {
      if (item.hasOwnProperty('show')) {
        return item.show
      }
      return true
    },
    /**
     * 获取类型图标
     * @param {*} formType
     */
    getInputIcon(formType) {
      return {
        mobile: 'wk wk-icon-mobile',
        email: 'wk wk-icon-email-outline',
        website: 'wk wk-icon-link'
      }[formType]
    },
    /**
     * 获取输入最大长度
     * @param {*} formType
     */
    getInputMaxlength(formType) {
      if (formType === 'website') {
        return 800
      }
      return 100
    }
  }
}
