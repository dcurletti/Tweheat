Tweheat.Views.LayerCard = Backbone.View.extend({
	
	tagName: "li",

	template: JST['layer_card'],

	initialize: function  (options) {
		debugger;
		this.searchTerm = options.layer.search_term;
	}, 

	render: function(){
		var renContent = this.template({ searchTerm: this.searchTerm });
		this.$el.html(renContent);
		return this;
	}

})