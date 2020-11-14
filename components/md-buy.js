Vue.component('md-buy', {
    props: ['producto', 'usr', 'option'],
    data: function () {
      return {
        dataset: [],
        selected: '',
        quantity: 0,
        updOrders: false,
        updSales: false,
      }
    },
    template: `
        <div name="md-buy">
            <div class="row justify-content-center" v-if="option == 'Buy'">
                <div class="col-12">
                    <h3 v-if="">Buy new product</h3>
                    <hr>
                    <div class="alert alert-secondary" role="alert">
                    <div class="row">
                        <div class="col-12">
                        <p>Make a new order for the next product:</p>
                        <hr>  
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                        <label>Branch</label>
                        <combo-tabla tabla="distributor_branches" campo="2" valor="0" :usr="usr" local="1" :initial="producto[2]" :dsbl="true"></combo-tabla>
                        </div>
                        <div class="col-6">
                        <label>Provider</label>
                        <input type="text" class="form-control" :value="producto[3]" disabled>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                        <label>Product</label>
                        <input type="text" class="form-control" :value="producto[4]" disabled>
                        </div>
                        <div class="col-6">
                        <label>Code</label>
                        <input type="text" class="form-control" :value="producto[5]" disabled>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-7">
                            <p class="mt-1">Chose the amaunt of product what you want to order: </p>
                        </div>
                        <div class="col-2">
                            <input type="number" class="form-control" maxlength="3" max="100" min="0" v-model="quantity">
                        </div>
                        <div class="col-3">
                            <button type="number" class="btn btn-success" v-on:click="generateOrder()"> <i class="fas fa-share-square"></i> Send order
                            </button> 
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <div class="row justify-content-center" v-else>
                <div class="col-12">
                    <h3 v-if="">Sell this product</h3>
                    <hr>
                    <div class="alert alert-secondary" role="alert">
                    <div class="row">
                        <div class="col-12">
                        <p>Make a new sale of this product:</p>
                        <hr>  
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                        <label>Branch</label>
                        <input type="text" class="form-control" :value="producto[2]" disabled>
                        </div>
                        <div class="col-6">
                        <label>Provider</label>
                        <input type="text" class="form-control" :value="producto[3]" disabled>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                        <label>Product</label>
                        <input type="text" class="form-control" :value="producto[4]" disabled>
                        </div>
                        <div class="col-6">
                        <label>Code</label>
                        <input type="text" class="form-control" :value="producto[5]" disabled>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-6">
                            <p class="mt-1">Chose the amaunt of product to sell: </p>
                        </div>
                        <div class="col-2">
                            <input type="number" class="form-control" maxlength="3" max="100" min="0" :value="producto[7]" disabled>
                        </div>
                        <div class="col-2">
                            <input type="number" class="form-control" maxlength="3" max="100" min="0" v-model="quantity">
                        </div>
                        <div class="col-2">
                            <button type="number" class="btn btn-success" v-on:click="generateSell()"> <i class="fas fa-share-square"></i> Sell
                            </button> 
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <hr />
            <md-orders :producto="producto" :usr="usr" :upd="updOrders" v-if="option == 'Buy'"></md-orders>
            <md-sales :producto="producto" :usr="usr" :upd="updSales" v-if="option != 'Buy'"></md-sales>
        </div>
    `,
    methods: {
        generateOrder: function () {
            let url = 'http://ec2-3-137-137-50.us-east-2.compute.amazonaws.com/api/order'
        
            let data = {
                "required_quantity": this.quantity,
                "product_code": this.producto[5],
                "client_type": "distributor",
                "client_slug": "distributor-ferrer"
            }
        
            axios
                .post(url, data)
                .then((response) => {
                    if (response.status == 201) {
                        if (response.data) {
                            this.saveOrder(response.data)
                        } else {
                        alert("algo salio mal");
                        }
                    }
                })
                .catch((err) => {
                    this.msg = "Algo salio mal al generar el combo";
                });

        },
        saveOrder(order){
            let url = 'https://oinrxmol9f.execute-api.us-east-2.amazonaws.com/main/distributor-manufacturer-orders'
        
            let data = {
                "id": "null",
                "distributor_branch_id": String(this.producto[2]),
                "distributor_id": "1",
                "distributor_manufacturer_id": String(this.producto[3]),
                "manufacturer_quantity": String(order.manufacturer_quantity),
                "order_final_status": String(order.status),
                "order_id": String(order.id),
                "product_code": String(order.product_code),
                "required_quantity": String(order.required_quantity),
                "status": String(order.status),
                "total_price_quantity": this.convertDecStr(order.total_price),
                "unit_price": this.convertDecStr(order.unit_price),
                "usr": this.usr,
                "o": "c"
            }

            axios
                .put(url, data)
                .then((response) => {
                    if (response.data) {
                        if(response.data.msg){
                            if(response.data.msg == 1){
                                alert('The order have been saved successfully.')
                                this.updOrders = !this.updOrders
                                this.$emit("updOrders", '')
                            }else{
                                alert('An error occurred, check your data, we could not save this order.')
                            }
                        }
                    } else {
                        alert("algo salio mal agregar producto");
                    }
                })
                .catch((err) => {
                    this.msg = "Algo salio mal";
                });

        },
        convertDecStr(n){
            n = String(n)
            return n.length - n.indexOf('.') > 2 ? n.substring(0, n.indexOf('.') + 3) : n
        },
        generateSell (){
            let url = 'https://oinrxmol9f.execute-api.us-east-2.amazonaws.com/main/distributor-branch-dally-sales'
            
            if(this.quantity > this.producto[7]){
                alert('There are not enough product available to execute this operation.')
                return 0
            }
            if(0 >this.quantity){
                alert('We cannot sell the amount you specified(' + this.quantity + '), please check it before continuing.')
                return 0
            }

            if(0 == this.quantity){
                alert('We cannot accomplish the sell by the amount specified(' + this.quantity + '), please check it before continuing.')
                return 0
            }


            let data = {
                id: "null",
                distributor_id: "1",
                distributor_branch_id: String(this.producto[2]),
                product_code: String(this.producto[5]),
                quantity_sale: String(this.quantity),
                total_sale: this.convertDecStr(this.quantity * this.producto[8]),
                usr: "JavierFerrer@galileo.edu",
                o: "c",
            }

            axios
                .put(url, data)
                .then((response) => {
                    if (response.data) {
                        if(response.data.msg){
                            if(response.data.msg == 1){
                                this.updateBranchProduct()
                            }else{
                                alert('An error occurred, check your data, we could not save this order.')
                            }
                        }
                    } else {
                        alert("algo salio mal agregar producto");
                    }
                })
                .catch((err) => {
                    this.msg = "Algo salio mal";
                });
        },
        updateBranchProduct(){
            let url = 'https://oinrxmol9f.execute-api.us-east-2.amazonaws.com/main/distributor-branch-products'

            let data = {
                "id": this.convertDecStr(this.producto[0]),
                "distributor_id": this.convertDecStr(this.producto[1]),
                "distributor_branch_id": this.convertDecStr(this.producto[2]),
                "distributor_manufacturer_id": this.convertDecStr(this.producto[3]),
                "product_name": this.producto[4],
                "product_code": this.producto[5],
                "minimun_stock_quantity": this.convertDecStr(Math.floor(Math.random() * 10) + 5),
                "available_quantity": this.convertDecStr(this.producto[7] - this.quantity),
                "unit_price": this.convertDecStr(this.producto[8]),
                "wholesale_price": this.convertDecStr(this.producto[9]),
                "wholesale_quantity_required": this.convertDecStr(this.producto[10]),
                "usr": this.usr,
                "o": "u"
            }

            axios
                .put(url, data)
                .then((response) => {
                    if (response.data) {
                        if(response.data.msg){
                            alert("The sale have been registered successfully");
                            this.updSales = !this.updSales
                            this.$emit("updSales", '')
                            this.obtenerBranchesProducts ()
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
    },
    mounted () {

    },
    watch: {
        selected: {
            handler: function() {
              this.$emit('value', true);
          },
            deep: true
        },
        usr: {
            handler: function() {
                this.updOrders = !this.updOrders
                this.updSales = !this.updSales 
            },
            deep: true
        }
      }
  })