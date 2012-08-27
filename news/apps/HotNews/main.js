$require("/categories.js");
$require("/gallery.js");

/**
 * scene based application main controller
 */
$class('hotnews.MainController').extend(tau.ui.SequenceNavigator).define({
	MainController: function (opts){
		
	},

	init: function (){
		this.setRootController(new hotnews.Categories());
	},
	
	destroy: function (){
		
	}
});