<template>
  <div class="address-book-index">
    <div class="header">
      <flexbox class="title">
        <img src="~@/assets/img/addressBook/address_logo.png" alt="" class="pic">
        <span class="text">通讯录</span>
      </flexbox>
      <el-input
        v-model="params.search"
        placeholder="请输入员工姓名/手机号">
        <el-button
          slot="append"
          type="primary"
          @click="getList">
          搜索
        </el-button>
      </el-input>
    </div>
    <div class="container container-hook">
      <flexbox class="filter">
        <span class="filter__label">选择部门</span>
        <xh-structure-cell
          :value="initStrucValue"
          radio
          class="xh-structure-cell"
          @value-change="structureChange" />
      </flexbox>
      <el-table
        v-loading="loading"
        :data="listData"
        :height="tableHeight"
        stripe
        border
        class="n-table--border"
        @sort-change="sortTableList">
        <el-table-column
          label="字母"
          align="center"
          prop="initials"
          width="90"/>
        <el-table-column
          prop="realname"
          label="姓名">
          <template slot-scope="scope">
            <flexbox
              class="user-box">
              <xr-avatar
                :name="scope.row.realname"
                :id="scope.row.id"
                :size="30"
                :src="scope.row.img"
                class="user-img" />
              <span>{{ scope.row.realname }}</span>
            </flexbox>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in tableMap"
          :key="index"
          :prop="item.key"
          :label="item.label" />
        <el-table-column
          fixed="right"
          prop="star"
          label="关注"
          align="center"
          width="120">
          <template slot-scope="scope">
            <span
              :class="{active: scope.row.star === 1}"
              class="wk wk-focus-on focus-icon"
              @click="toggleStar(scope.$index, scope.row.star)" />
          </template>
        </el-table-column>
      </el-table>
      <div class="p-contianer">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size.sync="pageSize"
          :pager-count="5"
          :total="total"
          class="p-bar"
          background
          layout="prev, pager, next, sizes, total, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </div>
    </div>
  </div>
</template>

<script>
import {
  addressListAPI,
  toggleAttentionAPI
} from '@/api/oa/addressBook'

import XhStructureCell from '@/components/CreateCom/XhStructureCell'

export default {
  name: 'AddressBookIndex',
  components: {
    XhStructureCell
  },
  data() {
    return {
      bookType: '', // all 全部 attention 关注的
      initStrucValue: [], // 切换我的 和 我关注的 重置选择的值

      listData: [],
      tableMap: [
        { label: '手机', key: 'mobile' },
        { label: '部门', key: 'structure_name' },
        { label: '岗位', key: 'post' }
      ],
      tableHeight: 0,
      specialRowArr: [],

      currentPage: 1,
      pageSizes: [15, 30, 60],
      pageSize: 10,
      total: 0,
      loading: false,

      params: null
    }
  },
  created() {
    this.bookType = this.$route.params.type
    this.params = this.getDefaultParams(this.bookType)

    this.getList()
    this.$nextTick(() => {
      this.tableHeight = document.getElementsByClassName('container-hook')[0].clientHeight - 94
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.bookType = to.params.type
    this.params = this.getDefaultParams(this.bookType)
    this.initStrucValue = []
    this.listData = []
    this.getList()
    next()
  },
  methods: {
    getList() {
      this.loading = true
      addressListAPI(this.params).then(res => {
        this.loading = false
        this.total = res.data.totalRow
        this.listData = res.data.list || []
        // this.formatList(res.data.list)
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 默认初始化参数
     */
    getDefaultParams(type) {
      const params = {
        page: 1,
        limit: 15,
        structure_id: '',
        search: '',
        initials: 1 // 1正序 2 倒序
      }
      if (this.bookType == 'attention') {
        params.star_type = 1
      }

      return params
    },

    /**
     * 格式化列表数据
     */
    formatList(list = []) {
      this.specialRowArr = []
      this.listData = []
      if (list.length === 0) return []
      const arr = []
      const _emptyObj = {
        structure_id: '',
        deptName: '',
        mobile: '',
        postName: '',
        realname: ''
      }
      arr.push({
        ..._emptyObj,
        initials: list[0].initials
      })
      this.specialRowArr.push(0)
      arr.push(list[0])
      for (let i = 1; i < list.length; i++) {
        const item = list[i]
        if (item.initials === arr[arr.length - 1].initials) {
          arr.push(item)
        } else {
          this.specialRowArr.push(arr.length)
          arr.push({
            ..._emptyObj,
            initials: item.initials
          })
          arr.push(item)
        }
      }
      this.listData = arr
    },

    /**
     * 动态生成 table 行 className
     * @param rowObj
     * @return {string}
     */
    getRowClass(rowObj) {
      if (this.specialRowArr.includes(rowObj.rowIndex)) {
        return 'special-row'
      } else {
        return ''
      }
    },
    /**
     * 排序
     */
    sortTableList(sortObj) {
      if (sortObj.order === 'ascending') {
        this.params.initials = 1
      } else if (sortObj.order === 'descending') {
        this.params.initials = 2
      }
      this.getList()
    },
    /**
     * 切换关注状态
     * @param index
     * @param status
     */
    toggleStar(index, status) {
      this.loading = true
      toggleAttentionAPI({
        target_id: this.listData[index].id,
        type: 'admin_user'
      }).then(() => {
        this.loading = false
        this.listData[index].star = status === 0 ? 1 : 0
        this.$set(this.listData, index, this.listData[index])
      }).catch(() => {
        this.loading = false
      })
    },

    handleSizeChange(size) {
      this.params.limit = size
      this.getList()
    },
    handleCurrentChange(page) {
      this.params.page = page
      this.getList()
    },

    /**
     * 部门修改
     */
    structureChange(data) {
      this.initStrucValue = data.value
      this.params.page = 1
      this.params.structure_id = data.value.length ? data.value[0].id : ''
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">
  @import "./style";
</style>
