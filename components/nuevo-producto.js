        

Vue.component('nuevo-producto', {
    props: ['usr', 'branch'],
    data: function () {
        return {
            manufacturer_selected: '',
            available_products:[],
            exit: false,
            upd: false,
        }
    },
    template: `
        <div name="combo-tabla">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="row justify-content-center">
                        <div class="col-12">
                            <h3>New product</h3>
                        </div>
                        <div class="col-12">
                            <hr />
                        </div>
                        <div class="col-5">
                            <label class="field-Title">
                            <span>Distribuidor:</span>
                            </label>
                            <combo-tabla tabla="distributor_manufacturers" campo="3" valor="4" :usr="usr" local="1" @value="manufacturer_selected = $event[0]"></combo-tabla>
                        </div>
                        <div class="col-7">
                            <label class="field-Title">
                            <span>url:</span>
                            </label>
                            <input type="text" class="form-control" :value="manufacturer_selected" disabled>
                        </div>
                        <div class="col-5 text-center">
                            <button type="button" class="btn btn-success mt-3" v-if="manufacturer_selected" v-on:click="obtenerProductos()"><i class="fas fa-file-download"></i> Get products</button>
                            <button type="button" class="btn btn-danger mt-3" v-on:click="cancel()"><i class="fas fa-times"></i> Cancel</button>
                        </div>
                        <div class="col-12">
                            <hr />
                            <h5>List of products</h5>
                        </div>
                        <div class="col-12">
                            <div class="row justify-content-center text-center">
                            <div class="col-12"><hr></div>
                            <div clasS="col-1"><strong>#</strong></div>
                            <div clasS="col-4"><strong>Name</strong></div>
                            <div clasS="col-5"><strong>Description</strong></div>
                            <div clasS="col-1"><strong>add</strong></div>
                            <div class="col-12"><hr></div>
                            </div>
                            <div class="row justify-content-center pt-3" v-for="(item,index) in available_products" :data-upd="upd">
                                <div clasS="col-1 text-center" v-text="index + 1"></div>
                                <div clasS="col-4" v-text="item.name"></div>
                                <div clasS="col-4" v-text="item.description"></div>
                                <div clasS="col-2">
                                    
                                    <div class="input-group mb-3">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text" id="basic-addon1"><i :class="!available_products[index][\'icono\'] ? 'fas fa-box' : available_products[index][\'icono\']"></i></span>
                                        </div>
                                        <icon-combo @value="available_products[index][\'icono\'] = $event; upd = !upd"></icon-combo>
                                    </div>
                                </div>
                                <div clasS="col-1"><button class="btn btn-success" v-on:click="agregarProducto(index)"> <i class="fas fa-plus"></i> </button></div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        obtenerProductos () {
            let url = this.manufacturer_selected + 'products'
        
            axios
                .get(url)
                .then((response) => {
                    if (response.data) {
                        this.available_products = []
                        this.available_products = response.data

                        console.log(response.data)
                    }
                })
                .catch((err) => {
                    this.msg = "Algo salio mal al generar el combo";
                });
        },
        agregarProducto (i){
            let url = 'https://oinrxmol9f.execute-api.us-east-2.amazonaws.com/main/distributor-branch-products'
            const prdoucto = this.available_products[i]

            let data = { 
                "id": "",
                "distributor_id": String(1),
                "distributor_branch_id": String(this.branch),
                "product_name": prdoucto.name,
                "product_code": prdoucto.icono + '|' + prdoucto.sku,
                "minimun_stock_quantity": "0",
                "available_quantity": "0",
                "unit_price": "0",
                "wholesale_price": "0",
                "wholesale_quantity_required": "0",
                "usr": this.usr,
                "o": "c"
            }

            axios
                .put(url, data)
                .then((response) => {
                    if (response.data) {
                        if(response.data.msg){
                            if(response.data.msg == 1){
                                alert('The product have been added successfully.')
                            }else{
                                alert('An error occurred, make sure the product would not been added yet.')
                            }
                        }
                    } else {
                        alert("algo salio mal agregar producto");
                    }
                })
                .catch((err) => {
                    this.msg = "Algo salio mal al generar el combo";
                });
        },
        cancel (){
            console.log(this.available_products);
            this.manufacturer_selected = ''
            this.available_products = []
            this.exit = true
        },
    },
    computed:{

    },
    mounted () { },
    watch: {
        exit: {
            handler: function() {
                this.$emit('cancelar', 'cerrar');
            },
            deep: true
        }
      }
  })