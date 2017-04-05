const delayedRandom = () => {
  // console.log("generating");
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        resolve(Math.floor(Math.random() * 100) + 1);
      },
      1000
    );
  });
};

console.log("💥🔫 START!");

async function doIt() {
  console.log("doing it");

  let value = await delayedRandom();
  console.log("val1", value);

  let value2 = await delayedRandom();
  console.log("val2", value);

  return value + value2;
}

doIt().then(val => console.log("result", val));
