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
      message: `修复：
1、修复自定义字段设置隐藏生效问题；
2、修复线索自定义字段转化字段设置生效问题；
3、修复导入数据超过100条部分的数据无法导入问题；
4、修复新建场景保存报错问题；
5、修复客户新建后显示为公海客户，无法操作问题；
6、修复多选字段高级筛选不生效问题；
7、修复产品编辑报错问题；
8、修复部门、人员字段列表展示问题；
9、修复手机、邮箱字段详情编辑校验问题；
10、修复活动记录展示其他客户信息的问题；
11、修复系统提示：“账号在其他地方登录”问题；
12、修复待办事项今日需联系客户标记完成不生效问题；
13、修复仪表盘数据统计错误问题；
14、修复仪表盘遗忘提醒数据查询统计错误问题；
15、修复仪表盘自定义时间、部门筛选数据统计错误问题；
16、修复商业智能自定义时间筛选数据统计错误问题；
17、修复商业智能部门、人员默认筛选数据统计错误问题；
18、修复 72crm-11.0-web（PHP版）部署后部门、成员不展示问题;
19、修复其他已知bug。
20、新增商业智能导出功能。`
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
