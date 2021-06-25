<template>
  <div
    class="project-list"
    direction="column">
    <div v-loading="loading" class="nav-box">
      <xr-header
        :icon-color="projectColor || '#4AB8B8'"
        class="xr-header"
        icon-class="wk wk-project">
        <span slot="label">{{ projectName }}</span>
        <el-popover
          v-if="showSet"
          slot="label"
          v-model="projectHandleShow"
          placement="bottom-start"
          width="182">
          <div class="project-list-popover-btn-list">
            <project-settings
              v-if="permission.setWork"
              :work-id="work_id"
              :title="projectName"
              :color="projectColor"
              :is-open="projectData.is_open"
              :add-members-data="membersList"
              :permission="permission"
              tab-type="base"
              @close="projectHandleShow = false"
              @submite="setSubmite"
              @handle="projectSettingsHandle"
              @click="projectHandleShow = false"/>

            <project-settings
              v-if="permission.setTaskOwnerUser && projectData.is_open != 1"
              :work-id="work_id"
              :title="projectName"
              :color="projectColor"
              :is-open="projectData.is_open"
              :add-members-data="membersList"
              :permission="permission"
              tab-type="member"
              @submite="setSubmite"
              @handle="projectSettingsHandle"/>

            <p v-if="permission.excelImport" @click="taskImportShow = true">导入任务</p>
            <p v-if="permission.excelExport" @click="exportClick">导出任务</p>
            <p
              v-if="permission.archiveTask && permission.setWork"
              @click="archiveProject">归档项目</p>
            <p
              v-if="permission.deleteTask && permission.setWork"
              @click="deleteProject">删除项目</p>
            <p v-if="projectData.is_open == 0" @click="exitProject">退出项目</p>
          </div>
          <i
            slot="reference"
            class="wk wk-manage set-img" />
        </el-popover>

        <!-- 人员列表 -->
        <span
          slot="ft"
          class="ft-btn"
          @click="membersShow = true">
          <i class="wk wk-s-seas ft-img" />
          <span class="ft-label">成员管理</span>
        </span>
        <span
          v-show="screeningButtonShow"
          slot="ft"
          class="ft-btn"
          @click="screeningShow = true">
          <i class="wk wk-screening ft-img" />
          <span class="ft-label">任务筛选</span>
        </span>

        <!-- 筛选 -->
      </xr-header>

      <div class="nav">
        <el-tabs
          v-model="activeName"
          @tab-click="tabClick">
          <el-tab-pane
            name="task-board">
            <el-dropdown slot="label" trigger="click" @command="tabShowType = $event">
              <span class="el-dropdown-link" >
                {{ tabShowType | showTypeName }}<i class="el-icon-arrow-down el-icon--right"/>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="board">看板视图</el-dropdown-item>
                <el-dropdown-item command="list">列表视图</el-dropdown-item>
                <el-dropdown-item command="user">负责人视图</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-tab-pane>
          <el-tab-pane
            label="附件"
            name="attachment"/>
          <el-tab-pane
            label="任务统计"
            name="task-statistical"/>
          <el-tab-pane
            label="归档任务"
            name="archiving-task"/>
        </el-tabs>
      </div>
    </div>
    <div class="content">
      <keep-alive>
        <component
          :is="showComponent"
          :condition-data="taskConditionObj"
          :work-id="work_id"
          :show-type="tabShowType"
          :permission="permission"/>
      </keep-alive>
    </div>

    <!-- 筛选 -->
    <task-screening
      v-if="screeningShow"
      :work-id="work_id"
      :data="taskConditionObj"
      @change="taskScreeningChange"
      @close="screeningShow = false"/>

    <!-- 人员列表 -->
    <members
      :work-id="work_id"
      :list="membersList"
      :is-open="projectData.is_open"
      :permission="permission"
      :visible.sync="membersShow"
      @handle="membersHandle"/>

    <!-- 任务导入 -->
    <task-import
      :work-id="work_id"
      :show.sync="taskImportShow"
      @success="taskImportSuccess"
    />
  </div>
</template>

<script>
import {
  workWorkReadAPI,
  workWorkDeleteAPI,
  workWorkLeaveAPI,
  workWorkOwnerListAPI,
  workTaskExportAPI,
  workWorkArchiveAPI,
  workWorkAddUserGroupAPI
} from '@/api/pm/project'

import TaskBoard from './components/TaskBoard'
import TaskListBoard from './components/TaskListBoard'
import Attachment from './components/Attachment'
import TaskStatistical from './components/TaskStatistical'
import ArchivingTask from './components/ArchivingTask'
import ProjectSettings from './components/ProjectSettings'
import TaskScreening from './components/TaskScreening'
import Members from './components/Members'
import TaskImport from '../components/TaskImport' // 任务导入
import MembersDep from '@/components/SelectEmployee/MembersDep'
import XrHeader from '@/components/XrHeader'

import { downloadExcelWithResData } from '@/utils'

export default {
  components: {
    TaskBoard,
    TaskListBoard,
    Attachment,
    TaskStatistical,
    ArchivingTask,
    ProjectSettings,
    TaskScreening,
    Members,
    TaskImport,
    MembersDep,
    XrHeader
  },

  filters: {
    showTypeName(value) {
      return {
        board: '看板视图',
        list: '列表视图',
        user: '负责人视图'
      }[value]
    }
  },

  data() {
    return {
      // 项目ID
      loading: false,
      tabShowType: 'board',
      work_id: '',
      projectName: '',
      projectColor: '',
      projectData: {
        is_open: 0
      },
      taskConditionObj: {
        userIds: [],
        timeId: '',
        tagIds: []
      },

      activeName: 'task-board',
      // 项目设置
      projectHandleShow: false,

      // 人员列表
      membersShow: false,
      membersList: [],
      // 是否显示筛选
      screeningButtonShow: true,
      screeningShow: false,
      // 任务导入展示
      taskImportShow: false,

      // 权限
      permission: {}
    }
  },

  computed: {
    // 展示项目设置按钮
    showSet() {
      return (this.permission.setTaskOwnerUser && this.projectData.is_open != 1) ||
      this.permission.setWork ||
      this.permission.excelImport ||
      this.permission.excelExport ||
      this.permission.archiveTask ||
      this.permission.deleteTask ||
      this.projectData.is_open == 0
    },

    // tabs 下内容视图的组件
    showComponent() {
      if (this.activeName == 'task-board') {
        if (this.tabShowType == 'list') {
          return 'TaskListBoard'
        }

        return this.activeName
      }

      return this.activeName
    }
  },

  beforeRouteUpdate(to, from, next) {
    this.work_id = to.params.id
    this.membersShow = false
    this.screeningShow = false
    this.getDetail()
    this.getMemberList()
    next()
  },

  created() {
    this.activeName = 'task-board'
    // 当页面刷新时重新获取路由信息
    this.work_id = this.$route.params.id
    this.getDetail()
    this.getMemberList()
  },

  methods: {
    /**
     * 获取项目详情
     */
    getDetail() {
      workWorkReadAPI({
        work_id: this.work_id
      })
        .then(res => {
          const data = res.data
          this.projectData = data
          this.projectColor = data.color
          this.projectName = data.name

          this.permission = data.auth || {}
        })
        .catch(() => { })
    },

    tabClick(val) {
      this.screeningButtonShow = this.activeName == 'task-board'
    },

    /**
     * 获取列表
     */
    getMemberList() {
      workWorkOwnerListAPI({
        work_id: this.work_id
      })
        .then(res => {
          this.membersList = res.data || []
          this.$bus.$emit('members-update', this.membersList)
        })
        .catch(() => {})
    },

    /**
     * 编辑成员
     */
    userSelectChange(members, dep) {
      workWorkAddUserGroupAPI({
        work_id: this.work_id,
        owner_user_id: members.map(item => item.id)
      })
        .then(res => {
          this.membersList = res.data || []
          this.$bus.$emit('members-update', this.membersList)
          this.$message.success('添加成功')
        })
        .catch(() => {})
    },

    /**
     * 删除项目
     */
    deleteProject() {
      this.$confirm(
        '确定要删除项目吗？删除后此项目中的所有任务将一并彻底删除，无法恢复',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          workWorkDeleteAPI({ work_id: this.work_id })
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.$bus.$emit('delete-project', this.work_id)
              this.$router.go(-1)
            })
            .catch(() => {})
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    /**
     * 退出项目
     */
    exitProject() {
      this.$confirm('确认退出' + ' "' + this.projectName + '"', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          workWorkLeaveAPI({ work_id: this.work_id })
            .then(res => {
              this.$message({
                type: 'success',
                message: '退出成功!'
              })
              this.$bus.$emit('delete-project', this.work_id)
            })
            .catch(() => {
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          })
        })
    },

    /**
     * 归档项目
     */
    archiveProject() {
      this.$confirm('确认归档项目' + ' "' + this.projectName + '"', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          workWorkArchiveAPI({ work_id: this.work_id, status: 3 }) // 状态 1启用 2 删除 3归档
            .then(res => {
              this.$message({
                type: 'success',
                message: '归档成功'
              })
              this.$bus.$emit('delete-project', this.work_id)
              this.$router.go(-1)
            })
            .catch(() => {})
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          })
        })
    },

    /**
     * 项目设置更新数据
     */
    setSubmite(name, color, is_open) {
      if (this.projectData.is_open != is_open) {
        this.getDetail()
        this.getMemberList()
      } else {
        this.projectColor = color
        this.projectName = name
        this.$bus.$emit('project-setting', name, this.work_id)
      }
    },

    /**
     * 项目设置
     */
    projectSettingsHandle(type, data) {
      if (type == 'member') {
        this.getMemberList()
      }
    },

    /**
     * 成员设置
     */
    membersHandle(type, data) {
      if (type == 'member') {
        this.$bus.$emit('members-update', data)
        this.membersList = data
      }
    },

    /**
     * 审批导出
     */
    exportClick() {
      this.projectHandleShow = false
      this.loading = true
      workTaskExportAPI({
        work_id: this.work_id,
        search: this.taskConditionObj.search,
        owner_user_id: this.taskConditionObj.userIds,
        time_type: this.taskConditionObj.timeId,
        label_id: this.taskConditionObj.tagIds
      })
        .then(res => {
          downloadExcelWithResData(res)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 任务导入成功
     */
    taskImportSuccess() {
      this.$bus.$emit('work-task-import')
    },

    /**
     * 任务筛选
     */
    taskScreeningChange(userIds, timeId, tagIds, search) {
      this.taskConditionObj = {
        userIds,
        timeId,
        tagIds,
        search
      }
    }
  }
}
</script>

<style scoped lang="scss">
.project-list {
  height: 100%;
  overflow: hidden;
  .nav-box {
    margin-bottom: 15px;
    background: #fff;
    border-radius: $xr-border-radius-base;
    border: 1px solid $xr-border-color-base;
    .xr-header {
      padding: 10px 15px;
    }

    .ft-img {
      color: #999;
      cursor: pointer;
    }

    .ft-btn {
      margin-left: 25px;
      color: #999;
      cursor: pointer;
      .ft-img {
        margin-right: 2px;
      }
      .ft-label {
        font-size: 12px;
      }
    }

    .set-img {
      margin-left: 15px;
      font-size: 14px;
      color: #ccc;
      cursor: pointer;
    }

    .ft-btn:hover {
      color: $xr-color-primary;
      .ft-img  {
        color: $xr-color-primary;
      }
    }

    .ft-img:hover,
    .set-img:hover {
      color: $xr-color-primary;
    }

    .nav {
      margin-left: 64px;
      .el-tabs /deep/ .el-tabs__header {
        margin-bottom: 0;
        .el-tabs__nav-wrap::after {
          height: 0;
        }
      }
    }
  }
  .content {
    height: calc(100% - 105px);
    overflow-y: auto;
    position: relative;
  }
}
// 设置
.project-list-popover-btn-list {
  margin: 0 -12px;
  p {
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    padding-left: 32px;
  }
  p:hover {
    background: #f7f8fa;
    color: #2362FB;
  }
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  will-change: transform;
  transition: all 0.35s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(100%);
}

// 项目图
.wukong-subproject {
  font-size: 27px;
  margin-right: 8px;
}
</style>
