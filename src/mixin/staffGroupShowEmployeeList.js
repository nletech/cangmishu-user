export default {
  beforeMount() {
    this.extendParams();
    if (!this.$route.query.type) return;
    this.params.type = this.$route.query.type;
  },
  mounted() {
    if (this.getList) this.getList();
  },
  data() {
    return {
      params: {
        group_id: this.$route.params.groupId,
        page_size: 10,
        page: 1,
        data_count: 0,
      },
    };
  },
  methods: {
    extendParams() {
      const self = this;
      const PageParams = class {
        constructor() {
          // eslint-disable-next-line
          for (const key in self.params) {
            this[key] = self.params[key];
          }
        }
        // eslint-disable-next-line
        handleCurrentChange(pageId) {
          self.handleCurrentChange(pageId);
        }
      };
      this.params = new PageParams();
    },
    // 搜索
    onSubmit() {
      this.params.page = 1;
      this.params.page_size = 10;
      this.getList();
    },
    // 分页
    handleCurrentChange(pageId) {
      this.params.page = pageId;
      this.getList();
    },
  },
};
