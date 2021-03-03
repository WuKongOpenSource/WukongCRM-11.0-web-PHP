<template>
  <div class="field-info-section">
    <div class="item-section">
      <div class="name">
        标识名
      </div>
      <el-input
        v-model="field.name"
        :disabled="disabled"/>
      <div class="input-tips"><span>*</span>标识名不能为空</div>
    </div>
    <div class="item-section">
      <div class="name">
        提示文字
      </div>
      <el-input
        v-model="field.input_tips"
        :rows="3"
        :disabled="disabled"
        type="textarea"
        resize="none"/>
      <div class="input-tips"><span>*</span>显示在标识名右侧的说明文字</div>
    </div>

    <div
      v-if="showSelect"
      class="item-section">
      <div class="name">
        选项设置<span v-if="field.field == 'level'" class="field-tips">（若公海规则启用了“根据客户级别设置”，调整选项后，请同步调整公海规则，否则公海规则将失效）</span>
      </div>
      <el-radio-group
        v-if="field.form_type == 'select'"
        ref="radioGroup"
        v-model="field.default_value"
        :disabled="disabled">
        <draggable
          :list="field.showSetting"
          :options="{group: 'list',forceFallback:false, fallbackClass:'draggingStyle',filter: '.el-input__inner', preventOnFilter: false}" >
          <div
            v-for="(item, index) in field.showSetting"
            :key="index"
            class="radio cursor-move">
            <el-radio
              :label="item.value"
              @click.native.prevent="radioChange(item.value)">
              <el-input
                v-model="item.value"
                :disabled="disabled"
                class="input"
                @focus="radioInputChange(field)"
                @blur="radioInputChange(field)"/>
            </el-radio>
            <i
              class="el-icon-circle-plus handle"
              @click="handleRadio('add', item, index)"/>
            <i
              v-if="field.showSetting.length > 1"
              class="el-icon-remove handle"
              @click="handleRadio('remove', item, index)"/>
          </div>
        </draggable>
      </el-radio-group>
      <el-checkbox-group
        v-if="field.form_type == 'checkbox'"
        v-model="field.default_value"
        :disabled="disabled">
        <draggable
          :list="field.showSetting"
          :options="{group: 'list',forceFallback:false, fallbackClass:'draggingStyle',filter: '.el-input__inner', preventOnFilter: false}" >
          <div
            v-for="(item, index) in field.showSetting"
            :key="index"
            class="checkbox cursor-move">
            <el-checkbox :label="item.value"/>
            <el-input
              v-model="item.value"
              :disabled="disabled"
              class="input"
              @focus="checkboxInputChange(field)"
              @blur="checkboxInputChange(field)"/>
            <i
              class="el-icon-circle-plus handle"
              @click.stop="handleCheckbox('add', item, index)"/>
            <i
              v-if="field.showSetting.length > 1"
              class="el-icon-remove handle"
              @click.stop="handleCheckbox('remove', item, index)"/>
          </div>

        </draggable>
      </el-checkbox-group>
    </div>

    <div
      v-if="showDefaultValue&&!isUserStructure"
      class="item-section">
      <div class="name">
        默认值
      </div>
      <el-input
        v-if="!showDatepicker"
        v-model="field.default_value"
        :disabled="disabled"
        @blur="inputBlur"/>
      <el-date-picker
        v-if="showDatepicker"
        v-model="field.default_value"
        :disabled="disabled"
        :type="field.form_type == 'date' ? 'date' : 'datetime'"
        :value-format="field.form_type == 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"
        placeholder="选择日期"/>
      <div
        v-if="defaultTips"
        class="input-tips"><span>*</span>{{ defaultTips }}</div>
    </div>

    <div
      v-if="showMaxInput"
      class="item-section">
      <div class="name">
        字数上限
      </div>
      <el-input
        v-model="field.maxLength"
        :maxlength="4"
        :disabled="disabled"/>
      <div class="input-tips"><span>*</span>上限为2000字</div>
    </div>

    <div
      v-if="canTransform && transformData && transformData[field.form_type]"
      class="item-section">
      <div class="name">
        转化客户字段
      </div>
      <el-select
        v-model="field.relevant"
        clearable>
        <el-option
          v-for="item in transformData[field.form_type]"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
    </div>

    <div class="item-check-section">
      <el-checkbox
        v-model="field.is_null"
        :disabled="disabled"
        @change="inNullChange">设为必填</el-checkbox>
    </div>
    <div
      v-if="canUnique"
      class="item-check-section">
      <el-checkbox
        v-model="field.is_unique"
        :disabled="disabled">设为唯一</el-checkbox>
    </div>
    <div
      v-if="showHidden"
      class="item-check-section">
      <el-checkbox
        v-model="field.is_hidden"
        :disabled="disabled || isDisabledHidden">隐藏字段</el-checkbox>
    </div>
    <!-- <div
      v-if="field.fieldType == 1"
      class="item-check-section">
      <el-checkbox
        v-model="field.is_unique"
        :disabled="hiddenDisabled">隐藏字段</el-checkbox>
      <el-tooltip
        :content="hiddenTips"
        effect="dark"
        placement="top">
        <i class="wk wk-help wk-help-tips"/>
      </el-tooltip>
    </div> -->
  </div>
</template>
<script type="text/javascript">
import draggable from 'vuedraggable'
import { regexIsCRMMobile, regexIsCRMEmail } from '@/utils'

export default {
  name: 'FieldInfo', // 自定义字段 字段详情
  components: {
    draggable
  },
  props: {
    // 单个字段详情
    field: {
      type: Object,
      default: () => {
        return {
          name: '', //  标识名
          form_type: '', // 字段类型
          is_unique: false, // 是否唯一
          is_null: false, // 是否必填
          is_hidden: false, // 是否隐藏字段
          input_tips: '', // 输入提示
          maxLength: '', // textarea 多行文本有最大数量
          default_value: '', // 默认值
          setting: '', // 接口返回setting数据
          showSetting: '', // 单选选项
          relevant: '' // 转移字段
        }
      }
    },
    // 是否开启转移  转移对应数据
    canTransform: Boolean,
    transformData: Object,
    // 是否能设置唯一
    canUnique: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {
    defaultTips() {
      if (this.field.form_type == 'floatnumber') {
        return '货币的整数部分须少于15位，小数部分须少于2位'
      } else if (this.field.form_type == 'number') {
        return '数字的整数部分须少于15位，小数部分须少于4位'
      }
      return ''
    },
    // 是否展示隐藏操作
    showHidden() {
      return this.$route.params.type !== 'oa_examine' // 办公审批不展示隐藏操作
    },
    /** 展示最大输入 */
    showMaxInput() {
      if (this.field.form_type == 'textarea') {
        return true
      }
    },
    /** 展示默认值块 */
    showDefaultValue() {
      if (
        this.field.form_type == 'select' ||
        this.field.form_type == 'checkbox'
      ) {
        return false
      }
      return true
    },
    /** 展示单选多选 */
    showSelect() {
      if (
        this.field.form_type == 'select' ||
        this.field.form_type == 'checkbox'
      ) {
        return true
      }
      return false
    },
    /** 展示时间选择 */
    showDatepicker() {
      if (this.field.form_type == 'date' || this.field.form_type == 'datetime') {
        return true
      }
      return false
    },
    /** 控制人员和部分不展示默认值 */
    isUserStructure() {
      if (this.field.form_type == 'user' || this.field.form_type == 'structure') {
        return true
      }
      return false
    },
    /** 只读 */
    disabled() {
      // operating 0 改删 1改 2删 3无
      if (this.field.operating == 2 || this.field.operating == 3) {
        return true
      }
      return false
    },
    /**
     * 控制是否可隐藏系统字段
     */
    hiddenDisabled() {
      return this.field.fieldType != 1 || this.field.is_null == 1
    },

    hiddenTips() {
      return this.field.is_null == 1 ? '该字段为必填字段不可设置为隐藏' : '该字段为非必填字段，设置为隐藏字段后新建时将不显示该字段'
    },

    /**
     * 禁用隐藏操作
     * 1: 'leads',
     * 2: 'customer',
     * 3: 'contacts',
     * 4: 'product',
     * 5: 'business',
     * 6: 'contract',
     * 7: 'receivables',
     * 8: 'receivables_plan',
     * 9: 'pool',
     * 17: 'visit',
     * 18: 'invoice'
     */
    isDisabledHidden() {
      if (this.field.types == 'crm_leads') {
        return ['leads_id', 'leads_name', 'name'].includes(this.field.field)
      } else if (this.field.types == 'crm_customer') {
        return ['customer_name', 'name'].includes(this.field.field)
      } else if (this.field.types == 'crm_contacts') {
        return ['name'].includes(this.field.field)
      } else if (this.field.types == 'crm_product') {
        return ['name', 'category_id', 'price', 'status', 'num'].includes(this.field.field)
      } else if (this.field.types == 'crm_business') {
        return ['business_name', 'name'].includes(this.field.field)
      } else if (this.field.types == 'crm_contract') {
        return ['customer_id', 'business_id', 'num', 'money', 'order_date'].includes(this.field.field)
      } else if (this.field.types == 'crm_receivables') {
        return ['number', 'plan_id'].includes(this.field.field)
      } else if (this.field.types == 'crm_visit') {
        return ['customer_id', 'contract_id', 'number'].includes(this.field.field)
      }
    }
  },
  watch: {
    field() {
      if (this.showSelect && this.field.showSetting.length == 0) {
        this.field.showSetting = [
          { value: '选1' },
          { value: '选2' },
          { value: '选3' }
        ]
      }
    }
  },
  mounted() {
    if (this.showSelect && this.field.showSetting.length == 0) {
      this.field.showSetting = [
        { value: '选1' },
        { value: '选2' },
        { value: '选3' }
      ]
    }
  },
  methods: {
    // 当选的操作
    handleRadio(type, item, index) {
      if (this.disabled) {
        // 不能点击
        return
      }
      if (type == 'add') {
        this.field.showSetting.push({
          value: '选' + (this.field.showSetting.length + 1)
        })
      } else if (type == 'remove') {
        if (item.value == this.field.default_value) {
          this.field.default_value = ''
        }
        this.field.showSetting.splice(index, 1)
      }
    },
    radioChange(val) {
      this.field.default_value == val
        ? (this.field.default_value = '')
        : (this.field.default_value = val)
    },

    radioInputChange(field) {
      if (this.field.default_value) {
        let has = false
        for (let index = 0; index < field.showSetting.length; index++) {
          const item = field.showSetting
          if (this.field.default_value == item.value) {
            has = true
          }
        }

        if (!has) {
          this.field.default_value = ''
        }
      }
    },

    /**
     * 多选
     */
    handleCheckbox(type, item, index) {
      if (this.disabled) {
        // 不能点击
        return
      }
      if (type == 'add') {
        this.field.showSetting.push({
          value: '选' + (this.field.showSetting.length + 1)
        })
      } else if (type == 'remove') {
        const removeIndex = this.field.default_value.indexOf(item.value)
        if (removeIndex != -1) {
          this.field.default_value.splice(removeIndex, 1)
        }
        this.field.showSetting.splice(index, 1)
      }
    },

    checkboxInputChange(field) {
      if (this.field.default_value && this.field.default_value.length) {
        const datas = this.field.showSetting.map(item => item.value)
        const newValue = []

        for (let index = 0; index < this.field.default_value.length; index++) {
          const item = this.field.default_value[index]
          if (datas.includes(item)) {
            newValue.push(item)
          }
        }

        if (this.field.default_value.length != newValue.length) {
          this.field.default_value = newValue
        }
      }
    },

    /** * 输入默认值触发 */
    inputBlur(e) {
      if (this.field.form_type == 'mobile' && this.field.default_value) {
        if (!regexIsCRMMobile(this.field.default_value)) {
          this.$message({
            message: '输入的手机格式有误',
            type: 'error'
          })
        }
      } else if (this.field.form_type == 'email' && this.field.default_value) {
        if (!regexIsCRMEmail(this.field.default_value)) {
          this.$message({
            message: '输入的邮箱格式有误',
            type: 'error'
          })
        }
      }
    },
    /**
     * 必填勾选改变
     */
    inNullChange(val) {
    }
  }
}
</script>
<style lang="scss" scoped>
.field-info-section {
  padding: 0 20px 20px;
}

.item-section {
  padding: 10px 0 12px 0;
  border-bottom: 1px solid #e6e6e6;
  .name {
    font-size: 13px;
    font-size: 500;
    color: #333;
    margin: 10px 0;
  }
}

.input-tips {
  font-size: 12px;
  margin-top: 10px;
  color: #999;
  span {
    color: red;
  }
}

.el-checkbox /deep/ .el-checkbox__label {
  font-size: 13px;
  color: #333333;
}

.item-check-section {
  margin-top: 15px;
}

.radio {
  margin-top: 5px;
  margin-left: 0;
  /deep/ .el-radio {
    margin-right: 10px !important;
  }
  .input {
    display: inline-block;
    width: 180px;
  }
  .handle {
    cursor: pointer;
    color: #ccc;
    font-size: 20px;
  }
}

.checkbox {
  display: block;
  margin-left: 0;
  margin-top: 5px;
  /deep/.el-checkbox {
    margin-right: 10px;
    .el-checkbox__label {
      display: none;
    }
  }
  .input {
    display: inline-block;
    width: 180px;
  }
  .handle {
    cursor: pointer;
    color: #ccc;
    font-size: 20px;
  }
}

.cursor-move {
  cursor: move;
}

.field-tips {
  color: #999;
  line-height: 1.5;
}
</style>
