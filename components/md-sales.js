
Vue.component('md-sales', {
    props: ['producto', 'usr', 'upd'],
    data: function () {
      return {
        sales: [],
      }
    },
    template: `
        <div class="row justify-content-center" :data-upd="upd">
            <div class="col-12">
                <p>The list of sales made to this product in this branch:</p>
            </div>
            <div class="col-12">
                <div class="row justify-content-center text-center">
                    <div class="col-12"><hr></div>
                    <div clasS="col-1"><strong>#</strong></div>
                    <div clasS="col-2"><strong>Date</strong></div>
                    <div clasS="col-4"><strong>Product</strong></div>
                    <div clasS="col-1"><strong>Qty.</strong></div>
                    <div clasS="col-1"><strong>Total</strong></div>
                    <div class="col-12"><hr></div>
                </div>
            </div>
            <div class="col-12">
                <div class="row justify-content-center text-center pt-4" v-for="(item,index) in salesFiltered" >
                    <div clasS="col-1" v-text="index + 1"></div>
                    <div clasS="col-2" v-text="item[6]"></div>
                    <div clasS="col-4" v-text="item[3]"></div>
                    <div clasS="col-1" v-text="item[4]"></div>
                    <div clasS="col-1" v-text="item[5]"></div>
                </div>
            </div>
        </div>
    `,
    methods: {
        obtenerSales () {
            let url = 'https://oinrxmol9f.execute-api.us-east-2.amazonaws.com/main/distributor-branch-dally-sales'
            
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
                            this.sales = []
                            this.sales = response.data.msg
                        }
                    } else {
                        alert("An error occurred");
                    }
                })
                .catch((err) => {
                    this.msg = "Algo salio mal";
                });
        },

        convertDecStr(n){
            n = String(n)
            return n.length - n.indexOf('.') > 2 ? n.substring(0, n.indexOf('.') + 3) : n
        }
    },
    computed:{
        salesFiltered(){
            return this.sales.filter(row => {
            const branch = row[2].toString().toLowerCase();
            const product = row[3].toString().toLowerCase();
                
            return branch.includes(this.producto[2].toString().toLowerCase()) &&
                product.includes(this.producto[5].toString().toLowerCase());
            
            });
        }
    },
    mounted () {
        this.obtenerSales()
    },
    watch: {
        upd: {
            handler: function() {
                this.obtenerSales()
            },
            deep: true
        },
        usr: {
            handler: function() {
                this.obtenerSales() 
            },
            deep: true
        }
      }
  })