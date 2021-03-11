module.exports = (playerNum) => {
  const threePlayersDefaults = [
    "discoverer",
    "criminal",
    "detective",
    "alibi",
    "alibi"
  ];

  const threePlayersExtends = [
    "alibi",
    "alibi",
    "alibi",
    "detective",
    "detective",
    "detective",
    "witness",
    "witness",
    "witness",
    "dealing",
    "dealing",
    "dealing",
    "dealing",
    "dealing",
    "rumor",
    "rumor",
    "rumor",
    "rumor",
    "manipulation",
    "manipulation",
    "manipulation",
    "plan",
    "plan",
    "normal",
    "normal",
    "dog",
    "boy"
  ];

    let allCards = [];
    
  if (playerNum === 3) {
    let counter = 0;
    let duplicate = false;
    let randomResultsArr = [];

    for (counter; counter < 7; counter++) {
      let randomTmp = Math.floor(Math.random() * 27);

      duplicate = randomResultsArr.some((value) => {
        return value === randomTmp;
      });

      if (!duplicate) {
        randomResultsArr.push(randomTmp);
      } else {
        console.log("duplicate detected");
        counter -= 1;
      }
      console.log(randomResultsArr);
    }

    randomResultsArr.map((val) => {
      threePlayersDefaults.push(threePlayersExtends[val]);
    });
    
    const shuffle = ([...array]) => {
      for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
    
    allCards = shuffle(threePlayersDefaults);

  }
  
  return allCards;
};


    