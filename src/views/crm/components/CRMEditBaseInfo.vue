<template>
  <div v-loading="loading" class="b-cont">
    <div v-if="showSaveButton" class="b-cont__handle">
      <el-button @click.native="editCancel">取消</el-button>
      <el-button
        v-debounce="editConfirm"
        type="primary">保存</el-button>
    </div>
    <sections
      v-for="(mainItem, mainIndex) in list"
      :key="mainIndex"
      :title="mainItem.name"
      class="b-cells"
      content-height="auto">
      <el-form
        :model="editForm"
        :rules="editRules"
        :ref="`editForm${mainIndex}`"
        class="el-form--flex"
        label-position="left"
        label-width="100px">
        <el-form-item
          v-for="(item, index) in mainItem.list"
          :key="index"
          :prop="item.field"
          :class="{'is-block': isBlockShowField(item)}">
          <span slot="label">
            {{ item.name }}
          </span>
          <template v-if="item.isEdit">
            <el-input
              v-if="item.form_type === 'text' ||
                item.form_type == 'number' ||
                item.form_type == 'floatnumber' ||
                item.form_type == 'mobile' ||
                item.form_type == 'email' ||
              item.form_type == 'textarea'"
              v-model="editForm[item.field]"/>
            <el-select
              v-else-if="item.form_type === 'select' || item.form_type === 'business_status'"
              v-model="editForm[item.field]"
              style="width: 100%;"
              clearable>
              <el-option
                v-for="(item, index) in getFieldOption(item)"
                :key="index"
                :label="item.name"
                :value="item.value"/>
            </el-select>
            <el-select
              v-else-if="item.form_type === 'checkbox'"
              v-model="editForm[item.field]"
              multiple
              style="width: 100%;"
              clearable>
              <el-option
                v-for="(item, index) in getFieldOption(item)"
                :key="index"
                :label="item.name"
                :value="item.value"/>
            </el-select>
            <el-date-picker
              v-else-if="item.form_type === 'date'"
              v-model="editForm[item.field]"
              type="date"
              clearable
              style="width: 100%;"
              value-format="yyyy-MM-dd"
            />
            <el-date-picker
              v-else-if="item.form_type === 'datetime'"
              v-model="editForm[item.field]"
              clearable
              style="width: 100%;"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
            <xh-user-cell
              v-else-if="item.form_type === 'user' || item.form_type === 'single_user'"
              :value="editForm[item.field]"
              :radio="item.form_type === 'single_user'"
              @value-change="arrayValueChange($event, item)"
            />
            <xh-structure-cell
              v-else-if="item.form_type === 'structure'"
              :value="editForm[item.field]"
              :radio="false"
              @value-change="arrayValueChange($event, item)"
            />
            <crm-relative-cell
              v-else-if="item.form_type === 'contacts' ||
                item.form_type === 'customer' ||
                item.form_type === 'contract' ||
              item.form_type === 'business'"
              :relative-type="item.form_type"
              :value="editForm[item.field]"
              @value-change="arrayValueChange($event, item)"
            />
            <xh-files
              v-else-if="item.form_type === 'file'"
              :value="editForm[item.field]"
              @value-change="arrayValueChange($event, item)"
            />
            <xh-prouct-cate
              v-else-if="item.form_type === 'category'"
              :value="editForm[item.field]"
              @value-change="arrayValueChange($event, item)"
            />
          </template>
          <template v-else>
            <flexbox v-if="item.form_type === 'file'" style="min-height: 40px;">
              <file-list-view :list="item.value || []" />
              <i v-if="getEditAuth(item)" class="wk wk-edit form-item__edit" @click="editClick(item)" />
            </flexbox>
            <div
              v-else-if="item.form_type === 'map_address'"
              :gutter="0"
              wrap="wrap">
              <div
                :span="0.5"
                class="b-cell"
                @click="checkMapView(item)">
                <flexbox
                  class="b-cell-b">
                  <div class="b-cell-name">定位</div>
                  <div
                    class="b-cell-value"
                    style="color: #3E84E9;cursor: pointer;">{{ item.value.location }}</div>
                </flexbox>
              </div>
              <div
                :span="0.5"
                class="b-cell">
                <flexbox
                  class="b-cell-b">
                  <div class="b-cell-name">区域</div>
                  <div class="b-cell-value">{{ item.value.address.join() }}</div>
                </flexbox>
              </div>
              <div
                :span="0.5"
                class="b-cell">
                <flexbox
                  class="b-cell-b">
                  <div class="b-cell-name">详细地址</div>
                  <div class="b-cell-value">{{ item.value.detail_address }}</div>
                </flexbox>
              </div>
            </div>

            <div
              v-else
              :class="{'can-check':isModule(item)}"
              class="form-item__value"
              @click="checkModuleDetail(item)">{{ getCommonShowValue(item) }}<i v-if="getEditAuth(item)" class="wk wk-edit form-item__edit" @click.stop="editClick(item)" /></div>
          </template>
        </el-form-item>
      </el-form>
    </sections>
    <slot />
    <map-view
      v-if="showMapView"
      :title="mapViewInfo.title"
      :lat="mapViewInfo.lat"
      :lng="mapViewInfo.lng"
      @hidden="showMapView=false" />

    <c-r-m-full-screen-detail
      :visible.sync="showFullDetail"
      :id="fullDetailId"
      :crm-type="fullDetailType"/>
  </div>
</template>

<script>
import { filedGetInformationAPI, filedUpdateTableFieldAPI, filedGetFieldAPI, filedValidatesAPI } from '@/api/crm/common'

import {
  XhUserCell,
  XhStructureCell,
  XhFiles,
  CrmRelativeCell,
  XhProuctCate,
  XhBusinessStatus,
  XhReceivablesPlan
} from '@/components/CreateCom'

import crmTypeModel from '@/views/crm/model/crmTypeModel'
import Sections from '../components/Sections'
import MapView from '@/components/MapView' // 地图详情
import FileListView from '@/components/FileListView'
import CheckStatusMixin from '@/mixins/CheckStatusMixin'
import { separator } from '@/filters/vueNumeralFilter/filters'
import {
  regexIsCRMNumber,
  regexIsCRMMoneyNumber,
  regexIsCRMMobile,
  regexIsCRMEmail,
  objDeepCopy
} from '@/utils'
import { isArray, isObject, isEmpty } from '@/utils/types'
import { mapGetters } from 'vuex'
import { getWkDateTime } from '@/utils'

export default {
  // 客户管理 的 基本信息
  name: 'CRMEditBaseInfo',
  components: {
    Sections,
    MapView,
    FileListView,
    XhUserCell,
    XhStructureCell,
    XhFiles,
    CrmRelativeCell,
    XhProuctCate,
    XhBusinessStatus,
    XhReceivablesPlan,
    CRMFullScreenDetail: () => import('@/components/CRMFullScreenDetail')
  },
  filters: {
  },
  mixins: [CheckStatusMixin],
  props: {
    // 模块ID
    id: [String, Number],
    pool_id: [String, Number],
    isSeas: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 没有值就是全部类型 有值就是当个类型
    crmType: {
      type: String,
      default: ''
    },
    // 固定字段的数据
    filedList: Array
  },
  data() {
    return {
      loading: false,
      list: [],
      // 控制展示地图详情
      showMapView: false,
      // 地图详情信息
      mapViewInfo: {},
      showFullDetail: false,
      fullDetailId: '',
      fullDetailType: '',
      // 编辑
      showSaveButton: false,
      editRules: {},
      editForm: {},
      editOptions: {},
      editFieldData: []
    }
  },
  inject: ['rootTabs'],
  computed: {
    ...mapGetters(['crm'])
  },
  watch: {
    id(val) {
      if (!this.filedList) {
        this.refreshData(true)
      }
    },

    filedList() {
      this.list = this.filedList
    },

    'rootTabs.currentName'(val) {
      if (val === 'CRMEditBaseInfo') {
        this.refreshData(false)
      }
    }

  },
  created() {
    this.$bus.on('crm-detail-update', (data) => {
      this.getBaseInfo(false)
      if (!this.isSeas) {
        this.refreshData(true)
      }
    })
  },
  beforeDestroy() {
    this.$bus.off('crm-detail-update')
  },
  mounted() {
    if (this.filedList) {
      this.list = this.filedList
    } else {
      this.refreshData(true)
    }
  },
  methods: {
    /**
     * 刷新页面数据
     */
    refreshData(loading = false) {
      this.getBaseInfo(loading)
      if (!this.isSeas) {
        this.getEditFieldData()
      }
    },



    /**
     * 获取基础信息
     */
    getBaseInfo(loading) {
      this.loading = !!loading

      const params = {
        id: this.id,
        types: crmTypeModel[this.crmType],
        action_id: this.id,
        module: 'crm',
        controller: this.crmType,
        action: 'read',
        system: 1
      }

      // 如果有公海id 需上传确定展示字段
      if (this.pool_id) {
        params.pool_id = this.pool_id
      }

      filedGetInformationAPI(params)
        .then(res => {
          const baseList = []
          const systemList = []
          res.data.forEach(item => {
            if (item.form_type === 'floatnumber') {
              item.value = separator(item.value)
            } else if (item.form_type === 'date') {
              item.value = getWkDateTime(item.value)
            }
            if (item.system == 1) {
              systemList.push(item)
            } else {
              baseList.push(item)
            }
          })
          this.list = [
            {
              name: '基本信息',
              list: baseList
            },
            {
              name: '系统信息',
              list: systemList
            }
          ]
          this.editCancel()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 查看地图详情
     */
    checkMapView(item) {
      if (item.value && item.value !== '') {
        this.mapViewInfo = {
          title: item.value.location,
          lat: item.value.lat,
          lng: item.value.lng
        }
        this.showMapView = true
      }
    },

    getArrayKey(type) {
      if (type === 'structure') {
        return 'name'
      } else if (type === 'user') {
        return 'realname'
      }

      return ''
    },

    arrayValue(array, field) {
      if (
        !array ||
        Object.prototype.toString.call(array) !== '[object Array]'
      ) {
        return ''
      }

      return array
        .map(item => {
          return field ? item[field] : item
        })
        .join('，')
    },

    /**
     * 客户等模块类型
     */
    isModule(item) {
      return [
        'customer',
        'business',
        'contract',
        'contacts'].includes(item.form_type)
    },

    /**
     * 特殊字段
     */
    isSpecialField(item) {
      return [
        'category',
        'statusName',
        'typeName'].includes(item.form_type)
    },

    /**
     * 是整行展示字段
     */
    isBlockShowField(item) {
      return [
        'map_address',
        'file'].includes(item.form_type)
    },

    getShowBlock(type) {
      return ['map_address', 'file'].includes(type)
    },

    getModuleName(item) {
      const field = {
        customer: 'name',
        business: 'name',
        contract: 'num',
        contacts: 'name',
        category: 'name',
        statusName: 'name',
        typeName: 'name'
      }[item.form_type]
      return item.value ? item.value.length == 0 ? '' : item.value[0][field] || item.value : ''
    },

    getFieldOption(item) {
      const editData = this.editOptions[item.field]
      let setting = []
      if (editData) {
        if (item.form_type === 'select' || item.form_type === 'checkbox') {
          if (editData.setting.length > 0 && typeof editData.setting[0] == 'string') {
            setting = editData.setting.map(element => {
              return { name: element, value: element }
            })
          } else {
            setting = editData.setting
          }
        } else if (item.form_type === 'business_status') {
          setting = editData.setting.map(element => {
            element.value = element.statusId
            return element
          })
        }
      }
      return setting
    },

    /**
     * 获取非附件类型的展示值
     */
    getCommonShowValue(item) {
      if (this.isModule(item) || this.isSpecialField(item)) {
        return this.getModuleName(item)
      } else if (item.form_type === 'single_user') {
        return item.value ? item.value.realname : ''
      } else if (item.form_type === 'checkbox' || item.form_type === 'structure' || item.form_type === 'user') {
        return this.arrayValue(item.value, this.getArrayKey(item.form_type))
      } else if (item.form_type === 'check_status') {
        return this.getStatusName(item.value)
      }

      return item.value
    },

    /**
     * 查看详情
     */
    checkModuleDetail(data) {
      if (this.isModule(data) && isArray(data.value)) {
        this.fullDetailType = data.form_type
        this.fullDetailId = data.value[0][`${data.form_type}_id`]
        this.showFullDetail = true
      }
    },

    /**
     * 编辑逻辑
     */
    getEditAuth(item) {
      if (this.isSeas) {
        return false
      }
      if (this.crmType == 'business' && ['business_type', 'business_status'].includes(item.form_type)) {
        return false
      } else if (this.crmType == 'contract' && ['business', 'contacts', 'customer'].includes(item.form_type)) {
        return false
      } else if (this.crmType == 'receivables' && ['contract', 'customer'].includes(item.form_type)) {
        return false
      } else if (this.crmType == 'visit' && ['business', 'contacts', 'customer'].includes(item.form_type)) {
        return false
      }
      // authLevel 1 不能查看不能编辑 2可查看  3 可编辑可查看
      return item.writeStatus === 1 && this.crm && this.crm[this.crmType] && this.crm[this.crmType].update // 不能编辑 disabled true
    },

    /**
     * 点击编辑按钮
     */
    editClick(item) {
      const editData = this.editFieldData.find(field => {
        return field.field == item.field
      })

      if (editData) {
        let value = isArray(editData.value) || isObject(editData.value) ? objDeepCopy(editData.value) : editData.value
        if (item.form_type === 'contacts' ||
          item.form_type === 'customer' ||
          item.form_type === 'contract' ||
          item.form_type === 'business') {
          value = value && value[`${item.form_type}Id`] ? [value] : []
        } else if (item.form_type === 'category') {
          value = value && value.categoryId ? value.categoryId : []
        } else if (item.form_type === 'single_user') {
          value = value && value.userId ? [value] : []
        } else if (item.form_type === 'structure' || item.form_type === 'file' || item.form_type === 'user') {
          value = value || []
        }
        this.$set(this.editForm, item.field, value)
        this.$set(editData, 'isEdit', true)
        this.$set(this.editOptions, item.field, editData)
      }
      this.showSaveButton = true
      this.$set(item, 'isEdit', true)
    },

    editCancel() {
      if (this.$refs.editForm0[0].clearValidate) {
        this.$refs.editForm0[0].clearValidate()
      }

      this.$nextTick(() => {
        this.list.forEach(bItem => {
          bItem.list.forEach(item => {
            item.isEdit = false
          })
        })
        this.editFieldData.forEach(item => {
          item.isEdit = false
        })

        this.editForm = {}
        this.editOptions = {}
        this.showSaveButton = false
      })
    },

    editConfirm() {
      // customerId    fieldId   fieldType  field  form_type  value
      // this.editCancel()
      this.$refs.editForm0[0].validate(valid => {
        if (valid) {
          this.submiteInfo()
        }
      })
    },

    /**
     * 发请求提交数据
     */
    submiteInfo() {
      // 仅第一块可编辑 ，直接取第一块的数据
      this.loading = true
      const fields = this.list[0].list || []
      const list = []
      for (let index = 0; index < fields.length; index++) {
        const field = fields[index]
        if (field.isEdit) {
          const fieldData = this.editOptions[field.field]
          if (fieldData) {
            fieldData.value = this.getRealValue(fieldData, this.editForm[field.field])
            if (fieldData.field === 'category_id') {
              fieldData.value = fieldData.value.toString()
            }
            list.push(fieldData)
          }
        }
      }

      filedUpdateTableFieldAPI({
        // id: this.id,
        // batchId: this.detail.batchId,
        // label: crmTypeModel[this.crmType],
        // list: list

        // types
        // action_id	      是	int	操作ID，某模块下某条数据的主键ID
        // field	          是	string	要编辑的字段
        // name	          是	string	要编辑的字段的中文名
        // value
        types: 'crm_' + this.crmType,
        action_id: this.id,
        list: list.map(item => {
          return {
            [item.field]: item.value
          }
        })

      }).then(res => {
        this.loading = false
        this.editCancel()

        this.refreshData(true)
      }).catch(() => {
        this.loading = false
      })
    },

    getRealValue(element, value) {
      if (
        element.form_type == 'customer' ||
        element.form_type == 'contacts' ||
        element.form_type == 'business' ||
        element.form_type == 'leads' ||
        element.form_type == 'contract'
      ) {
        if (value && value.length) {
          return value[0][`${element.form_type}_id`]
        } else {
          return ''
        }
      } else if (
        element.form_type == 'user' ||
        element.form_type == 'single_user' ||
        element.form_type == 'structure'
      ) {
        return value
          .map(item => {
            return (element.form_type == 'user' || element.form_type == 'single_user') ? item.id : item.id
          })
          // .join(',')
      } else if (element.form_type == 'file') {
        if (value && value.length > 0) {
          return value.map(item => item.file_id)
        }
        return []
      } else if (element.form_type == 'category') {
        if (value && value.length > 0) {
          return value[value.length - 1]
        }
        return ''
      } else if (element.form_type == 'checkbox') {
        if (value && value.length > 0) {
          return value.join(',')
        }
        return ''
      }

      return value
    },

    /**
     * 员工编辑
     * 关联模块编辑
     * 附件选择
     * 产品类别
     */
    arrayValueChange(data, item) {
      this.editForm[item.field] = data.value || []
    },

    // 获取自定义字段
    getEditFieldData() {
      // 获取自定义字段的更新时间
      var params = {
        // label: crmTypeModel[this.crmType],
        // id: this.id
        id: this.id,
        types: crmTypeModel[this.crmType],
        action_id: this.id,
        module: 'crm',
        controller: this.crmType,
        action: 'read',
        system: 1
      }

      filedGetFieldAPI(params)
        .then(res => {
          console.log({ res })
          const editFieldData = res.data || []
          const editRules = {}
          editFieldData.forEach(item => {
            item.isEdit = false
            const authList = this.getItemRulesArrayFromItem(item)
            if (authList && authList.length) {
              editRules[item.field] = authList
            }
          })

          this.editFieldData = editFieldData
          this.editRules = editRules
        })
        .catch(() => {
        })
    },

    /**
     * 不验证字段必填
     */
    ingnoreRequiredField(data) {
      if (this.crmType == 'contract' && data.field == 'num') {
        return data.autoGeneNumber == 1
      } else if (this.crmType == 'receivables' && data.field == 'number') {
        return data.autoGeneNumber == 1
      } else if (this.crmType == 'visit' && data.field == 'visit_number') {
        return data.autoGeneNumber == 1
      }

      return false
    },

    /**
     * item 当行数据源
     */
    getItemRulesArrayFromItem(item) {
      var tempList = []
      // 验证必填
      if (item.is_null == 1 && !this.ingnoreRequiredField(item)) {
        var validateIsNull = (rule, value, callback) => {
          if (!rule.item || !rule.item.isEdit) {
            return callback()
          }
          if (isEmpty(value)) {
            callback(new Error(item.name + '不能为空'))
          } else {
            callback()
          }
        }
        tempList.push({
          validator: validateIsNull,
          item: item,
          trigger: []
        })
      }

      // 验证唯一
      if (item.is_unique == 1) {
        var validateUnique = (rule, value, callback) => {
          if ((isArray(value) && value.length == 0) || !value) {
            callback()
          } else {
            var validatesParams = {
              field: item.field,
              types: 'crm_' + this.crmType,
              id: this.id
            }
            validatesParams.fieldId = item.fieldId
            if (isArray(value)) {
              let postValue = ''
              if (value.length > 0) {
                if (
                  rule.item.form_type == 'user' ||
                  rule.item.form_type == 'single_user' ||
                  rule.item.form_type == 'structure'
                ) {
                  postValue = value
                    .map(valueItem => {
                      return (rule.item.form_type == 'user' || rule.item.form_type == 'single_user')
                        ? valueItem.userId
                        : valueItem.id
                    })
                    .join(',')
                } else if (rule.item.field == 'categoryId') {
                  if (value && value.length) {
                    postValue = value[value.length - 1]
                  } else {
                    postValue = ''
                  }
                } else if (rule.item.form_type == 'checkbox') {
                  postValue = value.join(',')
                }
              }
              validatesParams.val = postValue
            } else {
              validatesParams.val = value
            }
            validatesParams.batchId = this.detail.batchId
            filedValidatesAPI(validatesParams)
              .then(res => {
                // code 200 通过
                if (res.code == 200) {
                  callback()
                } else {
                  callback(new Error(item.name + '已存在'))
                }
              })
              .catch(error => {
                callback(new Error(error.msg ? error.msg : '验证出错'))
              })
          }
        }
        tempList.push({
          validator: validateUnique,
          item: item,
          trigger:
            item.form_type == 'checkbox' || item.form_type == 'select'
              ? []
              : []
        })
      }

      // 特殊字符
      if (item.form_type == 'number') {
        var validateCRMNumber = (rule, value, callback) => {
          if (!rule.item || !rule.item.isEdit) {
            return callback()
          }
          if (!value || value == '' || regexIsCRMNumber(value)) {
            callback()
          } else {
            callback(new Error('数字的整数部分须少于15位，小数部分须少于4位'))
          }
        }
        tempList.push({
          validator: validateCRMNumber,
          item: item,
          trigger: []
        })
      } else if (item.form_type == 'floatnumber') {
        var validateCRMMoneyNumber = (rule, value, callback) => {
          if (!rule.item || !rule.item.isEdit) {
            return callback()
          }
          if (!value || value == '' || regexIsCRMMoneyNumber(value)) {
            callback()
          } else {
            callback(new Error('货币的整数部分须少于15位，小数部分须少于2位'))
          }
        }
        tempList.push({
          validator: validateCRMMoneyNumber,
          item: item,
          trigger: []
        })
      } else if (item.form_type == 'mobile') {
        var validateCRMMobile = (rule, value, callback) => {
          if (!rule.item || !rule.item.isEdit) {
            return callback()
          }
          if (!value || value == '' || regexIsCRMMobile(value)) {
            callback()
          } else {
            callback(new Error('手机格式有误'))
          }
        }
        tempList.push({
          validator: validateCRMMobile,
          item: item,
          trigger: ['blur', 'change']
        })
      } else if (item.form_type == 'email') {
        var validateCRMEmail = (rule, value, callback) => {
          if (!rule.item || !rule.item.isEdit) {
            return callback()
          }
          if (!value || value == '' || regexIsCRMEmail(value)) {
            callback()
          } else {
            callback(new Error('邮箱格式有误'))
          }
        }
        tempList.push({
          validator: validateCRMEmail,
          item: item,
          trigger: ['blur', 'change']
        })
      }
      return tempList
    }
  }
}
</script>

<style lang="scss" scoped>
.b-cont {
  position: relative;
  padding: 15px;
  height: 100%;
  overflow-y: auto;
  overflow-y: overlay;

  &__handle {
    position: absolute;
    text-align: right;
    right: 20px;
    width: 100%;
    z-index: 3;
  }
}

.section {
  margin-top: 0;
  /deep/ .content {
    overflow: hidden;
  }
}


.b-cells + .b-cells {
  margin-top: 25px;
}

.b-cell {
  padding: 0 10px;
}

.el-form--flex {
  margin: 20px 10px 0;
  /deep/ .el-form-item {
    padding: 0 40px 0 15px;
    margin-bottom: 10px;
    max-width: 100%;
    .el-form-item__content {
      position: relative;
      min-height: 40px;
    }

    .el-form-item__label {
      color: #777;
      font-size: 13px;
      line-height: 30px;
    }

    &:hover {
      .form-item__edit{
        display: inline;
      }
    }
  }
}

.form-item__value {
  font-size: 13px;
  color: #333;
  line-height: 30px;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
}

.form-item__edit {
  margin-left: 5px;
  font-size: 14px;
  color: #999;
  cursor: pointer;
  display: none;
  flex-shrink: 0;

  &:hover {
    color: $xr-color-primary;
  }
}

.can-check {
  color: $xr-color-primary !important;
  cursor: pointer;
}

.is-block {
  flex-basis: 100% !important;
}

.b-cell-b {
  width: auto;
  .b-cell-name {
    width: 100px;
    margin-right: 10px;
    font-size: 13px;
    flex-shrink: 0;
    color: #777;
  }
  .b-cell-value {
    font-size: 13px;
    color: #333;
    line-height: 30px;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
  }
}
</style>
