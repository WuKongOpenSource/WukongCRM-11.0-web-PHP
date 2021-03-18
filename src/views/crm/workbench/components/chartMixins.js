export default {
  props: {
    filterValue: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
    }
  },
  watch: {
    // 根据筛选条件获取统计数据
    filterValue: {
      handler() {
        if (this.getData) {
          this.getData()
        }
      },
      deep: true
    }
  },
  mounted() {
    // 根据窗口的大小变化实时调整 chart 大小
    this.$bus.on('window-resize', () => {
      if (this.chartObj) {
        this.chartObj.resize()
      }
    })

    if (this.getData) {
      this.getData()
    }
  },
  beforeDestroy() {
    this.$bus.off('window-resize')
  },
  methods: {
    /**
     * 获取请求参数
     */
    getBaseParams() {
      const params = {}
      if (this.filterValue.dataType !== 'custom') {
        params.dataType = this.filterValue.dataType
      } else {
        if (this.filterValue.strucs.length) {
          params.isUser = 0
          params.structure_id = [this.filterValue.strucs[0].id]
        } else {
          params.isUser = 1
          params.user_id = this.filterValue.users.length ? this.filterValue.users[0].id : ''
        }
      }

      if (this.filterValue.timeLine.type) {
        if (this.filterValue.timeLine.type === 'custom') {
          params.start_time = this.filterValue.timeLine.startTime.replace(/\./g, '-')
          params.end_time = this.filterValue.timeLine.endTime.replace(/\./g, '-')
        } else {
          params.type = this.filterValue.timeLine.value || ''
        }
      }
      return params
    }
  }
}
