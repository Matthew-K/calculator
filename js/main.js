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

	// refers to max number that can be calculated to. Anything over this should display an error
	max: 999999999999999

};



/*  CONTROLLER
==============================*/

var controller = {

	init: function(){
		view.init();

	},

	setDisplayNumber: function(num){
		if ((num + model.displayNumber).length === 16){
			return;
		} else if(num === ""){
			model.displayNumber = "";
		} else if(model.displayNumber === "0" && num !== "clear"){
			if(num === "."){
				model.displayNumber = "0.";
			} else {
				model.displayNumber = num;
			}
		} else {
			if(num === "clear"){
				model.displayNumber = "0";
			} else {
				if(num === "."){
					if(model.displayNumber.indexOf(".") >= 0){
						return;
					} else if (model.displayNumber.length === 0){
						model.displayNumber = "0.";
						return;
					}
				}
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
			var total = this.calculateTotal(num1, num2, operator);
			// also accounts for division by zero since quotient "Infinity" is greater than the max
			if( total > model.max){
				return this.setTotal("E");
			} else{
				return this.setTotal(total);
			}
		}
	},

	calculateTotal: function(num1, num2, operator){
		var newTotal = null;
		switch(operator) {
		    case "+":
		    	return(num1 + num2);
		    case "-":
		    	return (num1 - num2);
		    case "*":
		    	return(num1 * num2);
		    case "/":
		    	var num = num1 / num2;
		    	return(controller.checkReallySmall(num));
		}
	},

	// check if the number contains a negative exponent. If so, just return 0.
	checkReallySmall: function(num){
		var numString = num.toString();
		if (numString.search("e-") !== -1){
			return 0;
		} else {
			return num;
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

	checkForError: function(){
		if(controller.getTotal() === "E"){
			return true;
		} else{
			return false;
		}
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
		view.createDecimalHandler();
	},

	displayNumber: function(num){
		$(".display").text(num);
	},

	// displayNumber: function(num){
	// 	if (num === undefined){
	// 		// console.log
	// 		$(".display").text(num);
	// 	}
	// 	// console.log("present")
	// 	var numString = num.toString();
	// 	// if (numString.length < 15 || num === undefined){
	// 	if (numString.length < 15 || num === undefined){
	// 		$(".display").text(num);
	// 	} else {
	// 		// console.log('here');
	// 		console.log("LENGTH");
	// 		console.log(numString.length);
	// 		console.log(numString);
	// 		// if(numString.search("e-") !== -1){
	// 		// 	var start = numString.indexOf("e-");
	// 		// 	console.log(start);
	// 		// 	var toSlice = numString.slice(start);
	// 		// 	console.log(toSlice);
	// 		// 	var toDisplay = numString.slice(0, 14 - toSlice.length) + toSlice;
	// 		// 	// $(".display").text(toDisplay);
	// 		// 	$(".display").text("~0");
	// 		// 	setTimeout(function(){ 
	// 		// 		$(".display").text(0); }, 1000);
	// 		}
	// 		// var displayThis = numString.slice(0, 14);
	// 		console.log("---------------------")
	// 		// console.log(displayThis);
	// 		// $(".display").text(Number(num));
	// 		// $(".display").text(displayThis);
	// 	// }
	// },


	renderOperator: function(operator){
		$(".display").text(operator);
	},

	createNumHandler: function(button, num){
		button.on("click", function(){
			// if there is an error, return
			if(controller.checkForError()){
				return;
			// else continue 
			} else {
				controller.setDisplayNumber(num);
				if(controller.getOperator() === "equals"){
					controller.setTotal(null);
				} else {
				var newNum = controller.getDisplayNumber();
				view.displayNumber(newNum);
				}
			}
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
			// if there is an error, return
			if(controller.checkForError()){
				return;
			// else continue
			} else {
				controller.setOperator("equals");
				var total = controller.getTotal();
				if (total === null){
					return;
				} else {
					view.displayNumber(total);
				}
			}
		});
	},

	createCEHandler: function(){
		$("#ce").on("click", function(){
			// if there is an error, function will return and button won't work
			if(controller.checkForError()){
				return;
			// else continue
			} else {
				controller.setDisplayNumber("clear");
				view.displayNumber(controller.getDisplayNumber());
			}
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
	},

	createDecimalHandler: function(){
		$("#decimal").on("click", function(){
			// if there is an error, function will return and button won't work
			if(controller.checkForError()){
				return;
			// else continue
			} else {
				controller.setDisplayNumber(".");
				var newNum = controller.getDisplayNumber();
				view.displayNumber(newNum);
			}
		});
	}
};



// Initialize on start
controller.init();
