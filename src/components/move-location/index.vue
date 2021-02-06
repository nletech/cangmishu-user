<template>
  <div>
    <!--移动货位-->
    <el-drawer title="移动货位" :visible.sync="moveForm.drawer" direction="rtl">
      <div style="padding:20px" v-if="moveForm">
        <el-form>
          <el-form-item label="请填要移动的库存">
            <el-table :data="moveForm.dataList" border style="width:100%">
              <el-table-column label="#" type="index" header-align="center" align="center">
              </el-table-column>
              <el-table-column
                :label="$t('Inboundbatchnumber')"
                prop="stock_sku"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column
                label="原货位"
                prop="location_code"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column
                :label="$t('Originalstock')"
                prop="shelf_num_orgin"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column label="移动至货位库存" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-input-number
                    size="mini"
                    :min="0"
                    :max="scope.row.shelf_num_orgin"
                    :step="1"
                    v-if="scope.row"
                    v-model="scope.row.num"
                  >
                  </el-input-number>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="统一移至新货位">
            <el-cascader
              placeholder="可以搜索货位代码"
              :options="locationAreaList"
              :props="{ checkStrictly: true }"
              v-model="moveForm.location_id"
              filterable
              clearable
              style="width:100%"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer" style="float:right">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" :loading="moveForm.loading" @click="sumbitMove">{{
            moveForm.loading ? '提交中 ...' : '确 定'
          }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';

export default {
  mixins: [mixin],
  props: {
    dataList: Array
  },
  data() {
    return {
      moveForm: {
        drawer: false,
        dataList: [],
        location_id: 0,
        loading: false
      },
      locationAreaList: []
    };
  },
  watch: {
    dataList(newVal) {
      if (newVal.length > 0) {
        this.moveForm.drawer = true;
        this.moveForm.dataList = newVal;
      }
    }
  },
  created() {
    this.loadLocationData();
  },
  methods: {
    loadLocationData() {
      $http.getAreaWithLocation().then(res => {
        if (res.status) return;
        this.locationAreaList = res.data;
      });
    },
    cancelForm() {
      this.moveForm.dataList = [];
      this.moveForm.drawer = false;
    }, // 取消
    sumbitMove() {
      let flag = false;
      for (let i = 0; i < this.moveForm.dataList.length; i += 1) {
        if (
          `${this.moveForm.dataList[i].num}` === 'undefined' ||
          `${this.moveForm.dataList[i].num}` == 0
        ) {
          flag = true;
          break;
        }
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: '移动数量必填'
        });
        return;
      }
      this.moveForm.loading = true;
      const stockArr = [];
      for (let i = 0; i < this.moveForm.dataList.length; i += 1) {
        const obj = Object.create(null);
        obj.id = this.moveForm.dataList[i].id;
        obj.num = this.moveForm.dataList[i].num;
        stockArr.push(obj);
      }
      const data = {
        items: stockArr,
        location_id: this.moveForm.location_id[this.moveForm.location_id.length - 1]
      };
      $http
        .moveLocation(data)
        .then(res => {
          if (res.status) return;
          this.moveForm.loading = false;
          this.moveForm.drawer = false;
          this.$emit('success');
        })
        .catch(() => {
          this.moveForm.loading = false;
        });
    }
  }
};
</script>
