/*  MODEL
==============================*/

var model = {

	// refers to every number that is not the total
	displayNumber: "0",

	// refers to a temporary stored number when an operator is clicked.
	storedNumber: "",

	// refers to the current sum or total
	total: null,

	// refers to operators +, -, *, and /
	operator: "",

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
		} else if(num === ""){
			model.displayNumber = "";
		} else if(model.displayNumber === "0" && num !== "clear"){
			model.displayNumber = num;

		} else {
			if(num === "clear"){
				model.displayNumber = "0";
			} else {
				model.displayNumber += num;
			}
		}
	},

	storeNumber: function(num){
		model.storedNumber = num;
	},

	checkCalculation: function(){
		if(model.displayNumber.length > 0 && model.operator.length > 0 && model.storedNumber.length > 0){
			var num1 = null;
			var num2 = Number(this.getDisplayNumber());
			if(model.total === null){
				num1 = Number(this.getStoredNumber());	
			} else {
				num1 = this.getTotal();
			}
			var operator = this.getOperator();
			switch(operator) {
			    case "+":
			    	this.setTotal(num1 + num2);
			        break;
			    case "-":
			    	this.setTotal(num1 - num2);
			        break;
			    case "*":
			    	this.setTotal(num1 * num2);
			        break;
			    case "/":
			    	this.setTotal(num1 / num2);
			        break;
			}
		}
	},

	setOperator: function(operator){
		if(operator === "clear"){
			model.operator = "";
			return;
		}
		this.checkCalculation();
		var number = this.getDisplayNumber();
		if(number.length > 0){
			this.storeNumber(number);
			this.setDisplayNumber("");
		}
		model.operator = operator;
	},

	setTotal: function(num){
		model.total = num;
	},

	getDisplayNumber: function(){
		return model.displayNumber;
	},

	getStoredNumber: function(){
		return model.storedNumber;
	},

	getOperator: function(){
		return model.operator;
	},

	getTotal: function(){
		return model.total;
	}




};



/*  VIEW
==============================*/

view = {

	numButtons: $(".num"),
	operatorButtons:  $(".operator"),

	init: function(){
		view.displayNumber(controller.getDisplayNumber());
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
		view.createEqualHandler();
		view.createCEHandler();
		view.createCHandler();
	},

	displayNumber: function(num){
		$(".display").text(num);
	},

	renderOperator: function(operator){
		$(".display").text(operator);
	},

	createNumHandler: function(button, num){
		button.on("click", function(){
			controller.setDisplayNumber(num);
			if(controller.getOperator() === "equals"){
				controller.setTotal(null);
			}
			var newNum = controller.getDisplayNumber();
			view.displayNumber(newNum);
		});
	},

	createOperHandler: function(button, operator){
		button.on("click", function(){
			controller.setOperator(operator);
			var total = controller.getTotal();
			if (total === null){
				view.displayNumber(controller.getStoredNumber());
			} else {
				view.displayNumber(controller.getTotal());
			}
		});
	},

	createEqualHandler: function(){
		$("#equals").on("click", function(){
			controller.setOperator("equals");
			view.displayNumber(controller.getTotal());
		});
	},

	createCEHandler: function(){
		$("#ce").on("click", function(){
			controller.setDisplayNumber("clear");
			view.displayNumber(controller.getDisplayNumber());
		});
	},

	createCHandler: function(){
		$("#c").on("click", function(){
			controller.setDisplayNumber("clear");
			controller.storeNumber("");
			controller.setTotal(null);
			controller.setOperator("clear");
			view.displayNumber(controller.getDisplayNumber());
		});
	}

};



// Initialize on start
controller.init();
