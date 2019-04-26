<template>
  <el-table-column
  :width="width"
  :label="label">
    <template slot-scope="scope">
      <template v-if="scope.row.$_edit">
        <slot name="edit" :row="scope.row" :index="scope.$index">
          <el-button type="text" @click="saveEdit(scope.row)">{{$t('save')}}</el-button>
        </slot>
        <el-button
        v-if="scope.row.is_add"
        type="text"
        @click="cancelHandle(scope.row, scope.$index)">
        {{$t('cancel')}}
        </el-button>
      </template>
      <template v-else>
        <el-button size="mini" :disabled="disabled"
                   @click="edit(scope.row, scope.$index)">{{$t('edit')}}
        </el-button>
        <slot :row="scope.row" :index="scope.$index"></slot>
      </template>
    </template>
  </el-table-column>
</template>

<script>
import copy from '@/lib/copy';

export default {
  props: {
    disabled: [Boolean],
    label: [String],
    saveHandle: {
      type: Function,
      default: () => false,
    },
    saveEdit: {
      type: Function,
      default: () => 0,
    },
    width: [String],
  },
  data() {
    return {
      rowCopyData: [],
    };
  },
  methods: {
    edit(row, index) {
      this.$set(row, '$_edit', true);
      this.$set(row, 'is_add', true);
      this.rowCopyData[index] = copy.object(row);
      this.$emit('editChange', row);
    },
    cancelHandle(row, index) {
      for (const key in this.rowCopyData[index]) {
        // 恢复数据
        if (Object.prototype.hasOwnProperty.call(this.rowCopyData[index], key)) {
          row[key] = this.rowCopyData[index][key];
        }
      }
      this.$set(row, '$_edit', false);
      this.rowCopyData.splice(index, 1);
    },
  },
};
</script>
