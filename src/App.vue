<template>
  <div id="app">
    <h1>invi.sible.front</h1>
    <p>Consultando datos de <a href="http://localhost:7000/api/v1/mixed/gobwebsecpy">http://localhost:7000/api/v1/mixed/gobwebsecpy</a> </p>
    <p>Verificar datos en consola del navegador</p>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      countries: [{short:'py', name:'paraguay'},
      {short:'br', name:'brasil'},
      {short:'co', name:'colombia'},
      {short:'cl', name:'chile'}],
      serverData: []
    }
  }, 
  methods: {
    getData(){
      this.$http.get('http://localhost:7000/api/v1/mixed/gobwebsecpy')            

          .then(response=>{ return response.json()})
          .then(data => {
            console.log("Original data",data)
            console.log("Mostrando javascripts/cookies/companies por cada url/pais:",this.processData1(data))
            console.log("Mostrando inclusion/pais",this.processData2(data))
            
            //Se guarda en variable serverData para algún uso futuro
            this.serverData = this.processData1(data);


          } )
    },
    /**
     * Mostrar javascripts/cookies/companies por cada url/pais 
     */
    processData1(data){
      return _.chain(data[0]).map(x=>{return {href:x.href, cookies:x.cookies.length, javascripts:x.javascripts, companies:x.companies, country: this.getName(x.href)}}).value();
    },
    /**
     * Mostrar inclusion/pais 
    */
    processData2(data){
      return _.chain(data[1]).map(x=>{return {href:x.href, inclusion:x.inclusion, country: this.getName(x.href)}}).value();
    },
    /**
     * Método para obtener el nombre de un país a partir de la url
     */
    getName(href){
      let name = "";
      _.forEach(this.countries, d => {
        if(href.includes("."+d.short+"/") || href.endsWith("."+d.short)){
          name = d.name;
        }
      });
      return name;
    }
  },
  mounted:function(){
    this.getData();
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
