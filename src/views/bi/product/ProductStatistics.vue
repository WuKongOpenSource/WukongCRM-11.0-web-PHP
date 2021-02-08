<template>
  <div
    v-loading="loading"
    class="main-container">
    <filtrate-handle-view
      title="产品销售情况统计"
      class="filtrate-bar"
      module-type="product"
      @load="loading=true"
      @change="getProductDatalist">
      <!-- <el-button
        class="export-button"
        type="primary"
        @click.native="exportClick">导出</el-button> -->
    </filtrate-handle-view>
    <div class="content">
      <el-table
        id="crm-table"
        :data="newList"
        :height="tableHeight"
        :span-method="objectSpanMethod"
        :cell-style="cellStyle"
        border
        @row-click="handleRowClick">
        <el-table-column
          v-for="(item, index) in headFieldList"
          :key="index"
          :prop="item.field"
          :label="item.name"
          align="center"
          header-align="center"
          show-overflow-tooltip/>
      </el-table>
    </div>
    <contract-detail
      v-if="showContractview && rowID"
      :id="rowID"
      class="d-view"
      @hide-view="showContractview=false"/>
    <customer-detail
      v-if="showCustomerView && rowID"
      :id="rowID"
      class="d-view"
      @hide-view="showCustomerView=false"/>
    <product-detail
      v-if="showProductview && rowID"
      :id="rowID"
      class="d-view"
      @hide-view="showProductview=false"/>
  </div>
</template>

<script>
import { biProductStatisticsAPI, biProductStatisticsExportAPI } from '@/api/bi/bi'
import ContractDetail from '@/views/crm/contract/Detail'
import CustomerDetail from '@/views/crm/customer/Detail'
import ProductDetail from '@/views/crm/product/Detail'

import BaseMixin from '../mixins/Base'
import { floatAdd } from '@/utils'

export default {
  /** 产品销售情况统计 */
  name: 'ProductStatistics',
  components: {
    ContractDetail,
    CustomerDetail,
    ProductDetail
  },
  mixins: [BaseMixin],
  data() {
    return {
      loading: false,
      tableHeight: document.documentElement.clientHeight - 170,
      postParams: {}, // 筛选参数

      headFieldList: [
        { field: 'category_id_info', name: '产品分类', width: '115px' },
        { field: 'product_name', name: '产品名称', width: '115px' },
        { field: 'contract_num', name: '合同编号', width: '115px' },
        { field: 'owner_user_name', name: '负责人', width: '115px' },
        { field: 'contract_name', name: '客户名称', width: '115px' },
        { field: 'price', name: '销售单价', width: '115px' },
        { field: 'num', name: '数量', width: '115px' },
        { field: 'subtotal', name: '订单产品小计', width: '115px' }
      ],
      list: [],
      //
      spanList: [],
      newList: [],
      /** 控制详情展示 */
      showContractview: false,
      showCustomerView: false,
      showProductview: false,
      rowID: ''
    }
  },
  computed: {},
  mounted() {
    var self = this
    /** 控制table的高度 */
    window.onresize = function() {
      var offsetHei = document.documentElement.clientHeight
      self.tableHeight = offsetHei - 170
    }
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      var item = this.spanList[rowIndex]
      if (columnIndex == 0) {
        if (item.rowspan == 0) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } else {
          return {
            rowspan: item.rowspan,
            colspan: 1
          }
        }
      } else if (columnIndex == 1) {
        if (item.productRowspan == 0) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } else {
          return {
            rowspan: item.productRowspan,
            colspan: 1
          }
        }
      }
    },
    /** 列表操作 */
    // 当某一行被点击时会触发该事件
    handleRowClick(row, column, event) {
      if (column.property === 'contract_name') {
        if (this.showProductview) {
          this.showProductview = false
        }
        if (this.showContractview) {
          this.showContractview = false
        }
        this.rowID = row.customer_id
        this.showCustomerView = true
      } else if (column.property === 'product_name') {
        if (this.showCustomerView) {
          this.showCustomerView = false
        }
        if (this.showContractview) {
          this.showContractview = false
        }
        this.rowID = row.product_id
        this.showProductview = true
      } else if (column.property === 'contract_num') {
        if (this.showProductview) {
          this.showProductview = false
        }
        if (this.showCustomerView) {
          this.showCustomerView = false
        }
        this.rowID = row.contract_id
        this.showContractview = true
      }
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      var item = this.spanList[rowIndex]
      if (item.isSum == true) {
        return { backgroundColor: '#FFF9F2', borderRight: '0 none', fontWeight: 'bold' }
      } else if (item.isAllSum == true) {
        return { backgroundColor: '#FFF3E8', borderRight: '0 none', fontWeight: 'bold' }
      } else if (columnIndex === 1 || columnIndex === 2 || columnIndex === 4) {
        return { color: '#2362FB', cursor: 'pointer' }
      }
    },
    /** 获取部门业绩完成信息 */
    getProductDatalist(params) {
      this.postParams = params
      this.loading = true
      biProductStatisticsAPI(params)
        .then(res => {
          if (res.data && res.data.length > 0) {
            this.list = res.data
            this.handleShowInfo()
          } else {
            this.list = []
            this.spanList = []
            this.newList = []
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    /** 处理展示数据 */
    handleShowInfo() {
      // 记录分类合并
      // 产品合并
      // 小产品
      /**
       * rowspan 数量
       *
       */

      var newList = []
      var spanList = []
      var seriesIndex = 0 // 操控span中元素
      var productIndex = 0

      var subCount = 0 // 产品
      var subMoney = 0
      var allCount = 0 // 系列
      var allMoney = 0

      for (let index = 0; index < this.list.length; index++) {
        const element = this.list[index]
        if (spanList.length == 0) {
          seriesIndex = 0 // 一个新系列的开始
          productIndex = 0 // 一个新产品的开始
          subCount = parseFloat(element.num) // 产品
          subMoney = parseFloat(element.subtotal)
          allCount = parseFloat(element.num) // 系列
          allMoney = parseFloat(element.subtotal)

          spanList.push({ rowspan: 1, productRowspan: 1 })
          newList.push(element) // 真实数据
        } else if (element.category_id != this.list[index - 1].category_id) {
          // 系列改变时候的逻辑
          /** 上一个最后产品的处理 */
          var preItem = spanList[seriesIndex]
          preItem.rowspan += 1
          newList.push({ price: '合计', num: subCount, subtotal: subMoney }) // 产品小计数据
          spanList.push({ rowspan: 0, productRowspan: 1, isSum: true }) // 产品小计style

          newList.push({ price: '总计', num: allCount, subtotal: allMoney }) // 系列小计数据
          spanList.push({ rowspan: 1, productRowspan: 1, isAllSum: true }) // 系列小计style

          /** * 新系列开始 */
          spanList.push({ rowspan: 1, productRowspan: 1 }) // 新系列 新产品的 展示数据开始 style
          subCount = parseFloat(element.num) // 新产品的值 所以取消了重置为0
          subMoney = parseFloat(element.subtotal)
          allCount = parseFloat(element.num) // 系列
          allMoney = parseFloat(element.subtotal)
          newList.push(element) // 真实数据
          seriesIndex = spanList.length - 1 // 一个新系列的开始
          productIndex = spanList.length - 1 // 一个新产品的开始
        } else {
          var preItem = spanList[seriesIndex]
          preItem.rowspan += 1
          /** * 相同产品 */
          if (element.product_id == this.list[index - 1].product_id) {
            var preProItem = spanList[productIndex]
            preProItem.productRowspan += 1
            spanList.push({ rowspan: 0, productRowspan: 0 }) // 产品 非第一条数据的style


            subCount = floatAdd(subCount, parseFloat(element.num)) // 产品
            subMoney = floatAdd(subMoney, parseFloat(element.subtotal))
            allCount = floatAdd(allCount, parseFloat(element.num)) // 系列
            allMoney = floatAdd(allMoney, parseFloat(element.subtotal))

            newList.push(element) // 真实数据
          } else {
            /** * 不相同产品 */
            // 需要添加一个小计
            preItem.rowspan += 1

            newList.push({ price: '合计', num: subCount, subtotal: subMoney }) // 产品小计数据
            spanList.push({ rowspan: 0, productRowspan: 1, isSum: true }) // 产品小计Style

            spanList.push({ rowspan: 0, productRowspan: 1 }) // 新产品 第一条数据style
            productIndex = spanList.length - 1 // 一个新产品的开始=
            subCount = parseFloat(element.num)
            subMoney = parseFloat(element.subtotal) // 开始了一个新的产品  所以没有 清空数据
            allCount = floatAdd(allCount, parseFloat(element.num)) // 系列 继续 叠加
            allMoney = floatAdd(allMoney, parseFloat(element.subtotal))
            newList.push(element) // 真实数据
          }
        }

        if (this.list.length - 1 == index) {
          // 最后一个产品的处理
          var preItem = spanList[seriesIndex]
          preItem.rowspan += 1
          newList.push({ price: '合计', num: subCount, subtotal: subMoney }) // 产品小计数据
          subCount = 0
          subMoney = 0 // 完成一个产品统计 清空数据
          spanList.push({ rowspan: 0, productRowspan: 1, isSum: true }) // 产品小计style

          newList.push({ price: '合计', num: allCount, subtotal: allMoney }) // 系列小计数据
          allCount = 0
          allMoney = 0 // 完成一个系列统计 清空数据
          spanList.push({ rowspan: 1, productRowspan: 1, isAllSum: true }) // 系列小计style
        }
      }

      this.spanList = spanList
      newList[newList.length - 1].price = '总计'
      this.newList = newList
    },

    /**
     * 导出点击
     */
    exportClick() {
      this.requestExportInfo(biProductStatisticsExportAPI, this.postParams, 'statistics')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '../styles/detail.scss';
@import '@/views/crm/styles/detailview.scss';

.content {
  overflow: hidden;
}

.table-header {
  background-color: #f2f2f2;
  .header-item {
    text-align: center;
    height: 40px;
    line-height: 40px;
    border-left: 1px solid #e6e6e6;
  }
  .header-item:first-child {
    border-left: none;
  }
}
/** cell 信息 */
.table-cell {
  div {
    text-align: center;
  }
}
.series-info {
  .series-name {
    width: 115px;
    height: 100%;
  }
  .series-body {
    border-left: 1px solid #e6e6e6;
    flex: 1;
  }
}
.product-info {
  .product-name {
    width: 115px;
  }
  .product-body {
    border-left: 1px solid #e6e6e6;
    flex: 1;
  }
}

.money-cells {
  .money-cell {
    border-left: 1px solid #e6e6e6;
    width: 115px;
    height: 40px;
    line-height: 40px;
  }
  .money-cell:first-child {
    border-left: none;
  }
}

/deep/ .el-table {
  tr td:first-child, tr td:nth-child(2) {
    border-right: 1px solid #e6e6e6;
  }
  tr td:first-child[rowspan='1'], tr td:nth-child(2)[rowspan='1'] {
    border-right: 0 none !important;
  }
}
</style>
