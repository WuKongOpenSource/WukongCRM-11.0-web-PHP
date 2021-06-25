<template>
  <el-dialog
    :visible="visible"
    :close-on-click-modal="false"
    class="xr-upgrade-dialog"
    title=""
    width="700px"
    append-to-body
    @close="closeView">
    <el-button class="close-button" icon="el-icon-close" @click="closeView"/>
    <flexbox class="upgrade-header" justify="center" align="center" orient="vertical">
      <span class="upgrade-header__title">升级通知</span>
      <span class="upgrade-header__version">版本{{ WKConfig.version }}</span>
    </flexbox>
    <div class="content">
      <div class="content__title">升级内容：</div>
      <div class="content__content">{{ message }}</div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeView">我知道了</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { readUpdateNoticeAPI } from '@/api/common'

export default {
  name: 'XrUpgradeDialog',
  components: {},
  props: {
    visible: Boolean
  },
  data() {
    return {
      message: `新增：
1、增加多种自定义字段类型，支持自定义字段占比配置及布局调整；
2、客户管理：新增团队成员有效时间；优化团队成员权限；联系人和回款模块增加团队成员功能；增加相关团队字段，支持通过相关团队对团队成员进行筛选；
3、新增日志点赞互动功能；
4、新增发票模块自定义字段、发票导出功能；
5、增加市场活动自定义表单
6、跟进记录增加导入导出功能
7、导入数据时，增加“负责人”字段
8、角色权限：系统管理角色新增权限"角色权限查看"，控制在新建员工选择角色和编辑员工角色时，可查看和选择角色的范围；

优化：
1、优化客户管理仪表盘，图表展示和统计数据等；
2、优化导出，支持操作一万条以上数据；
3、高级筛选判断符优化调整；时间筛选增加固定时间段（例如今日、本月、本年等）；
4、权限优化

修复：
1、修复其他已知bug。`
    }
  },
  computed: {},
  watch: {},
  mounted() {},

  beforeDestroy() {},
  methods: {
    closeView() {
      readUpdateNoticeAPI().then(res => {

      }).catch(() => {})
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss">
.xr-upgrade-dialog {
  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    position: relative;
    padding: 0 0 20px;
    height: 500px;
  }

  .upgrade-header {
    background-image: url('~@/assets/img/upgrade_bar.png');
    background-repeat: no-repeat;
    background-size: cover;
    height: 131px;
    color: white;

    &__title {
      display: inline-block;
      font-size: 25px;
      font-weight: bold;
    }

    &__version {
      display: inline-block;
      margin-top: 15px;
    }
  }

  .content {
    padding: 20px 30px;
    font-size: 14px;
    position: relative;
    height: 370px;
    overflow-y: auto;
    &__title {
      font-weight: bold;
    }

    &__content {
      margin-top: 15px;
      white-space: pre-wrap;
      word-wrap: break-word;
      word-break: break-all;
      line-height: 1.5;
    }
  }

  .close-button {
    position: absolute;
    top: 5px;
    right: 0;
    border: none;
    outline: none;
    background: transparent;
    font-size: 19px;
    font-weight: bold;
    .el-icon-close {
      color: white;
    }
  }
}
</style>
