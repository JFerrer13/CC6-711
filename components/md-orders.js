
Vue.component('md-orders', {
    props: ['producto', 'usr'],
    data: function () {
      return {
        orders: [],
      }
    },
    template: `
        <div class="row justify-content-center">
            <div class="col-12">
                <p>The list of orders made to this product:</p>
            </div>
            <div class="col-12">
                <div class="row justify-content-center text-center">
                    <div class="col-12"><hr></div>
                    <div clasS="col-1"><strong>#</strong></div>
                    <div clasS="col-2"><strong>Date</strong></div>
                    <div clasS="col-3"><strong>Product</strong></div>
                    <div clasS="col-1"><strong>MQ</strong></div>
                    <div clasS="col-1"><strong>AQ</strong></div>
                    <div clasS="col-1"><strong>UP</strong></div>
                    <div clasS="col-1"><strong>WP</strong></div>
                    <div clasS="col-1"><strong>WQ</strong></div>
                    <div clasS="col-1"><strong></strong></div>
                    <div class="col-12"><hr></div>
                </div>
            </div>
            <div class="col-12">
                <div class="row justify-content-center text-center pt-4" v-for="(item,index) in ordersFiltered" >
                    <div clasS="col-1" v-text="index + 1"></div>
                    <div clasS="col-2" v-text="item[12]"></div>
                    <div clasS="col-3 text-left" >
                        <span v-if="item[6] == 'PENDING'" class="badge badge-warning" v-text="item[6]"></span>
                        <span v-if="item[6] == 'CONFIRMED'" class="badge badge-success" v-text="item[6]"></span>
                        <span v-text="item[5]"></span>
                    </div>
                    <div clasS="col-1" v-text="item[6]"></div>
                    <div clasS="col-1" v-text="item[7]"></div>
                    <div clasS="col-1" v-text="item[8]"></div>
                    <div clasS="col-1" v-text="item[9]"></div>
                    <div clasS="col-1" v-text="item[10]"></div>
                    <div clasS="col-1">
                        <div class="dropdown">
                            <button type="button" class="btn btn-light dropdown-toggle" :id="'dropdownMenuButton' + index" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" v-on:click="Confirm(item)">Confirm</a>
                                <a class="dropdown-item" v-on:click="Reject(item)">Reject</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        obtenerBranchesProducts () {
            let url = 'https://oinrxmol9f.execute-api.us-east-2.amazonaws.com/main/distributor-manufacturer-orders'
            
            let data = { 
                "usr": this.usr,
                "o": "s"
            }
            console.log(data)
            axios
                .put(url, data)
                .then((response) => {
                    if (response.data) {
                        if(response.data.msg){
                            this.orders = []
                            this.orders = response.data.msg
                        }
                    } else {
                        alert("An error occurred");
                    }
                })
                .catch((err) => {
                    this.msg = "Algo salio mal";
                });
        },
    },
    computed:{
        ordersFiltered(){
            return this.orders.filter(row => {
            const branch = row[3].toString().toLowerCase();
            const product = row[5].toString().toLowerCase();
                
            return branch.includes(this.producto[2].toString().toLowerCase()) &&
                product.includes(this.producto[5].toString().toLowerCase());
            
            });
        }
    },
    mounted () {
        this.obtenerBranchesProducts()
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