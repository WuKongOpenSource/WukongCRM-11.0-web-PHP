<template>
  <flexbox
    :style="{'height': contentHeight + 'px'}"
    class="main"
    orient="vertical"
    align="stretch">
    <div class="title">{{ '编辑'+getTitle()+'字段' }}</div>
    <el-container class="wrapper">
      <el-aside class="left">
        <div class="mini-title">字段库</div>
        <ul>
          <draggable
            :list="fieldList"
            :options="{group: {pull: 'clone', put: false, name: 'list'},forceFallback:true, sort:false }"
            :clone="handleMove"
            class="list-wrapper"
            @end="handleEnd">
            <li
              v-for="item in fieldList"
              :key="item.id"
              class="field-item"
              @click="handleClick(item)">
              <img
                :src="item.icon"
                class="icon" >
              <span>{{ item.name }}</span>
            </li>
          </draggable>
        </ul>
      </el-aside>
      <el-container
        v-loading="loading"
        class="content">
        <el-header>
          <el-button
            type="text"
            style="padding: 8px 22px;border-radius:2px;"
            @click="handlePreview">预览</el-button>
          <el-button
            v-debounce="handleSave"
            type="primary"
            style="padding: 8px 22px;border-radius:2px;">保存</el-button>
          <el-button
            style="padding: 8px 22px;border-radius:2px;"
            @click="handleCancel">返回</el-button>

        </el-header>
        <el-main>
          <draggable
            :list="fieldArr"
            :options="{group: 'list',forceFallback:true, fallbackClass:'draggingStyle'}"
            @end="handleListMove">
            <component
              v-for="(item, index) in fieldArr"
              :class="{selected: selectedIndex == index}"
              :is-show="selectedIndex == index && (item.operating == null || item.operating == 0 || item.operating == 2)"
              :key="index"
              :attr="item"
              :is="item | typeToComponentName"
              @delete="handleDelete(item, index)"
              @select="handleChildSelect"
              @click.native="handleSelect(item, index)"/>
          </draggable>
          <p
            v-if="fieldArr.length == 0"
            class="no-list">从左侧点击或拖拽来添加字段</p>
        </el-main>
      </el-container>
      <el-aside
        class="right"
        width="310px">
        <div class="mini-title">字段属性</div>
        <field-info
          v-if="form"
          :field="form"
          :can-transform="canTransform"
          :transform-data="transformData"
          :can-unique="canUnique"/>
      </el-aside>
    </el-container>
    <!-- 表单预览 -->
    <preview-field-view
      v-if="showTablePreview"
      :types="tablePreviewData.type"
      :types-id="tablePreviewData.id"
      :label="tablePreviewData.label"
      @hiden-view="showTablePreview=false"/>
  </flexbox>
</template>

<script>
import crmTypeModel from '@/views/crm/model/crmTypeModel'
import {
  customFieldHandleAPI,
  oaFieldHandleAPI,
  customFieldListAPI,
  oaExamineFieldListAPI
} from '@/api/admin/crm'
import { filedGetFieldAPI } from '@/api/crm/common'
import PreviewFieldView from '@/views/admin/components/PreviewFieldView'
import {
  SingleLineText,
  MultiLineText,
  SelectForm,
  CheckboxForm,
  FileForm,
  TableForm
} from './components/Fields'
import draggable from 'vuedraggable'
import Field from './model/field'
import FieldList from './model/fieldList'
import FieldInfo from './components/FieldInfo'
import { objDeepCopy, regexIsCRMMobile, regexIsCRMEmail } from '@/utils'

export default {
  name: 'Handlefield',
  components: {
    SingleLineText,
    MultiLineText,
    SelectForm,
    CheckboxForm,
    FileForm,
    TableForm,
    draggable,
    FieldInfo,
    PreviewFieldView
  },
  filters: {
    /** 根据type 找到组件 */
    typeToComponentName(item) {
      if (
        item.form_type === 'text' ||
        item.form_type === 'number' ||
        item.form_type === 'floatnumber' ||
        item.form_type === 'mobile' ||
        item.form_type === 'email' ||
        item.form_type === 'date' ||
        item.form_type === 'datetime' ||
        item.form_type === 'user' ||
        item.form_type === 'structure' ||
        item.form_type === 'contacts' ||
        item.form_type === 'customer' ||
        item.form_type === 'contract' ||
        item.form_type === 'business' ||
        item.form_type === 'single_user'
      ) {
        return 'SingleLineText'
      } else if (item.form_type === 'textarea') {
        return 'MultiLineText'
      } else if (item.form_type === 'select') {
        return 'SelectForm'
      } else if (item.form_type === 'checkbox') {
        return 'CheckboxForm'
      } else if (item.form_type === 'file') {
        return 'FileForm'
      } else if (item.form_type === 'form') {
        return 'TableForm'
      }
    }
  },
  data() {
    return {
      fieldList: FieldList,
      fieldArr: [], // 数据没有返回时 根据null 判断不能操作
      movedItem: {},
      selectedIndex: -1,
      rejectHandle: true, // 请求未获取前不能操作
      /** 右边展示数据 */
      form: null, // operating 0 改删 1改 2删 3无
      loading: false, // 加载动画
      // 展示表单预览
      tablePreviewData: { types: '', id: '' },
      showTablePreview: false,
      contentHeight: document.documentElement.clientHeight - 75,
      // 转移匹配字段源
      transformData: null
    }
  },
  computed: {
    // 能转移
    canTransform() {
      return this.$route.params.type == 'crm_leads'
    },
    canUnique() {
      return this.$route.params.type != 'oa_examine' // 办公审批不允许设置唯一
    }
  },
  watch: {
    selectedIndex: {
      handler(newVal) {
        if (newVal >= 0) {
          this.form = this.fieldArr[newVal]
        } else {
          this.form = null
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    window.onresize = () => {
      this.contentHeight = document.documentElement.clientHeight - 75
    }
    // 获取当前模块的自定义数据
    this.getCustomInfo()

    // 配置转移字段
    if (this.canTransform) {
      this.getTransformField()
    }
  },
  methods: {
    // 获取当前模块的自定义数据
    getCustomInfo() {
      this.loading = true
      let request = customFieldListAPI
      var params = {}
      // params.label = this.$route.params.label
      params.types = this.$route.params.type
      if (this.$route.params.type === 'oa_examine') {
        request = oaExamineFieldListAPI
        params.types_id = this.$route.params.id
      }
      request(params)
        .then(res => {
          for (let index = 0; index < res.data.length; index++) {
            const element = res.data[index]
            if (
              element.form_type == 'select' ||
              element.form_type == 'checkbox'
            ) {
              var temps = []
              for (let i = 0; i < element.setting.length; i++) {
                // 必须有属性 才能for绑定 所以处理了下数据
                const item = element.setting[i]
                temps.push({ value: item })
              }
              element.showSetting = temps // 放到showSeeting上

              // 删除无效的多选默认值
              if (element.form_type == 'checkbox') {
                element.default_value = element.default_value.filter(item => {
                  return element.setting.indexOf(item) != -1
                })
              }
            }
            element.is_null = element.is_null == 1
            element.is_unique = element.is_unique == 1
            element.is_hidden = element.is_hidden == 1 // 隐藏字段
            element.default_value = element.default_value
            element.max_length = element.max_length
            element.input_tips = element.input_tips
            element.types_id = element.types_id
            // element.is_null = element.is_null == 1
          }
          this.fieldArr = res.data
          if (res.data.length > 0) {
            this.selectedIndex = 0
            this.form = this.fieldArr[0]
          }
          this.rejectHandle = false
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 删除一行自定义数据
    handleDelete(item, index) {
      this.$confirm('确定删除该自定义字段吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.fieldArr.splice(index, 1)
          this.$nextTick(() => {
            this.selectedIndex = -1
          })
        })
        .catch(() => {})
    },
    // 主列表的选择
    handleSelect(item, index) {
      this.selectedIndex = index
      if (this.selectedIndex === index) {
        // 表自定义字段的刷新
        if (index >= 0) {
          this.form = this.fieldArr[index]
        }
      }
    },
    // 表的选择
    handleChildSelect(data) {
      this.form = data.data
    },
    // 预览表单
    handlePreview() {
      this.tablePreviewData = this.$route.params
      this.showTablePreview = true
    },
    // 保存数据
    handleSave() {
      if (this.rejectHandle) return
      var tempFieldArr = objDeepCopy(this.fieldArr)
      const names = [] // 判断名称重复
      const limitFields = 'select|update|union|and|or|delete|insert|trancate|char|substr|ascii|declare|exec|count|master|into|drop|execute'.split('|')
      for (let index = 0; index < tempFieldArr.length; index++) {
        const item = tempFieldArr[index]

        item.is_null = item.is_null == true ? 1 : 0
        item.is_unique = item.is_unique == true ? 1 : 0
        item.is_hidden = item.is_hidden == true ? 1 : 0
        if (item.name !== '' && item.name !== null && item.name !== undefined) {
          item.name = item.name.trim()

          if (limitFields.includes(item.name)) {
            this.$message({
              message: `[${item.name}]自定义字段标识名与系统字段重复，请使用其他字段！`,
              type: 'error'
            })
            return
          } else if (names.includes(item.name)) {
            this.$message({
              message: `第${(index + 1)}行[${item.name}]自定义字段标识名重复`,
              type: 'error'
            })
            return
          } else {
            names.push(item.name)
          }
        }

        if (!item.name) {
          this.$message({
            type: 'error',
            message: `第${index + 1}行自定义字段，标识名不能为空`
          })
          return
        } else if (item.form_type == 'select' || item.form_type == 'checkbox') {
          var temps = []
          for (let i = 0; i < item.showSetting.length; i++) {
            const element = item.showSetting[i]
            if (element.value) {
              temps.push(element.value)
            }
          }
          // item.options = temps.join(',')//java
          item.setting = temps
          if (item.form_type == 'checkbox') {
            item.default_value = item.default_value.join(',')
          }
        } else if (item.form_type == 'mobile' && item.default_value) {
          if (!regexIsCRMMobile(item.default_value)) {
            this.$message({
              message: `第${(index + 1)}行（${item.name}）自定义字段输入的默认值手机格式有误`,
              type: 'error'
            })
            return
          }
        } else if (item.form_type == 'email' && item.default_value) {
          if (!regexIsCRMEmail(item.default_value)) {
            this.$message({
              message: `第${(index + 1)}行（${item.name}）自定义字段输入的默认值邮箱格式有误`,
              type: 'error'
            })
            return
          }
        }

        item.type = this.getTypeFromForm_type(item.form_type)
      }

      this.loading = true
      var params = {}
      params.data = tempFieldArr
      // params.label = this.$route.params.label
      params.types = this.$route.params.type
      if (this.$route.params.type === 'oa_examine') {
        params.types_id = this.$route.params.id
        params.types = this.$route.params.type
      }
      for (const item of params.data) {
        for (const key in item) {
          if (JSON.stringify(item[key]) == '{}') {
            item[key] = null
          }
        }
      }

      // 请求
      const request = this.$route.params.type === 'oa_examine' ? oaFieldHandleAPI : customFieldHandleAPI
      request(params)
        .then(res => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.loading = false
          this.getCustomInfo()
        })
        .catch(() => {
          this.loading = false
          this.getCustomInfo()
        })
    },
    getTypeFromForm_type(form_type) {
      return (
        {
          text: 1,
          textarea: 2,
          select: 3,
          date: 4,
          number: 5,
          floatnumber: 6,
          mobile: 7,
          file: 8,
          checkbox: 9,
          user: 10,
          structure: 12,
          datetime: 13,
          email: 14,
          customer: 15,
          business: 16,
          contacts: 17,
          map_address: 18,
          category: 19,
          contract: 20,
          receivables_plan: 21,
          single_user: 28
        }[form_type] || '0'
      )
    },
    // 返回
    handleCancel() {
      this.$router.go(-1)
    },
    /**  拖拽操作部分 */
    // 从左侧移动到右侧
    handleEnd(e) {
      if (!this.rejectHandle) {
        const newField = new Field({
          name: this.movedItem.name,
          form_type: this.movedItem.form_type
        })
        // 如果当前选中的table 则加入到table中
        if (
          this.form &&
          this.form.form_type === 'form' &&
          this.movedItem.form_type !== 'form'
        ) {
          this.form.formValue.push(newField)
        } else {
          this.fieldArr.push(newField)
          this.selectedIndex = this.fieldArr.length - 1
        }
      }
    },
    // 从左侧移动到右侧 时候的数据对象
    handleMove(obj) {
      this.movedItem = obj
    },
    // 点击左侧进行添加
    handleClick(obj) {
      this.movedItem = obj
      this.handleEnd()
    },
    // list move
    handleListMove(e) {
      this.selectedIndex = e.newIndex
    },
    /**  拖拽操作部分 */
    /**  左上角title */
    getTitle() {
      if (this.$route.params.type == 'crm_leads') {
        return '线索'
      } else if (this.$route.params.type == 'crm_customer') {
        return '客户'
      } else if (this.$route.params.type == 'crm_contacts') {
        return '联系人'
      } else if (this.$route.params.type == 'crm_business') {
        return '商机'
      } else if (this.$route.params.type == 'crm_contract') {
        return '合同'
      } else if (this.$route.params.type == 'crm_product') {
        return '产品'
      } else if (this.$route.params.type == 'crm_receivables') {
        return '回款'
      } else if (this.$route.params.type == 'crm_visit') {
        return '客户回访'
      } else {
        return ''
      }
    },
    /**
     * 获取添加字段
     */
    getTransformField() {
      filedGetFieldAPI({
        types: crmTypeModel['customer'],
        module: 'crm',
        action: 'save',
        controller: 'customer'
      })
        .then(res => {
          const data = {
            text: [],
            textarea: [],
            select: [],
            checkbox: [],
            number: [],
            floatnumber: [],
            mobile: [],
            email: [],
            date: [],
            datetime: [],
            user: [],
            structure: []
          }

          for (let index = 0; index < res.data.length; index++) {
            const element = res.data[index]
            const array = data[element.form_type]
            if (array) {
              array.push({
                label: element.name,
                value: element.field
              })
            }
          }

          this.transformData = data
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/mixin.scss';
.main {
  padding: 0px 15px 0;
}

.el-form-item {
  margin: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid $xr-border-line-color;
  .desc {
    color: #999;
    font-size: 12px;
  }
  &:last-child {
    margin-top: 15px;
  }
}

.title {
  padding: 0 30px;
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.wrapper {
  background-color: white;
  border: 1px solid $xr-border-line-color;
  border-radius: $xr-border-radius-base;
  min-width: 1000px;
  overflow: hidden;
  flex: 1;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  .left {
    min-width: 310px;
    .mini-title {
      font-size: 14px;
      margin: 30px 0 20px 20px;
    }
    .list-wrapper {
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .field-item {
        width: 130px;
        height: 30px;
        font-size: 13px;
        padding: 0 10px;
        background: #ebf3ff;
        margin-bottom: 10px;
        border-radius: 3px;
        cursor: pointer;
        @include left;
        .icon {
          color: #74b2f2;
          margin-right: 8px;
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .content {
    border-left: 1px solid $xr-border-line-color;
    border-right: 1px solid $xr-border-line-color;
    .el-header {
      border-bottom: 1px solid $xr-border-line-color;
      @include right;
    }
    .el-main {
      padding: 0;
      .selected {
        border-left: 2px solid $xr-color-primary;
        background: #f7f8fa;
      }
      .no-list {
        margin: 200px 0;
        color: #ccc;
        @include center;
      }
    }
  }

  .right {
    font-size: 14px;
    .mini-title {
      height: 60px;
      border-bottom: 1px solid $xr-border-line-color;
      padding-left: 20px;
      @include left;
    }
  }
}
</style>
