<template>
  <div
    v-infinite-scroll="getList"
    :key="scrollKey"
    class="main"
    infinite-scroll-distance="100"
    infinite-scroll-disabled="scrollDisabled">
    <div>
      <div class="work-log scroll-body">
        <div class="card">
          <flexbox class="hello-card">
            <xr-avatar
              :name="userInfo.realname"
              :size="50"
              :src="userInfo.img"
              class="user-img" />

            <div class="greeting">
              <div class="hello">
                {{ headData.timeLabel }}，{{ nickName }}
                <span class="status">
                  <span :class="userDoneStatus.icon" class="icon wk" />
                  <span>{{ userDoneStatus.label }}</span>
                </span>
              </div>
              <div v-if="headData && headData.timeRemind" class="text">
                {{ headData.timeRemind }}
              </div>
            </div>

            <div class="statistics">
              <div class="title">
                <!-- <span class="icon wk wk-task" /> -->
                <span>本月完成日志</span>
              </div>
              <div class="info">
                <span class="special">{{ headData.allNum }}</span>篇
              </div>

            </div>
          </flexbox>
          <flexbox
            align="stretch"
            class="report-card">
            <div class="report-card__label">销售简报</div>
            <report-menu
              :list="reportList"
              @select="reportSelect" />
          </flexbox>
        </div>


        <create-log v-if="showAdd" ref="createLog" class="add-card card" @update="addLogSuccess" @completeSelect="completeSelect" />

        <flexbox class="filter-control card">
          <xh-user-cell
            v-if="showUserSelect"
            :radio="false"
            :value="userSelects"
            class="xh-user-cell"
            placeholder="选择人员"
            @value-change="userChange" />
          <time-type-select
            :width="190"
            :options="timeOptions"
            :default-type="timeSelect"
            @change="timeTypeChange" />
          <el-select
            v-model="filterForm.category_id"
            placeholder="类型">
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.label"
              :value="item.value" />
          </el-select>
          <el-input
            v-model="search"
            placeholder="请输入工作内容"
            prefix-icon="el-icon-search"
            type="text"
            @blur="refreshList"
            @keyup.enter.native="refreshList"/>
          <div class="filter-right">
            <span class="total-count">已筛选出<span>{{ totalCount }}</span>项</span>
            <el-button
              class="export-btn"
              @click="logExportClick">导出</el-button>
          </div>
        </flexbox>
      </div>

      <div
        v-for="(item, index) in listData"
        :key="index"
        class="card">
        <log-item
          :data="item"
          :index="index"
          :show-history-btn="showUserSelect"
          @read="handleRead(index)"
          @add-comment="handleAddComment"
          @delete="handleDelete"
          @edit="handleEdit"
          @relate-detail="enterRelateDetail"
          @report-detail="reportSelect"
          @check-history="checkUserHistory" />
      </div>
    </div>
    <p
      v-if="loading"
      class="scroll-bottom-tips">加载中...</p>
    <p
      v-if="noMore"
      class="scroll-bottom-tips">没有更多了</p>

    <c-r-m-all-detail
      :visible.sync="showRelatedDetail"
      :crm-type="relatedCRMType"
      :id="relatedID"
      :no-listener-class="['content-item']" />

    <new-dialog
      v-if="showNewDialog"
      :form-data="formData"
      :img-file-list="imgFileList"
      :accessory-file-list="accessoryFileList"
      :new-loading="newLoading"
      dialog-title="编辑日志"
      @close="showNewDialog = false"
      @submitBtn="submitEdit" />

    <!-- 销售简报列表 -->
    <report-list
      :show.sync="reportListShow"
      :title="reportData.title"
      :placeholder="reportData.placeholder"
      :crm-type="reportData.crmType"
      :request="reportData.request"
      :params="reportData.params"
      :record-request="reportData.recordRequest"
      :field-list="fieldReportList"
      :paging="reportData.paging"
      :sortable="reportData.sortable"/>

    <log-com-detail :show.sync="logComDetailShow" :type="logComDetailType" />
  </div>
</template>

<script>
import {
  journalListAPI,
  journalEditAPI,
  journalQueryBulletinAPI,
  journalQueryRecordCountAPI,
  journalQueryBulletinByTypeAPI,
  journalGetLogWelcomeAPI,
  journalQueryActivityCountAPI,
  oaLogExportAPI } from '@/api/oa/journal'
import { crmQueryOneBulletinAPI } from '@/api/crm/workbench'

import ReportMenu from './components/ReportMenu'
import LogItem from './components/LogItem'
import CreateLog from './components/CreateLog'
import LogComDetail from './components/LogComDetail' // 日志完成 情况详情
import XhUserCell from '@/components/CreateCom/XhUserCell'
import CRMAllDetail from '@/views/crm/components/CRMAllDetail'
import NewDialog from '@/views/oa/journal/NewDialog'
import TimeTypeSelect from '@/components/TimeTypeSelect'
import ReportList from '@/views/crm/workbench/components/ReportList'

import { mapGetters } from 'vuex'
import moment from 'moment'
import { downloadExcelWithResData } from '@/utils/index'
import { separator } from '@/filters/vueNumeralFilter/filters'

export default {
  name: 'WorkLog',
  components: {
    ReportMenu,
    LogItem,
    CreateLog,
    LogComDetail,
    XhUserCell,
    CRMAllDetail,
    NewDialog,
    TimeTypeSelect,
    ReportList
  },
  data() {
    return {
      logType: '', // all send 我发出的 received 我收到的
      // 头部信息
      headData: {
        nowNum: 0,
        allNum: 0,
        timeLabel: '',
        timeRemind: '',
        startLog: 0
      },

      // 简报信息
      reportList: [
        {
          type: 'customer',
          key: 'customerNum',
          info: '今日新增客户',
          name: '今日新增客户 0'
        },
        {
          type: 'business',
          key: 'businessNum',
          info: '今日新增商机',
          name: '今日新增商机 0'
        },
        {
          type: 'contract',
          key: 'contractNum',
          info: '今日新增合同',
          name: '今日新增合同 0'
        },
        {
          type: 'receivables',
          key: 'receivablesMoneyNum',
          info: '今日新增回款',
          name: '今日新增回款 0'
        },
        {
          type: 'record',
          key: 'recordNum',
          info: '今日新增跟进记录',
          name: '今日新增跟进记录 0'
        }
      ],

      // 简报信息


      listData: [],
      loading: false, // loading
      noMore: false,
      page: 1,
      totalCount: 0,
      scrollKey: Date.now(),

      options: [
        { label: '全部', value: 0 },
        { label: '日报', value: 1 },
        { label: '周报', value: 2 },
        { label: '月报', value: 3 }
      ],

      filterForm: {
        category_id: 0,
        create_user_id: ''
      },
      userSelects: [],

      timeOptions: [
        { label: '今天', value: 'today' },
        { label: '昨天', value: 'yesterday' },
        { label: '本周', value: 'week' },
        { label: '上周', value: 'lastWeek' },
        { label: '最近30天', value: 'recent30' },
        { label: '最近60天', value: 'recent60' },
        { label: '本月', value: 'month' },
        { label: '上月', value: 'lastMonth' },
        { label: '本季度', value: 'quarter' },
        { label: '上季度', value: 'lastQuarter' },
        { label: '本年', value: 'year' },
        { label: '去年', value: 'lastYear' }
      ],
      timeSelect: {
        type: 'default',
        value: 'recent30'
      },
      search: '',

      // 相关详情的查看
      relatedID: '',
      relatedCRMType: '',
      showRelatedDetail: false,

      // 编辑
      newLoading: false,
      showNewDialog: false,
      formData: {},
      imgFileList: [],
      accessoryFileList: [],

      // 简报预览
      reportListShow: false,
      fieldReportList: null,
      reportData: {
        title: '',
        placeholder: '',
        crmType: '',
        request: null,
        recordRequest: journalQueryRecordCountAPI,
        params: null,
        paging: true,
        sortable: false
      },

      // 日志完成详情
      logComDetailType: '',
      logComDetailShow: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),

    showUserSelect() {
      return this.logType != 'send'
    },

    showAdd() {
      return this.logType != 'received'
    },

    userDoneStatus() {
      return {
        icon: this.headData.startLog > 0 ? 'wk-success' : 'wk-close',
        label: this.headData.startLog > 0 ? '今天日志已完成' : '今天日志还未完成'
      }
    },

    // 无线滚动控制
    scrollDisabled() {
      return this.loading || this.noMore
    },

    nickName() {
      if (!this.userInfo.realname) return this.userInfo.username
      const reg = /[a-zA-Z]+/
      if (reg.test(this.userInfo.realname) || !this.userInfo.sex) {
        return this.userInfo.realname
      }
      return this.userInfo.realname.slice(0, 1) + (this.userInfo.sex == '男' ? '先生' : '女士')
    }
  },
  watch: {
    filterForm: {
      handler() {
        this.refreshList()
      },
      deep: true
    }
  },
  created() {
    this.logType = this.$route.params.type
    this.getLogRemind()
    this.getHeadDetail()
    this.getReportData()
  },

  beforeRouteUpdate(to, from, next) {
    this.logType = to.params.type
    this.totalCount = 0
    if (this.$refs.createLog) {
      this.$refs.createLog.showMore = false
    }
    this.filterForm = {
      category_id: 0,
      create_user_id: ''
    }
    this.userSelects = []

    this.timeSelect = {
      type: 'default',
      value: 'recent30'
    }
    this.refreshList()
    next()
  },
  methods: {
    /**
     * 获取概要
     */
    getHeadDetail() {
      journalQueryBulletinAPI().then(res => {
        this.headData.nowNum = res.data.logCount
        this.headData.allNum = res.data.mothEndCount
        this.headData.startLog = res.data.startLog
      }).catch(() => {

      })
    },

    /**
     * 简报信息
     */
    getReportData() {
      this.loading = true
      crmQueryOneBulletinAPI({
        // type: 'today',
        // is_user: 1,
        // user_id: this.userInfo.id
      }).then(res => {
        this.loading = false
        const data = res.data.data || {}
        this.reportList = this.reportList.map(item => {
          if (item.key == 'receivablesMoneyNum') {
            data.receivablesMoneyNum = separator(Math.floor(data.receivablesMoneyNum || 0))
          }
          item.name = `${item.info} ${data[item.key]}`
          return item
        })
      }).catch(() => {
        this.loading = false
      })
    },

    getLogRemind() {
      this.getNetworkWelcome()
      const hour = moment().format('H')
      if (hour < 12) {
        // const num = Math.floor(Math.random() * 6)
        this.headData.timeLabel = '早上好'
        // this.headData.timeRemind = [
        //   '给自己一个微笑，告诉自己今天会更美好',
        //   '生命的意义在于和别人的不同之处',
        //   '美丽的早晨，灿烂的你，美好的一天在等你',
        //   '暖暖的阳光照，柔柔的轻风笑，绵绵的岁月长，真真的祝福到',
        //   '美好的一天开始了，每天给自己一个希望',
        //   '蓝天是宁静的，空气是清新的，阳光是明媚的'
        // ][num]
      } else if (hour < 18) {
        // const num = Math.floor(Math.random() * 6)
        this.headData.timeLabel = '下午好'
        // this.headData.timeRemind = [
        //   '认真对待工作，终有一天，你的每一份努力，都将绚烂成花',
        //   '通过辛勤的工作获得的财富才是人生的大快事',
        //   '生命之中总是有太多的感动，难忘的是你灿烂的笑容',
        //   '努力工作，永远不要向命运低头，不要向生活妥协',
        //   '生命，是一树花开，或安静或热烈',
        //   '人生，最快乐的莫过于奋斗'
        // ][num]
      } else {
        // const num = Math.floor(Math.random() * 5)
        this.headData.timeLabel = '晚上好'
        // this.headData.timeRemind = [
        //   '工作一天辛苦了，这世界不会辜负每一份努力和坚持',
        //   '无须缅怀昨天，不必奢望明天，只要认真过好每个今',
        //   '每一份坚持都是成功的累积，相信自己，总会遇到惊喜',
        //   '不要失去希望，你永远不知道明天会带来什么',
        //   '工作一天辛苦了，人生，最快乐的莫过于奋斗'
        // ][num]
      }
    },

    getNetworkWelcome() {
      journalGetLogWelcomeAPI().then(res => {
        this.headData.timeRemind = res.data
      }).catch(() => {
      })
    },

    /**
     * 刷新列表
     */
    refreshList() {
      this.page = 1
      this.listData = []
      this.noMore = false
      this.totalCount = 0
      this.scrollKey = Date.now()
    },

    /**
     * 获取日志列表
     */
    getList(action = null) {
      if (this.loading) return
      this.loading = true
      const params = this.getBaseParams()
      params.page = this.page
      params.limit = 5

      journalListAPI(params).then(res => {
        this.loading = false
        if (!this.noMore) {
          this.listData = this.listData.concat(res.data.page.list)
          this.page++
        }
        this.totalCount = res.data.page.dataCount
        this.noMore = res.data.page.lastPage
      }).catch(() => {
        this.noMore = true
        this.loading = false
      })
    },

    /**
     * 获取基础请求参数
     */
    getBaseParams() {
      const params = {
        search: this.search,
        ...this.filterForm
      }

      if (this.timeSelect.type) {
        if (this.timeSelect.type === 'custom') {
          params.start_time = this.timeSelect.startTime.replace(/\./g, '-')
          params.end_time = this.timeSelect.endTime.replace(/\./g, '-')
        } else {
          params.type = this.timeSelect.value || ''
        }
      }

      if (this.logType != 'all') {
        params.by = {
          send: 'me',
          received: 'other'
        }[this.logType]
      }

      if (this.logType == 'send' && params.hasOwnProperty('create_user_id')) {
        delete params.create_user_id
      }

      if (params.hasOwnProperty('category_id') && params.category_id === 0) {
        delete params.category_id
      }

      return params
    },

    /**
     * 添加回复
     */
    handleAddComment(data) {
      this.listData[data.index].replyList.push(data.data)
    },

    /**
     * 日志删除
     * @param index {number}
     */
    handleDelete(index) {
      this.listData.splice(index, 1)
      this.getHeadDetail()
      this.refreshList()
    },

    /**
     * 日志添加成功
     */
    addLogSuccess() {
      this.refreshList()
      this.headData.nowNum++
      this.headData.allNum++
    },

    /**
     * 日志编辑
     * @param index {number}
     */
    handleEdit(index, data) {
      this.formData = data
      this.imgFileList = data.imgList.map(item => {
        if (item.file_path) {
          item.url = item.file_path
        }
        return item
      })
      // 附件
      this.accessoryFileList = data.fileList
      // 员工部门赋值
      // this.formData.depData = data.sendDeptList ? data.sendDeptList : []
      // this.formData.sentWhoList = data.sendUserList ? data.sendUserList : []
      this.showNewDialog = true
    },

    /**
     * 编辑提交
     */
    submitEdit(key, batchId, relevanceAll, imageFileList, fileList) {
      this.newLoading = true
      // 获取部门
      const dep = []
      if (this.formData.depData) {
        for (const j of this.formData.depData) {
          dep.push(j.id)
        }
      }
      // 获取员工
      const staff = []
      if (this.formData.sendUserList) {
        for (const h of this.formData.sendUserList) {
          staff.push(h.id)
        }
      }
      const pramas = {
        log_id: this.formData.log_id,
        category_id: key,
        content: this.formData.content,
        tomorrow: this.formData.tomorrow,
        question: this.formData.question,
        // batchId: batchId,
        send_user_ids: staff,
        // sendDeptIds: dep,
        customer_ids: relevanceAll.customerIds || relevanceAll.customer_ids,
        contacts_ids: relevanceAll.contactsIds || relevanceAll.contacts_ids,
        business_ids: relevanceAll.businessIds || relevanceAll.business_ids,
        contract_ids: relevanceAll.contractIds || relevanceAll.contract_ids,
        file: [...imageFileList.map(item => {
          if (item.response) {
            return item.response.data.file_id
          } else {
            return item.file_id
          }
        }), ...fileList.map(item => {
          if (item.response) {
            return item.response.data.file_id
          } else {
            return item.file_id
          }
        })
        ]
      }
      journalEditAPI(pramas)
        .then(res => {
          this.showNewDialog = false
          this.refreshList()
          this.$message.success('编辑成功')
          this.newLoading = false
        })
        .catch(() => {
          this.newLoading = false
          this.$message.error('编辑失败')
        })
    },

    /**
     * 日志已读
     * @param index
     */
    handleRead(index) {
      this.listData[index].isRead = 1
    },

    /**
     * 筛选条件人员选择
     */
    userChange(data) {
      this.userSelects = data.value || []
      if (data.value.length > 0) {
        this.filterForm.create_user_id = data.value.map(item => {
          return item.id
        })
      } else {
        this.filterForm.create_user_id = ''
      }
    },

    /**
     * 查看某人历史
     */
    checkUserHistory(user) {
      this.userSelects = user ? [user] : []
      if (user) {
        this.filterForm.create_user_id = user.id
      } else {
        this.filterForm.create_user_id = ''
      }
    },

    /**
     * 时间更改
     */
    timeTypeChange(data) {
      this.timeSelect = data
      this.refreshList()
    },

    /**
     * 进入相关详情
     */
    enterRelateDetail(type, data) {
      this.relatedID = data[type + '_id']
      this.relatedCRMType = type
      this.showRelatedDetail = true
    },

    /**
     * 简报预览
     */
    reportSelect(item, data) {
      if (item.type) {
        this.reportData.title = `销售简报-${item.info}`
        this.reportData.placeholder = {
          customer: '请输入客户名称',
          business: '请输入商机名称',
          contract: '请输入合同名称',
          receivables: '请输入回款编号',
          record: ''
        }[item.type]


        this.reportData.crmType = item.type
        // data 存在 是已添加日志预览  不存在为页面顶部 销售简报预览
        this.reportData.params = data ? { log_id: data.log_id } : { today: 1 }

        // type   1 客户 2 商机 3 合同 4 回款 5 跟进记录
        // this.reportData.params.type = {
        //   customer: 1,
        //   business: 2,
        //   contract: 3,
        //   receivables: 4,
        //   record: 5
        // }[item.type]
        this.reportData.params.type = 'today'
        if (item.type == 'record') {
          this.fieldReportList = [
            {
              label: '模块',
              prop: 'types',
              width: 300
            },
            {
              label: '新增跟进记录数',
              prop: 'dataCount'
            }
          ]
          this.reportData.request = journalQueryActivityCountAPI
          this.reportData.paging = false
          this.reportData.sortable = false
        } else {
          this.fieldReportList = this.getReportFieldList(item.type)
          this.reportData.request = journalQueryBulletinByTypeAPI
          this.reportData.paging = true
          this.reportData.sortable = 'custom'
        }

        this.reportListShow = true
      }
    },

    /**
     * type   1 客户 2 商机 3 合同 4 回款 5 跟进记录
     *
     * 表头数据
     * 客户：客户名称、成交状态、最后跟进时间、创建时间、负责人
     * 商机：商机名称、商机阶段、最后跟进时间、创建时间、负责人
     * 合同：合同名称、合同状态、创建时间、公司签约人
     * 回款：回款编号、回款时间、负责人
     */
    getReportFieldList(type) {
      return {
        customer: [
          {
            label: '客户名称',
            prop: 'name'
          },
          {
            label: '成交状态',
            prop: 'deal_status'
          },
          {
            label: '最后跟进时间',
            prop: 'last_time'
          },
          {
            label: '创建时间',
            prop: 'create_time'
          },
          {
            label: '负责人',
            prop: 'owner_user_name'
          }
        ],
        business: [
          {
            label: '商机名称',
            prop: 'name'
          },
          {
            label: '商机阶段',
            prop: 'status_name'
          },
          {
            label: '最后跟进时间',
            prop: 'last_time'
          },
          {
            label: '创建时间',
            prop: 'create_time'
          },
          {
            label: '负责人',
            prop: 'owner_user_name'
          }
        ],
        contract: [
          {
            label: '合同名称',
            prop: 'name'
          },
          {
            label: '合同状态',
            prop: 'check_status'
          },
          {
            label: '创建时间',
            prop: 'create_time'
          },
          {
            label: '公司签约人',
            prop: 'order_user_name'
          }
        ],
        receivables: [
          {
            label: '回款编号',
            prop: 'number'
          },
          {
            label: '回款时间',
            prop: 'return_time'
          },
          {
            label: '负责人',
            prop: 'owner_user_name'
          }
        ]
      }[type]
    },

    /**
     * 日志导出功能
     */
    logExportClick() {
      if (this.filterForm.category_id == 0) {
        this.$message.error('请先选择”日报、周报、月报“中的一种类型导出')
        return
      }

      this.loading = true

      oaLogExportAPI(this.getBaseParams())
        .then(res => {
          downloadExcelWithResData(res)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 查看完成信息
     */
    completeSelect(type) {
      this.logComDetailType = type
      this.logComDetailShow = true
    }
  }
}
</script>

<style scoped lang="scss">
  @import "./style";
</style>
