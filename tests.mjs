import assert from 'node:assert/strict';
import {game} from './lib/game.ts';
const sam=game('SAM RANJITH PAUL S','BINUSHA B');
assert.deepEqual([sam.count,sam.order,sam.winner],[11,[4,5,2,0,1],3]);
assert.deepEqual(game('Amit','Anita').order,[2,5,3,1,4]);
assert.deepEqual(game('Aaa','A').pairs,[[0,0]]);
assert.equal(game('Ann','Ann').winner,null);
assert.deepEqual(game('X- A',' a2').pairs,[[3,1]]);
assert.equal(game('A'.repeat(80),'B').count,81);
