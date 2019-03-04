<template>
  <div class="organize-edit">
    <div class="modal-input-item">
      <p class="label">公司名称</p>
      <div style="width: 350px">
        <Input type="text" long v-model.trim="companyName" placeholder="请输入分公司名称" />
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">公司简介</p>
      <div style="width: 350px">
        <Input type="textarea" long :rows="2" v-model.trim="companyProfile" placeholder="请输入公司简介" />
      </div>
    </div>
   <!-- <div  v-if="this.editType === 1" class="modal-input-item">
      <p class="label">所属机构</p>
      <div style="width: 350px">
        <Select v-model="organizeId" placeholder="选择所属机构" clearable>
          <Option v-for="item in organizeList" :value="item.organizeId" :key="item.organizeId">{{ item.organizeName }}</Option>
        </Select>
      </div>
    </div>-->
    <div class="modal-input-item">
      <p class="label">所在地</p>
      <div>
        <div style="display: flex;">
          <Select style="width: 180px;margin-right: 10px" v-model="cProvinceId" :label-in-value="true" placeholder="选择省份" clearable @on-change="provinceChange">
            <Option v-for="item in selectProvinceList" :value="item.code" :key="item.code">{{ item.name }}</Option>
          </Select>
          <Select v-if="this.editType !== 1" style="width: 180px;margin-right: 10px" v-model="cCityId" :label-in-value="true" placeholder="选择城市" clearable @on-change="cityChange">
            <Option v-for="item in selectCityList" :value="item.code" :key="item.code">{{ item.name }}</Option>
          </Select>
        </div>
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
      editType: {
        type: Number,
        default: 1
      },
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
        selectProvinceList: cityDatas,
        selectCityList: [],
        selectDistrictList: [],
        currentProvince: '',
        currentCity: '',
        currentArea: '',
        cProvinceId: '',
        cCityId: '',
        cAreaId: '',
        companyName: '',
        companyProfile: '',
        organizeId: '',
        remark: ''
      }
    },
    components: {},
    mixins: [message],
    created () {
      if (this.isWrite) {
        this.currentProvince = {
          label: this.detail.provinceName,
          value: this.detail.provinceCode
        }
        this.cProvinceId = this.detail.provinceCode
        this.selectCityList = cityDatas.find(item => {
          return item.code === this.detail.provinceCode
        }).children
        if (this.detail.cityCode) {
          this.currentCity = {
            label: this.detail.cityName,
            value: this.detail.cityCode
          }
          this.cCityId = this.detail.cityCode
        }
        this.companyName = this.detail.companyName
        this.companyProfile = this.detail.companyProfile
        this.organizeId = this.detail.organizeId
        this.remark = this.detail.remark
      }
    },
    methods: {
      provinceChange (selection) {
        this.currentProvince = selection
        if (this.editType === 1) {
          return
        }
        if (selection) {
          this.selectCityList = cityDatas.find(item => {
            return item.code === selection.value
          }).children
        } else {
          this.currentArea = null
          this.currentCity = null
          this.selectDistrictList = []
          this.selectCityList = []
          this.cCityId = ''
          this.cAreaId = ''
        }
      },
      cityChange (selection) {
        this.currentCity = selection
      },
      returnData () {
        if (this.companyName === '') {
          this.warningInfo('请输入公司名称')
          return false
        }
        if (this.companyProfile === '') {
          this.warningInfo('请输入公司简介')
          return false
        }
        if (!this.currentProvince) {
          this.warningInfo('请选择城市')
          return false
        }
        return {
          companyName: this.companyName,
          companyProfile: this.companyProfile,
          provinceCode: this.currentProvince.value,
          provinceName: this.currentProvince.label,
          cityCode: this.currentCity.value || '',
          cityName: this.currentCity.label || '',
          remark: this.remark
        }
      }
    }
  }
</script>
<style lang="less" scope>
</style>
