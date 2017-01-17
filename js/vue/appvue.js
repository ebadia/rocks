var vm = new Vue({
	el: '#smslist',
	data: {
		citas: []
	},
	created: {
		// this.getCitas(1,'2017-01-08');
	},
	methods: {
		getCitas: function(centro,fecha){
			this.$http.get("http://eneresi.local/bend/"+"citasSMS?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&fecha="+fecha)
				.then( function(res){
					this.citas = res.data;
				})
		}
	}
})