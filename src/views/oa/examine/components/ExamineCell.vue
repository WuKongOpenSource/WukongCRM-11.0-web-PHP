<template>
  <div class="list">
    <div class="list-content">
      <flexbox class="header">
        <template v-if="data.create_user_info">
          <xr-avatar
            :name="data.create_user_info.realname"
            :size="34"
            :src="data.create_user_info.img" />
          <div class="name-time">
            <span class="name">{{ data.create_user_info.realname }}</span>
            <span class="time">{{ data.create_time }}</span>
          </div>
        </template>
        <div class="rt-setting">
          <span
            :style="{ 'background-color': getTaskStatusColor(data.check_status) }"
            class="bg-color"/>
          <span class="dep">
            <span>{{ data.category_name }} - </span>
            <span>{{ getTaskStatusName(data.check_status) }}</span>
          </span>
          <!-- 编辑 -->
          <el-dropdown
            v-if="showHandle && data.permission && (data.permission.is_checked || data.permission.is_update || data.permission.is_delete)"
            trigger="click"
            @command="handleCommand">
            <i
              style="color:#CDCDCD; cursor: pointer;"
              class="el-icon-arrow-down el-icon-more"/>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="data.permission && data.permission.is_checked"
                command="withdraw">撤回</el-dropdown-item>
              <el-dropdown-item
                v-if="data.permission && data.permission.is_update"
                command="edit">编辑</el-dropdown-item>
              <el-dropdown-item
                v-if="data.permission && data.permission.is_delete"
                command="delete">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </flexbox>
      <div
        class="row"
        @click="checkDetail(data)">
        <p
          v-if="data.content"
          class="text">{{ data.content }}</p>
        <p
          v-if="data.remark"
          class="title">{{ data.remark }}</p>
      </div>
      <div
        v-if="(data.fileList && data.fileList.length > 0) || (data.imgList && data.imgList.length > 0)"
        class="accessory">
        <!-- 图片 -->
        <div class="upload-img-box">
          <div
            v-for="(imgItem, k) in data.imgList"
            :key="k"
            class="img-list"
            @click="imgZoom(data.imgList, k)">
            <img v-src="imgItem.url ||imgItem.file_path_thumb">
          </div>
        </div>
        <!-- 附件 -->
        <div class="accessory-box">
          <file-cell
            v-for="(file, fileIndex) in data.fileList"
            :key="fileIndex"
            :list="data.fileList"
            :data="file"
            :cell-index="fileIndex"/>
        </div>
      </div>
      <!-- 相关信息 -->
      <div
        v-if="relatedListData.contacts.length > 0 || relatedListData.customer.length > 0 || relatedListData.business.length > 0 || relatedListData.contract.length > 0"
        class="related-business">
        <div class="label">相关信息</div>
        <div
          v-for="(items, key) in relatedListData"
          :key="key">
          <related-business-cell
            v-for="(item, itemIndex) in items"
            :data="item"
            :cell-index="itemIndex"
            :type="key"
            :key="itemIndex"
            :show-foot="false"
            @click.native="checkRelatedDetail(key, item)"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import RelatedBusinessCell from '@/views/oa/components/RelatedBusinessCell'
import FileCell from '@/views/oa/components/FileCell'
import CheckStatusMixin from '@/mixins/CheckStatusMixin'

export default {
  name: 'ExamineCell', // 审批cell
  components: {
    RelatedBusinessCell,
    FileCell
  },
  mixins: [CheckStatusMixin],
  props: {
    data: Object,
    showHandle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {
    relatedListData() {
      return {
        contacts: (this.data.contactsList || []).map(item => {
          if (item.id) {
            item.contacts_id = item.contacts_id
          }
          return item
        }),
        customer: (this.data.customerList || []).map(item => {
          if (item.id) {
            item.customer_id = item.customer_id
          }
          return item
        }),
        business: (this.data.businessList || []).map(item => {
          if (item.id) {
            item.business_id = item.business_id
          }
          return item
        }),
        contract: (this.data.contractList || []).map(item => {
          if (item.id) {
            item.contract_id = item.contract_id
          }
          return item
        })
      }
    }
  },
  watch: {},
  mounted() {},
  methods: {
    // 放大图片
    imgZoom(images, k) {
      this.$bus.emit('preview-image-bus', {
        index: k,
        data: images
      })
    },
    // 编辑 删除 撤回
    handleCommand(command) {
      this.$emit('on-handle', { type: command, data: { item: this.data }})
    },
    // 查看详情
    checkDetail(data) {
      this.$emit('on-handle', { type: 'view', data: { item: this.data }})
    },
    // 关联详情
    checkRelatedDetail(type, data) {
      this.$emit('on-handle', {
        type: 'related-detail',
        data: { type: type, item: data }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../styles/content.scss';

.list {
  margin-bottom: 20px;
  vertical-align: middle;
  .list-content {
    padding: 0 10px 10px 0;
    .header {
      margin-bottom: 15px;
      @include color9;
      font-size: 12px;
      .name-time {
        display: inline-block;
        margin-left: 13px;
        flex: 1;
        .name {
          font-size: 15px;
          color: #333333;
          display: block;
          margin-bottom: 5px;
        }
      }
      .rt-setting {
        float: right;
        line-height: 30px;
        .dep {
          color: #333333;
          margin-right: 20px;
        }
        img {
          width: 16px;
          @include cursor;
          @include v-align;
        }
        .bg-color {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 5px;
        }
      }
    }
    .row {
      white-space: pre-wrap;
      word-wrap: break-word;
      letter-spacing: 0.5px;
      line-height: 18px;
      cursor: pointer;
      color: #2362FB;
      .text {
        padding-bottom: 10px;
      }
      .title {
        @include color9;
        font-size: 13px;
        padding-bottom: 10px;
      }
    }
    .accessory {
      .upload-img-box {
        margin: 10px 0;
        .img-list {
          display: inline-block;
          position: relative;
          margin-right: 10px;
          width: 80px;
          height: 60px;
          line-height: 60px;
          cursor: pointer;
          img {
            width: 80px;
            height: 60px;
          }
          .img-hover {
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            text-align: center;
            font-size: 12px;
            color: #fff;
            display: none;
            span {
              @include cursor;
              display: inline-block;
            }
          }
        }
        .img-list:hover {
          .img-hover {
            display: inline-block;
          }
        }
      }
    }
    .related-business {
      margin: 15px 0;
      .label {
        font-size: 13px;
        margin-bottom: 7px;
        color: #666;
      }
    }
  }
}
.list:not(:last-child) {
  .list-content {
    border-bottom: 1px solid #e6e6e6;
  }
}
</style>
