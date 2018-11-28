const cards = ["fa-diamond", "fa-diamond", "fa-paper-plane", "fa-paper-plane",
            "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-anchor", "fa-anchor",
            "fa-leaf", "fa-leaf", "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];
let i = 0;
let match = [];
let deck = $(".deck");
let bg = $(".bg"),
    bg2 = $(".bg2");
let counter = 0;
let moveCounter = 0;
let previousTarget = null;
let minutes = $(".minutes");
let seconds = $(".seconds");
let totalTime = 0;
let startTime;
let scores = $(".score-panel");
let stars;
let totalStars = "";
let rating = 3;
let swaltype = null;
let title = null;
let message = null;

    // Shuffle function from http://stackoverflow.com/a/2450976
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    $(document).ready(function () {
        game();
    });

    // Initialize game
    function game() {
        let shuffleCards = shuffle(cards)
        deck.empty();
        // counter = 0;
        $(".match").css("pointer-events","auto");
        clearInterval(startTime);
        totalTime = 0;
        moveCounter = 0;
        totalSeconds = 0;
        totalStars = "";
        stars = null;
        swaltype = null;
        title = null;
        message = null;
        $(".moves").text(moveCounter);
        
        $('.minutes').text('00');
        $('.seconds').text('00');
        $(".stars").find("i").removeClass("red winner").removeAttr("style","color: #FFC51B; animation: win 0.5s linear");
        // create cards
        for (i = 0; i < shuffleCards.length; i++) {
            deck.append('<li class="card"><i class="fa ' + shuffleCards[i] + '"></i></li>');
        }
    }
    // Click on cards
    deck.on("click", ".card", function() {
      
        $(this).addClass("open show");
        match.push($(this).find("i").attr("class"));
        // makes sure cards cant be double clicked 
        if(this === previousTarget) {
            // console.log(previousTarget)
            return false
        }
        previousTarget = this; 
        // makes sure no more than 2 can be opened
        if (match.length > 2) {
            setTimeout(() => {
                $(".card").not(".match").removeClass("show open");
            }, 300)
            match = []
        }
        // if user clicks on 2 cards
        if (match.length === 2) {
            moves();
            if (match[0] === match[1]) {
                matched();
                $(".match").css("pointer-events","none");
            } else {
                notMatched();
            }
        } 
        // checks when all cards are matched
        if ($("li.card").length == $("li.match").length) {
            endGame();
            clearInterval(startTime);
        }
    });
    // If matched
    function matched() {
        let matchedClass = document.getElementsByClassName(match[0])
        $(matchedClass).parent("li").addClass('match').removeClass('open show');
        bg.addClass('bg_animation');
        bg2.addClass('bg_animation2');
            
        setTimeout(() => {
            $(".container").find("span").removeClass("bg_animation bg_animation2");
        }, 830)
        match = []
    }
    // If no match
    function notMatched() {
        deck.find(".open").not(".match").addClass("no-match");
        
        setTimeout(() => {
                $(".card").not(".match").removeClass("show open no-match"); 
            }, 250)
           match = [];
    }
    // Moves counter
    function moves() {
        moveCounter++
        $(".moves").text(moveCounter);
        // Starts timer on first move
        if (moveCounter == 1){
            timer();
         }
        starRating();
    }
    // Timer, learned from https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript/7910506
    // calculates seconds and minutes
   function timer() {
       startTime = setInterval(function () {
            ++totalTime;
            seconds.text(
            pad(totalTime % 60)
            );
            minutes.text(
            pad(parseInt(totalTime / 60))
            );
        }, 1000)
     }
     // Timer - checks if minutes and seconds value is less than 2 digits for display
    function pad(num) {
        let time = num + "";
            if (time.length < 2) {
            return "0" + time;
        } else {
        return time;
        }
    }
    // Rating
    function starRating() {
       
        if (moveCounter == 20) {
            scores.find("i:nth(2)").addClass("red") // 2 stars
        } else if (moveCounter == 25) {
            scores.find("i:nth(1)").addClass("red") // 1 star
        }  else if (moveCounter > 39) {
            scores.find("i:nth(0)").addClass("red")  // 0 star
            endGame();
            clearInterval(startTime);
        }
        // 3 stars animation
       setTimeout(() => {
            if (moveCounter <= 19 && $("li.card").length == $("li.match").length) { 
                // console.log("winner")
                let win = $(".stars").find("i");
                 for (i = 0; i < win.length; i++) {
                     (function(i) {
                        setTimeout(function() { 
                            win[i].setAttribute("style","color: #FFD537; -webkit-text-stroke: 2px #444; animation: win2 0.5s linear")
                        }, i*200)
                     }(i))
                } 
            }
        }, 200)
    }
    // Sweetalerts.js endGame modal when all cards are matched
    function endGame() {
        $(".card").css("pointer-events","none");
        setTimeout(() => {
            stars = $(".stars").find("i").not('.red').length
            for (i = 0; i < stars; i++) {
                totalStars += '<i class="fa fa-star winner"></i>';
                swaltype = "success";
                title = "Yay!"
                message = "You made " + moveCounter + " moves.<br>" + "Final Time: " + $(".minutes").text() + ":" + $(".seconds").text() + "<br>Score: " + totalStars
            }
            // if 0 stars
            if (totalStars === "") {
                    totalStars += '<span class="red">Zero Stars 4 U</span>';
                    swaltype = "error";
                    title = "Boo!"
                    message = "You made too many moves!<br>" + "Final Time: " + $(".minutes").text() + ":" + $(".seconds").text() + "<br>Score: " + totalStars
           }
            Swal({
                type: swaltype,
                title: title,
                html: message,
                confirmButtonText: 'Play Again!',
                customClass: 'tada',
                width: 600,
                padding: '3em',
                backdrop: 'rgba(0,0,123,0.4)'
            }).then((click) => {
                if (click.value) {
                    resetGame();
                  //  resetTime();
                }
            })
        }, 900)
    };
    // reset 
    function resetGame() {
        game();
    }