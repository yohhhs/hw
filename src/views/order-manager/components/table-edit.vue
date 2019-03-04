<template>
    <div class="table-edit" @dblclick="editToggle">
      <div class="show-label" v-if="!isEditing">
        &nbsp;{{content}}
      </div>
      <div v-else>
        <Input style="width: 100%" v-model="inputContent"/>
        <div class="btn-wrapper">
          <Icon class="icon" type="md-checkmark" @click="changeConfirm"></Icon>
          <Icon class="icon" type="md-close" @click="closeEdit"></Icon>
        </div>
      </div>
    </div>
</template>

<script>
  import {tableEdit} from '@/api/request'
  import {message} from "@/common/js/mixins";

  export default {
    name: "table-edit",
    props: {
      content: [String, Number, null],
      tableKey: {
        type: String
      },
      orderInId: {
        type: String
      }
    },
    data () {
      return {
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
          trayCount: 'orderInUpdateTrayCount'
        },
        inputContent: '',
        isEditing: false
      }
    },
    mixins: [message],
    methods: {
      editToggle () {
        if (!this.isEditing) {
          this.isEditing = true
          this.inputContent = this.content
        }
      },
      closeEdit () {
        this.isEditing = false
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
</style>
