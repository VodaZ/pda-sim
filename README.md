The aim of is project was to create function which tells, whether string is accepted by PDA or not.

!! This project is was tested in Ramda REPL (https://ramdajs.com/repl)


PDA definition
----

P = (Q, Σ, Γ, δ, q0, Z0, F)

where:

* Q ... finite set of states
* Σ ... input alphabet: finite set of input symbols
* Γ ... stack alphabet: finite set of stack symbols
* δ ... transfer function: subset of Q x (Σ U {ε}) x Γ &rarr; 2^(Q x Γ*)
* q0 ... initial state (q0 is element of Q)
* Z0 ... initial stack symbol (Z0 is element of Γ)
* F ... accepting states: subset of Q

Definition used in project
----
We need to define

* δ (in code as rawδ)
* q0
* Z0
* F

Q, Σ, and Γ can be determined from δ.

In code, rawδ is defined as array of rules, for example: 

```javascript
const rawδ = [
  ['q0','#','#','q1',['#']],
  ['q0','2','Z1','q0',['Z1','Z2']],
  ['q1','0','Z1','q1',['Z1']]
];
```

Where rule is also array. From left:

* state to start from
* symbol to read from input (ε marks no symbol read)
* symbol to read from stack
* state to move to
* symbols to be added to stack (stack bottom is considered to be on right)

(Non)accepted string
----

Function *makeM*, when supplied with propper parameters, creates function which represents PDA. 

```javascript
const M = makeM(δ, q0, Z0, Fi);
```

When the returned function is called with string, it prints out reduction data to console and whether the string was accepted or not. 

```javascript
M('00102#11100')
```

results in:

```
(q0, 00102#11100, #)     
 |- (q0, 0102#11100, #)      δ(q0, 0, #) = (q0, [#])
 |- (q0, 102#11100, #)       δ(q0, 0, #) = (q0, [#])
 |- (q0, 02#11100, Z1#)      δ(q0, 1, #) = (q0, [Z1, #])
 |- (q0, 2#11100, Z1#)       δ(q0, 0, Z1) = (q0, [Z1])
 |- (q0, #11100, Z1Z2#)      δ(q0, 2, Z1) = (q0, [Z1, Z2])
 |- (q1, 11100, Z1Z2#)       δ(q0, #, Z1) = (q1, [Z1])
 |- (q1, 1100, Z2#)          δ(q1, 1, Z1) = (q1, [ε])
 |- (q1, 100, Z1#)           δ(q1, 1, Z2) = (q1, [Z1])
 |- (q1, 00, #)              δ(q1, 1, Z1) = (q1, [ε])
 |- (qf, 00, #)              δ(q1, ε, #) = (qf, [#])
 |- (qf, 0, #)               δ(qf, 0, #) = (qf, [#])
 |- (qf, , #)                δ(qf, 0, #) = (qf, [#])
 
String 00102#11100 was accepted
```

There you can see configurations of PDA, individual reduction steps and rules used in reduction.