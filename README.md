!! This is just and hobby project intended to run in Ramda REPL (https://ramdajs.com/repl) !!
====

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
