Vue.component('md-buy', {
    props: ['producto', 'usr', 'option'],
    data: function () {
      return {
        dataset: [],
        selected: '',
        quantity: 0,
        updOrders: false,
      }
    },
    template: `
        <div name="combo-tabla">
            <div class="row justify-content-center">
                <div class="col-12">
                    <h3 v-if="">Buy new product</h3>
                    <hr>
                    <div class="alert alert-secondary" role="alert">
                    <div class="row">
                        <div class="col-12">
                        <p>Make a nwe order for the next product:</p>
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
            <hr />
            <md-orders :producto="producto" :usr="usr" :upd="updOrders"></md-orders>
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
        }
      }
  })