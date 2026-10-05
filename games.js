(function(){
const box=document.getElementById("t-play");
function card(html){const d=document.createElement("div");d.className="card";d.innerHTML=html;box.appendChild(d);return d;}

card('<h2>Память</h2><p>Найди все пары. Меньше ходов — больше монет.</p><div id="mg" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px"></div><div class="row" style="margin-top:10px"><button id="mstart" class="alt">Новая игра</button></div><div id="mmsg" style="text-align:center;font-weight:700;margin-top:8px"></div>');
let open=[],moves=0,found=0,lock=false;
function mstart(){
  const e=["🍎","🍋","🍇","🍒","🥝","🍑"];
  const a=e.concat(e).sort(()=>Math.random()-.5);
  open=[];moves=0;found=0;lock=false;
  $("mmsg").textContent="";
  const g=$("mg");g.innerHTML="";
  a.forEach(v=>{
    const b=document.createElement("button");
    b.className="alt";b.style.height="64px";b.style.fontSize="28px";
    b.textContent="?";b.dataset.v=v;
    b.onclick=()=>pick(b);g.appendChild(b);
  });
}
function pick(b){
  if(lock||b.disabled||open.includes(b))return;
  b.textContent=b.dataset.v;open.push(b);
  if(open.length<2)return;
  moves++;
  const x=open[0],y=open[1];
  if(x.dataset.v===y.dataset.v){
    x.disabled=true;y.disabled=true;open=[];found++;
    if(found===6){
      const win=Math.max(5,30-moves*2);
      S.coins+=win;buzz("success");render();
      $("mmsg").textContent="Готово за "+moves+" ходов: +"+win+" монет";
    }
  }else{
    lock=true;
    setTimeout(()=>{x.textContent="?";y.textContent="?";open=[];lock=false;},700);
  }
}
$("mstart").onclick=mstart;mstart();

card('<h2>Реакция</h2><p>Нажми, когда кнопка станет зелёной. Чем быстрее, тем больше монет.</p><button id="rbtn" class="alt" style="width:100%;height:90px;font-size:18px">Начать</button>');
let rs=0,rt=null,ready=false;
$("rbtn").onclick=()=>{
  const b=$("rbtn");
  if(ready){
    const ms=Date.now()-rs;ready=false;
    const win=ms<300?15:ms<500?8:ms<800?3:1;
    S.coins+=win;buzz("success");render();
    b.style.background="";b.textContent=ms+" мс: +"+win+" монет. Ещё раз";return;
  }
  if(rt){clearTimeout(rt);rt=null;b.style.background="";b.textContent="Рано! Ещё раз";return;}
  b.textContent="Жди...";b.style.background="var(--red)";
  rt=setTimeout(()=>{rt=null;ready=true;rs=Date.now();b.style.background="var(--teal)";b.textContent="Жми!";},1000+Math.random()*2500);
};
})();
/* конец */
