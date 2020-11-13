Vue.component('combo-tabla', {
    props: ['tabla', 'campo', 'usr', 'local', 'valor', 'au'],
    data: function () {
      return {
        dataset: [],
        selected: '',
      }
    },
    template: `
        <div name="combo-tabla">
            <select class="custom-select" v-if="dataset.length" v-model="selected">
                <option selected value="">Select...</option>
                <option v-for="(item, index) in dataset" :key="index" :value="index" v-text="item[0] + ' - ' + item[campo]"></option>
            </select>
        </div>
    `,
    methods: {
        getGeneralS: function () {
            let url = 'https://oinrxmol9f.execute-api.us-east-2.amazonaws.com/main/' + this.TablaURL
        
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
                            let aux = this.au == null ? 1 : this.au;
                            if(this.local == 0){
                                this.dataset = response.data.msg
                            }else{
                                for(let i = 0; i < response.data.msg.length; i++){
                                    if(response.data.msg[i][aux] == 1){
                                        this.dataset.push(response.data.msg[i])
                                    }
                                }
                            }
                            console.log(this.dataset)
                        }
                    } else {
                    alert("algo salio mal al generar el combo");
                    }
                }
                })
                .catch((err) => {
                this.msg = "Algo salio mal al generar el combo";
                });
            console.log(data)
        },
    },
    computed:{
        TablaURL (){
            let aux = this.tabla.toLowerCase()
      
            while(aux.indexOf('_')!= -1){
              aux = aux.replace('_', '-')
            }
            
            return aux 
        },
    },
    mounted () {
        this.getGeneralS()
    },
    watch: {
        selected: {
            handler: function() {
              this.$emit('value', [this.dataset[this.selected][this.valor], this.dataset[this.selected][0] + ' - ' + this.dataset[this.selected][this.campo]]);
          },
            deep: true
        },
        usr: {
            handler: function() {
                this.getGeneralS() 
            },
            deep: true
        }
      }
  })