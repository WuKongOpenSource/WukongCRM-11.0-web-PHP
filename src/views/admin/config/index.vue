<template>
  <flexbox
    class="main"
    direction="column"
    align="stretch">
    <xr-header
      icon-class="wk wk-enterprise"
      icon-color="#2362FB"
      label="企业首页" />
    <div
      v-loading="loading"
      class="body">
      <!-- 基本信息 -->
      <div class="section">
        <div class="section-title">企业基本信息设置</div>
        <div class="section-content">
          <div class="name">企业名称</div>
          <el-input
            v-model="name"
            :maxlength="50"/>
        </div>
        <div class="section-content">
          <div class="name">企业logo</div>
          <el-upload
            v-if="!logo"
            :show-file-list="false"
            :http-request="fileUpload"
            drag
            class="upload"
            action="http"
            accept="image/png, image/jpeg, image/gif, image/jpg">
            <i class="el-icon-plus uploader-icon"/>
          </el-upload>
          <div
            v-else
            class="upload-show">
            <img v-src="logo">
            <i
              class="el-icon-remove icon-delete"
              @click="deleteCompanyLogo"/>
          </div>
        </div>
      </div>

      <el-button
        v-if="systemSaveAuth"
        class="save-button"
        type="primary"
        @click="save">保存</el-button>
    </div>
    <edit-image
      :fixed-number="[15, 4]"
      :show="showEditImage"
      :image="editImage"
      :file="editFile"
      title="编辑企业logo"
      preview-width="150px"
      preview-height="40px"
      preview-radius="0"
      width="550px"
      save-button-title="确定"
      @save="submiteImage"
      @close="showEditImage=false"/>
  </flexbox>
</template>

<script>
import { adminSystemSaveAPI } from '@/api/admin/config'
import { crmFileSaveAPI } from '@/api/common'

import RadialProgressBar from 'vue-radial-progress'
import EditImage from '@/components/EditImage'
import XrHeader from '@/components/XrHeader'

import { mapGetters } from 'vuex'

export default {
  name: 'SystemConfig',
  components: {
    EditImage,
    XrHeader,
    RadialProgressBar
  },
  data() {
    return {
      loading: false,
      showEditImage: false,
      editImage: null,
      editFile: null,
      name: '',
      logo: '',
      save_name: ''
    }
  },
  computed: {
    ...mapGetters(['manage']),
    systemSaveAuth() {
      return this.manage && this.manage.system && this.manage.system.update
    }
  },

  created() {
    this.getDetail()
  },
  methods: {
    /**
     * 附件上传
     */
    fileUpload(content) {
      const reader = new FileReader()
      var self = this
      reader.onload = function(e) {
        let result
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          result = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          result = e.target.result
        }
        self.editImage = result
        self.editFile = content.file
        self.showEditImage = true
      }
      content.type = 'file'
      reader.readAsDataURL(content.file)
    },

    /**
     * 删除图片
     */
    deleteCompanyLogo() {
      this.logo = ''
      this.save_name = ''
    },

    /**
     * 获取详情
     */
    getDetail() {
      this.loading = true
      this.$store
        .dispatch('SystemLogoAndName')
        .then(res => {
          this.loading = false
          const data = res.data || {}
          this.name = data.name ? data.name : ''
          this.logo = data.logo
        })
        .catch(() => {
          this.loading = false
        })
    },

    submiteImage(data) {
      this.loading = true
      crmFileSaveAPI({ file: data.blob, type: 'file' }).then(res => {
        const resData = res.data || {}
        this.logo = resData.url
        this.save_name = resData.save_name
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 保存
     */
    save() {
      if (!this.name) {
        this.$message.error('企业名称不能为空')
      } else {
        this.loading = true
        adminSystemSaveAPI({
          name: this.name,
          logo: this.save_name || this.logo && this.logo.split('uploads/')[1]
        })
          .then(res => {
            this.loading = false
            this.$message.success('操作成功')
            this.getDetail()
          })
          .catch(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 0 15px;
  height: 100%;
}

.body {
  flex: 1;
  overflow-y: auto;
  padding: 40px 30px 20px 30px;
  background-color: white;
  border: 1px solid #e6e6e6;
  border-radius: $xr-border-radius-base;
  position: relative;
}

// 进度信息
.progress-info {
  &-item {
    text-align: center;
    min-width: 150px;
    flex-shrink: 0;
    font-size: 14px;

    .info-title {
      color: #333;
    }

    .info-value {
      font-size: 13px;
      color: #999;
    }

    .info-value + .info-value {
      margin-top: 8px;
    }

    .progress {
      margin: 20px 0 30px;
      font-size: 12px;
      color: #333;

      &-value {
        font-weight: bold;
        margin-top: 10px;
      }
    }

    .radial-progress-container {
      display: inline-block;
    }
  }
}
.save-button {
  margin-left: 250px;
}

.section + .section {
  margin-top: 50px;
}

.section-title {
  color: #333;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 30px;
}

.section-content {
  margin-bottom: 30px;
  .name {
    color: #333;
    font-size: 14px;
    margin-bottom: 10px;
  }

  .el-input {
    width: 300px;
  }
}

.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 300px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.upload /deep/ .el-upload-dragger {
  width: 300px;
  height: 80px;
}
.upload-show {
  position: relative;
  display: block;
  width: 300px;
  height: 80px;
  img {
    width: 100%;
    height: 100%;
  }

  .icon-delete {
    position: absolute;
    top: -10px;
    right: -8px;
    color: red;
    font-size: 20px;
    display: none;
  }
}
.upload-show:hover {
  .icon-delete {
    display: block;
  }
}
</style>

