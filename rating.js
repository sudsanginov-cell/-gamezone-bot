(function(){
const API="https://mkqwvqdebgojlrmxfgmp.supabase.co";
const KEY="sb_publishable_lyeR3uz4lyvDh9fGa9mVeA_YiVEErv5";
const me=(user&&user.id)?user:null;
let sent=-1;

const c=document.querySelector("#t-top .card");
c.innerHTML='<h2>Рейтинг</h2><p>Лучший результат в «Ловце». Топ-10 игроков.</p><div id="lb"></div>';

function load(){
  const lb=$("lb");
  fetch(API+"/rest/v1/scores?select=tg_id,name,best&order=best.desc&limit=10",{headers:{apikey:KEY}})
    .then(r=>r.json())
    .then(rows=>{
      lb.innerHTML="";
      if(!Array.isArray(rows)||!rows.length){lb.textContent="Пока никого нет. Сыграй в «Ловец» первым.";return;}
      rows.forEach((x,i)=>{
        const d=document.createElement("div");d.className="me";
        const a=document.createElement("span");a.textContent=(i+1)+". "+x.name;
        const b=document.createElement("b");b.textContent=x.best;
        if(me&&x.tg_id===me.id)a.style.color="var(--gold)";
        d.append(a,b);lb.appendChild(d);
      });
    })
    .catch(()=>{lb.textContent="Не удалось загрузить рейтинг";});
}

function sync(){
  if(!me||S.best<=0||S.best===sent)return;
  const v=S.best;
  fetch(API+"/rest/v1/scores?on_conflict=tg_id",{
    method:"POST",
    headers:{apikey:KEY,"Content-Type":"application/json",Prefer:"resolution=merge-duplicates"},
    body:JSON.stringify({tg_id:me.id,name:uname,best:v})
  }).then(r=>{if(r.ok){sent=v;load();}}).catch(()=>{});
}

const baseRender=render;
render=function(){baseRender();sync();};

document.querySelectorAll("nav button").forEach(b=>{
  if(b.dataset.t==="t-top")b.addEventListener("click",load);
});
load();sync();
})();
/* конец */
