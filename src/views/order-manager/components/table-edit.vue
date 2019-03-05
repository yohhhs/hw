<template>
    <div class="table-edit" @dblclick="editToggle">
      <div class="show-label" v-if="!isEditing">
        <template v-if="type === 1">
          &nbsp;{{content}}
        </template>
        <template v-if="type === 2">
          &nbsp;{{driverName}}
        </template>
        <template v-if="type === 3">
          &nbsp;<img class="show-img" v-if="content !== ''" :src="content">
        </template>
      </div>
      <div v-else>
        <Input v-if="type === 1" style="width: 100%" v-model="inputContent"/>
        <Select v-show="type === 2" v-model="inputContent" style="width:100%" transfer placeholder="请选择司机">
          <Option v-for="item in driverList" :value="item.id" :key="item.name">{{ item.name }}</Option>
        </Select>
        <Upload
          v-if="type === 3"
          withCredentials
          :show-upload-list="false"
          name="files"
          accept="image/*"
          :format="['jpg','jpeg','png']"
          :on-success="imgDetailSuccess"
          :action="action">
          <Button type="success">上传物流订单</Button>
        </Upload>
        <div class="btn-wrapper">
          <Icon class="icon" type="md-checkmark" @click="changeConfirm"></Icon>
          <Icon class="icon" type="md-close" @click="closeEdit"></Icon>
        </div>
      </div>
    </div>
</template>

<script>
  import {tableEdit} from '@/api/request'
  import {message} from "@/common/js/mixins"
  import {baseUrl} from '@/common/js/config'

  export default {
    name: "table-edit",
    props: {
      isOrderIn: {
        type: Boolean,
        default: true
      },
      type: {
        type: Number,
        default: 1
      },
      orderInAudit: {
        type: Number,
        default: 0
      },
      orderOutAudit: {
        type: Number,
        default: 0
      },
      content: [String, Number, null],
      tableKey: {
        type: String
      },
      orderInId: {
        type: String
      },
      driverList: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        action: baseUrl + '/file/uploadFile',
        api: {
          brand: 'orderInUpdateBrand',
          agency: 'orderInUpdateAgency',
          customer: 'orderInUpdateCustomer',
          doorCount: 'orderInUpdateDoorCount',
          logistics: 'orderInUpdateLogistics',
          logisticsPark: 'orderInUpdateLogisticsPark',
          planTime: 'orderInUpdatePlanTime',
          receivedMember: 'orderInUpdateReceivedMember',
          receivedPhone: 'orderInUpdateReceivedPhone',
          sendCity: 'orderInUpdateSendCity',
          sendProvince: 'orderInUpdateSendProvince',
          supplyCount: 'orderInUpdateSupplyCount',
          trackCount: 'orderInUpdateTrackCount',
          trayCount: 'orderInUpdateTrayCount',
          differenceDetail: 'orderOutUpdateDifferenceDetail',
          differenceGoodsCount: 'orderOutUpdateDifferenceGoodsCount',
          driverId: 'orderOutUpdateDriverId',
          freight: 'orderOutUpdateFreight',
          logisticsImage: 'orderOutUpdateLogisticsImage',
          outTime: 'orderOutUpdateOutTime',
          realLogistics: 'orderOutUpdateRealLogistics',
          woodMoney: 'orderOutUpdateWoodMoney',
        },
        inputContent: '',
        isEditing: false,
        driverName: '',
        alist: [{
          id: 1,
          name: 'dsfasdf'
        }]
      }
    },
    mixins: [message],
    created () {
      if (this.type === 2) {
        this.changeDriverName()
      }
    },
    methods: {
      imgDetailSuccess (data) {
        if (data.data) {
          this.inputContent = 'http://132.232.197.118/images/' + data.data
        }
      },
      editToggle () {
        if ((this.isOrderIn && this.orderInAudit === 1) || (!this.isOrderIn && this.orderOutAudit === 1)) {
          return this.warningInfo('当前记录已审核，无法修改')
        }
        if (!this.isEditing) {
          this.isEditing = true
          this.inputContent = this.content
        }
      },
      closeEdit () {
        this.isEditing = false
      },
      changeDriverName () {
        this.driverList.forEach(item => {
          if (item.id === this.content) {
            this.driverName = item.name
          }
        })
      },
      changeConfirm () {
        if (this.inputContent === '') {
          return this.warningInfo('请输入内容')
        }
        tableEdit[this.api[this.tableKey]]({
          orderInId: this.orderInId,
          [this.tableKey]: this.inputContent
        }).then(data => {
          if (data !== 'isError') {
            this.isEditing = false
            this.$emit('valueChange', this.inputContent)
            if (this.type === 2) {
              this.$nextTick(() => {
                this.changeDriverName()
              })
            }
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .show-label {
    /*min-height: 32px;*/
  }
  .table-edit {
    position: relative;
    padding-right: 50px;
    cursor: pointer;
  }
  .icon {
    font-size: 20px;
    &:hover {
      color: red;
    }
  }
  .btn-wrapper {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
  .show-img {
    max-width: 100%;
    max-height: 32px;
  }
</style>
