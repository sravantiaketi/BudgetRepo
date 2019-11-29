// BUDGET CONTROLLER
var budgetController = (function() {
   //function constuctores
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calculatePercentage = function(totalIncome) {
        if(totalIncome > 0) {
         this.percentage = Math.round((this.value/ totalIncome) * 100);
   
        } else {
          this.percentage = -1;  
        }
    };
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    }
 
    var data = {
        allItems : {
            exp:[],
            inc:[]
        },
        totals: {
            exp:0,
            inc:0
        },
        budget: 0,
        percentage: -1
    };
     
    return {
        addItem : function(type, des, val) {
            var newItem, ID;
            
            //create new ID
            if(data.allItems[type].length > 0) {
               ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
               ID = 0; 
            }
            
            //create new Item based on inc or exp type.
            if(type === 'exp'){
              newItem = new Expense(ID, des, val);
            } else if(type === 'inc') {
              newItem = new Income(ID, des, val);
            }
        
            //push it into our data structure
            data.allItems[type].push(newItem);
            
            //Return the new element
            return newItem;
        },
        
        deleteItem : function(type, id) {
            var ids, index;
            ids =  data.allItems[type].map(function(current) {
                return current.id;
            });
            
            index = ids.indexOf(id);
            
            if(index !== -1) {
                 data.allItems[type].splice(index, 1);
            }
        },
        
        calculateBudget: function() {
          calculateTotal('exp');
          calculateTotal('inc');
        
        
           data.budget = Math.round((data.totals.inc - data.totals.exp) * 100);
     
         if(data.totals.income > 0) {
          data.percentage = data.totals.exp / data.totals.inc;
         } else {
          data.percentage = -1;
         }
        },
        
        calculatePercentages : function() {
            data.allItems.exp.forEach(function(cur) {
                cur.calculatePercentage(data.totals.inc);
            });
        },
        
        getPercentages : function() {
          var allPerc = data.allItems.exp.map(function(cur) {
             return cur.getPercentage(); 
          }); 
            return allPerc;
        },
        getBudget : function() {
            return {
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            };
        },
        testing: function() {
            console.log(data);
        }
    }
    
})();


//UI CONTROLLER
var UIController = (function() {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn : '.add__btn',
        incomeContainer : '.income__list',
        expensesContainer : '.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel : '.budget__income--value',
        expensesLabel : '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage',
        container : '.container',
        dateLabel: '.budget__title--month',
        expensesPercLabel : '.item__percentage'
    };
    
    return {
        //returns user input
        getInput: function() {
            return {
             type: document.querySelector(DOMstrings.inputType).value,
             description: document.querySelector(DOMstrings.inputDescription).value,
             value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        
        addListItem : function(obj, type) {
            var html, newHtml,element;
            
          if(type === 'inc') {
              element = DOMstrings.incomeContainer;
              html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div> </div>';
            } else if(type === 'exp') {
                element = DOMstrings.expensesContainer;
             html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'; 
            }
          
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        
        deleteListItem : function(selectorID) {
            
         var el = document.getElementById(selectorID);
         el.parentNode.removeChild(el);
            
        },
        
        clearFields: function() {
         var fields, fieldsArray;
        
         fields = document.querySelectorAll(DOMstrings.inputDescription + ', '+
                                   DOMstrings.inputValue);
         fieldsArray = Array.prototype.slice.call(fields);
            
         fieldsArray.forEach(function(current, index, array) {
             current.value = "";
         });
            
         fieldsArray[0].focus();
        },
        
        displayBudget : function(obj) {
         document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
         document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
         document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp; 
         if(obj.percentage > 0) {
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';  
         } else {
             document.querySelector(DOMstrings.percentageLabel).textContent = '---';  
         }
        },
        
        displayMonth : function() {
           var now, year, months;    
           now = new Date();
           months = ['January','February','March','April','May','June','July',
                     'September','October','November','December'];
           month = now.getMonth();
           year = now.getFullYear();
           document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        
        displayPercentages : function(percentages) {
           var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            
            var nodeListForEach = function(list, callback) {
                for( var i=0; i< list.length ; i++) {
                    callback(list[i], i);
                }
            };
           
            nodeListForEach(fields, function(current, index) {
                if(percentages[index] > 0 ) {
                   current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
            
        },
        getDOMStrings : function() {
            return DOMstrings;
        }
    };
})();


//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
   
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress',function(event) {
        if(event.keyCode === 13 || event.which === 13) {
          ctrlAddItem();
        }
    }); 
        
        //set up event listener at top level.
     document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
    };
    
    var updateBudget = function(){
        budgetCtrl.calculateBudget();
        
        var budget = budgetCtrl.getBudget();
        
        UICtrl.displayBudget(budget);        
    };
    
    var updatePercentages =  function() {
        budgetCtrl.calculatePercentages();
        var percentages = budgetCtrl.getPercentages();
        UICtrl.displayPercentages(percentages);
     };
    
    var ctrlAddItem = function() {
        var input, newItem;
        
        input = UICtrl.getInput();
        
        if(input.description !== "" && !isNaN(input.value) &&
          input.value > 0) {
            newItem = budgetCtrl.addItem(input.type, input.description,input.value);
            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFields();
            updateBudget();
            updatePercentages();
        } 
      
    };
    
    var ctrlDeleteItem = function(event) {
       var itemID, splitID , type, ID;
        
       itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID) {
           splitID = itemID.split('-');
           type = splitID[0];
           ID = parseInt(splitID[1]);
            
           budgetCtrl.deleteItem(type, ID);
           UICtrl.deleteListItem(itemID);
           updateBudget();
        }
    };
    
    return {
        init : function() {
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp : 0,
                percentage : -1
            });        

            setupEventListeners();
        }
    }
                  
 })(budgetController, UIController);


controller.init();