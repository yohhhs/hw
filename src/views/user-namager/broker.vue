<template>
  <div class="broker">
    <query-wrapper @userQuery="queryList">
      <Input class="query-item" v-model="queryArgs.agentMemberName" placeholder="用户姓名" />
      <DatePicker
        class="query-item"
        type="datetime" placeholder="注册开始时间"
        clearable @on-change="queryStartChange"></DatePicker>
      <DatePicker
        class="query-item"
        type="datetime" placeholder="注册结束时间"
        clearable @on-change="queryEndChange"></DatePicker>
      <Select class="query-item" v-model="queryArgs.memberType" placeholder="请选择用户类型" clearable>
        <Option v-for="item in memberType" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <Select class="query-item" v-model="queryArgs.status" placeholder="请选择账号状态" clearable>
        <Option v-for="item in statusList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
    </query-wrapper>
    <btn-wrapper @btnClick="btnClick"></btn-wrapper>
    <Table :columns="tableColumns" :loading="tableLoading" :data="tableData" @on-selection-change="tableSelectChange"></Table>
    <Page style="margin-top: 20px;text-align: center;" :current="pageNo" :total="total" show-elevator @on-change='changePage'></Page>
    <Modal
      v-model="uploadModal"
      :mask-closable="false"
      width="300"
      title="导入经纪人">
      <div style="text-align: center">
        <Upload :on-success="uploadSuccess" :format="['xls']" action="https://www.topasst.com/cms/agentMember/addAgentMember" :on-format-error="formatHandle">
          <Button style="width: 200px" type="ghost" icon="ios-cloud-upload-outline">导入经纪人</Button>
        </Upload>
      </div>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>
<script>
  import queryWrapper from '@/components/query-wrapper'
  import btnWrapper from '@/components/btn-wrapper'
  import { message, table, page, writeModal } from '@/common/js/mixins'
  import { broker } from '@/api/request'
  export default {
    data () {
      return {
        uploadModal: false,
        memberType: [
          {
            id: 1,
            name: '普通用户'
          },
          {
            id: 2,
            name: 'VIP用户'
          }
        ],
        statusList: [
          {
            id: 0,
            name: '锁定'
          },
          {
            id: 1,
            name: '激活'
          }
        ],
        queryArgs: {
          agentMemberName: '',
          registerStartTime: '',
          memberType: '',
          status: ''
        },
        memberIds: [],
        tableColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '用户ID',
            key: 'agentMemberId'
          },
          {
            title: '微信ID',
            key: 'openId'
          },
          {
            title: '手机号码',
            key: 'mobile'
          },
          {
            title: '姓名',
            key: 'agentMemberName'
          },
          {
            title: '注册时间',
            key: 'registerTime'
          },
          {
            title: '所属机构',
            key: 'organizeName'
          },
          {
            title: '所属营业部',
            key: 'saleDepartmentName'
          },
          {
            title: '上次登录时间',
            key: 'lastLoginTime'
          },
          {
            title: '账户状态',
            render: (h, params) => {
              return h('div', params.row.status === 0 ? '锁定' : '激活')
            }
          }
        ]
      }
    },
    components: {
      queryWrapper,
      btnWrapper
    },
    mixins: [message, table, page, writeModal],
    created () {
      this.getBrokerList()
    },
    methods: {
      getBrokerList () {
        this.openTableLoading()
        broker.getBrokerList({
          pageNo: this.pageNo,
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
      btnClick (handleName) {
        switch (handleName) {
          case '激活':
            this.updateStatus(1)
            break
          case '锁定':
            this.updateStatus(0)
            break
          case '导入经纪人':
            this.uploadModal = true
            break
        }
      },
      updateStatus (status) {
        if (this.memberIds.length === 0) {
          return this.warningInfo('请选择操作对象')
        }
        broker.updateBrokerStatus({
          agentMemberId: this.memberIds.toString(),
          status
        }).then(data => {
          if (data !== 'isError') {
            this.successInfo('更新成功')
            this.getBrokerList()
            this.memberIds = []
          }
        })
      },
      tableSelectChange (selection) {
        let ids = []
        selection.forEach(item => {
          ids.push(item.agentMemberId)
        })
        this.memberIds = ids
      },
      queryStartChange (time) {
        this.queryArgs.registerStartTime = time
      },
      queryEndChange (time) {
        this.queryArgs.registerEndTime = time
      },
      queryList () {
        this.pageNo = 1
        this.getBrokerList()
      },
      changePage (no) {
        this.pageNo = no
        this.getBrokerList()
      },
      uploadSuccess (res) {
        if (res.statusCode == 200) {
          this.successInfo('导入成功')
          this.getBrokerList()
        } else if (res.statusCode == 412) {
          window.location.href = res.data
        }
      },
      formatHandle () {
        this.warningInfo('文件格式不正确')
      }
    }
  }
</script>
<style lang="less">
</style>
