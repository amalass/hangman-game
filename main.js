// Start DOM variables
let lines = document.getElementsByClassName(`line`);
let lettersContainer = document.querySelector(`.main-cont .keys`);
let keys = document.getElementsByClassName(`key`);
let word = document.querySelector(`.word`);
let result = document.querySelector(`.result`);
let categ = document.querySelector(`.header .cat span`);
// End DOM variables
// Start js variables
let example;
let lose = 0;
let win = 0;
// End js variables

// Start getting word
async function getData() {
  let data = await (await fetch(`./data.json`)).json();
  let cat =
    Object.keys(data)[Math.floor(Math.random() * Object.keys(data).length)];
  categ.textContent = cat;
  return data[cat][Math.floor(Math.random() * Object.keys(data[cat]).length)];
}
// End getting word
getData().then((resolved) => {
  example = resolved.toUpperCase();
  console.log(`word: ${example.toLowerCase()}`);

  // Start Writing letters
  for (let i = 65; i <= 90; i++) {
    let div = document.createElement(`div`);
    div.textContent = String.fromCharCode(i);
    div.classList.add(`key`, `clickable`);
    lettersContainer.appendChild(div);
  }
  // End Writing letters

  // Start word splitting
  splitWord();
  function splitWord() {
    example = example.split(``);
    if (!example.includes(` `)) {
      example.forEach((element) => {
        let p = document.createElement(`p`);
        p.textContent = element;
        word.appendChild(p);
      });
    } else {
      example.forEach((element) => {
        let p = document.createElement(`p`);
        if (element === ` `) {
          p.textContent = `-`;
          p.style.color = `black`;
          p.style.border = `none`;
        } else p.textContent = element;
        word.appendChild(p);
      });
    }
  }
  // End word splitting

  // Start onclick event
  alogorithim();
  function alogorithim() {
    [...keys].forEach((element) => {
      element.onclick = (e) => {
        // to disable the click buttons if the game is over
        if (lose < 11 && win < example.length) {
          if (example.includes(` `) && win === example.length - 1)
            e.preventDefault();
          else {
            // to disable a key button if it is clicked already
            if (!element.classList.contains(`clickable`)) {
              e.preventDefault();
            } else {
              element.classList.remove(`clickable`);
              // checking if the clicked key exist in the word
              if (example.includes(element.textContent)) {
                for (let value in [...word.children]) {
                  // finding the location of the clicked key in the word and let it appears
                  if (
                    [...word.children][value].textContent ===
                    element.textContent
                  ) {
                    [...word.children][value].style.color = `blue`;
                    win++;
                  }
                }
                // checking if the user win the game
                if (
                  win === example.length ||
                  (example.includes(` `) && win === example.length - 1)
                ) {
                  result.style.cssText = `visibility: visible;transform: translate(-50%, 0%) scale(1.5, 1.5);`;
                  if (lose !== 0)
                    result.innerHTML = `Congrats!! but you have made ${lose} mistakes :|<button>Retry</button>`;
                  else
                    result.innerHTML = `Congrats!! you have made ${lose} mistakes :)<button>Retry</button>`;
                  // to reset the page on clicking the retry button
                  resetEvery(result);
                }
              } else {
                lines[lose++].style.display = `block`;
                // checking if the user has lost
                if (lose === 11) {
                  result.style.cssText = `visibility: visible;transform: translate(-50%, 0%) scale(1.5, 1.5);`;
                  result.innerHTML = `Oops! you have lost :(<button>Retry</button>`;
                  // to reset the page on clicking the retry button
                  resetEvery(result);
                }
              }
            }
          }
        }
      };
    });
  }
  // End onclick event

  // Start retrying
  function resetEvery(result) {
    result.children[0].onclick = () => {
      win = 0;
      lose = 0;
      [...lines].forEach((element) => {
        element.style.display = `none`;
      });
      [...keys].forEach((element) => {
        element.classList.add(`clickable`);
      });
      result.style.cssText = `visibility: hidden; transform: translate(-50%, 0%);`;
      getData().then((res) => {
        [...word.children].forEach((el) => {
          el.remove();
        });
        example = res.toUpperCase();
        console.log(`new word: ${example.toLowerCase()}`);
        splitWord();
        alogorithim();
      });
    };
  }
  // End retrying
});
