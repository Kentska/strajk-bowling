import React from 'react';
import "./Shoes.scss";
import { nanoid } from "nanoid";

import Input from "../Input/Input";

function Shoes({ updateSize, addShoe, removeShoe, shoes }) {
  const shoeComps = shoes.map((input, index) => {
    const label = `Shoe size / person ${index + 1}`;
    const shoeInput = (
// data-testid används här eftersom komponenten renderar dynamiska skofält
// med identiska labels och knappar. Detta gör det möjligt att testa
// att fält läggs till och tas bort utan att ändra komponentens logik.

      <article className="shoes__form" key={input.id} data-testid="shoe-form">
        <Input
          label={label}
          type="text"
          customClass="shoes__input"
          name={input.id}
          handleChange={updateSize}
          maxLength={2}
        />
        <button
          className="shoes__button shoes__button--small"
          onClick={() => {
            removeShoe(input.id);
          }}
        >
          -
        </button>
      </article>
    );

    return shoeInput;
  });

  return (
    <section className="shoes">
      <header>
        <h2 className="shoes__heading">Shoes</h2>
      </header>
      {shoeComps}
      <button
        className="shoes__button"
        onClick={() => {
          addShoe(nanoid());
        }}
      >
        +
      </button>
    </section>
  );
}

export default Shoes;
