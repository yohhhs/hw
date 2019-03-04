<template>
  <div class="organize-user">
    <btn-wrapper @btnClick="btnClick"></btn-wrapper>
    <Table :columns="tableColumns" :loading="tableLoading" :data="tableData"></Table>
    <Page style="margin-top: 20px;text-align: center;" :current="pageNo" :total="total" show-elevator @on-change='changePage'></Page>
    <Modal
      v-model="addModal.isShow"
      :mask-closable="false"
      title="添加机构用户">
      <organize-user-edit v-if="addModal.isShow" ref="addUser"></organize-user-edit>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="addModal.loading"  @click="addConfirm">确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="writeModal.isShow"
      :mask-closable="false"
      title="修改机构用户">
      <organize-user-edit v-if="writeModal.isShow" ref="writeUser" :detail="orgDetail" :isWrite="true"></organize-user-edit>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="writeModal.loading"  @click="writeConfirm">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import btnWrapper from '@/components/btn-wrapper'
  import organizeUserEdit from './components/organize-user-edit'
  import { table, message, addModal, writeModal, page } from '@/common/js/mixins'
  import { organizeUser } from '@/api/request'
  export default {
    data () {
      return {
        currentId: '',
        orgDetail: {
          organizeName: '',
          organizeProfile: ''
        },
        tableColumns: [
          {
            title: '机构ID',
            key: 'organizeId'
          },
          {
            title: '机构名称',
            key: 'organizeName'
          },
          {
            title: '创建时间',
            key: 'createTimeStr'
          },
          {
            title: '操作时间',
            key: 'updateTimeStr'
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('div', [
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
                      let row = params.row
                      this.currentId = row.organizeId
                      this.orgDetail.organizeName = row.organizeName
                      this.orgDetail.organizeProfile = row.organizeProfile
                      this.openWriteModal()
                    }
                  }
                }, '编辑')
              ])
            }
          }
        ]
      }
    },
    mixins: [table, message, addModal, writeModal, page],
    components: {
      organizeUserEdit,
      btnWrapper
    },
    created () {
      this.getOrginizeUserList()
    },
    methods: {
      getOrginizeUserList () {
        organizeUser.getOrganizeUserList({
          pageNo: this.pageNo,
          pageSize: 10
        }).then(data => {
          if (data !== 'isError') {
            this.tableData = data.list
            this.total = data.total
          }
        })
      },
      btnClick (handleName) {
        switch (handleName) {
          case '新增机构用户':
            this.openAddModal()
        }
      },
      changePage (no) {
        this.pageNo = no
        this.getOrginizeUserList()
      },
      addConfirm () {
        let returnData = this.$refs.addUser.returnData()
        if (returnData) {
          this.openAddLoading()
          organizeUser.addOrganizeUser({
            ...returnData
          }).then(data => {
            this.closeAddLoading()
            if (data !== 'isError') {
              this.successInfo('添加成功')
              this.getOrginizeUserList()
              this.closeAddModal()
            }
          })
        }
      },
      writeConfirm () {
        let returnData = this.$refs.writeUser.returnData()
        if (returnData) {
          this.openWriteLoading()
          organizeUser.updateOrganizeUser({
            organizeId: this.currentId,
            ...returnData
        }).then(data => {
            this.closeWriteLoading()
          if (data !== 'isError') {
            this.successInfo('修改成功')
            this.getOrginizeUserList()
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
