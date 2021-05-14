<template>
  <slide-view
    v-empty="!canShowDetail"
    :listener-ids="listenerIDs"
    :no-listener-ids="noListenerIDs"
    :no-listener-class="noListenerClass"
    :body-style="{padding: 0, height: '100%'}"
    xs-empty-icon="nopermission"
    xs-empty-text="暂无权限"
    @afterEnter="viewAfterEnter"
    @close="hideView">
    <div
      v-loading="loading"
      ref="crmDetailMain"
      class="detail-main">
      <flexbox
        v-if="canShowDetail && detailData"
        direction="column"
        align="stretch"
        class="d-container">
        <c-r-m-detail-head
          :detail="detailData"
          :head-details="headDetails"
          :id="id"
          :crm-type="crmType"
          @handle="detailHeadHandle"
          @close="hideView" />
        <examine-info
          v-if="detailData.flow_id"
          :id="id"
          :record-id="detailData.flow_id"
          :owner-user-id="detailData.owner_user_id"
          class="examine-info"
          examine-type="crm_invoice"
          @on-handle="examineHandle" />
        <div class="d-container-bd">
          <el-tabs
            v-model="tabCurrentName"
            type="border-card"
            class="d-container-bd--left">
            <el-tab-pane
              v-for="(item, index) in tabNames"
              :key="index"
              :label="item.label"
              :name="item.name"
              lazy>
              <component
                :is="item.name"
                :detail="detailData"
                :id="id"
                :crm-type="crmType"
                :filed-list="baseDetailList" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </flexbox>
    </div>

    <!-- <c-r-m-create-view
      v-if="isCreate"
      :action="{type: 'update', id: id, batchId: detailData.batchId}"
      :crm-type="crmType"
      @save-success="editSaveSuccess"
      @hiden-view="isCreate=false" /> -->

    <create
      v-if="isCreate"
      :detail="detailData"
      @save-success="editSaveSuccess"
      @close="isCreate = false"/>
  </slide-view>
</template>

<script>
import { crmInvoiceReadAPI } from '@/api/crm/invoice'

import SlideView from '@/components/SlideView'
import CRMDetailHead from '../components/CRMDetailHead'
import CRMBaseInfo from '../components/CRMBaseInfo' // 基本信息
import RelativeFiles from '../components/RelativeFiles' // 相关附件
import RelativeHandle from '../components/RelativeHandle' // 相关操作
import ExamineInfo from '@/components/Examine/ExamineInfo'
import Create from './Create'

import DetailMixin from '../mixins/Detail'
import { separator } from '@/filters/vueNumeralFilter/filters'

export default {
  // 学员管理 的 发票详情
  name: 'InvoiceDetail',
  components: {
    SlideView,
    CRMDetailHead,
    CRMBaseInfo,
    RelativeFiles,
    RelativeHandle,
    ExamineInfo,
    Create
  },
  mixins: [DetailMixin],
  props: {
    // 详情信息id
    id: [String, Number],
    // 监听的dom 进行隐藏详情
    listenerIDs: {
      type: Array,
      default: () => {
        return ['crm-main-container']
      }
    },
    // 不监听
    noListenerIDs: {
      type: Array,
      default: () => {
        return []
      }
    },
    noListenerClass: {
      type: Array,
      default: () => {
        return ['el-table__body']
      }
    }
  },
  data() {
    return {
      // 展示加载loading
      loading: false,
      crmType: 'invoice',
      // 名称
      name: '',
      headDetails: [
        { title: '客户名称', value: '' },
        { title: '开票金额', value: '' },
        { title: '发票号码', value: '' },
        { title: '实际开票日期', value: '' }
      ],
      tabCurrentName: 'CRMBaseInfo',
      baseDetailList: [], // 基本详情list
      // 编辑操作
      isCreate: false
    }
  },
  computed: {
    tabNames() {
      return [
        { label: '详细资料', name: 'CRMBaseInfo' },
        {
          label: this.getTabName('附件', this.tabsNumber.fileCount),
          name: 'RelativeFiles'
        },
        { label: '操作记录', name: 'RelativeHandle' }
      ]
    }
  },
  mounted() {},
  methods: {
    viewAfterEnter() {
      this.getDetial()
    },

    /**
     * 详情
     */
    getDetial() {
      this.loading = true
      crmInvoiceReadAPI({ id: this.id })
        .then(res => {
          this.loading = false
          this.name = res.data.invoice_number
          this.detailData = res.data
          this.getBaseList(res.data)
          if (this.detailData.dataAuth === 0) return

          //   // 负责人
          this.headDetails[0].value = res.data.customer_name
          this.headDetails[1].value = separator(res.data.invoice_money || 0)
          this.headDetails[2].value = res.data.invoice_number
          this.headDetails[3].value = res.data.real_invoice_date
        })
        .catch(() => {
          this.loading = false
          this.hideView()
        })
    },

    /**
     * 获取基本信息数据
     */
    getBaseList(data) {
      this.baseDetailList = [
        {
          name: '基本信息',
          list: [
            {
              name: '发票申请编号',
              formType: 'text',
              value: data.essential.invoice_apple_number
            },
            {
              name: '客户名称',
              // formType: 'customer',
              value: data.essential.customer_name
            },
            {
              name: '合同编号',
              // formType: 'contract',
              value: data.essential.contract_number
            },
            {
              name: '合同金额',
              // formType: 'text',
              value: data.essential.contract_money
            },
            {
              name: '开票金额（元）',
              // formType: 'text',
              value: data.essential.invoice_money
            },
            {
              name: '开票日期',
              // formType: 'text',
              value: data.essential.create_time
            },
            {
              name: '开票类型',
              // formType: 'text',
              // value: data.essential.invoice_type
              value: {
                1: '增值税专用发票',
                2: '增值税普通发票',
                3: '国税通用机打发票',
                4: '地税通用机打发票',
                5: '收据'
              }[data.essential.invoice_type]
            },
            {
              name: '备注',
              // formType: 'text',
              value: data.essential.remark
            },
            {
              name: '创建人',
              // formType: 'text',
              value: data.essential.create_user_name
            },
            {
              name: '负责人',
              // formType: 'text',
              value: data.essential.owner_user_name
            },
            {
              name: '创建时间',
              // formType: 'text',
              value: data.essential.create_time
            },
            {
              name: '更新时间',
              // formType: 'text',
              value: data.essential.update_time
            },
            {
              name: '审核状态',
              // formType: 'text',
              value: data.essential.check_status
            }
          ]
        },
        {
          name: '发票信息',
          list: [
            {
              name: '抬头类型',
              // formType: 'text',
              // value: data.invoice.title_type
              value: {
                1: '单位',
                2: '个人'
              }[data.invoice.title_type]
            },
            {
              name: '开票抬头',
              // formType: 'text',
              value: data.invoice.invoice_title
            },
            {
              name: '纳税人识别号',
              // formType: 'text',
              value: data.invoice.tax_number
            },
            {
              name: '开户行',
              // formType: 'text',
              value: data.invoice.deposit_bank
            },
            {
              name: '开户账号',
              // formType: 'text',
              value: data.invoice.deposit_account
            },
            {
              name: '开票地址',
              // formType: 'text',
              value: data.invoice.deposit_address
            },
            {
              name: '电话',
              // formType: 'text',
              value: data.invoice.phone
            }
          ]
        },
        {
          name: '邮寄信息',
          list: [
            {
              name: '联系人',
              // formType: 'text',
              value: data.posting.contacts_name
            },
            {
              name: '联系方式',
              // formType: 'text',
              value: data.posting.contacts_mobile
            },
            {
              name: '邮寄地址',
              // formType: 'text',
              value: data.posting.contacts_address
            }
          ]
        }
      ]
    },

    /**
     * 关闭
     */
    hideView() {
      this.$emit('hide-view')
    },

    /**
     * 编辑成功
     */
    editSaveSuccess() {
      this.$emit('handle', { type: 'save-success' })
      this.getDetial()
    },

    /**
     * 审核操作
     */
    examineHandle() {
      this.$emit('handle', { type: 'examine' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/crmdetail.scss';
</style>
