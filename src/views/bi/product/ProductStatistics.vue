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
      <el-button
        class="export-button"
        type="primary"
        @click.native="exportClick">导出</el-button>
    </filtrate-handle-view>
    <div class="content">
      <el-table
        id="crm-table"
        ref="tableRef"
        :data="list"
        :height="tableHeight"
        :cell-class-name="cellClassName"
        :summary-method="getSummaries"
        show-summary
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
      <div class="p-contianer">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size.sync="pageSize"
          :total="total"
          :pager-count="5"
          class="p-bar"
          background
          layout="prev, pager, next, sizes, total, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </div>
    </div>
    <!-- 预览合同 -->
    <report-list
      :show.sync="reportListShow"
      :title="reportData.title"
      :placeholder="reportData.placeholder"
      :request="reportData.request"
      :params="reportData.params"
      crm-type="contract"/>
  </div>
</template>
<script>
import { biProductStatisticsAPI, biProductStatisticsExportAPI } from '@/api/bi/bi'
import { crmContractQueryListByProductIdAPI } from '@/api/crm/contract'

import ReportList from '@/views/crm/workbench/components/ReportList'

import BaseMixin from '../mixins/Base'

export default {
  /** 产品销售情况统计 */
  name: 'ProductStatistics',
  components: {
    ReportList
  },
  mixins: [BaseMixin],
  data() {
    return {
      loading: false,
      tableHeight: document.documentElement.clientHeight - 220,
      currentPage: 1,
      pageSize: 15,
      pageSizes: [15, 30, 60, 100],
      total: 0,
      postParams: {}, // 筛选参数

      headFieldList: [
        { field: 'category_id_info', name: '产品分类', width: '115px' },
        { field: 'product_name', name: '产品名称', width: '115px' },
        { field: 'contract_product_sum', name: '合同数', width: '115px' },
        { field: 'product_sum', name: '数量合计', width: '115px' },
        { field: 'contract_money', name: '订单产品小计', width: '115px' }

        // { field: 'category_id_info', name: '产品分类', width: '115px' },
        // { field: 'product_name', name: '产品名称', width: '115px' },
        // { field: 'contract_product_sum', name: '合同编号', width: '115px' },
        // { field: 'owner_user_name', name: '负责人', width: '115px' },
        // { field: 'contract_name', name: '客户名称', width: '115px' },
        // { field: 'price', name: '销售单价', width: '115px' },
        // { field: 'product_sum', name: '数量', width: '115px' },
        // { field: 'subtotal', name: '订单产品小计', width: '115px' }
      ],
      list: [],
      //
      extraData: {
        contract_product_sum: 0,
        product_sum: 0,
        contract_money: 0
      },

      reportListShow: false,
      reportData: {
        title: '',
        placeholder: '',
        request: null,
        params: null
      }
    }
  },
  computed: {},
  mounted() {
    /** 控制table的高度 */
    window.onresize = () => {
      const offsetHei = document.documentElement.clientHeight
      this.tableHeight = offsetHei - 220
    }
  },
  methods: {
    /**
     * 通过回调控制class
     */
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'contract_product_sum') {
        return 'can-visit--underline'
      } else {
        return ''
      }
    },
    /**
     * 更改每页展示数量
     */
    handleSizeChange(val) {
      this.pageSize = val
      this.getProductDatalist()
    },

    /**
     * 更改当前页数
     */
    handleCurrentChange(val) {
      this.currentPage = val
      this.getProductDatalist()
    },

    /**
     * 当某一行被点击时会触发该事件
     */
    handleRowClick(row, column, event) {
      if (column.property === 'contract_product_sum') {
        this.reportData.title = `${column.label}详情`
        this.reportData.request = crmContractQueryListByProductIdAPI
        this.reportData.placeholder = '请输入客户名称/合同编号/合同名称'
        const params = { ...this.postParams, product_id: row.product_id }
        this.reportData.params = params
        this.reportListShow = true
      }
    },

    /** 获取部门业绩完成信息 */
    getProductDatalist(params) {
      if (params) {
        this.postParams = params
      }
      this.loading = true
      biProductStatisticsAPI({
        ...this.postParams,
        page: this.currentPage,
        limit: this.pageSize
      })
        .then(res => {
          const resData = res.data || {}
          this.list = resData.list || []
          this.extraData = resData.total || { extraData: 0,
            product_sum: 0,
            contract_money: 0 }
          this.total = resData.count
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    /**
     * 合计
     */
    getSummaries(param) {
      this.$nextTick(() => {
        this.$refs.tableRef.doLayout()
      })
      return ['合计', '', this.extraData.contract_product_sum, this.extraData.product_sum, this.extraData.contract_money]
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
   overflow:visible !important;
}
</style>
