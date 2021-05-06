import { fromEvent, from, Observable ,of, interval,concat } from "../node_modules/rxjs/index";
import { debounceTime, map,filter,switchMap,groupBy, mergeMap, reduce, take} from "../node_modules/rxjs/operators/index";

import Igrac from './igraci';
//import {Igrac}  from "igraci";

const API_URL = "http://localhost:3000";

function getPlayersByName(name:string):Observable<Igrac[]>{
  console.log(`fetching a player with name: ${name}`);
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
  label.innerHTML="Player name ";
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
  console.log(`fetching players with score equal then ${value}`);
  return from(
    fetch(`${API_URL}/igraci/?brPoena=${value}`)
    //fetch(`${API_URL}/igraci/?brPoena%3E<${value}`)
      .then((response)=>{
        if(response.ok) return response.json();
        else throw new Error("fetch quantity error");
      }).catch((err)=> console.log(err))
  );
}

function createPlayerSearchBoxByScore(){
  let label=document.createElement("label");
  label.innerHTML="Score  ";
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

// transformation operator groupBy
function showRankings(){
  of(
    { rankings: 1 , lastName: 'Jokic' },
    { rankings: 2 , lastName: 'Davis' },
    { rankings: 3 , lastName: 'Harden' },
    { rankings: 2 , lastName: 'James' },
    { rankings: 3 , lastName: 'Durant' }
  )
    .pipe(
      groupBy(p => p.rankings, p => p.lastName),
      mergeMap(group$ =>
        group$.pipe(reduce((acc, cur) => [...acc, cur], [`${group$.key}`]))
      ),
      map(arr => ({ rankings: parseInt(arr[0], 10), values: arr.slice(1) }))
   )
   .subscribe(p => console.log(p));
}
function showRankings2(){
  let igraci = [ {"brDresa": 23, "name": "Lebron", "lastName": "James" , "brPoena": 265 }];
  igraci.forEach(igrac  => {
    let brDresa= [];
    let i=0;
    brDresa[i]= igrac.brDresa;
    i++;
  });
  let source1 = interval(100).pipe(
    map(  brDresa => "brDresa " + brDresa ),
    take(5)
  );
  
  let source2 = interval(50).pipe(
    map(   brDresa => "brDresa " + brDresa ),
    take(2)
  );
  
  
  let stream$ = concat(
    source1,
    source2
  );
  stream$.subscribe( data => console.log('Concat ' + data));
}
//let igraci = { "brDresa": 23, "name": "Lebron", "lastName": "James" , "brPoena": 265 };
showRankings2();
showRankings();
createPlayerSearchBoxByName();
createPlayerSearchBoxByScore();