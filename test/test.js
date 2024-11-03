async function demo() {
  let res1 = await Promise.resolve('123');
  return res1;
}

async function main() {
  const res = await Promise.all([demo()]);
  const res1 = await Promise.resolve(demo());
  console.log(res);
  console.log(res1);
}

main();
