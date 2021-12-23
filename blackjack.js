/*
	Blackjack 21
	A simple game developed using Javascript, HTML and CSS

	@author Stayko Chalakov
	@version 1.0
	@date 29.06.2017
*/
/*
	@author Lord Asrothear
	@version 2.0
	@date 23.12.2021
*/

//namespacing
var BlackjackJS = (function() {
	/**************
		Card class
	***************/

	/*
		Constructor
		@param {String} rank
		@param {String} suit
	*/
	function Card(rank, suit){
		this.rank = rank;
	  this.suit = suit;
	}

	/*
		Gets the value or points of the card
		@param {Integer} currentTotal - The current total score of the
		player's hand
	*/
	Card.prototype.getValue = function(currentTotal){
		var value = 0;

		if (this.rank == 'A' && currentTotal < 11){
				value = 11;
		} else if (this.rank == 'A'){
				value = 1;
		} else if (this.rank == 'J' || this.rank == 'Q' || this.rank == 'K'){
				value = 10;
		} else {
				value = parseInt(this.rank);
		}
		return value;
	}

	/*******************
		Renders the card
	*******************/
	Card.prototype.view = function(){
		var htmlEntities = {
			'hearts' : '&#9829;',
			'diamonds' : '&#9830;',
			'clubs' : '&#9827;',
			'spades' : '&#9824;'
		}
		return `
			<div class="card ` + this.suit + `">
				<div class="top rank">` + this.rank + `</div>
				<div class="suit">` + htmlEntities[this.suit] + `</div>
				<div class="bottom rank">` + this.rank + `</div>
			</div>
		`;
	}

	/*************************** End of Card class ********************************/

	/***************
		Player class
	***************/

	/*
		Constructor
		@param {String} element - The DOM element
		@param {Array} hand - the array which holds all the cards
	*/
	function Player(element, hand){
		this.hand = hand;
		this.element = element;
	}

	/*
		Hit player with new card from the deck
		@param {Card} card - the card to deal to the player
	*/
	Player.prototype.hit = function(card){
		this.hand.push(card);
	}

	/*
		Returns the total score of all the cards in the hand of a player
	*/
	Player.prototype.getScore = function(){
		var points = 0;
		for(var i = 0; i < this.hand.length; i++){
			if(i == 0) points = this.hand[i].getValue(0);
			else points += this.hand[i].getValue(points);
		}
		return points;
	}

	/*
		Returns the array (hand) of cards
	*/
	Player.prototype.showHand = function(){
		var hand = "";
		for(var i = 0; i < this.hand.length; i++){
			 hand += this.hand[i].view();
		}
		return hand;
	}

	/*************************** End of Player class ******************************/

	/*************************
		Deck - Singleton class
	*************************/
	var Deck = new function(){
		this.ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
		this.suits = ['hearts', 'spades', 'diamonds','clubs'];
	  this.deck;

		/*
			Fills up the deck array with cards
		*/
		this.init = function(){
			this.deck = []; //empty the array
			for(var s = 3; s >= 0; s--){
		  	for(var r = 12; r >= 0; r--){
		    	this.deck.push(new Card(this.ranks[r], this.suits[s]));
		    }
		  }
		}

		/*
			Shuffles the cards in the deck randomly
		*/
		this.shuffle = function(){
			 var j, x, i;
			 for (i = this.deck.length; i; i--) {
					 j = Math.floor(Math.random() * i);
					 x = this.deck[i - 1];
					 this.deck[i - 1] = this.deck[j];
					 this.deck[j] = x;
			 }
		}

	}

	/**************************** End of Deck class *******************************/

	/*************************
		Game - Singleton class
	**************************/

	var Game = new function(){
		/*
			Deal button event handler
		*/
		this.dealButtonHandler = function(){
			Game.start();
			this.dealButton.disabled = true;
			this.hitButton.disabled = false;
			this.standButton.disabled = false;

			this.pb1Button.disabled = true;
			this.pb2Button.disabled = true;
			this.pb5Button.disabled = true;

			this.pb10Button.disabled = true;
			this.pb20Button.disabled = true;
			this.pb50Button.disabled = true;

			this.pb100Button.disabled = true;
			this.pb200Button.disabled = true;
			this.pb500Button.disabled = true;

			this.rb1Button.disabled = true;
			this.rb2Button.disabled = true;
			this.rb5Button.disabled = true;

			this.rb10Button.disabled = true;
			this.rb20Button.disabled = true;
			this.rb50Button.disabled = true;

			this.rb100Button.disabled = true;
			this.rb200Button.disabled = true;
			this.rb500Button.disabled = true;
		}

		/*
			Hit button event handler
		*/
		this.hitButtonHandler = function(){
			//deal a card and add to player's hand
			var card = Deck.deck.pop();
			this.player.hit(card);

			//render the card and score
			document.getElementById(this.player.element).innerHTML += card.view();
			this.playerScore.innerHTML = this.player.getScore();

			//if over, then player looses
			if(this.player.getScore() > 21){
				this.gameEnded(false);
			}
			if(this.player.getScore() == 21){
				this.gameEnded(true, true);
			}
		}

		/*
			Stand button event handler
		*/
		this.standButtonHandler = function(){
			this.hitButton.disabled = true;
			this.standButton.disabled = true;

			//deals a card to the dealer until
			//one of the conditions below is true
			while(true){
				var card = Deck.deck.pop();

				this.dealer.hit(card);
				document.getElementById(this.dealer.element).innerHTML += card.view();
				this.dealerScore.innerHTML = this.dealer.getScore();

				var playerBlackjack = this.player.getScore() == 21,
						dealerBlackjack = this.dealer.getScore() == 21;

				//Rule set
				if(dealerBlackjack && !playerBlackjack) {
						this.gameEnded(false);
						break;
				} else if(dealerBlackjack && playerBlackjack) {
						this.gameEnded(true);
						break;
				} else if(this.dealer.getScore() > 21 && this.player.getScore() <= 21) {
						this.gameEnded(true);
						break;
				} else if(this.dealer.getScore() > this.player.getScore() && this.dealer.getScore() <= 21 && this.player.getScore() < 21) {
						this.gameEnded(false);
						break;
				}
				//TODO needs to be expanded..

			}
		}

		this.pb1ButtonHandler = function(){
			this.checkb(1);
		}
		this.pb2ButtonHandler = function(){
			this.checkb(2);
		}
		this.pb5ButtonHandler = function(){
			this.checkb(5);
		}
		this.pb10ButtonHandler = function(){
			this.checkb(10);
		}
		this.pb20ButtonHandler = function(){
			this.checkb(20);
		}
		this.pb50ButtonHandler = function(){
			this.checkb(50);
		}
		this.pb100ButtonHandler = function(){
			this.checkb(100);
		}
		this.pb200ButtonHandler = function(){
			this.checkb(200);
		}
		this.pb500ButtonHandler = function(){
			this.checkb(500);
		}
		//
		this.rb1ButtonHandler = function(){
			this.checkb(1,true);
		}
		this.rb2ButtonHandler = function(){
			this.checkb(2,true);
		}
		this.rb5ButtonHandler = function(){
			this.checkb(5,true);
		}
		this.rb10ButtonHandler = function(){
			this.checkb(10,true);
		}
		this.rb20ButtonHandler = function(){
			this.checkb(20,true);
		}
		this.rb50ButtonHandler = function(){
			this.checkb(50,true);
		}
		this.rb100ButtonHandler = function(){
			this.checkb(100,true);
		}
		this.rb200ButtonHandler = function(){
			this.checkb(200,true);
		}
		this.rb500ButtonHandler = function(){
			this.checkb(500,true);
		}
		//
		this.checkb = function(val, minus = false){
			if(!minus){
				var cred = this.cred;
				cred -= val;
				if(cred >= 0){
					this.cred -= val;
					this.bet += val;
				}
			}else{
				var cred = this.bet;
				cred -= val;
				if(cred >= 0){
					this.cred += val;
					this.bet -= val;
				}
			}
		if(this.bet == 0){
			this.dealButton.disabled = true;
		}else if(this.bet >0){
			this.dealButton.disabled = false;
		}
		this.setBet();
		}
		/*
			Initialise
		*/
		this.init = function(){
			this.dealerScore = document.getElementById('dealer-score').getElementsByTagName("span")[0];
			this.playerScore = document.getElementById('player-score').getElementsByTagName("span")[0];
			this.dealButton = document.getElementById('deal');
			this.hitButton = document.getElementById('hit');
			this.standButton = document.getElementById('stand');

			//attaching event handlers
			this.dealButton.addEventListener('click', this.dealButtonHandler.bind(this));
			this.hitButton.addEventListener('click', this.hitButtonHandler.bind(this));
			this.standButton.addEventListener('click', this.standButtonHandler.bind(this));

			//bet buttons add
			this.pb1Button = document.getElementById('pb1');
			this.pb2Button = document.getElementById('pb2');
			this.pb5Button = document.getElementById('pb5');

			this.pb10Button = document.getElementById('pb10');
			this.pb20Button = document.getElementById('pb20');
			this.pb50Button = document.getElementById('pb50');

			this.pb100Button = document.getElementById('pb100');
			this.pb200Button = document.getElementById('pb200');
			this.pb500Button = document.getElementById('pb500');

			this.pb1Button.addEventListener('click', this.pb1ButtonHandler.bind(this));
			this.pb10Button.addEventListener('click', this.pb10ButtonHandler.bind(this));
			this.pb100Button.addEventListener('click', this.pb100ButtonHandler.bind(this));

			this.pb2Button.addEventListener('click', this.pb2ButtonHandler.bind(this));
			this.pb20Button.addEventListener('click', this.pb20ButtonHandler.bind(this));
			this.pb200Button.addEventListener('click', this.pb200ButtonHandler.bind(this));

			this.pb5Button.addEventListener('click', this.pb5ButtonHandler.bind(this));
			this.pb50Button.addEventListener('click', this.pb50ButtonHandler.bind(this));
			this.pb500Button.addEventListener('click', this.pb500ButtonHandler.bind(this));

			//bet buttons rem
			this.rb1Button = document.getElementById('rb1');
			this.rb2Button = document.getElementById('rb2');
			this.rb5Button = document.getElementById('rb5');

			this.rb10Button = document.getElementById('rb10');
			this.rb20Button = document.getElementById('rb20');
			this.rb50Button = document.getElementById('rb50');

			this.rb100Button = document.getElementById('rb100');
			this.rb200Button = document.getElementById('rb200');
			this.rb500Button = document.getElementById('rb500');

			this.rb1Button.addEventListener('click', this.rb1ButtonHandler.bind(this));
			this.rb10Button.addEventListener('click', this.rb10ButtonHandler.bind(this));
			this.rb100Button.addEventListener('click', this.rb100ButtonHandler.bind(this));

			this.rb2Button.addEventListener('click', this.rb2ButtonHandler.bind(this));
			this.rb20Button.addEventListener('click', this.rb20ButtonHandler.bind(this));
			this.rb200Button.addEventListener('click', this.rb200ButtonHandler.bind(this));

			this.rb5Button.addEventListener('click', this.rb5ButtonHandler.bind(this));
			this.rb50Button.addEventListener('click', this.rb50ButtonHandler.bind(this));
			this.rb500Button.addEventListener('click', this.rb500ButtonHandler.bind(this));

			this.double = false;
			console.log("getting ready");
		}

		/*
			Start the game
		*/
		this.start = function(){

			//initilaise and shuffle the deck of cards
			Deck.init();
			Deck.shuffle();
			//deal one card to dealer
			this.dealer = new Player('dealer', [Deck.deck.pop()]);

			//deal two cards to player
			this.player = new Player('player', [Deck.deck.pop(), Deck.deck.pop()]);

			//render the cards
			document.getElementById(this.dealer.element).innerHTML = this.dealer.showHand();
			document.getElementById(this.player.element).innerHTML = this.player.showHand();

			//renders the current scores
			this.dealerScore.innerHTML = this.dealer.getScore();
			this.playerScore.innerHTML = this.player.getScore();

			this.setMessage("Hit or Stand");
			if(this.player.getScore() == 21){
				this.gameEnded(true, true);
			}
			if(this.dealer.getScore() == 21){
				this.gameEnded(false);
			}
		}

		/*
			If the player wins or looses
		*/
		this.gameEnded = function(state, black = false){
			if(state){
				if(!black){//normal win
					this.setMessage("Gewonnen");
					if(this.double){
						this.cred += (this.bet*2)*2
					}else{
						this.cred += (this.bet*2)
					}
				}else{//blackjack
					this.setMessage("Blackjack!");
					if(this.double){
						this.cred += (this.bet*4)*2
					}else{
						this.cred += (this.bet*2)*2
					}
					this.unlck();
				}
			}else{
				this.setMessage("Verloren");
				this.bet = 0;
			};
			this.bet = 0;
			this.setBet();
			Deck.init();
			Deck.shuffle();
			setTimeout(() => {
				document.getElementById(this.dealer.element).innerHTML = this.dealer.showHand();
				document.getElementById(this.player.element).innerHTML = this.player.showHand();
				this.unlck();
			}, 2000);
			this.hitButton.disabled = true;
			this.standButton.disabled = true;
			this.dealer = new Player('dealer', "");
			this.player = new Player('player', "");
		}

		/*
			Instructions or status of game
		*/
		this.setMessage = function(str){
			document.getElementById('status').innerHTML = str;
		}

		this.setBet = function(){
			document.getElementById('betspace').innerHTML = "Credits: "+this.cred+" || Einsatz: "+this.bet;
		}

		this.unlck = function(){
			this.pb1Button.disabled = false;
			this.pb2Button.disabled = false;
			this.pb5Button.disabled = false;

			this.pb10Button.disabled = false;
			this.pb20Button.disabled = false;
			this.pb50Button.disabled = false;

			this.pb100Button.disabled = false;
			this.pb200Button.disabled = false;
			this.pb500Button.disabled = false;

			this.rb1Button.disabled = false;
			this.rb2Button.disabled = false;
			this.rb5Button.disabled = false;

			this.rb10Button.disabled = false;
			this.rb20Button.disabled = false;
			this.rb50Button.disabled = false;

			this.rb100Button.disabled = false;
			this.rb200Button.disabled = false;
			this.rb500Button.disabled = false;
		}

		this.exit = function() {
				console.log('exit')
		}

		this.icrd = function(val){
			console.log('init')
			this.cred = val;
			this.bet = 0;
			this.setBet();
		}
	}

	//Exposing the Game.init function
	//to the outside world

	return {
		init: Game.init.bind(Game),
		exit: Game.exit.bind(Game),
		icrd: Game.icrd.bind(Game)
	}
})()
/*
