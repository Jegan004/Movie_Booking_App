import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';
 
Object.assign(global, { TextEncoder, TextDecoder });
import { fn } from 'jest-mock';

global.alert = fn();
