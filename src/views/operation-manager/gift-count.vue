<template>
  <div class="gift-count">
    <query-wrapper @userQuery="queryList">
      <Input class="query-item" v-model="keyword" placeholder="用户姓名/营业部名称"/>
    </query-wrapper>
    <Table :columns="tableColumns" :loading="tableLoading" :data="tableData"></Table>
    <Page style="margin-top: 20px;text-align: center;" :current="pageNo" :total="total" show-elevator
          @on-change='changePage'></Page>
    <Modal
      v-model="member.modal"
      width="800"
      :mask-closable="false"
      title="派送明细">
      <query-wrapper @userQuery="memberQueryList">
        <Input class="query-item" v-model="member.keyword" placeholder="收货人姓名/收货人电话"/>
      </query-wrapper>
      <Table :columns="member.tableColumns" :data="member.tableData" :loading="member.tableLoading"></Table>
      <div slot="footer">
        <Page style="margin-top: 20px;text-align: center;" :current="member.pageNo" :total="member.total" show-elevator
              @on-change='memberChangePage'></Page>
      </div>
    </Modal>
    <Modal
      v-model="transMember.modal"
      width="800"
      :mask-closable="false"
      title="转介绍人明细">
      <Table :columns="transMember.tableColumns" :data="transMember.tableData" :loading="transMember.tableLoading"></Table>
      <div slot="footer">
        <Page style="margin-top: 20px;text-align: center;" :current="transMember.pageNo" :total="transMember.total" show-elevator
              @on-change='transChangePage'></Page>
      </div>
    </Modal>
  </div>
</template>
<script>
  import queryWrapper from '@/components/query-wrapper'
  import {table, page} from '@/common/js/mixins'
  import {giftCount} from '@/api/request'

  export default {
    data() {
      return {
        keyword: '',
        member: {
          giftId: '',
          mdoal: false,
          keyword: '',
          tableData: [],
          tableColumns: [
            {
              title: '收货人',
              key: 'memberName'
            },
            {
              title: '收货人电话',
              key: 'mobile'
            },
            {
              title: '转介绍人数',
              key: 'transferCount'
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
                        this.transMember.memberId = params.row.memberId
                        this.getTransList(() => {
                          this.transMember.modal = true
                        })
                      }
                    }
                  }, '转介绍人明细')
                ])
              }
            }
          ],
          tableLoading: false,
          pageNo: 1,
          total: 0
        },
        transMember: {
          mdoal: false,
          memberId: '',
          tableData: [],
          tableColumns: [
            {
              title: '姓名',
              key: 'memberName'
            },
            {
              title: '手机号',
              key: 'mobile'
            },
            {
              title: '转介绍时间',
              key: 'createTimeStr'
            }
          ],
          tableLoading: false,
          pageNo: 1,
          total: 0
        },
        tableColumns: [
          {
            title: '经纪人姓名',
            key: 'agentMemberName'
          },
          {
            title: '所属营业部',
            key: 'saleDepartmentName'
          },
          {
            title: '礼品名称',
            key: 'goodsName'
          },
          {
            title: '已派送',
            key: 'sendGiftCount'
          },
          {
            title: '待派送',
            render: (h, params) => {
              return h('div', params.row.totalGiftCount)
            }
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
                      this.member.giftId = params.row.giftId
                      this.getMemberList(() => {
                        this.member.modal = true
                      })
                    }
                  }
                }, '查看派送明细')
              ])
            }
          }
        ]
      }
    },
    components: {
      queryWrapper
    },
    mixins: [table, page],
    created() {
      this.getGiftList()
    },
    methods: {
      getGiftList() {
        giftCount.getGiftRecordList({
          pageNo: this.pageNo,
          pageSize: 10,
          keyword: this.keyword
        }).then(data => {
          if (data !== 'isError') {
            this.tableData = data.list
            this.total = data.total
          }
        })
      },
      getMemberList(fn) {
        this.member.tableLoading = true
        giftCount.getMemberList({
          pageNo: this.member.pageNo,
          pageSize: 10,
          keyword: this.member.keyword,
          giftId: this.member.giftId
        }).then(data => {
          this.member.tableLoading = false
          if (data !== 'isError') {
            this.member.tableData = data.list
            this.member.total = data.total
            fn && fn()
          }
        }).catch(err => {
          this.member.tableLoading = false
        })
      },
      getTransList(fn) {
        this.transMember.tableLoading = true
        giftCount.getTransferMember({
          pageNo: this.transMember.pageNo,
          pageSize: 10,
          memberId: this.transMember.memberId
        }).then(data => {
          this.transMember.tableLoading = false
          if (data !== 'isError') {
            this.transMember.tableData = data.list
            this.transMember.total = data.total
            fn && fn()
          }
        }).catch(err => {
          this.transMember.tableLoading = false
        })
      },
      changePage(no) {
        this.pageNo = no
        this.getGiftList()
      },
      queryList() {
        this.pageNo = 1
        this.getGiftList()
      },
      memberQueryList() {
        this.member.pageNo = 1
        this.getMemberList()
      },
      memberChangePage(no) {
        this.member.pageNo = no
        this.getMemberList()
      },
      transChangePage (no) {
        this.transMember.pageNo = no
        this.getTransList()
      }
    }
  }
</script>
<style lang="less">
</style>
