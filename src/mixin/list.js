export default {
  beforeMount() {
    this.extendParams();
    if (!this.$route.query.type) return;
    this.params.type = this.$route.query.type;
  },
  // beforeUpdate() {
  //   this.extendParams();
  // },
  mounted() {
    if (this.getList) this.getList();
  },
  data() {
    return {
      params: {
        page: 1,
        page_size: 10,
        // type: '1',
        // status: '0',
        keywords: '',
        data_count: 0,
        created_at_b: '',
        created_at_e: '',
        // handleCurrentChange: this.handleCurrentChange,
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
