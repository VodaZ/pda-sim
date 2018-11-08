console.clear();

const ε = 'ε';

const myUntil = (cond, f, data) => {
  let state = data;
  
  while(cond(state)) {
    state = f(state);
  };
    
  return state;
};

const d = ([q_from, a, popped, q_to, pushed]) => ({q_from, a, popped, q_to, pushed});

const findδ = (δ, q, a, stackTop) => filter(o => o.q_from === q && (o.a === a || o.a === ε) && o.popped === stackTop)(δ);

const configToStr = conf => {  
  const q = conf.c[0];
  const i = conf.c[1];
  const s = conf.c[2];
  
  const confStr = `(${q}, ${i}, ${s})`;
  
  return {
    c: confStr,
    r: conf.r
  };
};

const getRuleString = rule => `δ(${rule.q_from}, ${rule.a}, ${rule.popped}) = (${rule.q_to}, [${rule.pushed.join(', ')}])`;

const appendRuleInfo = configs => {
  const strings = pluck('c', configs);
  const maxLen = pipe(
    map(prop('length')),
    a => Math.max(...a)
  )(strings) + 5;
  
  return map(config => {
    const l = config.c.length;
    const toFill = maxLen - l;
    const filling = ' '.repeat(toFill);
    
    const appended = config.r ? getRuleString(config.r) : '';

    return config.c + filling + appended;
  }, configs);
  
};
 
const getConfigStr = state => {
  return pipe(
    prop('configurations'),
    map(configToStr),
    appendRuleInfo,
    join('\n |- ')
  )(state);
};

const makeM = (δ, q0, Z0, F) => w => {  
  const initialState = {
    currentQ: q0,
    input: w.split(''),
    stack: [Z0],
    configurations: [{c: [q0, w, Z0]}],
    noWay: false
  };
          
  const cond = state => state.noWay === false && (state.input.length !== 0 || state.stack.length !== 0);
  const f = state => {        
    const stackTop = head(state.stack);
    const restOfStack = tail(state.stack);
    const a = pipe(
      head,
      defaultTo('ε')
    )(state.input);
    const currentQ = state.currentQ;
        
    const canGoTo = findδ(δ, currentQ, a, stackTop);
        
    console.assert(canGoTo.length <= 1, '|δ| > 1', {canGoTo,state});
     
    if(canGoTo.length !== 1) {
      return {
        ...state,
        noWay: true
      };
    }
    
    const willGoTo = head(canGoTo);
    const stackAddition = reject(equals(ε), willGoTo.pushed);
    const newStack = concat(stackAddition, restOfStack);
    const newQ = willGoTo.q_to;
    const newInput = willGoTo.a === 'ε' ? state.input : tail(state.input);
    
    const newConfiguration = {
      c: [newQ, newInput.join(''), newStack.join('')],
      r: willGoTo
    };
    const newConfigurations = append(newConfiguration, state.configurations)
            
    return {
      currentQ: newQ,
      input: newInput,
      stack: newStack,
      noWay: false,
      configurations: newConfigurations
    };
  };

  const result = myUntil(cond, f, initialState);
      
  const confStr = getConfigStr(result);
  console.log(confStr);
  
  const wasAccepted = state => state.input.length === 0 && contains(state.currentQ, F);
  const boolResult = wasAccepted(result);
  
  if(boolResult) {
    console.log('%cString ' + w + ' was accepted', 'color: green; font-size: 2em');
  }
  else {
    console.log('%cString "' + w + '" wasn\'t accepted', 'color: red; font-size: 2em');
  }
  
  return boolResult;
};

////////// DEFINITION /////////
const rawδ = [['q0','ε','#','',[]],
  ['q0','#','#','q1',['#']],
  ['q0','0','#','q0',['#']],
  ['q0','1','#','q0',['Z1','#']],
  ['q0','2','#','q0',['Z2', '#']],
  ['q0','ε','Z1','',[]],
  ['q0','#','Z1','q1',['Z1']],
  ['q0','0','Z1','q0',['Z1']],
  ['q0','1','Z1','q0',['Z2']],
  ['q0','2','Z1','q0',['Z1','Z2']],
  ['q0','ε','Z2','',[]],
  ['q0','#','Z2','q1',['Z2']],
  ['q0','0','Z2','q0',['Z2']],
  ['q0','1','Z2','q0',['Z1','Z2']],
  ['q0','2','Z2','q0',['Z2','Z2']],
  ['q1','ε','#','qf',['#']],
  ['q1','#','#','',[]],
  ['q1','0','#','',[]],
  ['q1','1','#','',[]],
  ['q1','2','#','',[]],
  ['q1','ε','Z1','',[]],
  ['q1','#','Z1','',[]],
  ['q1','0','Z1','q1',['Z1']],
  ['q1','1','Z1','q1',['ε']],
  ['q1','2','Z1','q2',['ε']],
  ['q1','ε','Z2','',[]],
  ['q1','#','Z2','',[]],
  ['q1','0','Z2','q1',['Z2']],
  ['q1','1','Z2','q1',['Z1']],
  ['q1','2','Z2','q1',['ε']],
  ['q2','ε','#','',[]],
  ['q2','#','#','',[]],
  ['q2','0','#','',[]],
  ['q2','1','#','',[]],
  ['q2','2','#','',[]],
  ['q2','ε','Z1','',[]],
  ['q2','#','Z1','',[]],
  ['q2','0','Z1','',[]],
  ['q2','1','Z1','',[]],
  ['q2','2','Z1','',[]],
  ['q2','ε','Z2','q1',['Z1']],
  ['q2','#','Z2','',[]],
  ['q2','0','Z2','',[]],
  ['q2','1','Z2','',[]],
  ['q2','2','Z2','',[]],
  ['qf','ε','#','',[]],
  ['qf','#','#','',[]],
  ['qf','0','#','qf',['#']],
  ['qf','1','#','',[]],
  ['qf','2','#','',[]],
  ['qf','ε','Z1','',[]],
  ['qf','#','Z1','',[]],
  ['qf','0','Z1','',[]],
  ['qf','1','Z1','',[]],
  ['qf','2','Z1','',[]],
  ['qf','ε','Z2','',[]],
  ['qf','#','Z2','',[]],
  ['qf','0','Z2','',[]],
  ['qf','1','Z2','',[]],
  ['qf','2','Z2','',[]]];
 
const δ = pipe(
  map(d),
  filter(prop('q_to'))
)(rawδ);

const q0 = 'q0';
const Z0 = '#';
const Fi = ['qf'];

const get = n => pipe(
  map(nth(n)),
  uniq
)(rawδ);

const Q = get(0);
const Σ = get(1)
const Γ = get(2);

//////////

const M = makeM(δ, q0, Z0, Fi);

M('00102#11100')
                                             