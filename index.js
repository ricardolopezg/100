const json = JSON.stringify({
  x:4,
  y: 6,
  z: 'Z',
  a: {
    b: 'nested',
    c: {
      d: {
        e: [
          'inside',
          'an',
          'array'
        ]
      }
    }
  }
}, undefined, 1);

const vacuum = /[ \t\f\v]/g;

console.log(json);
const formatted = `\n${json.replace(vacuum,'').replace(/^[\s]*/gm,'data: ').replace(/$/gm,"\\n")}\\n\n`;
console.log(formatted);
// const dry = json.replace(vacuum,'');
// console.log(dry);
const dry = json.replace(vacuum,'').replace(/^(.*)$/gm,'data: $1\\n');
console.log(dry);
// const firstpass = json.replace(/^[\s]*/gm,'data: ');
// const second = firstpass.replace(/$/gm,"\\n");
// console.log(firstpass);
// console.log(second);

// try breaking the entire JSON string by newlines and operate on each string.
// possibly format into an array and join by new lines;
