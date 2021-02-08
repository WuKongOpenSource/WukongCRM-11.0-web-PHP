<template>
  <div
    class="content">
    <div class="content-title">基本信息</div>
    <p
      v-for="(item , index) in showList"
      :key="index"
      class="detail-cell">
      <span class="detail-cell__label">
        {{ item.name }}
      </span><br>
      <span class="detail-cell__value">
        {{ getValueContent(item) }}
      </span>
    </p>
  </div>
</template>

<script>
import { isArray, isObject } from '@/utils/types'

export default {
  //  重要信息 中的列表展示
  name: 'ImportInfo',
  components: {},
  props: {
    list: Array
  },
  data() {
    return {}
  },
  computed: {
    showList() {
      return this.list.filter(item => {
        return item.form_type !== 'file'
      })
    }
  },
  watch: {},
  mounted() {},

  beforeDestroy() {},
  methods: {
    getValueContent(item) {
      if (item.form_type === 'map_address') {
        return item.value ? item.value.detail_address : ''
      } else if (
        item.form_type === 'structure' ||
        item.form_type === 'user' ||
        item.form_type === 'checkbox') {
        if (isArray(item.value)) {
          const field = {
            structure: 'name',
            user: 'realname',
            checkbox: ''
          }[item.form_type]
          return item.value
            .map(item => {
              return field ? item[field] : item
            })
            .join('，')
        } else {
          return ''
        }
      } else if (item.form_type === 'single_user') {
        if (isObject(item.value) && item.value.realname) {
          return item.value.realname
        } else {
          return ''
        }
      } else if (
        item.form_type === 'customer' ||
        item.form_type === 'business' ||
        item.form_type === 'contract' ||
        item.form_type === 'contacts' ||
        item.form_type === 'category' ||
        item.form_type === 'statusName' ||
        item.form_type === 'typeName') {
        const field = {
          customer: 'name',
          business: 'name',
          contract: 'name',
          contacts: 'name',
          category: 'name',
          statusName: 'name',
          typeName: 'name'
        }[item.form_type]
        if (isArray(item.value)) {
          return item.value.length > 0 ? item.value[0][field] : ''
        } else {
          return item.value ? item.value[field] : ''
        }
      }

      return item.value
    }
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
    }
  }
}
</style>
