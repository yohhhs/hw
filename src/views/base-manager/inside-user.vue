<template>
  <div class="inside-user">
    <query-wrapper @userQuery="queryList">
      <Input class="query-item" v-model="keyword" placeholder="请输入关键字" />
    </query-wrapper>
    <btn-wrapper @btnClick="btnClick"></btn-wrapper>
    <Table :columns="tableColumns" :loading="tableLoading" :data="tableData"></Table>
    <Page style="margin-top: 20px;text-align: center;" :current="pageNo" :total="total" show-elevator @on-change='changePage'></Page>
    <Modal
      v-model="addModal.isShow"
      :mask-closable="false"
      title="添加">
      <inside-edit v-if="addModal.isShow" ref="addEdit"></inside-edit>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="addModal.loading"  @click="addConfirm">确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="writeModal.isShow"
      :mask-closable="false"
      title="修改">
      <inside-edit v-if="writeModal.isShow" ref="writeEdit" :isWrite="true" :detail="detail"></inside-edit>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="writeModal.loading"  @click="writeConfirm">确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="managerArea.modal"
      :mask-closable="false"
      width="800"
      title="关联区域列表">
      <area-edit v-if="managerArea.modal" :id="currentId"></area-edit>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>
<script>
  import queryWrapper from '@/components/query-wrapper'
  import btnWrapper from '@/components/btn-wrapper'
  import insideEdit from './components/inside-edit'
  import areaEdit from './components/area-edit'
  import { message, table, page, addModal, writeModal } from '@/common/js/mixins'
  import { insideUser } from '@/api/request'

  export default {
    data () {
      return {
        managerArea: {
          modal: false
        },
        keyword: '',
        detail: null,
        currentId: null,
        tableColumns: [
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '账号',
            key: 'mobile'
          },
          {
            title: '账户状态',
            render: (h, params) => {
              return h('div', params.row.status === 0 ? '停用' : '启用')
            }
          },
          {
            title: '创建时间',
            key: 'createTime'
          },
          {
            title: '更新时间',
            key: 'updateTime'
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      this.currentId = params.row.id
                      this.managerArea.modal = true
                    }
                  }
                }, '管理关联区域'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      this.detail = params.row
                      this.openWriteModal()
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      this.updateStatus(params.row.id, params.row.status)
                    }
                  }
                }, params.row.status === 0 ? '启用' : '停用')
              ])
            }
          }
        ]
      }
    },
    components: {
      queryWrapper,
      btnWrapper,
      insideEdit,
      areaEdit
    },
    mixins: [message, table, page, addModal, writeModal],
    created () {
      this.getInsideUser()
    },
    methods: {
      getInsideUser () {
        this.openTableLoading()
        insideUser.getManagerMemberList({
          pageSize: 10,
          pageNo: this.pageNo,
          keyword: this.keyword
        }).then(data => {
          this.closeTableLoading()
          if (data !== 'isError') {
            this.tableData = data.list
            this.total = data.total
          }
        })
      },
      queryList () {
        this.pageNo = 1
        this.getInsideUser()
      },
      changePage (no) {
        this.pageNo = no
        this.getInsideUser()
      },
      btnClick (handleName) {
        switch (handleName) {
          case '新增区域负责人':
            this.openAddModal()
            break
        }
      },
      updateStatus (id, status) {
        insideUser.updateManagerStatus({
          managerMemberId: id,
          status: status === 0 ? 1 : 0
        }).then(data => {
          if (data !== 'isError') {
            this.successInfo('更新状态成功')
            this.getInsideUser()
          }
        })
      },
      addConfirm () {
        let returnData = this.$refs.addEdit.returnData()
        if (returnData) {
          this.openAddLoading()
          insideUser.addManagerMember({
            name: returnData.name,
            mobile: returnData.mobile,
            password:returnData.password
          }).then(data => {
            this.closeAddLoading()
            if (data !== 'isError') {
              this.successInfo('添加成功')
              this.getInsideUser()
              this.closeAddModal()
            }
          })
        }
      },
      writeConfirm () {
        let returnData = this.$refs.writeEdit.returnData()
        if (returnData) {
          this.openWriteLoading()
          insideUser.updateManagerMember({
            managerMemberId: this.detail.id,
            name:returnData.name,
            password:returnData.password,
            status:returnData.status
          }).then(data => {
            this.closeWriteLoading()
            if (data !== 'isError') {
              this.successInfo('修改成功')
              this.getInsideUser()
              this.closeWriteModal()
            }
          })
        }
      }
    }
  }
</script>
<style lang="less">
</style>
