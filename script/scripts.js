Date.prototype.customFormat = function (formatString) {
  var YYYY,
    YY,
    MMMM,
    MMM,
    MM,
    M,
    DDDD,
    DDD,
    DD,
    D,
    hhhh,
    hhh,
    hh,
    h,
    mm,
    m,
    ss,
    s,
    ampm,
    AMPM,
    dMod,
    th;
  YY = ((YYYY = this.getFullYear()) + "").slice(-2);
  MM = (M = this.getMonth() + 1) < 10 ? "0" + M : M;
  MMM = (MMMM = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ][M - 1]).substring(0, 3);
  DD = (D = this.getDate()) < 10 ? "0" + D : D;
  DDD = (DDDD = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ][this.getDay()]).substring(0, 3);
  th =
    D >= 10 && D <= 20
      ? "th"
      : (dMod = D % 10) == 1
      ? "st"
      : dMod == 2
      ? "nd"
      : dMod == 3
      ? "rd"
      : "th";
  formatString = formatString
    .replace("#YYYY#", YYYY)
    .replace("#YY#", YY)
    .replace("#MMMM#", MMMM)
    .replace("#MMM#", MMM)
    .replace("#MM#", MM)
    .replace("#M#", M)
    .replace("#DDDD#", DDDD)
    .replace("#DDD#", DDD)
    .replace("#DD#", DD)
    .replace("#D#", D)
    .replace("#th#", th);
  h = hhh = this.getHours();
  if (h == 0) h = 24;
  if (h > 12) h -= 12;
  hh = h < 10 ? "0" + h : h;
  hhhh = h < 10 ? "0" + hhh : hhh;
  AMPM = (ampm = hhh < 12 ? "am" : "pm").toUpperCase();
  mm = (m = this.getMinutes()) < 10 ? "0" + m : m;
  ss = (s = this.getSeconds()) < 10 ? "0" + s : s;
  return formatString
    .replace("#hhhh#", hhhh)
    .replace("#hhh#", hhh)
    .replace("#hh#", hh)
    .replace("#h#", h)
    .replace("#mm#", mm)
    .replace("#m#", m)
    .replace("#ss#", ss)
    .replace("#s#", s)
    .replace("#ampm#", ampm)
    .replace("#AMPM#", AMPM);
};

var app = new Vue({
  el: "#app",
  data: {
    opcionActual: "Search",

    aBuscar: "",
    Usuario: {
      Email: "JavierFerrer@galileo.edu",
      Nombre: "Javier Ferrer",
      Puesto: "DBA",
    },
    Usuarios: [],
    msgUsuario: null,
    nUsuario: {
      nombre: '',
      contraseña: '',
      confirmar_contraseña: '',
      email: '',
      tipo: -1,
    },
    Tablas: [],
    Tabla: -1,
    InfoTabla: null,
    objInsert: {},
    //superTabla
    dataset: [],
    keys: [],
    filters: {},
    updVal: false,
    //flags
    fCrear: 0,
    //extra
    Notificaciones: [],
    verNotificaciones: false,
    Clientes:[],
    camposR:"-CREATED_AT-CREATED_BY-UPDATE_AT-UPDATE_BY-",
    nuevoProducto: 0,
    branch_selected: '',
  },
  methods: {
    //Funciones Aleatorias, sin agrupación lógica
    cerrarSesion: function () {
      window.open("login.html", "self");
    },
    mostrarFormularioCear() {
      this.fCrear = "1";
      //this.getTableInfo();
    },
    cancelarCrear: function () {
      this.fCrear = 0;
      let auxKeys =  Object.keys(this.objInsert);

      for(let i = 0; i < auxKeys.length; i++){
        this.objInsert[auxKeys] = ""
      }
    },
    //
    getTableInfo: function () {
      this.InfoTabla = [];
      const url =
        "https://oinrxmol9f.execute-api.us-east-2.amazonaws.com/test/tablas/obtenerinfotabla";

      let data = {
        usuario: this.Usuario.Email,
        tabla: this.Tabla,
      };

      axios
        .put(url, data)
        .then((response) => {
          if (response.status == 200) {
            if (response.data) {
              let auxkeys = [];
              this.objInsert = {}

              for (let i = 0; i < response.data.msg.length; i++) {
                let arrTipo = response.data.msg[i][1].split("(");

                let aux = {
                  Name: response.data.msg[i][0],
                  Type: arrTipo[0],
                  key: response.data.msg[i][3],
                  default: response.data.msg[i][4],
                  value: null,
                };

                if (1 < arrTipo.length) {
                  aux.maxlength = response.data.msg[i][1]
                    .split("(")[1]
                    .split(")")[0];
                }

                if (response.data.msg[i][2]) {
                  aux.notnull = true;
                }

                this.InfoTabla.push(aux);
                this.objInsert[String(response.data.msg[i][0])] = null
                auxkeys.push(response.data.msg[i][0])
              }
              this.keys = auxkeys
              this.getGeneralS()
            } else {
              alert("No cerré sesión");
            }
          }
        })
        .catch((err) => {
          this.msg = "Algo salio mal al validar el usuario";
        });
    },
    getTables: function () {
      const url =
      "https://oinrxmol9f.execute-api.us-east-2.amazonaws.com/test/tablas/obtenertablas";
      
      let data = {
        usuario: this.Usuario.Email,
      };
      
      axios
        .put(url, data)
        .then((response) => {
          if (response.status == 200) {
            if (response.data) {
              this.Tablas = []
              for (let i = 0; i < response.data.msg.length; i++) {
                this.Tablas.push(response.data.msg[i][0]);
              }
            } else {
              alert("No cerré sesión");
            }
          }
        })
        .catch((err) => {
          this.msg = "Algo salio mal al validar el usuario";
        });
    },
    getGeneralS: function () {
      let url = 'https://oinrxmol9f.execute-api.us-east-2.amazonaws.com/main/' + this.TablaURL

      let data = { 
        "usr": "JavierFerrer@galileo.edu",
        "o": "s"
      }

      for(let i = 0; i < this.camposFiltrados.length; i++){
        data[this.InfoTabla[i].Name.toLowerCase()] = ""
      }

      axios
        .put(url, data)
        .then((response) => {
          if (response.status == 200) {
            if (response.data) {
              this.dataset = response.data.msg
            } else {
              alert("No cerré sesión");
            }
          }
        })
        .catch((err) => {
          this.msg = "Algo salio mal al validar el usuario";
        });
      console.log(data)
    },
    getGeneralI: function () {
      let url = 'https://oinrxmol9f.execute-api.us-east-2.amazonaws.com/main/' + this.TablaURL

      let data = { 
        "usr": "JavierFerrer@galileo.edu",
        "o": "c"
      }

      for(let i = 0; i < this.camposFiltrados.length; i++){
        data[this.InfoTabla[i].Name.toLowerCase()] = String(this.objInsert[this.InfoTabla[i].Name])
      }

      axios
        .put(url, data)
        .then((response) => {
          if (response.status == 200) {
            if (response.data) {
              this.cancelarCrear()
              this.getGeneralS()
            } else {
              alert("No cerré sesión");
            }
          }
        })
        .catch((err) => {
          this.msg = "Algo salio mal al validar el usuario";
        });
      console.log(data)
    },
    getGeneralD: function (id) {
      let url = 'https://oinrxmol9f.execute-api.us-east-2.amazonaws.com/main/' + this.TablaURL

      let data = { 
        "usr": "JavierFerrer@galileo.edu",
        "o": "d"
      }

      for(let i = 0; i < this.camposFiltrados.length; i++){
        data[this.InfoTabla[i].Name.toLowerCase()] = ""
      }

      data.id = String(id)

      axios
        .put(url, data)
        .then((response) => {
          if (response.status == 200) {
            if (response.data) {
              this.cancelarCrear()
              this.getGeneralS()
            } else {
              alert("No cerré sesión");
            }
          }
        })
        .catch((err) => {
          this.msg = "Algo salio mal al validar el usuario";
        });
      console.log(data)
    },
    //Funciones para abrir partes de la aplicacion
    nuevoUsuario: function () {
      this.opcionActual = "NuevoUsuario";
      this.obtenerUsuarios();
    },
    goToTables: function () {
      this.opcionActual = "Tables";
      this.getTables();
    },
    gotToSearch(){
      this.opcionActual = "Search";
      this.getTables();
    },
    //Usuarios
    obtenerUsuarios: function (){
      let url = 'https://oinrxmol9f.execute-api.us-east-2.amazonaws.com/main/usuarios'

      let data = { 
        "nombres": "",
        "contraseña": "",
        "email": "",
        "tipo": "",
        "usr": "JavierFerrer@galileo.edu",
        "o": "s"
      }

      axios
      .put(url, data)
      .then((response) => {
        console.log(response)
        this.Usuarios = []
        for(let i = 0; i < response.data.msg.length; i++){
          this.Usuarios.push({
            nombres: response.data.msg[i][0],
            email: response.data.msg[i][1],
            tipo: response.data.msg[i][2],
            sesion: response.data.msg[i][3],  
            keep: response.data.msg[i][4]
          })
        }
        console.log(this.Usuarios)
      })
      .catch((err) => {
        console.log(error);
      });
    },
    crearUsuario: function (){
      let url = 'https://oinrxmol9f.execute-api.us-east-2.amazonaws.com/main/usuarios'

      let data = { 
        "nombres": this.nUsuario.nombres,
        "contraseña": this.nUsuario.contraseña,
        "email": this.nUsuario.email,
        "tipo": this.nUsuario.tipo,
        "usr": this.Usuario.Email,
        "o": "c"
      }

      axios
      .put(url, data)
      .then((response) => {
        if(response.data.statusCode == "200" && response.data.msg == "1"){
          this.msgUsuario = "Usuario creado exitosamente"
          this.obtenerUsuarios()
          this.cancelarNuevoUsuario()
        }
      })
      .catch((error) => {
        console.log(error);
      });
    },
    eliminarUsuario: function (nUsuario){
      let url = 'https://oinrxmol9f.execute-api.us-east-2.amazonaws.com/main/usuarios'

      let data = { 
        "nombres": "",
        "contraseña": "",
        "email": nUsuario.email,
        "tipo": "",
        "usr": this.Usuario.Email,
        "o": "d"
      }

      axios
      .put(url, data)
      .then((response) => {
        if(response.data.statusCode == "200" && response.data.msg == "1"){
          this.msgUsuario = "Usuario eliminado exitosamente"
          this.obtenerUsuarios()
        }
      })
      .catch((error) => {
        console.log(error);
      });
    },
    cancelarNuevoUsuario(){
      this.nUsuario = {
        nombre: '',
        contraseña: '',
        confirmar_contraseña: '',
        email: '',
        tipo: -1,
      }
    },
  },
  computed: {
    datosFiltrados() {
      let aux = this.dataset
      let aux2 = this.updVal

      for (let i = 0; i < this.keys.length; i++) {
        aux = aux.filter((item) => {
          return item[i]
            .toLowerCase()
            .includes(this.filters[i].toLowerCase());
        });
        aux2 = !aux2;
      }

      return aux
    },
    camposFiltrados(){
      aux = []
      for(let i = 0; i < this.InfoTabla.length; i++){
        if(this.camposR.indexOf('-' + this.InfoTabla[i].Name + '-') == -1){
          aux.push(this.InfoTabla[i])
        }
      }
      return aux;
    },
    TablaURL (){
      let aux = this.Tabla.toLowerCase()

      while(aux.indexOf('_')!= -1){
        aux = aux.replace('_', '-')
      }
      
      return aux 
    },

  },
  mounted() {
    let aDataset = []

    if(aDataset.length){
      let keys = Object.keys(aDataset[0]);

      this.filters = {};

      for (let i = 0; i < keys.length; i++) {
        this.filters[keys[i]] = "";
      }

      this.keys = keys;

      this.dataset = aDataset;
    }
  },
  updated() { },
});