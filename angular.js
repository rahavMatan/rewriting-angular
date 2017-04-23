const scope={};
const watches=[];

const evalInScope=(exp,scope)=>{
   try{
    return eval(
     Object
      .keys(scope)
      .map(name=>`var ${name} = ${ JSON.stringify(scope[name]) }`)
      .concat(exp)
      .join(';')
    );
  } catch(e){
    console.log(e);
  }
}

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
const watch = (exp,cb)=>{
  watches.push({exp, cb, last:evalInScope(exp, scope)});
}
const digestOnce=()=>{
  let changed = false;
  watches.forEach(watch=>{
    const {exp, cb, last} =  watch;
    var curr = evalInScope(exp, scope)
    if(curr !== last){
      cb();
      watch.last=curr;
      changed=true;
    }
  });
  return changed;
}
const digest=()=>{
  let changed = true;
  let loops=10;
  while(digestOnce() && loops){
    loops--;
  }
  if(!loops){
    console.log('too many digest loops');
  }

}
directive('ng-model',(elem,key)=>{
  const update= ()=>{
    scope[key]=elem.value || '';
    digest();
  }
  elem.oninput= update;
  update();
  watch(key,()=>{
    elem.value = scope[key];
  })
});

directive('ng-bind',(elem,exp)=>{
  const update=()=>{
    elem.innerText =  evalInScope(exp,scope);
  }
  watch(exp,update)
  update();
})
directive('ng-show',(elem,exp)=>{
  watch(exp, ()=>{
    elem.style.display = evalInScope(exp,scope) ? 'inherit' : 'none';
  })
})
watch('age',()=>{
  console.log('age: '+ scope.age );
  scope.retirement = parseInt(scope.age) + 12;
})
watch('retirement',()=>{
  console.log('retirement '+ scope.retirement);
  scope.age = parseInt(scope.age)+5;
})
