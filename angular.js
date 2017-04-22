const scope={};
const watches=[];

const evalInScope=(exp,scope)=>eval(
   Object
    .keys(scope)
    .map(name=>`var ${name} = ${ JSON.stringify(scope[name]) }`)
    .concat(exp)
    .join(';')
);

const run=(exp,scope)=>{
  try{
    return evalInScope(exp,scope);
  } catch (e){

  }
}
const directive = (name,controller)=>{
  document
    .querySelectorAll(`[ ${name} ]`)
    .forEach(elem=>controller(elem, elem.attributes[name].value));
}
const watch = (cb)=>{
  watches.push(cb);
}
const digest=()=>{
  watches.forEach(watch=>watch());
}
directive('ng-model',(elem,key)=>{
  const update= ()=>{
    scope[key]=elem.value || '';
    digest();
  }
  elem.oninput= update;
  update();
  watch(()=>{
    elem.value = scope[key];
  })
});

directive('ng-bind',(elem,key)=>{
  const update=()=>{
    elem.innerText =  scope[key];
  }
  watch(update)
  update();
})
directive('ng-show',(elem,exp)=>{
  watch(()=>{
    elem.style.display = evalInScope(exp,scope) ? 'inherit' : 'none';
  })
})
