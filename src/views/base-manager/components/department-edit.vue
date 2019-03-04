<template>
  <div class="organize-edit">
    <div class="modal-input-item">
      <p class="label">营业部名称</p>
      <div style="width: 350px">
        <Input type="text" long v-model.trim="saleDepartmentName" placeholder="请输入营业部名称" />
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">地址</p>
      <div>
        <div style="display: flex;">
          <Select style="width: 180px;margin-right: 10px" v-model="cProvinceId" :label-in-value="true" placeholder="选择省份" clearable @on-change="provinceChange">
            <Option v-for="item in selectProvinceList" :value="item.code" :key="item.code">{{ item.name }}</Option>
          </Select>
          <Select style="width: 180px;margin-right: 10px" v-model="cCityId" :label-in-value="true" placeholder="选择城市" clearable @on-change="cityChange">
            <Option v-for="item in selectCityList" :value="item.code" :key="item.code">{{ item.name }}</Option>
          </Select>
          <Select style="width: 180px" v-model="cAreaId" :label-in-value="true" placeholder="选择区县" clearable @on-change="areaChange">
            <Option v-for="item in selectDistrictList" :value="item.code" :key="item.code">{{ item.name }}</Option>
          </Select>
        </div>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">详细地址</p>
      <div style="width: 560px">
        <Input type="text" long v-model.trim="addressDetail" placeholder="请输入详细地址" />
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">邮编</p>
      <div style="width: 560px">
        <Input type="text" long v-model.trim="postCode" placeholder="请输入邮编" />
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">备注</p>
      <div style="width: 560px">
        <Input type="textarea" long :rows="3" v-model.trim="remark" placeholder="请输入备注" />
      </div>
    </div>
  </div>
</template>
<script>
  import { cityDatas } from '@/assets/city'
  import { message } from '@/common/js/mixins'

  export default {
    props: {
      isWrite: {
        type: Boolean,
        default: false
      },
      detail: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        saleDepartmentName: '',
        postCode: '',
        addressDetail: '',
        selectProvinceList: cityDatas,
        selectCityList: [],
        selectDistrictList: [],
        currentProvince: '',
        currentCity: '',
        currentArea: '',
        cProvinceId: '',
        cCityId: '',
        cAreaId: '',
        remark: ''
      }
    },
    components: {},
    mixins: [message],
    mounted () {
      if (this.isWrite) {
        this.saleDepartmentName = this.detail.saleDepartmentName
        this.postCode = this.detail.postCode
        this.remark = this.detail.remark
        this.addressDetail = this.detail.addressDetail
        this.cAreaId = this.detail.districtCode
        this.cCityId = this.detail.cityCode
        this.cProvinceId = this.detail.provinceCode
        this.currentProvince = {
          label: this.detail.provinceName,
          value: this.detail.provinceCode
        }
        this.selectCityList = cityDatas.find(item => {
          return item.code === this.detail.provinceCode
        }).children
        if (this.detail.cityCode !== '') {
          this.currentCity = {
            label: this.detail.cityName,
            value: this.detail.cityCode
          }
          this.selectDistrictList = this.selectCityList.find(item => {
            return item.code === this.detail.cityCode
          }).children
        }
      }
    },
    methods: {
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
      returnData () {
        if (this.saleDepartmentName === '') {
          this.warningInfo('请输入营业部名称')
          return false
        }
        if (!this.currentProvince) {
          this.warningInfo('请选择城市')
          return false
        }
        if (this.addressDetail === '') {
          this.warningInfo('请输入详细地址')
          return false
        }
        if (this.postCode === '') {
          this.warningInfo('请输入邮编')
          return false
        }
        return {
          saleDepartmentName: this.saleDepartmentName,
          companyProfile: this.companyProfile,
          provinceCode: this.currentProvince.value,
          provinceName: this.currentProvince.label,
          cityCode: this.currentCity.value || '',
          cityName: this.currentCity.label || '',
          districtCode: this.currentArea.value || '',
          districtName: this.currentArea.label || '',
          postCode: this.postCode,
          addressDetail: this.addressDetail,
          remark: this.remark
        }
      }
    }
  }
</script>
<style lang="less" scope>
</style>
