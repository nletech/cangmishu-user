<template>
  <!--
  * 仓秘书免费开源WMS仓库管理系统+订货订单管理系统
  *
  * (c) Hunan NLE Network Technology Co., Ltd. <cangmishu.com>
  *
  * For the full copyright and license information, please view the LICENSE
  * file that was distributed with this source code.
  *
  -->
  <div class="addressManagement">
    <div class="clearfix">
      <div class="fr">
        <el-button size="small" type="primary" @click="onAdd">
          {{ $t('addsupplier') }}
        </el-button>
      </div>
    </div>
    <div style="margin-top:40px;">
      <el-row>
        <el-table
          element-loading-text="loading"
          v-loading="isButtonLoading"
          :data="dataList"
          border
        >
          <el-table-column
            label="#"
            header-align="center"
            align="center"
            type="index"
            width="60"
            fixed="left"
          >
          </el-table-column>
          <el-table-column
            :label="$t('supplierNameCN')"
            header-align="center"
            align="center"
            prop="name_cn"
            fixed="left"
          >
          </el-table-column>
          <el-table-column label="电话" header-align="center" align="center" prop="phone">
          </el-table-column>
          <el-table-column label="Email" header-align="center" align="center" prop="email">
          </el-table-column>
          <el-table-column label="城市" header-align="center" align="center" prop="city">
          </el-table-column>
          <el-table-column label="详细地址" header-align="center" align="center" prop="address">
          </el-table-column>
          <el-table-column label="创建时间" header-align="center" align="center" prop="created_at">
          </el-table-column>
          <el-table-column :label="$t('operation')" header-align="center" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" @click="onEdit(scope.row)">
                {{ $t('edit') }}
              </el-button>
              <el-button size="mini" type="danger" @click="onDelete(scope.row)">
                {{ $t('delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-show="+params.total"
          @current-change="handleCurrentChange"
          :current-page="params.currentPage"
          layout="total, prev, pager, next, jumper"
          :total="+params.total"
        >
        </el-pagination>
      </el-row>
    </div>
    <!-- 添加供应商 -->
    <el-drawer :title="title" :visible.sync="dialogVisible" direction="rtl">
      <div style="padding:0px 20px 0px 20px;">
        <el-form
          :rules="rules"
          ref="form"
          :model="form"
          label-position="left"
          label-width="240"
          style="margin:0px;"
        >
          <h3>基本信息</h3>
          <el-form-item :label="$t('supplierNameCN')">
            <el-input v-model="form.name_cn"></el-input>
          </el-form-item>
          <el-form-item label="电话:">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="Email:">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <h3>扩展信息</h3>
          <el-form-item prop="country" :label="$t('国家/地区')" size="middle">
            <el-select
              v-model="form.country"
              @change="onChangeCountry"
              placeholder="请选择国家"
              style="width: 100%"
            >
              <el-option
                v-for="item in countryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="!visibleOtherCountry"
            prop="form.country"
            :label="$t('SSQ')"
            size="middle"
          >
            <el-cascader
              style="width: 100%"
              :props="cascaderProps"
              :options="addressList"
              v-model="form.address_picker"
              placeholder="请选择地址"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item v-if="visibleOtherCountry" prop="city" :label="$t('城市')" size="middle">
            <el-input v-model="form.city" placeholder="请输入城市"> </el-input>
          </el-form-item>
          <el-form-item v-if="visibleOtherCountry" prop="street" :label="$t('街道')" size="middle">
            <el-input v-model="form.street" placeholder="请输入街道"></el-input>
          </el-form-item>
          <el-form-item
            v-if="visibleOtherCountry"
            prop="door_no"
            :label="$t('门牌号')"
            size="middle"
          >
            <el-input v-model="form.door_no" placeholder="请输入门牌号"></el-input>
          </el-form-item>
          <el-form-item prop="address" :label="$t('addressDetial')" size="middle">
            <el-input type="textarea" v-model="form.address" placeholder="请输入详细地址">
            </el-input>
          </el-form-item>
        </el-form>
        <div class="fr" style="padding-bottom:20px;">
          <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
          <el-button type="primary" @click="onSubmitForm">{{ $t('confirm') }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';
import Address from '@/assets/address.json';
import Country from '@/assets/country.json';

export default {
  name: 'supplierManagement',
  mixins: [mixin],
  data() {
    return {
      countryOptions: Country,
      addressList: Address, // 选择地址联动
      cascaderProps: {
        label: 'value', // json 数据的 value 属性对应联动组件的 label 属性
        value: 'value',
        children: 'children'
      },
      dialogVisible: false,
      visibleOtherCountry: false,
      dataList: [],
      form: {
        id: 0,
        name_cn: '',
        city: '',
        country: '中国',
        door_no: '',
        email: '',
        phone: '',
        postcode: '',
        street: '',
        address: '',
        province: '',
        district: '',
        address_picker: []
      },
      query: {
        id: 0
      },
      rules: {
        name_cn: [
          {
            required: true,
            message: this.$t('Pleaseentersuppliername'),
            trigger: 'blur'
          }
        ]
      },
      params: {
        total: '',
        currentPage: 1
      }
    };
  },
  created() {
    this.loadData();
  },
  watch: {
    dialogVisible() {
      if (!this.dialogVisible) {
        this.form.name_cn = '';
        this.form.id = 0;
        this.form.name_cn = '';
        this.form.city = '';
        this.form.country = '中国';
        this.form.door_no = '';
        this.form.email = '';
        this.form.phone = '';
        this.form.postcode = '';
        this.form.street = '';
        this.form.address = '';
        this.form.address_picker = [];
      }
    }
  },
  computed: {
    title() {
      const title = this.form.id ? this.$t('edit') : this.$t('add');
      return `${title} ${this.$t('supplier')}`;
    }
  },

  methods: {
    onChangeCountry(v) {
      console.log(v);
      if (v === '中国') {
        this.visibleOtherCountry = false;
      } else {
        this.visibleOtherCountry = true;
      }
    },
    loadData() {
      $http.getDistributor({ warehouse_id: this.warehouseId }).then(res => {
        if (res.status) return;
        this.dataList = res.data.data;
        this.params.total = res.data.total;
      });
    },
    onSubmitForm() {
      this.$refs.form.validate(validate => {
        if (validate) {
          if (this.form.country === '中国') {
            this.form.province = this.form.address_picker[0];
            this.form.city = this.form.address_picker[1];
            this.form.district = this.form.address_picker[2];
          }
          if (this.form.id > 0) {
            // 编辑信息
            $http.editDistributor(this.form.id, this.form).then(re => {
              if (re.status) return;
              this.form.id = 0;
              this.dialogVisible = false;
              this.successTips(true, false);
              this.handleCurrentChange(this.form.currentPage); // 更新数据
            });
          } else {
            // 添加信息
            $http.addDistributor(this.form).then(re => {
              if (re.status) return;
              this.dialogVisible = false;
              this.successTips(false, false);
              this.handleCurrentChange(this.form.currentPage); // 更新数据
            });
          }
        }
      });
    },
    onAdd() {
      this.dialogVisible = true;
    }, // 添加信息按钮
    handleCurrentChange(val) {
      // 缓存当前页
      this.current_page = val;
      $http
        .checkDistributor({
          page: val,
          warehouse_id: this.warehouseId
        })
        .then(res => {
          this.dataList = res.data.data;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current_page;
        });
    }, // 分页查询
    onEdit(info) {
      this.dialogVisible = true;
      this.form.name_cn = info.name_cn;
      this.form.id = info.id;
      this.form.city = info.city;
      this.form.country = info.country;
      this.form.door_no = info.door_no;
      this.form.email = info.email;
      this.form.phone = info.phone;
      this.form.postcode = info.postcode;
      this.form.street = info.street;
      this.form.address = info.address;
      this.form.province = info.province;
      this.form.district = info.district;
      this.form.address_picker = [this.form.province, this.form.city, this.form.district];
    },
    onDelete(info) {
      this.$confirm(this.$t('AcrionTips'), this.$t('tips'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        $http.deleteDistributor(info.id).then(() => {
          if (!status) {
            this.$message({
              type: 'success',
              message: this.$t('success')
            });
            this.handleCurrentChange(this.current_page); // 更新数据
          }
        });
      });
    }
  }
};
</script>
<style lang="less">
.addressManagement {
  .el-drawer {
    overflow: scroll;
  }
  .am_main {
    position: relative;
    background-color: #fff;
    .am_operation_btn {
      float: right;
      margin: 20px;
      z-index: 3;
      border: none;
      font-size: 1.2rem;
      color: @ThemeColor;
      cursor: pointer;
    }
  }
}
</style>
<style lang="less">
.addressManagement {
  .el-tabs__nav-scroll {
    .el-tabs__nav {
      display: flex;
      position: relative;
      justify-content: center;
      align-items: center;
      float: none;
      .el-tabs__item {
        width: 50%;
        text-align: center;
        font-size: 1.2rem;
      }
    }
  }
  .el-tabs {
    .el-tabs__content {
      margin: 80px 0 0 0;
    }
  }
}
.el-pagination {
  margin: 20px 0 0 0;
  float: right;
}
</style>
