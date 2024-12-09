enum pet {
  a = 1,
  b,
}

function test(d: pet) {
  console.log(d.a, d['a'], 'sdsd');
  if (1 === d.a) {
    console.log('111');
  } else {
    console.log('222');
  }
}

test(pet.a);
