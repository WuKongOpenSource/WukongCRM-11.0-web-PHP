<template>
  <div
    class="content">
    <div class="content-title">基本信息</div>
    <div
      v-for="(item , index) in showList"
      :key="index"
      class="detail-cell">
      <div class="detail-cell__label">
        {{ item.name }}
      </div>
      <div class="detail-cell__value">
        <wk-field-view
          :props="item"
          :form_type="item.form_type"
          :value="item.value"
        >
          <template slot-scope="{ data }">
            <span v-if="data.form_type === 'business_type'">{{ detail ? detail.typeName : '' }}</span>
            <span v-else-if="data.form_type === 'business_status'">{{ detail ? detail.statusName : '' }}</span>
            <span v-else-if="data.form_type === 'category'">{{ detail ? detail.categoryName : '' }}</span>
            <span v-else-if="data.form_type === 'receivables_plan'">{{ detail ? detail.planNum : '' }}</span>
            <span v-else>{{ getCommonShowValue(data) }}</span>
          </template>
        </wk-field-view>
      </div>
    </div>
  </div>
</template>

<script>
import WkFieldView from '@/components/NewCom/WkForm/WkFieldView'

import { isArray, isObject } from '@/utils/types'
import { getFormFieldShowName } from '@/components/NewCom/WkForm/utils'

export default {
  //  重要信息 中的列表展示
  name: 'ImportInfo',
  components: {
    WkFieldView
  },
  props: {
    list: Array,
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    showList() {
      return this.list.filter(item => {
        return item.form_type !== 'file' &&
        item.form_type !== 'detail_table' &&
        item.form_type !== 'map_address'
      })
    }
  },
  watch: {},
  mounted() {},

  beforeDestroy() {},
  methods: {
    /**
     * 获取非附件类型的展示值
     */
    getCommonShowValue(item) {
      if (this.isModule(item)) {
        return this.getModuleName(item)
      } else {
        return getFormFieldShowName(item.form_type, item.value, '', item)
      }
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
     * 特殊格式数据获取展示名称
     */
    getModuleName(item) {
      // 模块数据
      const modulefield = {
        customer: 'name',
        business: 'name',
        contract: 'name',
        contacts: 'name'
      }[item.form_type]

      if (modulefield) {
        let data = {}
        if (isObject(item.value)) {
          data = item.value
        } else if (isArray(item.value) && item.value.length > 0) {
          data = item.value[0]
        }
        return data[modulefield] || ''
      }

      // 常规对象数据
      const field = {
        category: 'categoryName'
      }[item.form_type]
      return item.value ? item.value[field] : ''
    }
    // getValueContent(item) {
    //   if (item.form_type === 'map_address') {
    //     return item.value ? item.value.detail_address : ''
    //   } else if (
    //     item.form_type === 'structure' ||
    //     item.form_type === 'user' ||
    //     item.form_type === 'checkbox') {
    //     if (isArray(item.value)) {
    //       const field = {
    //         structure: 'name',
    //         user: 'realname',
    //         checkbox: ''
    //       }[item.form_type]
    //       return item.value
    //         .map(item => {
    //           return field ? item[field] : item
    //         })
    //         .join('，')
    //     } else {
    //       return ''
    //     }
    //   } else if (item.form_type === 'single_user') {
    //     if (isObject(item.value) && item.value.realname) {
    //       return item.value.realname
    //     } else {
    //       return ''
    //     }
    //   } else if (
    //     item.form_type === 'customer' ||
    //     item.form_type === 'business' ||
    //     item.form_type === 'contract' ||
    //     item.form_type === 'contacts' ||
    //     item.form_type === 'category' ||
    //     item.form_type === 'statusName' ||
    //     item.form_type === 'typeName') {
    //     const field = {
    //       customer: 'name',
    //       business: 'name',
    //       contract: 'name',
    //       contacts: 'name',
    //       category: 'name',
    //       statusName: 'name',
    //       typeName: 'name'
    //     }[item.form_type]
    //     if (isArray(item.value)) {
    //       return item.value.length > 0 ? item.value[0][field] : ''
    //     } else {
    //       return item.value ? item.value[field] : ''
    //     }
    //   }

    //   return item.value
    // }
  }
}
</script>

<style lang="scss" scoped>
.import-info {
  overflow: auto;
  height: 100%;
}

.content {
  padding: 20px 10px;
  &-title {
    font-size: 13px;
    font-weight: 600;
  }

  .detail-cell {
    font-size: 12px;
    margin: 20px 0;
    &__label {
      color: #666;
    }
    &__value {
      display: inline-block;
      margin-top: 5px;
      color: #333;
      line-height: 16px;
      width: 100%;
    }
  }
}
</style>
