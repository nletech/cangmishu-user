<template>
  <div>
    <!--盘点库存-->
    <el-drawer title="库存盘点" :visible.sync="recount.drawer" direction="rtl" size="50%">
      <div style="padding:20px" v-if="recount">
        <div class="demo-drawer__content">
          <el-form>
            <el-form-item>
              <el-table :data="recount.dataList" border style="width:100%">
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
                  :label="$t('Rack')"
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
                <el-table-column :label="$t('InventoryCount')" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-input-number
                      size="mini"
                      :min="0"
                      :max="10000000"
                      :step="1"
                      v-if="scope.row"
                      v-model="scope.row.num"
                    >
                    </el-input-number>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item :label="$t('remark')">
              <el-input type="textarea" v-model="recount.remark" maxlength="500" show-word-limit>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="demo-drawer__footer" style="float:right">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" :loading="recount.loading" @click="sumbitRecount">{{
            recount.loading ? '提交中 ...' : '确 定'
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
      recount: {
        drawer: false,
        dataList: [],
        loading: false,
        remark: ''
      }
    };
  },
  watch: {
    dataList(newVal) {
      if (newVal.length > 0) {
        this.recount.drawer = true;
        this.recount.dataList = newVal;
      }
    }
  },
  created() {},
  methods: {
    cancelForm() {
      this.recount.dataList = [];
      this.recount.drawer = false;
    }, // 取消盘点
    sumbitRecount() {
      this.recount.loading = true;
      let flag = false;
      for (let i = 0; i < this.recount.dataList.length; i += 1) {
        if (`${this.recount.dataList[i].num}` === 'undefined') {
          flag = true;
        }
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: '盘点数量必填'
        });
        return;
      }
      const stockArr = [];
      for (let i = 0; i < this.recount.dataList.length; i += 1) {
        const obj = Object.create(null);
        obj.id = this.recount.dataList[i].id;
        obj.num = this.recount.dataList[i].num;
        stockArr.push(obj);
      }
      const data = {
        remark: this.recount.remark,
        stock: stockArr
      };
      $http
        .addCheckStock(data)
        .then(res => {
          if (res.status) return;
          this.recount.loading = false;
          this.recount.drawer = false;
          this.$emit('success');
        })
        .catch(() => {
          this.recount.loading = false;
        });
    }
  }
};
</script>
