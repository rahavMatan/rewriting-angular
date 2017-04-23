const scope ={};
const watches = [];
const evalInScope = (exp, scope)=>{
  try {
     return eval(
       Object.keys(scope)
       .map(key => `var ${key} = ${JSON.stringify(scope[key])}`)
       .concat(exp)
       .join(';'))
  } catch(e){

  }
}

const watch=(exp,cb)=>{
  watches.push( {exp, cb, last: evalInScope(exp, scope) })
}

const digestOnce=()=>{
  let changed = false;
  watches.forEach(watch=>{
    const {exp,cb, last} = watch;
    var curr = evalInScope(exp, scope);
    if(curr !== last){
      cb();
      changed=true;
      watch.last = curr;
    }
  })
  return changed;
}

const digest=()=>{
  let loops=10;
  while(digestOnce() && loops){
    loops--;
  }
  if(!loops){
    console.log("too man loops runnig");
  }
}

const directive = (name, controller)=>{
  document.querySelectorAll(`[${name}]`)
  .forEach(elem=>{
    controller(elem.attributes[name].value, elem);
  })

}
directive('ng-model',(exp, elem)=>{
  const update = ()=>{
    scope[exp] = elem.value || '';
    digest();
  }
  elem.oninput = update;
  update();
  watch(exp, ()=>{
    elem.value =  scope[exp];
  })

})

directive('ng-bind',(exp,elem)=>{
  const update = ()=>{
    elem.innerText = evalInScope(exp,scope) || '';
  }
  update();
  watch(exp,update);
})

directive('ng-show',(exp,elem)=>{

  const update = ()=>{
    elem.style.display = evalInScope(exp,scope)?'inherit' : 'none';
  }
  update();
  watch(exp,update);
})
