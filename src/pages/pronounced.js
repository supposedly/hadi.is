import React, { createRef, useState } from "react";
import styled /*, { keyframes }*/ from "styled-components";
import { FaSyncAlt } from "react-icons/fa";
import useSound from "use-sound";

import rfs from "../utils/rfs.js";

import Layout from "../components/layout";
import Title from "../components/title";

import nameSpriteURL from "../assets/name-pronunciation.mp3";

const FatSoundButton = styled.button`
  margin-top: 3em;
  margin-bottom: 1em;
  ${rfs(`20rem`, `height`)}
  ${rfs(`20rem`, `width`)}
  cursor: pointer;
  border: none;
  border-radius: 15px;
  background-color: rgba(0, 0, 0, 0.15);
  // background-image: radial-gradient(100% 50% at top left,
  //   rgba(255, 255, 255, .3) 50%,
  //   rgba(255, 255, 255, 0) 50%
  // );
  background-size: 210% 210%;

  transition: background-size 250ms, background-color 75ms, height 250ms,
    width 250ms;
  background-repeat: no-repeat;

  &:hover,
  &:active {
    background-color: rgba(0, 0, 0, 0.25);
  }

  &::after {
    transition: font-size 150ms;
    content: "🔊";
    ${rfs(`5rem`)}
  }

  &:focus {
    background-size: 220% 220%;
    outline: none;
    &::after {
      ${rfs(`8rem`)}
    }
  }
`;

const P = styled.p`
  margin: 1rem;
  font-family: "Epilogue", sans-serif;
  font-variation-settings: "wght" 200, "slnt" 10;
  font-weight: 200;
  transform: skew(-10deg);
  ${rfs(`25px`)}
  line-height: 2;

  button {
    background-color: transparent;
    font-size: inherit;
    font-family: inherit;
    cursor: pointer;
    display: inline-block;
    padding: 0;
    border: none;
    border-bottom: 1px solid black;
    transition: border 150ms;

    &:focus,
    &:hover {
      outline: none;
      border-bottom: 3px solid black;
    }
  }
`;

const buttonRef = createRef();

const rhymes = (s => s[0].trim().split(`\n`))`
Maddie
laddie
baddie
Maddy
baddy
caddy
laddy
paddy
daddy
addy
faddy
Matty
gnatty
natty
catty
tatty
fatty
ratty
batty
patty
`;
const rhymeRef = createRef();

function randRhyme() {
  return rhymes[Math.floor(Math.random() * rhymes.length)];
}

function isRhymeExact(word) {
  return !word.includes(`t`);
}

function replace(setWord, displayedWord, updatedWord, erasing = true) {
  if (erasing) {
    displayedWord = displayedWord.slice(0, -1);
    setTimeout(
      () => replace(setWord, displayedWord, updatedWord, !!displayedWord),
      displayedWord.length * 2 + 10
    );
  } else {
    displayedWord = `${displayedWord || ``}${updatedWord[0]}`;
    updatedWord = updatedWord.slice(1);
    if (updatedWord) {
      setTimeout(
        () => replace(setWord, displayedWord, updatedWord, false),
        displayedWord.length * 2 + 10
      );
    } else {
      rhymeRef.current.blur();
    }
  }
  setWord(displayedWord);
}

function wipe(setWord, displayedWord, updatedWord, i = 1) {
  if (i <= updatedWord.length + displayedWord.length) {
    setWord(`${updatedWord.slice(0, i)}${displayedWord.slice(i) || ``}`);
    setTimeout(
      () => wipe(setWord, displayedWord, updatedWord, i + 1),
      displayedWord.length * 2 + 10
    );
  }
}

export default () => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [word, setWord] = useState(rhymes[0]);
  const [modifier, setModifier] = useState(``);
  const wipeModifier = (exact = isRhymeExact(word)) => (
    wipe(setModifier, modifier, exact ? `` : `kinda `)
  );
  const replaceWord = () => {
    const newWord = randRhyme();
    replace(setWord, word, newWord);
    wipeModifier(isRhymeExact(newWord));
  };

  // use-sound relies on a useEffect() hook with the url as a dependency,
  // so this could be done with separate audio files too, but a
  // single spritesheet is easier to deal with (if harder to make lol)
  // and more extensible
  const [playName] = useSound(nameSpriteURL, {
    onend() {
      buttonRef.current.blur();
    },
    sprite: {
      0: [0, 550],
      1: [1000, 550],
      2: [2000, 550],
      3: [3000, 550],
      4: [4000, 550],
      5: [5000, 550],
      6: [6000, 550],
      7: [7000, 550],
    }
  });
  const [sprite, setSprite] = useState(0);

  return (
    <Layout title="pronounced">
      <article className="center-children">
        <header>
          <Title text="pronounced" punctuation="..." />
        </header>
        <FatSoundButton
          ref={buttonRef}
          pop={buttonClicked}
          onClick={() => {
            setButtonClicked(true);
            setTimeout(() => {
              setButtonClicked(false);
            }, 250);
            // overcomplicated parity-alternating randomness lul
            playName({ id: `${(sprite + Math.floor(Math.random() * 4) * 2) % 8}` });
            setSprite(n => (n + 1) % 8);
          }}
        />
        <P>
          ({modifier}like{` `}
          <button
            ref={rhymeRef}
            onClick={() => {
              replaceWord();
            }}
          >
            {word} <FaSyncAlt size="16" />
          </button>{` `}
          with an H)
        </P>
      </article>
    </Layout>
  );
};
