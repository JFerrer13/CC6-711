        

Vue.component('inventario', {
    props: ['usr', 'search', 'branch'],
    data: function () {
        return {
            avaliable_branch_products: [],
            option: '',
            producto: null,
        }
    },
    template: `
        <div name="inventario">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <h3>Products availability</h3>
                            </div>
                            <div class="col-12">
                                <hr />
                            </div>
                            <div class="col-12">
                                <div role="alert" class="alert alert-secondary mb-1">
                                <p><strong>Leyenda: </strong> 
                                    <span class="text-info">MQ</span> - MINIMUN_STOCK_QUANTITY, 
                                    <span class="text-info">AQ</span> - AVAILABLE_QUANTITY, 
                                    <span class="text-info">UP</span> - UNIT_PRICE, 
                                    <span class="text-info">WP</span> - WHOLESALE_PRICE, 
                                    <span class="text-info">WQ</span> - WHOLESALE_QUANTITY_REQUIRED
                                </p>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="row justify-content-center text-center">
                                    <div class="col-12"><hr></div>
                                    <div clasS="col-1"><strong>#</strong></div>
                                    <div clasS="col-2"><strong>Branch</strong></div>
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
                                <div class="row justify-content-center text-center pt-4" v-for="(item,index) in productFiltered" >
                                    <div clasS="col-1" v-text="index + 1"></div>
                                    <div clasS="col-2" v-text="item[2]"></div>
                                    <div clasS="col-3 text-left" >
                                    <!-- <i class="avatar bkg-grad-naranja mr-2" style="padding: 10px 10px;"><i :class="item[4].split('|')[0]"></i></i> -->
                                    <span v-text="item[4]"></span></div>
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
                                                <a class="dropdown-item" v-on:click="sell(item)">Sell</a>
                                                <a class="dropdown-item" v-on:click="buy(item)">Buy</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="option">
                <div class="modal-backdrop fade show"></div>
                    <div tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" class="modal fade show" style="position:absolute; height:auto; padding-right: 17px; display: block;" aria-modal="true">
                        <div role="document" class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click="closeMd()">
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <md-buy :producto="producto" :usr="usr" :option="option" @updOrders="obtenerBranchesProducts()"></md-buy>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        obtenerBranches () {
            let url = 'https://oinrxmol9f.execute-api.us-east-2.amazonaws.com/main/distributor-branches'

            let data = { 
                "usr": this.usr,
                "o": "s"
            }
        
            axios
                .put(url, data)
                .then((response) => {
                    if (response.data) {
                        this.available_products = []
                        this.available_products = response.data
                    }
                })
                .catch((err) => {
                    this.msg = "Algo salio mal";
                });
        },
        obtenerBranchesProducts () {
            let url = 'https://oinrxmol9f.execute-api.us-east-2.amazonaws.com/main/distributor-branch-products'
            
            let data = { 
                "usr": this.usr,
                "o": "s"
            }

            axios
                .put(url, data)
                .then((response) => {
                    if (response.data) {
                        if(response.data.msg){
                            this.avaliable_branch_products = []
                            this.avaliable_branch_products = response.data.msg
                        }
                    } else {
                        alert("An error occurred");
                    }
                })
                .catch((err) => {
                    this.msg = "Algo salio mal";
                });
        },
        cancel (){
            this.exit = true
        },
        sell (product){
            this.option ='Sell'
            this.producto = product
        },
        buy (product){
            this.option ='Buy'
            this.producto = product
        },
        closeMd(){
            this.option = ''
        }
    },
    computed:{
        productFiltered(){
            return this.avaliable_branch_products.filter(row => {
            const branch = row[2].toString().toLowerCase();
            const product = row[3].toString().toLowerCase();
                
            if(this.branch){
                return branch.includes(this.branch) &&
                product.includes(this.search);
            }else{
                return product.includes(this.search)
            }
            
            });
        }
    },
    mounted () {
        this.obtenerBranchesProducts() 
    },
    watch: {
        exit: {
            handler: function() {
                this.$emit('cancelar', 'cerrar');
            },
            deep: true
        }
      }
  })