<template>
  <el-select
    v-model="dataValue"
    :disabled="disabled"
    style="width: 100%;"
    clearable
    @change="valueChange">
    <el-option
      v-for="(item, index) in option"
      :key="index"
      :label="item.num"
      :value="item.plan_id"/>
  </el-select>
</template>
<script type="text/javascript">
import stringMixin from './stringMixin'
import {
  crmQueryReceivablesPlansByContractIdAPI
} from '@/api/crm/contract'

export default {
  name: 'XhReceivablesPlan', // 回款 下的 回款计划
  components: {},
  mixins: [stringMixin],
  props: {
    relation: {
      // 相关ID
      type: Object,
      default: () => {
        return {}
      }
    },
    receivablesId: [String, Number]
  },
  data() {
    return {
      option: []
    }
  },
  computed: {},
  watch: {
    relation: function(val) {
      if (val.moduleType) {
        this.getPlanList()
      } else {
        this.option = []
      }
    }
  },
  mounted() {
    if (this.relation.moduleType) {
      this.getPlanList()
    }
  },
  methods: {
    getPlanList() {
      this.loading = true
      const params = { contract_id: this.relation.contract_id, pageType: 'all', status: 0 }
      if (this.receivablesId) {
        params.receivables_id = this.receivablesId
      }
      crmQueryReceivablesPlansByContractIdAPI(params)
        .then(res => {
          this.loading = false
          this.option = res.data.list
        })
        .catch(() => {
          this.loading = false
        })
    },

    // 输入的值
    valueChange(val) {
      this.$emit('value-change', {
        index: this.index,
        value: val,
        data: this.option.find(item => {
          return item.plan_id == val
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
