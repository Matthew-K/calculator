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

	// refers to max number that can be calculated. Anything over this should display an error
	max: 999999999999999,

	// refers to min number that can be calculated. Anything under this should display an error
	min: -999999999999999,

}; // end of model



/*  CONTROLLER
==============================*/

var controller = {

	init: function(){
		view.init();
	},

	setDisplayNumber: function(num){
		if(num[0] === "X"){
			if(num === "XO"){
				model.displayNumber = "0";
				return;
			} else {
				model.displayNumber = num.slice(1);
				return;
			}
		}
		// used when checking for negative numbers
		 else if((num.toString()).indexOf("-") != -1){
			if(num.toString().length === 16){
				model.displayNumber = num.toString();
				return;
			} else {
				model.displayNumber = "";
				model.displayNumber += num;
				return;
			}
		}else if(num === ""){
			model.displayNumber = "";
		}
		// else if the length of num plus the displayNumber is equal to 16, don't set a new displayNumber
		else if ((num + model.displayNumber).length === 16){
			return;
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
				num1 = Number(this.getTotal());
			}
			var operator = this.getOperator();
			var total = this.calculateTotal(num1, num2, operator);
			// if total > than the max, set the total as an error
			// also accounts for division by zero since quotient "Infinity" is greater than the max
			if( total > model.max){
				return this.setTotal("E");
			// else, if total is less than the min, set the total as an error
			} else if(total < model.min){
				return this.setTotal("E");
			// else, set the total to whatever was calculated
			} else {
				return this.setTotal(total);
			}
		} else {
			return;
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
		// return;
		var number = controller.getDisplayNumber();
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

}; // end of controller



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
		view.createPosNegHandler();
		view.createRemoveHandler();
	},

	displayNumber: function(num){
		var numString = num.toString();
		if(numString.indexOf("-") != -1){
			var locOfExp = numString.indexOf('e');
			// if exponent present
			if (locOfExp !== -1 && numString.length > 15){
				// make sure to have exponent shown
				return view.displayNumber(numString.slice(0,10) + numString.slice(locOfExp));		
			} else {
				$(".display").text(numString.slice(0,16));
			}
		} else {
			$(".display").text(numString.slice(0,15));
		}
	},

	renderOperator: function(operator){
		$(".display").text(operator);
	},

	createNumHandler: function(button, num){
		button.on("click", function(){
			// if there is an error, number buttons won't function
			if(controller.checkForError()){
				return;
			// else continue
			} else {
				if(controller.getOperator() === "equals"){
					return controller.setTotal(null); // also, number buttons won't function until another operator is clicked
				} else {
					controller.setDisplayNumber(num);
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
	},

	createPosNegHandler: function(){
		$("#posNeg").on("click", function(){
			// if there is an error, function will return and button won't work
			if(controller.checkForError()){
				return;
			// else continue
			} else if(controller.getOperator() === "equals"){
				var newTotal = controller.setTotal(controller.getTotal() * -1);
				view.displayNumber(controller.getTotal());
			} else{
				var num = controller.getDisplayNumber() * -1;
				controller.setDisplayNumber("");
				controller.setDisplayNumber(num);
				view.displayNumber(controller.getDisplayNumber());
			}
		});
	},

	createRemoveHandler: function(){
		$("#remove").on("click", function(){
			// if there is an error, function will return and button won't work
			if(controller.checkForError()){
				return;
			// else continue
			} else {
				var displayNumber = controller.getDisplayNumber();
				if (displayNumber.length >= 1 && displayNumber !== "0"){
					// check if only "." and "0"s remain in the displayNumber. If so, pass "X0" to controller.setDisplayNumber();
					var regex = /[1-9]/g;
					var check = displayNumber.match(regex);
					if(check.length === 1){
						controller.setDisplayNumber("X0");
					// else if the displayNumber has a "-" and only one number, pass "X0" to controller.setDisplayNumber(); 
					} else if(displayNumber.length === 2 && displayNumber[0] === '-'){
						controller.setDisplayNumber("X0");
					// else if the displayNumber is only one number, pass "X0" to controller.setDisplayNumber();
					} else if (displayNumber.length === 1){
						controller.setDisplayNumber("X0");
					// else if displayNumber has an exponent, pass "X0" to controller.setDisplayNumber();
					} else if(displayNumber.indexOf("e") !== -1){
						controller.setDisplayNumber("X0");
					// else pass in "X" + the displayNumber without it's last number to controller.setDisplayNumber(). ex: if display number is 1234 pass in "X123"
					}else {
						var newDisplay = displayNumber.slice(0, displayNumber.length -1);
						model.displayNumber = newDisplay;
						controller.setDisplayNumber("X" + newDisplay);
					}		
					// controller.setDisplayNumber() has now changed model.displayNumber depending on the input passed from above. Display it.
					return view.displayNumber(controller.getDisplayNumber());
				}
			}
		});
	}

}; // end of view



// Initialize on start
controller.init();
