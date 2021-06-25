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
        :rules="currentEditRules"
        :ref="`editForm${mainIndex}`"
        class="el-form--flex"
        label-position="left"
        label-width="100px">
        <el-form-item
          v-for="(item, index) in mainItem.list"
          v-if="getShowValue(item)"
          :key="index"
          :prop="item.field"
          :class="[{'is-block': isBlockShowField(item)},, `is-${item.form_type}`]">
          <span slot="label">
            {{ item.name }}
          </span>
          <template v-if="item.isEdit">
            <wk-field
              :item="item"
              :index="index"
              :field-from="editForm"
              :ignore-fields="ignoreFields"
              @change="formChange"
            >
              <template slot-scope="{ data, index }">
                <el-select
                  v-if="data.form_type === 'business_status'"
                  v-model="editForm[data.fieldName]"
                  style="width: 100%;"
                  clearable>
                  <el-option
                    v-for="(optionItem, index) in getFieldOption(data)"
                    :key="index"
                    :label="optionItem.name"
                    :value="optionItem.value"/>
                </el-select>
                <el-select
                  v-if="data.fieldName == 'status'"
                  v-model="editForm[data.fieldName]"
                  style="width: 100%;">
                  <el-option
                    v-for="item in data.setting"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"/>
                </el-select>
                <crm-relative-cell
                  v-else-if="data.form_type === 'contacts' ||
                    data.form_type === 'customer' ||
                    data.form_type === 'contract' ||
                  data.form_type === 'business'"
                  :relative-type="data.form_type"
                  :value="editForm[data.fieldName]"
                  @value-change="arrayValueChange($event, data)"
                />
                <xh-prouct-cate
                  v-else-if="data.form_type === 'category'"
                  :value="editForm[data.fieldName]"
                  @value-change="arrayValueChange($event, data)"
                />
                <el-select
                  v-if="data.fieldName == 'invoice_type'"
                  v-model="editForm[data.fieldName]"
                  style="width: 100%;">
                  <el-option
                    v-for="item in invoiceTypeOptions"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"/>
                </el-select>

              </template>
            </wk-field>

            <!-- <el-input
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
            /> -->
          </template>
          <template v-else>
            <!-- <flexbox v-if="item.form_type === 'file'" style="min-height: 40px;">
              <file-list-view :list="item.value || []" />
              <i v-if="getEditAuth(item)" class="wk wk-edit form-item__edit" @click="editClick(item)" />
            </flexbox> -->
            <div
              v-if="item.form_type === 'map_address'"
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
            <flexbox
              v-else
              :class="{'can-check':isModule(item)}"
              align="stretch"
              style="width: 100%;"
              class="form-item__value">
              <wk-field-view
                :props="item"
                :form_type="item.form_type"
                :value="item.value"
                :ignore-fields="ignoreFields"
              >
                <template slot-scope="{ data }">
                  <span v-if="data.form_type === 'business_type'">{{ detail ? detail.typeName : '' }}</span>
                  <span v-else-if="data.form_type === 'business_status'">{{ detail ? detail.statusName : '' }}</span>
                  <span v-else-if="data.form_type === 'category'">{{ detail ? detail.categoryName : '' }}</span>
                  <span v-else-if="data.form_type === 'receivables_plan'">{{ detail ? detail.planNum : '' }}</span>
                  <span v-else-if="ignoreFields.includes(data.props.field) && data.props.field === 'status'">{{ getSelectShowValue(data) }}</span>
                  <span v-else @click="checkModuleDetail(data)">{{ getCommonShowValue(data) }}</span>
                </template>
              </wk-field-view>

              <i v-if="getEditAuth(item)" class="wk wk-edit form-item__edit" @click.stop="editClick(item, index)" />
            </flexbox>
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
import { filedGetInformationAPI, filedUpdateTableFieldAPI } from '@/api/crm/common'
// import { crmMarketingInformationAPI } from '@/api/crm/marketing'

import {
  XhUserCell,
  XhStructureCell,
  XhFiles,
  CrmRelativeCell,
  XhProuctCate,
  XhBusinessStatus,
  XhReceivablesPlan
} from '@/components/CreateCom'
import WkFieldView from '@/components/NewCom/WkForm/WkFieldView'
import WkField from '@/components/NewCom/WkForm/WkField'
import crmTypeModel from '@/views/crm/model/crmTypeModel'
import Sections from '../components/Sections'
import MapView from '@/components/MapView' // 地图详情
import FileListView from '@/components/FileListView'
import CheckStatusMixin from '@/mixins/CheckStatusMixin'
import { separator } from '@/filters/vueNumeralFilter/filters'
import {
  objDeepCopy
} from '@/utils'
import { isArray, isObject, isEmpty } from '@/utils/types'
import { mapGetters } from 'vuex'
import { getWkDateTime } from '@/utils'

import { getFormFieldShowName } from '@/components/NewCom/WkForm/utils'
import CustomFieldsMixin from '@/mixins/CustomFields'

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
    CRMFullScreenDetail: () => import('@/components/CRMFullScreenDetail'),
    WkFieldView,
    WkField
  },
  filters: {
  },
  mixins: [CheckStatusMixin, CustomFieldsMixin],
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
    filedList: Array,
    // 系统消息之前的数据
    otherList: Array,
    // 忽略的字段直接输出
    ignoreFields: {
      type: Array,
      default: () => {
        return []
      }
    }
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
      allForm: {}, // 用于逻辑表单刷新
      currentEditRules: {}, // 当前编辑字段规则
      editOptions: {},
      editFieldData: [],
      invoiceTypeOptions: [{
        name: '增值税专用发票',
        value: 1
      }, {
        name: '增值税普通发票',
        value: 2
      }, {
        name: '国税通用机打发票',
        value: 3
      }, {
        name: '地税通用机打发票',
        value: 4
      }, {
        name: '收据',
        value: 5
      }]
    }
  },
  inject: ['rootTabs'],
  computed: {
    ...mapGetters(['crm'])
  },
  watch: {
    id(val) {
      if (!this.filedList) {
        this.getBaseInfo(true)
      }
    },

    filedList() {
      this.list = this.filedList
    },

    'rootTabs.currentName'(val) {
      if (val === 'CRMEditBaseInfo') {
        this.getBaseInfo(false)
      }
    }

  },
  created() {
    this.$bus.on('crm-detail-update', (data) => {
      this.getBaseInfo(false)
    })
  },
  beforeDestroy() {
    this.$bus.off('crm-detail-update')
  },
  mounted() {
    if (this.filedList) {
      this.list = this.filedList
    } else {
      this.getBaseInfo(true)
    }
  },
  methods: {

    /**
     * 获取基础信息
     */
    getBaseInfo(loading) {
      this.loading = !!loading
      if (this.crmType === 'marketing') {
        // crmMarketingInformationAPI().then(res => {
        //   this.list = res.data || []
        //   this.loading = false
        // }).catch(() => {
        //   this.loading = false
        // })
      } else {
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
            // 编辑用信息
            const editFieldData = []
            const editRules = {}

            res.data.forEach(item => {
              if (item.form_type === 'floatnumber') {
                item.value = separator(item.value)
              } else if (item.form_type === 'date') {
                item.value = getWkDateTime(item.value)
              }
              if (item.system == 1) {
                systemList.push(item)
              } else if (item.form_type !== 'product') {
                baseList.push(item)
              }
            })
            // 逻辑表单逻辑
            const assistIds = this.getFormAssistIds([baseList])
            baseList.forEach(item => {
              this.getFormItemDefaultProperty(item, false)
              item.show = !assistIds.includes(item.formAssistId)

              if (this.ignoreFields.includes(item.field)) {
              // 防止影响普通单选的验证方式 该方法必须在获取值之上
                delete item.optionsData
              }

              const canEdit = this.getItemIsCanEdit(item, 'update')
              // 是否能编辑权限
              const copyItem = objDeepCopy(item)
              if (item.show && canEdit) {
                editRules[item.field] = this.getRules(copyItem)
              }

              // 是否可编辑
              item.disabled = !canEdit

              // 特殊字段允许多选
              this.getItemRadio(item, item)

              // 表格为了展示，提前处理为编辑数据
              if (item.form_type === 'detail_table') {
                if (!isEmpty(item.value)) {
                  item.value = this.getItemValue(item, null, 'update')
                }
                this.allForm[item.field] = item.value || null
              } else {
              // copyItem 避免修改原始item.value
                this.allForm[item.field] = this.getItemValue(copyItem, null, 'update')
              }

              editFieldData.push(item)
            })

            // 编辑逻辑赋值
            this.editFieldData = editFieldData
            this.editRules = editRules

            if (this.otherList) {
              this.list = [
                {
                  name: '基本信息',
                  list: baseList
                },
                ...this.otherList,
                {
                  name: '系统信息',
                  list: systemList
                }
              ]
            } else {
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
            }

            this.editCancel()
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    /**
     * change
     */
    formChange(field, index, value, valueList) {
      if ([
        'select',
        'checkbox'
      ].includes(field.form_type) &&
          field.remark === 'options_type' &&
          field.optionsData) {
        const { fieldForm, fieldRules } = this.getFormContentByOptionsChange([this.editFieldData], { ...this.allForm, ...this.editForm }, this.editRules, null, 'update')

        const editForm = {}
        const currentEditRules = {}

        this.editFieldData.forEach(item => {
          // 重新获取当前可编辑字段的值和规则
          if (item.show && item.isEdit) {
            editForm[item.field] = fieldForm[item.field]
            currentEditRules[item.field] = fieldRules[item.field]
          }

          // 不展示的字段，但处在可编辑状态，置为不能编辑
          if (!item.show && item.isEdit) {
            item.isEdit = false
          }
        })
        this.editForm = editForm
        this.currentEditRules = currentEditRules
      }
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
        'file',
        'detail_table'].includes(item.form_type)
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
      if (this.isModule(item)) {
        return this.getModuleName(item)
      } else {
        const field = item.props
        if (field.fieldName === 'invoice_type') {
          const dataItem = this.invoiceTypeOptions.find(o => o.value == item.value)
          return dataItem ? dataItem.name : ''
        }
        return getFormFieldShowName(item.form_type, item.value, '', item)
      }
    },

    /**
     * 查看详情
     */
    checkModuleDetail(data) {
      const dataValue = data.value
      if (this.isModule(data)) {
        let id = ''
        if (isObject(dataValue)) {
          id = dataValue[`${data.form_type}_id`]
        } else if (isArray(dataValue) && dataValue.length > 0) {
          id = dataValue[0][`${data.form_type}_id`]
        }

        if (id) {
          this.fullDetailType = data.form_type
          this.fullDetailId = id
          this.showFullDetail = true
        }
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
      let dataValue = objDeepCopy(this.allForm[item.fieldName])
      // 明细表格是空时，需要填充一条空数据，展示时未处理。这里增加
      if (item.formType === 'detail_table' && isEmpty(dataValue)) {
        dataValue = this.getItemValue(objDeepCopy(item), null, 'update')
      }
      this.$set(this.editForm, item.fieldName, dataValue)
      this.$set(item, 'isEdit', true)
      this.$set(this.editOptions, item.fieldName, item)
      this.$set(this.currentEditRules, item.fieldName, this.editRules[item.fieldName] || [])
      this.showSaveButton = true
    },

    editCancel() {
      if (this.$refs.editForm0[0].clearValidate) {
        this.$refs.editForm0[0].clearValidate()
      }

      this.$nextTick(() => {
        // this.list.forEach(bItem => {
        //   bItem.list.forEach(item => {
        //     item.isEdit = false
        //   })
        // })
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
      const list = []
      for (let index = 0; index < this.editFieldData.length; index++) {
        const field = this.editFieldData[index]
        // 获取当前编辑 和 隐藏的字段
        if (field.formType !== 'desc_text' && (field.isEdit || !field.show)) {
          list.push({
            fieldName: field.fieldName,
            field: field.field,
            field_type: field.field_type,
            name: field.name,
            type: field.type,
            field_id: field.field_id,
            value: field.show ? this.getRealParams(field, this.editForm[field.fieldName]) : null
          })
        }
      }

      filedUpdateTableFieldAPI({
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
        this.$emit('handle', { type: 'save-success' }) // 刷新数据

        // this.refreshData(true)
      }).catch(() => {
        this.loading = false
      })
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
     * 获取单选值
     */
    getSelectShowValue(data) {
      const field = data.props
      const value = data.value
      if (value !== null) {
        const dataValue = field.setting.find(o => o.value === value)
        return dataValue ? dataValue.name : ''
      }
      return ''
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

    &.is-desc_text {
      .el-form-item__content {
        margin-left: 0 !important;
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
  .wk-field-view {
    width: 0;
    flex: 1;
  }
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
