<template>
    <div class="active-lsit">
      <query-wrapper @userQuery="queryList">
        <Input class="query-item" v-model="queryArgs.activityName" placeholder="活动名称" />
        <Select class="query-item" v-model="queryArgs.activityType" placeholder="请选择活动类型">
          <Option v-for="item in statusList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
        <DatePicker
          class="query-item"
          type="datetime" placeholder="活动开始时间"
          clearable @on-change="activeStartChange"></DatePicker>
        <DatePicker
          class="query-item"
          type="datetime" placeholder="活动结束时间"
          clearable @on-change="activeEndChange"></DatePicker>
      </query-wrapper>
      <btn-wrapper @btnClick="btnClick"></btn-wrapper>
      <Table :columns="tableColumns" :loading="tableLoading" :data="tableData" @on-selection-change="tableSelectChange"></Table>
      <Page style="margin-top: 20px;text-align: center;" :current="pageNo" :total="total" show-elevator @on-change='changePage'></Page>
      <Modal
        v-model="addModal.isShow"
        :mask-closable="false"
        title="添加活动">
        <active-edit v-if="addModal.isShow" ref="addEdit"></active-edit>
        <div slot="footer">
          <Button type="primary" size="large" long :loading="addModal.loading"  @click="addConfirm">确定</Button>
        </div>
      </Modal>
      <Modal
        v-model="writeModal.isShow"
        :mask-closable="false"
        title="修改活动">
        <active-edit v-if="writeModal.isShow" ref="writeEdit" :detail="currentActive" :isWrite="true"></active-edit>
        <div slot="footer">
          <Button type="primary" size="large" long :loading="writeModal.loading"  @click="writeConfirm">确定</Button>
        </div>
      </Modal>
    </div>
</template>
<script>
  import queryWrapper from '@/components/query-wrapper'
  import btnWrapper from '@/components/btn-wrapper'
  import activeEdit from './components/active-edit'
  import { message, table, page, writeModal, addModal } from '@/common/js/mixins'
  import { activeList } from '@/api/request'
  export default {
    data () {
      return {
        currentId: '',
        currentActive: null,
        selectIds: [],
        statusList: [
          {
            id: 1,
            name: 'H5活动'
          },
          {
            id: 2,
            name: '问卷'
          }
        ],
        queryArgs: {
          activityName: '',
          activityType: '',
          startTime: '',
          endTime: ''
        },
        tableColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '活动id',
            key: 'activityId'
          },
          {
            title: '活动名称',
            key: 'activityName'
          },
          {
            title: '活动类型',
            render: (h, params) => {
              return h('div', params.row.activityType == 1 ?'H5活动' : '问卷')
            }
          },
          {
            title: '活动开始时间',
            key: 'startTime'
          },
          {
            title: '活动截止时间',
            key: 'endTime'
          },
          {
            title: '活动状态',
            render: (h, params) => {
              return h('div', params.row.status == 0 ? '下架' : '上架')
            }
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
                      this.currentActive = params.row
                      this.currentId = params.row.activityId
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
    components: {
      btnWrapper,
      queryWrapper,
      activeEdit
    },
    mixins: [message, table, page, writeModal, addModal],
    created () {
      this.getActiveList()
    },
    methods: {
      getActiveList () {
        this.openTableLoading()
        activeList.getActiveList({
          pageNo: 1,
          pageSize: 10,
          ...this.queryArgs
        }).then(data => {
          this.closeTableLoading()
          if (data !== 'isError') {
            this.tableData = data.list
            this.total = data.total
          }
        })
      },
      tableSelectChange (selection) {
        let ids = []
        selection.forEach(item => {
          ids.push(item.activityId)
        })
        this.selectIds = ids
      },
      addConfirm () {
        let returnData = this.$refs.addEdit.returnData()
        if (returnData) {
          this.openAddLoading()
          activeList.addActive({
            ...returnData
          }).then(data => {
            this.closeAddLoading
            if (data !== 'isError') {
            this.successInfo('添加成功')
            this.getActiveList()
            this.closeAddModal()
          }
          })
        }
      },
      writeConfirm () {
        let returnData = this.$refs.writeEdit.returnData()
        if (returnData) {
          this.openWriteLoading()
          activeList.updateActive({
            activityId: this.currentId,
            ...returnData
        }).then(data => {
            this.closeWriteLoading
          if (data !== 'isError') {
            this.successInfo('添加成功')
            this.getActiveList()
            this.closeWriteModal()
          }
        })
        }
      },
      btnClick (handleName) {
        switch (handleName) {
          case '新增活动':
            this.openAddModal()
            break
          case '上架活动':
            this.changeActiveStatus(1)
            break
          case '下架活动':
            this.changeActiveStatus(0)
            break
        }
      },
      changeActiveStatus (status) {
        if (this.selectIds.length === 0) {
          return this.warningInfo('请选择操作对象')
        }
        activeList.updateActiveStatus({
          activityId: this.selectIds.toString(),
          status
        }).then(data => {
          if (data !== 'isError') {
            this.successInfo('更改状态成功')
            this.getActiveList()
          }
        })
      },
      activeStartChange (time) {
        this.queryArgs.startTime = time
      },
      activeEndChange (time) {
        this.queryArgs.endTime = time
      },
      queryList () {
        this.pageNo = 1
        this.getActiveList()
      },
      changePage (no) {
        this.pageNo = no
        this.getActiveList()
      }
    }
  }
</script>
<style lang="less">
</style>
