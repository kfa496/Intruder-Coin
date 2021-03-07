App = {
	web3Provider : null,
	contracts : {},
	account : '0x0',
	loading : false,
	tokenPrice : 1000000000000000,
	tokensSold : 0,
	tokensAvailable : 750000,

	init : function() {
		console.log("App initialized ....")
		return App.initWeb3();
	},

	initWeb3: function() {
		if (typeof web3 !== 'undefined') {
			App.web3Provider = web3.currentProvider;
			web3 = new Web3(web3.currentProvider);
		} else {
			App.web3Provider = new Web3.providers.HttpProvider('http://localhost : 7545');
			web3 = new Web3(App.web3Provider);
		}
		return App.initContracts();
	},
	initContracts : function() {
		$.getJSON("IntruderSale.json" , function(intruderSale){
			App.contracts.IntruderSale = TruffleContract(intruderSale);
			App.contracts.IntruderSale.setProvider(App.web3Provider);
			App.contracts.IntruderSale.deployed().then(function(intruderSale){
				console.log("IGX Sale Address: ",intruderSale.address);
			});
		}).done(function(){
			$.getJSON("Intruder.json" , function(intruder){
			App.contracts.Intruder = TruffleContract(intruder);
			App.contracts.Intruder.setProvider(App.web3Provider);
			App.contracts.Intruder.deployed().then(function(intruder){
			console.log("IGX Address: ",intruder.address);
					});

				App.listenForEvents();
				return App.render();

				});
			})
		},

		 // Listen for events emitted from the contract
		  listenForEvents: function() {
		    App.contracts.IntruderSale.deployed().then(function(instance) {
		      instance.Sell({}, {
		        fromBlock: 0,
		        toBlock: 'latest',
		      }).watch(function(error, event) {
		        console.log("event triggered", event);
		        App.render();
		      })
		    })
		  },
		
			render : function() {
			if(App.loading) {
				return;
			}
			App.loading = true;

			var loader = $('#loader');
			var content = $('#content');

			loader.show();
			content.hide();
			// Load account data
			 web3.eth.getCoinbase(function(err,account){
			if(web3.currentProvider.enable){
		    //For metamask
		    web3.currentProvider.enable().then(function(acc){
		        App.account = acc[0];
		        $("#accountAddress").html("Your Account: " + App.account);
		    });
		} else{
		    App.account = web3.eth.accounts[0];
		    $("#accountAddress").html("Your Account: " + App.account);
		}
		})
			 App.contracts.IntruderSale.deployed().then(function(instance){
			 	intruderSaleInstance = instance;
			 	return intruderSaleInstance.tokenPrice();
			 }).then(function(tokenPrice) {
			 	console.log("tokenPrice",tokenPrice)	
			 	App.tokenPrice = tokenPrice;
			 	$('.token-price').html(web3.fromWei(App.tokenPrice,"ether").toNumber());

			 	return intruderSaleInstance.tokensSold();
			 }).then(function(tokensSold) {
     			 App.tokensSold = tokensSold.toNumber();
      			$('.tokens-sold').html(App.tokensSold);
      			$('.tokens-available').html(App.tokensAvailable);
			 
			 	var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
      			$('#progress').css('width', progressPercent + '%');

      			 // Load token contract
     			 App.contracts.Intruder.deployed().then(function(instance) {
        		intruderInstance = instance;
        		return intruderInstance.balanceOf(App.account);
     			 }).then(function(balance) {
        			$('.IGX-balance').html(balance.toNumber());
        				App.loading = false;
       					loader.hide();
       					content.show();
      		})
		});
	},

  buyTokens: function() {
    $('#content').hide();
    $('#loader').show();
    var numberOfTokens = $('#numberOfTokens').val();
    App.contracts.IntruderSale.deployed().then(function(instance) {
      return instance.buyTokens(numberOfTokens, {
        from: App.account,
        value: numberOfTokens * App.tokenPrice,
        gas: 500000 // Gas limit
      });
    }).then(function(result) {
      console.log("Tokens bought...")
      $('form').trigger('reset') // reset number of tokens in form
      // Wait for Sell event
      });
  }
}


$(function(){
	$(window).load(function() {
		App.init();
	})	
});