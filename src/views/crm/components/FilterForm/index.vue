<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    title="高级筛选"
    width="900px"
    @close="handleCancel">
    <div style="margin-bottom: 10px;">筛选条件</div>
    <el-form
      id="filter-container"
      class="filter-container">
      <el-form-item>
        <template v-for="(formItem, index) in form">
          <el-row :key="index">
            <el-col :span="8">
              <el-select
                v-model="formItem.field"
                placeholder="请选择要筛选的字段名"
                @change="fieldChange(formItem)"
                @focus="fieldFocus">
                <el-option
                  v-for="item in fieldList"
                  :key="item.field"
                  :label="item.name"
                  :value="item.field"/>
              </el-select>
            </el-col>

            <el-col
              v-if="showCalCondition(formItem.form_type)"
              :span="1">&nbsp;</el-col>
            <el-col
              v-if="showCalCondition(formItem.form_type)"
              :span="4">
              <el-select
                v-model="formItem.condition"
                placeholder="请选择范围"
                @change="selectChange($event,formItem)">
                <el-option
                  v-for="item in getAdvancedFilterOptions(formItem.form_type)"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-col>

            <!-- 商机组 -->
            <el-col
              v-if="formItem.form_type == 'business_type'"
              :span="1">&nbsp;</el-col>
            <el-col
              v-if="formItem.form_type == 'business_type'"
              :span="4">
              <el-select
                v-model="formItem.type_id"
                @change="typeOptionsChange(formItem)">
                <el-option
                  v-for="item in formItem.typeOption"
                  :key="item.type_id"
                  :label="item.name"
                  :value="item.type_id"/>
              </el-select>
            </el-col>

            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="getValueSpan(formItem.form_type, formItem.field) ? 8 : 13? 13 : 8" style="position: relative;">
              <template
                v-if="formItem.condition === 'isNull' ||
                formItem.condition === 'isNotNull'">
                &nbsp;
              </template>
              <template v-else>
                <el-select
                  v-if="formItem.form_type === 'check_status'
                    || formItem.form_type === 'deal_status'
                    || formItem.form_type === 'invoice_status'
                  || (formItem.form_type === 'select' && getSettingValueType(formItem.setting) != 'string')"
                  v-model="formItem.value"
                  placeholder="请选择筛选条件">
                  <el-option
                    v-for="item in formItem.setting"
                    :key="item"
                    :label="item"
                    :value="item"/>
                </el-select>
                <el-select
                  v-else-if="formItem.form_type === 'select' || formItem.form_type === 'checkbox'"
                  v-model="formItem.value"
                  multiple
                  placeholder="请选择筛选条件">
                  <el-option
                    v-for="item in formItem.setting"
                    :key="item"
                    :label="item"
                    :value="item"/>
                </el-select>
                <template
                  v-else-if="formItem.form_type == 'number' ||
                    formItem.form_type == 'floatnumber' ||
                  formItem.form_type == 'percent'">
                  <div v-if="formItem.type === 14">
                    <el-input-number
                      v-model="formItem.min"
                      :controls="false"
                      style="width: 100px;"
                      class="small"/>
                    <span>-</span>
                    <el-input-number
                      v-model="formItem.max"
                      :controls="false"
                      style="width: 100px;"
                      class="small"/>
                  </div>
                  <el-input-number
                    v-else
                    v-model="formItem.value"
                    :controls="false"
                    style="width: 200px;"
                    class="small"/>
                </template>
                <template v-else-if="formItem.form_type === 'date' || formItem.form_type === 'datetime'">
                  <el-date-picker
                    v-show="formItem.type === 14"
                    :ref="`wkDatePicker${index}`"
                    v-model="formItem.range"
                    :picker-options="getPickerOptions(formItem, index)"
                    :type="formItem.form_type === 'date' ? 'daterange' : 'datetimerange'"
                    :value-format="formItem.form_type === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                    @change="datePickerChange(formItem)"/>
                  <div
                    v-if="formItem.timeType"
                    class="date-range-content"
                    @click="dateRangeSelect(formItem, index)">{{ formItem.timeTypeName }}</div>
                  <el-date-picker
                    v-show="formItem.type !== 14"
                    v-model="formItem.value"
                    :value-format="formItem.form_type === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"
                    :type="formItem.form_type"
                    placeholder="选择日期"/>
                </template>
                <el-select
                  v-else-if="formItem.form_type === 'business_type'"
                  v-model="formItem.status_id">
                  <el-option
                    v-for="item in formItem.statusOption"
                    :key="item.status_id"
                    :label="item.name"
                    :value="item.status_id"/>
                </el-select>
                <wk-user-select
                  v-else-if="formItem.form_type === 'user' || formItem.form_type === 'single_user'"
                  :info-params="infoParams"
                  v-model="formItem.value"
                  :radio="false"
                  @change="userDepChange(formItem, arguments[0], arguments[1])"/>
                <wk-dep-select
                  v-else-if="formItem.form_type === 'structure'"
                  v-model="formItem.value"
                  :radio="false"
                  @change="userDepChange(formItem, arguments[0], arguments[1])"/>
                <el-switch
                  v-else-if="formItem.form_type == 'boolean_value'"
                  v-model="formItem.value"
                  active-value="1"
                  inactive-value="0"/>
                <xh-prouct-cate
                  v-else-if="formItem.form_type === 'category'"
                  :item="formItem"
                  :value="formItem.value"
                  @value-change="arrayValueChange"/>
                <v-distpicker
                  v-else-if="formItem.form_type === 'map_address'"
                  :province="formItem.address.state"
                  :city="formItem.address.city"
                  :area="formItem.address.area"
                  @province="selectProvince($event,formItem)"
                  @city="selectCity($event,formItem)"
                  @area="selectArea($event,formItem)"/>
                <wk-position
                  v-else-if="formItem.form_type == 'position'"
                  :show-detail="false"
                  :props="{ checkStrictly: true }"
                  v-model="formItem.value"/>
                <el-input
                  v-else
                  v-model="formItem.value"
                  placeholder="多个条件请用；隔开"/>
              </template>
            </el-col>
            <el-col
              :span="1"
              class="delete">
              <i
                class="el-icon-error delete-btn"
                @click="handleDelete(index)"/>
            </el-col>
          </el-row>
        </template>
      </el-form-item>
    </el-form>
    <p
      v-show="showErrors"
      class="el-icon-warning warning-info">
      <span class="desc">筛选条件中有重复项！</span>
    </p>
    <el-button
      type="text"
      @click="handleAdd">+ 添加筛选条件</el-button>
    <div
      v-if="saveScene"
      class="save">
      <el-checkbox v-model="saveChecked">保存为场景</el-checkbox>
      <el-input
        v-show="saveChecked"
        v-model.trim="saveName"
        :maxlength="10"
        class="name"
        placeholder="请输入场景名称，最多10个字符"/>
      <div
        v-show="saveChecked"
        class="save-setting">
        <el-checkbox v-model="saveDefault">设置为默认</el-checkbox>
      </div>
    </div>
    <div
      slot="footer"
      class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button
        type="primary"
        @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { XhProuctCate } from '@/components/CreateCom'
import VDistpicker from '@/components/VDistpicker'
import WkPosition from '@/components/NewCom/WkPosition'
import WkUserSelect from '@/components/NewCom/WkUserSelect'
import WkDepSelect from '@/components/NewCom/WkDepSelect'

import { objDeepCopy } from '@/utils'
import AdvancedFilterMixin from '@/mixins/AdvancedFilter'
import { isEmpty } from '@/utils/types'

/**
 * fieldList: 高级筛选的字段
 *     type:  date || datetime || select || 其他 input
 */
export default {
  name: 'Index',
  components: {
    XhProuctCate,
    VDistpicker,
    WkPosition,
    WkUserSelect,
    WkDepSelect
  },
  mixins: [AdvancedFilterMixin],
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false
    },
    fieldList: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    obj: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    /** 获取客户管理下列表权限内的员工列表 针对 usersList */
    crmType: {
      type: String,
      default: ''
    },
    // 辅助 使用 公海没有场景
    saveScene: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      form: [],
      visible: false,
      showErrors: false,
      saveChecked: false, // 展示场景
      saveDefault: false, // 设置为默认场景
      saveName: null // 场景名称
    }
  },
  computed: {
    infoParams() {
      return this.crmType ? { m: 'crm', c: this.crmType, a: 'index' } : {}
    }
  },
  watch: {
    dialogVisible: {
      handler(val) {
        if (val) {
          this.form = objDeepCopy(this.obj.form)
          if (this.form.length == 0) {
            this.form.push({
              field: '',
              name: '',
              form_type: '',
              condition: 'contains',
              type: 3,
              value: '',
              typeOption: [],
              statusOption: [],
              type_id: '',
              status_id: '',
              address: {
                state: '',
                city: '',
                area: ''
              }
            })
          }
          this.saveChecked = false
          this.saveDefault = false
          this.saveName = null
        }
        this.visible = this.dialogVisible
      },
      deep: true,
      immediate: true
    },

    form() {
      this.$nextTick(() => {
        var container = document.getElementById('filter-container')
        container.scrollTop = container.scrollHeight
      })
    }
  },
  methods: {
    /**
     * 位置更改
     */
    selectProvince(data, formItem) {
      formItem.address.state = data.value
    },
    selectCity(data, formItem) {
      formItem.address.city = data.value
    },
    selectArea(data, formItem) {
      formItem.address.area = data.value
    },

    /**
     * 商机组状态
     */
    typeOptionsChange(formItem) {
      if (formItem.type_id) {
        const obj = formItem.typeOption.find(item => {
          return item.type_id === formItem.type_id
        })
        formItem.statusOption = obj.statusList || []
      } else {
        formItem.statusOption = []
      }
      formItem.status_id = ''
    },
    /**
     * 用户创建人
     * 产品类别
     */
    arrayValueChange(data) {
      if (data.value.length > 0) {
        data.item.value = data.value
        data.item.valueContent = data.valueContent
      } else {
        data.item.value = []
      }
    },
    /**
     * 用户部门change
     */
    userDepChange(formItem, dataIds, data) {
      // 用于部门员工的展示
      formItem.valueContent = data
    },

    /**
     * 连接条件的变更
     */
    selectChange(event, formItem) {
      this.getAdvancedFilterOptions(formItem.form_type).forEach(item => {
        if (item.value === event) {
          formItem.type = item.type
        }
      })
    },
    /**
     * 是否展示条件
     */
    showCalCondition(form_type, fieldName) {
      return this.getAdvancedFilterOptions(form_type, fieldName).length > 0
    },
    /**
     * 值span
     */
    getValueSpan(form_type, fieldName) {
      if (form_type == 'business_type') {
        return 8
      }
      return this.showCalCondition(form_type, fieldName) ? 8 : 13
    },
    /**
     * 聚焦
     */
    fieldFocus() {
      this.$el.click()
    },

    /**
     * 当前选择的字段名改变，判断是否有重复
     * @param formItem
     */
    fieldChange(formItem) {
      const obj = this.fieldList.find(item => {
        return item.field === formItem.field
      })
      if (obj) {
        formItem.form_type = obj.form_type
        formItem.name = obj.name
        if (formItem.form_type == 'business_type') {
          formItem.typeOption = obj.setting
          formItem.statusOption = []
          formItem.type_id = ''
          formItem.status_id = ''
          formItem.value = ''
        } else if (
          formItem.form_type == 'check_status' ||
          formItem.form_type == 'deal_status'
        ) {
          formItem.setting = obj.setting || []
          formItem.value = ''
        } else if (formItem.form_type == 'map_address') {
          formItem.address = {
            state: '',
            city: '',
            area: ''
          }
        } else if (
          // formItem.form_type === 'date' ||
          // formItem.form_type === 'datetime' ||
          formItem.form_type === 'user' ||
          formItem.form_type === 'single_user' ||
          formItem.form_type === 'structure' ||
          formItem.form_type === 'category' ||
          formItem.form_type === 'position'
        ) {
          formItem.value = []
        } else if (
          formItem.form_type === 'date' ||
          formItem.form_type === 'datetime'
        ) {
          formItem.value = '' // 时间点
          this.$set(formItem, 'timeType', '')
          this.$set(formItem, 'timeTypeName', '')
          this.$set(formItem, 'range', [])
        } else if (
          formItem.form_type == 'select' ||
          formItem.form_type === 'checkbox'
        ) {
          formItem.setting = obj.setting || []
          formItem.value = []
        } else if (
          formItem.form_type == 'number' ||
          formItem.form_type == 'floatnumber' ||
          formItem.form_type == 'percent'
        ) {
          formItem.min = ''
          formItem.max = ''
          formItem.value = ''
        } else {
          formItem.value = ''
        }

        // 条件校准
        const conditions = this.getAdvancedFilterOptions(formItem.form_type, formItem.field)
        if (conditions.length > 0) {
          const conditionObj = conditions[0]
          formItem.condition = conditionObj.value
          formItem.type = conditionObj.type
        } else {
          formItem.condition = 'is'
          formItem.type = 1
        }
        // if (
        //   formItem.form_type == 'checkbox' ||
        // formItem.form_type == 'check_status' ||
        // formItem.form_type == 'deal_status'
        // ) {
        //   formItem.type = 1
        //   formItem.condition = 'is'
        // } else if (
        //   formItem.form_type == 'user' ||
        //   formItem.form_type == 'single_user' ||
        //   formItem.form_type == 'structure'
        // ) {
        //   formItem.condition = 'is'
        //   formItem.type = 1
        // } else if (
        //   formItem.form_type == 'select'
        // ) {
        //   formItem.condition = 'is'
        //   formItem.type = 1
        // } else {
        //   formItem.condition = 'is'
        //   formItem.type = 1
        // }
      }

      this.getError()
    },
    /**
     * 取消选择
     */
    handleCancel() {
      this.$emit('update:dialogVisible', false)
    },

    /**
     *获取错误
     */
    getError() {
      this.showErrors = false
      const fields = []
      for (let index = 0; index < this.form.length; index++) {
        const item = this.form[index]
        if (fields.includes(item.field)) {
          this.showErrors = true
          break
        } else {
          fields.push(item.field)
        }
      }
    },

    /**
     * 确定选择
     */
    handleConfirm() {
      if (this.showErrors) {
        this.$message.error('筛选条件中有重复项！')
        return
      }
      if (this.saveChecked) {
        if (!this.saveName || this.saveName === '') {
          this.$message.error('场景名称不能为空！')
          return
        }
      }
      for (let i = 0; i < this.form.length; i++) {
        const o = this.form[i]
        if (!o.field || o.field === '') {
          this.$message.error('筛选的字段名称不能为空！')
          return
        }
        if (o.form_type == 'business_type') {
          if (!o.type_id && !o.status_id) {
            this.$message.error('筛选内容不能为空！')
            return
          }
        } else if (o.form_type == 'map_address') {
          if (!o.address.state && !o.address.city && !o.address.area) {
            this.$message.error('筛选内容不能为空！')
            return
          }
        } else if (
          o.form_type == 'date' ||
          o.form_type == 'datetime'
        ) {
          if (o.condition != 'isNull' && o.condition != 'isNotNull') {
            if (o.type === 14) {
              if (isEmpty(o.timeType) && isEmpty(o.range)) {
                this.$message.error('筛选内容不能为空！')
                return
              }
            } else {
              if (isEmpty(o.value)) {
                this.$message.error('筛选内容不能为空！')
                return
              }
            }
          }
        } else if (
          o.form_type == 'number' ||
          o.form_type == 'floatnumber' ||
          o.form_type == 'percent'
        ) {
          if (o.condition != 'isNull' && o.condition != 'isNotNull') {
            if (o.type === 14) {
              if (isEmpty(o.min) || isEmpty(o.max)) {
                this.$message.error('筛选内容不能为空！')
                return
              }
            } else {
              if (isEmpty(o.value)) {
                this.$message.error('筛选内容不能为空！')
                return
              }
            }
          }
        } else if (
          // o.form_type == 'date' ||
          // o.form_type == 'datetime' ||
          o.form_type == 'user' ||
          o.form_type == 'single_user' ||
          o.form_type == 'structure' ||
          o.form_type == 'category' ||
          o.form_type == 'checkbox' ||
          o.form_type == 'position'
          // o.form_type == 'select'
        ) {
          if (!o.value || o.value.length === 0) {
            if (o.condition != 'isNull' && o.condition != 'isNotNull') {
              this.$message.error('筛选内容不能为空！')
              return
            }
          }
        } else if (o.value === '' || o.value === undefined || o.value === null) {
          if (o.condition != 'isNull' && o.condition != 'isNotNull') {
            this.$message.error('筛选内容不能为空')
            return
          }
        }
      }
      const obj = []
      this.form.forEach(o => {
        if (o.form_type == 'datetime' || o.form_type == 'date') {
          let dataValues = []
          if (o.type === 14) {
            if (!isEmpty(o.timeType)) {
              dataValues = [o.timeType]
            } else {
              dataValues = o.range
            }
          } else {
            dataValues = [o.value]
          }
          obj.push({
            condition: o.condition,
            form_type: o.form_type,
            name: o.name,
            type: o.field,
            // type: o.form_type == 'date' ? 11 : 12,
            value: dataValues
            // start: new Date(o.value[0]).getTime() / 1000,
            // end: new Date(o.value[1]).getTime() / 1000
          })
        } else if (o.form_type == 'business_type') {
          obj.push({
            // condition: o.condition,
            form_type: o.form_type,
            name: o.status_id ? 'status_id' : 'type_id',
            type: o.field,
            // type: 1,
            // value: o.status_id ? [o.type_id, o.status_id] : [o.type_id]
            type_id: o.type_id,
            status_id: o.status_id
          })
        } else if (o.form_type == 'user' || o.form_type == 'single_user') {
          obj.push({
            condition: o.condition,
            // type: o.type,
            value: o.value,
            form_type: o.form_type,
            name: o.name,
            type: o.field
          })
        } else if (o.form_type == 'structure') {
          obj.push({
            condition: o.condition,
            // type: o.type,
            value: o.value,
            form_type: o.form_type,
            name: o.name,
            type: o.field
          })
        } else if (o.form_type == 'checkbox') {
          obj.push({
            condition: o.condition,
            // type: o.type,
            value: o.value,
            form_type: o.form_type,
            name: o.name,
            type: o.field
          })
        } else if (o.form_type == 'category') {
          obj.push({
            condition: o.condition,
            // type: 1,
            value: [o.value[o.value.length - 1]],
            form_type: o.form_type,
            name: o.name,
            type: o.field
          })
        } else if (o.form_type == 'select') {
          let value = o.value
          if (this.getSettingValueType(o.setting) != 'string') {
            value = [o.value]
          }
          obj.push({
            condition: o.condition,
            // type: o.type,
            value: value,
            form_type: o.form_type,
            name: o.name,
            type: o.field
          })
        } else if (o.form_type == 'map_address') {
          // const value = []
          // for (const key in o.address) {
          //   const addValue = o.address[key]
          //   if (addValue) {
          //     value.push(addValue)
          //   }
          // }
          obj.push({
            condition: o.condition,
            // value: [value.join(',')],
            value: o.address,
            // type: 1,
            form_type: o.form_type,
            name: o.name,
            type: o.field
          })
        } else {
          let value = []
          if (o.form_type == 'number' && o.condition == 'range') {
            value = [o.min, o.max]
          } else if (typeof o.value === 'string') {
            const temp = o.value.replace(/；/g, ';')
            value = temp.split(';').filter(item => item !== '' && item !== null)
          } else {
            value = [o.value]
          }

          obj.push({
            // type: o.type,
            value: value,
            form_type: o.form_type,
            name: o.name,
            type: o.field,
            condition: o.condition
            // scene_id:
            // sceneName: o.field
          })
        }
      })
      const data = {
        obj: obj,
        form: this.form,
        saveChecked: this.saveChecked,
        saveDefault: this.saveDefault,
        saveName: this.saveName
      }
      this.$emit('filter', data)
    },
    /**
     * 添加筛选条件
     */
    handleAdd() {
      this.form.push({
        field: '',
        condition: 'contains',
        value: '',
        type: '',
        form_type: '',
        setting: [],
        typeOption: [],
        statusOption: [],
        type_id: '',
        status_id: ''
      })
    },
    /**
     * 删除筛选条件
     * @param index
     */
    handleDelete(index) {
      this.$confirm('您确定要删除这一条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.form.splice(index, 1)
          this.getError()
        })
        .catch(() => {})
    },

    /**
     * 获取setting数据类型
     */
    getSettingValueType(setting) {
      if (setting && setting.length > 0) {
        const value = setting[0]
        return typeof value
      }
      return []
    },
    /**
     * 聚焦datepicker
     */
    dateRangeSelect(formItem, index) {
      const datePicker = this.$refs[`wkDatePicker${index}`][0]
      this.$nextTick(() => {
        datePicker.focus()
        datePicker.pickerVisible = true
      })
    },
    /**
     * datepicker change
     */
    datePickerChange(formItem) {
      formItem.timeTypeName = ''
      formItem.timeType = ''
    },
    /**
     * 时间筛选配置
     */
    getPickerOptions(item, itemIndex) {
      const types = [
        { text: '本年度', value: 'year' },
        { text: '上一年度', value: 'lastYear' },
        { text: '下一年度', value: 'nextYear' },
        { text: '上半年', value: 'firstHalfYear' },
        { text: '下半年', value: 'nextHalfYear' },
        { text: '本季度', value: 'quarter' },
        { text: '上一季度', value: 'lastQuarter' },
        { text: '下一季度', value: 'nextQuarter' },
        { text: '本月', value: 'month' },
        { text: '上月', value: 'lastMonth' },
        { text: '下月', value: 'nextMonth' },
        { text: '本周', value: 'week' },
        { text: '上周', value: 'lastWeek' },
        { text: '下周', value: 'nextWeek' },
        { text: '今天', value: 'today' },
        { text: '昨天', value: 'yesterday' },
        { text: '明天', value: 'tomorrow' },
        { text: '过去7天', value: 'previous7day' },
        { text: '过去30天', value: 'previous30day' },
        { text: '未来7天', value: 'future7day' },
        { text: '未来30天', value: 'future30day' }
      ]
      const shortcuts = []
      for (let index = 0; index < types.length; index++) {
        const element = types[index]
        shortcuts.push({
          text: element.text,
          onClick: (picker) => {
            picker.$emit('pick', [], false)
            this.$nextTick(() => {
              item.timeTypeName = element.text
              item.timeType = element.value
            })
          }
        })
      }

      return {
        shortcuts: shortcuts
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 10px 20px;
}

/deep/ .el-form-item__label {
  width: 100%;
  text-align: left;
}
.filter-container {
  max-height: 300px;
  overflow-y: auto;
}

.save {
  margin-top: 10px;
  .name {
    width: 300px;
    margin-left: 10px;
    /deep/ .el-input__inner {
      height: 32px;
    }
  }
  .save-setting {
    margin-top: 20px;
  }
}

.el-form-item {
  margin-bottom: 0;
}

.el-row {
  margin-bottom: 20px;
  .delete-btn {
    margin-left: 15px;
    color: #bbb;
    cursor: pointer;
  }
  .el-select,
  .el-date-editor {
    width: 100%;
    /deep/ .el-range__icon {
      line-height: 26px;
    }
  }
  .el-input-number {
    /deep/ input {
      text-align: left;
      padding: 0 8px;
    }
  }
  .date-range-content {
    position: absolute;
    left: 30px;
    right: 30px;
    top: 4px;
    height: 30px;
    line-height: 30px;
    background: white;
    font-size: 13px;
    cursor: pointer;
  }
}

.warning-info {
  width: 100%;
  font-size: 14px;
  color: #f56c6c;
  margin-top: 10px;
  .desc {
    padding-left: 8px;
  }
}

.distpicker-address-wrapper /deep/ select {
  border-radius: 2px;
  font-size: 13px;
  height: 34px;
  -webkit-appearance: none;
  background-image: url(data:image/png;base64,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czp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTgtMDctMjdUMDc6NTY6NDctMDc6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE4LTA3LTI3VDA3OjU5OjA4LTA3OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE4LTA3LTI3VDA3OjU5OjA4LTA3OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IkRpc3BsYXkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OWVmMTg3ZTUtMWVmNy00NzlhLWE1Y2QtMmVkMTE5NjQ2Y2ZmIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MTRmNTk5YTMtYTc1Zi05NDQxLTk3ZDQtMmY3OTNjNWQ3NTI3IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6M2FmYmY3ZWYtNWFiOS00MTk4LWFjODUtNzY2NzE2NDk2ODM1Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozYWZiZjdlZi01YWI5LTQxOTgtYWM4NS03NjY3MTY0OTY4MzUiIHN0RXZ0OndoZW49IjIwMTgtMDctMjdUMDc6NTY6NDctMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5ZWYxODdlNS0xZWY3LTQ3OWEtYTVjZC0yZWQxMTk2NDZjZmYiIHN0RXZ0OndoZW49IjIwMTgtMDctMjdUMDc6NTk6MDgtMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pr46tjAAAACBSURBVCjPY/j//z8DOgaCVVjFsSgMB2IQIxuvYiBgBuJHUMXfgVgCn+I+qEIYXoxVMRBYoymEYX9sio/hUHz79+/fCMVAUIxDIQy3Q9UxyAPxPwKKQdgEHKZAfI4IvJ8BW+DjwoNFMUkeJCnoSIoUkqOb5IREUhIlOfGTlK0IZVgAkODRpD7i30MAAAAASUVORK5CYII=);
  background-position: calc(100% - 4px) 50%;
  background-repeat: no-repeat;
  background-size: 5px 11px;
}
</style>
