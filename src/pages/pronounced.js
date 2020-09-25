import React, { createRef, useState } from "react";
import styled/*, { keyframes }*/ from "styled-components";
import loadable from '@loadable/component';
import { FaSyncAlt } from "react-icons/fa";

import rfs from "../utils/rfs.js";

import Layout from "../components/layout";
import Title from "../components/title";

const FatSoundButton = styled.button`
  margin-top: 3em;
  margin-bottom: 1em;
  ${rfs(`20rem`, `height`)}
  ${rfs(`20rem`, `width`)}
  cursor: pointer;
  border: none;
  border-radius: 15px;
  background-color: rgba(0, 0, 0, .15);
  // background-image: radial-gradient(100% 50% at top left,
  //   rgba(255, 255, 255, .3) 50%,
  //   rgba(255, 255, 255, 0) 50%
  // );
  background-size: 210% 210%;
  
  transition: background-size 250ms, background-color 75ms, height 250ms, width 250ms;
  background-repeat: no-repeat;

  &:hover, &:active {
    background-color: rgba(0, 0, 0, .25);
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
`

const P = styled.p`
  margin: 1rem;
  font-family: 'Epilogue', sans-serif;
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

    &:focus, &:hover {
      outline: none;
      border-bottom: 3px solid black;
    }
  }
`

const buttonRef = createRef();
let name = null;
// because gatsby can't build `new Audio()` on its own
const AudioLoading = loadable(() => import("../assets/name-pronunciation.mp3"), {
  fallback: (() => <P>Loading audio.</P>)(),
  resolveComponent(module) {
    name = new Audio(module.default);
    name.addEventListener(`ended`, () => { name.currentTime = 0; buttonRef.current.blur(); });
    return () => <P></P>;
  }
});

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
`
const rhymeRef = createRef();

function randRhyme() {
  return rhymes[Math.floor(Math.random() * rhymes.length)];
}

function wipe(setWord, displayedWord, updatedWord, erasing = true) {
  // this method works but it looks pretty lame when the words only differ in their initial lol
  // if (i < updatedWord.length + displayedWord.length) {
  //   setWord(`${updatedWord.slice(0, i)}${displayedWord.slice(i) || ``}`);
  //   setTimeout(() => wipe(setWord, displayedWord, updatedWord, i + 1), 100);
  // }
  if (erasing) {
    displayedWord = displayedWord.slice(0, -1);
    setTimeout(() => wipe(setWord, displayedWord, updatedWord, !!displayedWord), displayedWord.length * 2 + 10);
  } else {
    displayedWord = `${displayedWord || ``}${updatedWord[0]}`;
    updatedWord = updatedWord.slice(1);
    if (updatedWord) {
      setTimeout(() => wipe(setWord, displayedWord, updatedWord, false), displayedWord.length * 2 + 10);
    } else {
      rhymeRef.current.blur();
    }
  }
  setWord(displayedWord);
}

export default () => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [word, setWord] = useState(rhymes[0]);
  const wipeWord = () => wipe(setWord, word, randRhyme());

  return <Layout title="pronounced">
    <article className="center-children">
      <header>
        <Title text="pronounced" punctuation="..." />
      </header>
      <FatSoundButton
        ref={buttonRef}
        pop={buttonClicked}
        onClick={() => {
          if (!name) return;
          setButtonClicked(true);
          setTimeout(() => { setButtonClicked(false); }, 250);
          name.play();
        }}
      />
      {name ? <AudioLoading/> : <P>(like <button ref={rhymeRef} onClick={wipeWord}>{word} <FaSyncAlt size="16"/></button> with an H)</P>}
    </article>
  </Layout>
}
