Tweheat.Views.LayerCard = Backbone.View.extend({
	
	tagName: "li",

	template: JST['layer_card'],

	initialize: function  (options) {
		this.layer = options.layer;
	}, 

	render: function(){
		var renContent = this.template({ layer: this.layer });
		this.$el.html(renContent);
		return this;
	}

})