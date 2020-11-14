
Vue.component('md-orders', {
    props: ['producto', 'usr', 'upd'],
    data: function () {
      return {
        orders: [],
      }
    },
    template: `
        <div class="row justify-content-center" :data-upd="upd">
            <div class="col-12">
                <p>The list of orders made to this product:</p>
            </div>
            <div class="col-12">
                <div class="row justify-content-center text-center">
                    <div class="col-12"><hr></div>
                    <div clasS="col-1"><strong>#</strong></div>
                    <div clasS="col-2"><strong>Date</strong></div>
                    <div clasS="col-2"><strong>Product</strong></div>
                    <div clasS="col-1"><strong>RQ</strong></div>
                    <div clasS="col-1"><strong>MQ</strong></div>
                    <div clasS="col-2"><strong>UP</strong></div>
                    <div clasS="col-2"><strong>TP</strong></div>
                    <div clasS="col-1"><strong></strong></div>
                    <div class="col-12"><hr></div>
                </div>
            </div>
            <div class="col-12">
                <div class="row justify-content-center text-center pt-4" v-for="(item,index) in ordersFiltered" >
                    <div clasS="col-1" v-text="index + 1"></div>
                    <div clasS="col-2" v-text="item[12]"></div>
                    <div clasS="col-2 text-left" >
                        <span v-text="item[5]"></span>

                        <span v-if="item[7] == 'PENDING'" class="badge badge-warning" v-text="item[6]"></span>
                        <span v-if="item[7] == 'REJECTED'" class="badge badge-danger" v-text="item[6]"></span>
                        <span v-if="item[7] == 'APPROVED'" class="badge badge-success" v-text="item[6]"></span>

                        <span v-if="item[7] == 'PENDING'" class="badge badge-warning" v-text="item[7]"></span>
                        <span v-if="item[7] == 'REJECTED'" class="badge badge-danger" v-text="item[7]"></span>
                        <span v-if="item[7] == 'APPROVED'" class="badge badge-success" v-text="item[7]"></span>
                    </div>
                    <div clasS="col-1" v-text="item[9]"></div>
                    <div clasS="col-1" v-text="item[10]"></div>
                    <div clasS="col-2" v-text="formatMoney(item[8])"></div>
                    <div clasS="col-2" v-text="formatMoney(item[11])"></div>
                    <div clasS="col-1">
                        <div class="dropdown">
                            <button type="button" class="btn btn-light dropdown-toggle" :id="'dropdownMenuButton' + index" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <div class="dropdown-menu" v-if="item[7] == 'PENDING'">
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
        Confirm(item){
            let url = 'http://ec2-3-137-137-50.us-east-2.compute.amazonaws.com/api/order/' + item[1] + '/accept-reject'

            let data = 
            {
              "status": "ACCEPTED"
            }
        
            axios
                .post(url, data)
                .then((response) => {
                    console.log("Response: ",response)
                    if (response.status == 200) {
                        if (response.data) {
                            this.updateOrder(item, response.data.status)
                            this.updateBranchProduct(item)
                        } else {
                            alert("algo salio mal");
                        }
                    }else {
                        alert("algo salio mal");
                    }
                })
                .catch((err) => {
                    this.msg = "Algo salio mal al generar el combo";
                });
        },
        Reject(item){
            let url = 'http://ec2-3-137-137-50.us-east-2.compute.amazonaws.com/api/order/' + item[1] + '/accept-reject'

            let data = 
            {
                "status": "REJECTED"
            }
        
            axios
                .post(url, data)
                .then((response) => {
                    console.log(response)
                    if (response.status == 200) {
                        if (response.data) {
                            this.updateOrder(item, response.data)
                            this.updateBranchProduct(item)
                        } else {
                            alert("algo salio mal");
                        }
                    }else {
                        alert("algo salio mal");
                    }
                })
                .catch((err) => {
                    this.updateOrder(item, "REJECTED")
                    this.updateBranchProduct(item)
                    this.msg = "Algo salio mal al generar el combo";
                });
        },
        updateOrder(item, status){
            let url = 'https://oinrxmol9f.execute-api.us-east-2.amazonaws.com/main/distributor-manufacturer-orders'
            
            let data = {
                "id": this.convertDecStr(item[0]),
                "order_id": this.convertDecStr(item[1]),
                "distributor_id": this.convertDecStr(item[2]),
                "distributor_branch_id": this.convertDecStr(item[3]),
                "distributor_manufacturer_id": this.convertDecStr(item[4]),
                "product_code": item[5],
                "status": item[6],
                "order_final_status": status,
                "unit_price": this.convertDecStr(item[8]),
                "required_quantity": this.convertDecStr(item[9]),
                "manufacturer_quantity":this.convertDecStr(item[10]),
                "total_price_quantity": this.convertDecStr(item[11]),
                "usr": this.usr,
                "o": "u"
            }
            
            axios
                .put(url, data)
                .then((response) => {
                    if (response.data) {
                        if(response.data.msg){
                            alert("Se ha actualizado la orden");
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
        updateBranchProduct(item){
            let url = 'https://oinrxmol9f.execute-api.us-east-2.amazonaws.com/main/distributor-branch-products'

            let data = {
                "id": this.convertDecStr(this.producto[0]),
                "distributor_id": this.convertDecStr(this.producto[1]),
                "distributor_branch_id": this.convertDecStr(this.producto[2]),
                "distributor_manufacturer_id": this.convertDecStr(this.producto[3]),
                "product_name": this.producto[4],
                "product_code": this.producto[5],
                "minimun_stock_quantity": this.convertDecStr(this.producto[6] + item[9]),
                "available_quantity": this.convertDecStr(this.producto[7] + item[9]),
                "unit_price": this.convertDecStr(item[8]),
                "wholesale_price": this.convertDecStr(item[8] + item[8]* 0.1),
                "wholesale_quantity_required": this.convertDecStr(this.producto[10]),
                "usr": this.usr,
                "o": "u"
            }

            axios
                .put(url, data)
                .then((response) => {
                    if (response.data) {
                        if(response.data.msg){
                            alert("Se ha actualizado la orden");
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
        },
        formatMoney(amount) {
            try {
              let decimalCount = 2
              let decimal = "."
              thousands = ","
          
              decimalCount = Math.abs(decimalCount);
              decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
          
              const negativeSign = amount < 0 ? "-" : "";
          
              let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
              let j = (i.length > 3) ? i.length % 3 : 0;
          
              return "Q. " + negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
            } catch (e) {
              console.log(e)
            }
        }
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
        upd: {
            handler: function() {
                this.obtenerBranchesProducts()
            },
            deep: true
        },
        usr: {
            handler: function() {
                this.obtenerBranchesProducts() 
            },
            deep: true
        }
      }
  })