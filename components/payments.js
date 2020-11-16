
Vue.component('payments', {
    props: ['usr'],
    data: function () {
      return {
        payments: [],
        dia: '',
        mes: '',
        año: '',
        hora: '',
        minuto:'',
        segundo: '',
        manufacturer: [],
        syncDone:0, 
      }
    },
    template: `
        <div class="row">
            <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <div class="row justify-content-center">
                        <div class="col-6">
                        <h2>Payment</h2>
                        <p class="text-muted">the distributed part of the database we implement.</p>
                        <hr style="display:none"/>
                        <p style="display:none">
                            <strong>Query for the date:</strong> 
                            <span v-text="this.obtenerfecha" v-if="this.obtenerfecha != '' "></span>
                            <span v-else> No date selected yet.</span>
                        </p>
                        <hr>
                        <div class="row">
                            <div class="col-4">
                                <p class="mt-1"><strong >Sync by distributor</strong></p>
                            </div>
                            <div class="col-8">
                                <div class="input-group">
                                    <combo-tabla tabla="distributors" campo="1" valor="2" :usr="usr" local="1" @value="manufacturer = $event" au="-1" initial="https://oinrxmol9f.execute-api.us-east-2.amazonaws.com/main/"></combo-tabla>
                                    <div class="input-group-prepend">
                                        <button
                                            class="btn btn-success"
                                            style="width: 100%"
                                            @click="syncOrderAll()"
                                        >
                                            <i class="fas fa-sync"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                        <div class="col-6">
                        <h6>You can choose what date you want to query from: </h6>
                            <div class="row justify-content-center"> 
                                <div class="col-3 mt-1"> 
                                    <select class="custom-select"  v-model="dia">
                                        <option selected value="">DD</option>
                                        <option v-for="index in 31" :key="index" :value="index" v-text="index" v-if="(',1,3,5,7,8,10,12,').indexOf(',' + mes + ',') != -1 "></option>
                                        <option v-for="index in 30" :key="index" :value="index" v-text="index" v-if="(',4,6,9,11,').indexOf(',' + mes + ',') != -1 "></option>
                                        <option v-for="index in 29" :key="index" :value="index" v-text="index" v-if="(',2,').indexOf(',' + mes + ',') != -1 "></option>
                                    </select>                           
                                </div>
                                <strong class="mt-2">/</strong>   
                                <div class="col-3 mt-1"> 
                                    <select class="custom-select"  v-model="mes">
                                        <option selected value="">MM</option>
                                        <option v-for="index in 12" :key="index" :value="index" v-text="index"></option>
                                    </select>                                
                                </div> 
                                <strong class="mt-2">/</strong>    
                                <div class="col-3 mt-1"> 
                                    <select class="custom-select"  v-model="año">
                                        <option selected value="">YYYY</option>
                                        <option selected value="2020">2020</option>
                                        <option selected value="2019">2019</option>
                                    </select>                             
                                </div>   
                                <div class="col-3 mt-1"> 
                                    <select class="custom-select"  v-model="hora">
                                        <option selected value="">HH</option>
                                        <option v-for="index in 24" :key="index" :value="index" v-text="index"></option>
                                    </select>                             
                                </div>   
                                <strong class="mt-2">:</strong>  
                                <div class="col-3 mt-1">  
                                    <select class="custom-select"  v-model="minuto">
                                        <option selected value="">MI</option>
                                        <option v-for="index in 60" :key="index" :value="index" v-text="index"></option>
                                    </select>                            
                                </div>   
                                <strong class="mt-2">:</strong>  
                                <div class="col-3 mt-1">
                                    <select class="custom-select"  v-model="segundo">
                                        <option selected value="">MI</option>
                                        <option v-for="index in 60" :key="index" :value="index" v-text="index"></option>
                                    </select>                            
                                </div> 
                                <div class="col-12"><hr class="my-2"></div>
                                <div class="col-3">
                                    <button type="button" class="btn btn-info" v-on:click="obtenerPayments()" style="width:100%;"><i class="fas fa-arrow-down"></i></button>                           
                                </div>
                                <div class="col-3">
                                    <button type="button" class="btn btn-outline-secondary" v-on:click="clearDate()" style="width:100%;"><i class="fas fa-trash-alt"></i></button>                           
                                </div> 
                                <div class="col-3">
                                    <button type="button" class="btn btn-outline-secondary" v-on:click="setToday()" style="width:100%;"><i class="fas fa-calendar-times"></i></button>                           
                                </div>                       
                            </div>
                        </div>
                        <div class="col-12">
                            <hr>
                            <div class="row text-center">
                                <div class="col-1"><strong>#</strong></div>
                                <div class="col-2"><strong>Debtor</strong></div>
                                <div class="col-2"><strong>Creditor</strong></div>
                                <div class="col-1"><strong>Status</strong></div>
                                <div class="col-2"><strong>Total</strong></div>
                                <div class="col-1"><strong>Accnt</strong></div>
                                <div class="col-2"><strong>Upd</strong></div>
                                <div class="col-1"><strong><i class="fas fa-clipboard-list"></i></strong></div>
                                <div class="col-12"><hr></div>
                            </div>
                            <div class="row text-center mt-2" v-for="(item,index) in payments">
                                <div class="col-1" v-text="index + 1"></div>
                                <div class="col-2" v-text="item.debtor_slug"></div>
                                <div class="col-2" v-text="item.creditor_slug"></div>
                                <div class="col-1">
                                    <span v-if="item.status == 'PENDING'" class="badge badge-warning" v-text="item.status"></span>
                                    <span v-else class="badge badge-success" v-text="item.status"></span>
                                </div>
                                <div class="col-2" v-text="formatMoney(item.total)"></div>
                                <div class="col-1" v-text="item.account_receivable_id"></div>
                                <div class="col-2" v-text="item.last_updated"></div>
                                <div class="col-1">
                                    <div class="dropdown">
                                        <button type="button" class="btn btn-light dropdown-toggle" :id="'dropdownMenuButton' + index" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i class="fas fa-level-down-alt"></i>
                                        </button>
                                        <div class="dropdown-menu">
                                            <a class="dropdown-item" v-for="order in item.orders" v-text="order"></a>
                                            <a class="dropdown-item" v-if="item.status == 'PENDING'"><hr class="m-0"></a>
                                            <a class="dropdown-item" v-if="item.status == 'PENDING'"  v-on:click="payOrder(item)">Pay</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    methods: {
        obtenerPayments(){
            let url = this.manufacturer[0] + 'debts-to-pay?date_from='
            let date = this.obtenerfecha
            
            if(date){
                url += date.replace(' ', '%20')
            }
            
            axios
              .get(url)
              .then((response) => {
                if (response.status == 200) {
                  if (response.data) {
                    this.payments  = []
                    this.payments = response.data
                  } else {
                    alert("Algo salio mal al traer los payments");
                  }
                }
              })
              .catch((err) => {
                this.msg = "Error payments";
              });
        },
        setToday(){
            let hoy = new Date()
            this.dia = hoy.getDate()
            this.mes = hoy.getMonth() + 1
            this.año = hoy.getFullYear()
            this.hora = hoy.getHours()
            this.minuto = hoy.getMinutes()
            this.segundo = hoy.getSeconds()
        },
        clearDate() {
            this.dia = ''
            this.mes = ''
            this.año = ''
            this.hora = ''
            this.minuto = ''
            this.segundo = ''
        },
        convertDecStr(amount){
            try {
                let decimalCount = 2
                let decimal = "."
                thousands = ""
            
                decimalCount = Math.abs(decimalCount);
                decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
            
                const negativeSign = amount < 0 ? "-" : "";
            
                let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
                let j = (i.length > 3) ? i.length % 3 : 0;
            
                return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
              } catch (e) {
                console.log(e)
              }
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
        },
        payOrder(obj){
            let man = ''
            console.log(obj)
            for(let i = 0; i < this.manufacturers.length; i++ ){
                if(obj.creditor_slug == this.manufacturers[i][5] ){
                    man = this.manufacturers[i][4]
                    break;
                }
            }

            let url = man + 'account-receivable/new-payment'
            //http://ec2-18-219-252-48.us-east-2.compute.amazonaws.com/account-receivable/new-payment
            //http://ec2-18-219-252-48.us-east-2.compute.amazonaws.com/account-receivable/new-payment
            let data = {
                "account_receivable_id": obj.account_receivable_id,
                "account_receivable_owner": obj.creditor_slug,
                "total": obj.total
            }

            axios
                .post(url, data)
                .then((response) => {
                if (response.status == 200) {
                    if (response.data) {
                        if(response.data.msg){

                            alert("The order has been payd successfully")
                        }
                    } else {
                    alert("algo salio mal al generar el combo");
                    }
                }
                })
                .catch((err) => {
                this.msg = "Algo salio mal al generar el combo";
                });
        },
        getManufacturers(){
            let url = 'https://oinrxmol9f.execute-api.us-east-2.amazonaws.com/main/distributor-manufacturers'
        
            let data = { 
                "usr": this.usr,
                "o": "s"
            }
        
            axios
                .put(url, data)
                .then((response) => {
                if (response.status == 200) {
                    if (response.data) {
                        if(response.data.msg){
                            this.dataset = []
                            this.manufacturers = response.data.msg
                        }
                    } else {
                    alert("algo salio mal al generar el combo");
                    }
                }
                })
                .catch((err) => {
                this.msg = "Algo salio mal al generar el combo";
                });
        },
        syncPayment(obj){
            let url ='https://oinrxmol9f.execute-api.us-east-2.amazonaws.com/main/debts-to-pay/sync-debt'

            let data = {
                "id": obj.id,
                "account_receivable_id": obj.account_receivable_id,
                "creditor_slug": obj.creditor_slug,
                "debtor_slug": obj.debtor_slug,
                "total": obj.total,
                "status": obj.status,
                "orders": obj.orders,
                "last_updated": obj.last_updated
              }

            axios
                .put(url, data)
                .then((response) => {
                if (response.status == 200) {
                    if (response.data) {
                        if(response.data.msg){
                            this.syncDone++
                        }
                    } else {
                        alert("An erro while trying to sync payment debts.");
                    }
                }
                })
                .catch((err) => {
                this.msg = "Algo salio mal al generar el combo";
                });
        },
        syncOrderAll(){
            this.syncDone = 0

            for(let i = 0; i < this.payments.length; i++){
                let obj = this.payments[i]
                this.syncPayment(obj)
            }
        },
        crearParametrosAxios(params){
            var data = new FormData();
            for(var key in params){
                data.append(key,(params[key] == null || params[key] == "null" ? "": params[key]));
            }
            return data;
        }
    },
    computed:{
        obtenerfecha(){
            let dia = this.dia <= 9 ? '0' + String(this.dia) : String(this.dia)
            let mes = this.mes <= 9 ? '0' + String(this.mes) : this.mes
            let hora = this.hora <= 9 ? '0' + String(this.hora) : this.hora
            let minuto = this.minuto <= 9 ? '0' + String(this.minuto) : this.minuto
            let segundo = this.segundo <= 9 ? '0' + String(this.segundo) : this.segundo
            let aux =  dia + '/' + mes + '/' + this.año + ' ' + hora + ':' + minuto + ':' + segundo
            
            if(this.dia&&this.mes&&this.año&&this.hora&&this.minuto&&this.segundo){
                return aux
            }else{
                return ''
            }
        }
    },
    mounted () {
        this.getManufacturers()
    },
    watch: {
        manufacturer: {
            handler: function() {
                this.obtenerPayments()
            },
            deep: true
        }
      }
  })