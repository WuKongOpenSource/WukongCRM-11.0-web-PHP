class Field {
  constructor(obj) {
    // this.field_type = 0 // 新增字段默认加入0 1是系统字段 2 客户行业 级别 来源 等 3 特殊
    this.field_id = obj.field_id || '' //  字段id  1
    this.name = obj.name || '' //  标识名  1
    this.form_type = obj.form_type || '' // 字段类型  1
    this.is_unique = obj.is_unique || false // 是否唯一
    this.is_null = obj.is_null || false // 是否必填
    this.is_hidden = obj.is_hidden || false // 是否隐藏字段
    this.input_tips = obj.input_tips || '' // 输入提示
    if (this.form_type === 'textarea') {
      this.max_length = obj.max_length || 1000 // textarea 多行文本有最大数量
    }

    if (this.form_type === 'checkbox') {
      this.default_value = obj.default_value || []
    } else {
      this.default_value = obj.default_value || ''
    }

    // 表格的特殊处理
    if (this.form_type === 'form') {
      this.formValue = obj.formValue || [] // 内部布局
    }

    this.setting = obj.setting || [] // 单选选项
    this.showSetting = obj.showSetting || [] // 单选选项
    this.componentName = '' // 组件名字
    // this.isDeleted = 0 // 是删除标示这个字段是无效的 1是无效的
  }

  // 校验数据
  check() {
    if (this.name === '') {
      return '字段名称不能为空'
    }
    return ''
  }
}

export default Field
