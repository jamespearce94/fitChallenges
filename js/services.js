angular.module('app.services', [])


.factory('fireBaseData', function($firebase) {
	var ref = new Firebase("https://fitchallengesproject.firebaseio.com/"),
    refCart = new Firebase("https://fitchallengesproject.firebaseio.com/cart"),
    refUser = new Firebase("https://fitchallengesproject.firebaseio.com/users"),
    refCategory = new Firebase("https://fitchallengesproject.firebaseio.com/category"),
    refOrder = new Firebase("https://fitchallengesproject.firebaseio.com/completed_challenges"),
    refFeatured = new Firebase("https://fitchallengesproject.firebaseio.com/featured"),
    refMenu = new Firebase("https://fitchallengesproject.firebaseio.com/menu");
  return {
    ref: function() {
      return ref;
    },
    refCart: function() {
      return refCart;
    },
    refUser: function() {
      return refUser;
    },
    refCategory: function() {
      return refCategory;
    },
    refOrder: function() {
      return refOrder;
    },
    refFeatured: function() {
      return refFeatured;
    },
    refMenu: function() {
      return refMenu;
    }
  }
})


.factory('sharedUtils',['$ionicLoading','$ionicPopup','fireBaseData', function($ionicLoading,$ionicPopup,fireBaseData){


    var functionObj={};

    functionObj.showLoading=function(){
      $ionicLoading.show({
        content: '<i class=" ion-loading-c"></i> ', // The text to display in the loading indicator
        animation: 'fade-in', // The animation to use
        showBackdrop: true, // Will a dark overlay or backdrop cover the entire view
        maxWidth: 200, // The maximum width of the loading indicator. Text will be wrapped if longer than maxWidth
        showDelay: 0 // The delay in showing the indicator
      });
    };
    functionObj.hideLoading=function(){
      $ionicLoading.hide();
    };


    functionObj.showAlert = function(title,message) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: message
      });
    };

    return functionObj;

}])




  .factory('sharedCartService', ['$ionicPopup','fireBaseData','$firebaseArray','$filter',function($ionicPopup, fireBaseData, $firebaseArray,$filter){

    var uid ;// uid is temporary user_id

    var cart={}; // the main Object

		var monthNames = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
];

var date = new Date();
var day = date.getDate();
var monthIndex = date.getMonth();
var year = date.getFullYear();


var currDate = day + ' ' + monthNames[monthIndex] + ' ' + year;
console.log(currDate);

    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        uid=user.uid;
        cart.cart_items = $firebaseArray(fireBaseData.refCart().child(uid));

      }
    });




    //Add to Cart
    cart.add = function(item) {
      //check if item is already added or not

      fireBaseData.refCart().child(uid).once("value", function(snapshot) {

        if( snapshot.hasChild(item.$id) == true ){

					//if item is already in the cart
          var currentQty = snapshot.child(item.$id).val().item_qty;
	    		var confirmPopup = $ionicPopup.alert({
			      title: 'Challenge error',
			      template: 'You are already entered into this challenge', currDate
	    		});

        /*  fireBaseData.refCart().child(uid).child(item.$id).update({   // update
            item_qty : currentQty+1
          });
							*/
        }else{

          //if item is new in the cart
          fireBaseData.refCart().child(uid).child(item.$id).set({    // set
            challenge_name: item.name,
            challenge_image: item.image,
            challenge_price: item.price,
            challenge_experience: 100,
						challenge_date: currDate,
						challenge_status: 'In Progress'
          });
        }
      });
    };

    cart.drop=function(item_id){
      fireBaseData.refCart().child(uid).child(item_id).remove();
    };

    cart.increment=function(item_id){

      //check if item is exist in the cart or not
      fireBaseData.refCart().child(uid).once("value", function(snapshot) {
        if( snapshot.hasChild(item_id) == true ){

        }else{
          //pop error
        }
      });

    };

    cart.decrement=function(item_id){

      //check if item is exist in the cart or not
      fireBaseData.refCart().child(uid).once("value", function(snapshot) {
        if( snapshot.hasChild(item_id) == true ){


        }else{
          //pop error
        }
      });

    };

    return cart;
  }])




.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}]);
