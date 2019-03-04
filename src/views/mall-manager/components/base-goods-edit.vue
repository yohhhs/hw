<template>
  <div class="base-goods-edit">
    <div v-if="isLook" class="modal-input-item">
      <p class="label">商品编号</p>
      <div style="width: 350px">
        {{detail.goodsId}}
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label"><span class="require-flag">*</span>商品名称</p>
      <div style="width: 350px">
        <Input type="text" long v-model.trim="goodsName" placeholder="请输入商品名称" :disabled="isLook"/>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">所属专区</p>
      <div style="width: 350px">
        <Select v-model="goodsSpecialId" placeholder="选择商品所属专区" :disabled="isLook" clearable>
          <Option v-for="item in supplierList" :value="item.goodsSpecialId" :key="item.goodsSpecialId">{{ item.goodsSpecialName }}</Option>
        </Select>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label"><span class="require-flag">*</span>商品规格</p>
      <div style="width: 350px">
        <Input type="text" long v-model.trim="standard" placeholder="请输入商品规格" :disabled="isLook"/>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label"><span class="require-flag">*</span>商品状态</p>
      <div style="width: 350px">
        <Select v-model="goodsStatus" placeholder="选择商品状态" :disabled="isLook">
          <Option v-for="item in goodsStatusList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label"><span class="require-flag">*</span>采购成本</p>
      <div style="width: 350px">
        <InputNumber style="width: 100%" :min="0" v-model="buyCost" :disabled="isLook"></InputNumber>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label"><span class="require-flag">*</span>商品原价</p>
      <div style="width: 350px">
        <InputNumber style="width: 100%" :min="0" v-model="realPrice" :disabled="isLook"></InputNumber>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label"><span class="require-flag">*</span>商品售价</p>
      <div style="width: 350px">
        <InputNumber style="width: 100%" :min="0" v-model="salePrice" :disabled="isLook"></InputNumber>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label"><span class="require-flag">*</span>起订量</p>
      <div style="width: 350px">
        <InputNumber style="width: 100%" :min="0" v-model="minQuantity" :disabled="isLook"></InputNumber>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label"><span class="require-flag">*</span>商品权重</p>
      <div style="width: 350px">
        <InputNumber style="width: 100%" :min="0" v-model="sort" :disabled="isLook"></InputNumber>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label"><span class="require-flag">*</span>销量偏移</p>
      <div style="width: 350px">
        <InputNumber style="width: 100%" :min="0" v-model="salesVolumeFloat" :disabled="isLook"></InputNumber>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label"><span class="require-flag">*</span>商品缩略图</p>
      <div style="width: 650px">
        <Table style="margin-bottom: 20px" :columns="tableColumns" :loading="tableLoading" :data="tableData"></Table>
        <Upload
          v-show="!isLook"
          ref="listUpload"
          withCredentials
          name="files"
          accept="image/*"
          :format="['jpg','jpeg','png']"
          :on-success="imgListSuccess"
          action="https://www.topasst.com/cms/file/uploadFile">
          <Button type="primary" ghost icon="ios-cloud-upload-outline">上传商品缩略图</Button>
        </Upload>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label"><span class="require-flag">*</span>商品详情</p>
      <div style="width: 670px">
        <div v-for="(item, index) in description" v-dragging="{ item: item, list: description, group: 'img'}" class="detal-item-img-wrapper">
          <div v-show="!isLook" class="del-img">
            <Icon color="#ed4014" size="30" type="md-close" @click="delImg(index)"/>
          </div>
          <img class="detal-item-img" :src="item">
        </div>
        <!--<img v-for="item in imgDetailList" width="375" :src="item">-->
        <Upload
          v-show="!isLook"
          ref="detailUpload"
          withCredentials
          name="files"
          accept="image/*"
          :format="['jpg','jpeg','png']"
          :on-success="imgDetailSuccess"
          action="https://www.topasst.com/cms/file/uploadFile">
          <Button type="primary" ghost icon="ios-cloud-upload-outline">上传商品详情图片</Button>
        </Upload>
        <!--<base-upload v-if="!isLook" :oldCoverUrl="oldCoverUrl" btnTip="上传详情图片" @uploadSuccess="detailSuccess"></base-upload>-->
      </div>
    </div>
    <!--<div v-if="isLook" class="modal-input-item">
      <p class="label">商品添加时间</p>
      <div style="width: 350px">
        <Input type="text" long v-model.trim="detail.createTimeStr" />
      </div>
    </div>-->
  </div>
</template>

<script>
  import baseUpload from '@/components/base-upload'
  import {message, table} from '@/common/js/mixins'
  import lrz from 'lrz'

  export default {
    name: "base-goods-edit",
    props: {
      isLook: {
        type: Boolean,
        default: false
      },
      isWrite: {
        type: Boolean,
        default: false
      },
      supplierList: {
        type: Array,
        default: () => []
      },
      detail: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        oldCoverUrl: '',
        tableColumns: [
          {
            title: '图片名称',
            key: 'imageName'
          },
          {
            title: '排序',
            render: (h, params) => {
              let vm = this
              return h('div', [
                h('Input', {
                  props: {
                    value:params.row.sort,
                    disabled: this.isLook
                  },
                  on:{
                    'on-change' (event) {
                      params.row.sort = event.target.value
                      vm.tableData[params.index] = params.row
                    }
                  }
                })
              ])
            }
          },
          {
            title: '首页展示',
            render: (h, params) => {
              return h('div', params.row.showIndex === 0 ? '否' : '是')
            }
          },
          {
            title: '操作',
            width: 200,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small',
                    disabled: this.isLook
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      if (params.row.showIndex === 1) {
                        return this.warningInfo('当前图片已展示')
                      }
                      this.tableData.forEach((item, index) => {
                        if (index === params.index) {
                          item.showIndex = 1
                        } else {
                          item.showIndex = 0
                        }
                      })
                    }
                  }
                }, '设为首页展示'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    disabled: this.isLook
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      this.tableData.splice(params.index, 1)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        goodsName: '',
        brandId: '',
        sort: 0,
        salePrice: 0,
        realPrice: 0,
        supplierId: '',
        buyCost: 0,
        goodsStatus: '',
        description: [],
        imageListStr: '',
        goodsSpecialId: '',
        minQuantity: 0,
        standard: '',
        salesVolumeFloat: 0,
        imgDetailList: [],
        goodsStatusList: [
          {
            id: 1,
            name: '上架'
          },
          {
            id: 0,
            name: '下架'
          }
        ]
      }
    },
    components: {
      baseUpload
    },
    mixins: [message, table],
    created () {
      if (this.isWrite) {
        this.goodsName = this.detail.goodsName
        this.buyCost = this.detail.buyCost
        this.standard = this.detail.standard
        this.realPrice = this.detail.realPrice
        this.salePrice = this.detail.salePrice
        this.minQuantity = this.detail.minQuantity
        this.sort = this.detail.sort
        this.salesVolumeFloat = this.detail.salesVolumeFloat
        this.goodsSpecialId = this.detail.goodsSpecialId
        this.goodsStatus = this.detail.goodsStatus
        this.tableData = this.detail.imageList
        this.description = this.detail.description.split(',')
        this.oldCoverUrl = this.detail.description
      }
    },
    methods: {
      listBefore (file) {
        lrz(file).then(res => {
          console.log(res)
          this.$refs.listUpload.post(res.file)
        })
        return false
      },
      imgListSuccess (data) {
        this.tableData.push({
          imageName: data.data,
          sort: 0,
          showIndex: 0
        })
      },
      detailBefore (file) {
        lrz(file).then(res => {
          console.log(res)
          console.log(this.$refs.detailUpload)
          this.$refs.detailUpload.post(res.file)
        })
        return false
      },
      imgDetailSuccess (data) {
        this.description.push('https://www.topasst.com/images/' + data.data)
      },
      delImg (index) {
        this.description.splice(index, 1)
      },
      returnData () {
        if (this.goodsName === '') {
          this.warningInfo('商品名称')
          return false
        }
        if (this.standard === '') {
          this.warningInfo('请输入商品规格')
          return false
        }
        if (this.goodsStatus === '') {
          this.warningInfo('请选择商品状态')
          return false
        }
        if (this.buyCost === '') {
          this.warningInfo('请输入采购成本')
          return false
        }
        if (this.realPrice === '') {
          this.warningInfo('请输入商品原价')
          return false
        }
        if (this.salePrice === '') {
          this.warningInfo('请输入商品售价')
          return false
        }
        if (this.minQuantity === '') {
          this.warningInfo('请输入起订量')
          return false
        }
        if (this.sort === '') {
          this.warningInfo('请输入商品权重')
          return false
        }
        if (this.salesVolumeFloat === '') {
          this.warningInfo('请输入销量偏移')
          return false
        }
        if (this.tableData.length === 0) {
          this.warningInfo('请上传缩略图')
          return false
        }
        if (this.description.toString() === '') {
          this.warningInfo('请上传详情图片')
          return false
        }
        let str = []
        this.tableData.forEach(item => {
          str.push(`${item.imageName},${item.sort},${item.showIndex}`)
        })
        return {
          goodsName: this.goodsName,
          buyCost: this.buyCost,
          goodsStatus: this.goodsStatus,
          description: this.description.toString(),
          standard: this.standard,
          realPrice: this.realPrice,
          salePrice: this.salePrice,
          minQuantity: this.minQuantity,
          sort: this.sort,
          goodsSpecialId: this.goodsSpecialId ? this.goodsSpecialId : '',
          salesVolumeFloat: this.salesVolumeFloat,
          imageListStr: str.join(';')
        }
      }
    }
  }
</script>

<style lang="less" scoped>
.detal-item-img-wrapper {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px 10px 0;
  width: 120px;
  height: 120px;
  background-color: #fff;
  border: 1px solid #ddd;
  &:hover {
    .del-img {
      display: flex;
    }
  }
  .del-img {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 0;
    right: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.35);
    cursor: pointer;
    display: none;
    z-index: 3;
  }
  .detal-item-img {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
    z-index: 1;
  }
}
</style>
