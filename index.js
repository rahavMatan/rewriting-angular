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

scope.items= [1,2,3,4,5,6];

directive('ng-repeat',(exp,elem)=>{
  var _in = ' in ';
  var index = exp.indexOf(_in)+_in.length;
  var collection = evalInScope(exp.slice(index), scope);
  var parent = elem.parentElement;
  elem.innerText = collection[0];
  for(var i =1;i<collection.length;i++){
    var child = document.createElement(elem.localName);
    child.innerText = collection[i];
    parent.appendChild(child);
  }

})
directive('ng-if',(exp,elem)=>{
  let parent = elem.parentElement;
  const update = ()=>{
    if(evalInScope(exp,scope)){
      parent.appendChild(elem);
    } else {
      parent.removeChild(elem);
    }
  }
  update();
  watch(exp,update)
})
