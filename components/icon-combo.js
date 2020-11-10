
Vue.component('icon-combo', {
    props: [],
    data: function () {
      return {
        icons: ['fas fa-box', 'fas fa-bacon', 'fas fa-egg', 'fas fa-drumstick-bite', 'fas fa-blender', 'fas fa-cookie-bite', 'fas fa-cheese', 'fas fa-pepper-hot', 'fas fa-hamburguer', 'fas fa-utensils','fas fa-fish', 'fas fa-ice-cream', 'fas fa-candy-cane', 'fas fa-carrot', 'fas fa-lemon', 'fas fa-apple-alt', 'fas fa-seeding', 'fas fa-hotdog', 'fas fa-bread-slice'],
        selected: 'fas fa-box',
      }
    },
    template: `
        <select class="custom-select" v-if="icons.length" v-model="selected" name="combo-tabla">
            <option selected value="">Select an icon</option>
            <option v-for="(item, index) in icons" :key="index" :value="item" v-text="item.substring(7, item.length)"></option>
        </select>
    `,
    methods: {
    },
    computed:{
    },
    mounted () {
    },
    watch: {
        selected: {
            handler: function() {
                this.$emit('value', this.selected)
          },
            deep: true
        }
      }
  })