<template>
  <xr-create
    :loading="loading"
    :title="title"
    @close="hidenView"
    @save="saveClick">

    <!-- 基本信息 -->
    <create-sections title="基本信息">
      <el-form
        ref="crmForm"
        :model="fieldForm"
        :rules="fieldRules"
        :validate-on-rule-change="false"
        class="wk-form"
        label-position="top">
        <wk-form-items
          v-for="(children, index) in fieldList"
          :key="index"
          :field-from="fieldForm"
          :field-list="children"
          @change="formChange"
        >
          <template slot-scope="{ data }">
            <xh-expenses
              v-if="data && data.form_type == 'examine_cause'"
              :value="fieldForm[data.field]"
              @value-change="otherChange($event, data)"
            />
            <xh-leaves
              v-if="data && data.form_type == 'business_cause'"
              :value="fieldForm[data.field]"
              @value-change="otherChange($event, data)"
            />
          </template>
        </wk-form-items>
      </el-form>
    </create-sections>
    <!-- 图片附件 -->
    <div class="img-accessory">
      <div class="img-box">
        <el-upload
          ref="imageUpload"
          :action="crmFileSaveUrl"
          :headers="httpHeader"
          :data="{type: 'img', batchId: batchId}"
          :on-preview="handleFilePreview"
          :before-remove="beforeRemove"
          :on-success="imgFileUploadSuccess"
          :file-list="imgFileList"
          name="file"
          multiple
          accept="image/*"
          list-type="picture-card">
          <p class="add-img">
            <span class="el-icon-picture"/>
            <span>添加图片</span>
          </p>
          <i class="el-icon-plus"/>
        </el-upload>
      </div>
      <p class="add-accessory">
        <el-upload
          ref="fileUpload"
          :action="crmFileSaveUrl"
          :headers="httpHeader"
          :data="{type: 'file', batchId: batchId}"
          :on-preview="handleFilePreview"
          :before-remove="handleFileRemove"
          :on-success="fileUploadSuccess"
          :file-list="fileList"
          name="file"
          multiple
          accept="*.*">
          <p>
            <i class="wukong wukong-file" />
            添加附件
          </p>
        </el-upload>
      </p>
    </div>
    <!-- 相关信息 -->
    <related-business
      :selected-infos="relatedBusinessInfo"
      class="related-business"
      @value-change="relativeValueChange"/>
    <!-- 审核信息 -->
    <create-sections
      v-if="showExamine"
      title="审核信息">
      <template slot="header">
        <div
          v-if="examineInfo.config===1 || examineInfo.config===0"
          class="examine-type">{{ examineInfo.config===1 ? '固定审批流' : '授权审批人' }}</div>
        <el-tooltip
          v-if="examineInfo && examineInfo.remark"
          :content="examineInfo.remark"
          effect="dark"
          placement="top">
          <i class="wk wk-help wk-help-tips" style="height: 13px;"/>
        </el-tooltip>
      </template>
      <create-examine-info
        ref="examineInfo"
        :types-id="categoryId"
        types="oa_examine"
        @value-change="examineValueChange"/>
    </create-sections>


    <!-- <div class="handle-bar">
        <el-button
          class="handle-button"
          @click.native="hidenView">取消</el-button>
        <el-button
          v-debounce="saveField"
          class="handle-button"
          type="primary">保存</el-button>
      </div> -->

  </xr-create>
</template>
<script type="text/javascript">
import { filedGetFieldAPI } from '@/api/crm/common'
import { oaExamineGetFieldAPI } from '@/api/oa/examine'
import { crmFileDeleteAPI, crmFileSaveUrl } from '@/api/common'
import { oaExamineSaveAndUpdateAPI } from '@/api/oa/examine'

// import CreateView from '@/components/CreateView'
import WkFormItems from '@/components/NewCom/WkForm/WkFormItems'

import XrCreate from '@/components/XrCreate'
import CreateSections from '@/components/CreateSections'
import CreateExamineInfo from '@/components/Examine/CreateExamineInfo'
import XhExpenses from './XhExpenses' // 报销事项
import XhLeaves from './XhLeaves' // 出差事项
import RelatedBusiness from './RelatedBusiness'
import { isEmpty } from '@/utils/types'
import CustomFieldsMixin from '@/mixins/CustomFields'
// import WkApprovalFlowApplyMixin from '@/components/Examine/mixins/WkApprovalFlowApply'


import axios from 'axios'

import {
  guid,
  objDeepCopy,
  getImageData
} from '@/utils'

import {
  XhInput,
  XhTextarea,
  XhSelect,
  XhMultipleSelect,
  XhDate,
  XhDateTime,
  XhUserCell,
  XhStructureCell,
  XhFiles,
  CrmRelativeCell
} from '@/components/CreateCom'

export default {
  name: 'ExamineCreateView', // 所有新建效果的view
  components: {
    XrCreate,
    CreateSections,
    CreateExamineInfo, // 审核信息
    XhInput,
    XhTextarea,
    XhSelect,
    XhMultipleSelect,
    XhDate,
    XhDateTime,
    XhUserCell,
    XhStructureCell,
    XhFiles,
    CrmRelativeCell,
    XhExpenses,
    XhLeaves,
    RelatedBusiness,
    WkFormItems
  },

  filters: {},
  mixins: [CustomFieldsMixin],
  props: {
    // 类型ID
    categoryId: {
      type: [String, Number],
      default: ''
    },
    type: [String, Number],
    // 类型名称
    categoryTitle: {
      type: String,
      default: ''
    },
    /**
     * save:添加、update:编辑(action_id)、read:详情、index:列表
     * relative: 相关 添加
     */
    action: {
      type: Object,
      default: () => {
        return {
          type: 'save',
          id: ''
        }
      }
    }
  },
  data() {
    return {
      // 标题展示名称
      title: '',
      loading: false,
      // 自定义字段验证规则
      // crmRules: {},
      // // 自定义字段信息表单
      // crmForm: {
      //   crmFields: []
      // },
      baseFields: [],
      fieldList: [],
      fieldForm: {},
      fieldRules: {},
      batchId: guid(),
      // 图片附件
      imgFileList: [],
      fileList: [],
      // 审批信息
      examineInfo: {},
      relatedBusinessInfo: {} // 相关信息信息
    }
  },
  computed: {
    /** 审批 下展示审批人信息 */
    showExamine() {
      return true
    },
    crmFileSaveUrl() {
      return crmFileSaveUrl
    },
    httpHeader() {
      return {
        'authKey': axios.defaults.headers['authKey'],
        'sessionId': axios.defaults.headers['sessionId']
      }
    }
  },
  watch: {},
  mounted() {
    // 获取title展示名称
    document.body.appendChild(this.$el)
    this.title = this.getTitle()
    this.getField()

    if (this.action.type == 'update') {
      this.batchId = this.action.data.batchId
    }
  },
  destroyed() {
    // remove DOM node after destroy
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  methods: {
    // 相关信息的值更新
    relativeValueChange(data) {
      this.relatedBusinessInfo = data.value
    },
    /**
     * change
     */
    formChange(field, index, value, valueList) {
      // 审批流逻辑
      // this.debouncedGetWkFlowList(field.field, this.fieldForm)

      if ([
        'select',
        'checkbox'
      ].includes(field.form_type) &&
          field.remark === 'options_type' &&
          field.optionsData) {
        const { fieldForm, fieldRules } = this.getFormContentByOptionsChange(this.fieldList, this.fieldForm)
        this.fieldForm = fieldForm
        this.fieldRules = fieldRules
      }
    },
    // 审批信息值更新
    examineValueChange(data) {
      this.examineInfo = data
    },

    /**
     * change
     */
    otherChange(data, field) {
      // 出差事项
      if (data.value.update) {
        if (field.form_type == 'business_cause') {
          this.$set(this.fieldForm, 'duration', data.value.duration)
        } else if (field.form_type == 'examine_cause') {
          this.$set(this.fieldForm, 'money', data.value.money)
        }
      }
      this.$set(this.fieldForm, field.field, data.value)
    },

    // 字段的值更新
    // fieldValueChange(data) {
    //   var item = this.crmForm.crmFields[data.index]
    //   item.value = data.value

    //   // 出差事项
    //   if (item.data.form_type == 'business_cause' && item.value.update) {
    //     for (let index = 0; index < this.crmForm.crmFields.length; index++) {
    //       const element = this.crmForm.crmFields[index]
    //       if (element.key === 'duration') {
    //         element.value = item.value.duration
    //         break
    //       }
    //     }
    //     // 报销
    //   } else if (item.data.form_type == 'examine_cause' && item.value.update) {
    //     for (let index = 0; index < this.crmForm.crmFields.length; index++) {
    //       const element = this.crmForm.crmFields[index]
    //       if (element.key === 'money') {
    //         element.value = item.value.money
    //         break
    //       }
    //     }
    //   }

    //   // 无事件的处理 后期可换成input实现
    //   if (
    //     item.data.form_type == 'user' ||
    //     item.data.form_type == 'structure' ||
    //     item.data.form_type == 'file'
    //   ) {
    //     this.$refs.crmForm.validateField('crmFields.' + data.index + '.value')
    //   }
    // },
    // 获取自定义字段
    getField() {
      this.loading = true
      // 获取自定义字段的更新时间
      var params = {
        types: 'oa_examine',
        module: 'oa',
        controller: 'examine',
        action: 'save',
        types_id: this.categoryId,
        format: 2
      }
      // params.label = 10
      // params.id = this.categoryId

      // 进行编辑操作
      if (this.action.type == 'update') {
        // params.examineId = this.action.id
        // params.isDetail = 2 // 1详情 2 编辑
        params.action = 'update'
        params.action_id = this.action.id
      }

      const request = {
        update: oaExamineGetFieldAPI,
        save: filedGetFieldAPI
      }[this.action.type]
      request(params)
        .then(res => {
          this.getcrmRulesAndModel(res.data)
          if (this.action.type == 'update') {
            this.getUpdateOtherInfo()
          }
          this.loading = false
        })
        .catch((e) => {
          console.log(e)
          this.loading = false
        })
    },
    // 更新图片附件相关信息信息
    getUpdateOtherInfo() {
      this.imgFileList = objDeepCopy(this.action.data.imgList || []).map(item => {
        if (item.file_path) {
          item.url = item.file_path
        }
        return item
      })

      for (let index = 0; index < this.imgFileList.length; index++) {
        // this.setImageList(this.imgFileList[index], index)
      }

      this.fileList = objDeepCopy(this.action.data.fileList || []).map(item => {
        if (item.file_path) {
          item.url = item.file_path
        }
        return item
      })

      this.relatedBusinessInfo = {
        contacts: (this.action.data.contactsList || []).map(item => {
          if (item.id) {
            item.contacts_id = item.contacts_id
          }
          return item
        }),
        customer: (this.action.data.customerList || []).map(item => {
          if (item.id) {
            item.customer_id = item.customer_id
          }
          return item
        }),
        business: (this.action.data.businessList || []).map(item => {
          if (item.id) {
            item.business_id = item.business_id
          }
          return item
        }),
        contract: (this.action.data.contractList || []).map(item => {
          if (item.id) {
            item.contract_id = item.contract_id
          }
          return item
        })
      } // 相关信息信息
    },
    /**
     * 获取图片内容
     */
    setImageList(item, index) {
      getImageData(item.url).then((data) => {
        item.url = data.src
        this.imgFileList.splice(index, 1, item)
      }).catch(() => {})
    },
    // 根据自定义字段获取自定义字段规则
    getcrmRulesAndModel(list) {
      const assistIds = this.getFormAssistIds(list)
      const baseFields = []
      const fieldList = []
      const fieldRules = {}
      const fieldForm = {}
      list.forEach(children => {
        const fields = []
        children.forEach(item => {
          const temp = this.getFormItemDefaultProperty(item)
          temp.show = !assistIds.includes(item.formAssistId)

          fieldRules[temp.field] = this.getRules(item)

          /**
         *
         * 规则数据
         */
          // var tempList = []
          // 验证必填
          if (item.is_null == 1) {
            if (item.form_type == 'business_cause') {
              var validateFunction = (rule, value, callback) => {
                if (!value.list) {
                  callback(new Error('请完善明细'))
                } else {
                  var hasError = false
                  for (let index = 0; index < value.list.length; index++) {
                    const item = value.list[index]
                    const keys = [
                      'start_address',
                      'end_address',
                      'start_time',
                      'end_time',
                      'duration'
                    ]
                    for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
                      const key = keys[keyIndex]
                      if (key == 'duration') {
                        if (item.duration <= 0) {
                          hasError = true
                          callback(new Error(`行程明细（${index + 1}）时长应大于0`))
                          break
                        }
                      } else if (isEmpty(item[key])) {
                        hasError = true
                        callback(new Error('请完善明细'))
                        break
                      }
                    }
                  }
                  if (!hasError) {
                    callback()
                  }
                }
              }

              fieldRules[temp.field] = [{
                validator: validateFunction,
                trigger: []
              }]
            } else if (item.form_type == 'examine_cause') {
              var validateFunction = (rule, value, callback) => {
                if (!value.list) {
                  callback(new Error('请完善明细'))
                } else {
                  var hasError = false
                  for (let index = 0; index < value.list.length; index++) {
                    const item = value.list[index]
                    const keys = [
                      'start_address',
                      'end_address',
                      'start_time',
                      'end_time',
                      'traffic',
                      'stay',
                      'diet',
                      'other'
                    ]
                    for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
                      const key = keys[keyIndex]
                      if (isEmpty(item[key])) {
                        hasError = true
                        callback(new Error('请完善明细'))
                        break
                      }
                    }

                    if (item.money <= 0) {
                      hasError = true
                      callback(new Error(`费用明细（${index + 1}）合计应大于0`))
                      break
                    }
                  }
                  if (!hasError) {
                    callback()
                  }
                }
              }

              fieldRules[temp.field] = [{
                validator: validateFunction,
                trigger: []
              }]
            } else {
            // 出差审批 差旅报销 提示修改
              if ((item.field == 'duration' && this.type == 3) ||
          (item.field == 'money' && this.type == 5)) {
                fieldRules[temp.field] = [{
                  required: true,
                  message: '请完善明细',
                  trigger: ['blur', 'change']
                }]
              }
              // else {
              //   tempList.push({
              //     required: true,
              //     message: item.name + '不能为空',
              //     trigger: ['blur', 'change']
              //   })
              // }
            }
          }
          // disabled
          if (
          // 出差审批 差旅报销
            (item.field == 'duration' && this.type == 3) ||
          (item.field == 'money' && this.type == 5)
          ) {
            temp.disabled = true
          }
          // 特殊字段允许多选
          this.getItemRadio(item, temp)

          // 获取默认值
          if (item.form_type == 'examine_cause' ||
          item.form_type == 'business_cause') {
            if (this.action.type == 'update') {
              const itemValue = item.value || []
              const list = itemValue.map(element => {
                if (element.img) {
                  element.imgList = objDeepCopy(element.img || [])
                } else {
                  element.imgList = []
                }
                return element
              })
              fieldForm[temp.field] = { list: list } // 编辑的值 在value字段
            } else {
              fieldForm[temp.field] = {} // 加入默认值 可能编辑的时候需要调整
            }
          } else {
            if (temp.show) {
              fieldForm[temp.field] = this.getItemValue(item, this.action.data, this.action.type)
            }
          }
          //   /**
          //  * 表单数据
          //  */
          //   if (item.form_type == 'datetime') {
          //   // 返回的时间戳  要处理为格式化时间（编辑的时候）
          //   // 关联产品信息比较多 用字典接收
          //     var params = {}

          //     if (this.action.type == 'update') {
          //       params['value'] = item.value || ''
          //     } else {
          //       params['value'] = item.defaultValue // 加入默认值 可能编辑的时候需要调整
          //     }

          //     params['key'] = item.field || item.name
          //     params['data'] = item
          //     params['disabled'] = false // 是否可交互
          //     params['styleIndex'] = showStyleIndex
          //     this.crmForm.crmFields.push(params)
          //   } else if (
          //     item.form_type == 'examine_cause' ||
          //   item.form_type == 'business_cause'
          //   ) {
          //   // 报销事项
          //     var params = {}

          //     if (this.action.type == 'update') {
          //       const list = item.value.map(element => {
          //         if (element.imgList) {
          //           element.imgList = objDeepCopy(element.imgList || []).map(item => {
          //             if (item.file_path) {
          //               item.url = item.file_path
          //             }
          //             return item
          //           })
          //         } else {
          //           element.imgList = []
          //         }
          //         return element
          //       })
          //       params['value'] = { list: list } // 编辑的值 在value字段
          //     } else {
          //       params['value'] = {} // 加入默认值 可能编辑的时候需要调整
          //     }
          //     params['key'] = item.field || item.name
          //     params['data'] = item
          //     params['disabled'] = false // 是否可交互
          //     params['showblock'] = true // 展示整行效果
          //     if (index % 2 == 0) {
          //       showStyleIndex = -1
          //     }
          //     this.crmForm.crmFields.push(params)
          //   } else if (
          //   // 出差审批 差旅报销
          //     (item.field == 'duration' && this.type == 3) ||
          //   (item.field == 'money' && this.type == 5)
          //   ) {
          //   // 报销事项
          //     var params = {}

          //     if (this.action.type == 'update') {
          //       params['value'] = item.value // 编辑的值 在value字段
          //     } else {
          //       params['value'] = item.defaultValue || '' // 加入默认值 可能编辑的时候需要调整
          //     }
          //     params['key'] = item.field || item.name
          //     params['data'] = item
          //     params['disabled'] = true // 是否可交互
          //     params['styleIndex'] = showStyleIndex
          //     this.crmForm.crmFields.push(params)
          //   } else {
          //     var params = {}
          //     if (this.action.type == 'update') {
          //       params['value'] = item.value // 编辑的值 在value字段
          //     } else {
          //       if (
          //         item.form_type == 'user' ||
          //       item.form_type == 'structure' ||
          //       item.form_type == 'file' ||
          //       item.form_type == 'category' ||
          //       item.form_type == 'customer' ||
          //       item.form_type == 'business' ||
          //       item.form_type == 'contract'
          //       ) {
          //         params['value'] = item.defaultValue
          //           ? objDeepCopy(item.defaultValue)
          //           : []
          //       } else {
          //         params['value'] = item.defaultValue || ''
          //       }
          //     }
          //     params['key'] = item.field || item.name
          //     params['data'] = item
          //     params['disabled'] = false // 是否可交互
          //     params['styleIndex'] = showStyleIndex
          //     this.crmForm.crmFields.push(params)
          //   }
          fields.push(temp)
          baseFields.push(item)
        })
        fieldList.push(fields)
      })
      this.baseFields = baseFields
      this.fieldList = fieldList
      this.fieldForm = fieldForm
      this.fieldRules = fieldRules
    },
    // 保存数据
    saveClick() {
      this.loading = true
      this.$refs.crmForm.validate(valid => {
        if (valid) {
          if (this.showExamine) {
            /** 验证审批数据 */
            this.$refs.examineInfo.validateField((result) => {
              if (result) {
                // const params = {
                //   oaExamine: { categoryId: this.categoryId },
                //   oaExamineRelation: {},
                //   field: [],
                //   oaExamineTravelList: []
                // }
                const params = {
                  file_id: [...this.fileList.map(item => {
                    if (item.response) {
                      return item.response.data.file_id
                    } else {
                      return item.file_id
                    }
                  }), ...this.imgFileList.map(item => {
                    if (item.response) {
                      return item.response.data.file_id
                    } else {
                      return item.file_id
                    }
                  })],
                  oaExamineRelation: {},
                  field: [],
                  oaExamineTravelList: []
                }
                params.category_id = this.categoryId
                this.getSubmiteParams([].concat.apply([], this.fieldList), params)
                // this.crmForm.crmFields.map(item => {
                //   params[item.data.field] = item.value
                // })
                if (this.examineInfo.config === 0) {
                  params['check_user_id'] = this.examineInfo.value[0].id
                }
                this.submiteParams(params)
              } else {
                this.loading = false
              }
            })
          } else {
            // const params = {
            //   oaExamine: { categoryId: this.categoryId },
            //   oaExamineRelation: {},
            //   field: [],
            //   oaExamineTravelList: []
            // }
            // this.getSubmiteParams(this.crmForm.crmFields, params)
            const params = {
              file_id: [...this.fileList.map(item => {
                if (item.response) {
                  return item.response.data.file_id
                } else {
                  return item.file_id
                }
              }), ...this.imgFileList.map(item => {
                if (item.response) {
                  return item.response.data.file_id
                } else {
                  return item.file_id
                }
              })],
              oaExamineRelation: {},
              field: [],
              oaExamineTravelList: []
            }
            this.crmForm.crmFields.map(item => {
              params[item.data.field] = item.value
            })
            this.submiteParams(params)
          }
        } else {
          this.loading = false
          // 提示第一个error
          if (this.$refs.crmForm.fields) {
            for (let index = 0; index < this.$refs.crmForm.fields.length; index++) {
              const ruleField = this.$refs.crmForm.fields[index]
              if (ruleField.validateState == 'error') {
                this.$message.error(ruleField.validateMessage)
                break
              }
            }
          }
          return false
        }
      })
    },
    /** 上传 */
    submiteParams(params) {
      /** 注入关联参数 */
      for (const key in this.relatedBusinessInfo) {
        const list = this.relatedBusinessInfo[key]
        params.oaExamineRelation[key + '_ids'] = list
          .map(function(item, index, array) {
            return item[key + '_id']
          })
          // .join(',')
      }

      // params.oaExamine['batchId'] = this.batchId

      if (this.action.type == 'update') {
        params.id = this.action.id
      }
      oaExamineSaveAndUpdateAPI(params)
        .then(res => {
          this.loading = false
          this.hidenView()
          this.$message.success('操作成功')
          // 回到保存成功
          this.$emit('save-success')
        })
        .catch(() => {
          this.loading = false
        })
    },
    /** 拼接上传传输 */
    getSubmiteParams(array, params) {
      for (let index = 0; index < array.length; index++) {
        const element = array[index]
        const dataValue = this.fieldForm[element.field]
        if (element.field == 'cause') {
          if (element.form_type == 'business_cause') {
            // params.oaExamineTravelList = dataValue.list
            params[element.field] = dataValue
            // params['duration'] = element.value.duration
          } else if (element.form_type == 'examine_cause') {
            // var causeList = []
            for (let index = 0; index < dataValue.list.length; index++) {
              const cause = dataValue.list[index]
              var causeCopy = Object.assign({}, cause)
              delete causeCopy['imgList']
              params.oaExamineTravelList.push(causeCopy)
            }
            params[element.field] = dataValue
          }
        } else {
          if (element.fieldType == 1) {
            params.oaExamine[element.field] = this.getRealParams(element)
          } else if (element.form_type !== 'desc_text') { //  描述文字忽略
            element.value = this.getRealParams(element, dataValue)
            params[element.field] = element.value
            // field.value = this.getRealParams(field, dataValue, data)
            // params[field.field] = field.value
          }
        }
      }
      return params
    },
    // 图片和附件
    // 上传图片
    imgFileUploadSuccess(response, file, fileList) {
      this.imgFileList = fileList
    },
    // 查看图片
    handleFilePreview(file) {
      if (file.response || file.file_id) {
        let perviewFile
        if (file.response) {
          perviewFile = file.response.data
        } else {
          perviewFile = file
        }
        this.$bus.emit('preview-image-bus', {
          index: 0,
          data: [perviewFile]
        })
      }
    },
    beforeRemove(file, fileList) {
      if (file.response || file.file_id) {
        let file_id
        if (file.response) {
          file_id = file.response.data.file_id
        } else {
          file_id = file.file_id
        }
        this.$confirm('您确定要删除该文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            crmFileDeleteAPI({
              file_id: file_id,
              module_id: file_id,
              module: 'work_task',
              save_name: file.response ? file.response.data.save_name : file.save_name
            })
              .then(res => {
                this.$message.success('操作成功')
                var removeIndex = this.getFileIndex(
                  this.$refs.imageUpload.uploadFiles,
                  file_id
                )
                if (removeIndex != -1) {
                  this.$refs.imageUpload.uploadFiles.splice(removeIndex, 1)
                }
                removeIndex = this.getFileIndex(this.imgFileList, file_id)
                if (removeIndex != -1) {
                  this.imgFileList.splice(removeIndex, 1)
                }
              })
              .catch(() => {})
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
        return false
      } else {
        return true
      }
    },
    // 附件索引
    getFileIndex(files, file_id) {
      var removeIndex = -1
      for (let index = 0; index < files.length; index++) {
        const item = files[index]
        let itemFileId
        if (item.response) {
          itemFileId = item.response.data.file_id
        } else {
          itemFileId = item.file_id
        }
        if (itemFileId == file_id) {
          removeIndex = index
          break
        }
      }
      return removeIndex
    },
    fileUploadSuccess(response, file, fileList) {
      this.fileList = fileList
    },
    handleFileRemove(file, fileList) {
      if (file.response || file.file_id) {
        let file_id
        if (file.response) {
          file_id = file.response.data.file_id
        } else {
          file_id = file.file_id
        }
        this.$confirm('您确定要删除该文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            crmFileDeleteAPI({
              module_id: file_id,
              module: 'work_task',
              file_id: file_id,
              save_name: file.response ? file.response.data.save_name : file.save_name
            })
              .then(res => {
                this.$message.success('操作成功')
                var removeIndex = this.getFileIndex(
                  this.$refs.fileUpload.uploadFiles,
                  file_id
                )
                if (removeIndex != -1) {
                  this.$refs.fileUpload.uploadFiles.splice(removeIndex, 1)
                }
                removeIndex = this.getFileIndex(this.fileList, file_id)
                if (removeIndex != -1) {
                  this.fileList.splice(removeIndex, 1)
                }
              })
              .catch(() => {})
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
        return false
      } else {
        return true
      }
    },
    // // 关联客户 联系人等数据要特殊处理
    // getRealParams(element) {
    //   if (
    //     element.key == 'customer_id' ||
    //     element.key == 'contacts_id' ||
    //     element.key == 'business_id' ||
    //     element.key == 'leads_id' ||
    //     element.key == 'contract_id'
    //   ) {
    //     if (element.value.length) {
    //       return element.value[0][element.key]
    //     } else {
    //       return ''
    //     }
    //   } else if (element.key == 'categoryId') {
    //     if (element.value.length) {
    //       return element.value[element.value.length - 1]
    //     } else {
    //       return ''
    //     }
    //   } else if (
    //     element.data.form_type == 'user' ||
    //     element.data.form_type == 'structure'
    //   ) {
    //     return element.value
    //       .map(function(item, index, array) {
    //         return element.data.form_type == 'user' ? item.id : item.id
    //       })
    //       .join(',')
    //   } else if (element.data.form_type == 'file') {
    //     if (element.value && element.value.length > 0) {
    //       return element.value[0].batchId
    //     }
    //     return ''
    //   } else if (element.data.form_type == 'checkbox') {
    //     if (element.value && element.value.length > 0) {
    //       return element.value.join(',')
    //     }
    //     return ''
    //   }

    //   return element.value
    // },
    hidenView() {
      this.$emit('hiden-view')
    },
    // 根据类型获取标题展示名称
    getTitle() {
      return this.action.type == 'update'
        ? '编辑' + this.categoryTitle
        : '新建' + this.categoryTitle
    },
    // 获取左边padding
    getPaddingLeft(item, index) {
      if (item.showblock && item.showblock == true) {
        return '0'
      }
      return item.styleIndex % 2 == 0 ? '0' : '40px'
    },
    // 获取左边padding
    getPaddingRight(item, index) {
      if (item.showblock && item.showblock == true) {
        return '0'
      }
      return item.styleIndex % 2 == 0 ? '40px' : '0'
    }
  }
}
</script>
<style lang="scss" scoped>
.crm-create-container {
  position: relative;
  height: 100%;
}

.crm-create-flex {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
}

.crm-create-header {
  height: 40px;
  margin-bottom: 20px;
  padding: 0 10px;
  flex-shrink: 0;
  .close {
    display: block;
    font-size: 24px;
    color: #909399;
    margin-right: -10px;
    padding: 10px;
    cursor: pointer;
  }
  .close:hover {
    color: $xr-color-primary;
  }
}

.crm-create-body {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
}

/** 将其改变为flex布局 */
.crm-create-box {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px 15px;
}

.crm-create-item {
  flex: 0 0 50%;
  flex-shrink: 0;
  // overflow: hidden;
  padding-bottom: 10px;
}

// 图片 附件
.img-accessory {
  padding: 0 20px;
  font-size: 12px;
  img {
    width: 16px;
    vertical-align: middle;
  }
  .img-box /deep/ .el-upload {
    width: 80px;
    height: 80px;
    line-height: 90px;
  }
  .img-box /deep/ .el-upload-list {
    .el-upload-list__item {
      width: 80px;
      height: 80px;
    }
  }
  .img-box {
    position: relative;
    margin-top: 40px;
    .add-img {
      position: absolute;
      left: 0;
      top: -30px;
      height: 20px;
      line-height: 20px;
      margin-bottom: 10px;
      color: #2362FB;
    }
  }
  .add-accessory {
    margin-top: 25px;
    margin-bottom: 20px;
    color: #2362FB;

    .wukong-file {
      font-size: 13px;
    }
  }
}

// 占用一整行
.crm-create-block-item {
  flex: 0 0 100%;
  flex-shrink: 0;
  padding-bottom: 10px;
}

/* .el-form-item /deep/ .el-form-item__label {
  line-height: normal;
  font-size: 13px;
  color: #333333;
  position: relative;
  padding-left: 8px;
  padding-bottom: 0;
}

.el-form /deep/ .el-form-item {
  margin-bottom: 0px;
}

.el-form /deep/ .el-form-item.is-required .el-form-item__label:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
  position: absolute;
  left: 0;
  top: 5px;
} */

.form-label {
  margin: 5px 0;
  font-size: 13px;
  word-wrap: break-word;
  word-break: break-all;
}

.handle-bar {
  position: relative;
  .handle-button {
    float: right;
    margin-top: 5px;
    margin-right: 20px;
  }
}

// 审核信息 里的审核类型
.examine-type {
  font-size: 12px;
  color: white;
  background-color: #fd715a;
  padding: 0 8px;
  margin-left: 5px;
  height: 16px;
  line-height: 16px;
  border-radius: 8px;
  transform: scale(0.8, 0.8);
}

.related-business {
  padding: 0 20px;
}
</style>
