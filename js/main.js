/*  MODEL
==============================*/

var model = {

	// refers to every number that is not the total
	displayNumber: "",

	// refers to the current sum or total
	displayTotal: 0,

	// refers to operators +-*/
	displayOperator: null

};



/*  CONTROLLER
==============================*/
var controller = {

	init: function(){
		view.init();

	},

	setDisplayNumber: function(num){
		if (model.displayNumber.length === 15){
			return;
		} else {
			model.displayNumber += num;
		}
	},

	getDisplayNumber: function(){
		return model.displayNumber;
	}


};




/*  VIEW
==============================*/

view = {

	numButtons: $(".num"),

	init: function(){
		for (var i = 0; i < this.numButtons.length; i++){
			var button = $(this.numButtons[i]);
			var num = Number(button.text());
			this.createNumHandler(button, num);
		}
	},

	renderDisplayNumber: function(num){
		$(".display").text(num);
	},

	createNumHandler: function(button, num){
		button.on("click", function(){
			controller.setDisplayNumber(num);
			var newNum = controller.getDisplayNumber();
			view.renderDisplayNumber(newNum);
		});
	}
	
};



// Initialize on start
controller.init();
