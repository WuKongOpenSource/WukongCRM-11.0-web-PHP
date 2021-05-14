<template>
  <create-view
    :loading="loading"
    :body-style="{ height: '100%'}">
    <flexbox
      direction="column"
      align="stretch"
      class="pool-add-container">
      <flexbox class="pool-add-header">
        <div style="flex:1;font-size:17px;color:#333;font-weight: bold;">{{ title }}</div>
        <i
          class="el-icon-close close"
          @click="hidenView" />
      </flexbox>

      <div class="pool-add-content">
        <create-sections
          v-if="baseFrom"
          title="基本信息">
          <flexbox
            style="margin-top: 8px;"
            direction="column"
            align="stretch">
            <el-form
              ref="ruleForm"
              :model="baseFrom"
              :rules="baseRules"
              label-position="top"
              class="pool-add-items">
              <el-form-item
                prop="pool_name"
                class="pool-add-item pool-add-item__left">
                <div
                  slot="label"
                  style="display: inline-block;">
                  <div class="xr-form-label">
                    公海名称
                  </div>
                </div>
                <el-input v-model="baseFrom.pool_name" :maxlength="100" />
              </el-form-item>
              <el-form-item
                prop="adminUsers"
                class="pool-add-item pool-add-item__right">
                <div
                  slot="label"
                  style="display: inline-block;">
                  <div class="xr-form-label">
                    公海管理员<el-tooltip
                      content="客户公海管理员可对客户公海客户进行领取、分配、删除、导出等操作"
                      effect="dark"
                      placement="top">
                      <i class="wk wk-help wk-help-tips"/>
                    </el-tooltip>
                  </div>
                </div>
                <xh-user-cell
                  :radio="false"
                  :value="baseFrom.adminUsers"
                  @value-change="userChange" />
              </el-form-item>
              <el-form-item
                prop="memberUsers"
                class="pool-add-item pool-add-item__left">
                <div
                  slot="label"
                  style="display: inline-block;">
                  <div class="xr-form-label">
                    公海成员<el-tooltip
                      content="客户公海规则对客户公海成员生效(超级管理员除外)，客户公海成员可查看以及领取公海客户"
                      effect="dark"
                      placement="top">
                      <i class="wk wk-help wk-help-tips"/>
                    </el-tooltip>
                  </div>
                </div>
                <xh-struc-user-cell
                  :value="baseFrom.memberUsers"
                  @value-change="strcUserChange" />
              </el-form-item>
            </el-form>
          </flexbox>
        </create-sections>
        <create-sections
          v-if="recycleRuleData"
          title="规则设置">
          <flexbox
            class="row"
            align="stretch">
            <div class="row-label">前负责人领取规则</div>
            <div class="row-content">
              <el-radio-group v-model="baseFrom.before_owner_conf">
                <el-radio :label="0">不限制</el-radio>
                <el-radio :label="1">限制</el-radio>
              </el-radio-group>
              <div v-if="baseFrom.before_owner_conf === 1" class="xr-input">
                <span>前负责人</span>
                <el-input v-model="baseFrom.before_owner_day" @keyup.native="inputLimit('before_owner_day')" />
                <span>天内不允许领取该客户</span>
              </div>
            </div>
          </flexbox>

          <flexbox
            class="row"
            align="stretch">
            <div class="row-label">领取频率规则</div>
            <div class="row-content">
              <el-radio-group v-model="baseFrom.receive_conf">
                <el-radio :label="0">不限制</el-radio>
                <el-radio :label="1">限制</el-radio>
              </el-radio-group>
              <div v-if="baseFrom.receive_conf === 1" class="xr-input">
                <span>每天最多领取</span>
                <el-input v-model="baseFrom.receive_count" @keyup.native="inputLimit('receive_count')" />
                <span>个公海客户</span>
              </div>
            </div>
          </flexbox>

          <flexbox
            class="row"
            align="stretch">
            <div class="row-label">提醒规则</div>
            <div class="row-content">
              <el-radio-group v-model="baseFrom.remind_conf">
                <el-radio :label="0">不提醒</el-radio>
                <el-radio :label="1">提醒</el-radio>
              </el-radio-group>
              <div v-if="baseFrom.remind_conf === 1" class="xr-input">
                <span>提前</span>
                <el-input v-model="baseFrom.remain_day" @keyup.native="inputLimit('remain_day')" />
                <span>天提醒负责人</span>
              </div>
            </div>
          </flexbox>

          <flexbox
            class="row"
            align="stretch">
            <div class="row-label">收回规则</div>
            <div class="row-content">
              <el-radio-group v-model="baseFrom.recycle_conf">
                <el-radio :label="1">自动回收</el-radio>
                <el-radio :label="0">不自动回收</el-radio>
              </el-radio-group>
            </div>
          </flexbox>

          <template v-if="baseFrom.recycle_conf == 1">
            <recycle-rule
              v-for="(item, index) in recycleRuleData"
              :key="index"
              :data="item"
              :level-customer="levelCustomerName"
              :true-label="index + 1"
              :is-edit="isEdit"
            />
          </template>

          <flexbox
            class="row"
            align="stretch">
            <div class="row-label">公海字段设置</div>
            <div class="row-content">
              <div class="field-set">
                <div class="field-set__name">
                  选择公海字段
                </div>
                <flexbox
                  wrap="wrap">
                  <el-checkbox
                    v-for="(item, index) in customerPoolFields"
                    :key="index"
                    v-model="item.is_hidden"
                    :true-label="0"
                    :false-label="1">{{ item.name }}</el-checkbox>
                </flexbox>
              </div>
            </div>
          </flexbox>
        </create-sections>
      </div>

      <div class="handle-bar">
        <el-button
          class="handle-button"
          @click.native="hidenView">取消</el-button>
        <el-button
          v-debounce="saveClick"
          class="handle-button"
          type="primary">保存</el-button>
      </div>
    </flexbox>
  </create-view>
</template>

<script>
import {
  crmCustomerPoolQueryPoolFieldAPI,
  crmCustomerPoolSetAPI,
  crmCustomerPoolSetDetailAPI,
  crmCustomerPoolQueryLevelAPI
} from '@/api/crm/customer'

import CreateView from '@/components/CreateView'
import CreateSections from '@/components/CreateSections'
import {
  XhInput,
  XhUserCell,
  XhStrucUserCell
} from '@/components/CreateCom'
import RecycleRule from './RecycleRule'

export default {
  // 公海规则添加
  name: 'PoolAdd',
  components: {
    CreateView,
    CreateSections,
    XhInput,
    XhUserCell,
    XhStrucUserCell,
    RecycleRule
  },
  props: {
    /**
     * type save:添加、update:编辑
     */
    action: {
      type: Object,
      default: () => {
        return {
          type: 'save',
          id: '',
          data: {} // 编辑所需信息
        }
      }
    }
  },
  data() {
    const validateMemberUsers = (rule, value, callback) => {
      if (value && ((value.users && value.users.length) || (value.strucs && value.strucs.length))) {
        callback()
      } else {
        callback(new Error('请选择公海成员'))
      }
    }

    return {
      loading: false,
      baseFrom: null,
      baseRules: {
        pool_name: [
          { required: true, message: '请输入公海名称', trigger: 'blur' }
        ],
        adminUsers: [
          { required: true, message: '请选择公海管理员', trigger: ['blur', 'change'] }
        ],
        memberUsers: [
          { required: true, validator: validateMemberUsers, trigger: ['blur', 'change'] }
        ]
      },
      recycleRuleData: null,
      levelCustomerName: [], // 客户级别数据源
      customerPoolFields: [],
      requestFields: {
        before_owner_day: '前负责人限制领取天数需大于0',
        receive_count: '领取频率限制个数需大于0',
        remain_day: '提醒规则天数需大于0'
      }
    }
  },
  computed: {
    title() {
      if (this.isEdit) {
        return '编辑公海'
      }

      return '新建公海'
    },

    isEdit() {
      return this.action && this.action.type == 'update'
    }
  },
  watch: {},
  created() {
    if (this.isEdit) {
      this.getDetail()
    } else {
      this.getCreateInfo()
    }

    this.getLevelCustomerData()
  },

  beforeDestroy() {},
  methods: {
    getLevelCustomerData() {
      crmCustomerPoolQueryLevelAPI().then(res => {
        this.levelCustomerName = res.data || []
      }).catch(() => {})
    },

    /**
     * 编辑操作
     */
    getDetail() {
      this.loading = true
      crmCustomerPoolSetDetailAPI({
        pool_id: this.action.id
      }).then(res => {
        this.getEditInfo(res.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    getEditInfo(data) {
      if (data.user_info) {
        data.user_info.forEach(item => {
          item.type = 'user'
        })
      }
      this.baseFrom = {
        pool_name: data.pool_name,
        adminUsers: data.admin_user_info,
        memberUsers: {
          users: data.user_info,
          strucs: data.department_info
        },
        before_owner_conf: data.before_owner_conf, // 前负责人领取规则 0不限制 1限制
        before_owner_day: data.before_owner_day,
        receive_conf: data.receive_conf, // 0 不启用 1 启用
        remind_conf: data.remind_conf, // 0 不提醒 1 提醒
        receive_count: data.receive_count, // 领取频率规则
        remain_day: data.remain_day, // 提醒规则天数
        recycle_conf: data.recycle_conf // 收回规则 0不自动收回 1自动收回
      }

      this.recycleRuleData = this.getEditRule(data.rule)
      this.getCustomerPoolFields(data.field || []).then(editFields => {
        this.customerPoolFields = editFields
      })
    },

    getEditRule(detailRule) {
      const baseRule = [
        {
          type: '',
          deal_handle: 0,
          business_handle: 0,
          level_conf: 1,
          level: []
        },
        {
          type: '',
          deal_handle: 0,
          business_handle: 0,
          level_conf: 1,
          level: []
        },
        {
          type: '',
          deal_handle: 0,
          business_handle: 0,
          level_conf: 1,
          level: []
        }
      ]

      if (detailRule) {
        for (let index = 0; index < detailRule.length; index++) {
          const element = detailRule[index]
          element.level = element.level_setting
          baseRule.splice(element.type - 1, 1, element)
        }
      }

      return baseRule
    },

    /**
     * 新建操作
     */
    getCreateInfo() {
      this.baseFrom = {
        pool_name: '',
        adminUsers: [],
        memberUsers: {
          users: [],
          strucs: []
        },
        before_owner_conf: 0, // 前负责人领取规则 0不限制 1限制
        before_owner_day: '',
        receive_conf: 0, // 0 不启用 1 启用
        receive_count: '', // 领取频率规则
        remind_conf: 0, // 0 不提醒 1 提醒
        remain_day: '', // 提醒规则天数
        recycle_conf: 1 // 收回规则 0不自动收回 1自动收回
      }

      this.recycleRuleData = this.getEditRule()

      this.getCustomerPoolFields().then(createFields => {
        this.customerPoolFields = createFields
      })
    },


    /**
     * 获取公海默认字段
     */
    getCustomerPoolFields(allFields) {
      return new Promise((resolve, reject) => {
        crmCustomerPoolQueryPoolFieldAPI(
          {
            types: 'crm_customer',
            module: 'crm',
            action: 'pool',
            controller: 'customer',
            pool_id: this.action.id
          }
        ).then(res => {
          const list = res.data || []
          const baseField = list.map(item => {
            item.is_hidden = item.is_hidden = allFields ? 1 : 0
            return item
          })
          if (allFields) {
            resolve(this.getEditFields(baseField, allFields))
          } else {
            resolve(baseField)
          }
        }).catch(() => {
          reject()
        })
      })
    },

    /**
     * 获取编辑展示字段
     */
    getEditFields(list, allFields) {
      for (let index = 0; index < list.length; index++) {
        const item = list[index]

        for (let editIndex = 0; editIndex < allFields.length; editIndex++) {
          const editItem = allFields[editIndex]
          // field_id 存在 匹配fieldId 不存在 匹配 field_name
          if (item.field_id) {
            if (item.field_id === editItem.field_id) {
              item.setting_id = editItem.setting_id
              item.is_hidden = editItem.is_hidden
            }
          } else {
            if (item.field === editItem.field_name) {
              item.setting_id = editItem.setting_id
              item.is_hidden = editItem.is_hidden
            }
          }
        }
      }

      return list
    },


    /**
     * 员工选择
     */
    userChange(data) {
      this.baseFrom.adminUsers = data.value
      this.$refs.ruleForm.validateField('adminUsers')
    },

    strcUserChange(data) {
      this.baseFrom.memberUsers = data.value
      this.$refs.ruleForm.validateField('memberUsers')
    },

    /**
     * 保存数据
     */
    saveClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const params = this.getRequestParams()
          if (params) {
            this.uploadPoolSet(params)
          }
        } else {
          // 提示第一个error
          if (this.$refs.ruleForm.fields) {
            for (
              let index = 0;
              index < this.$refs.ruleForm.fields.length;
              index++
            ) {
              const ruleField = this.$refs.ruleForm.fields[index]
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

    /**
     * 提交请求
     */
    uploadPoolSet(params) {
      if (this.isEdit) {
        params.pool_id = this.action.id
      }
      this.loading = true
      crmCustomerPoolSetAPI(params).then(res => {
        this.$emit('save')
        this.$message.success(this.isEdit ? '编辑成功' : '新建成功')
        this.loading = false
        this.hidenView()
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 必填字段验证
     */
    requestFieldsVerify(key) {
      if (key == 'before_owner_day' && this.baseFrom.before_owner_conf == 1 && (!this.baseFrom[key] || this.baseFrom[key] <= 0)) {
        return false
      } else if (key == 'receive_count' && this.baseFrom.receive_conf == 1 && (!this.baseFrom[key] || this.baseFrom[key] <= 0)) {
        return false
      } else if (key == 'remain_day' && this.baseFrom.remind_conf == 1 && (!this.baseFrom[key] || this.baseFrom[key] <= 0)) {
        return false
      }

      return true
    },

    /**
     * 获取请求参数
     */
    getRequestParams() {
      const params = {}

      for (const key in this.baseFrom) {
        if (!this.requestFieldsVerify(key)) {
          this.$message.error(this.requestFields[key])
          return
        } else {
          if (key == 'adminUsers') {
            const adminUsers = this.baseFrom.adminUsers || []
            params.admin_user_ids = adminUsers.map(item => {
              return item.id
            }).join(',')
          } else if (key == 'memberUsers') {
            const memberUserObj = this.baseFrom.memberUsers || {}
            const adminUsers = memberUserObj.users || []
            const adminStrucs = memberUserObj.strucs || []
            params.user_ids = adminUsers.map(item => {
              return item.id
            }).join(',')
            params.department_ids = adminStrucs.map(item => {
              return item.id
            }).join(',')
          } else {
            params[key] = this.baseFrom[key]
          }
        }
      }

      // 收回规则 1 自动收回
      if (this.baseFrom.recycle_conf == 1) {
        const ruleVerify = this.recycleRuleData.filter(item => {
          return item.type
        })

        if (!ruleVerify.length) {
          this.$message.error('请勾选自动回收规则')
          return
        }

        const rule = []
        for (let index = 0; index < this.recycleRuleData.length; index++) {
          let ruleItem = this.recycleRuleData[index]
          ruleItem = { ...ruleItem }
          if (ruleItem.type) {
            let rulePass = false // 只要有一个填写 就通过
            const newLevel = []
            for (let levelIndex = 0; levelIndex < ruleItem.level.length; levelIndex++) {
              const levelItem = ruleItem.level[levelIndex]
              if (levelItem.limit_day && levelItem.limit_day > 0) {
                rulePass = true
                newLevel.push(levelItem)
              }
            }
            ruleItem.level = newLevel
            rule.push(ruleItem)

            if (!rulePass) {
              this.$message.error('收回规则超过天数需大于0')
              return
            }
          }
        }

        params.rule = rule
      } else {
        params.rule = []
      }

      const showFields = this.customerPoolFields.filter(item => {
        return item.is_hidden == 0
      })

      if (showFields.length < 2) {
        this.$message.error('公海字段至少要显示两个')
        return
      }
      // 公海字段
      params.field = this.customerPoolFields

      return params
    },

    /**
     * 关闭页面
     */
    hidenView() {
      this.$emit('hiden-view')
    },

    /**
     * 阻挡输入
     */
    inputLimit(key) {
      this.baseFrom[key] = this.baseFrom[key].replace(/[^0-9]/g, '')
    }
  }
}
</script>

<style lang="scss" scoped>
.pool-add-container {
  position: relative;
  height: 100%;
}

.pool-add-content {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
}

.pool-add-header {
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

.el-form-item /deep/ .el-form-item__label {
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
}

.pool-add-items {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px 15px;
}

.pool-add-item {
  flex: 0 0 50%;
  flex-shrink: 0;
  // overflow: hidden;
  padding-bottom: 10px;
  &__left {
    padding-right: 25px;
  }
  &__right {
    padding-left: 25px;
  }
}

.xr-form-label {
  margin: 5px 0;
  font-size: 12px;
  word-wrap: break-word;
  word-break: break-all;
  .wk-help {
    margin-left: 5px;
  }
}

// 行布局
.row {
  padding: 8px 15px 0;
  font-size: 13px;
  color: #333;
  &-label {
    width: 120px;
    margin-top: 10px;
    flex-shrink: 0;
  }

  &-content {
    flex: 1;
    margin-left: 20px;
    .el-radio-group {
      margin: 8px 0;
    }

    .xr-input {
      margin-bottom: 8px;
      .el-input {
        width: 80px;
        margin: 0 8px;
      }
    }
  }
}

.recycle-rule {
  padding-left: 155px;
  margin-top: 20px;
}

// 字段设置
.field-set {
  margin-top: 10px;
  margin-bottom: 40px;
  padding: 15px;
  border: 1px solid $xr-border-color-base;
  border-radius: $xr-border-radius-base;

  &__name {
    margin-bottom: 8px;
  }

  .el-checkbox {
    flex: 0 0 30%;
    margin-right: 8px;
    margin-bottom: 8px;
  }
}

.handle-bar {
  position: relative;
  .handle-button {
    float: right;
    margin-top: 5px;
    margin-right: 20px;
  }
}
</style>
