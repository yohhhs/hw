<template>
  <div class="collect-edit">
    <div v-if="isLook" class="modal-input-item">
      <p class="label">集采商品id</p>
      <div>
        {{detail.purchaseOrderNumber}}
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">基础商品</p>
      <div style="width: 350px">
        <Select v-model="goodsId" placeholder="选择商品" :disabled="isLook">
          <Option v-for="item in goodsList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName }}</Option>
        </Select>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">市场价格（元）</p>
      <div style="width: 350px">
        <InputNumber style="width: 100%" v-model="marketPrice" :min="0" :disabled="isLook"></InputNumber>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">商品售价（元）</p>
      <div style="width: 350px">
        <InputNumber style="width: 100%" v-model="salePrice" :min="0" :disabled="isLook"></InputNumber>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">集采到期时间</p>
      <div style="width: 350px">
        <DatePicker
          :value="purchaseEndTime"
          style="width: 350px"
          type="datetime" placeholder="集采结到期时间" @on-change="endChange" :disabled="isLook" :readonly="isLook"></DatePicker>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">集采数量</p>
      <div style="width: 350px">
        <InputNumber style="width: 100%" :step="10" :precision="0" v-model="purchaseMinCount" :min="0" :disabled="isLook"></InputNumber>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">关联活动</p>
      <div style="width: 350px">
        <Select v-model="activityId" placeholder="选择关联活动" :disabled="isLook">
          <Option v-for="item in activeList" :value="item.activityId" :key="item.activityId">{{ item.activityName }}</Option>
        </Select>
      </div>
    </div>
    <div v-if="!isWrite" class="modal-input-item">
      <p class="label">关联营业部</p>
      <div>
        <Select style="width: 180px;margin: 0 15px 15px 0" v-model="currentOrganizeId" placeholder="请选择机构" @on-change="orgChange">
          <Option v-for="item in orgList" :value="item.organizeId" :key="item.organizeId">{{ item.organizeName }}</Option>
        </Select>
        <template v-for="(company, index) in companyLists">
          <Select style="width: 180px;margin: 0 15px 15px 0" v-model="company.companyId" placeholder="请选择公司" @on-change="companyChange(index)">
            <Option v-for="item in company.data" :value="item.companyId" :key="item.companyId">{{ item.companyName }}</Option>
          </Select>
        </template>
        <Table style="width: 620px" :columns="tableColumns" :loading="tableLoading" :data="tableData"></Table>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">已关联营业部</p>
      <div>
        <Table style="width: 620px" :columns="saleTableColumns" :loading="saleTableLoading" :data="saleTableData"></Table>
      </div>
    </div>
    <div v-if="isLook" class="modal-input-item">
      <p class="label">商品上架时间</p>
      <div>
        {{detail.createTimeStr}}
      </div>
    </div>
    <div v-if="isLook" class="modal-input-item">
      <p class="label">商品状态</p>
      <div>
        {{detail.state === 0 ? '下架' : '上架'}}
      </div>
    </div>
  </div>
</template>
<script>
  import {message, table} from '@/common/js/mixins'
  import { companyList, getSaleDepartmentList } from '@/api/request'

  export default {
    props: {
      isLook: {
        type: Boolean,
        default: false
      },
      orgList: {
        type: Array,
        default: () => []
      },
      activeList: {
        type: Array,
        default: () => []
      },
      goodsList: {
        type: Array,
        default: () => []
      },
      detail: {
        type: Object,
        default: () => {}
      },
      isWrite: {
        type: Boolean,
        default: false
      }
    },
    data () {
        return {
          saleTableColumns: [
            {
              title: '营业部名称',
              key: 'saleDepartmentName',
              width: 200
            },
            {
              title: '所属机构',
              key: 'organizeName'
            },
            {
              title: '所属分公司',
              key: 'companyName'
            },
            {
              title: '操作',
              width: 100,
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                      disabled: this.isWrite
                    },
                    on: {
                      click: () => {
                        this.saleTableData.splice(params.index, 1)
                      }
                    }
                  }, '删除')
                ])
              }
            }
          ],
          saleTableLoading: false,
          saleTableData: [],
          goodsId: '',
          marketPrice: 0,
          salePrice: 0,
          purchaseEndTime: '',
          purchaseMinCount: 0,
          activityId: '',
          currentOrganizeId: '',
          currentCompanyId: '',
          companyLists: [],
          selectSale: [],
          tableColumns: [
            {
              title: '营业部名称',
              key: 'saleDepartmentName',
              width: 200
            },
            {
              title: '所属机构',
              key: 'organizeName'
            },
            {
              title: '所属分公司',
              key: 'companyName'
            },
            {
              title: '操作',
              width: 100,
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                      disabled: this.isWrite
                    },
                    on: {
                      click: () => {
                        this.addSale(params.row)
                      }
                    }
                  }, '添加')
                ])
              }
            }
          ]
        }
    },
    components: {},
    mixins: [message, table],
    created () {
      if (this.isWrite) {
        console.log(this.detail)
        this.goodsId = this.detail.goodsId
        this.marketPrice = this.detail.marketPrice
        this.salePrice = this.detail.salePrice
        this.purchaseEndTime = this.detail.purchaseEndTime
        this.purchaseMinCount = this.detail.purchaseMinCount
        this.activityId = this.detail.activityId
        this.saleTableData = this.detail.dptList
      }
    },
    methods: {
      orgChange (id) {
        this.currentCompanyId = ''
        this.companyLists = []
        companyList({
          organizeId: this.currentOrganizeId,
          parentId: 0
        }).then(data => {
          if (data !== 'isError') {
            if (data.length === 0) {
              this.warningInfo('没有下级子公司')
            } else {
              this.companyLists.push({
                companyId: '',
                data: data
              })
            }
          }
        })
      },
      companyChange (index) {
        this.saleDepartmentIds = ''
        let maxLen = this.companyLists.length - 1
        let parentId = this.currentCompanyId = this.companyLists[index].companyId
        if (maxLen !== index) {
          this.companyLists.splice(index + 1, maxLen - index)
        }
        companyList({
          organizeId: this.currentOrganizeId,
          parentId: parentId
        }).then(data => {
          if (data !== 'isError') {
            if (data.length === 0) {
              this.warningInfo('没有下级子公司')
            } else {
              let companyData = {
                companyId: '',
                data: data
              }
              this.companyLists.push(companyData)
            }
          }
        })
        this.getSaleList(parentId)
      },
      getSaleList (id) {
        this.openTableLoading()
        getSaleDepartmentList({
          companyId: id
        }).then(data => {
          this.closeTableLoading()
          if (data !== 'isError') {
            if (this.isWrite) {
              data.forEach(item => {
                if (this.saleDepartmentIds.indexOf(item.saleDepartmentId) > -1) {
                  item._checked = true
                }
              })
            }
            this.tableData = data
          }
        })
      },
      endChange (time) {
        this.purchaseEndTime = time
      },
      addSale(sale) {
        if (JSON.stringify(this.saleTableData).indexOf(sale.saleDepartmentId) > -1) {
          return this.warningInfo('当前营业部已添加')
        }

        this.saleTableData.push(sale)
      },
      returnData () {
        if (this.goodsId === '') {
          this.warningInfo('请选择商品')
          return false
        }
        if (this.purchaseEndTime === '') {
          this.warningInfo('请选择集采结束时间')
          return false
        }
        if (this.activityId === '') {
          this.warningInfo('请选择活动')
          return false
        }
        if (this.saleTableData.length === 0) {
          this.warningInfo('请选择营业部')
          return false
        }
        let ids = []
        this.saleTableData.forEach(item => {
          ids.push(item.saleDepartmentId)
        })
        return {
          goodsId: this.goodsId,
          marketPrice: this.marketPrice,
          salePrice: this.salePrice,
          purchaseEndTime: this.purchaseEndTime,
          purchaseMinCount: this.purchaseMinCount,
          activityId: this.activityId,
          saleDptIds: ids.toString()
        }
      }
    }
  }
</script>
<style lang="less" scope>
  .collect-edit {
    height: 500px;
    overflow: auto;
  }
</style>
