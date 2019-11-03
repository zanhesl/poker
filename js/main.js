(function () {
  'use strict';

  const seats = [
    {
      number: 1,
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    },

    {
      number: 2,
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    },

    {
      number: 3,
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    },

    {
      number: 4,
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
  ];

  const input = document.querySelector(`.nickname`);
  const submit = document.querySelector(`.submit`);

  submit.addEventListener(`click`, (evt) => {
    const table = Math.floor(Math.random()*seats.length);
    const seat = Math.floor(Math.random()*seats[table].values.length);
    document.querySelector(`.position`).innerText = `Ваша стол: ${seats[table].number}`;
    document.querySelector(`.seat`).innerText = `Ваше место: ${seats[table].values[seat]}`;
    document.querySelector(`.table:nth-child(${seats[table].number}) ol li:nth-child(${seats[table].values[seat]})`).innerText = input.value;
    input.value = ``;
    seats[table].values.splice(seat, 1);
    if (!seats[table].values.length) {
      seats.splice(table, 1);
    }
    console.log(seats);
  });

}());

//# sourceMappingURL=main.js.map
