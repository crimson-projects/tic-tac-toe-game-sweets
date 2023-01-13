console.clear()

const boxes = document.querySelectorAll('.boxes rect'),
  o = document.querySelector('#o'),
  x = document.querySelector('#x'),
  end = document.querySelector('#end')

let vals = {},
    xTurn = false

for (let i=0; i<boxes.length; i++){
  const box = boxes[i];
  box.onpointerup =(e)=>{
    if (gsap.isTweening('.mark')) return; //helps prevent overlap on multi-touch devices
    const mark = xTurn? x.cloneNode(true) : o.cloneNode(true);
    box.parentNode.appendChild(mark);
    gsap.set(box, {autoAlpha:0});
    gsap.fromTo(mark, {x:()=>i%3*30, y:()=>Math.floor(i/3)*30, attr:{class:'mark'}, scale:0, transformOrigin:'50%'},{duration:0.3, scale:1, ease:'back.out(3)'});
    vals['b'+i]=(mark.id=='x')?1:0;
    let tie = checkBoxes(0,1,2);
    tie += checkBoxes(3,4,5);
    tie += checkBoxes(6,7,8);
    tie += checkBoxes(0,3,6);
    tie += checkBoxes(1,4,7);
    tie += checkBoxes(2,5,8);
    tie += checkBoxes(0,4,8);
    tie += checkBoxes(2,4,6);
    if (tie==0 && Object.keys(vals).length>8) showEnd('TIE','GAME');
    xTurn=!xTurn;
  }
}

function checkBoxes(a,b,c){
  const sum = vals['b'+a]+vals['b'+b]+vals['b'+c];
  if (sum==0 || sum==3){
    showEnd(xTurn?'🥨':'🍩','WINS');
    return 1;
  }
  else return 0;
}

function showEnd(str1,str2){
  gsap.set('.txt', {innerHTML:(i)=>[str1,str2][i]});
  gsap.to('#end', {autoAlpha:1, scale:1, ease:'expo.inOut', onComplete:()=>{end.onpointerup=reset}});
}

function reset(){
  end.onpointerup = null;
  gsap.set('#end', {autoAlpha:0, scale:1.2});
  gsap.set(boxes, {autoAlpha:1});
  const marks = document.getElementsByClassName('mark');
  while(marks.length > 0) marks[0].parentNode.removeChild(marks[0]);
  vals = {};
}

gsap.set('#end', {autoAlpha:0, scale:1.2, transformOrigin:'50%'});
gsap.set('svg', {opacity:1});