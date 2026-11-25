export function game(a:string,b:string){
  const letters=(s:string)=>Array.from(s).map((c,i)=>({c:c.toLowerCase(),i})).filter(x=>/\p{L}/u.test(x.c));
  const upper=letters(a), lower=letters(b), used=new Set<number>(), pairs:number[][]=[];
  if(!upper.length || !lower.length) throw Error("MALE_NAME and FEMALE_NAME must each contain a letter.");
  for(const x of upper){
    const y=lower.find(y=>y.c===x.c && !used.has(y.i));
    if(y){used.add(y.i); pairs.push([x.i,y.i]);}
  }
  const count=upper.length+lower.length-2*pairs.length;
  const alive=[0,1,2,3,4,5], order:number[]=[];
  let cursor=0;
  while(count && alive.length>1){
    cursor=(cursor+count-1)%alive.length;
    order.push(...alive.splice(cursor,1));
  }
  return {pairs,count,order,winner:count?alive[0]:null};
}
