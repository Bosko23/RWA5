import { fromEvent, from, Observable } from "../node_modules/rxjs/index";
import {
  debounceTime, map,filter,switchMap,} from "../node_modules/rxjs/operators/index";

import {Igrac} from "/igraci";

const API_URL = "http://localhost:3000";

function getPlayersByName(name:string):Observable<Igrac[]>{
  console.log(`fetching a product with name: ${name}`);
  return from(
    fetch(`${API_URL}/igraci/?name=${name}`)
      .then((response)=>{
        if(response.ok) return response.json();
        else throw new Error("fetch error");
    }).catch((er)=>console.log(er))
  );
}

function createPlayerSearchBoxByName()
{
  const label=document.createElement("label");
  label.innerHTML="Player name "
  document.body.appendChild(label);
  const input=document.createElement("input");
  document.body.appendChild(input);
  fromEvent(input,"input")
    .pipe(
      debounceTime(1000),
      map((ev:InputEvent)=>(<HTMLInputElement>ev.target).value),
      filter((text)=>text.length>=3),
      switchMap((name)=>getPlayersByName(name)),
      map(igraci=>igraci[0])
    ).subscribe((igrac:Igrac)=>showPlayer(igrac));
}

function getPlayerObservableByScore(value:number):Observable<Igrac[]>{
  console.log(`fetching players with score greater then ${value}`);
  return from(
    fetch(`${API_URL}/igraci/?brPoena%3E${value}`)
      .then((response)=>{
        if(response.ok) return response.json();
        else throw new Error("fetch quantity error");
      }).catch((err)=> console.log(err))
  );
}

function createPlayerSearchBoxByScore(){
  let label=document.createElement("label");
  label.innerHTML="Score min ";
  document.body.appendChild(label);
  let input=document.createElement("input");
  input.setAttribute("type","number");
  document.body.appendChild(input);

  fromEvent(input,"input")
    .pipe(
      debounceTime(1000),
      map((ev:InputEvent)=>(<HTMLInputElement>ev.target).value),
      switchMap((value)=>getPlayerObservableByScore(+value)),
    ).subscribe((igraci:Igrac[])=>showProducts(igraci));
}

function showPlayer(igrac:Igrac){
  if(!igrac) return;
  const div=document.createElement("div");
  div.innerHTML=`${igrac.brDresa}, ${igrac.name}, ${igrac.lastName}, ${igrac.brPoena}`;
  document.body.appendChild(div);
}

function showProducts(igraci:Igrac[]){
  if(!igraci) return;
  let div;
  igraci.forEach(igrac  => {
    div=document.createElement("div");
    div.innerHTML=`${igrac.brDresa}, ${igrac.name}, ${igrac.lastName}, ${igrac.brPoena}`;
    document.body.appendChild(div);
  });
}

createPlayerSearchBoxByName();
createPlayerSearchBoxByScore();