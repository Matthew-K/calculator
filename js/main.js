/*  MODEL
==============================*/

var model = {

	// refers to every number that is not the total
	displayNumber: "",

	// refers to the current sum or total
	displayTotal: 0,

	// refers to operators +, -, *, and /
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

	setOperator: function(operator){
		model.displayOperator = operator;
	},

	getDisplayNumber: function(){
		return model.displayNumber;
	}

};



/*  VIEW
==============================*/

view = {

	numButtons: $(".num"),
	operatorButtons:  $(".operator"),

	init: function(){
		//loop through number buttons and create click handlers
		for (var n = 0; n < this.numButtons.length; n++){
			var numButton = $(this.numButtons[n]);
			var num = numButton.text();
			this.createNumHandler(numButton, num);
		}
		//loop through operator buttons and create click handlers
		for (var i = 0; i < this.operatorButtons.length; i++){
			var operatorButton = $(this.operatorButtons[i]);
			var operator = operatorButton.text();
			this.createOperHandler(operatorButton, operator);
		}
	},

	renderDisplayNumber: function(num){
		$(".display").text(num);
	},

	renderOperator: function(operator){
		$(".display").text(operator);
	},

	createNumHandler: function(button, num){
		button.on("click", function(){
			controller.setDisplayNumber(num);
			var newNum = controller.getDisplayNumber();
			view.renderDisplayNumber(newNum);
		});
	},

	createOperHandler: function(button, operator){
		button.on("click", function(){
			controller.setOperator(operator);
			view.renderOperator(operator);
		});
	}

};



// Initialize on start
controller.init();
