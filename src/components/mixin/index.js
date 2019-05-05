import goGroup from './util';

export default {
  props: {
    keyName: [String || Array],
  },
  inject: ['params'],
  data() {
    return {
      value: this.params[this.keyName],
    };
  },
  created() {
    this.group = goGroup(this.$parent);
    this.init();
  },
  methods: {
    init() {
      const query = this.$route.query[this.keyName];
      if (!query) return;
      // this.$nextTick(() => {
      this.value = this.params[this.keyName] || query;
      // });
      this.change(this.value);
    },
    submit() {
      this.group.$emit('pre-submit');
    },
    change(val) {
      this.group.$emit('change', this.keyName, val);
    },
    replaceRoute(key, value) {
      const { name, params, query } = this.$route;
      this.$router.replace({
        name,
        params,
        query: { ...query, [key]: value },
      });
    },
  },
  watch: {
    params: {
      handler(newVlaue) {
        this.$nextTick(() => {
          this.value = newVlaue[this.keyName];
        });
      },
      deep: true,
    },
  },
};
