<template>
  <div class="area-edit">
    <div class="add-wrapper">
      <Button class="add-btn" type="primary" @click="addArea">添加</Button>
      <div style="margin-bottom: 10px">
        区域类型：
        <Select style="width: 180px;" v-model="areaType" placeholder="选择关联区域类型">
          <Option v-for="item in areaTypeList" :value="item.code" :key="item.code">{{ item.name }}</Option>
        </Select>
      </div>
      区域地址：
      <Select style="width: 180px;margin-right: 10px" v-model="cProvinceId" :label-in-value="true" placeholder="选择省份" clearable @on-change="provinceChange">
        <Option v-for="item in selectProvinceList" :value="item.code" :key="item.code">{{ item.name }}</Option>
      </Select>
      <Select v-if="areaType !== 1" style="width: 180px;margin-right: 10px" v-model="cCityId" :label-in-value="true" placeholder="选择城市" clearable @on-change="cityChange">
        <Option v-for="item in selectCityList" :value="item.code" :key="item.code">{{ item.name }}</Option>
      </Select>
      <Select v-if="areaType === 3" style="width: 180px" v-model="cAreaId" :label-in-value="true" placeholder="选择区县" clearable @on-change="areaChange">
        <Option v-for="item in selectDistrictList" :value="item.code" :key="item.code">{{ item.name }}</Option>
      </Select>
    </div>
    <Table style="margin-top: 20px;" :columns="tableColumns" :loading="tableLoading" :data="tableData"></Table>
  </div>
</template>

<script>
  import { cityDatas } from '@/assets/city'
  import { message, table } from '@/common/js/mixins'
  import { areaEdit } from '@/api/request'

  export default {
    name: "area-edit",
    props: {
      id: {
        type: String
      }
    },
    data () {
      return {
        areaType: 1,
        selectProvinceList: cityDatas,
        selectCityList: [],
        selectDistrictList: [],
        cProvinceId: '',
        cCityId: '',
        cAreaId: '',
        currentProvince: null,
        currentCity: null,
        currentArea: null,
        areaTypeList: [
          {
            code: 1,
            name: '省'
          },
          {
            code: 2,
            name: '市'
          },
          {
            code: 3,
            name: '区'
          }
        ],
        tableColumns: [
          {
            title: '关联区域类型',
            render: (h, params) => {
              let areaType = ['省', '市', '区']
              return h('div', areaType[params.row.addressType - 1] + '级区域')
            }
          },
          {
            title: '关联区域地址',
            key: 'addressName'
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      areaEdit.deleteManagerMemberArea({
                        managerMemberAreaId: params.row.managerMemberAreaId
                      }).then(data => {
                        if (data !== 'isError') {
                          this.successInfo('删除成功')
                          this.getList()
                        }
                      })
                    }
                  }
                }, '删除')
              ])
            }
          }
        ]
      }
    },
    mixins: [message, table],
    created () {
      this.getList()
    },
    methods: {
      getList () {
        this.openTableLoading()
        areaEdit.getManagerMemberAreaList({
          pageNo: 1,
          pageSize: 100,
          managerMemberId: this.id
        }).then(data => {
          this.closeTableLoading()
          if (data !== 'isError') {
            this.tableData = data.list
          }
        }).catch(err => {
          this.closeTableLoading()
        })
      },
      provinceChange (selection) {
        this.currentProvince = selection
        this.cCityId = ''
        this.cAreaId = ''
        this.currentArea = null
        this.currentCity = null
        this.selectDistrictList = []
        if (selection) {
          this.selectCityList = cityDatas.find(item => {
            return item.code === selection.value
          }).children
        } else {
          this.selectCityList = []
        }
      },
      cityChange (selection) {
        this.currentCity = selection
        this.cAreaId = ''
        this.currentArea = null
        if (selection) {
          this.selectDistrictList = this.selectCityList.find(item => {
            return item.code === selection.value
          }).children
        } else {
          this.selectDistrictList = []
        }
      },
      areaChange (selection) {
        this.currentArea = selection
      },
      addArea () {
        if (this.areaType === '') {
          return this.warningInfo('请选择关联区域类型')
        }
        if (this.areaType === 1 && !this.currentProvince) {
          return this.warningInfo('请选择关联区域地址')
        }
        if (this.areaType === 2 && !this.currentCity) {
          return this.warningInfo('请选择关联区域地址')
        }
        if (this.areaType === 3 && !this.currentArea) {
          return this.warningInfo('请选择关联区域地址')
        }
        let addressCode
        let addressName
        if (this.areaType === 1) {
          addressCode = this.currentProvince.value
          addressName = this.currentProvince.label
        } else if (this.areaType === 2) {
          addressCode = this.currentCity.value
          addressName = this.currentCity.label
        } else {
          addressCode = this.currentArea.value
          addressName = this.currentArea.label
        }
        areaEdit.addManagerMemberArea({
          managerMemberId: this.id,
          addressType: this.areaType,
          addressCode,
          addressName
        }).then(data => {
          if (data !== 'isError') {
            this.successInfo('添加成功')
            this.cCityId = ''
            this.cProvinceId = ''
            this.cAreaId = ''
            this.currentProvince = null
            this.currentArea = null
            this.currentCity = null
            this.selectDistrictList = []
            this.selectCityList = []
            this.getList()
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .add-wrapper {
    position: relative;
    .add-btn {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
